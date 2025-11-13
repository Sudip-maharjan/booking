export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "country",
    headerName: "Country",
    width: 100,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 100,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];

export const bookingColumns = [
  { field: "_id", headerName: "ID", width: 220 },
  {
    field: "user",
    headerName: "User",
    width: 150,
    renderCell: (params) => {
      return params.row.user?.username || "N/A";
    },
  },
  {
    field: "hotel",
    headerName: "Hotel",
    width: 200,
    renderCell: (params) => {
      return params.row.hotel?.name || "N/A";
    },
  },
  {
    field: "checkInDate",
    headerName: "Check In",
    width: 120,
    renderCell: (params) => {
      return new Date(params.row.checkInDate).toLocaleDateString();
    },
  },
  {
    field: "checkOutDate",
    headerName: "Check Out",
    width: 120,
    renderCell: (params) => {
      return new Date(params.row.checkOutDate).toLocaleDateString();
    },
  },
  {
    field: "totalPrice",
    headerName: "Total Price",
    width: 120,
    renderCell: (params) => {
      return `Rs.${params.row.totalPrice}`;
    },
  },
  {
    field: "guests",
    headerName: "Guests",
    width: 80,
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "isPaid",
    headerName: "Payment",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${
            params.row.isPaid ? "confirmed" : "pending"
          }`}
        >
          {params.row.isPaid ? "Paid" : "Unpaid"}
        </div>
      );
    },
  },
];
