import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Register from "./Register";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import "./index.css";

const path = window.location.pathname;

let page;

switch (path) {
  case "/register":
    page = <Register />;
    break;

  case "/admin":
    page = <AdminLogin />;
    break;

  case "/admin/dashboard":
    page = <AdminDashboard />;
    break;

  default:
    page = <App />;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>
);

// Tech Crew deployment update