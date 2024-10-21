import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from data import data  # Import the data from data.py

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('DROP TABLE IF EXISTS photos')
    c.execute('DROP TABLE IF EXISTS music')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            img TEXT,
            title TEXT,
            season TEXT,
            day TEXT,
            date TEXT,
            company TEXT,
            category TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS music (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            img TEXT,
            title TEXT,
            company TEXT,
            playlist TEXT,
            audioSrc TEXT
        )
    ''')
    conn.commit()
    conn.close()

def populate_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    for item in data:
        if item.get("company") == "Photos":
            c.execute('''
                INSERT INTO photos (img, title, season, day, date, company, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (item.get("img"), item.get("title"), item.get("season"), item.get("day"), item.get("date"), item.get("company"), item.get("category")))
        elif item.get("company") == "Music":
            c.execute('''
                INSERT INTO music (img, title, company, playlist, audioSrc)
                VALUES (?, ?, ?, ?, ?)
            ''', (item.get("img"), item.get("title"), item.get("company"), item.get("playlist"), item.get("audioSrc")))
    conn.commit()
    conn.close()

@app.route('/data', methods=['GET'])
def get_data():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Get photos
    c.execute('''
        SELECT id, img, title, season, day, date, company, category FROM photos
    ''')
    photos = c.fetchall()
    
    # Get music
    c.execute('''
        SELECT id, img, title, company, playlist, audioSrc FROM music
    ''')
    music = c.fetchall()
    
    conn.close()
    
    # Convert query results to dictionaries
    photos_list = [{"id": row["id"], "img": row["img"], "title": row["title"], "season": row["season"], "day": row["day"], "date": row["date"], "company": row["company"], "category": row["category"]} for row in photos]
    music_list = [{"id": row["id"], "img": row["img"], "title": row["title"], "company": row["company"], "playlist": row["playlist"], "audioSrc": row["audioSrc"]} for row in music]
    
    return jsonify({
        "photos": photos_list,
        "music": music_list
    })

@app.route('/update/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    title = data.get('title')
    season = data.get('season')
    day = data.get('day')
    date = data.get('date')
    category = data.get('category')
    playlist = data.get('playlist')
    audioSrc = data.get('audioSrc')

    conn = get_db_connection()
    c = conn.cursor()

    # Determine if the item is in photos or music table
    c.execute('SELECT company FROM photos WHERE id = ?', (item_id,))
    company = c.fetchone()
    
    if company:
        # Update in photos table
        c.execute('''
            UPDATE photos
            SET title = ?, season = ?, day = ?, date = ?, category = ?
            WHERE id = ?
        ''', (title, season, day, date, category, item_id))
    else:
        # Check in music table
        c.execute('SELECT company FROM music WHERE id = ?', (item_id,))
        company = c.fetchone()
        
        if company:
            # Update in music table
            c.execute('''
                UPDATE music
                SET title = ?, playlist = ?, audioSrc = ?
                WHERE id = ?
            ''', (title, playlist, audioSrc, item_id))
        else:
            conn.close()
            return jsonify({"message": "Item not found"}), 404

    conn.commit()
    conn.close()

    return jsonify({"message": "Item updated successfully"}), 200

if __name__ == '__main__':
    init_db()
    populate_db()
    app.run(port=5004, debug=True)