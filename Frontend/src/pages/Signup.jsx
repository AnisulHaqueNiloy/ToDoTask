import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../AuthProvider/AuthProvider";
import axios from "axios";

const img_hosting_key = import.meta.env.VITE_IMBB_API;
const imghosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const Signup = () => {
  const { createUser, updateprofile } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const register = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Creating Account...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photo = e.target.photo.files[0];
    const role = e.target.role.value;

    const formData = new FormData();
    formData.append("image", photo);

    try {
      const imageResponse = await axios.post(imghosting_api, formData);
      const imageUrl = imageResponse.data.data.display_url;

      const passRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passRegex.test(password)) {
        setPassError(
          "Password must contain at least one uppercase, one lowercase, and be at least 6 characters long."
        );
        Swal.close();
        return;
      }

      await createUser(email, password);
      await updateprofile({ displayName: name, photoURL: imageUrl });

      const user = { name, email, photoURL: imageUrl, role, status: "" };
      const response = await axios.post("http://localhost:5000/users", user);

      if (response.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: `Welcome, ${name}! Your account has been successfully created.`,
        }).then(() => {
          navigate(location?.state ? location.state : "/");
        });
      } else {
        Swal.fire("Error", "Failed to save user in the database.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        "An error occurred while processing your request.",
        "error"
      );
    }

    e.target.reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form onSubmit={register} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input input-bordered w-full"
            required
          />
          <input
            type="file"
            name="photo"
            className="input input-bordered w-full"
            required
          />
          <select
            name="role"
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>
              Choose your role
            </option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="btn btn-xs absolute right-4 bottom-3"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passError && (
              <p className="text-xs text-red-500 mt-1">{passError}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-500 hover:underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
