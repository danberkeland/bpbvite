import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingsProvider } from "./Contexts/SettingsContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SettingsProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </SettingsProvider>
);
