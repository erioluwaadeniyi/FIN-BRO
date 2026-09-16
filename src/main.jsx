import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Register from "./Register";

import "./index.css";

const path = window.location.pathname;

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    {path === "/register" ? <Register /> : <App />}
  </React.StrictMode>
);