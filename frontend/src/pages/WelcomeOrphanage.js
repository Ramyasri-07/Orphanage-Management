import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WelcomeOrphanage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [needs, setNeeds] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    targetAmount: "",
    deadline: ""
  });

  const userEmailOrPhone = localStorage.getItem("authLogin");

  // FETCH NEEDS (NO useCallback — avoids Vercel ESLINT issues)
  const fetchNeeds = async () => {
    try {
      const res = await axios.get(
        `https://orphanage-backend-dgaf.onrender.com/api/needs/orphanage?login=${encodeURIComponent(
          userEmailOrPhone
        )}`
      );
      setNeeds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // AUTH CHECK + LOAD DATA
  useEffect(() => {
    if (
      localStorage.getItem("authRole") !== "orphanage" ||
      !userEmailOrPhone
    ) {
      navigate("/orphanage-auth");
      return;
    }

    fetchNeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // POST NEED
  const postNeed = async () => {
    try {
      if (form.description.length > 500) {
        return alert("Description max 500 characters");
      }

      const res = await axios.post(
        "https://orphanage-backend-dgaf.onrender.com/api/needs/create",
        {
          login: userEmailOrPhone,
          title: form.title,
          description: form.description,
          category: form.category,
          targetAmount: form.targetAmount,
          deadline: form.deadline
        }
      );

      alert(res.data.message);

      setShowForm(false);
      fetchNeeds();

      setForm({
        title: "",
        description: "",
        category: "",
        targetAmount: "",
        deadline: ""
      });
    } catch (err) {
      console.log(err);
      alert("Error posting need");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Orphanage Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("authRole");
            localStorage.removeItem("authLogin");
            navigate("/orphanage-auth");
          }}
        >
          Logout
        </button>
      </div>

      {/* POST BUTTON */}
      <button onClick={() => setShowForm(true)}>Post a Need</button>

      {/* FORM */}
      {showForm && (
        <div style={{ border: "1px solid black", padding: 10 }}>
          <input
            name="title"
            placeholder="Need Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description (max 500 chars)"
            maxLength={500}
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />

          <input
            name="targetAmount"
            placeholder="Target Amount"
            value={form.targetAmount}
            onChange={handleChange}
          />

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />

          <button onClick={() => setShowForm(false)}>Cancel</button>
          <button onClick={postNeed}>Post</button>
        </div>
      )}

      {/* DISPLAY NEEDS */}
      <h2>Your Posted Needs</h2>

      {needs.length === 0 ? (
        <p>No needs posted yet</p>
      ) : (
        needs.map((n, i) => (
          <div
            key={i}
            style={{ border: "1px solid gray", margin: 10, padding: 10 }}
          >
            <h3>{n.title}</h3>
            <p>{n.description}</p>
            <p>Category: {n.category}</p>
            <p>Target: ₹{n.targetAmount}</p>
            <p>Deadline: {n.deadline}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default WelcomeOrphanage;