import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./recommended.css";

const Recommended = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`api/recommendations/${user._id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setMessage(data.message || "");
        setType(data.type || "");
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleClick = (id) => {
    navigate(`/hotels/${id}`);
  };

  if (!user) {
    return null; // Don't show recommendations if user is not logged in
  }

  if (loading) {
    return (
      <div className="recommended">
        <div className="recommendedContainer">
          <div className="recommendedHeader">
            <h1 className="recommendedTitle">Recommended For You</h1>
            <p className="recommendedSubtitle">
              Loading personalized recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommended">
        <div className="recommendedContainer">
          <div className="recommendedHeader">
            <h1 className="recommendedTitle">Recommended For You</h1>
            <p className="recommendedError">
              Unable to load recommendations. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommended">
      <div className="recommendedContainer">
        <div className="recommendedHeader">
          <h1 className="recommendedTitle">
            {type === "personalized"
              ? "Recommended For You"
              : "⭐ Popular Hotels"}
          </h1>
          <p className="recommendedSubtitle">{message}</p>
        </div>
        <div className="recommendedList">
          {recommendations.map((hotel) => (
            <div
              className="recommendedItem"
              key={hotel._id}
              onClick={() => handleClick(hotel._id)}
            >
              <img
                src={
                  hotel.photos?.[0] ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={hotel.name}
                className="recommendedImg"
              />
              <div className="recommendedTexts">
                <h1 className="recommendedName">{hotel.name}</h1>
                <span className="recommendedCity">{hotel.city}</span>
                <div className="recommendedRating">
                  <div className="recommendedStars">
                    {hotel.rating > 0 ? (
                      <>
                        <span className="recommendedRatingValue">
                          {hotel.rating}
                        </span>
                        <span className="recommendedRatingStars">
                          {"★".repeat(Math.round(hotel.rating))}
                        </span>
                        <span className="recommendedReviewCount">
                          ({hotel.reviews} reviews)
                        </span>
                      </>
                    ) : (
                      <span className="recommendedNoRating">
                        No ratings yet
                      </span>
                    )}
                  </div>
                  {hotel.predictedRating && type === "personalized" && (
                    <div className="recommendedPredicted">
                      <span className="recommendedPredictedLabel">
                        Predicted rating for you:
                      </span>
                      <span className="recommendedPredictedValue">
                        {hotel.predictedRating} ★
                      </span>
                    </div>
                  )}
                </div>
                <span className="recommendedPrice">
                  Starting from Rs.{hotel.cheapestPrice}
                </span>
                {hotel.type && (
                  <span className="recommendedType">
                    {hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
