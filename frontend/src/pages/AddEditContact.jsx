import { useContext, useEffect, useState } from "react";
import apiConnect from "../utils/apiConnect";
import ToastContext from "../context/ToastContext";
import ClipLoader from "react-spinners/ClipLoader"; // ⬅️ Import spinner

const AddEditContact = ({ isOpen, onClose, handleSubmit, contact }) => {
  const { toast } = useContext(ToastContext);
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  

  const [loading, setLoading] = useState(false); // ⬅️ Loading state

  useEffect(() => {
    if (contact) {
      setForm({
        id: contact._id,
        name: contact.name || "",
        address: contact.address || "",
        email: contact.email || "",
        phone: contact.phone?.toString() || "",
      });
    } else {
      setForm({
        name: "",
        address: "",
        email: "",
        phone: "",
      });
    }
  }, [contact]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#229799]">
            {contact ? "Edit Contact" : "Add Contact"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">
            ×
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
          />
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
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone (7–15 digits)"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-[#229799] hover:bg-[#1f8c8d] text-white py-2 rounded ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                Saving...
              </>
            ) : (
              contact ? "Update" : "Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditContact;
