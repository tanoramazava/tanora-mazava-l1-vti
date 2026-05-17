"use client";

import { useState } from "react";

type Screen =
  | "home"
  | "identite"
  | "spirituel"
  | "vti"
  | "economie"
  | "taniketsa";

export default function HomePage() {
  const [screen, setScreen] =
    useState<Screen>("home");

  if (screen === "identite") {
    return (
      <IdentiteForm
        onBack={() =>
          setScreen("home")
        }
        onNext={() =>
          setScreen(
            "spirituel"
          )
        }
      />
    );
  }

  if (screen === "spirituel") {
    return (
      <SpirituelForm
        onBack={() =>
          setScreen(
            "identite"
          )
        }
        onNext={() =>
          setScreen("vti")
        }
      />
    );
  }

  if (screen === "vti") {
    return (
      <VtiForm
        onBack={() =>
          setScreen(
            "spirituel"
          )
        }
        onNext={() =>
          setScreen(
            "economie"
          )
        }
      />
    );
  }

  if (screen === "economie") {
    return (
      <EconomieForm
        onBack={() =>
          setScreen("vti")
        }
        onNext={() =>
          setScreen(
            "taniketsa"
          )
        }
      />
    );
  }

  if (screen === "taniketsa") {
    return (
      <TaniketsaForm
        onBack={() =>
          setScreen(
            "economie"
          )
        }
      />
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>
          TOMBANA TANORA
          MAZAVA L1
        </h1>

        <h2 style={styles.subtitle}>
          TOMBANA
          FANOMBOHANA VTI
        </h2>

        <button
          style={styles.button}
          onClick={() =>
            setScreen(
              "identite"
            )
          }
        >
          Hanomboka ny
          Tombana
        </button>
      </section>
    </main>
  );
}

function IdentiteForm({
  onBack,
  onNext,
}: any) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1
          style={
            styles.titleSmall
          }
        >
          Famantarana ny
          Tanora
        </h1>

        {[
          "Anarana sy fanampiny",
          "Taona",
          "Kaomina",
          "Fokontany",
          "VTI misy azy",
        ].map((p) => (
          <input
            key={p}
            style={styles.input}
            placeholder={p}
          />
        ))}

        <div style={styles.actions}>
          <button
            style={
              styles.secondaryButton
            }
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
  onNext,
}: any) {
  const [scores, setScores] =
    useState<number[]>(
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

  const update = (
    i: number,
    v: number
  ) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total =
    scores.reduce(
      (s, v) => s + v,
      0
    );

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1
          style={
            styles.titleSmall
          }
        >
          Tombana
          Ara-panahy
        </h1>

        {questions.map(
          (q, i) => (
            <ScoreSelect
              key={q}
              label={`${i + 1}. ${q}`}
              max={4}
              onChange={(
                v: number
              ) =>
                update(i, v)
              }
            />
          )
        )}

        <h2 style={styles.score}>
          Total Score
          Ara-panahy :
          {total} / 52
        </h2>

        <div style={styles.actions}>
          <button
            style={
              styles.secondaryButton
            }
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

function VtiForm({
  onBack,
  onNext,
}: any) {
  const [scores, setScores] =
    useState<number[]>(
      Array(7).fill(0)
    );

  const questions = [
    "Efa tao anaty fikambanana ve ?",
    "Efa tao anaty fikambanana tanora ve ?",
    "Andraikitra teo anivon’ny Fokontany",
    "Fahalalana ny VTI",
    "Vaomiera misy azy",
    "Andraikitra ao amin’ny Vaomiera",
    "Ora laniana isan-kerinandro",
  ];

  const update = (
    i: number,
    v: number
  ) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total =
    scores.reduce(
      (s, v) => s + v,
      0
    );

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1
          style={
            styles.titleSmall
          }
        >
          Tombana VTI
        </h1>

        {questions.map(
          (q, i) => (
            <ScoreSelect
              key={q}
              label={`${i + 1}. ${q}`}
              max={5}
              onChange={(
                v: number
              ) =>
                update(i, v)
              }
            />
          )
        )}

        <h2 style={styles.score}>
          Total Score VTI :
          {total} / 29
        </h2>

        <div style={styles.actions}>
          <button
            style={
              styles.secondaryButton
            }
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
function EconomieForm({
  onBack,
  onNext,
}: any) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Fanadihadiana Ara-toekarena
        </h1>

        <p style={styles.text}>
          Module économie mbola haverina amin’ny antsipiriany rehefa stable ny Taniketsa.
        </p>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
          <button style={styles.button} onClick={onNext}>
            Manaraka
          </button>
        </div>
      </section>
    </main>
  );
}

function TaniketsaForm({ onBack }: any) {
  const filieres = [
    { name: "Voly rakotra 500m²", question: "Parcelle 500m² firy ?", ca: 1753600, dep: 340000 },
    { name: "Voly vary 750m²", question: "Parcelle 750m² firy ?", ca: 600000, dep: 350000 },
    { name: "Akoho gasy", question: "Tokatranon’akoho firy ?", ca: 1296000, dep: 420000 },
    { name: "Fanatavezana kisoa", question: "Kisoa hatavezina firy ?", ca: 640000, dep: 387500 },
    { name: "Tantely", question: "Tohon-tantely firy ?", ca: 1500000, dep: 420000 },
  ];

  const [units, setUnits] = useState<number[]>(Array(5).fill(0));
  const [humanScores, setHumanScores] = useState<number[]>(Array(5).fill(0));
  const [ecoScores, setEcoScores] = useState<number[]>(Array(5).fill(0));

  const updateArray = (arr: number[], setter: any, index: number, value: number) => {
    const copy = [...arr];
    copy[index] = value;
    setter(copy);
  };

  const totalCA = filieres.reduce((s, f, i) => s + units[i] * f.ca, 0);
  const totalDep = filieres.reduce((s, f, i) => s + units[i] * f.dep, 0);
  const totalBenefice = totalCA - totalDep;
  const totalScore =
    humanScores.reduce((s, v) => s + v, 0) +
    ecoScores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Taniketsa Fandraharahana
        </h1>

        <div style={styles.scoreBox}>
          CA total : <strong>{totalCA.toLocaleString()} Ar</strong><br />
          Dépenses total : <strong>{totalDep.toLocaleString()} Ar</strong><br />
          Bénéfice total : <strong>{totalBenefice.toLocaleString()} Ar</strong><br />
          Score total : <strong>{totalScore} / 275</strong>
        </div>

        {filieres.map((f, index) => {
          const ca = units[index] * f.ca;
          const dep = units[index] * f.dep;
          const benefice = ca - dep;
          const score = humanScores[index] + ecoScores[index];

          return (
            <div key={f.name} style={styles.block}>
              <h3 style={styles.sectionTitle}>{index + 1}. {f.name}</h3>

              <label style={styles.label}>{f.question}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="Soraty eto ny isa"
                onChange={(e) =>
                  updateArray(units, setUnits, index, Number(e.target.value))
                }
              />

              <div style={styles.miniBox}>
                CA calculé : <strong>{ca.toLocaleString()} Ar</strong><br />
                Dépenses calculées : <strong>{dep.toLocaleString()} Ar</strong><br />
                Bénéfice calculé : <strong>{benefice.toLocaleString()} Ar</strong>
              </div>

              <h4>A. Fiofanana, ezaka ary anjara biriky — 35 points</h4>
              <textarea
                style={styles.textarea}
                placeholder="Fiofanana, traikefa, ezaka, anjara biriky, fitaovana, fananantany..."
              />
              <ScoreSelect
                label="Score bloc humain/technique"
                max={35}
                onChange={(v: number) =>
                  updateArray(humanScores, setHumanScores, index, v)
                }
              />

              <h4>B. Faisabilité économique — 20 points</h4>
              <textarea
                style={styles.textarea}
                placeholder="Tsena, vidiny, fandaniana, tombony, pérennité..."
              />
              <ScoreSelect
                label="Score bloc économique"
                max={20}
                onChange={(v: number) =>
                  updateArray(ecoScores, setEcoScores, index, v)
                }
              />

              <h2 style={styles.score}>
                Score {f.name} : {score} / 55
              </h2>
            </div>
          );
        })}

        <button style={styles.secondaryButton} onClick={onBack}>
          Miverina
        </button>
      </section>
    </main>
  );
}

function ScoreSelect({ label, max, onChange }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select
        style={styles.input}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>Safidio</option>
        {Array.from({ length: max }, (_, i) => max - i).map((v) => (
          <option key={v} value={v}>
            {v} points
          </option>
        ))}
      </select>
    </div>
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
  text: {
    fontSize: "18px",
    lineHeight: 1.7,
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
  textarea: {
    width: "100%",
    minHeight: "110px",
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
    marginTop: "14px",
    fontWeight: "bold",
  },
  score: {
    marginTop: "24px",
    color: "#047857",
    fontSize: "24px",
  },
  scoreBox: {
    background: "#ecfdf5",
    border: "1px solid #10b981",
    color: "#064e3b",
    padding: "18px",
    borderRadius: "16px",
    fontSize: "20px",
    marginTop: "24px",
  },
  miniBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "14px",
    borderRadius: "12px",
    marginTop: "12px",
  },
  block: {
    marginTop: "28px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    background: "#f8fafc",
  },
  sectionTitle: {
    color: "#064e3b",
    fontSize: "24px",
    marginTop: "10px",
  },
};
