import useFetch from "../../hooks/useFetch";
import "./propertyList.css";

const PropertyList = () => {
  const { data, loading, error } = useFetch("/api/hotels/countByType");

  const images = [
    "https://cf.bstatic.com/xdata/images/hotel/square240/508356058.webp?k=0994eed7d0185d5b79c23fe686792a7c34ac83bea75ada07b5b1551a71880503&o=",
    "https://cf.bstatic.com/xdata/images/hotel/square240/475915438.webp?k=ad50d2cca7e1b3bdce4fbf523ef480f4b10447c5bf01f4ba08f5668014c3d9fa&o=",
    "https://cf.bstatic.com/xdata/images/hotel/square240/506500694.webp?k=b457a617a286735c4a751c8990bf4311f1eccb3469d7932bd1694c79259e6fd2&o=",
    "https://cf.bstatic.com/xdata/images/hotel/square240/670829774.webp?k=55548d54f0f1fe14d05a6f5de89257f671ce057c70709bf5557a78fabc76975a&o=",
    "https://cf.bstatic.com/xdata/images/hotel/square240/695185154.webp?k=cdbe2db8d47dbf55856fdeeadb48892b960c8ca10f047a8a226638af629410ae&o=",
  ];

  return (
    <>
      <div className="pList">
        {loading ? (
          "loading"
        ) : (
          <>
            {data &&
              images.map((img, i) => (
                <div className="pListItem" key={i}>
                  <img src={img} alt="sanam ko hotel" className="pListImg" />
                  <div className="pListTitles">
                    <h1>{data[i]?.type}</h1>
                    <h2>
                      {data[i]?.count} {data[i]?.type}
                    </h2>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default PropertyList;
