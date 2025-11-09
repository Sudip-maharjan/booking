import "../new/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { userInputs } from "../../formSource";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, loading: fetchLoading } = useFetch(`/api/users/${id}`);

  useEffect(() => {
    if (data) {
      // Don't include password in the form
      const { password, ...userWithoutPassword } = data;
      setInfo(userWithoutPassword);
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = info.img;

      // Upload new image if file is selected
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
          data
        );
        imageUrl = uploadRes.data.url;
      }

      const updatedUser = {
        ...info,
        img: imageUrl,
      };

      // Only include password if user wants to change it
      if (!changePassword) {
        delete updatedUser.password;
      } else if (!updatedUser.password || updatedUser.password.trim() === "") {
        alert("Please enter a new password or uncheck 'Change Password'");
        setLoading(false);
        return;
      }

      await axios.put(`/api/users/${id}`, updatedUser);
      navigate("/users");
    } catch (err) {
      console.log(err);
      alert(
        "Error updating user: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="loading">Loading user data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit User</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : info.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
              }
              alt="User avatar"
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {userInputs.map((input) => {
                // Skip password field initially
                if (input.id === "password") {
                  return null;
                }

                return (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleChange}
                      value={info[input.id] || ""}
                    />
                  </div>
                );
              })}

              {/* Password Change Section */}
              <div className="formInput passwordSection">
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                  />
                  <span>Change Password</span>
                </label>

                {changePassword && (
                  <div className="passwordInput">
                    <label>New Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      onChange={handleChange}
                      value={info.password || ""}
                    />
                    <small className="passwordHint">
                      Leave blank to keep current password
                    </small>
                  </div>
                )}
              </div>

              <div className="formInput">
                <label>Admin</label>
                <select
                  id="isAdmin"
                  onChange={handleChange}
                  value={info.isAdmin || false}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>

              <button
                onClick={handleClick}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
                type="submit"
              >
                {loading ? "Updating..." : "Update User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
