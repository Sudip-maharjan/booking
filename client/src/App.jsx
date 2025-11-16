import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotelDetails/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MyBookings from "./pages/myBookings/MyBookings";
import AllHotel from "./pages/listHotels/AllHotel";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import ResendVerification from "./pages/resendVerification/ResendVerification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/allhotels" element={<AllHotel />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
