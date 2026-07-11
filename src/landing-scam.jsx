import React from "react";
import ReactDOM from "react-dom/client";
import ScamLanding from "./ScamLanding.jsx";

/* Entry point for the /is-it-a-scam landing page (its own Vite entry, so it
   gets its own <title> and Open Graph tags for the Facebook link preview). */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ScamLanding />
  </React.StrictMode>
);
