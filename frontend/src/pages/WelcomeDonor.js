import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function WelcomeDonor() {
  const navigate = useNavigate();
  const [needs, setNeeds] = useState([]);
  // STEP 2 — Add State Variable
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authRole") !== "donor" || !localStorage.getItem("authLogin")) {
      navigate("/donor-auth");
      return;
    }

    fetchNeeds();
  }, [navigate]);

  const fetchNeeds = async () => {
    const res = await axios.get("https://orphanage-backend-dgaf.onrender.com/api/needs/all");
    
    setNeeds(res.data);
  };

  const logout = () => {
    localStorage.removeItem("authRole");
    localStorage.removeItem("authLogin");
    navigate("/donor-auth");
  };

  const donate = (id) => {
    setSelectedNeed(id);
    setShowModal(true);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Donor Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* DISPLAY ALL NEEDS */}
{needs.map((n) => (
  <div key={n._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
    <h3>{n.title}</h3>
    <p>{n.description}</p>
    <p>Category: {n.category}</p>

    <p>Target: ₹{n.targetAmount}</p>
    <p>Donated: ₹{n.donatedAmount || 0}</p>
    <p>Remaining: ₹{n.remainingAmount}</p>

    <p>Deadline: {n.deadline}</p>

    <button onClick={() => donate(n._id)}>
      Donate
    </button>
  </div>
))}

      {/* Donation Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: 30, borderRadius: 8, minWidth: 300 }}>
            <h2>Donate</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
            {/* STEP 1 — Add Payment Method Dropdown */}
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <option value="">Select Payment Method</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={async () => {
                // STEP 4 — Add Validation
                if (!amount || isNaN(amount) || Number(amount) <= 0) {
                  alert("Enter valid donation amount");
                  return;
                }
                if (paymentMethod === "") {
                  alert("Select payment method");
                  return;
                }
                // STEP 3 — Generate Transaction ID
                const transactionId = "TXN" + Date.now();
                try {
                  // STEP 6 — Send Data To Backend
                  await axios.post("https://orphanage-backend-dgaf.onrender.com/api/needs/donate", {
                    amount: Number(amount),
                    paymentMethod,
                    transactionId,
                    needId: selectedNeed,
                    donorLogin: localStorage.getItem("authLogin")
                  });
                  await fetchNeeds();
                  // STEP 5 — Show Success Message
                  alert(`Donation Successful!\nTransaction ID: ${transactionId}`);
                  setShowModal(false);
                  setAmount("");
                  setPaymentMethod("");
                  setSelectedNeed(null);
                } catch (err) {
                  console.error("Donation error:", err, err?.response?.data);
                  alert("Error processing donation");
                }
              }}>Donate</button>
              <button onClick={() => {
                setShowModal(false);
                setAmount("");
                setPaymentMethod("");
                setSelectedNeed(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomeDonor;