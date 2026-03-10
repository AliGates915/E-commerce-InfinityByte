import React from "react";
import ReactDOM from "react-dom/client";
import AppProviders from "./AppProviders";
// import "./Notice.css"
import "./index.css"; // or your main CSS file
// import Notice from "./Notice";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>
);
