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
    <main style={styles.main}><section style={styles.card}>
      <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>
      {["Anarana sy fanampiny", "Taona", "Kaomina", "Fokontany"].map((p) => <input key={p} style={styles.input} placeholder={p} />)}
      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
        <button style={styles.button} onClick={onNext}>Manaraka</button>
      </div>
    </section></main>
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
      {questions.map((q, i) => <ScoreSelect key={q} label={`${i+1}. ${q}`} max={4} onChange={(v:number)=>update(i,v)} />)}
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
      {questions.map((q, i) => <ScoreSelect key={q} label={`${i+1}. ${q}`} max={5} onChange={(v:number)=>update(i,v)} />)}
      <h2 style={styles.score}>Total Score VTI : {total} / 29</h2>
      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
        <button style={styles.button} onClick={onNext}>Manaraka</button>
      </div>
    </section></main>
  );
}

function EconomieForm({ onBack }: any) {
  const [scores, setScores] = useState<number[]>(Array(24).fill(0));

  const [q1, setQ1] = useState(0); const [p1, setP1] = useState(0); const [d1, setD1] = useState(0);
  const [q2, setQ2] = useState(0); const [p2, setP2] = useState(0); const [d2, setD2] = useState(0);
  const [q3, setQ3] = useState(0); const [p3, setP3] = useState(0); const [d3, setD3] = useState(0);

  const revenu1 = q1 * p1;
  const revenu2 = q2 * p2;
  const revenu3 = q3 * p3;
  const totalRevenu = revenu1 + revenu2 + revenu3;
  const totalDepenses = d1 + d2 + d3;
  const beneficeTotal = totalRevenu - totalDepenses;

  const update = (i: number, v: number) => {
    const a = [...scores];
    a[i] = v;
    setScores(a);
  };

  const totalScore = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 3 — Fanadihadiana Ara-toekarena sy Ara-bola</h1>
        <p style={styles.text}>Ny 03 taona farany — Totalibeny : 48 points</p>

        <SehaPihariana
          title="Seha-pihariana Voalohany"
          startIndex={0}
          update={update}
          setQ={setQ1}
          setP={setP1}
          setD={setD1}
          revenu={revenu1}
          benefice={revenu1 - d1}
        />

        <SehaPihariana
          title="Seha-pihariana Faharoa"
          startIndex={6}
          update={update}
          setQ={setQ2}
          setP={setP2}
          setD={setD2}
          revenu={revenu2}
          benefice={revenu2 - d2}
        />

        <SehaPihariana
          title="Seha-pihariana Fahatelo"
          startIndex={12}
          update={update}
          setQ={setQ3}
          setP={setP3}
          setD={setD3}
          revenu={revenu3}
          benefice={revenu3 - d3}
        />

        <div style={styles.scoreBox}>
          <strong>Total revenus 3 seha-pihariana : </strong>{totalRevenu.toLocaleString()} Ar<br />
          <strong>Total dépenses : </strong>{totalDepenses.toLocaleString()} Ar<br />
          <strong>Bénéfice estimé global : </strong>{beneficeTotal.toLocaleString()} Ar
        </div>

        <h3 style={styles.sectionTitle}>Fanadihadiana ara-bola générale</h3>
        {["Total revenu annuel", "Dépenses annuelles", "Épargne annuelle", "Réinvestissement annuel", "Fahafaha-mitahiry", "Fahafaha-manitatra famokarana"].map((q, idx) => (
          <ScoreSelect key={q} label={q} max={2} onChange={(v:number)=>update(18 + idx, v)} />
        ))}

        <h2 style={styles.score}>Total Score Économie : {totalScore} / 48</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function SehaPihariana({ title, startIndex, update, setQ, setP, setD, revenu, benefice }: any) {
  const questions = [
    "Production annuelle",
    "Dépenses annuelles",
    "Autoconsommation",
    "Quantité vendue",
    "Prix unitaire",
    "Revenu calculé",
  ];

  return (
    <div style={styles.block}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <input style={styles.input} placeholder={`Anaran’ny ${title.toLowerCase()}`} />
      <input style={styles.input} type="number" placeholder="Quantité vendue" onChange={(e)=>setQ(Number(e.target.value))} />
      <input style={styles.input} type="number" placeholder="Prix unitaire Ar" onChange={(e)=>setP(Number(e.target.value))} />
      <input style={styles.input} type="number" placeholder="Dépenses annuelles Ar" onChange={(e)=>setD(Number(e.target.value))} />

      <div style={styles.miniBox}>
        Revenu automatique : <strong>{revenu.toLocaleString()} Ar</strong><br />
        Bénéfice estimé : <strong>{benefice.toLocaleString()} Ar</strong>
      </div>

      {questions.map((q, idx) => (
        <ScoreSelect key={q} label={q} max={2} onChange={(v:number)=>update(startIndex + idx, v)} />
      ))}
    </div>
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
  label: { display: "block", marginTop: "14px", fontWeight: "bold" },
  score: { marginTop: "30px", color: "#047857", fontSize: "28px" },
  scoreBox: { background: "#ecfdf5", border: "1px solid #10b981", color: "#064e3b", padding: "18px", borderRadius: "16px", fontSize: "20px", marginTop: "24px" },
  miniBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: "12px", marginTop: "12px" },
  block: { marginTop: "28px", padding: "22px", border: "1px solid #e5e7eb", borderRadius: "18px", background: "#f8fafc" },
  sectionTitle: { color: "#064e3b", fontSize: "24px", marginTop: "10px" },
};
