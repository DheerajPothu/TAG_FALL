import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";

const Card = ({
  category,
  company,
  date,
  day,
  displayImgSrc,
  fileType,
  id,
  season,
  sessionId,
  src,
  tags: initialTags,
  title,
  favorite: initialFavorite, // Use favorite from props
  onUpdate,
  onToggleFavorite
}) => {
  const [tags, setTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [isEditing, setIsEditing] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [editNewTag, setEditNewTag] = useState("");
  const [favorite, setFavorite] = useState(initialFavorite);

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleEditChange = (event) => {
    setEditNewTag(event.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      const object = { ...itemData, tags: updatedTags };
      onUpdate({ id, object });
    }
  };

  const handleEditTag = (index) => {
    if (editNewTag.trim()) {
      const updatedTags = [...tags];
      updatedTags[index] = editNewTag.trim();
      setTags(updatedTags);
      setEditNewTag("");
      const object = { ...itemData, tags: updatedTags };
      onUpdate({ id, object });
      setIsEditing(null);
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    const object = { ...itemData, tags: updatedTags };
    onUpdate({ id, object });
  };

  const handleToggleFavorite = () => {
    setFavorite((prev) => !prev);
    onToggleFavorite();
    const object = { ...itemData, favorite: !favorite };
    onUpdate({ id, object });
  };

  const itemData = {
    category,
    company,
    date,
    day,
    displayImgSrc,
    fileType,
    id,
    season,
    sessionId,
    src,
    tags,
    title,
  };

  const renderMedia = () => {
    if (fileType === "jpg" || fileType === "png") {
      return ;
    } else if (fileType === "mp3" || fileType === "wav") {
      return (
        <audio controls className="w-full h-20">
          <source src={src} type={`audio/${fileType}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (fileType === "mp4" || fileType === "mov") {
      return (
        <video controls className="w-full h-40">
          <source src={src} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === "pdf") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">View PDF</button>
        </a>
      );
    } else if (fileType === "ppt" || fileType === "pptx") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-green-500 text-white px-4 py-2 rounded">View PPT</button>
        </a>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 relative"> {/* Make the container relative for positioning */}
      <img
        src={displayImgSrc}
        alt={title}
        className="w-full h-40 object-cover rounded"
      />
      {/* Favorite Icon */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 p-1 rounded-full bg-white shadow"
        aria-label="Toggle Favorite"
      >
        <FiHeart className={`w-6 h-6 ${favorite ? 'text-red-500' : 'text-gray-400'}`} />
      </button>
      <div className="media-container mb-4">
        {renderMedia()} {/* Conditionally render image, audio, video, or link */}
      </div>
      <div className="card-content">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm">Season: {season}</p>
        <p className="text-sm">Day: {day}</p>
        <p className="text-sm">Date: {date}</p>
        {/* Tags Section */}
        <div className="tag-box border-gray-300 pl-0 p-2 pt-0 rounded-lg">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="tag-item flex items-center justify-between mb-2 bg-gray-100 p-1 rounded-lg hover:bg-gray-200 transition mx-1"
            >
              {isEditing === index ? (
                <input
                  value={editNewTag}
                  onChange={handleEditChange}
                  className="border border-gray-300 rounded p-1 flex-grow"
                />
              ) : (
                <span
                  onClick={() => {
                    setIsEditing(index);
                    setEditNewTag(tag);
                  }}
                  className="cursor-pointer hover:text-blue-500 text-sm px-1"
                >
                  {tag}
                </span>
              )}
              {isEditing === index ? (
                <button
                  onClick={() => handleEditTag(index)} // Update existing tag
                  className="text-red-500 ml-2 hover:bg-red-100 rounded-full p-1 transition"
                  aria-label="Tick"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600" // Adjust the color as needed
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12l5 5L20 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="text-red-500 ml-2 hover:bg-red-100 rounded-full p-1 transition"
                  aria-label="Delete tag"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 4a1 1 0 00-1 1v1H4a1 1 0 000 2h1v8a2 2 0 002 2h6a2 2 0 002-2v-8h1a1 1 0 000-2h-3V5a1 1 0 00-1-1H8zm0 2h4v1H8V6z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Add a new tag"
              className="border border-gray-300 rounded p-1 flex-grow mr-1"
            />
            <button
              onClick={handleAddTag} // Add new tag
              className="bg-blue-500 text-white rounded  p-1 hover:bg-blue-600"
              aria-label="Add Tag"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
