import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
