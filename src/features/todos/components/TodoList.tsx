import type { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { remove, update, restore } from "../todosSlice";
import { Todo } from "../types";
import { useConfirmModal } from "./modals/ConfirmModal/useConfirmModal";
import { useUpdateTodoModal } from "./modals/UpdateTodoModal/useUpdateTodoModal";
import { translateStatus } from "../utils/todoConverter";

type Props = {
  todos: Todo[];
};

export const TodoList: FC<Props> = ({ todos }) => {
  //const todos = useAppSelector((state) => state.todos.todos);
  //const todos = useAppSelector(selectTodos);

  const displayStatus = useAppSelector((state) => state.todos.displayStatus);
  const dispatch = useAppDispatch();

  //復元・削除ダイアログ
  const {
    open: openConfirmModal,
    setMessage,
    ConfirmModalWrapper,
  } = useConfirmModal();

  //更新ダイアログ
  const {
    open: openUpdateTodoModal,
    setTodoInput: setTodoInputForUpdateTodoModal,
    UpdateTodoModalWrapper,
  } = useUpdateTodoModal();

  const isSelectDeletedStatus = displayStatus === "deleted";

  return (
    <>
      <ConfirmModalWrapper />
      <UpdateTodoModalWrapper />
      <table border={1}>
        <thead>
          <tr>
            <th>id</th>
            <th>タイトル</th>
            <th>本文</th>
            <th>ステータス</th>
            <th>作成日時</th>
            <th>更新日時</th>
            <th>削除日時</th>
            <th>更新ボタン</th>
            {/* <th>削除ボタン</th> */}
            <th>{isSelectDeletedStatus ? "復元ボタン" : "削除ボタン"}</th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                データなし
              </td>
            </tr>
          ) : (
            todos.map((todo) => {
              return (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>{todo.body}</td>
                  {/* <td>{todo.status}</td> */}
                  <td>{translateStatus(todo.status)}</td>
                  <td>{todo.createdAt}</td>
                  <td>{todo.updatedAt ?? "無し"}</td>
                  <td>{todo.deletedAt ?? "無し"}</td>
                  <td>
                    <button
                      disabled={isSelectDeletedStatus}
                      onClick={() => {
                        // //更新機能
                        // //
                        // const updateAction = update({
                        //   id: todo.id,
                        //   input: {
                        //     title: "更新したtitle" + Date.now(),
                        //     body: "更新したbody " + Date.now(),
                        //   },

                        setTodoInputForUpdateTodoModal(todo);
                        openUpdateTodoModal((newTodoInput) => {
                          const updateAction = update({
                            id: todo.id,
                            input: {
                              ...newTodoInput,
                            },
                          });
                          dispatch(updateAction);
                        });
                        // dispatch(updateAction);
                      }}
                    >
                      更新
                    </button>
                  </td>
                  <td>
                    {/* {isDeletedTodo(todo) ? ( */}
                    {isSelectDeletedStatus ? (
                      <button
                        onClick={() => {
                          // dispatch(restore(todo.id));
                          setMessage("復元しますか？");
                          openConfirmModal(() => dispatch(restore(todo.id)));
                        }}
                      >
                        復元
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          // dispatch(remove(todo.id));
                          setMessage("本当に削除しますか？");
                          openConfirmModal(() => dispatch(remove(todo.id)));
                        }}
                      >
                        削除
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};

// const isDeletedTodo = (todo: Todo) => {
//   return todo.deletedAt !== undefined;
// };

export default TodoList;
