"use client";

import { useState } from "react";

export default function HomePage() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>
            Famantarana ny Tanora
          </h1>

          <input
            style={styles.input}
            placeholder="Anarana sy fanampiny"
          />

          <input
            style={styles.input}
            placeholder="Taona"
          />

          <button
            style={styles.button}
            onClick={() => setStarted(false)}
          >
            Miverina
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>
          TOMBANA TANORA MAZAVA L1
        </h1>

        <h2 style={styles.subtitle}>
          TOMBANA FANOMBOHANA VTI
        </h2>

        <button
          style={styles.button}
          onClick={() => setStarted(true)}
        >
          Hanomboka ny Tombana
        </button>
      </section>
    </main>
  );
}

const styles: Record<string, any> = {
  main: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "40px",
    fontFamily: "Arial",
  },

  card: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
  },

  title: {
    color: "#047857",
    fontSize: "42px",
    textAlign: "center",
  },

  titleSmall: {
    color: "#047857",
    fontSize: "32px",
  },

  subtitle: {
    color: "#b91c1c",
    textAlign: "center",
  },

  button: {
    background: "#047857",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: "12px",
    marginTop: "20px",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },
};
