import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App, { reorder } from "./App.jsx";

const addTodo = async (text) => {
  const user = userEvent.setup();
  const input = screen.getByLabelText(/new todo/i);
  await user.type(input, text);
  await user.click(screen.getByRole("button", { name: /add/i }));
  return user;
};

describe("Todo App", () => {
  it("adds a todo", async () => {
    render(<App />);
    await addTodo("Buy milk");
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("toggles a todo complete", async () => {
    render(<App />);
    await addTodo("Write tests");

    const checkbox = screen.getByRole("checkbox", { name: /toggle write tests/i });
    expect(screen.getByTestId("todo-item-0")).not.toHaveClass("completed");

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(screen.getByTestId("todo-item-0")).toHaveClass("completed");
  });

  it("deletes a todo", async () => {
    render(<App />);
    await addTodo("Delete me");

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /delete delete me/i }));

    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
  });
});

describe("reorder", () => {
  it("moves item from start to end", () => {
    const items = ["a", "b", "c"];
    expect(reorder(items, 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("moves item from end to start", () => {
    const items = ["a", "b", "c"];
    expect(reorder(items, 2, 0)).toEqual(["c", "a", "b"]);
  });
});
