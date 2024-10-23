import { FiHeart } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const Nav = ({ handleInputChange, query }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    file: null,
  });

  const popupRef = useRef(null);

  // Toggle popup open and close
  const handleTogglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Handle clicking outside of the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  // Handle tag input
  const handleTagInput = (e) => {
    setInputTag(e.target.value);
  };

  // Add a tag to the list
  const addTag = () => {
    if (inputTag.trim() !== "") {
      setTags([...tags, inputTag]);
      setInputTag("");
    }
  };

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission (simulate storing the file)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData, tags);
    setShowPopup(false);
  };

  return (
    <>
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
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FiHeart className="w-6 h-6" />
          </a>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleTogglePopup}
          >
            Upload
          </button>
        </div>
      </nav>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute top-16 right-0 bg-white p-6 shadow-lg rounded-lg w-80"
        >
          <h2 className="text-xl font-semibold mb-4">Upload Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">File Upload:</label>
              <input
                type="file"
                name="file"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Date:</label>
              <input
                type="date"
                name="date"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.date}
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Day:</label>
              <input
                type="text"
                name="day"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter day of the week"
                value={formData.day}
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Tags:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Add a tag"
                  value={inputTag}
                  onChange={handleTagInput}
                />
                <button
                  type="button"
                  className="bg-green-500 text-white px-3 py-1 rounded-lg"
                  onClick={addTag}
                >
                  Add Tag
                </button>
              </div>
              <div className="mt-2 flex flex-wrap space-x-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 py-1 px-3 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Nav;
