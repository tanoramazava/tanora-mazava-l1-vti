"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Screen =
  | "home"
  | "identite"
  | "spirituel"
  | "vti"
  | "taniketsa"
  | "imprimable";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tanoraId, setTanoraId] = useState<number | null>(null);

  if (screen === "identite") {
    return (
      <IdentiteForm
        onBack={() => setScreen("home")}
        onNext={() => setScreen("spirituel")}
        onSaved={(id: number) => setTanoraId(id)}
      />
    );
  }

  if (screen === "spirituel") {
    return (
      <SpirituelForm
        tanoraId={tanoraId}
        onBack={() => setScreen("identite")}
        onNext={() => setScreen("vti")}
      />
    );
  }

  if (screen === "vti") {
    return (
      <VtiForm
        tanoraId={tanoraId}
        onBack={() => setScreen("spirituel")}
        onNext={() => setScreen("taniketsa")}
      />
    );
  }

  if (screen === "taniketsa") {
    return (
      <TaniketsaForm
        tanoraId={tanoraId}
        onBack={() => setScreen("vti")}
      />
    );
  }

  if (screen === "imprimable") {
    return <FormulaireVierge onBack={() => setScreen("home")} />;
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>

        <h2 style={styles.subtitle}>
          TOMBANA FANOMBOHANA VTI
        </h2>

        <button
          style={styles.button}
          onClick={() => setScreen("identite")}
        >
          Hanomboka ny Tombana
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => setScreen("imprimable")}
        >
          Version imprimable vierge
        </button>
      </section>
    </main>
  );
}
function IdentiteForm({
  onBack,
  onNext,
  onSaved,
}: any) {
  const [anarana, setAnarana] = useState("");
  const [taona, setTaona] = useState("");

  const [faritra, setFaritra] = useState("");
  const [distrika, setDistrika] = useState("");
  const [kaomina, setKaomina] = useState("");
  const [typeKaomina, setTypeKaomina] = useState("Ambanivohitra");
  const [fokontany, setFokontany] = useState("");

  const [vti, setVti] = useState("");

  const enregistrer = async () => {
    const { data, error } = await supabase
      .from("tanora")
      .insert([
        {
          anarana,
          taona: taona ? parseInt(taona) : null,
          faritra,
          distrika,
          kaomina,
          type_kaomina: typeKaomina,
          fokontany,
          vti,
        },
      ])
      .select();

    if (error) {
      alert("Erreur : " + JSON.stringify(error));
      return;
    }

    const newTanoraId = data?.[0]?.id;

    await supabase.from("scores").insert([
      {
        tanora_id: newTanoraId,
        score_arapanahy: 0,
        score_vti: 0,
        score_economie: 0,
        score_taniketsa: 0,
        score_taniketsa_max: 0,
      },
    ]);

    onSaved(newTanoraId);
    alert("Voatahiry ao Supabase ! ID = " + newTanoraId);
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>

        <input style={styles.input} placeholder="Anarana sy fanampiny" value={anarana} onChange={(e) => setAnarana(e.target.value)} />
        <input style={styles.input} placeholder="Taona" type="number" value={taona} onChange={(e) => setTaona(e.target.value)} />
        <input style={styles.input} placeholder="Faritra" value={faritra} onChange={(e) => setFaritra(e.target.value)} />
        <input style={styles.input} placeholder="Distrika" value={distrika} onChange={(e) => setDistrika(e.target.value)} />
        <input style={styles.input} placeholder="Kaomina" value={kaomina} onChange={(e) => setKaomina(e.target.value)} />

        <select
          style={styles.input}
          value={typeKaomina}
          onChange={(e) => setTypeKaomina(e.target.value)}
        >
          <option value="Ambanivohitra">Kaomina Ambanivohitra</option>
          <option value="Andrenivohitra">Kaomina Andrenivohitra</option>
        </select>

        <input style={styles.input} placeholder="Fokontany" value={fokontany} onChange={(e) => setFokontany(e.target.value)} />
        <input style={styles.input} placeholder="VTI misy azy" value={vti} onChange={(e) => setVti(e.target.value)} />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={enregistrer}>
            Enregistrer sy Hanohy
          </button>
        </div>
      </section>
    </main>
  );
}
function SpirituelForm({ tanoraId, onBack, onNext }: any) {
  const [scores, setScores] = useState<number[]>(Array(7).fill(0));

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  const sauvegarderScoreSpirituel = async () => {
    if (!tanoraId) {
      alert("ID Tanora tsy hita.");
      return;
    }

    const { error } = await supabase
      .from("scores")
      .update({ score_arapanahy: total })
      .eq("tanora_id", tanoraId);

    if (error) {
      alert("Erreur Ara-panahy : " + JSON.stringify(error));
      return;
    }

    alert("Score ara-panahy voatahiry !");
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana Voalohany Ara-panahy</h1>
        <p style={styles.text}>
          Fanabeazana mitohy ho “Mpianatry ny Tompo” — Totalibeny : 52 points
        </p>

        <OptionSelect label="1. Efa zatra nitokam-bavaka ve ?" options={[["Isan’andro — 5 points", 5], ["Mihoatra in-3 isan-kerinandro — 3 points", 3], ["Latsaky ny in-1 isan-kerinandro — 2 points", 2], ["In-3 isam-bolana — 1 point", 1], ["Latsaky ny in-3 isam-bolana / tsy misy — 0 point", 0]]} onChange={(v: number) => update(0, v)} />
        <OptionSelect label="2. Efa nanana fiainam-bavaka nitohy ve ?" options={[["Eny — 2 points", 2], ["Tsia — 0 point", 0]]} onChange={(v: number) => update(1, v)} />
        <OptionSelect label="3. Efa manao pratika ny Vavaka Betela ve ?" options={[["Isan’andro — 5 points", 5], ["Mihoatra in-3 isan-kerinandro — 3 points", 3], ["Latsaky ny in-1 isan-kerinandro — 1 point", 1], ["Tsy misy — 0 point", 0]]} onChange={(v: number) => update(2, v)} />
        <OptionSelect label="4. Fibebahana sy fiderana" options={[["Valiny mahafapo 2/2 — 10 points", 10], ["Valiny mahafapo 1/2 — 5 points", 5], ["Valiny tsy feno / tsy mahafapo — 2 points", 2], ["Valiny tena diso — 0 point", 0]]} onChange={(v: number) => update(3, v)} />
        <OptionSelect label="5. Fo madio sy Fanaka dimy" options={[["Valiny mahafapo 5/5 — 10 points", 10], ["Valiny mahafapo 4/5 — 8 points", 8], ["Valiny mahafapo 3/5 — 6 points", 6], ["Valiny mahafapo 2/5 — 4 points", 4], ["Valiny mahafapo 1/5 — 2 points", 2], ["Valiny mahafapo 0/5 — 0 point", 0]]} onChange={(v: number) => update(4, v)} />
        <OptionSelect label="6. Fandroahana devoly sy fandravana planina satanika isan’andro" options={[["Valiny mahafapo 2/2 — 10 points", 10], ["Valiny mahafapo 1/2 — 5 points", 5], ["Valiny tsy feno / tsy mahafapo — 2 points", 2], ["Valiny tena diso — 0 point", 0]]} onChange={(v: number) => update(5, v)} />
        <OptionSelect label="7. Vavaka mamindra tendrombohitra" options={[["Valiny mahafapo 2/2 — 10 points", 10], ["Valiny mahafapo 1/2 — 5 points", 5], ["Valiny tsy feno / tsy mahafapo — 2 points", 2], ["Valiny tena diso — 0 point", 0]]} onChange={(v: number) => update(6, v)} />

        <h2 style={styles.score}>Total Score Ara-panahy : {total} / 52</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={sauvegarderScoreSpirituel}>
            Enregistrer score ara-panahy sy hanohy
          </button>
        </div>
      </section>
    </main>
  );
}

