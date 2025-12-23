import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();   // stop page reload

    // later: API call to send OTP
    navigate("/otp");  // open OTP page
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT */}
          <div className="left-card">
            <div className="art-wrap">
              <img src="/forgetpass.png" alt="forgot password" className="float" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-card forgot-card">
            <form className="form" onSubmit={handleSendOtp}>
              <h2>Forgot<br />Password</h2>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

              <button className="btn" type="submit">
                Send OTP
              </button>

              <p className="back-link" onClick={() => navigate("/")}>
                Go back to login
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
