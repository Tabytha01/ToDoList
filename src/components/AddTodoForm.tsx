import React, { useState } from 'react';

interface AddTodoFormProps {
  onAddTodo: (text: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (trimmedValue) {
      onAddTodo(trimmedValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="
            flex-1 px-6 py-4 rounded-2xl border-2 border-white border-opacity-50
            bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 placeholder-gray-500
            text-lg font-medium shadow-lg focus:outline-none focus:ring-4 
            focus:ring-white focus:ring-opacity-30 focus:border-opacity-70
            transition-all duration-200
          "
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="
            px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white 
            rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:from-purple-700 hover:to-pink-700 transform hover:scale-105
            transition-all duration-200 focus:outline-none focus:ring-4 
            focus:ring-white focus:ring-opacity-30
          "
        >
          <span className="flex items-center space-x-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="opacity-80"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Add Task</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;