function VtiForm({ tanoraId, onBack, onNext }: any) {
  const [scores, setScores] = useState<number[]>(Array(7).fill(0));

  const update = (i: number, v: number) => {
    const copy = [...scores];
    copy[i] = v;
    setScores(copy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  const sauvegarderScoreVti = async () => {
    if (!tanoraId) {
      alert("ID Tanora tsy hita.");
      return;
    }

    const { error } = await supabase
      .from("scores")
      .update({ score_vti: total })
      .eq("tanora_id", tanoraId);

    if (error) {
      alert("Erreur VTI : " + JSON.stringify(error));
      return;
    }

    alert("Score VTI voatahiry !");
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 2 — Firotsahana ao anaty VTI</h1>
        <p style={styles.text}>Totalibeny : 29 points</p>

        <OptionSelect label="1. Efa tao anaty fikambanana ve ?" options={[["Eny — 2 points", 2], ["Tsia — 0 point", 0]]} onChange={(v: number) => update(0, v)} />
        <OptionSelect label="2. Efa tao anaty fikambanana tanora ve ?" options={[["Eny — 2 points", 2], ["Tsia — 0 point", 0]]} onChange={(v: number) => update(1, v)} />
        <OptionSelect label="3. Andraikitra teo anivon’ny vohitra na Fokontany" options={[["Mivaingana sy mazava — 5 points", 5], ["Manjavozavo — 2 points", 2], ["Tsy nisy — 0 point", 0]]} onChange={(v: number) => update(2, v)} />
        <OptionSelect label="4. Fahalalana mikasika ny VTI misy anao" options={[["Mazava tsara sy marina — 5 points", 5], ["Manjavozavo — 2 points", 2], ["Tsy voavaly — 0 point", 0]]} onChange={(v: number) => update(3, v)} />
        <OptionSelect label="5. Ao anaty Vaomiera inona no misy anao ?" options={[["Ao anaty Vaomiera mazava — 5 points", 5], ["Tsy ao anaty Vaomiera — 0 point", 0]]} onChange={(v: number) => update(4, v)} />
        <OptionSelect label="6. Inona no andraikitrao ao anatin’ny Vaomiera ?" options={[["Mazava tsara sy marina — 5 points", 5], ["Manjavozavo — 2 points", 2], ["Tsy voavaly — 0 point", 0]]} onChange={(v: number) => update(5, v)} />
        <OptionSelect label="7. Adiny firy isan-kerinandro no atokanao hiasa ao anaty Vaomiera ?" options={[["Adiny 4 na mihoatra — 5 points", 5], ["Mihoatra adiny 2 — 3 points", 3], ["Latsaky ny adiny 2 — 1 point", 1], ["Tsy misy — 0 point", 0]]} onChange={(v: number) => update(6, v)} />

        <h2 style={styles.score}>Total Score VTI : {total} / 29</h2>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={sauvegarderScoreVti}>
            Enregistrer score VTI sy hanohy
          </button>
        </div>
      </section>
    </main>
  );
}

function TaniketsaForm({ tanoraId, onBack }: any) {
  const filieres = [
    { type: "voly", name: "Voly rakotra 500m²", unitQuestion: "Parcelle 500m² firy no ho volenao ?", unitName: "parcelle", caRef: [754800, 876800, 876800], depRef: [230000, 110000, 170000] },
    { type: "vary", name: "Voly vary 750m²", unitQuestion: "Parcelle 750m² firy no ho volenao ?", unitName: "parcelle", caRef: [450000, 600000, 600000], depRef: [350000, 350000, 350000] },
    { type: "akoho", name: "Akoho gasy", unitQuestion: "Tranon’akoho firy no hanombohanao amin’ny Taona 1 ?", unitName: "tranon’akoho", caRef: [0, 0, 0], depRef: [0, 0, 0] },
    { type: "kisoa", name: "Fanatavezana kisoa", unitQuestion: "Kisoa firy no hatavezinao ?", unitName: "kisoa", caRef: [1400000, 1400000, 1400000], depRef: [756440, 756440, 756440] },
    { type: "tantely", name: "Tantely", unitQuestion: "Tohon-tantely firy no hompianao ?", unitName: "tohon-tantely", caRef: [0, 0, 0], depRef: [0, 0, 0] },
  ];

  const [selected, setSelected] = useState<boolean[]>(Array(5).fill(false));
  const [units, setUnits] = useState<number[][]>(filieres.map(() => [0, 0, 0]));
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

  const [reponses, setReponses] = useState(
    filieres.map(() => ({
      fananantany: "",
      fiofanana: "",
      ezaka: "",
      tohana: "",
      diagnostic: "",
    }))
  );

  const updateSelected = (i: number, checked: boolean) => {
    const copy = [...selected];
    copy[i] = checked;
    setSelected(copy);
  };

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

  const updateReponse = (i: number, key: string, value: string) => {
    const copy = reponses.map((r) => ({ ...r }));
    copy[i] = { ...copy[i], [key]: value };
    setReponses(copy);
  };

  const scoreFiliere = (i: number) =>
    scores[i].tany + scores[i].fiofanana + scores[i].ezaka + scores[i].tohana + scores[i].economie;

  const yearData = (i: number, year: number) => {
    const f = filieres[i];

    if (f.type === "akoho") {
      const initialHouses = units[i][0];
      const activeHouses = year === 0 ? initialHouses : year === 1 ? initialHouses * 6 : initialHouses * 36;
      const totalPoussins = activeHouses * 160;
      const reinvestis = totalPoussins * 0.25;
      const vendus = totalPoussins * 0.75;
      const ca = vendus * 16000;
      const dep = vendus * 7000 + (year === 0 ? initialHouses * 430000 : 0);

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: `${activeHouses.toLocaleString()} tranon’akoho actifs ; ${totalPoussins.toLocaleString()} poussins ; ${reinvestis.toLocaleString()} réinvestis ; ${vendus.toLocaleString()} amidy ; charges 7 000 Ar/poussin vendu`,
      };
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

  const filiereTotal = (i: number) => {
    if (!selected[i]) return { ca: 0, dep: 0, benefice: 0 };

    return [0, 1, 2].reduce(
      (acc, year) => {
        const d = yearData(i, year);
        acc.ca += d.ca;
        acc.dep += d.dep;
        acc.benefice += d.benefice;
        return acc;
      },
      { ca: 0, dep: 0, benefice: 0 }
    );
  };

  const selectedCount = selected.filter(Boolean).length;
  const maxScore = selectedCount * 55;

  const voly = filiereTotal(0);
  const vary = filiereTotal(1);
  const akoho = filiereTotal(2);
  const kisoa = filiereTotal(3);
  const tantely = filiereTotal(4);

  const totals = {
    ca: voly.ca + vary.ca + akoho.ca + kisoa.ca + tantely.ca,
    dep: voly.dep + vary.dep + akoho.dep + kisoa.dep + tantely.dep,
    benefice: voly.benefice + vary.benefice + akoho.benefice + kisoa.benefice + tantely.benefice,
  };

  const totalScore = scores.reduce((sum, _s, i) => {
    if (!selected[i]) return sum;
    return sum + scoreFiliere(i);
  }, 0);

  const totalEconomie = scores.reduce((sum, s, i) => {
    if (!selected[i]) return sum;
    return sum + s.economie;
  }, 0);

  const sauvegarderScoresTaniketsa = async () => {
    if (!tanoraId) {
      alert("ID Tanora tsy hita.");
      return;
    }

    const { error: scoreError } = await supabase
      .from("scores")
      .update({
        score_taniketsa: totalScore,
        score_economie: totalEconomie,
        score_taniketsa_max: maxScore,

        score_voly_rakotra: selected[0] ? scoreFiliere(0) : 0,
        score_vary: selected[1] ? scoreFiliere(1) : 0,
        score_akoho_gasy: selected[2] ? scoreFiliere(2) : 0,
        score_kisoa: selected[3] ? scoreFiliere(3) : 0,
        score_tantely: selected[4] ? scoreFiliere(4) : 0,
      })
      .eq("tanora_id", tanoraId);

    if (scoreError) {
      alert("Erreur Scores : " + JSON.stringify(scoreError));
      return;
    }

    const { error: ecoError } = await supabase.from("economies_taniketsa").insert([
      {
        tanora_id: tanoraId,

        ca_voly_rakotra: voly.ca,
        depenses_voly_rakotra: voly.dep,
        benefice_voly_rakotra: voly.benefice,

        ca_vary: vary.ca,
        depenses_vary: vary.dep,
        benefice_vary: vary.benefice,

        ca_akoho_gasy: akoho.ca,
        depenses_akoho_gasy: akoho.dep,
        benefice_akoho_gasy: akoho.benefice,

        ca_kisoa: kisoa.ca,
        depenses_kisoa: kisoa.dep,
        benefice_kisoa: kisoa.benefice,

        ca_tantely: tantely.ca,
        depenses_tantely: tantely.dep,
        benefice_tantely: tantely.benefice,

        ca_total: totals.ca,
        depenses_total: totals.dep,
        benefice_total: totals.benefice,
      },
    ]);

    if (ecoError) {
      alert("Erreur Économie : " + JSON.stringify(ecoError));
      return;
    }

    const { error: repError } = await supabase.from("reponses_taniketsa_detaillees").insert([
      {
        tanora_id: tanoraId,

        voly_rakotra_fananantany: reponses[0].fananantany,
        voly_rakotra_fiofanana: reponses[0].fiofanana,
        voly_rakotra_ezaka: reponses[0].ezaka,
        voly_rakotra_tohana: reponses[0].tohana,
        voly_rakotra_diagnostic: reponses[0].diagnostic,

        vary_fananantany: reponses[1].fananantany,
        vary_fiofanana: reponses[1].fiofanana,
        vary_ezaka: reponses[1].ezaka,
        vary_tohana: reponses[1].tohana,
        vary_diagnostic: reponses[1].diagnostic,

        akoho_gasy_fananantany: reponses[2].fananantany,
        akoho_gasy_fiofanana: reponses[2].fiofanana,
        akoho_gasy_ezaka: reponses[2].ezaka,
        akoho_gasy_tohana: reponses[2].tohana,
        akoho_gasy_diagnostic: reponses[2].diagnostic,

        kisoa_fananantany: reponses[3].fananantany,
        kisoa_fiofanana: reponses[3].fiofanana,
        kisoa_ezaka: reponses[3].ezaka,
        kisoa_tohana: reponses[3].tohana,
        kisoa_diagnostic: reponses[3].diagnostic,

        tantely_fananantany: reponses[4].fananantany,
        tantely_fiofanana: reponses[4].fiofanana,
        tantely_ezaka: reponses[4].ezaka,
        tantely_tohana: reponses[4].tohana,
        tantely_diagnostic: reponses[4].diagnostic,
      },
    ]);

    if (repError) {
      alert("Erreur Réponses détaillées : " + JSON.stringify(repError));
      return;
    }

    alert("Tombana feno voatahiry : scores, économies ary réponses détaillées !");
  };

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
          const score = scoreFiliere(i);

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
                        <strong>CA calculé : </strong>{d.ca.toLocaleString()} Ar<br />
                        <strong>Dépenses calculées : </strong>{d.dep.toLocaleString()} Ar<br />
                        <strong>Bénéfice calculé : </strong>{d.benefice.toLocaleString()} Ar
                      </div>
                    );
                  })}

                  <h4 style={styles.sectionTitle}>A. Fananantany — 5 points</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="An’iza ny tany ? Fanananao ve, an’ny ray aman-dreny, hofaina, sa hafa ? Firy ny refiny ?"
                    value={reponses[i].fananantany}
                    onChange={(e) => updateReponse(i, "fananantany", e.target.value)}
                  />
                  <ScoreSelect label="Score fananantany" max={5} onChange={(v: number) => updateScore(i, "tany", v)} />

                  <h4 style={styles.sectionTitle}>B. Fiofanana — 15 points</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="Efa nahazo fiofanana ve ? Hazavao ny votoatin’ny fiofanana sy izay hainao ampiharina."
                    value={reponses[i].fiofanana}
                    onChange={(e) => updateReponse(i, "fiofanana", e.target.value)}
                  />
                  <ScoreSelect label="Score fiofanana" max={15} onChange={(v: number) => updateScore(i, "fiofanana", v)} />

                  <h4 style={styles.sectionTitle}>C. Ezaka sy anjara biriky — 20 points</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="Sorito ny ezaka sy anjara biriky: tany, fitaovana, vola, asa tanana, akora, sary, taratasy fanekena."
                    value={reponses[i].ezaka}
                    onChange={(e) => updateReponse(i, "ezaka", e.target.value)}
                  />
                  <ScoreSelect label="Score ezaka sy anjara biriky" max={20} onChange={(v: number) => updateScore(i, "ezaka", v)} />

                  <h4 style={styles.sectionTitle}>D. Tohana ilaina — 5 points</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="Inona no tohana tena ilaina izay tsy vitanao irery intsony ?"
                    value={reponses[i].tohana}
                    onChange={(e) => updateReponse(i, "tohana", e.target.value)}
                  />
                  <ScoreSelect label="Score tohana ilaina" max={5} onChange={(v: number) => updateScore(i, "tohana", v)} />

                  <h4 style={styles.sectionTitle}>E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="Efa nivarotra zavatra ve ianao tao anatin’ny 3 taona farany ? Fantatrao ve ny dépenses sy tombom-barotra ? Inona ny fiofanana ilainao ?"
                    value={reponses[i].diagnostic}
                    onChange={(e) => updateReponse(i, "diagnostic", e.target.value)}
                  />
                  <ScoreSelect label="Score diagnostic ara-toekarena sy ara-pitantanana" max={10} onChange={(v: number) => updateScore(i, "economie", v)} />

                  <h2 style={styles.score}>Score {f.name} : {score} / 55</h2>
                </>
              )}
            </div>
          );
        })}

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={sauvegarderScoresTaniketsa}>
            Vita ny Tombana
          </button>
        </div>
      </section>
    </main>
  );
}
function FormulaireVierge({ onBack }: any) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Formulaire vierge imprimable</h1>

        <p style={styles.text}>
          À imprimer ou enregistrer en PDF : CTRL + P → Enregistrer en PDF.
        </p>

        <h2>1. Identité</h2>
        {[
          "Anarana sy fanampiny",
          "Taona",
          "Faritra",
          "Distrika",
          "Kaomina",
          "Karazana Kaomina : Ambanivohitra / Andrenivohitra",
          "Fokontany",
          "VTI misy azy",
        ].map((q) => (
          <p key={q}>□ {q} : ________________________________</p>
        ))}

        <h2>2. Tombana ara-panahy /52</h2>
        <p>Score : ____ / 52</p>

        <h2>3. Tombana VTI /29</h2>
        <p>Score : ____ / 29</p>

        <h2>4. Taniketsa Fandraharahana</h2>
        {["Voly rakotra", "Vary", "Akoho gasy", "Kisoa", "Tantely"].map((f) => (
          <div key={f} style={styles.block}>
            <h3>{f}</h3>
            <p>Fananantany : ________________________________</p>
            <p>Fiofanana : ________________________________</p>
            <p>Ezaka sy anjara biriky : ________________________________</p>
            <p>Tohana ilaina : ________________________________</p>
            <p>Diagnostic ara-toekarena : ________________________________</p>
            <p>Score : ____ / 55</p>
            <p>CA 3 taona : __________ Ar</p>
            <p>Dépenses 3 taona : __________ Ar</p>
            <p>Bénéfice 3 taona : __________ Ar</p>
          </div>
        ))}

        <h2>5. Synthèse</h2>
        <p>Total Score : ____ / ____</p>
        <p>Total CA : __________ Ar</p>
        <p>Total dépenses : __________ Ar</p>
        <p>Total bénéfice : __________ Ar</p>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={() => window.print()}>
            Imprimer / Enregistrer en PDF
          </button>
        </div>
      </section>
    </main>
  );
}
function OptionSelect({ label, options, onChange }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} onChange={(e) => onChange(Number(e.target.value))}>
        <option value={0}>Safidio</option>
        {options.map(([text, value]: [string, number]) => (
          <option key={text} value={value}>{text}</option>
        ))}
      </select>
    </div>
  );
}

function ScoreSelect({ label, max, onChange }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} onChange={(e) => onChange(Number(e.target.value))}>
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
  textarea: { width: "100%", minHeight: "120px", padding: "14px", marginTop: "10px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" },
  actions: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  label: { display: "block", marginTop: "14px", fontWeight: "bold" },
  checkboxLabel: { display: "flex", gap: "10px", alignItems: "center", fontWeight: "bold", fontSize: "18px", color: "#064e3b" },
  score: { marginTop: "24px", color: "#047857", fontSize: "24px" },
  scoreBox: { background: "#ecfdf5", border: "1px solid #10b981", color: "#064e3b", padding: "18px", borderRadius: "16px", fontSize: "20px", marginTop: "24px" },
  miniBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: "12px", marginTop: "12px" },
  block: { marginTop: "28px", padding: "22px", border: "1px solid #e5e7eb", borderRadius: "18px", background: "#f8fafc" },
  sectionTitle: { color: "#064e3b", fontSize: "24px", marginTop: "10px" },
};
