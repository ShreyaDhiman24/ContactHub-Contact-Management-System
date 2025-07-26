import { useEffect, useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import apiConnect from "../utils/apiConnect"; // adjust path as needed

const SearchBar = ({ setSearchTerm }) => {
  const [contacts, setContacts] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setInputValue("");
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue); // Pass the value up to parent
    // setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-lg px-2 py-1 shadow-md"
        >
          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="text-gray-800 px-2 py-1 w-48 sm:w-64 focus:outline-none rounded-l-lg"
          />
          <button
            type="submit"
            className="text-[#229799] hover:text-[#1f8c8d] px-2"
          >
            <HiMagnifyingGlass className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleSearchToggle}
            className="text-gray-500 hover:text-gray-700 px-1"
          >
            <HiMiniXMark className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <button
          onClick={handleSearchToggle}
          className="text-[#1f8c8d] hover:text-gray-200"
        >
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
