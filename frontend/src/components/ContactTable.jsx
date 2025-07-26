import { useState, useEffect, useContext } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import DeleteConfirmPopup from "../pages/DeleteConfirmPopup";
import AddEditContact from "../pages/AddEditContact";
import apiConnect from "../utils/apiConnect"; // adjust path as needed
import AuthContext from "../context/AuthContext";
import SearchBar from "./SearchBar";

const ContactTable = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedContactData, setSelectedContactData] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(contacts.length / pageSize);
  const indexOfFirst = (currentPage - 1) * pageSize;
  const indexOfLast = currentPage * pageSize;
const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);

  const fetchContacts = async () => {
    try {
      const data = await apiConnect.get("/mycontacts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContacts(data.contacts || []);
      setFilteredContacts(data.contacts || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const result = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(result);
     setCurrentPage(1); 
  }, [searchTerm, contacts]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDeleteModal = (id) => {
    setSelectedContactId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await apiConnect.delete(`/delete/${selectedContactId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchContacts(); // Refresh the contact list
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow-md p-4">
      {/* Top Controls: Page size + Pagination icons */}
      <div className="flex flex-wrap justify-between items-center mb-3 gap-3">
        <h2 className="text-xl font-semibold text-[#229799]">Contact List</h2>
        {user && <SearchBar setSearchTerm={setSearchTerm} />}
      </div>

      {/* Contact Table */}
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-[#48CFCB] text-white">
          <tr>
            <th className="px-4 py-2">S.No</th>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map((contact, idx) => (
            <tr key={contact._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{indexOfFirst + idx + 1}</td>
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.address}</td>
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedContactId(contact._id);
                      setSelectedContactData(contact);
                      setShowFormModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <HiPencil className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => openDeleteModal(contact._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Page Controls & Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 w-full">
        {/* Left: Page Size Dropdown */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="pageSize"
            className="text-sm font-medium text-gray-700"
          >
            Show Top:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        {/* Center: Pagination */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-40"
            title="Previous"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page <strong className="mx-1">{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-40"
            title="Next"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Edit Contact */}
      <AddEditContact
        isOpen={showFormModal}
        contact={selectedContactData}
        onClose={() => setShowFormModal(false)}
      />

      {/* Confirm Delete */}
      <DeleteConfirmPopup
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ContactTable;
