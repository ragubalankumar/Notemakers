import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext"; // <-- use ThemeProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider>  {/* <-- correct */}
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);
