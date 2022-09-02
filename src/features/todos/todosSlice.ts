import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// import type { TodoInput, Todo } from "./types";
// import { createTodo } from "./crud/create";
import type { RootState } from "../../app/store";
// import type { TodoInput, Todo, TodoId } from "./types";
// import { createTodo, removeTodo } from "./crud";
import type { TodoInput, Todo, TodoId, TodoUpdatePayload } from "./types";
import { createTodo, removeTodo, updateTodo, restoreTodo } from "./crud";

export type TodoState = {
  todos: Todo[];
};

const initialState: TodoState = {
  todos: [],
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<TodoInput>) => {
      const { title, body } = action.payload;
      if (!title || !body)
        throw new Error("タイトルと本文の両方を入力してください");

      const todo = createTodo(action.payload);
      state.todos.push(todo);
    },
    remove: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = removeTodo(todo);
    },
    update: (state, action: PayloadAction<TodoUpdatePayload>) => {
      const { id, input } = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = updateTodo({
        ...todo,
        ...input,
      });
    },
    restore: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = restoreTodo(todo);
    },
  },
});

//export const { create } = todoSlice.actions;
export const { create, remove, update, restore } = todoSlice.actions;

export const selectTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt === undefined);

export const selectDeletedTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt !== undefined);

export default todoSlice.reducer;
//note これでも良い
//export const reducer = todoSlice.reducer;
