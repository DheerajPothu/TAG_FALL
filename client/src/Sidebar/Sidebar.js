import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const Sidebar = ({
  data,
  selectedFilters = {}, // Add default value
  handleFilterChange,
  allTags = [], // Add default value
  selectedTags = [], // Add default value
  handleTagSelection,
}) => {
  const [filters, setFilters] = useState({
    category: [],
    company: [],
    day: [],
    date: [],
    season: [],
  });

  useEffect(() => {
    const category = [...new Set(data.map((item) => item.category))].filter(
      Boolean
    );
    const company = [...new Set(data.map((item) => item.company))].filter(
      Boolean
    );
    const day = [...new Set(data.map((item) => item.day))].filter(Boolean);
    const date = [...new Set(data.map((item) => item.date))].filter(Boolean);
    const season = [...new Set(data.map((item) => item.season))].filter(
      Boolean
    );
    
    setFilters({
      ...(category.length && { category }),
      ...(company.length && { company }),
      ...(day.length && { day }),
      ...(date.length && { date }),
      ...(season.length && { season }),
    });
  }, [data]);
  useEffect(() => {
    const extractUniqueValues = (key) => 
      [...new Set(data.map((item) => item[key]))].filter(Boolean);
  
    setFilters({
      category: extractUniqueValues('category'),
      company: extractUniqueValues('company'),
      day: extractUniqueValues('day'),
      date: extractUniqueValues('date'),
      season: extractUniqueValues('season'),
    });
  }, [data]);
  
  const [editMode, setEditMode] = useState({});
  const [editValue, setEditValue] = useState({});
  const [editTagMode, setEditTagMode] = useState(null);
  const [editTagValue, setEditTagValue] = useState("");

  const handleMultiSelectChange = (filterKey, value) => {
    const normalizedValue = value.toLowerCase();
    handleFilterChange(
      filterKey,
      selectedFilters[filterKey]?.includes(normalizedValue)
        ? selectedFilters[filterKey].filter((val) => val !== normalizedValue)
        : [...(selectedFilters[filterKey] || []), normalizedValue]
    );
  };

  const handleTagClick = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    handleTagSelection(newTags);
  };

  const handleClearFilters = () => {
    Object.keys(filters).forEach((key) => handleFilterChange(key, []));
    handleTagSelection([]);
  };

  const handleEditFilter = (filterKey, value) => {
    setEditMode({ [filterKey]: value });
    setEditValue({ [filterKey]: value });
  };

  const handleSaveEdit = (filterKey, oldValue) => {
    const newValue = editValue[filterKey];
    if (newValue && newValue.trim() !== oldValue) {
      if (window.confirm(`Are you sure you want to Edit the filter value "${newValue}"?`)) {

      // Send request to update filter value
      fetch(`${process.env.REACT_APP_API_URL}/update_filter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filterKey, oldValue, newValue: newValue.trim() }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh the filters
          setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: prevFilters[filterKey].map((val) => (val === oldValue ? newValue.trim() : val)),
          }));
          setEditMode({});
          window.location.reload();
        } else {
          alert("Failed to update filter value.");
        }
      });
    }
    } else {
      setEditMode({});
    }
  };

  const handleDeleteFilter = (filterKey, value) => {
    if (window.confirm(`Are you sure you want to delete the filter value "${value}"?`)) {
      // Send request to delete filter value
      fetch(`${process.env.REACT_APP_API_URL}/delete_filter`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filterKey, value }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh the filters
          setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: prevFilters[filterKey].filter((val) => val !== value),
          }));
          window.location.reload();
        } else {
          alert("Failed to delete filter value.");
        }
      });
    }
  };

  const handleEditTag = (tag) => {
    setEditTagMode(tag);
    setEditTagValue(tag);
  };

  const handleSaveTagEdit = (oldTag) => {
    const newTag = editTagValue;
    if (newTag && newTag.trim() !== oldTag) {
      // Send request to update tag value
      fetch(`${process.env.REACT_APP_API_URL}/update_tag`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldTag, newTag: newTag.trim() }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh the tags
          handleTagSelection(selectedTags.map(tag => (tag === oldTag ? newTag.trim() : tag)));
          setEditTagMode(null);
          window.location.reload();
        } else {
          alert("Failed to update tag value.");
        }
      });
    } else {
      setEditTagMode(null);
    }
  };

  const handleDeleteTag = (tag) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tag}"?`)) {
      // Send request to delete tag value
      fetch(`${process.env.REACT_APP_API_URL}/delete_tag`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh the tags
          handleTagSelection(selectedTags.filter(t => t !== tag));
          window.location.reload();
        } else {
          alert("Failed to delete tag.");
        }
      });
    }
  };

  return (
    <section className="w-64 h-full fixed border-r border-gray-200 bg-white shadow-lg overflow-y-auto p-6">
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Filters</h1>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleClearFilters}
          className="text-blue-500 underline hover:text-blue-600 hover:underline-offset-2 transition text-right w-full mb-8"
        >
          Clear Filters
        </button>
      </div>
      {Object.keys(filters).map((filterKey, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">
            {filterKey === 'category' ? 'Place' : filterKey === 'company' ? 'Type' : filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
          </h2>
          <div className="space-y-2">
            {filters[filterKey].map((value, i) => (
              <div key={i} className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  value={value}
                  checked={selectedFilters[filterKey]?.includes(value.toLowerCase())}
                  onChange={() => handleMultiSelectChange(filterKey, value)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                {editMode[filterKey] === value ? (
                  <>
                    <button onClick={() => handleSaveEdit(filterKey, value)} className="text-green-500 hover:text-green-700">
                      <FiCheck />
                    </button>
                    <button onClick={() => setEditMode({})} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                    <input
                      type="text"
                      value={editValue[filterKey]}
                      onChange={(e) => setEditValue({ [filterKey]: e.target.value })}
                      className="border border-gray-300 rounded p-1 flex-grow"
                    />
                  </>
                ) : (
                  <>
                    <span className="text-sm capitalize flex-grow">{value}</span>
                    <button onClick={() => handleEditFilter(filterKey, value)} className="text-gray-500 hover:text-gray-700">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDeleteFilter(filterKey, value)} className="text-gray-500 hover:text-gray-700">
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">Tags</h2>
        <div className="flex flex-col gap-2">
          {allTags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => {
                  const newTags = selectedTags.includes(tag)
                    ? selectedTags.filter(t => t !== tag)
                    : [...selectedTags, tag];
                  handleTagSelection(newTags);
                }}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              {editTagMode === tag ? (
                <>
                  <button onClick={() => handleSaveTagEdit(tag)} className="text-green-500 hover:text-green-700">
                    <FiCheck />
                  </button>
                  <button onClick={() => setEditTagMode(null)} className="text-red-500 hover:text-red-700">
                    <FiX />
                  </button>
                  <input
                    type="text"
                    value={editTagValue}
                    onChange={(e) => setEditTagValue(e.target.value)}
                    className="border border-gray-300 rounded p-1 flex-grow"
                  />
                </>
              ) : (
                <>
                  <span className="text-sm capitalize flex-grow">{tag}</span>
                  <button onClick={() => handleEditTag(tag)} className="text-gray-500 hover:text-gray-700">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDeleteTag(tag)} className="text-gray-500 hover:text-gray-700">
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;