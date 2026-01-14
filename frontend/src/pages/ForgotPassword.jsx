import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      return "Please enter your email";
    }
    return "";
  };

  useEffect(() => {
    const errorMsg = validateForm();
    setError(errorMsg);
    setIsValid(!errorMsg);
  }, [email]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setSubmitted(true); // stop page reload

    if (!isValid) {
      return;
    }

    // later: API call to send OTP
    navigate("/otp"); // open OTP page
  };

  return (
    <div className="bg-[#eef4ff] w-full h-full flex justify-center items-center px-14 py-10">
      <div className="rounded-2xl h-[90vh] p-4 outer-card border-2 border-gray-300">
        <div className="grid grid-cols-2">
          {/* LEFT */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center p-6 md:p-10">
            <div className="w-full h-145 max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-center">
              <img
                src="/forgetpass.png"
                alt="forgot password"
                className="w-full float h-auto object-contain"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-10 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSendOtp}
            >
              <h2 className="text-2xl font-bold">
                Forgot <br /> Password
              </h2>

              <input
                type="email"
                className="border-2 w-full mr-14 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn" type="submit" disabled={!isValid}>
                Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
