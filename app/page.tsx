"use client";

import { useState } from "react";

type Screen = "home" | "identite" | "spirituel" | "vti" | "economie";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "identite") return <IdentiteForm onBack={() => setScreen("home")} onNext={() => setScreen("spirituel")} />;
  if (screen === "spirituel") return <SpirituelForm onBack={() => setScreen("identite")} onNext={() => setScreen("vti")} />;
  if (screen === "vti") return <VtiForm onBack={() => setScreen("spirituel")} onNext={() => setScreen("economie")} />;
  if (screen === "economie") return <EconomieForm onBack={() => setScreen("vti")} />;

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>
        <h2 style={styles.subtitle}>TOMBANA FANOMBOHANA VTI</h2>
        <button style={styles.button} onClick={() => setScreen("identite")}>Hanomboka ny Tombana</button>
      </section>
    </main>
  );
}

function IdentiteForm({ onBack, onNext }: any) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>
        {["Anarana sy fanampiny", "Taona", "Kaomina", "Fokontany"].map((p) => (
          <input key={p} style={styles.input} placeholder={p} />
        ))}
        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function SpirituelForm({ onBack, onNext }: any) {
  const [scores, setScores] = useState<number[]>(Array(13).fill(0));
  const questions = ["Fahazarana mivavaka","Famakiana Baiboly","Fandraisana anjara am-piangonana","Fiainam-piderana","Fitiavana namana","Fahadiovam-piainana","Fahamarinana","Fanajana ray aman-dreny","Fanampiana hafa","Fifehezan-tena","Fanajana fotoana","Faharetana","Fahavononana hanompo"];
  const update = (i: number, v: number) => { const a = [...scores]; a[i] = v; setScores(a); };
  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}><section style={styles.card}>
      <h1 style={styles.titleSmall}>Tombana Ara-panahy</h1>
      {questions.map((q, i) => <ScoreSelect key={q} label={`${i+1}. ${q}`} max={4} onChange={(v)=>update(i,v)} />)}
      <h2 style={styles.score}>Total Score Ara-panahy : {total} / 52</h2>
      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
        <button style={styles.button} onClick={onNext}>Manaraka</button>
      </div>
    </section></main>
  );
}

function VtiForm({ onBack, onNext }: any) {
  const [scores, setScores] = useState<number[]>(Array(7).fill(0));
  const questions = ["Efa tao anaty fikambanana ve ?","Efa tao anaty fikambanana tanora ve ?","Andraikitra teo anivon’ny Fokontany","Fahalalana ny VTI","Vaomiera misy azy","Andraikitra ao amin’ny Vaomiera","Ora laniana isan-kerinandro"];
  const update = (i: number, v: number) => { const a = [...scores]; a[i] = v; setScores(a); };
  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}><section style={styles.card}>
      <h1 style={styles.titleSmall}>Tombana VTI</h1>
      {questions.map((q, i) => <ScoreSelect key={q} label={`${i+1}. ${q}`} max={5} onChange={(v)=>update(i,v)} />)}
      <h2 style={styles.score}>Total Score VTI : {total} / 29</h2>
      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
        <button style={styles.button} onClick={onNext}>Manaraka</button>
      </div>
    </section></main>
  );
}

function EconomieForm({ onBack }: any) {
  const [quantiteVendue, setQuantiteVendue] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [depenses, setDepenses] = useState(0);
  const [scores, setScores] = useState<number[]>(Array(12).fill(0));

  const revenu = quantiteVendue * prixUnitaire;
  const benefice = revenu - depenses;
  const update = (i: number, v: number) => { const a = [...scores]; a[i] = v; setScores(a); };
  const total = scores.reduce((s, v) => s + v, 0);

  const questions = [
    "Seha-pihariana telo nisongadina",
    "Fananantany",
    "Production seha-pihariana 1",
    "Dépenses seha-pihariana 1",
    "Autoconsommation seha-pihariana 1",
    "Quantité vendue seha-pihariana 1",
    "Prix unitaire seha-pihariana 1",
    "Revenu calculé seha-pihariana 1",
    "Total revenu annuel",
    "Total dépenses annuelles",
    "Épargne annuelle",
    "Réinvestissement annuel",
  ];

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 3 — Fanadihadiana Ara-toekarena sy Ara-bola</h1>
        <p style={styles.text}>Ny 03 taona farany — Totalibeny : 48 points</p>

        <input style={styles.input} placeholder="Anaran’ny seha-pihariana voalohany" />
        <input style={styles.input} type="number" placeholder="Quantité vendue" onChange={(e)=>setQuantiteVendue(Number(e.target.value))} />
        <input style={styles.input} type="number" placeholder="Prix unitaire Ar" onChange={(e)=>setPrixUnitaire(Number(e.target.value))} />
        <input style={styles.input} type="number" placeholder="Dépenses annuelles Ar" onChange={(e)=>setDepenses(Number(e.target.value))} />

        <div style={styles.scoreBox}>
          Revenu automatique : <strong>{revenu.toLocaleString()} Ar</strong><br />
          Bénéfice estimé : <strong>{benefice.toLocaleString()} Ar</strong>
        </div>

        {questions.map((q, i) => <ScoreSelect key={q} label={`${i+1}. ${q}`} max={4} onChange={(v)=>update(i,v)} />)}

        <h2 style={styles.score}>Total Score Économie : {total} / 48</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function ScoreSelect({ label, max, onChange }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} onChange={(e)=>onChange(Number(e.target.value))}>
        <option value={0}>Safidio</option>
        {Array.from({ length: max }, (_, i) => max - i).map((v) => (
          <option key={v} value={v}>{v} points</option>
        ))}
      </select>
    </div>
  );
}

const styles: Record<string, any> = {
  main: { minHeight: "100vh", background: "#f1f5f9", padding: "40px", fontFamily: "Arial" },
  card: { maxWidth: "900px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "20px" },
  title: { color: "#047857", fontSize: "42px", textAlign: "center" },
  titleSmall: { color: "#047857", fontSize: "32px" },
  subtitle: { color: "#b91c1c", textAlign: "center" },
  text: { fontSize: "18px", lineHeight: 1.7 },
  button: { background: "#047857", color: "white", border: "none", padding: "14px 20px", borderRadius: "12px", marginTop: "20px", cursor: "pointer" },
  secondaryButton: { background: "#e2e8f0", color: "#0f172a", border: "none", padding: "14px 20px", borderRadius: "12px", marginTop: "20px", cursor: "pointer" },
  input: { width: "100%", padding: "14px", marginTop: "10px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" },
  actions: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  label: { display: "block", marginTop: "20px", fontWeight: "bold" },
  score: { marginTop: "30px", color: "#047857", fontSize: "28px" },
  scoreBox: { background: "#ecfdf5", border: "1px solid #10b981", color: "#064e3b", padding: "18px", borderRadius: "16px", fontSize: "20px", marginTop: "24px" },
};
