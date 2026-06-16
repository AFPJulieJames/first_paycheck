import React from "react";
import FirstPaycheck from "./FirstPaycheck.jsx";

/* First Paycheck is public: the free tools are the trust engine and the
   top of the funnel, so there is no password wall. (The old shared-password
   gate is kept in git history; if a Pro/members area is added later, gate
   only those routes, never the free core tools.) */
export default function App() {
  return <FirstPaycheck />;
}
