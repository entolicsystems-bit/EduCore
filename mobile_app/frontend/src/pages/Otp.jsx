import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const Otp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // auto focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    // ✅ Demo OTP check (for UI project)
    if (enteredOtp === "1234") {
      navigate("/reset");
    } else {
      setError("Invalid OTP");
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(30);
    setCanResend(false);
    setError("");
    inputRefs.current[0].focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img src="/otp.png" alt="OTP illustration" className="float" />
            </div>
          </div>

          {/* RIGHT OTP CARD */}
          <div className="flex justify-end items-center">
            <div className="w-90 bg-white px-5 py-8 rounded-2xl border-2 border-gray-300 flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Enter OTP</h2>

              {/* OTP INPUTS */}
              <div className="otp-inputs flex gap-4 justify-center items-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                  />
                ))}
              </div>

              {error && <p className="error-text">{error}</p>}

              {/* VERIFY BUTTON */}
              <button
                className="btn"
                onClick={handleVerify}
                disabled={!isOtpComplete}
              >
                Verify
              </button>

              {/* RESEND BUTTON */}
              {!canResend ? (
                <p className="text-sm text-right">
                  Resend OTP in:{" "}
                  <span className="text-[#0a84ff]">
                    00:{timeLeft.toString().padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  className="resend-btn text-[#0a84ff] cursor-pointer text-right"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
