import React, { useContext, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskContext } from "../context/TaskContext.jsx";
import { deleteTask, fetchBoards } from "../api/taskApi.js";
import Modal from "./Modal.jsx";

const Task = ({ task, isOverlay = false }) => {
  const { updateBoardTasks } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${task.id}`,
      data: { task },
    });

  const style = {
    // Only apply transform to the original item if it's NOT the active dragging item
    // or if we're in the overlay (but overlay handles transform itself)
    transform:
      isOverlay || isDragging ? undefined : CSS.Transform.toString(transform),
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteTask(task.id);
      const data = await fetchBoards();
      updateBoardTasks(data);
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing touch-none relative group transition-all duration-200
        ${
          isOverlay
            ? "opacity-100 shadow-2xl z-[9999] scale-105 rotate-1 border-blue-200"
            : isDragging
            ? "opacity-40 shadow-none"
            : "z-20 hover:shadow-md hover:-translate-y-0.5"
        }
        `}
      >
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-gray-700 leading-snug w-full pr-6">
            {task.description}
          </p>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-red-50"
            title="Delete Task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2.5 flex justify-between items-center text-[10px] text-gray-400 font-medium tracking-wide uppercase">
          <span>#{task.id}</span>
          <span>
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Delete Task"
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmDelete}
        confirmText="Delete"
        confirmVariant="danger"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </>
  );
};

export default Task;
