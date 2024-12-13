import React, { useState, useEffect } from "react";
import axios from "axios";
import porn from "./public/porn.jpg";
import porn2 from "./public/porn-2.jpg";
import porn3 from "./public/porn-3.jpg";
import porn4 from "./public/porn-4.jpg";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [porn, porn2, porn3, porn4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setSearched(true); // Mark as searched

    try {
      const response = await axios.get(
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
          query
        )}&per_page=10&page=1&thumbsize=big&order=top-weekly&gay=1&lq=1&format=json`
      );

      setResults(response.data.videos || []); // Default to an empty array if no videos field exists
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden bg-gray-950 py-4">
        <img
          src={images[currentImageIndex]}
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full opacity-50"
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Hot7 <span className="text-[#FFAAAA]">media</span>
          </h1>
          <p className="text-lg text-gray-300">all content available here</p>
          <div className="flex items-center justify-center mt-8">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <input
                type="text"
                placeholder="Search for videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-md   focus:outline-none"
              />
              <button
                type="submit"
                className="ml-4 px-4 py-3 bg-[#FFAAAA] font-semibold text-white rounded-md hover:bg-pink-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center flex-grow mt-28">
          <div className="h-20 w-20 rounded-full animate-ping bg-[#FFAAAA]"></div>
        </div>
      )}

      {/* Display Results or Messages */}
      <div className="w-full my-4">
        {!query && !searched ? ( // No input and no search yet
          <h2 className="text-center text-gray-500 mt-8 text-2xl">
            All content available.
          </h2>
        ) : results.length === 0 && searched && !loading ? ( // No matches found
          <h2 className="text-center text-gray-500 mt-8 text-2xl">
            No content available.
          </h2>
        ) : (
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
