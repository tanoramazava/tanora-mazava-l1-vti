"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Screen =
  | "home"
  | "identite"
  | "spirituel"
  | "vti"
  | "taniketsa"
  | "imprimable"
  | "fiche";

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

  if (screen === "fiche") {
    return <FicheRemplie onBack={() => setScreen("home")} />;
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>

        <h2 style={styles.subtitle}>
          TOMBANA FANOMBOHANA VTI
        </h2>

        <button style={styles.button} onClick={() => setScreen("identite")}>
          Hanomboka ny Tombana
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("imprimable")}>
          Version imprimable vierge
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("fiche")}>
          Fiche remplie par ID Tanora
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
  const [reponses, setReponses] = useState<string[]>(Array(7).fill(""));

  const update = (i: number, v: number, options: [string, number][]) => {
    const scoreCopy = [...scores];
    scoreCopy[i] = v;
    setScores(scoreCopy);

    const repCopy = [...reponses];
    repCopy[i] = options.find((o) => o[1] === v)?.[0] || "";
    setReponses(repCopy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  const q1: [string, number][] = [
    ["Isan’andro — 5 points", 5],
    ["Mihoatra in-3 isan-kerinandro — 3 points", 3],
    ["Latsaky ny in-1 isan-kerinandro — 2 points", 2],
    ["In-3 isam-bolana — 1 point", 1],
    ["Latsaky ny in-3 isam-bolana / tsy misy — 0 point", 0],
  ];

  const q2: [string, number][] = [
    ["Eny — 2 points", 2],
    ["Tsia — 0 point", 0],
  ];

  const q3: [string, number][] = [
    ["Isan’andro — 5 points", 5],
    ["Mihoatra in-3 isan-kerinandro — 3 points", 3],
    ["Latsaky ny in-1 isan-kerinandro — 1 point", 1],
    ["Tsy misy — 0 point", 0],
  ];

  const q10: [string, number][] = [
    ["Valiny mahafapo 2/2 — 10 points", 10],
    ["Valiny mahafapo 1/2 — 5 points", 5],
    ["Valiny tsy feno / tsy mahafapo — 2 points", 2],
    ["Valiny tena diso — 0 point", 0],
  ];

  const q5: [string, number][] = [
    ["Valiny mahafapo 5/5 — 10 points", 10],
    ["Valiny mahafapo 4/5 — 8 points", 8],
    ["Valiny mahafapo 3/5 — 6 points", 6],
    ["Valiny mahafapo 2/5 — 4 points", 4],
    ["Valiny mahafapo 1/5 — 2 points", 2],
    ["Valiny mahafapo 0/5 — 0 point", 0],
  ];

  const sauvegarderScoreSpirituel = async () => {
    const { error: scoreError } = await supabase
      .from("scores")
      .update({ score_arapanahy: total })
      .eq("tanora_id", tanoraId);

    if (scoreError) {
      alert(JSON.stringify(scoreError));
      return;
    }

    const { error: repError } = await supabase
      .from("reponses_spirituel")
      .insert([
        {
          tanora_id: tanoraId,
          spirituel_q1: reponses[0],
          spirituel_q2: reponses[1],
          spirituel_q3: reponses[2],
          spirituel_q4: reponses[3],
          spirituel_q5: reponses[4],
          spirituel_q6: reponses[5],
          spirituel_q7: reponses[6],
        },
      ]);

    if (repError) {
      alert(JSON.stringify(repError));
      return;
    }

    alert("Réponses ara-panahy voatahiry !");
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana Voalohany Ara-panahy</h1>

        <OptionSelect label="1. Efa zatra nitokam-bavaka ve ?" options={q1} onChange={(v:number)=>update(0,v,q1)} />
        <OptionSelect label="2. Efa nanana fiainam-bavaka nitohy ve ?" options={q2} onChange={(v:number)=>update(1,v,q2)} />
        <OptionSelect label="3. Efa manao pratika ny Vavaka Betela ve ?" options={q3} onChange={(v:number)=>update(2,v,q3)} />
        <OptionSelect label="4. Fibebahana sy fiderana" options={q10} onChange={(v:number)=>update(3,v,q10)} />
        <OptionSelect label="5. Fo madio sy Fanaka dimy" options={q5} onChange={(v:number)=>update(4,v,q5)} />
        <OptionSelect label="6. Fandroahana devoly sy fandravana planina satanika isan’andro" options={q10} onChange={(v:number)=>update(5,v,q10)} />
        <OptionSelect label="7. Vavaka mamindra tendrombohitra" options={q10} onChange={(v:number)=>update(6,v,q10)} />

        <h2 style={styles.score}>
          Total Score Ara-panahy : {total} / 52
        </h2>

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
  const [reponses, setReponses] = useState<string[]>(Array(7).fill(""));

  const update = (i: number, v: number, options: [string, number][]) => {
    const scoreCopy = [...scores];
    scoreCopy[i] = v;
    setScores(scoreCopy);

    const repCopy = [...reponses];
    repCopy[i] = options.find((o) => o[1] === v)?.[0] || "";
    setReponses(repCopy);
  };

  const total = scores.reduce((s, v) => s + v, 0);

  const ouiNon: [string, number][] = [
    ["Eny — 2 points", 2],
    ["Tsia — 0 point", 0],
  ];

  const q5: [string, number][] = [
    ["Mazava tsara sy marina — 5 points", 5],
    ["Manjavozavo — 2 points", 2],
    ["Tsy voavaly — 0 point", 0],
  ];

  const q3: [string, number][] = [
    ["Mivaingana sy mazava — 5 points", 5],
    ["Manjavozavo — 2 points", 2],
    ["Tsy nisy — 0 point", 0],
  ];

  const vaomiera: [string, number][] = [
    ['Vaomiera "Ara-panahy sy fanabeazana" — 5 points', 5],
    ['Vaomiera "Fandraharahana sy Toekarena" — 5 points', 5],
    ['Vaomiera "Fahasalamana sy fiarovana ny tanora" — 5 points', 5],
    [
      'Vaomiera "Etika Fampandrosoana maharitra" (Fandriampahalemana, Ady amin’ny kolikoly, Tontolo iainana) — 5 points',
      5,
    ],
    ["Tsy ao anaty Vaomiera — 0 point", 0],
  ];

  const ora: [string, number][] = [
    ["Adiny 4 na mihoatra — 5 points", 5],
    ["Mihoatra adiny 2 — 3 points", 3],
    ["Latsaky ny adiny 2 — 1 point", 1],
    ["Tsy misy — 0 point", 0],
  ];

  const sauvegarderScoreVti = async () => {
    const { error: scoreError } = await supabase
      .from("scores")
      .update({ score_vti: total })
      .eq("tanora_id", tanoraId);

    if (scoreError) {
      alert(JSON.stringify(scoreError));
      return;
    }

    const { error: repError } = await supabase
      .from("reponses_vti")
      .insert([
        {
          tanora_id: tanoraId,
          vti_q1: reponses[0],
          vti_q2: reponses[1],
          vti_q3: reponses[2],
          vti_q4: reponses[3],
          vti_q5: reponses[4],
          vti_q6: reponses[5],
          vti_q7: reponses[6],
        },
      ]);

    if (repError) {
      alert(JSON.stringify(repError));
      return;
    }

    alert("Réponses VTI voatahiry !");
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Fizarana 2 — Firotsahana ao anaty VTI
        </h1>

        <p style={styles.text}>Totalibeny : 29 points</p>

        <OptionSelect
          label="1. Efa tao anaty fikambanana ve ?"
          options={ouiNon}
          onChange={(v: number) => update(0, v, ouiNon)}
        />

        <OptionSelect
          label="2. Efa tao anaty fikambanana tanora ve ?"
          options={ouiNon}
          onChange={(v: number) => update(1, v, ouiNon)}
        />

        <OptionSelect
          label="3. Andraikitra teo anivon’ny vohitra na Fokontany"
          options={q3}
          onChange={(v: number) => update(2, v, q3)}
        />

        <OptionSelect
          label="4. Fahalalana mikasika ny VTI misy anao"
          options={q5}
          onChange={(v: number) => update(3, v, q5)}
        />

        <OptionSelect
          label="5. Safidio ny Vaomiera misy anao"
          options={vaomiera}
          onChange={(v: number) => update(4, v, vaomiera)}
        />

        <OptionSelect
          label="6. Inona no andraikitrao ao anatin’ny Vaomiera ?"
          options={q5}
          onChange={(v: number) => update(5, v, q5)}
        />

        <OptionSelect
          label="7. Adiny firy isan-kerinandro no atokanao hiasa ao anaty Vaomiera ?"
          options={ora}
          onChange={(v: number) => update(6, v, ora)}
        />

        <h2 style={styles.score}>
          Total Score VTI : {total} / 29
        </h2>

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
function TaniketsaForm({ tanoraId, onBack, onNext }: any) {
  const filieres = [
    {
      type: "voly_rakotra",
      name: "Voly rakotra 500m²",
      unitQuestion: "Firy ny parcelles Voly rakotra ?",
      unitName: "parcelle",
      caRef: [7647200, 7647200, 7647200],
      depRef: [1470000, 1470000, 1470000],
    },

    {
      type: "vary",
      name: "Voly vary 750m²",
      unitQuestion: "Firy ny parcelles Voly vary ?",
      unitName: "parcelle",
      caRef: [3500000, 3500000, 3500000],
      depRef: [1200000, 1200000, 1200000],
    },

    {
      type: "akoho_gasy",
      name: "Akoho gasy",
      unitQuestion: "Firy ny Tokatranon’akoho ?",
      unitName: "tokatranon’akoho",
      caRef: [165120000, 165120000, 165120000],
      depRef: [73100000, 73100000, 73100000],
    },

    {
      type: "kisoa",
      name: "Kisoa",
      unitQuestion: "Firy ny sites kisoa ?",
      unitName: "site",
      caRef: [12000000, 12000000, 12000000],
      depRef: [4500000, 4500000, 4500000],
    },

    // ===== TANTELY CORRIGÉ =====
    {
      type: "tantely",
      name: "Tantely",
      unitQuestion: "Tohon-tantely firy no hompianao ?",
      unitName: "tohon-tantely",

      // 42 litres × 9.000 Ar
      caRef: [378000, 378000, 378000],

      // année 1 = ruche vaovao
      // année suivante = tsy mividy ruche intsony
      depRef: [295000, 135000, 135000],
    },
  ];

  const [units, setUnits] = useState<number[][]>(
    filieres.map(() => [0, 0, 0])
  );

  const handleUnits = (
    filiereIndex: number,
    year: number,
    value: number
  ) => {
    const copy = [...units];
    copy[filiereIndex][year] = value;
    setUnits(copy);
  };

  // ===============================
  // CALCULS AUTOMATIQUES
  // ===============================

  const yearData = filieres.map((f, i) => {
    const rows = [0, 1, 2].map((year) => {
      const unitsCount = units[i][year];

      // =========================================
      // FILIERE TANTELY — CALCUL SPÉCIAL
      // =========================================

      if (f.type === "tantely") {
        const ruchesActives = unitsCount;

        const ruchesAvant =
          year === 0 ? 0 : units[i][year - 1];

        const ruchesNouvelles = Math.max(
          ruchesActives - ruchesAvant,
          0
        );

        const ruchesAnciennes =
          ruchesActives - ruchesNouvelles;

        // ======================
        // CHIFFRE D’AFFAIRES
        // ======================

        // 42 litres × 9.000 Ar
        const caParRuche = 378000;

        const ca = ruchesActives * caParRuche;

        // ======================
        // DEPENSES
        // ======================

        // Ruche vaovao :
        // 295.000 Ar
        // (ruche + reine + charges)

        // Ruche ancienne :
        // 135.000 Ar
        // (sans achat ruche)

        const dep =
          ruchesNouvelles * 295000 +
          ruchesAnciennes * 135000;

        const benefice = ca - dep;

        const detail =
          `Taona ${year + 1} : ` +
          `${ruchesActives} tohontantely, ` +
          `${ruchesNouvelles} vaovao, ` +
          `${ruchesAnciennes} efa nisy. ` +
          `CA = ${ca.toLocaleString()} Ar ; ` +
          `Dépenses = ${dep.toLocaleString()} Ar ; ` +
          `Bénéfice = ${benefice.toLocaleString()} Ar`;

        return {
          year: year + 1,
          units: ruchesActives,
          ca,
          dep,
          benefice,
          detail,
        };
      }

      // =========================================
      // FILIERES HAFATRA
      // =========================================

      const ca = unitsCount * f.caRef[year];
      const dep = unitsCount * f.depRef[year];
      const benefice = ca - dep;

      return {
        year: year + 1,
        units: unitsCount,
        ca,
        dep,
        benefice,
        detail:
          `CA ${ca.toLocaleString()} Ar ; ` +
          `Dépenses ${dep.toLocaleString()} Ar ; ` +
          `Bénéfice ${benefice.toLocaleString()} Ar`,
      };
    });

    return {
      type: f.type,
      name: f.name,
      rows,
    };
  });

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Taniketsa Fandraharahana
        </h1>

        {filieres.map((f, i) => (
          <div key={f.type} style={styles.block}>
            <h2>{f.name}</h2>

            {[0, 1, 2].map((year) => (
              <div key={year}>
                <label style={styles.label}>
                  Taona {year + 1} — {f.unitQuestion}
                </label>

                <input
                  style={styles.input}
                  type="number"
                  min={0}
                  value={units[i][year]}
                  onChange={(e) =>
                    handleUnits(
                      i,
                      year,
                      parseInt(e.target.value || "0")
                    )
                  }
                />
              </div>
            ))}

            <div style={styles.scoreBox}>
              {yearData[i].rows.map((r) => (
                <div key={r.year}>
                  <p>
                    <strong>Taona {r.year}</strong>
                  </p>

                  <p>
                    Unités : {r.units}
                  </p>

                  <p>
                    CA : {r.ca.toLocaleString()} Ar
                  </p>

                  <p>
                    Dépenses : {r.dep.toLocaleString()} Ar
                  </p>

                  <p>
                    Bénéfice : {r.benefice.toLocaleString()} Ar
                  </p>

                  <p>{r.detail}</p>

                  <hr />
                </div>
              ))}
            </div>
          </div>
        ))}

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
            Hanohy
          </button>
        </div>
      </section>
    </main>
  );
}
function FicheRemplie({ onBack }: any) {
  const [id, setId] = useState("");
  const [tanora, setTanora] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [eco, setEco] = useState<any>(null);
  const [rep, setRep] = useState<any>(null);
  const [repSpirituel, setRepSpirituel] = useState<any>(null);
  const [repVti, setRepVti] = useState<any>(null);

  const chargerFiche = async () => {
    const tanoraId = parseInt(id);

    const { data: tanoraData } = await supabase
      .from("tanora")
      .select("*")
      .eq("id", tanoraId)
      .maybeSingle();

    const { data: scoresData } = await supabase
      .from("scores")
      .select("*")
      .eq("tanora_id", tanoraId)
      .maybeSingle();

    const { data: ecoData } = await supabase
      .from("economies_taniketsa")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: repData } = await supabase
      .from("reponses_taniketsa_detaillees")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: spirituelData } = await supabase
      .from("reponses_spirituel")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: vtiData } = await supabase
      .from("reponses_vti")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setTanora(tanoraData);
    setScores(scoresData);
    setEco(ecoData);
    setRep(repData);
    setRepSpirituel(spirituelData);
    setRepVti(vtiData);
  };

  const LigneQuestion = ({ numero, question, reponse }: any) => (
    <div style={styles.miniBox}>
      <h4>{numero}. {question}</h4>
      <p>
        <strong>Valiny nomena :</strong> {reponse || "—"}
      </p>
    </div>
  );

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Fiche individuelle scientifique remplie
        </h1>

        <input
          style={styles.input}
          type="number"
          placeholder="Ampidiro ny ID Tanora"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button style={styles.button} onClick={chargerFiche}>
          Charger la fiche
        </button>

        {tanora && (
          <>
            <h2>1. Famantarana ny Tanora</h2>
            <p>Anarana sy fanampiny : {tanora.anarana}</p>
            <p>Taona : {tanora.taona}</p>
            <p>Faritra : {tanora.faritra}</p>
            <p>Distrika : {tanora.distrika}</p>
            <p>Kaomina : {tanora.kaomina}</p>
            <p>Karazana Kaomina : {tanora.type_kaomina}</p>
            <p>Fokontany : {tanora.fokontany}</p>
            <p>VTI misy azy : {tanora.vti}</p>

            <hr />

            <h2>2. Tombana ara-panahy — 52 points</h2>

            <LigneQuestion numero="1" question="Efa zatra nitokam-bavaka ve ?" reponse={repSpirituel?.spirituel_q1} />
            <LigneQuestion numero="2" question="Efa nanana fiainam-bavaka nitohy ve ?" reponse={repSpirituel?.spirituel_q2} />
            <LigneQuestion numero="3" question="Efa manao pratika ny Vavaka Betela ve ?" reponse={repSpirituel?.spirituel_q3} />
            <LigneQuestion numero="4" question="Fibebahana sy fiderana" reponse={repSpirituel?.spirituel_q4} />
            <LigneQuestion numero="5" question="Fo madio sy Fanaka dimy" reponse={repSpirituel?.spirituel_q5} />
            <LigneQuestion numero="6" question="Fandroahana devoly sy fandravana planina satanika isan’andro" reponse={repSpirituel?.spirituel_q6} />
            <LigneQuestion numero="7" question="Vavaka mamindra tendrombohitra" reponse={repSpirituel?.spirituel_q7} />

            <h3>Total ara-panahy : {scores?.score_arapanahy || 0} / 52</h3>

            <hr />

            <h2>3. Tombana VTI — 29 points</h2>

            <LigneQuestion numero="1" question="Efa tao anaty fikambanana ve ?" reponse={repVti?.vti_q1} />
            <LigneQuestion numero="2" question="Efa tao anaty fikambanana tanora ve ?" reponse={repVti?.vti_q2} />
            <LigneQuestion numero="3" question="Andraikitra teo anivon’ny vohitra na Fokontany" reponse={repVti?.vti_q3} />
            <LigneQuestion numero="4" question="Fahalalana mikasika ny VTI misy azy" reponse={repVti?.vti_q4} />
            <LigneQuestion numero="5" question="Ao anaty Vaomiera inona no misy azy ?" reponse={repVti?.vti_q5} />
            <LigneQuestion numero="6" question="Inona no andraikiny ao anatin’ny Vaomiera ?" reponse={repVti?.vti_q6} />
            <LigneQuestion numero="7" question="Adiny firy isan-kerinandro no atokany hiasa ao anaty Vaomiera ?" reponse={repVti?.vti_q7} />

            <h3>Total VTI : {scores?.score_vti || 0} / 29</h3>

            <hr />

            <h2>4. Taniketsa Fandraharahana</h2>

            <p>
              Total score Taniketsa : {scores?.score_taniketsa || 0} /{" "}
              {scores?.score_taniketsa_max || 0}
            </p>
            <p>Score économie : {scores?.score_economie || 0}</p>

            <h3>Voly rakotra 500m²</h3>
            <p>Fananantany : {rep?.voly_rakotra_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.voly_rakotra_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.voly_rakotra_ezaka || "—"}</p>
            <p>Tohana : {rep?.voly_rakotra_tohana || "—"}</p>
            <p>Diagnostic : {rep?.voly_rakotra_diagnostic || "—"}</p>
            <p>Score : {scores?.score_voly_rakotra || 0} / 55</p>
            <p>
              CA : {eco?.ca_voly_rakotra || 0} Ar — Dépenses :{" "}
              {eco?.depenses_voly_rakotra || 0} Ar — Bénéfice :{" "}
              {eco?.benefice_voly_rakotra || 0} Ar
            </p>

            <h3>Voly vary 750m²</h3>
            <p>Fananantany : {rep?.vary_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.vary_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.vary_ezaka || "—"}</p>
            <p>Tohana : {rep?.vary_tohana || "—"}</p>
            <p>Diagnostic : {rep?.vary_diagnostic || "—"}</p>
            <p>Score : {scores?.score_vary || 0} / 55</p>
            <p>
              CA : {eco?.ca_vary || 0} Ar — Dépenses :{" "}
              {eco?.depenses_vary || 0} Ar — Bénéfice :{" "}
              {eco?.benefice_vary || 0} Ar
            </p>

            <h3>Akoho gasy</h3>
            <p>Fananantany : {rep?.akoho_gasy_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.akoho_gasy_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.akoho_gasy_ezaka || "—"}</p>
            <p>Tohana : {rep?.akoho_gasy_tohana || "—"}</p>
            <p>Diagnostic : {rep?.akoho_gasy_diagnostic || "—"}</p>
            <p>Score : {scores?.score_akoho_gasy || 0} / 55</p>
            <p>
              CA : {eco?.ca_akoho_gasy || 0} Ar — Dépenses :{" "}
              {eco?.depenses_akoho_gasy || 0} Ar — Bénéfice :{" "}
              {eco?.benefice_akoho_gasy || 0} Ar
            </p>

            <h3>Kisoa</h3>
            <p>Fananantany : {rep?.kisoa_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.kisoa_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.kisoa_ezaka || "—"}</p>
            <p>Tohana : {rep?.kisoa_tohana || "—"}</p>
            <p>Diagnostic : {rep?.kisoa_diagnostic || "—"}</p>
            <p>Score : {scores?.score_kisoa || 0} / 55</p>
            <p>
              CA : {eco?.ca_kisoa || 0} Ar — Dépenses :{" "}
              {eco?.depenses_kisoa || 0} Ar — Bénéfice :{" "}
              {eco?.benefice_kisoa || 0} Ar
            </p>

            <h3>Tantely</h3>
            <p>Fananantany : {rep?.tantely_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.tantely_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.tantely_ezaka || "—"}</p>
            <p>Tohana : {rep?.tantely_tohana || "—"}</p>
            <p>Diagnostic : {rep?.tantely_diagnostic || "—"}</p>
            <p>Score : {scores?.score_tantely || 0} / 55</p>
            <p>
              CA : {eco?.ca_tantely || 0} Ar — Dépenses :{" "}
              {eco?.depenses_tantely || 0} Ar — Bénéfice :{" "}
              {eco?.benefice_tantely || 0} Ar
            </p>

            <hr />

            <h2>5. Synthèse générale</h2>
            <p>Total CA 3 ans : {eco?.ca_total || 0} Ar</p>
            <p>Total dépenses 3 ans : {eco?.depenses_total || 0} Ar</p>
            <p>Total bénéfice 3 ans : {eco?.benefice_total || 0} Ar</p>

            <div style={styles.actions}>
              <button style={styles.button} onClick={() => window.print()}>
                Imprimer
              </button>

              <button style={styles.secondaryButton} onClick={() => window.print()}>
                Télécharger PDF
              </button>
            </div>
          </>
        )}

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>
      </section>
    </main>
  );
}
function FormulaireVierge({ onBack }: any) {
  const filieres = [
    "Voly rakotra 500m²",
    "Voly vary 750m²",
    "Akoho gasy",
    "Fanatavezana kisoa",
    "Tantely",
  ];

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Formulaire vierge complet — Tanora Mazava L1
        </h1>

        <p style={styles.text}>
          Ity formulaire ity dia hofenoina à la main eny ifotony,
          avy eo ampidirina tsirairay ao amin’ny application.
        </p>

        <h2>1. Famantarana ny Tanora</h2>

        <p>Anarana sy fanampiny : ________________________________________</p>

        <p>Taona : __________</p>

        <p>Faritra : ________________________________________</p>

        <p>Distrika : ________________________________________</p>

        <p>Kaomina : ________________________________________</p>

        <p>
          Karazana Kaomina :
          □ Ambanivohitra
          □ Andrenivohitra
        </p>

        <p>Fokontany : ________________________________________</p>

        <p>VTI misy azy : ________________________________________</p>

        <hr />

        <h2>2. Tombana ara-panahy — 52 points</h2>

        <p>1. Efa zatra nitokam-bavaka ve ? Score : ____ / 5</p>

        <p>
          2. Efa nanana fiainam-bavaka nitohy ve ?
          Score : ____ / 2
        </p>

        <p>
          3. Efa manao pratika ny Vavaka Betela ve ?
          Score : ____ / 5
        </p>

        <p>
          4. Fibebahana sy fiderana
          Score : ____ / 10
        </p>

        <p>
          Fanazavana :
          ________________________________________________________
        </p>

        <p>
          5. Fo madio sy Fanaka dimy
          Score : ____ / 10
        </p>

        <p>
          Fanazavana :
          ________________________________________________________
        </p>

        <p>
          6. Fandroahana devoly sy fandravana planina satanika
          Score : ____ / 10
        </p>

        <p>
          Fanazavana :
          ________________________________________________________
        </p>

        <p>
          7. Vavaka mamindra tendrombohitra
          Score : ____ / 10
        </p>

        <p>
          Fanazavana :
          ________________________________________________________
        </p>

        <h3>Total ara-panahy : ____ / 52</h3>

        <hr />

        <h2>3. Tombana VTI — 29 points</h2>

        <p>
          1. Efa tao anaty fikambanana ve ?
          Score : ____ / 2
        </p>

        <p>
          2. Efa tao anaty fikambanana tanora ve ?
          Score : ____ / 2
        </p>

        <p>
          3. Andraikitra teo anivon’ny vohitra/Fokontany
          Score : ____ / 5
        </p>

        <p>
          4. Fahalalana mikasika ny VTI misy azy
          Score : ____ / 5
        </p>

        <p>
          5. Ao anaty Vaomiera inona ?
          Score : ____ / 5
        </p>

        <p>
          6. Andraikitra ao anatin’ny Vaomiera
          Score : ____ / 5
        </p>

        <p>
          7. Ora isan-kerinandro atokana hiasa ao anaty Vaomiera
          Score : ____ / 5
        </p>

        <h3>Total VTI : ____ / 29</h3>

        <hr />

        <h2>4. Taniketsa Fandraharahana</h2>

        <p>Safidio izay Taniketsa kasaina hatao :</p>

        <p>
          □ Voly rakotra 500m²
          □ Voly vary 750m²
          □ Akoho gasy
          □ Kisoa
          □ Tantely
        </p>

        {filieres.map((f) => (
          <div key={f} style={styles.block}>
            <h3>{f}</h3>

            <p>Isan’ny unité kasaina atao :</p>

            <p>
              Taona 1 : ________
              | Taona 2 : ________
              | Taona 3 : ________
            </p>

            <h4>A. Fananantany — 5 points</h4>

            <p>
              An’iza ny tany/toerana ?
              Firy ny refiny ?
              Azo ampiasaina maharitra ve ?
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>Score : ____ / 5</p>

            <h4>B. Fiofanana — 15 points</h4>

            <p>
              Efa nahazo fiofanana ve ?
              Inona no hainao ampiharina ?
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>Score : ____ / 15</p>

            <h4>C. Ezaka sy anjara biriky — 20 points</h4>

            <p>
              Tany, fitaovana, vola, asa tanana,
              akora, fanomanana efa natao.
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>Score : ____ / 20</p>

            <h4>D. Tohana ilaina — 5 points</h4>

            <p>
              Inona no tohana tena ilaina
              izay tsy vitanao irery intsony ?
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>Score : ____ / 5</p>

            <h4>
              E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points
            </h4>

            <p>
              Efa nivarotra zavatra ve ianao tao anatin’ny
              3 taona farany ?
              Fantatrao ve ny dépenses sy tombom-barotra ?
              Inona ny fiofanana ilainao ?
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>
              ________________________________________________________________
            </p>

            <p>Score : ____ / 10</p>

            <h4>Synthèse économique 3 taona</h4>

            <p>CA 3 taona : __________________ Ar</p>

            <p>Dépenses 3 taona : __________________ Ar</p>

            <p>Bénéfice 3 taona : __________________ Ar</p>

            <h3>Total score {f} : ____ / 55</h3>

            <hr />
          </div>
        ))}

        <h2>5. Synthèse générale</h2>

        <p>Nombre de Taniketsa choisis : ____ / 5</p>

        <p>Total score Taniketsa : ____ / ____</p>

        <p>Score économie : ____</p>

        <p>Total CA 3 ans : __________________ Ar</p>

        <p>Total dépenses 3 ans : __________________ Ar</p>

        <p>Total bénéfice 3 ans : __________________ Ar</p>

        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={onBack}
          >
            Miverina
          </button>

          <button
            style={styles.button}
            onClick={() => window.print()}
          >
            Imprimer
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => window.print()}
          >
            Télécharger PDF
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
  main: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: 40,
    fontFamily: "Arial",
  },

  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "white",
    padding: 40,
    borderRadius: 20,
  },

  title: {
    color: "#047857",
    fontSize: 42,
    textAlign: "center",
  },

  titleSmall: {
    color: "#047857",
    fontSize: 32,
  },

  subtitle: {
    color: "#b91c1c",
    textAlign: "center",
  },

  text: {
    fontSize: 18,
    lineHeight: 1.7,
  },

  button: {
    background: "#047857",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: 12,
    marginTop: 20,
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "14px 20px",
    borderRadius: 12,
    marginTop: 20,
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },

  label: {
    display: "block",
    marginTop: 14,
    fontWeight: "bold",
  },

  checkboxLabel: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#064e3b",
  },

  score: {
    marginTop: 24,
    color: "#047857",
    fontSize: 24,
  },

  scoreBox: {
    background: "#ecfdf5",
    border: "1px solid #10b981",
    color: "#064e3b",
    padding: 18,
    borderRadius: 16,
    fontSize: 20,
    marginTop: 24,
  },

  miniBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },

  block: {
    marginTop: 28,
    padding: 22,
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    background: "#f8fafc",
  },

  sectionTitle: {
    color: "#064e3b",
    fontSize: 24,
    marginTop: 10,
  },
};
