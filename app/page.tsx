"use client";

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
        <button style={styles.button} onClick={() => setScreen("identite")}>
          Hanomboka ny Tombana
        </button>
      </section>
    </main>
  );
}

function IdentiteForm({ onBack, onNext }: any) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>
        {["Anarana sy fanampiny", "Taona", "Kaomina", "Fokontany", "VTI misy azy"].map((p) => (
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
    "Fahazarana mivavaka", "Famakiana Baiboly", "Fandraisana anjara am-piangonana",
    "Fiainam-piderana", "Fitiavana namana", "Fahadiovam-piainana",
    "Fahamarinana", "Fanajana ray aman-dreny", "Fanampiana hafa",
    "Fifehezan-tena", "Fanajana fotoana", "Faharetana", "Fahavononana hanompo",
  ];

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
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
    "Efa tao anaty fikambanana ve ?", "Efa tao anaty fikambanana tanora ve ?",
    "Andraikitra teo anivon’ny Fokontany", "Fahalalana ny VTI",
    "Vaomiera misy azy", "Andraikitra ao amin’ny Vaomiera", "Ora laniana isan-kerinandro",
  ];

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
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
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fanadihadiana Ara-toekarena</h1>

        <p style={styles.text}>
          Ity écran ity dia tetezana mankany amin’ny Taniketsa
          Fandraharahana. Ny diagnostic ara-toekarena sy ara-pitantanana
          amin’ny antsipiriany dia tafiditra ao anatin’ny Taniketsa.
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
    {
      type: "voly",
      name: "Voly rakotra 500m²",
      unitQuestion: "Parcelle 500m² firy no ho volenao ?",
      unitName: "parcelle",
      caRef: [754800, 876800, 876800],
      depRef: [230000, 110000, 170000],
    },
    {
      type: "vary",
      name: "Voly vary 750m²",
      unitQuestion: "Parcelle 750m² firy no ho volenao ?",
      unitName: "parcelle",
      caRef: [450000, 600000, 600000],
      depRef: [350000, 350000, 350000],
    },
    {
      type: "akoho",
      name: "Akoho gasy",
      unitQuestion: "Tranon’akoho firy no hanombohanao amin’ny Taona 1 ?",
      unitName: "tranon’akoho",
      caRef: [0, 0, 0],
      depRef: [0, 0, 0],
    },
    {
      type: "kisoa",
      name: "Fanatavezana kisoa",
      unitQuestion: "Kisoa firy no hatavezinao ?",
      unitName: "kisoa",
      caRef: [1400000, 1400000, 1400000],
      depRef: [756440, 756440, 756440],
    },
    {
      type: "tantely",
      name: "Tantely",
      unitQuestion: "Tohon-tantely firy no hompianao ?",
      unitName: "tohon-tantely",
      caRef: [0, 0, 0],
      depRef: [0, 0, 0],
    },
  ];

  const [units, setUnits] = useState<number[][]>(
    filieres.map(() => [0, 0, 0])
  );

  const [tantelyCA, setTantelyCA] = useState<number[]>([0, 0, 0]);
  const [tantelyDep, setTantelyDep] = useState<number[]>([0, 0, 0]);

  const [scores, setScores] = useState(
    filieres.map(() => ({
      tany: 0,
      fiofanana: 0,
      ezaka: 0,
      tohana: 0,
      economie: 0,
    }))
  );

  const updateUnit = (i: number, year: number, value: number) => {
    const copy = units.map((row) => [...row]);
    copy[i][year] = value;
    setUnits(copy);
  };

  const updateScore = (i: number, key: string, value: number) => {
    const copy = scores.map((s) => ({ ...s }));
    copy[i] = { ...copy[i], [key]: value };
    setScores(copy);
  };

  const yearData = (i: number, year: number) => {
    const f = filieres[i];

    if (f.type === "akoho") {
      const initialHouses = units[i][0];

      const activeHouses =
        year === 0 ? initialHouses : year === 1 ? initialHouses * 6 : initialHouses * 36;

      const totalPoussins = activeHouses * 160;
      const reinvestis = totalPoussins * 0.25;
      const vendus = totalPoussins * 0.75;

      const ca = vendus * 16000;
      const chargesVente = vendus * 3000;
      const investissementInitial = year === 0 ? initialHouses * 430000 : 0;
      const dep = chargesVente + investissementInitial;

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: `${activeHouses.toLocaleString()} tranon’akoho actifs ; ${totalPoussins.toLocaleString()} poussins ; ${reinvestis.toLocaleString()} réinvestis ; ${vendus.toLocaleString()} amidy`,
      };
    }

    if (f.type === "tantely") {
      const ca = tantelyCA[year];
      const dep = tantelyDep[year];

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: "Calcul araka ny CA sy dépenses ampidirina.",
      };
    }

    const n = units[i][year];
    const ca = n * f.caRef[year];
    const dep = n * f.depRef[year];

    return {
      ca,
      dep,
      benefice: ca - dep,
      detail: `${n} ${f.unitName} × référence Taona ${year + 1}`,
    };
  };

  const totals = filieres.reduce(
    (acc, _f, i) => {
      [0, 1, 2].forEach((year) => {
        const d = yearData(i, year);
        acc.ca += d.ca;
        acc.dep += d.dep;
        acc.benefice += d.benefice;
      });
      return acc;
    },
    { ca: 0, dep: 0, benefice: 0 }
  );

  const totalScore = scores.reduce(
    (sum, s) =>
      sum + s.tany + s.fiofanana + s.ezaka + s.tohana + s.economie,
    0
  );
   return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Taniketsa Fandraharahana</h1>

        <div style={styles.scoreBox}>
          <strong>Total CA 3 taona : </strong>
          {totals.ca.toLocaleString()} Ar
          <br />
          <strong>Total dépenses 3 taona : </strong>
          {totals.dep.toLocaleString()} Ar
          <br />
          <strong>Bénéfice prévisionnel : </strong>
          {totals.benefice.toLocaleString()} Ar
          <br />
          <strong>Total Score : </strong>
          {totalScore} / 275
        </div>

        {filieres.map((f, i) => {
          const scoreFiliere =
            scores[i].tany +
            scores[i].fiofanana +
            scores[i].ezaka +
            scores[i].tohana +
            scores[i].economie;

          return (
            <div key={f.name} style={styles.block}>
              <h3 style={styles.sectionTitle}>
                {i + 1}. {f.name}
              </h3>

              {f.type === "akoho" && (
                <>
                  <label style={styles.label}>{f.unitQuestion}</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    placeholder="Ohatra : 1 na 2"
                    onChange={(e) =>
                      updateUnit(i, 0, Number(e.target.value))
                    }
                  />
                </>
              )}

              {[0, 1, 2].map((year) => {
                const d = yearData(i, year);

                return (
                  <div key={year} style={styles.miniBox}>
                    <h4>Taona {year + 1}</h4>

                    {f.type !== "akoho" && (
                      <>
                        <label style={styles.label}>{f.unitQuestion}</label>
                        <input
                          style={styles.input}
                          type="number"
                          min="0"
                          placeholder={`Isan’ny ${f.unitName}`}
                          onChange={(e) =>
                            updateUnit(i, year, Number(e.target.value))
                          }
                        />
                      </>
                    )}

                    {f.type === "tantely" && (
                      <>
                        <input
                          style={styles.input}
                          type="number"
                          placeholder="CA vinavinaina amin’ny tantely"
                          onChange={(e) => {
                            const copy = [...tantelyCA];
                            copy[year] = Number(e.target.value);
                            setTantelyCA(copy);
                          }}
                        />

                        <input
                          style={styles.input}
                          type="number"
                          placeholder="Dépenses vinavinaina amin’ny tantely"
                          onChange={(e) => {
                            const copy = [...tantelyDep];
                            copy[year] = Number(e.target.value);
                            setTantelyDep(copy);
                          }}
                        />
                      </>
                    )}

                    <p>{d.detail}</p>
                    <strong>CA calculé : </strong>
                    {d.ca.toLocaleString()} Ar
                    <br />
                    <strong>Dépenses calculées : </strong>
                    {d.dep.toLocaleString()} Ar
                    <br />
                    <strong>Bénéfice calculé : </strong>
                    {d.benefice.toLocaleString()} Ar
                  </div>
                );
              })}

              <h4 style={styles.sectionTitle}>A. Fananantany — 5 points</h4>
              <textarea
                style={styles.textarea}
                placeholder="An’iza ny tany ? Fanananao ve, an’ny ray aman-dreny, hofaina, sa hafa ? Firy ny refiny ?"
              />
              <ScoreSelect
                label="Score fananantany"
                max={5}
                onChange={(v: number) => updateScore(i, "tany", v)}
              />

              <h4 style={styles.sectionTitle}>B. Fiofanana — 15 points</h4>
              <textarea
                style={styles.textarea}
                placeholder="Efa nahazo fiofanana ve ? Hazavao ny votoatin’ny fiofanana sy izay hainao ampiharina."
              />
              <ScoreSelect
                label="Score fiofanana"
                max={15}
                onChange={(v: number) => updateScore(i, "fiofanana", v)}
              />

              <h4 style={styles.sectionTitle}>
                C. Ezaka sy anjara biriky — 20 points
              </h4>
              <textarea
                style={styles.textarea}
                placeholder="Sorito ny ezaka sy anjara biriky: tany, fitaovana, vola, asa tanana, akora, sary, taratasy fanekena."
              />
              <ScoreSelect
                label="Score ezaka sy anjara biriky"
                max={20}
                onChange={(v: number) => updateScore(i, "ezaka", v)}
              />

              <h4 style={styles.sectionTitle}>D. Tohana ilaina — 5 points</h4>
              <textarea
                style={styles.textarea}
                placeholder="Inona no tohana tena ilaina izay tsy vitanao irery intsony ?"
              />
              <ScoreSelect
                label="Score tohana ilaina"
                max={5}
                onChange={(v: number) => updateScore(i, "tohana", v)}
              />

              <h4 style={styles.sectionTitle}>
                E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points
              </h4>
              <p style={styles.text}>
                Ity fanadihadiana ity dia tsy hitsarana ny tanora, fa
                hamantarana ny tena olana sy ny banga ara-bola,
                ara-pitantanana ary ara-barotra mbola mila fiofanana.
              </p>

              <textarea
                style={styles.textarea}
                placeholder="1. Efa nivarotra zavatra ve ianao tao anatin’ny 3 taona farany ? Inona avy ?"
              />
              <textarea
                style={styles.textarea}
                placeholder="2. Fantatrao ve ny tena dépenses sy tombom-barotra tamin’izany ? Hazavao."
              />
              <textarea
                style={styles.textarea}
                placeholder="3. Efa nanao fitahirizana vola ve ianao ? Ahoana ?"
              />
              <textarea
                style={styles.textarea}
                placeholder="4. Inona no tena olana ara-bola na ara-pitantanana nanjo anao tao anatin’ny 3 taona farany ?"
              />
              <textarea
                style={styles.textarea}
                placeholder="5. Raha mahazo fanohanana ianao dia inona no zavatra voalohany hataonao mba hampahomby ny Taniketsa ?"
              />
              <textarea
                style={styles.textarea}
                placeholder="6. Inona avy ireo fiofanana tena ilainao : kajy dépenses, tombom-barotra, fitantanana vola, tsena, fitahirizana vola, sns ?"
              />

              <ScoreSelect
                label="Score diagnostic ara-toekarena sy ara-pitantanana"
                max={10}
                onChange={(v: number) => updateScore(i, "economie", v)}
              />

              <h2 style={styles.score}>
                Score {f.name} : {scoreFiliere} / 55
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
    minHeight: "120px",
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
