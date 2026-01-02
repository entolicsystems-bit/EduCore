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


    if (!validateForm()){
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

  return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT */}
          <div className="left-card">
            <div className="art-wrap">
              <img src="/login.png" alt="illustration" className="float" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-card1">
            <form className="form" onSubmit={handleSubmit}>
              <h2>Log In</h2>

              <input type="text" 
              placeholder="Email / Phone"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              />

              <input type="password" 
              placeholder="EnterPassword" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              {/* when user shows error after submission */}
              {submitted && error && (
                <p style={{ color: "red" }}>{error}</p>
                )}

              {/* Disable button until valid */}
                <button className="btn" type="submit" 
                disabled={!isValid || loading}
                >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="links">
                {/* <span
                  className="link"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span> */}

                <span
                  className="link2"
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
