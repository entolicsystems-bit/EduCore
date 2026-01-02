import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      // setError("Please fill in all fields.");
      setIsValid(false);
      return false;
    }

    // setError("");
    setIsValid(true);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/leads");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

          {/* RIGHT */}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-5 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold">Log In</h2>

              <input
                type="text"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Email / Phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

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
