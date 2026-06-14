import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WelcomeNGO() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authRole") !== "ngo" || !localStorage.getItem("authLogin")) {
      navigate("/ngo-auth");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("authRole");
    localStorage.removeItem("authLogin");
    navigate("/ngo-auth");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Welcome to HopeBridge NGO</h1>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default WelcomeNGO;