import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      // console.log("Validation failed");
      return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {  
      setError("Please enter a valid email address.");
      // console.log("Validation failed");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      // console.log("Validation failed");
      return false;
    }

    setError("");
    // console.log("Validation successful");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("Submitting registration form");
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Password:", password);

    if (validate()) {
      const userData = { name, email, password };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("registration successful");

      navigate("/");
    }
  };
      
  
    return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT card */}
          <div className="left-card">
            <div className="art-wrap">
              <img src="/Register.png" alt="register" className="float" />
            </div>
          </div>

          {/* RIGHT  card*/}
          <div className="right-card">
            <form className="form" onSubmit={handleSubmit}>
              <h2>Registration</h2>

              <input type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              />

              <input type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
              
              <input type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="error-message">{error}</p>}

              
              <button className="btn" type="submit">
                Register
              </button>

             
              <p
                className="back-link"
                onClick={() => navigate("/")}
              >
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
