import React, { useState, useEffect, useRef } from "react";
import { FiHeart } from "react-icons/fi";
import axios from "axios";

const Nav = ({ handleInputChange, query, onToggleFavoriteFilter, showFavorites }) => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [formData, setFormData] = useState({
    src: null,
    displayImgSrc: null,
    title: "",
    season: "",
    day: "",
    date: "",
    company: "",
    category: "",
    playlist: "",
    tags: [],
    fileType: "",
    sessionId: localStorage.getItem("sessionId") || "initial",
    favorite: false,
  });
  const [tagInput, setTagInput] = useState("");
  const popupRef = useRef(null);

  const toggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowUploadPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef]);

  const handleInputChangePopup = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length) {
      const file = files[0];
      const fileType = file.name.split('.').pop(); 
  
      setFormData((prev) => ({
        ...prev,
        [name]: file, 
        fileType: name === 'src' ? fileType : prev.fileType, 
      }));
    }
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Create FormData object for file and text data
    const uploadData = new FormData();
    if (formData.src) uploadData.append("src", formData.src);  // Append src file
    if (formData.displayImgSrc) uploadData.append("displayImgSrc", formData.displayImgSrc); // Append display image file
    uploadData.append("title", formData.title);
    uploadData.append("season", formData.season);
    uploadData.append("day", formData.day);
    uploadData.append("date", formData.date);
    uploadData.append("company", formData.company);
    uploadData.append("category", formData.category);
    uploadData.append("playlist", formData.playlist);
    uploadData.append("fileType", formData.fileType || "unknown");
    uploadData.append("sessionId", localStorage.getItem("sessionId"));
    uploadData.append("favorite", formData.favorite);

    // Append tags array as individual entries
    formData.tags.forEach((tag) => {
      uploadData.append("tags", tag);
    });
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data.message);
      setShowUploadPopup(false);
      window.location.reload();
      // Reset form data after upload
      setFormData({
        src: null,
        displayImgSrc: null,
        title: "",
        season: "",
        day: "",
        date: "",
        company: "",
        category: "",
        playlist: "",
        tags: [],
        fileType: "",
        sessionId: localStorage.getItem("sessionId") || "initial",
        favorite: false,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="flex space-x-4">
        <input
          className="p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Type to search"
        />
      </div>
      <div className="flex space-x-4 items-center">
        <button 
          onClick={onToggleFavoriteFilter} 
          className={`text-gray-500 hover:text-gray-700 ${showFavorites ? 'text-red-500' : ''}`}
          aria-label="Toggle favorites"
        >
          <FiHeart className={`w-6 h-6 ${showFavorites ? 'fill-current' : ''}`} />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={toggleUploadPopup}
        >
          Upload
        </button>
        {showUploadPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              ref={popupRef}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={toggleUploadPopup}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">Upload Item</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                {/* Remaining input fields */}
                <div className="mb-4">
                  <label className="block text-gray-700">Company:</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Day:</label>
                  <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Playlist:</label>
                  <input
                    type="text"
                    name="playlist"
                    value={formData.playlist}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Season:</label>
                  <input
                    type="text"
                    name="season"
                    value={formData.season}
                    onChange={handleInputChangePopup}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Tags:</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-200 text-blue-800 py-1 px-3 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">File for Display Image:</label>
                  <input
                    type="file"
                    name="displayImgSrc"
                    onChange={handleFileChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">File for Actual Source:</label>
                  <input
                    type="file"
                    name="src"
                    onChange={handleFileChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
