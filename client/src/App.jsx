import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotelDetails/Hotel";
import Login from "./pages/login/Login";
import Profile from "./pages/userProfile/Profile";
import Register from "./pages/register/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/hotels"
          element={<List />}
        />
        <Route
          path="/hotels/:id"
          element={<Hotel />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/profile/:username"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
