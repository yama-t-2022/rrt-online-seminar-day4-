//1:08:36

import React from "react";
import { Counter } from "./features/counter/Counter";
import { TodoContainer } from "./features/todos/components/TodoContainer";
// import TodoForm from "./features/todos/components/TodoForm";

function App() {
  return (
    // フラグメント：   https://ja.reactjs.org/docs/fragments.html
    // NOTE 短い記法でもOK
    <React.Fragment>
      {/* <Counter /> */}
      {/* <TodoForm /> */}

      <TodoContainer />
    </React.Fragment>
  );
}

export default App;
