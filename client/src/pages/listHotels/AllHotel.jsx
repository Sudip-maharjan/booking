import React from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import "./allhotel.css";
const AllHotel = () => {
  // Sample hotel data array
  const { data } = useFetch("/api/hotels");

  return (
    <div className="hotels-page">
      <div className="header-section">
        <h1 className="page-title">Discover Your Perfect Stay in Nepal</h1>
      </div>

      <div className="hotels-container">
        <div className="hotels-grid">
          {data.map((hotel) => (
            <Link
              key={hotel._id}
              to={`/hotels/${hotel._id}`}
              className="hotel-card"
            >
              <div className="card-link">
                <div className="image-wrapper">
                  <img
                    src={hotel.photos[0]}
                    alt={hotel.name}
                    className="hotel-image"
                  />
                  {hotel.featured && (
                    <div className="featured-badge">Featured ⭐</div>
                  )}
                  <div className="overlay">
                    <span className="view-details">View Details →</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <div>
                      <span className="hotel-type">{hotel.type}</span>
                      <h2 className="hotel-name">{hotel.name}</h2>
                      <div className="location">
                        <span className="location-icon">📍</span>
                        <span>{hotel.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="description">{hotel.desc}</p>

                  <div className="card-footer">
                    <div className="price-info">
                      <span className="price">Rs.{hotel.cheapestPrice}</span>
                      <span className="night-text">/night</span>
                    </div>
                    <div className="cta-wrapper">
                      <button className="cta-button">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AllHotel;
