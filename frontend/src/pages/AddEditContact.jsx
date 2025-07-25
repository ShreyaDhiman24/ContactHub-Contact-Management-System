import { useContext, useEffect, useState } from "react";
import apiConnect from "../utils/apiConnect";
import ToastContext from "../context/ToastContext";

const AddEditContact = ({ isOpen, onClose, onSubmit, contact }) => {
  const { toast } = useContext(ToastContext);
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        id: contact._id,
        name: contact.name || "",
        address: contact.address || "",
        email: contact.email || "",
        phone: contact.phone?.toString() || "", // ensure it's a string
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (contact) {
        // UPDATE existing contact
        data = await apiConnect.put(`/contact/${contact._id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        // ADD new contact
        data = await apiConnect.post("/contact", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      toast.success("New Contact Added!");
      onSubmit(true);
      setForm({
        name: "",
        address: "",
        email: "",
        phone: "",
      });
      onClose(); // Close the modal/form
    } catch (err) {
      toast.error("Error submitting contact");
      console.error("Error submitting contact:", err);
      onSubmit(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-[#229799] hover:bg-[#1f8c8d] text-white py-2 rounded"
          >
            {contact ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditContact;
