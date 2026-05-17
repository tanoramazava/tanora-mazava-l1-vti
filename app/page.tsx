"use client";

import { useState } from "react";

type Screen = "home" | "identite" | "spirituel";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "identite") {
    return (
      <IdentiteForm
        onBack={() => setScreen("home")}
        onNext={() => setScreen("spirituel")}
      />
    );
  }

  if (screen === "spirituel") {
    return (
      <SpirituelForm
        onBack={() => setScreen("identite")}
      />
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
          onClick={() => setScreen("identite")}
        >
          Hanomboka ny Tombana
        </button>
      </section>
    </main>
  );
}

function IdentiteForm({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
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

        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={onBack}
          >
            Miverina
          </button>

          <button
            style={styles.button}
            onClick={onNext}
          >
            Manaraka
          </button>
        </div>
      </section>
    </main>
  );
}

function SpirituelForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const [vavaka, setVavaka] = useState(0);
  const [baiboly, setBaiboly] = useState(0);

  const total = vavaka + baiboly;

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Tombana Ara-panahy
        </h1>

        <label style={styles.label}>
          Fahazarana mivavaka
        </label>

        <select
          style={styles.input}
          onChange={(e) =>
            setVavaka(Number(e.target.value))
          }
        >
          <option value={0}>Safidio</option>
          <option value={5}>Tsara</option>
          <option value={3}>Antonony</option>
          <option value={1}>Malemy</option>
        </select>

        <label style={styles.label}>
          Famakiana Baiboly
        </label>

        <select
          style={styles.input}
          onChange={(e) =>
            setBaiboly(Number(e.target.value))
          }
        >
          <option value={0}>Safidio</option>
          <option value={5}>Isan’andro</option>
          <option value={3}>Indraindray</option>
          <option value={1}>Tsy dia manao</option>
        </select>

        <h2 style={styles.score}>
          Total Score : {total}
        </h2>

        <button
          style={styles.secondaryButton}
          onClick={onBack}
        >
          Miverina
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

  secondaryButton: {
    background: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "14px 20px",
    borderRadius: "12px",
    marginTop: "20px",
    cursor: "pointer",
    marginRight: "10px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
  },

  label: {
    display: "block",
    marginTop: "20px",
    fontWeight: "bold",
  },

  score: {
    marginTop: "30px",
    color: "#047857",
  },
};
