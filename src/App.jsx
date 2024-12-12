import React, { useState } from "react";
import axios from "axios";
import porn from "./public/porn.jpg";

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
    <div>
      <div className="relative overflow-hidden bg-gray-900 py-4">
        <img
          src={porn} // Replace with your actual image path
          alt="Background"
          className="absolute inset-0 object-cover  w-full h-full opacity-50"
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Hot7 <span className="text-[#FFAAAA]">media</span>
          </h1>
          <p className="text-lg text-gray-300">all content available here</p>
          <div className="flex items-center justify-center mt-8">
            <form onSubmit={handleSearch} className="flex items-center  w-full">
              <input
                type="text"
                placeholder="Search for videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="ml-4 px-4 py-3 bg-[#FFAAAA] font-semibold text-white rounded-md hover:bg-pink-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && (
        <p className="mt-4 text-pink-500 text-center text-3xl font-semibold">
          Loading...
        </p>
      )}

      {/* Display Search Results */}
      <div className="w-full my-4">
        {results.length > 0 ? (
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
        ) : (
          <div>
            <h1 className="text-center font-semibold text-gray-600 mt-8 text-2xl">
              {" "}
              sorry no content available !!!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
