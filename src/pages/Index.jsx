import React, { useState } from "react";

import { FaStar } from "react-icons/fa";
import "tailwindcss/tailwind.css";

const Index = () => {
  const [showInput, setShowInput] = useState("");
  const [showList, setShowList] = useState([]);

  // Mocked data that simulates fetched IMDB ratings
  const IMDB_DATA = {
    "Breaking Bad": 9.5,
    "Stranger Things": 8.7,
    "The Crown": 8.6,
    "Black Mirror": 8.8,
    "The Witcher": 8.2,
    Ozark: 8.4,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const shows = showInput
      .split(/,|\n/)
      .map((show) => show.trim())
      .filter((show) => show !== "");

    const apiKey = "28404aa5";
    const promises = shows.map(async (show) => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(show)}&apikey=${apiKey}`);
        const data = await response.json();
        const { Title, imdbRating } = data;
        return { title: Title, rating: imdbRating };
      } catch (error) {
        console.error(`Error fetching data for ${show}:`, error);
        return { title: show, rating: "N/A" };
      }
    });

    const rankedShows = await Promise.all(promises);
    rankedShows.sort((a, b) => b.rating - a.rating);
    setShowList(rankedShows);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Netflix Shows Ratings</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea className="border-2 border-gray-300 w-full p-2" rows="5" placeholder="Enter Netflix shows, separated by a comma or newline..." value={showInput} onChange={(e) => setShowInput(e.target.value)}></textarea>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Get Ratings
        </button>
      </form>
      <div>
        {showList.length > 0 && (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Show</th>
                <th className="px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {showList.map((show, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{show.title}</td>
                  <td className="border px-4 py-2">
                    {show.rating !== "N/A" ? (
                      <>
                        {show.rating} <FaStar className="inline text-yellow-400" />
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Index;
