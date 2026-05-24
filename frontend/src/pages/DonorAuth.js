import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorAuth() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authRole") === "donor") {
      navigate("/welcome-donor");
    }
  }, [navigate]);

  const [isSignup, setIsSignup] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    login: "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/donor/signup",
      formData
    );

    alert(res.data.message);
  };

  const sendOtp = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/donor/send-otp",
      {
        login: formData.login
      }
    );

    alert(res.data.message);

    if (res.data.success) {
      setShowOtp(true);
    }
  };

  const verifyOtp = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/donor/verify-otp",
      {
        login: formData.login,
        otp: formData.otp
      }
    );

    alert(res.data.message);

    if (res.data.success) {
      localStorage.setItem("authRole", "donor");
      localStorage.setItem("authLogin", formData.login);
      navigate("/welcome-donor");
    }
  };

  return (
    <div>

      <h1>Donor Login / Signup</h1>

      {isSignup ? (
        <>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="mobile" placeholder="Mobile" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />

          <button onClick={handleSignup}>Signup</button>
        </>
      ) : (
        <>
          <input
            name="login"
            placeholder="Email or Mobile"
            onChange={handleChange}
          />

          {!showOtp ? (
            <button onClick={sendOtp}>Send OTP</button>
          ) : (
            <>
              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
              />

              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}
        </>
      )}

      <p onClick={() => {
        setIsSignup(!isSignup);
        setShowOtp(false);
      }}>
        {isSignup ? "Already have account? Login" : "New User? Signup"}
      </p>

    </div>
  );
}

export default DonorAuth;