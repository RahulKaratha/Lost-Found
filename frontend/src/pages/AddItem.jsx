import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "lost",
    title: "",
    location: "",
    description: "",
    image: "",
    contact: "",
    status: "open"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/items", form);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <h2>New Post</h2>

      <label>
        Type
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </label>

      <label>
        Title *
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </label>

      <label>
        Location
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </label>

      <label>
        Description
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>

      <label>
        Image URL
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </label>

      <label>
        Contact
        <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
      </label>

      <label>
        Status
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="open">Open</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>
      </label>

      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  );
}


