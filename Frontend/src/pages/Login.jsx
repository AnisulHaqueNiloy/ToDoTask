import { useContext, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
// import { Helmet } from "react-helmet";
import { AuthContext } from "../AuthProvider/AuthProvider";
import axios from "axios";
// import Lottie from "lottie-react";
// import logine from "../assets/login.json";
// import UseAxiosPublic from "../CUstomHooks/UseAxiosPublic";

const Login = () => {
  const [showPass, setshow] = useState(false);
  const [ferror, setError] = useState("");
  const emailref = useRef();
  const location = useLocation();
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault(); // Fixed typo
    const email = e.target.email.value;
    const password = e.target.password.value;

    setError(""); // Reset error state

    loginUser(email, password)
      .then((currentuser) => {
        const user = currentuser.user;
        Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${user.email}!`,
          icon: "success",
          confirmButtonText: "OK",
        });
        console.log(user);
        e.target.reset(); // Clear form
        navigate(location?.state ? location.state : "/"); // Navigate to appropriate route
      })
      .catch((error) => {
        console.log(error);
        setError(error.message); // Set error state
        Swal.fire({
          title: "Oops",
          text: error.message, // Use error.message here
          icon: "warning",
          confirmButtonText: "OK",
        });
      });
  };

  const loginGoogle = () => {
    loginWithGoogle().then((res) => {
      const user = res.user;
      console.log(user);
      const userInfo = {
        email: user.email,
        name: user.displayName,
        role: "",

        photoURL: user.photoURL,
      };
      axios.post("http://localhost:5000/users", userInfo).then((res) => {
        console.log(res.data);
        navigate("/");
      });

      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${user.email}!`,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/");
      navigate(location?.state ? location.state : "/");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet> */}
      <div className="flex md:flex-row-reverse flex-col gap-5 md:flex-row items-center justify-center">
        {/* <div>
          <Lottie animationData={logine}></Lottie>
        </div> */}
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back!
          </h2>

          {/* Email/Password Form */}
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                ref={emailref}
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setshow(!showPass)}
                className="bg-transparent btn btn-xs absolute right-4 bottom-3"
              >
                {" "}
                {showPass ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 hover:bg-blue-600"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-400 my-6">OR</div>

          {/* Google Login */}
          <button
            onClick={loginGoogle}
            className="btn btn-outline btn-accent w-full flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-lg" />
            Sign in with Google
          </button>

          {/* Footer Links */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Dont have an account?{" "}
            <a className="text-blue-500 hover:underline">
              <NavLink to={"/signup"}>Register</NavLink>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
