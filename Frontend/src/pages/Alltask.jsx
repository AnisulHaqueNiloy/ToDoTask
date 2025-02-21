import React, { useContext, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AuthContext } from "../authprovider/AuthProvider";
import UseAxios from "../UseAxios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa"; // Edit and Delete icons

const Alltask = () => {
  const [isEditing, setIsEditing] = useState(false); // State to track if you're editing a task
  const [editingTaskId, setEditingTaskId] = useState(null); // Store the ID of the task being edited

  const { user } = useContext(AuthContext);
  const axiosPublic = UseAxios();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/tasks?email=${user.email}`);
      return res.data;
    },
  });

  let toDoTasks = [];
  let inProgressTasks = [];
  let doneTasks = [];

  if (data && Array.isArray(data)) {
    // Filter tasks into separate variables
    toDoTasks = data.filter((task) => task.category === "To-Do");
    inProgressTasks = data.filter((task) => task.category === "In Progress");
    doneTasks = data.filter((task) => task.category === "Done");
  }

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: user?.uid,
    title: "",
    description: "",
    email: user?.email,
    category: "To-Do",
    status: "InComplete",
    dueDate: moment().format("YYYY-MM-DD"), // Default to today's date
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // add task
  const handleSubmit = async () => {
    if (!user?.uid) {
      console.error("User not logged in");
      return;
    }

    try {
      const taskData = { ...formData, userId: user.uid };

      if (isEditing) {
        // Update the task
        const response = await axiosPublic.put(
          `/tasks/${editingTaskId}`,
          taskData
        );
        console.log("Task updated successfully", response.data);
        Swal.fire({
          title: "Success!",
          text: "Task updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Add a new task
        await axiosPublic.post("/tasks", taskData);
        Swal.fire({
          title: "Success!",
          text: "Task added successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Refetch the data and close the modal
      refetch();
      setIsOpen(false);
      setIsEditing(false); // Reset the editing state after submission
      setEditingTaskId(null); // Reset the task ID
    } catch (error) {
      console.error("Error processing task:", error);
    }
  };

  // Handle Edit
  const handleEdit = (taskId) => {
    const taskToEdit = data.find((task) => task._id === taskId);
    setFormData({
      ...formData,
      title: taskToEdit.title,
      description: taskToEdit.description,
      category: taskToEdit.category,
      dueDate: taskToEdit.dueDate,
    });
    setIsEditing(true); // Mark as editing
    setEditingTaskId(taskId); // Store the task ID being edited
    setIsOpen(true); // Open the modal
  };

  // Handle Delete
  const handleDelete = async (taskId) => {
    if (!user?.uid) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axiosPublic.delete(`/tasks/${taskId}`);
      console.log(response.data); // Success message from the server
      refetch(); // Refresh the task list
      Swal.fire({
        title: "Success!",
        text: "Task deleted successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue deleting the task.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <div className="w-14 h-14 rounded p-2 bg-gray-400 flex flex-col justify-center items-center mb-8">
        <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <CiCirclePlus className="text-3xl" />
        </button>
      </div>

      {/* Category Data: To-Do */}
      {toDoTasks?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">To-Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toDoTasks.map((item, id) => (
              <div
                key={id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col border hover:bg-gray-100"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Created: {moment(item.createdAt).format("MMMM Do YYYY")}
                </p>
                <p className="text-gray-500 text-sm">
                  Due: {moment(item.dueDate).format("MMMM Do YYYY")}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                  <button className="cursor-pointer">Incomplete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Data: In Progress */}
      {inProgressTasks?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
            In Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressTasks.map((item, id) => (
              <div
                key={id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col border hover:bg-gray-100"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Created: {moment(item.createdAt).format("MMMM Do YYYY")}
                </p>
                <p className="text-gray-500 text-sm">
                  Due: {moment(item.dueDate).format("MMMM Do YYYY")}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                  <button className="cursor-pointer">Incomplete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Data: Done */}
      {inProgressTasks?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
            In Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressTasks.map((item, id) => (
              <div
                key={id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col border hover:bg-gray-100"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Created: {moment(item.createdAt).format("MMMM Do YYYY")}
                </p>
                <p className="text-gray-500 text-sm">
                  Due: {moment(item.dueDate).format("MMMM Do YYYY")}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                  <button className="cursor-pointer">Incomplete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Add New Task */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            ></textarea>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditing(false); // Reset editing state
                  setEditingTaskId(null);
                  handleSubmit(); // Reset task ID
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alltask;
