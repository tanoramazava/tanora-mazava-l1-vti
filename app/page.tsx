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
  const [scores, setScores] = useState<number[]>(Array(7).fill(0));

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana Voalohany Ara-panahy</h1>
        <p style={styles.text}>Totalibeny : 52 points</p>

        <OptionSelect label="1. Efa zatra nitokam-bavaka ve ?" options={[["Isan’andro — 5",5],["Mihoatra in-3 isan-kerinandro — 3",3],["Latsaky ny in-1 isan-kerinandro — 2",2],["In-3 isam-bolana — 1",1],["Latsaky ny in-3 isam-bolana — 0",0]]} onChange={(v:number)=>update(0,v)} />
        <OptionSelect label="2. Efa nanana fiainam-bavaka nitohy ve ?" options={[["Eny — 2",2],["Tsia — 0",0]]} onChange={(v:number)=>update(1,v)} />
        <OptionSelect label="3. Efa manao pratika ny Vavaka Betela ve ?" options={[["Isan’andro — 5",5],["Mihoatra in-3 isan-kerinandro — 3",3],["Latsaky ny in-1 isan-kerinandro — 1",1],["Tsy misy — 0",0]]} onChange={(v:number)=>update(2,v)} />
        <OptionSelect label="4. Fibebahana sy fiderana" options={[["Valiny mahafapo 2/2 — 10",10],["Valiny mahafapo 1/2 — 5",5],["Valiny tsy feno — 2",2],["Diso — 0",0]]} onChange={(v:number)=>update(3,v)} />
        <OptionSelect label="5. Fo madio sy Fanaka dimy" options={[["5/5 — 10",10],["4/5 — 8",8],["3/5 — 6",6],["2/5 — 4",4],["1/5 — 2",2],["0/5 — 0",0]]} onChange={(v:number)=>update(4,v)} />
        <OptionSelect label="6. Fandroahana devoly sy fandravana planina satanika" options={[["2/2 — 10",10],["1/2 — 5",5],["Tsy feno — 2",2],["Diso — 0",0]]} onChange={(v:number)=>update(5,v)} />
        <OptionSelect label="7. Vavaka mamindra tendrombohitra" options={[["2/2 — 10",10],["1/2 — 5",5],["Tsy feno — 2",2],["Diso — 0",0]]} onChange={(v:number)=>update(6,v)} />

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

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 2 — Firotsahana ao anaty VTI</h1>
        <p style={styles.text}>Totalibeny : 29 points</p>

        <OptionSelect label="1. Efa tao anaty fikambanana ve ?" options={[["Eny — 2",2],["Tsia — 0",0]]} onChange={(v:number)=>update(0,v)} />
        <OptionSelect label="2. Efa tao anaty fikambanana tanora ve ?" options={[["Eny — 2",2],["Tsia — 0",0]]} onChange={(v:number)=>update(1,v)} />
        <OptionSelect label="3. Andraikitra teo anivon’ny vohitra/Fokontany" options={[["Mivaingana sy mazava — 5",5],["Manjavozavo — 2",2],["Tsy nisy — 0",0]]} onChange={(v:number)=>update(2,v)} />
        <OptionSelect label="4. Fahalalana mikasika ny VTI misy anao" options={[["Mazava tsara sy marina — 5",5],["Manjavozavo — 2",2],["Tsy voavaly — 0",0]]} onChange={(v:number)=>update(3,v)} />
        <OptionSelect label="5. Ao anaty Vaomiera inona ?" options={[["Ao anaty Vaomiera mazava — 5",5],["Tsy ao — 0",0]]} onChange={(v:number)=>update(4,v)} />
        <OptionSelect label="6. Andraikitra ao anatin’ny Vaomiera" options={[["Mazava tsara sy marina — 5",5],["Manjavozavo — 2",2],["Tsy voavaly — 0",0]]} onChange={(v:number)=>update(5,v)} />
        <OptionSelect label="7. Ora isan-kerinandro ao anaty Vaomiera" options={[["Adiny 4 na mihoatra — 5",5],["Mihoatra adiny 2 — 3",3],["Latsaky ny adiny 2 — 1",1],["Tsy misy — 0",0]]} onChange={(v:number)=>update(6,v)} />

        <h2 style={styles.score}>Total Score VTI : {total} / 29</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}
const yearData = (i: number, year: number) => {
  const f = filieres[i];

  if (f.type === "akoho") {
    const initialHouses = units[i][0];
    const activeHouses = year === 0 ? initialHouses : year === 1 ? initialHouses * 6 : initialHouses * 36;
    const totalPoussins = activeHouses * 160;
    const reinvestis = totalPoussins * 0.25;
    const vendus = totalPoussins * 0.75;
    const ca = vendus * 16000;
    const chargesVente = vendus * 7000;
    const investissementInitial = year === 0 ? initialHouses * 430000 : 0;
    const dep = chargesVente + investissementInitial;

    return { ca, dep, benefice: ca - dep, detail: `${activeHouses.toLocaleString()} tranon’akoho actifs ; ${totalPoussins.toLocaleString()} poussins ; ${reinvestis.toLocaleString()} réinvestis ; ${vendus.toLocaleString()} amidy ; charges sakafo/vaksiny 7 000 Ar/poussin vendu` };
  }

  if (f.type === "tantely") {
    const ca = tantelyCA[year];
    const dep = tantelyDep[year];
    return { ca, dep, benefice: ca - dep, detail: "Calcul araka ny CA sy dépenses ampidirina." };
  }

  const n = units[i][year];
  const ca = n * f.caRef[year];
  const dep = n * f.depRef[year];
  return { ca, dep, benefice: ca - dep, detail: `${n} ${f.unitName} × référence Taona ${year + 1}` };
};

