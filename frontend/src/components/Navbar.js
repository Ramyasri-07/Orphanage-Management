import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (

    <div className="navbar">

      <div className="logo">
        HopeBridge
      </div>

      <div className="nav-links">

        <p>Home</p>

        <p>About</p>

        <p>Contact</p>

      </div>

      <div className="nav-buttons">

        <button
          className="outline-btn"

          onClick={() =>
            navigate("/donor-auth")
          }
        >
          I am Donor
        </button>



        <button
          className="outline-btn"

          onClick={() =>
            navigate("/orphanage-auth")
          }
        >
          I am Orphanage
        </button>



        <button
          className="fill-btn"

          onClick={() =>
            navigate("/ngo-auth")
          }
        >
          NGO Access
        </button>

      </div>

    </div>
  );
}

export default Navbar;