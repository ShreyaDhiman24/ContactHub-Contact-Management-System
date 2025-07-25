import { useContext, useState } from "react";
import ContactTable from "../components/ContactTable";
import AddEditContact from "./AddEditContact";
import AuthContext from "../context/AuthContext";
import LandingPage from "./LandingPage";

const Home = ({ setShowLoginModal }) => {
  const { user } = useContext(AuthContext);
  const [showFormModal, setShowFormModal] = useState(false);

  const handleFormSubmit = (formData) => {
    setShowFormModal(false);
  };

  if (!user) return <LandingPage setShowLoginModal={setShowLoginModal} />;

  return (
    <div>
      <div className="flex justify-between items-start space-x-4">
        <h2 className="text-2xl font-semibold mb-4 text-[#229799]">
          Hi, {user.firstname}
        </h2>
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-[#229799] hover:bg-[#1f8c8d] text-white px-4 py-2 rounded-md transition"
        >
          + Add Contact
        </button>
      </div>
      <ContactTable />
      <AddEditContact
        isOpen={showFormModal}
        contact={null}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Home;
