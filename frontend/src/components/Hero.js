import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  return (

    <div className="hero">

      <div className="hero-left">

        <h1>

          Bridge the Gap Between

          <span> Hope and Help</span>

        </h1>

        <p>

          HopeBridge connects donors,
          orphanages and NGOs together.

        </p>

        <div className="hero-buttons">

          <button
            className="fill-btn"

            onClick={() =>
              navigate("/donor-auth")
            }
          >
            Donate Now
          </button>



          <button
            className="outline-btn"

            onClick={() =>
              navigate("/orphanage-auth")
            }
          >
            Post a Need
          </button>

        </div>

      </div>



      <div className="hero-right">

        <img
          src="https://images.unsplash.com/photo-1516627145497-ae6968895b74"

          alt=""
        />

      </div>

    </div>
  );
}

export default Hero;