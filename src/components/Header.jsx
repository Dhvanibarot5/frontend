import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-gray-100 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-200">Sundowners Enterprise</h1>
          <nav>
            <ul className="flex items-center space-x-6">
              {!isLoggedIn && (
                <>
                  <Link to="/signin">
                    <li className="hover:text-gray-400 transition">Sign In</li>
                  </Link>
                  <Link to="/signup">
                    <li className="hover:text-gray-400 transition">Sign Up</li>
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link to="/">
                    <li className="hover:text-gray-400 transition">Home</li>
                  </Link>
                  <Link to="/profile">
                    <li className="hover:text-gray-400 transition">Profile</li>
                  </Link>
                  <Link to="/addTask">
                    <li className="hover:text-gray-400 transition">Add Task</li>
                  </Link>
                  <button onClick={() => setLogoutModal(true)} className="hover:text-gray-400 transition focus:outline-none">
                    Log Out
                  </button>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {logoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-6 text-center">Are you sure you want to log out?</h2>
            <div className="flex justify-around">
              <Link
                to="/logout"
                onClick={() => setLogoutModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 focus:outline-none"
              >
                Log Out
              </Link>
              <button
                onClick={() => setLogoutModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
