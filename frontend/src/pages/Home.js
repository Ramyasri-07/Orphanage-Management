import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="home">

      <h1>HopeBridge</h1>

      <button
        onClick={() =>
          navigate("/donor-auth")
        }
      >
        Donate Now
      </button>

      <button
        onClick={() =>
          navigate("/orphanage-auth")
        }
      >
        Post a Need
      </button>

      <button
        onClick={() =>
          navigate("/ngo-auth")
        }
      >
        NGO Access
      </button>

    </div>
  );
}

export default Home;