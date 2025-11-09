import React from 'react'

const AllHotel = () => {
  return (
     <div class="container">
        <div class="hotel-card">
            <div class="image-gallery">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" alt="Om sweet Home" class="main-image" id="mainImage">
                <div class="badge">Featured ⭐</div>
                <div class="distance-badge">100m from center</div>
                <div class="thumbnail-container">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" alt="View 1" class="thumbnail" onclick="changeImage(this.src)">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200" alt="View 2" class="thumbnail" onclick="changeImage(this.src)">
                    <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=200" alt="View 3" class="thumbnail" onclick="changeImage(this.src)">
                    <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200" alt="View 4" class="thumbnail" onclick="changeImage(this.src)">
                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200" alt="View 5" class="thumbnail" onclick="changeImage(this.src)">
                </div>
            </div>

            <div class="hotel-content">
                <div class="hotel-header">
                    <div class="hotel-title">
                        <div class="hotel-type">Hotel</div>
                        <h1 class="hotel-name">Om sweet Home ॐ</h1>
                        <div class="location">Dristi marga 47, lakeside, Pokhara 33700</div>
                    </div>
                    <div class="rating-section">
                        <div class="rating">
                            <span class="stars">★★★</span>
                            <span>3.5</span>
                        </div>
                        <div class="reviews">2 reviews</div>
                    </div>
                </div>

                <p class="description">
                    You might be eligible for a Genius discount at Om sweet Home ॐ. Experience luxury in the heart of Kathmandu with stunning views, world-class amenities, and exceptional hospitality. Our carefully designed spaces offer the perfect blend of comfort and elegance for your memorable stay.
                </p>

                <div class="hotel-footer">
                    <div class="price-section">
                        <div class="price-label">Starting from</div>
                        <div class="price">$60<span>/night</span></div>
                    </div>
                    <div class="rooms-info">1 Room Available</div>
                    <button class="btn-book">Book Now</button>
                </div>
            </div>
        </div>
    </div>

  )
}

export default AllHotel