import { Todo } from "../types";
import { getTodos } from "../localStorage/todosLocalStorage";

type Response = {
  data: Todo[];
};

export const fetchTodos = async (): Promise<Response> => {
  return new Promise((resolve) => {
    //ToDOの取得
    const todos: Todo[] = getTodos();

    //バックエンド API実行を想定して 1秒 Wait
    setTimeout(() => resolve({ data: todos }), 1000);
  });
};
