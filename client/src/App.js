import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import "./index.css";
import "./App.css";
import { fetchSessionID } from "./fetchers/getSessionID";

function App() {
  const sessionID = localStorage.getItem("sessionId");
  useEffect(() => {
    if (!sessionID) {
      fetchSessionID();
    }
  }, [sessionID]);

  const [data, setData] = useState({ uploads: [] });
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [likedItems, setLikedItems] = useState([]); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    companies: [],
    days: [],
    dates: [],
    seasons: [],
  });

  // Fetch data on component mount or when refreshKey changes
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId") || "initial"; // Get sessionId
    axios
      .get(`${apiUrl}/data`, { params: { sessionId } }) // Send sessionId as a query parameter
      .then((response) => {
        setData(response.data);
        const tags = [...new Set(response.data.uploads.flatMap(item => item.tags || []))].sort();
        setAllTags(tags);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [apiUrl]);
  

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFilterChange = (filterName, selectedValues) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: selectedValues,
    }));
  };

  const handleTagSelection = (selectedTags) => {
    setSelectedTags(selectedTags);
  };

  const handleToggleFavorite = (item) => {
    setLikedItems((prevLikedItems) => {
      if (prevLikedItems.some((likedItem) => likedItem.id === item.id)) {
        return prevLikedItems.filter((likedItem) => likedItem.id !== item.id);
      } else {
        return [...prevLikedItems, item];
      }
    });
  };

  const handleCardUpdate = async (updatedItem) => {
    setData((prevData) => ({
      ...prevData,
      uploads: prevData.uploads.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      ),
    }));

    try {
      const response = await fetch(`${apiUrl}/update/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedItem.object, id: updatedItem.id }),
      });

      if (!response.ok) throw new Error("Failed to update item");

      console.log(await response.json());
    } catch (error) {
      console.error("Error updating item:", error);
    }
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Filter data based on multi-selection filters, tags, and search query (title and tags)
  const filteredData = data.uploads.filter((item) => {
    const keywords = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean);

    // Check if title or tags match the search query
    const matchesSearchQuery = keywords.every((keyword) =>
      item.title.toLowerCase().includes(keyword) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword)))
    );

    const matchesCategories =
      !selectedFilters.categories.length ||
      selectedFilters.categories.includes(item.category);

    const matchesCompanies =
      !selectedFilters.companies.length ||
      selectedFilters.companies.includes(item.company);

    const matchesDays =
      !selectedFilters.days.length || selectedFilters.days.includes(item.day);

    const matchesDates =
      !selectedFilters.dates.length ||
      selectedFilters.dates.includes(item.date);

    const matchesSeasons =
      !selectedFilters.seasons.length ||
      selectedFilters.seasons.includes(item.season);

    return (
      matchesSearchQuery &&
      matchesCategories &&
      matchesCompanies &&
      matchesDays &&
      matchesDates &&
      matchesSeasons
    );
  });

  return (
    <>
      <Sidebar
        data={data.uploads}
        selectedFilters={selectedFilters}
        handleFilterChange={handleFilterChange}
        allTags={allTags}
        selectedTags={selectedTags}
        handleTagSelection={handleTagSelection}
      />
      <Navigation 
        query={query} 
        handleInputChange={handleInputChange} 
        likedItems={likedItems} 
      />
      <Products
        result={filteredData.map((item) => (
          <Card 
            key={item.id} 
            {...item} 
            onUpdate={handleCardUpdate} 
            onToggleFavorite={() => handleToggleFavorite(item)} 
          />
        ))}
      />
    </>
  );
}

export default App;
