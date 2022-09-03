import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { TodoInput, Todo, TodoId, TodoUpdatePayload } from "./types";
import { createTodo, removeTodo, updateTodo, restoreTodo } from "./crud";
import { fetchTodos } from "./api/fetch";
import { setTodos } from "./localStorage/todosLocalStorage";

export const DISPLAY_STATUS_MAP = {
  all: "全て（削除済みは除く）",
  updated: "更新済み（削除済みは除く）",
  deleted: "削除済み",
};
export type DisplayStatusType = keyof typeof DISPLAY_STATUS_MAP;

//
export type TodoState = {
  todos: Todo[];
  displayStatus: DisplayStatusType;
  isFetching: boolean;
  error: SerializedError | null;
};

//初期値
const initialState: TodoState = {
  todos: [],
  displayStatus: "all",
  isFetching: false,
  error: null,
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
      setTodos(state.todos);
    },
    remove: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = removeTodo(todo);
      setTodos(state.todos);
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
      setTodos(state.todos);
    },
    restore: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = restoreTodo(todo);
      setTodos(state.todos);
    },
    changeDisplayStatus: (state, action: PayloadAction<DisplayStatusType>) => {
      state.displayStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        //pending（保留）
        state.isFetching = true; // Fetch中
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        //fulfilled（成功）
        state.isFetching = false; //Fetchしていない
        state.error = null;
        state.todos = action.payload;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        //rejected（失敗）
        state.isFetching = false; //Fetchしていない
        state.error = action.error;
      });
  },
});

//ToDoデータの取得
export const fetchTodosAsync = createAsyncThunk<Todo[]>(
  `${todoSlice.name}/fetch`,
  async () => {
    const response = await fetchTodos();

    return response.data;
  }
);

//CRUD
export const { create, remove, update, restore, changeDisplayStatus } =
  todoSlice.actions;

//select
export const selectTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt === undefined);

//Deleted
export const selectDeletedTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt !== undefined);

//Fetch中かどうか
export const selectIsFetching = (state: RootState) => state.todos.isFetching;

//DisplayStatus
export const selectTodosByDisplayStatus = (state: RootState) => {
  if (state.todos.displayStatus === "updated") {
    return state.todos.todos.filter(
      (todo) => todo.updatedAt !== undefined && todo.deletedAt === undefined
    );
  }
  if (state.todos.displayStatus === "deleted") {
    return selectDeletedTodos(state);
  }

  return selectTodos(state);
};

//
export default todoSlice.reducer;
