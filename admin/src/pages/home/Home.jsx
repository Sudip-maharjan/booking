import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import Featured from "../../components/featured/featured";
import useFetch from "../../hooks/useFetch";

const Home = () => {
  const { data: users } = useFetch("api/users");
  const { data: hotels } = useFetch("/api/hotels");
  const { data: rooms } = useFetch("/api/rooms");

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="contentWrapper">
          <div className="widgets">
            <Widget type="user" count={users.length} />
            <Widget type="hotel" count={hotels.length} />
            <Widget type="room" count={rooms.length} />
          </div>
          <div className="charts">
            <div className="chartCard">
              <Featured />
            </div>
            <div className="chartCard">
              <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
            </div>
          </div>
          <div className="listContainer">
            <div className="listHeader">
              <h3 className="listTitle">Latest Transactions</h3>
            </div>
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
