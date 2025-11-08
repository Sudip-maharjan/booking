import "./bookingsList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DatatableBookings from "../../components/datatableBookings/DatatableBookings";

const BookingsList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DatatableBookings />
      </div>
    </div>
  );
};

export default BookingsList;
