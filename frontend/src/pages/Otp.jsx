import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const Otp = () => {
  const navigate = useNavigate();
 
  // otp digist states
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  //  refs to input boxes for auto focus
  const inputRefs = useRef([]);

  // countdown timer for resend otp
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

  // handel typeing in otp inputs
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // auto focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  //  verify the otp
  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    //  Demo OTP check (for UI project)
    if (enteredOtp === "1234") {
      navigate("/reset");
    } else {
      setError("Invalid OTP");
    }
  };

  // resend the otp logic
  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(30);
    setCanResend(false);
    setError("");
    inputRefs.current[0].focus();
  };

  // Check if all otp digits are filled
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="bg-[#eef4ff] flex justify-center items-center px-14 py-10">
      <div className="rounded-2xl p-4 outer-card border-2 border-gray-300">
        <div className="grid grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center p-6 md:p-10">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-center">
              <img
                src="/otp.png"
                alt="OTP illustration"
                className="w-full h-auto float object-contain"
              />
            </div>
          </div>

          {/* RIGHT OTP CARD */}
          <div className="flex justify-end items-center">
            <div className="w-90 bg-white px-5 py-10 rounded-2xl border-2 border-gray-300 flex flex-col gap-5">
              <h2 className="text-2xl font-bold pb-5">Enter OTP</h2>

              {/* OTP INPUTS */}
              <div className="otp-inputs mr-14 w-full flex gap-6 justify-center items-center">
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
                className="btn text-lg"
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
