import { createBrowserRouter } from "react-router-dom";
import ParentLayout from "../ParentLayout";

import Done from "../pages/Done";
import InProgress from "../pages/InProgress";
import Todo from "../pages/Todo";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Private from "./Private";
import Alltask from "../pages/Alltask";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Private>
        <ParentLayout></ParentLayout>
      </Private>
    ),
    children: [
      {
        path: "/",
        element: <Alltask></Alltask>,
      },
      {
        path: "/done",
        element: <Done></Done>,
      },
      {
        path: "/progress",
        element: <InProgress></InProgress>,
      },
      {
        path: "/todo",
        element: <Todo></Todo>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
]);