const selectedCount = selected.filter(Boolean).length;
const maxScore = selectedCount * 55;

const totals = filieres.reduce(
  (acc, _f, i) => {
    if (!selected[i]) return acc;
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

const totalScore = scores.reduce((sum, s, i) => {
  if (!selected[i]) return sum;
  return sum + s.tany + s.fiofanana + s.ezaka + s.tohana + s.economie;
}, 0);

return (
  <main style={styles.main}>
    <section style={styles.card}>
      <h1 style={styles.titleSmall}>Taniketsa Fandraharahana</h1>

      <div style={styles.scoreBox}>
        <strong>Taniketsa voafidy : </strong>{selectedCount} / 5<br />
        <strong>Total CA 3 taona : </strong>{totals.ca.toLocaleString()} Ar<br />
        <strong>Total dépenses 3 taona : </strong>{totals.dep.toLocaleString()} Ar<br />
        <strong>Bénéfice prévisionnel : </strong>{totals.benefice.toLocaleString()} Ar<br />
        <strong>Total Score : </strong>{totalScore} / {maxScore}
      </div>

      {filieres.map((f, i) => {
        const scoreFiliere = scores[i].tany + scores[i].fiofanana + scores[i].ezaka + scores[i].tohana + scores[i].economie;

        return (
          <div key={f.name} style={styles.block}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={selected[i]} onChange={(e) => updateSelected(i, e.target.checked)} />
              Safidio ity Taniketsa ity : {f.name}
            </label>

            {selected[i] && (
              <>
                <h3 style={styles.sectionTitle}>{i + 1}. {f.name}</h3>

                {f.type === "akoho" && (
                  <>
                    <label style={styles.label}>{f.unitQuestion}</label>
                    <input style={styles.input} type="number" min="0" placeholder="Ohatra : 1 na 2" onChange={(e) => updateUnit(i, 0, Number(e.target.value))} />
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
                          <input style={styles.input} type="number" min="0" placeholder={`Isan’ny ${f.unitName}`} onChange={(e) => updateUnit(i, year, Number(e.target.value))} />
                        </>
                      )}

                      {f.type === "tantely" && (
                        <>
                          <input style={styles.input} type="number" placeholder="CA vinavinaina amin’ny tantely" onChange={(e) => { const copy = [...tantelyCA]; copy[year] = Number(e.target.value); setTantelyCA(copy); }} />
                          <input style={styles.input} type="number" placeholder="Dépenses vinavinaina amin’ny tantely" onChange={(e) => { const copy = [...tantelyDep]; copy[year] = Number(e.target.value); setTantelyDep(copy); }} />
                        </>
                      )}

                      <p>{d.detail}</p>
                      <strong>CA calculé : </strong>{d.ca.toLocaleString()} Ar<br />
                      <strong>Dépenses calculées : </strong>{d.dep.toLocaleString()} Ar<br />
                      <strong>Bénéfice calculé : </strong>{d.benefice.toLocaleString()} Ar
                    </div>
                  );
                })}

                <h4 style={styles.sectionTitle}>A. Fananantany — 5 points</h4>
                <textarea style={styles.textarea} placeholder="An’iza ny tany ? Fanananao ve, an’ny ray aman-dreny, hofaina, sa hafa ? Firy ny refiny ?" />
                <ScoreSelect label="Score fananantany" max={5} onChange={(v: number) => updateScore(i, "tany", v)} />

                <h4 style={styles.sectionTitle}>B. Fiofanana — 15 points</h4>
                <textarea style={styles.textarea} placeholder="Efa nahazo fiofanana ve ? Hazavao ny votoatin’ny fiofanana sy izay hainao ampiharina." />
                <ScoreSelect label="Score fiofanana" max={15} onChange={(v: number) => updateScore(i, "fiofanana", v)} />

                <h4 style={styles.sectionTitle}>C. Ezaka sy anjara biriky — 20 points</h4>
                <textarea style={styles.textarea} placeholder="Sorito ny ezaka sy anjara biriky: tany, fitaovana, vola, asa tanana, akora, sary, taratasy fanekena." />
                <ScoreSelect label="Score ezaka sy anjara biriky" max={20} onChange={(v: number) => updateScore(i, "ezaka", v)} />

                <h4 style={styles.sectionTitle}>D. Tohana ilaina — 5 points</h4>
                <textarea style={styles.textarea} placeholder="Inona no tohana tena ilaina izay tsy vitanao irery intsony ?" />
                <ScoreSelect label="Score tohana ilaina" max={5} onChange={(v: number) => updateScore(i, "tohana", v)} />

                <h4 style={styles.sectionTitle}>E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points</h4>
                <textarea style={styles.textarea} placeholder="Efa nivarotra zavatra ve ianao tao anatin’ny 3 taona farany ? Fantatrao ve ny dépenses sy tombom-barotra ? Inona ny fiofanana ilainao ?" />
                <ScoreSelect label="Score diagnostic ara-toekarena sy ara-pitantanana" max={10} onChange={(v: number) => updateScore(i, "economie", v)} />

                <h2 style={styles.score}>Score {f.name} : {scoreFiliere} / 55</h2>
              </>
            )}
          </div>
        );
      })}

      <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
    </section>
  </main>
);
}
