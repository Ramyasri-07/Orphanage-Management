import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrphanageAuth() {

  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  const [formData, setFormData] = useState({
    orphanageName: "",
    personName: "",
    phone: "",
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
      "http://localhost:5000/api/orphanage/signup",
      formData
    );

    alert(res.data.message);
  };

  const sendOtp = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/orphanage/send-otp",
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
      "http://localhost:5000/api/orphanage/verify-otp",
      {
        login: formData.login,
        otp: formData.otp
      }
    );

    alert(res.data.message);

   if (res.data.success) {
  navigate("/welcome-orphanage");
}
  };

  return (
    <div>

      <h1>Orphanage Login / Signup</h1>

      {isSignup ? (
        <>
          <input name="orphanageName" placeholder="Orphanage Name" onChange={handleChange} />
          <input name="personName" placeholder="Person Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />

          <button onClick={handleSignup}>Signup</button>
        </>
      ) : (
        <>
          <input
            name="login"
            placeholder="Email or Phone"
            onChange={handleChange}
          />

          {!showOtp ? (
            <button onClick={sendOtp}>Send OTP</button>
          ) : (
            <>
              <input name="otp" placeholder="Enter OTP" onChange={handleChange} />

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

export default OrphanageAuth;