// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddEditContact from "./pages/AddEditContact";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginRegisterModal from "./pages/LoginRegister";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar setShowLoginModal={setShowLoginModal} />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={<Home setShowLoginModal={setShowLoginModal} />}
            />
            <Route path="/add" element={<AddEditContact />} />
            <Route path="/edit/:id" element={<AddEditContact />} />
          </Routes>
        </div>
        {/* Global Login/Register Modal */}
        <LoginRegisterModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    </Router>
  );
};

export default App;
