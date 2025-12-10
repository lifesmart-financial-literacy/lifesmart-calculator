import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Read configuration from WordPress shortcode data attributes
const container = rootElement.closest("[data-mode]") as HTMLElement;
const config = {
  mode: (container?.getAttribute("data-mode") || "auto") as
    | "auto"
    | "light"
    | "dark",
  transparentBackground:
    container?.getAttribute("data-transparent-background") === "true",
  version: container?.getAttribute("data-version") || "1.0.0",
  source: container?.getAttribute("data-source") || "unknown",
};

// Log configuration for debugging
if (process.env.NODE_ENV === "development") {
  console.log("LifeSmart Calculator Config:", config);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
