import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      // console.log("Validation failed");
      return false;
    }

    // console.log("Validation successful");
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("Email:", email);
    // console.log("Password:", password);

    if (!validate()) return;
    
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser ){
      setError("No user found. Please register first.");
      return;
    }
    if (email === storedUser.email && 
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
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button className="btn" type="submit">
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
