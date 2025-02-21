import React from "react";
import { FaTimes } from "react-icons/fa"; // Importing FaTimes for the cross icon

const Modal = ({
  isFormOpen,
  handleFormToggle,
  handleSubmit,
  taskDetails,
  handleInputChange,
}) => {
  return (
    isFormOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50  ">
        <div className="bg-white p-5 rounded-lg w-96 relative">
          {/* Cross Icon */}
          <button
            onClick={handleFormToggle}
            className="absolute top-2 right-2 text-xl text-gray-600"
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl mb-4">Add Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskDetails.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={taskDetails.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={taskDetails.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="dueDate" className="block">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default Modal;
