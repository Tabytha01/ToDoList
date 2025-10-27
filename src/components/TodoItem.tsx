import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center justify-between p-5 rounded-2xl shadow-lg
        bg-white bg-opacity-90 backdrop-blur-sm border border-white border-opacity-50
        hover:bg-opacity-100 hover:shadow-xl transition-all duration-200
        ${isDragging ? 'dragging' : ''}
        ${todo.completed ? 'opacity-75' : ''}
      `}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        title="Drag to reorder"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        >
          <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
        </svg>
      </div>

      {/* Todo Content */}
      <div className="flex-1 flex items-center space-x-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 hover:scale-110
            ${todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
            }
          `}
        >
          {todo.completed && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Todo Text */}
        <div className="flex-1">
          <p
            className={`
              text-lg font-medium transition-all duration-200
              ${todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
              }
            `}
          >
            {todo.text}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {todo.createdAt.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="
          ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 
          rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
          hover:scale-110
        "
        title="Delete task"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;