import { useState } from "react";

export default function HomePage() {
  const [screen, setScreen] = useState<"home" | "identite">("home");

  if (screen === "identite") {
    return <IdentiteForm onBack={() => setScreen("home")} />;
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>
        <h2 style={styles.subtitle}>TOMBANA FANOMBOHANA VTI</h2>

        <p style={styles.text}>
          Rafitra siantifika sy nomerika ho fanaraha-maso ny fanovàna
          ara-panahy, ara-tsosialy, ara-toekarena ary ara-piarahamonina
          eny anivon’ny Tanora sy ny VTI.
        </p>

        <button style={styles.button} onClick={() => setScreen("identite")}>
          Hanomboka ny Tombana
        </button>
      </section>
    </main>
  );
}

function IdentiteForm({ onBack }: { onBack: () => void }) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>
        <p style={styles.text}>Dingana 1 / 6 — Tombana Isam-batan’olona</p>

        <div style={styles.grid}>
          <Input label="Anarana sy fanampiny" />
          <Input label="Taona" />
          <Input label="Nomeraon-telefaonina" />
          <Input label="Kaomina" />
          <Input label="Fokontany" />
          <Input label="VTI misy azy" />
          <Input label="Vaomiera misy azy" />
          <Input label="Anaran’ny mpanombana" />
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
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

function Input({ label }: { label: string }) {
  return (
    <label style={styles.label}>
      {label}
      <input style={styles.input} placeholder="Soraty eto..." />
    </label>
  );
}

const styles: Record<string, any> = {
  main: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #064e3b, #f8fafc)",
    fontFamily: "Arial, sans-serif",
    padding: "30px",
  },
  card: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "white",
    borderRadius: "28px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },
  title: {
    color: "#047857",
    fontSize: "44px",
    textAlign: "center",
    marginBottom: "8px",
  },
  titleSmall: {
    color: "#047857",
    fontSize: "34px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#b91c1c",
    fontSize: "30px",
    textAlign: "center",
    marginTop: 0,
  },
  text: {
    fontSize: "18px",
    lineHeight: 1.7,
    marginTop: "24px",
  },
  button: {
    background: "#047857",
    color: "white",
    border: "none",
    padding: "16px 26px",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "30px",
  },
  secondaryButton: {
    background: "#f1f5f9",
    color: "#064e3b",
    border: "1px solid #cbd5e1",
    padding: "16px 26px",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginTop: "30px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    color: "#064e3b",
    gap: "8px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "20px",
  },
};
