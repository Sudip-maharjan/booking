import "./featured.css";

const Featured = () => {
  return (
    <>
      <div className="featured">
        <div className="featuredItem">
          <img
            src="https://cf.bstatic.com/xdata/images/hotel/square240/508356058.webp?k=0994eed7d0185d5b79c23fe686792a7c34ac83bea75ada07b5b1551a71880503&o="
            alt="sanam ko hotel"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Dang</h1>
            <h2>Sanam ko hotel</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img
            src="https://cf.bstatic.com/xdata/images/hotel/square240/475915438.webp?k=ad50d2cca7e1b3bdce4fbf523ef480f4b10447c5bf01f4ba08f5668014c3d9fa&o="
            alt="Anish ko Hotel"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Dang</h1>
            <h2>Anish ko Hotel</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img
            src="https://cf.bstatic.com/xdata/images/hotel/square240/506500694.webp?k=b457a617a286735c4a751c8990bf4311f1eccb3469d7932bd1694c79259e6fd2&o="
            alt="Babi ko Hotel"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Jhapa</h1>
            <h2>Babi ko Hotel</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img
            src="https://cf.bstatic.com/xdata/images/hotel/square240/670829774.webp?k=55548d54f0f1fe14d05a6f5de89257f671ce057c70709bf5557a78fabc76975a&o="
            alt="Supreme ko Hotel"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Kathmandu</h1>
            <h2>Supreme ko Hotel</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img
            src="https://cf.bstatic.com/xdata/images/hotel/square240/695185154.webp?k=cdbe2db8d47dbf55856fdeeadb48892b960c8ca10f047a8a226638af629410ae&o="
            alt="Kapil ko Hotel"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Nuwakot</h1>
            <h2>Kapil ko Hotel</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Featured;
