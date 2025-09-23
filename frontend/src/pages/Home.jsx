import React, { useEffect, useState } from "react";
import API from "../api";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(""); // "", "lost", "found"
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType) params.type = filterType;
      if (search) params.search = search;
      const res = await API.get("/items", { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []); // initial

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Search (title, desc, location)" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={fetchItems}>Search</button>
        <button onClick={() => { setFilterType(""); fetchItems(); }}>All</button>
        <button onClick={() => { setFilterType("lost"); fetchItems(); }}>Lost</button>
        <button onClick={() => { setFilterType("found"); fetchItems(); }}>Found</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {items.length === 0 ? <p>No posts found.</p> :
            items.map(item => <ItemCard key={item._id} item={item} onDelete={handleDelete} />)
          }
        </>
      )}
    </div>
  );
}
