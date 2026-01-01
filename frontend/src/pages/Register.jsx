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

  const handleSubmit = async(e) => {
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

    if (existingUser && existingUser.email === email.trim()){
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

              {/* Disable button until valid */}
              <button className="btn" type="submit" disabled={!isValid || loading}>
                {loading ? "Registering..." : "Register"}
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
