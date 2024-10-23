import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from data import data  # Import the data from data.py

app = Flask(__name__)
CORS(app)

def get_db_connection(db_name='sqlLite.db'):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('DROP TABLE IF EXISTS uploads')

    c.execute('''CREATE TABLE IF NOT EXISTS uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        src TEXT,
        displayImgSrc TEXT,
        title TEXT,
        season TEXT,
        day TEXT,
        date TEXT,
        company TEXT,
        category TEXT,
        playlist TEXT,
        fileType TEXT,
        tags TEXT,
        sessionId TEXT
    )''')

    conn.commit()
    conn.close()

def populate_db():
    conn = get_db_connection()
    c = conn.cursor()

    for item in data:
        # Directly use item attributes without checking the source type
        src = item.get("src")  # Assuming a unified 'src' key is now used
        displayImgSrc = item.get("displayImgSrc")
        title = item.get("title")
        season = item.get("season") or ""
        day = item.get("day") or ""
        date = item.get("date") or ""
        company = item.get("company")
        category = item.get("category") or ""
        playlist = item.get("playlist") or ""
        fileType = item.get("fileType") or "unknown"  # Default if not provided
        tags = ",".join(item.get("tags", []))  # Convert tags list to a string
        sessionId = item.get("sessionId") or "initial"

        c.execute('''
            INSERT INTO uploads (src, displayImgSrc, title, season, day, date, company, category, playlist, fileType, tags, sessionId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            src,
            displayImgSrc,
            title,
            season,
            day,
            date,
            company,
            category,
            playlist,
            fileType,
            tags,
            sessionId
        ))

    conn.commit()
    conn.close()

@app.route('/data', methods=['GET'])
def get_data():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('SELECT * FROM uploads')
    uploads = c.fetchall()

    conn.close()

    # Convert query results to dictionaries
    uploads_list = [{
        "id": row["id"],
        "src": row["src"],
        "title": row["title"],
        "season": row["season"],
        "day": row["day"],
        "date": row["date"],
        "company": row["company"],
        "category": row["category"],
        "playlist": row["playlist"],
        "fileType": row["fileType"],
        "tags": row["tags"].split(",") if row["tags"] else [],  # Convert string back to list
        "sessionId": row["sessionId"],
        "displayImgSrc": row["displayImgSrc"]  # Add display image source
    } for row in uploads]

    return jsonify({"uploads": uploads_list})

@app.route('/upload', methods=['POST'])
def upload_item():
    data = request.json
    src = data.get('src')
    title = data.get('title')
    season = data.get('season')
    day = data.get('day')
    date = data.get('date')
    company = data.get('company')
    category = data.get('category')
    playlist = data.get('playlist')
    tags = ",".join(data.get('tags', []))  # Convert tags list to a string
    sessionId = data.get('sessionId')
    displayImgSrc = data.get('displayImgSrc')
    fileType = data.get('fileType') or "unknown"  # Default if not provided

    conn = get_db_connection()
    c = conn.cursor()

    c.execute('''
        INSERT INTO uploads (src, displayImgSrc, title, season, day, date, company, category, playlist, fileType, tags, sessionId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        src,
        displayImgSrc,
        title,
        season or "",
        day or "",
        date or "",
        company,
        category or "",
        playlist or "",
        fileType,
        tags,
        sessionId or "initial"  # Include sessionId if provided
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Item uploaded successfully"}), 201

@app.route('/update/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    title = data.get('title')
    season = data.get('season')
    day = data.get('day')
    date = data.get('date')
    category = data.get('category')
    playlist = data.get('playlist')
    tags = ",".join(data.get('tags', []))  # Convert tags list to a string
    sessionId = data.get('sessionId')
    displayImgSrc = data.get('displayImgSrc')

    conn = get_db_connection()
    c = conn.cursor()

    # Update the record in the uploads table based on the item_id
    c.execute('''
        UPDATE uploads
        SET title = ?, season = ?, day = ?, date = ?, category = ?, playlist = ?, tags = ?, sessionId = ?, displayImgSrc = ?
        WHERE id = ?
    ''', (title, season, day, date, category, playlist, tags, sessionId, displayImgSrc, item_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Item updated successfully"}), 200

if __name__ == '__main__':
    init_db()
    populate_db()
    app.run(port=5004, debug=True)
