import { notInitialized } from "react-redux/es/utils/useSyncExternalStore";
import type { Todo } from "../types";

//=============================================================
// 仮に、将来的にlocalStorageに保存するデータが増やしたい時のkeyのルール決め
// ルールは「prefix値:データの種類」
//
// 例: 保存したいデータの種類ごとのlocalStorageのkey
//   - todoデータ    : 'redux-toolkit-seminar:todos'
//   - userデータ    : 'redux-toolkit-seminar:user'
//   - settingデータ : 'redux-toolkit-seminar:setting'
//=============================================================

const PREFIX_KEY = "redux-toolkit-seminar";
const LOCAL_STORAGE_KEY = `${PREFIX_KEY}:todos`;

//TODOの設定
export const setTodos = (todos: Todo[]) => {
  //Todoクラスのインスタンスに変換
  const json = JSON.stringify(todos);
  //jsonとしてストレージに設定
  window.localStorage.setItem(LOCAL_STORAGE_KEY, json);
};

//TODOの取得
export const getTodos = (): Todo[] => {
  //ストレージからデータを取得
  const json = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!json) return [];
  //取得した文字列JsonをTodoクラスのインスタンスに変換
  const todos = JSON.parse(json) as Todo[];
  return todos;
};
