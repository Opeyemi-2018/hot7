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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [page, setPage] = useState(1); // New state for pagination

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
    setSearched(true);
    setPage(1); // Reset page on new search

    try {
      const response = await axios.get(
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
          query
        )}&per_page=10&page=1&thumbsize=big&order=top-weekly&gay=1&lq=1&format=json`
      );
      setResults(response.data.videos || []);
      setQuery("");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    const nextPage = page + 1;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
          query
        )}&per_page=10&page=${nextPage}&thumbsize=big&order=top-weekly&gay=1&lq=1&format=json`
      );
      setResults((prevResults) => [...prevResults, ...response.data.videos]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoDetails = async (videoId) => {
    try {
      const response = await axios.get(
        `https://www.eporner.com/api/v2/video/id/?id=${videoId}&format=json`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching video details:", error);
      return null;
    }
  };

  const handleVideoClick = async (videoId) => {
    const videoDetails = await fetchVideoDetails(videoId);
    if (videoDetails) {
      setSelectedVideo(videoDetails);
    }
  };

  return (
    <div>
      {/* Hero Section */}
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
          <p className="text-lg text-gray-300">All content available here</p>
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search for videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-md focus:outline-none"
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

      {/* Video Player */}
      <div className="w-full my-4">
        {selectedVideo ? (
          <div className="w-full flex flex-col items-center my-6">
            {/* Video */}
            {selectedVideo.embed ? (
              <iframe
                src={`${selectedVideo.embed}?controls=0&showinfo=0&modestbranding=1`}
                className=" md:w-[700px] w-full md:h-[500px] h-[500px] aspect-video rounded-md shadow-md"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            ) : selectedVideo.default ? (
              <video
                controls
                className="w-full aspect-video rounded-md shadow-md"
              >
                <source src={selectedVideo.default} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-center text-white">Video not available</p>
            )}

            {/* Related Videos */}
            <div className="w-full max-w-screen-lg mt-6">
              <h2 className="text-white text-2xl mb-4">Related Videos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => handleVideoClick(result.id)}
                  >
                    <img
                      src={result.default_thumb.src}
                      alt={result.title}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Default grid view when no video is selected
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center cursor-pointer"
                onClick={() => handleVideoClick(result.id)}
              >
                <img
                  src={result.default_thumb.src}
                  alt={result.title}
                  className="w-full h-auto rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show More Button */}
      {results.length > 0 && !loading && (
        <div className="flex justify-center my-6">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-[#FFAAAA] text-white rounded-md hover:bg-pink-600 font-semibold"
          >
            Show More
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center flex-grow my-6">
          <div className="h-20 w-20 rounded-full animate-ping bg-[#FFAAAA]"></div>
        </div>
      )}
    </div>
  );
};

export default App;
