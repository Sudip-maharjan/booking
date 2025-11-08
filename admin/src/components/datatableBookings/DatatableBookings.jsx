import "./datatableBookings.scss";
import { DataGrid } from "@mui/x-data-grid";
import { bookingColumns } from "../../datatablesource";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const DatatableBookings = () => {
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch("/api/bookings");

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      setList(list.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status: newStatus });
      setList(
        list.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentChange = async (id, isPaid) => {
    try {
      await axios.put(`/api/bookings/${id}/payment`, { isPaid });
      setList(
        list.map((item) => (item._id === id ? { ...item, isPaid } : item))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 280,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <select
              className="statusButton"
              value={params.row.status}
              onChange={(e) =>
                handleStatusChange(params.row._id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              className={`paymentButton ${
                params.row.isPaid ? "paid" : "unpaid"
              }`}
              onClick={() =>
                handlePaymentChange(params.row._id, !params.row.isPaid)
              }
            >
              {params.row.isPaid ? "Mark Unpaid" : "Mark Paid"}
            </button>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">All Bookings</div>
      {loading ? (
        "Loading..."
      ) : (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={bookingColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default DatatableBookings;
