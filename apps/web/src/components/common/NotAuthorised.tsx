import type {ReactNode} from "react";

export default function NotAuthorised(): ReactNode {
  return (
    <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#1a202c"
        }}>
      <h1 style={{ fontSize: "6rem", margin: 0 }}>401</h1>
      <h2 style={{ margin: "1rem 0" }}>Unauthorised</h2>
      <p>You are not authorised to view this content. Please sign in or sign up.</p>
      <a href="/" style={{
        marginTop: "2rem",
        padding: "0.75rem 1.5rem",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "0.5rem",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Go Home
      </a>
    </div>
  );
}
