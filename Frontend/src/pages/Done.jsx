import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../authprovider/AuthProvider";
import UseAxios from "../UseAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import moment from "moment";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const Done = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null); // For touch events
  const taskRefs = useRef([]); // Ref to store task elements

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

  if (data && Array.isArray(data)) {
    toDoTasks = data.filter((task) => task.category === "Done");
  }

  React.useEffect(() => {
    setTasks(toDoTasks);
  }, [data]);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: user?.uid,
    title: "",
    description: "",
    email: user?.email,
    category: "To-Do",
    status: "InComplete",
    dueDate: moment().format("YYYY-MM-DD"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      console.error("User not logged in");
      return;
    }

    try {
      const taskData = { ...formData, userId: user.uid };

      if (isEditing) {
        const response = await axiosPublic.put(
          `/tasks/${editingTaskId}`,
          taskData
        );
        Swal.fire({
          title: "Success!",
          text: "Task updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axiosPublic.post("/tasks", taskData);
        Swal.fire({
          title: "Success!",
          text: "Task added successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      refetch();
      setIsOpen(false);
      setIsEditing(false);
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error processing task:", error);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = data.find((task) => task._id === taskId);
    setFormData({
      ...formData,
      title: taskToEdit.title,
      description: taskToEdit.description,
      category: taskToEdit.category,
      dueDate: taskToEdit.dueDate,
    });
    setIsEditing(true);
    setEditingTaskId(taskId);
    setIsOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!user?.uid) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axiosPublic.delete(`/tasks/${taskId}`);
      refetch();
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

  // Drag and Drop Handlers
  const handleDragStart = (index) => {
    setDraggedTaskIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;

    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.splice(draggedTaskIndex, 1)[0];
    updatedTasks.splice(index, 0, draggedTask);

    setTasks(updatedTasks);
    setDraggedTaskIndex(null);
  };

  // Touch Handlers
  const handleTouchStart = (event, index) => {
    setDraggedTaskIndex(index);
    setTouchStartY(event.touches[0].clientY);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
  };

  const handleTouchEnd = (event, index) => {
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;

    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.splice(draggedTaskIndex, 1)[0];
    updatedTasks.splice(index, 0, draggedTask);

    setTasks(updatedTasks);
    setDraggedTaskIndex(null);
  };

  // Attach touch event listeners
  useEffect(() => {
    const taskElements = taskRefs.current;

    const handleTouchMove = (event) => {
      event.preventDefault(); // Now this will work without warnings
    };

    taskElements.forEach((taskElement) => {
      if (taskElement) {
        taskElement.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
      }
    });

    // Cleanup event listeners
    return () => {
      taskElements.forEach((taskElement) => {
        if (taskElement) {
          taskElement.removeEventListener("touchmove", handleTouchMove);
        }
      });
    };
  }, [tasks]); // Re-attach listeners when tasks change

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Completed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tasks added yet.
            </div>
          ) : (
            tasks?.map((item, id) => (
              <motion.div
                key={item._id}
                ref={(el) => (taskRefs.current[id] = el)} // Attach ref to each task
                className="bg-white p-4 rounded-lg shadow-md flex flex-col border hover:bg-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 50 }}
                draggable
                onDragStart={() => handleDragStart(id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(id)}
                onTouchStart={(e) => handleTouchStart(e, id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, id)}
                layout
              >
                <h3 className="text-xl font-semibold  text-black">
                  {item.title}
                </h3>
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
                  {item.category !== "Done" ? (
                    <span className="bg-red-400 p-2 rounded cursor-pointer">
                      InComplete
                    </span>
                  ) : (
                    <span className="bg-green-400 p-2 rounded cursor-pointer">
                      Completed
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

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
                  setIsEditing(false);
                  setEditingTaskId(null);
                  handleSubmit();
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

export default Done;
