import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/authService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // user types input,re-check the form
  useEffect(() => {
    validateForm();
  }, [name, email, password]);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setIsValid(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      setIsValid(false);
      return;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsValid(false);
      return;
    }

    setError("");
    setIsValid(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      //  success > go to login
      navigate("/");
    } catch (err) {
      // backend error message shown here
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // check if user aleady exists
    const existingUser = JSON.parse(localStorage.getItem("user"));

    if (existingUser && existingUser.email === email.trim()) {
      setError("User with this email already exists.");
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    console.log("registration successful");

    navigate("/");
  };

  // show Password toggle
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT card */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img src="/Register.png" alt="register" className="float" />
            </div>
          </div>

          {/* RIGHT  card*/}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-5 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold">Registration</h2>

              <input
                type="text"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="border-2 relative border-gray-300 px-3 py-3 rounded-2xl">
                <input
                  type={showPassword ? "text" : "password"}
                  className="outline-none w-full"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className="ri-eye-line absolute right-2.5 top-2.5 text-lg text-blue-500 cursor-pointer"
                  onClick={toggleShowPassword}
                ></i>
              </div>

              {error && <p className="error-message text-[#EF4444]">{error}</p>}

              {/* Disable button until valid */}
              <button
                className="btn"
                type="submit"
                disabled={!isValid || loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="back-link" onClick={() => navigate("/login")}>
                Go back to log in
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
