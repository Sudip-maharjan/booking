import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/api/hotels/countByCity?cities=Ghorahi,Goraha,Bardaghat"
  );

  return (
    <>
      <div className="featured">
        {loading ? (
          "Loading Please wait..."
        ) : (
          <>
            <div className="featuredItem">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square240/508356058.webp?k=0994eed7d0185d5b79c23fe686792a7c34ac83bea75ada07b5b1551a71880503&o="
                alt="sanam ko hotel"
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Ghorahi</h1>
                <h2>{data[0]} properties</h2>
              </div>
            </div>
            <div className="featuredItem">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square240/475915438.webp?k=ad50d2cca7e1b3bdce4fbf523ef480f4b10447c5bf01f4ba08f5668014c3d9fa&o="
                alt="Anish ko Hotel"
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Goraha</h1>
                <h2>{data[1]} properties</h2>
              </div>
            </div>
            <div className="featuredItem">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square240/506500694.webp?k=b457a617a286735c4a751c8990bf4311f1eccb3469d7932bd1694c79259e6fd2&o="
                alt="Babi ko Hotel"
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Bardaghat</h1>
                <h2>{data[2]} properties</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Featured;
