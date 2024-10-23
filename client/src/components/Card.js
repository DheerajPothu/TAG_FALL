/* import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ img, title, season, day, date, id, category, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedSeason, setEditedSeason] = useState(season);
    const [editedDay, setEditedDay] = useState(day);
    const [editedDate, setEditedDate] = useState(date);
    const [editedCategory, setEditedCategory] = useState(category);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        axios.put(`http://127.0.0.1:5004/update/${id}`, {
            title: editedTitle,
            season: editedSeason,
            day: editedDay,
            date: editedDate,
            category: editedCategory
        })
            .then(response => {
                console.log('Item updated:', response.data);
                // Notify parent component about the update
                if (onUpdate) onUpdate(response.data);
            })
            .catch(error => console.error('Error updating item:', error));
    };

    return (
        <section className="card">
            <img src={img} alt={title} className="card-img" />
            <div className="card-details">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            className="card-title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="card-season"
                            value={editedSeason}
                            onChange={(e) => setEditedSeason(e.target.value)}
                        />
                        <input
                            type="text"
                            className="card-day"
                            value={editedDay}
                            onChange={(e) => setEditedDay(e.target.value)}
                        />
                        <input
                            type="text"
                            className="card-date"
                            value={editedDate}
                            onChange={(e) => setEditedDate(e.target.value)}
                        />

                        <input
                            type="text"
                            className="card-category"
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <h3 className="card-title">{editedTitle}</h3>
                        <p className="card-season">{editedSeason}</p>
                        <p className="card-day">{editedDay}</p>
                        <p className="card-date">{editedDate}</p>

                        <button onClick={handleEdit}>Edit</button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Card; */

// code till sprint 1 
/*  import React, { useState } from "react";

const Card = ({ img, title, season, day, date, category, company, id, onUpdate }) => {
  const [tags, setTags] = useState(category ? category.split(",") : []); // Initialize with existing categories
  const [isEditing, setIsEditing] = useState(null); // Track which tag is being edited
  const [newTag, setNewTag] = useState(""); // For adding new tags

  // Function to handle changes to an existing tag
const handleTagChange = (index, event) => {
    const updatedTags = [...tags];
    updatedTags[index] = event.target.value; // Update the tag at the specific index
    setTags(updatedTags);
};

  // Function to save the tag after editing
const handleTagSave = (index) => {
    setIsEditing(null); // Exit editing mode
    const updatedCategory = tags.join(","); // Join the updated tags back into a string
    onUpdate({ id, category: updatedCategory }); // Notify the parent component
};

  // Function to handle new tag input change
const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
};

  // Function to add a new tag
const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]); // Add new tag to the list
      setNewTag(""); // Reset the input field
      const updatedCategory = [...tags, newTag.trim()].join(","); // Update category with new tag
      onUpdate({ id, category: updatedCategory }); // Notify parent component
    }
};

  // Function to delete a tag
const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index); // Remove the tag at the specific index
    setTags(updatedTags);
    const updatedCategory = updatedTags.join(","); // Update category after deleting the tag
    onUpdate({ id, category: updatedCategory }); // Notify parent component
};

return (
    <div className="card">
    <img src={img} alt={title} />
    <div className="card-content">
        <h3>{title}</h3>
        <p>Season: {season}</p>
        <p>Day: {day}</p>
        <p>Date: {date}</p>
        <p>Company: {company}</p>

        {/* Tag Display and Editing */ /*}---------------------------------
        <div className="tag-box">
        {tags.map((tag, index) => (
            <div className="tag" key={index}>
            {isEditing === index ? (
                <input
                type="text"
                value={tag}
                  onChange={(e) => handleTagChange(index, e)} // Handle tag changes
                  onBlur={() => handleTagSave(index)} // Save on blur
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleTagSave(index); // Save on Enter key
                }}
                autoFocus
                />
            ) : (
                <>
                  <span onClick={() => setIsEditing(index)}>{tag}</span> {/* Click to edit tag */ /*}--------------------
                  <button onClick={() => handleDeleteTag(index)}>x</button> {/* Delete tag */ /*}----------------
                </>
            )}
            </div>
        ))}

          {/* Input for Adding New Tags */  /*}---------------------
        <div className="new-tag">
            <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            placeholder="Add new tag"
            />
            <button onClick={handleAddTag}>Add</button> {/* Button to add a new tag */  /*}---------
        </div>
        </div>
    </div>
    </div>
);
};

export default Card; ------------------------------*/

// testing code

import React, { useState } from "react";

const Card = ({ img, title, season, day, date, category, company, id, onUpdate }) => {
  const [tags, setTags] = useState(category ? category.split(",") : []); // Initialize with existing categories
  const [isEditing, setIsEditing] = useState(null); // Track which tag is being edited
  const [newTag, setNewTag] = useState(""); // For adding new tags

  // Function to handle changes to an existing tag
const handleTagChange = (index, event) => {
    const updatedTags = [...tags];
    updatedTags[index] = event.target.value; // Update the tag at the specific index
    setTags(updatedTags);
};

  // Function to save the tag after editing
const handleTagSave = (index) => {
    setIsEditing(null); // Exit editing mode
    const updatedCategory = tags.join(","); // Join the updated tags back into a string
    onUpdate({ id, category: updatedCategory }); // Notify the parent component
};

  // Function to handle new tag input change
const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
};

  // Function to add a new tag
const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]); // Add new tag to the list
      setNewTag(""); // Reset the input field
      const updatedCategory = [...tags, newTag.trim()].join(","); // Update category with new tag
      onUpdate({ id, category: updatedCategory }); // Notify parent component
    }
};

  // Function to delete a tag
const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index); // Remove the tag at the specific index
    setTags(updatedTags);
    const updatedCategory = updatedTags.join(","); // Update category after deleting the tag
    onUpdate({ id, category: updatedCategory }); // Notify parent component
};

return (
    <div className="card">
    <img src={img} alt={title} />
    <div className="card-content">
        <h3>{title}</h3>
        <p>Season: {season}</p>
        <p>Day: {day}</p>
        <p>Date: {date}</p>
        <p>Company: {company}</p>

        {/* Tag Display and Editing */ }
        <div className="tag-box">
        {tags.map((tag, index) => (
            <div className="tag" key={index}>
            {isEditing === index ? (
                <input
                type="text"
                value={tag}
                  onChange={(e) => handleTagChange(index, e)} // Handle tag changes
                  onBlur={() => handleTagSave(index)} // Save on blur
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleTagSave(index); // Save on Enter key
                }}
                autoFocus
                />
            ) : (
                <>
                  <span onClick={() => setIsEditing(index)}>{tag}</span> {/* Click to edit tag */ }
                  <button onClick={() => handleDeleteTag(index)}>x</button> {/* Delete tag */ }
                </>
            )}
            </div>
        ))}

          {/* Input for Adding New Tags */  }
        <div className="new-tag">
            <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            placeholder="Add new tag"
            />
            <button onClick={handleAddTag}>Add</button> {/* Button to add a new tag */  }
        </div>
        </div>
    </div>
    </div>
);
};

export default Card;