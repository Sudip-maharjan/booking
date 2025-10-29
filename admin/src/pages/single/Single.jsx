import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Single = () => {
  const { userId } = useParams();
  const { data, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={
                  data.img ||
                  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                }
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.username || "No name"}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data.phone || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{data.address || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{data.country || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="right">
            <Chart
              aspect={3 / 1}
              title={`Spending (Last 6 Months) for ${data.username || "User"}`}
            />
          </div>
        </div>

        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Single;
