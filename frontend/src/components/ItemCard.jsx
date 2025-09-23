import React from "react";

const ItemCard = ({ item, onDelete }) => {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12, display: "flex", gap: 12 }}>
      <div style={{ width: 110, height: 80, background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
        {item.image ? <img src={item.image} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 6 }} /> : <span style={{ color: "#888" }}>No image</span>}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ margin: 0 }}>{item.title}</h3>
          <span style={{ fontSize: 13, color: "#fff", background: item.type === "lost" ? "#e63946" : "#2a9d8f", padding: "4px 8px", borderRadius: 6 }}>
            {item.type.toUpperCase()}
          </span>
        </div>

        <p style={{ margin: "6px 0" }}>{item.description || <em>No description</em>}</p>
        <div style={{ fontSize: 13, color: "#555" }}>
          <strong>Location:</strong> {item.location || "—"} • <strong>Status:</strong> {item.status}
        </div>

        <div style={{ marginTop: 8 }}>
          <a href={`/edit/${item._id}`} style={{ marginRight: 12 }}>Edit</a>
          <button onClick={() => onDelete(item._id)} style={{ color: "#c00", background: "transparent", border: "none", cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
