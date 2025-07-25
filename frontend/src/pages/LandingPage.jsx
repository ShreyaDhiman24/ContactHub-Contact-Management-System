const LandingPage = ({ setShowLoginModal }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-[#d9f2f2] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-[#229799] mb-4">
        Welcome to ContactHub
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
        Manage your contacts effortlessly with ContactHub – Add, Edit, and Keep track of important details in one place.
      </p>
      <button
        onClick={() => setShowLoginModal(true)}
        className="bg-[#229799] hover:bg-[#1f8c8d] text-white px-6 py-3 rounded-lg text-lg transition shadow-lg"
      >
        Login/Register to Get Started
      </button>
    </div>
  );
};

export default LandingPage;
