import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { notifyTaskUpdate } from "../js/socket.js";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("medium");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const sendData = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/tasks/register`,
        {
          title,
          description,
          category,
          assignTo: selectedUserId,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notifyTaskUpdate(response.data.message);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      navigate("/addTask");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setUser(response.data.data);
        setSelectedUserId(response.data.data._id);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    const selectUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/getAllUsers`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setUsers(response.data.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
    selectUser();
  }, [BASE_URL, navigate]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Add a New Task</h2>
        <form className="space-y-6" onSubmit={sendData}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {user.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            type="submit"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
