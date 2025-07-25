import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ToastContext from "../context/ToastContext";

const LoginRegisterModal = ({ isOpen, onClose }) => {
  const { toast } = useContext(ToastContext);
  const { loginUser, registerUser, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError("");
    setSuccess("");

    // Validate password match in register mode
    if (!isLoginMode && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      if (isLoginMode) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });

        if (!response.error) {
          localStorage.setItem("token", response.token);
          setUser(response.user);
          toast.success("Logged in successfully!");
        } else {
          setError(response.error);
          setError(null);
        }
      } else {
        const response = await registerUser({
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
        });

        if (!response.error) {
          toast.success("Registered successfully!");
          setIsLoginMode(true); // Switch to login mode
          setForm({ email: form.email, password: "" }); // Keep email for convenience
          return; // just switch to login
        } else {
          setError(response.error);
        }
      }

      setSuccess("Success");
      onClose(); // Close modal on success
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#229799]">
              {isLoginMode ? "Login" : "Register"}
            </h2>
            <button onClick={onClose} className="text-xl font-bold">
              ×
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                </div>
              </>
            )}

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
            />

            {!isLoginMode && (
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="w-full border px-3 py-2 rounded"
              />
            )}

            <button
              type="submit"
              className="w-full bg-[#229799] hover:bg-[#1f8c8d] text-white py-2 rounded"
            >
              {isLoginMode ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={handleToggleMode}
              className="text-[#229799] hover:underline"
            >
              {isLoginMode ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterModal;
