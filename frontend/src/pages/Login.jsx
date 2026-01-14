import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // holds what user types in the from 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI raleted states
  const [error, setError] = useState(""); 
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  
// checks if required fields are filled
  // This runs before enabling the submit button 
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "Please fill in all fields.";
    }
    //If email format is valid
      return "";
    };

// Re-validate the form whenever email or password changes
    useEffect(() => {
    const errorMsg = validateForm();
    setError(errorMsg);
    setIsValid(!errorMsg);
  }, [email, password]);

// called when user clicks the login button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Dont called login if form is invalid
    if (!isValid)
      return;
    

    setLoading(true);
    setError("");

    try {
      await loginUser({ email, password });
      // Tokens are already stored in authService
      // Navigate after successful login
      navigate("/leads");
    } catch (err) {
      // show backend error if available, else generic message
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  // show / hide password text
  const togglePassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img src="/login.png" alt="illustration" className="float" />
            </div>
          </div>

          {/* RIGHT - login form*/}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-5 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold">Log In</h2>

          {/* Email or phone input */}
              <input
                type="text"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Email / Phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password field with show/hide option */}
              <div className="border-2 relative border-gray-300 px-3 py-3 rounded-2xl">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full outline-none"
                  placeholder="EnterPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className="ri-eye-line absolute right-2.5 top-2.5 text-lg text-blue-500 cursor-pointer"
                  onClick={togglePassword}
                ></i>
              </div>

              {/* when user shows error after submission */}
              {submitted && error && <p style={{ color: "red" }}>{error}</p>}

              {/* Disable button until valid */}
              <button
                className="btn"
                type="submit"
                disabled={!isValid || loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="flex justify-between">
                {/* <span
                  className="link hover:text-orange-500 text-[#0a84ff] cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span> */}

                <span
                  className="link2 hover:text-orange-500 text-[#0a84ff] cursor-pointer"
                  onClick={() => navigate("/forgot")}
                >
                  Forgot Password
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
