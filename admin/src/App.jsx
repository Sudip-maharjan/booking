import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { hotelColumns, roomColumns, userColumns } from "./datatablesource";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import BookingsList from "./pages/bookingsList/BookingsList";
import RoomSingle from "./pages/single/RoomSingle";
import HotelSingle from "./pages/single/HotelSingle";
import EditHotel from "./pages/edit/EditHotel";
import EditUser from "./pages/edit/EditUser";
import EditRoom from "./pages/edit/EditRoom";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);

  // ✅ Protect routes that need auth
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* HOME */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* USERS */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <List columns={userColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <Single />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute>
                <New inputs={userInputs} title="Add New User" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />

          {/* HOTELS */}
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <List columns={hotelColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id"
            element={
              <ProtectedRoute>
                <HotelSingle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/new"
            element={
              <ProtectedRoute>
                <NewHotel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/edit/:id"
            element={
              <ProtectedRoute>
                <EditHotel />
              </ProtectedRoute>
            }
          />

          {/* ROOMS */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <List columns={roomColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <ProtectedRoute>
                <RoomSingle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/new"
            element={
              <ProtectedRoute>
                <NewRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/edit/:id"
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            }
          />

          {/* BOOKINGS */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsList />
              </ProtectedRoute>
            }
          ></Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
