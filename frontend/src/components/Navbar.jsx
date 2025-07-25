import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.png";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useState, useContext } from "react";
import LoginRegister from "../pages/LoginRegister";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const NavBar = ({ setShowLoginModal }) => {
  const { toast } = useContext(ToastContext);
  const [showFormModal, setShowFormModal] = useState(false);
  const { user, setUser } = useContext(AuthContext); // ✅ Access user from context

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setUser(null);
    toast.success("Logged out!");
  };

  return (
    <>
      <nav className="bg-[#48CFCB] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            </Link>

            {/* Nav Links */}
            <div className="flex items-center space-x-4">
              <SearchBar />

              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-[#48CFCB] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <HiOutlineUserCircle
                  onClick={() => setShowLoginModal(true)}
                  className="h-8 w-8 cursor-pointer hover:text-gray-200"
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login/Register Modal */}
      <LoginRegister
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
      />
    </>
  );
};

export default NavBar;
