import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ background: "#0b5cff", padding: "12px 20px", color: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>Lost & Found</Link>
        <div>
          <Link to="/add" style={{ color: "#fff", textDecoration: "none", background: "#fff3", padding: "8px 10px", borderRadius: 6 }}>+ Report</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
