import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle the search and fetch results from the eporner API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
          query
        )}&per_page=10&page=1&thumbsize=big&order=top-weekly&gay=1&lq=1&format=json`
      );

      setResults(response.data.videos); // Assuming 'videos' is the field in the API response that contains the video details
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold animate-bounce mb-8">
        Video Search
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-8">
        <form
          onSubmit={handleSearch}
          className="flex items-center border rounded-full bg-white shadow-md"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 text-gray-700 outline-none rounded-l-full"
            placeholder="Search for videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-r-full hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="mt-4 text-orange-500 text-3xl font-semibold">
          Loading...
        </p>
      )}

      {/* Display Search Results */}
      <div className="w-full">
        {results.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((result, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className="relative w-full">
                  <a
                    href={result.url} // The URL of the video
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <img
                      src={result.default_thumb.src} // Use the "default_thumb" image from the API
                      alt={result.title}
                      className="w-full md:w-80 h-auto rounded-md shadow-md"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
