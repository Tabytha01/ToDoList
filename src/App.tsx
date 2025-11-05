import  { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Todo } from './types';
import TodoItem from './components/TodoItem';
import AddTodoForm from './components/AddTodoForm';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('react-todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos));
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#689071] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white border-opacity-30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-black animate-pulse-slow">
            Todo List
          </h1>
          <p className="text-white text-boldtext-sm opacity-90">
            Drag and drop to reorder your tasks
          </p>
        </div>

        {/* Add Todo Form */}
        <AddTodoForm onAddTodo={addTodo} />

        {/* Todo List */}
        <div className="mt-6">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-xl font-semibold">No tasks yet!</p>
              <p className="text-white text-sm mt-2 opacity-80">
                Add your first task to get started
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={todos} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onDelete={deleteTodo}
                      onToggle={toggleTodo}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white text-xs opacity-70">
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} total
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;