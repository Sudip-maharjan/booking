import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";

const List = () => {
  const { data, loading, error } = useFetch("/api/bookings");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading bookings</div>;

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Booking ID</TableCell>
            <TableCell className="tableCell">Hotel Name</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Check-in Date</TableCell>
            <TableCell className="tableCell">Check-out Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="tableCell">
                  {booking._id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell className="tableCell">
                  {booking.hotel?.name || "N/A"}
                </TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    <img
                      src={
                        booking.user?.img ||
                        "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                      }
                      alt=""
                      className="image"
                    />
                    {booking.user?.username || "Unknown User"}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  {format(new Date(booking.checkInDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="tableCell">
                  {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="tableCell">
                  ${booking.totalPrice}
                </TableCell>
                <TableCell className="tableCell">
                  {booking.paymentMethod}
                </TableCell>
                <TableCell className="tableCell">
                  <span
                    className={`status ${
                      booking.isPaid ? "Approved" : "Pending"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
