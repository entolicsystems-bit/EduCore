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

  // check validation
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "Please fill in all fields.";
    }
    return "";
  };

  // validate on input change
  useEffect(() => {
    const errorMsg = validateForm();
    setError(errorMsg);
    setIsValid(!errorMsg);
  }, [email, password]);

  // handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Prevent multiple submits
  if (loading) return;

  setSubmitted(true);

  // ✅ Stop if validation fails
  if (!isValid) return;

  setLoading(true);
  setError("");

  try {
    await loginUser({ email, password });

    // ✅ Navigate only after success
    navigate("/leads", { replace: true });
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Login failed. Please try again after some time."
    );
  } finally {
    setLoading(false);
  }
};


  // show / hide password text
  const togglePassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="container bg-[#eef4ff]  flex justify-center items-center px-14 py-10">
      <div className="container-box rounded-2xl p-4 outer-card border-2 border-gray-300">
        <div className="grid grid-cols-2">
          {/* LEFT */}
          <div className="left-card border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center p-6 md:p-10">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-center">
              <img
                src="/login.png"
                alt="illustration"
                className="w-full float h-auto object-contain"
              />
            </div>
          </div>

          {/* RIGHT - login form*/}
          <div className="right-card flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-10 mr-14 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
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
                className="btn text-lg"
                type="submit"
                disabled={loading}
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
