import { useState } from "react";

type Screen = "home" | "identite" | "spirituel" | "vti" | "economie" | "taniketsa";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "identite") return <IdentiteForm onBack={() => setScreen("home")} onNext={() => setScreen("spirituel")} />;
  if (screen === "spirituel") return <SpirituelForm onBack={() => setScreen("identite")} onNext={() => setScreen("vti")} />;
  if (screen === "vti") return <VtiForm onBack={() => setScreen("spirituel")} onNext={() => setScreen("economie")} />;
  if (screen === "economie") return <EconomieForm onBack={() => setScreen("vti")} onNext={() => setScreen("taniketsa")} />;
  if (screen === "taniketsa") return <TaniketsaForm onBack={() => setScreen("economie")} />;

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
        {["Anarana sy fanampiny", "Taona", "Kaomina", "Fokontany", "VTI misy azy", "Vaomiera misy azy"].map((p) => (
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

  const update = (i: number, v: number) => {
    const a = [...scores];
    a[i] = v;
    setScores(a);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Tombana Ara-panahy</h1>
        {questions.map((q, i) => (
          <ScoreSelect key={q} label={`${i + 1}. ${q}`} max={4} onChange={(v: number) => update(i, v)} />
        ))}
        <h2 style={styles.score}>Total Score Ara-panahy : {total} / 52</h2>
        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function VtiForm({ onBack, onNext }: any) {
  const [scores, setScores] = useState<number[]>(Array(7).fill(0));
  const questions = [
    "Efa tao anaty fikambanana ve ?",
    "Efa tao anaty fikambanana tanora ve ?",
    "Andraikitra teo anivon’ny Fokontany",
    "Fahalalana ny VTI",
    "Vaomiera misy azy",
    "Andraikitra ao amin’ny Vaomiera",
    "Ora laniana isan-kerinandro",
  ];

  const update = (i: number, v: number) => {
    const a = [...scores];
    a[i] = v;
    setScores(a);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Tombana VTI</h1>
        {questions.map((q, i) => (
          <ScoreSelect key={q} label={`${i + 1}. ${q}`} max={5} onChange={(v: number) => update(i, v)} />
        ))}
        <h2 style={styles.score}>Total Score VTI : {total} / 29</h2>
        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function EconomieForm({ onBack, onNext }: any) {
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

        <SehaPihariana title="Seha-pihariana Voalohany" startIndex={0} update={update} setQ={setQ1} setP={setP1} setD={setD1} revenu={revenu1} benefice={revenu1 - d1} />
        <SehaPihariana title="Seha-pihariana Faharoa" startIndex={6} update={update} setQ={setQ2} setP={setP2} setD={setD2} revenu={revenu2} benefice={revenu2 - d2} />
        <SehaPihariana title="Seha-pihariana Fahatelo" startIndex={12} update={update} setQ={setQ3} setP={setP3} setD={setD3} revenu={revenu3} benefice={revenu3 - d3} />

        <div style={styles.scoreBox}>
          <strong>Total revenus 3 seha-pihariana : </strong>{totalRevenu.toLocaleString()} Ar<br />
          <strong>Total dépenses : </strong>{totalDepenses.toLocaleString()} Ar<br />
          <strong>Bénéfice estimé global : </strong>{beneficeTotal.toLocaleString()} Ar
        </div>

        <h3 style={styles.sectionTitle}>Fanadihadiana ara-bola générale</h3>
        {["Total revenu annuel", "Dépenses annuelles", "Épargne annuelle", "Réinvestissement annuel", "Fahafaha-mitahiry", "Fahafaha-manitatra famokarana"].map((q, idx) => (
          <ScoreSelect key={q} label={q} max={2} onChange={(v: number) => update(18 + idx, v)} />
        ))}

        <h2 style={styles.score}>Total Score Économie : {totalScore} / 48</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}
