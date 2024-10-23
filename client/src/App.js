import { useState, useEffect } from "react";
import axios from 'axios';

import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import Recommended from "./Recommended/Recommended";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import AudioCard from "./components/Audiocard";

import "./index.css";
import "./App.css";

function App() {
  const [data, setData] = useState({ photos: [], music: [] });
  const [categories, setCategories] = useState([
    { value: "montreal", title: "Montreal" },
    { value: "ontario", title: "Ontario" },
    { value: "ottawa", title: "Ottawa" },
    { value: "banff", title: "Banff" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [allTags, setAllTags] = useState([]); // State to store all tags
  const [selectedTags, setSelectedTags] = useState([]); // State to store selected tags

  // Fetch data on component mount or when refreshKey changes
  useEffect(() => {
    axios.get('http://127.0.0.1:5004/data')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [refreshKey]);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Handle input change for search query
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleCompanyClick = (event) => {
    setSelectedCompany(event.target.value);
  };

  // Handle category change
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle day change
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
  };

  const handleCardUpdate = (updatedItem, isMusic = false) => {
    console.log("Updating card:", updatedItem); // Debugging
  
    // Update the data state for photos and music
    setData(prevData => ({
      ...prevData,
      photos: !isMusic
        ? prevData.photos.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )
        : prevData.photos,
      music: isMusic
        ? prevData.music.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )
        : prevData.music
    }));
  
    // Ensure category exists and is properly formatted
    if (updatedItem.category) {
      const updatedTags = updatedItem.category.split(",").map(tag => tag.trim());
  
      // Update the allTags state by ensuring changes are reflected properly
      setAllTags(prevTags => {
        // Remove any tags that no longer exist in either photos or music
        let remainingTags = prevTags.filter(tag =>
          data.photos.some(photo => photo.category?.includes(tag)) || // Added optional chaining here
          data.music.some(music => music.category?.includes(tag))    // Added optional chaining here
        );
  
        // Add new tags from the updated item, avoiding duplicates
        const combinedTags = [...new Set([...remainingTags, ...updatedTags])];
        return combinedTags;
      });
    }
  
    setRefreshKey(prevKey => prevKey + 1); // Trigger re-render
  };
  
  // Function to handle tag selection/deselection
  const handleTagSelection = (selectedTags) => {
    setSelectedTags(selectedTags);
  };
    

  // Filter data based on category, day, and search query
  function filteredData(items, selectedCategory, query, day, playlist, company, selectedTags) {
    let filteredItems = items;
    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Filter by selected day
    if (day) {
      filteredItems = filteredItems.filter(item => item.day === day);
    }

    if (playlist) {
      filteredItems = filteredItems.filter(item => item.playlist === playlist);
    }

    if (company) {
      filteredItems = filteredItems.filter(item => item.company === company);
    }

    // Filter by selected category
    filteredItems = filteredItems.filter(item => {
      const matchesKeywords = keywords.every(keyword =>
        [item.title, item.season, item.day, item.date, item.category, item.playlist].some(field =>
          field?.toLowerCase().includes(keyword)
        )
      );

      // Check if selected tags match the item's tags
      const matchesTags = !selectedTags.length || selectedTags.some(tag => item.category?.includes(tag));

      return matchesKeywords && (!selectedCategory || item.category === selectedCategory) && matchesTags;
    });

    return filteredItems.map(({ img, title, season, day, date, company, category, audioSrc, id, playlist }) => {
      if (audioSrc) {
        return (
          <AudioCard
            key={id}
            img={img}
            audioSrc={audioSrc}
            title={title}
            company={company}
            playlist={playlist}
            id={id}
            category={category}
            onUpdate={(updatedItem) => handleCardUpdate(updatedItem, true)} // Pass `isMusic` flag
          />
        );
      } else {
        return (
          <Card
            key={id}
            img={img}
            title={title}
            season={season}
            day={day}
            date={date}
            category={category}
            company={company}
            id={id}
            onUpdate={handleCardUpdate}
          />
        );
      }
    });
  }

  const filteredPhotos = filteredData(data.photos, selectedCategory, debouncedQuery, selectedDay, selectedPlaylist, selectedCompany, selectedTags);
  const filteredMusic = filteredData(data.music, selectedCategory, debouncedQuery, selectedDay, selectedPlaylist, selectedCompany, selectedTags);

  return (
    <>
      <Sidebar
        handleChange={handleChange}
        handleDayChange={handleDayChange}
        categories={categories}
        allTags={allTags} // Pass the tags to Sidebar
        handlePlaylistChange={handlePlaylistChange}
        handleTagSelection={handleTagSelection} // Pass handleTagSelection to Sidebar
      />
      <Navigation query={query} handleInputChange={handleInputChange} />
      <Recommended handleCompanyClick={handleCompanyClick} />
      <Products result={[filteredPhotos, filteredMusic]} />
    </>
  );
}

export default App;



