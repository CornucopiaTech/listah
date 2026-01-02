import type {ReactNode} from "react";

export default function Forbidden(): ReactNode {
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
      <h1 style={{ fontSize: "6rem", margin: 0 }}>403</h1>
      <h2 style={{ margin: "1rem 0" }}>Forbidden</h2>
      <p>You are forbidden from viewing this content. Please ask an administrator to grant you permission.</p>
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
