import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./hotel.css";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Hotel = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const photos = [
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/508356058.jpg?k=0994eed7d0185d5b79c23fe686792a7c34ac83bea75ada07b5b1551a71880503&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/475915438.jpg?k=ad50d2cca7e1b3bdce4fbf523ef480f4b10447c5bf01f4ba08f5668014c3d9fa&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/670829774.jpg?k=55548d54f0f1fe14d05a6f5de89257f671ce057c70709bf5557a78fabc76975a&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/475915438.jpg?k=ad50d2cca7e1b3bdce4fbf523ef480f4b10447c5bf01f4ba08f5668014c3d9fa&o=&hp=1",
    },
  ];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon icon={faCircleXmark} />
            <FontAwesomeIcon icon={faCircleArrowLeft} />
            <div className="sliderWrapper">
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon icon={faCircleArrowRight} />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow">Reserve or Book Now</button>
          <h1 className="hotelTitle">Grand Hotel</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Elton St 125 New York</span>
          </div>
          <span className="hotelDistance">
            Excellent lovation - 500m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over $110 at this hotel and get a free airport taxi
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper">
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of Krakow</h1>
              <p className="hotelDesc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur numquam similique accusantium optio recusandae
                explicabo. Iure inventore quibusdam reprehenderit aspernatur
                ipsam fugiat voluptates officiis non, nihil tempora
                necessitatibus, officia ea. Lorem ipsum, dolor sit amet
                consectetur adipisicing elit. At magnam repudiandae officia ea
                totam beatae et harum accusantium! Perspiciatis eos libero
                corporis beatae, enim totam quaerat. Laudantium laborum ullam
                molestiae.
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-bight stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
                <b>$999</b> (9 nights)
              </h2>
              <button>Reserve or Book now!</button>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Hotel;
