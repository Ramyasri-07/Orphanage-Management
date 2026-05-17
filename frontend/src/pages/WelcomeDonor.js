import { useEffect, useState } from "react";
import axios from "axios";

function WelcomeDonor() {

  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    const res = await axios.get("http://localhost:5000/api/needs/all");
    setNeeds(res.data);
  };

  const donate = async (id) => {
    const amount = prompt("Enter donation amount");

    if (!amount) return;

    const res = await axios.post("http://localhost:5000/api/needs/donate", {
      needId: id,
      amount
    });

    alert(res.data.message);
  };

  return (
    <div>

      <h1>Donor Dashboard</h1>

      {/* DISPLAY ALL NEEDS */}
      {needs.map((n, i) => (
        <div key={i} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>

          <h3>{n.title}</h3>
          <p>{n.description}</p>
          <p>Category: {n.category}</p>
          <p>Target: ₹{n.targetAmount}</p>
          <p>Deadline: {n.deadline}</p>

          <button onClick={() => donate(n._id)}>
            Donate
          </button>

        </div>
      ))}

    </div>
  );
}

export default WelcomeDonor;