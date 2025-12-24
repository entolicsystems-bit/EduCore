import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);


    if (!validateForm()){
      setError("Please fill in all fields.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser ){
      setError("No user found. Please register first.");
      return;
    }

    if (
      email === storedUser.email && 
      password === storedUser.password
    ) {
      localStorage.setItem("isLoggiedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
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
                <button className="btn" type="submit" disabled={!isValid}>
                Log In
              </button>

              <div className="links">
                <span
                  className="link"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>

                <span
                  className="link"
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
