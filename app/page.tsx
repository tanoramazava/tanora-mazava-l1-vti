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

        <input
          style={styles.input}
          placeholder="Kaomina"
        />

        <input
          style={styles.input}
          placeholder="Fokontany"
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
  const [scores, setScores] = useState<number[]>(
    Array(13).fill(0)
  );

  const questions = [
    "Fahazarana mivavaka",
    "Famakiana Baiboly",
    "Fandraisana anjara am-piangonana",
    "Fiainam-piderana",
    "Fitiavana namana",
    "Fahadiovam-piainana",
    "Fahamarinana",
    "Fanajana ray aman-dreny",
    "Fanampiana hafa",
    "Fifehezan-tena",
    "Fanajana fotoana",
    "Faharetana",
    "Fahavononana hanompo",
  ];

  const updateScore = (
    index: number,
    value: number
  ) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const total = scores.reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Tombana Ara-panahy
        </h1>

        {questions.map((question, index) => (
          <div key={index}>
            <label style={styles.label}>
              {index + 1}. {question}
            </label>

            <select
              style={styles.input}
              onChange={(e) =>
                updateScore(
                  index,
                  Number(e.target.value)
                )
              }
            >
              <option value={0}>Safidio</option>
              <option value={4}>Tsara be</option>
              <option value={3}>Tsara</option>
              <option value={2}>Antonony</option>
              <option value={1}>Malemy</option>
            </select>
          </div>
        ))}

        <h2 style={styles.score}>
          Total Score Ara-panahy : {total} / 52
        </h2>

        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={onBack}
          >
            Miverina
          </button>

          <button style={styles.button}>
            Manaraka
          </button>
        </div>
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
    maxWidth: "900px",
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
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  label: {
    display: "block",
    marginTop: "20px",
    fontWeight: "bold",
  },

  score: {
    marginTop: "30px",
    color: "#047857",
    fontSize: "28px",
  },
};
