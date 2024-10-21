/* import Category from "./Category/Category";
import Playlist from "./Playlist/Playlist";
import Day from "./Day/Day";
import Tags from "./Tags/Tags"; // New import for Tags component (testing)

import "./Sidebar.css";

const Sidebar = ({ handleChange, handleDayChange, categories, addCategory, handlePlaylistChange, tags }) => {
    return (
        <>
            <section className="sidebar">
                <div className="logo-container">
                    <h1>Welcome!</h1>
                </div>
                <Category
                    handleChange={handleChange}
                    categories={categories}
                    addCategory={addCategory}
                />
                <Playlist handlePlaylistChange={handlePlaylistChange} />
                <Day handleDayChange={handleDayChange} />
                {/* New Tags section */ //} 
                //<Tags tags={tags} /> 
            //</section>
        //</> 
    //);
//};

/* export default Sidebar; */

// testing 1
/* 
import Category from "./Category/Category";
import Playlist from "./Playlist/Playlist";
import Day from "./Day/Day";
import Tags from "./Tags/Tags";  // Import the new Tags component

import "./Sidebar.css";

const Sidebar = ({ handleChange, handleDayChange, categories, tags, handlePlaylistChange }) => {
return (
    <>
    <section className="sidebar">
        <div className="logo-container">
        <h1>Welcome!</h1>
        </div>
        <Category
        handleChange={handleChange}
        categories={categories}
        />
        <Playlist handlePlaylistChange={handlePlaylistChange} />
        <Day handleDayChange={handleDayChange} />
        <Tags tags={tags} /> {/* Render the Tags section *///}---------
    //</section>
    //</>
//);
//};

// export default Sidebar; */-----------------------------------

//testing 2 code which worked for creating Tags section in sidebar-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0
/*
import React from "react";
import Category from "./Category/Category";
import Playlist from "./Playlist/Playlist";
import Day from "./Day/Day";

import "./Sidebar.css";

const Sidebar = ({ handleChange, handleDayChange, categories, allTags, handlePlaylistChange }) => {
    return (
        <>
            <section className="sidebar">
                <div className="logo-container">
                    <h1>Welcome!</h1>
                </div>
                <Category
                    handleChange={handleChange}
                    categories={categories}
                />
                <Playlist handlePlaylistChange={handlePlaylistChange} />
                <Day handleDayChange={handleDayChange} />
                
                {/* New Tags Section *///---------------------}
                //<div className="tags-section">
                    //<h2>Tags</h2> {/* Title for Tags Section */}
                    //{allTags.map((tag, index) => (
                        //<div key={index} className="tag">
                            //{tag} {/* Display each tag */}
                        //</div>
                    //))}
                //</div>
            //</section>
        //</>
    //);
//};

//export default Sidebar; 


//testing  code for deslect funtionality -1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1--1-1-1--1-1-1-1-1

import React, { useState, useEffect } from "react";
import Category from "./Category/Category";
import Playlist from "./Playlist/Playlist";
import Day from "./Day/Day";

import "./Sidebar.css";

const Sidebar = ({ handleChange, handleDayChange, categories, allTags, handlePlaylistChange, handleTagSelection }) => {
    // State to track the selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    // Function to handle the selection/deselection of tags
    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => {
            // Check if the tag is already selected
            const newTags = prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag) // Deselect if selected
                : [...prevTags, tag]; // Select if not selected

            // Pass the updated selected tags to parent (App.js)
            handleTagSelection(newTags);
            return newTags;
        });
    };

    return (
        <section className="sidebar">
            <div className="logo-container">
                <h1>Welcome!</h1>
            </div>
            <Category
                handleChange={handleChange}
                categories={categories}
            />
            <Playlist handlePlaylistChange={handlePlaylistChange} />
            <Day handleDayChange={handleDayChange} />
            
            {/* New Tags Section */}
            <div className="tags-section">
                <h2>Tags</h2> {/* Title for Tags Section */}
                {allTags.map((tag, index) => (
                    <div 
                        key={index} 
                        className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`} // Add 'selected' class if the tag is selected
                        onClick={() => handleTagClick(tag)} // Handle click to select/deselect tag
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Sidebar;
