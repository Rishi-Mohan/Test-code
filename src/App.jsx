import { useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

let nextId = 0;
const createTodo = (text) => ({
  id: String(nextId++),
  text,
  completed: false
});

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const canAdd = input.trim().length > 0;

  const onAdd = (event) => {
    event.preventDefault();
    if (!canAdd) return;
    setTodos((prev) => [...prev, createTodo(input.trim())]);
    setInput("");
  };

  const onToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const onDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    setTodos((prev) => reorder(prev, result.source.index, result.destination.index));
  };

  const ariaLabel = useMemo(() => "New todo", []);

  return (
    <div className="app">
      <header className="header">
        <h1>Todo</h1>
        <p>Plan it, drag it, finish it.</p>
      </header>

      <form className="todo-form" onSubmit={onAdd}>
        <label className="sr-only" htmlFor="todo-input">
          {ariaLabel}
        </label>
        <input
          id="todo-input"
          aria-label={ariaLabel}
          placeholder="Add a new task"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" disabled={!canAdd}>
          Add
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="todo-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(dragProvided) => (
                    <li
                      className={"todo-item" + (todo.completed ? " completed" : "")}
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      data-testid={`todo-item-${index}`}
                    >
                      <label className="todo-check">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          aria-label={`Toggle ${todo.text}`}
                          onChange={() => onToggle(todo.id)}
                        />
                        <span>{todo.text}</span>
                      </label>
                      <button
                        className="delete"
                        type="button"
                        onClick={() => onDelete(todo.id)}
                        aria-label={`Delete ${todo.text}`}
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


// Radha Radha