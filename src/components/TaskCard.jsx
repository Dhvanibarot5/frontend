import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task, user }) {
  const { isRefresh, setIsRefresh } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${BASE_URL}/tasks/complete/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setIsRefresh(!isRefresh);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${BASE_URL}/tasks/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success(response.data.message);
      setIsRefresh(!isRefresh);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex justify-center py-4">
      <div
        className={`rounded-lg shadow-md p-6 w-full lg:w-3/4 xl:w-2/3 transition-all hover:shadow-xl ${
          task.isCompleted ? "bg-gray-100" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3
            className={`text-xl font-semibold leading-tight ${
              task.isCompleted ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>
          <span className="text-sm text-gray-600">
            {user.role === "user" && task.createdBy.name === user.name
              ? "By: @You"
              : `By: @${task.createdBy.name}`}
          </span>
        </div>

        <p
          className={`text-md mb-4 leading-relaxed ${
            task.isCompleted ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {task.description}
        </p>

        <div className="flex justify-between items-center text-sm mb-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Status:</span>
            <span
              className={
                task.isCompleted ? "text-green-500" : "text-red-500"
              }
            >
              {task.isCompleted ? "Done" : "Pending"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Category:</span>
            <span
              className={
                task.category === "high"
                  ? "text-red-500"
                  : task.category === "medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }
            >
              {task.category}
            </span>
          </div>
          {user.role !== "user" && (
            <div className="text-gray-600">
              <span className="font-medium">For:</span> @{task?.assignTo?.name}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              task.isCompleted
                ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            onClick={() => completeTask(task._id)}
          >
            {task.isCompleted ? "Mark as Pending" : "Mark as Done"}
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            onClick={() => deleteTask(task._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
