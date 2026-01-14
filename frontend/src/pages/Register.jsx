import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/authService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  // Form fileds
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI states
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // user types input,re-check the form
  useEffect(() => {
    validateForm();
  }, [name, email, password]);

  // Validates all fileds before allowing submit
  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setIsValid(false);
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      setIsValid(false);
      return;
    }

    // user types password rule
    if (password.length() < 6) {
      setError("Password must be at least 6 characters long.");
      setIsValid(false);
      return;
    }
//  if all validations pass
    setError("");
    setIsValid(true);
  };
  
// Submit registaration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent invalid submit
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      // send data to backend
      await registerUsers({
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
    };


  // show Password toggle
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="bg-[#eef4ff] flex justify-center items-center px-14 py-10">
      <div className="rounded-2xl p-4 outer-card border-2 border-gray-300">
        <div className="grid grid-cols-2">

          {/* LEFT card */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center p-6 md:p-10">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-centerr">
              <img
                src="/Register.png"
                alt="register"
                className="w-full float h-auto object-contain"
              />
            </div>
          </div>

          {/* RIGHT  card*/}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-10 mr-14 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold">Registration</h2>

              <input
                type="text"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Enter your name"
                value={names}
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

              <p className="back-link" onClick={() => navigate("/")}>
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
