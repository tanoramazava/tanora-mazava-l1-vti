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
  | "fiche"
  | "vti_iombonana"
  | "vti_imprimable"
  | "vti_fiche";

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

  if (screen === "vti_iombonana") {
    return <TombanaIombonanaVtiForm onBack={() => setScreen("home")} />;
  }

  if (screen === "vti_imprimable") {
    return <FormulaireViergeVti onBack={() => setScreen("home")} />;
  }

  if (screen === "vti_fiche") {
    return <FicheRemplieVti onBack={() => setScreen("home")} />;
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>

        <h2 style={styles.subtitle}>
          TOMBANA FANOMBOHANA VTI
        </h2>

        <button style={styles.button} onClick={() => setScreen("identite")}>
          Hanomboka ny Tombana ID Tanora
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("imprimable")}>
          Version imprimable vierge ID Tanora
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("fiche")}>
          Fiche remplie par ID Tanora
        </button>

        <hr />

        <h2 style={styles.subtitle}>
          TOMBANA IOMBONANA AO ANATY VTI
        </h2>

        <button style={styles.button} onClick={() => setScreen("vti_iombonana")}>
          Hanomboka Tombana iombonana VTI
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("vti_imprimable")}>
          Formulaire vierge VTI
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("vti_fiche")}>
          Fiche remplie VTI par ID VTI
        </button>
      </section>
    </main>
  );
}


function TombanaIombonanaVtiForm({ onBack }: any) {
  const [step, setStep] = useState<
    "identite" | "arapanahy" | "toekarena" | "fahasalamana" | "etika"
  >("identite");

  const [nomVti, setNomVti] = useState("");
  const [faritra, setFaritra] = useState("");
  const [distrika, setDistrika] = useState("");
  const [kaomina, setKaomina] = useState("");
  const [typeKaomina, setTypeKaomina] = useState("");
  const [fokontany, setFokontany] = useState("");
  const [isanMponina, setIsanMponina] = useState("");
  const [vtiId, setVtiId] = useState<number | null>(null);

  const enregistrerIdentiteVti = async () => {
    const { data, error } = await supabase
      .from("vti")
      .insert([{
        nom_vti: nomVti,
        faritra,
        distrika,
        kaomina,
        type_kaomina: typeKaomina,
        fokontany,
        isan_mponina: Number(isanMponina || 0),
      }])
      .select()
      .single();

    if (error) {
      alert("Erreur VTI : " + JSON.stringify(error));
      return;
    }

    setVtiId(data.id);
    alert("VTI voatahiry tsara !");
    setStep("arapanahy");
  };

  if (step === "arapanahy") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <VaomieraAraPanahyForm
            vtiId={vtiId}
            onBack={() => setStep("identite")}
            onNext={() => setStep("toekarena")}
          />
        </section>
      </main>
    );
  }

  if (step === "toekarena") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <VaomieraToekarenaForm
            vtiId={vtiId}
            onBack={() => setStep("arapanahy")}
            onNext={() => setStep("fahasalamana")}
          />
        </section>
      </main>
    );
  }

  if (step === "fahasalamana") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <VaomieraFahasalamanaForm
            vtiId={vtiId}
            onBack={() => setStep("toekarena")}
            onNext={() => setStep("etika")}
          />
        </section>
      </main>
    );
  }

  if (step === "etika") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <VaomieraEtikaForm
            vtiId={vtiId}
            onBack={() => setStep("fahasalamana")}
          />
        </section>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Tombana iombonana ao anaty VTI</h1>
        <h2 style={styles.sectionTitle}>A. Famantarana ny VTI</h2>

        <label style={styles.label}>VTI Anarany</label>
        <input style={styles.input} value={nomVti} onChange={(e) => setNomVti(e.target.value)} />

        <label style={styles.label}>Faritra</label>
        <input style={styles.input} value={faritra} onChange={(e) => setFaritra(e.target.value)} />

        <label style={styles.label}>Distrika</label>
        <input style={styles.input} value={distrika} onChange={(e) => setDistrika(e.target.value)} />

        <label style={styles.label}>Kaomina</label>
        <input style={styles.input} value={kaomina} onChange={(e) => setKaomina(e.target.value)} />

        <label style={styles.label}>Karazana Kaomina</label>
        <select style={styles.input} value={typeKaomina} onChange={(e) => setTypeKaomina(e.target.value)}>
          <option value="">Safidio</option>
          <option value="Ambanivohitra">Ambanivohitra</option>
          <option value="Andrenivohitra">Andrenivohitra</option>
        </select>

        <label style={styles.label}>Fokontany</label>
        <input style={styles.input} value={fokontany} onChange={(e) => setFokontany(e.target.value)} />

        <label style={styles.label}>Isan’ny Mponina</label>
        <input style={styles.input} type="number" value={isanMponina} onChange={(e) => setIsanMponina(e.target.value)} />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={enregistrerIdentiteVti}>
            Enregistrer Identité VTI sy hanohy
          </button>
        </div>
      </section>
    </main>
  );
}

function VaomieraAraPanahyForm({ vtiId, onBack, onNext }: any) {
  const [mivoryScore, setMivoryScore] = useState(0);
  const [oraScore, setOraScore] = useState(0);
  const [herinandroScore, setHerinandroScore] = useState(0);
  const [fanakaScore, setFanakaScore] = useState(0);
  const [fanambyScore, setFanambyScore] = useState(0);
  const [olanaScore, setOlanaScore] = useState(0);
  const [paikadyScore, setPaikadyScore] = useState(0);

  const [fanakaDimy, setFanakaDimy] = useState("");
  const [fanamby140, setFanamby140] = useState("");
  const [olanaFanabeazana, setOlanaFanabeazana] = useState("");
  const [paikady140, setPaikady140] = useState("");

  const totalScore =
    Number(mivoryScore || 0) +
    Number(oraScore || 0) +
    Number(herinandroScore || 0) +
    Number(fanakaScore || 0) +
    Number(fanambyScore || 0) +
    Number(olanaScore || 0) +
    Number(paikadyScore || 0);

  const refStyle = {
    fontSize: "12px",
    fontStyle: "italic" as const,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: 10,
  };

  const mivoryOptions: [string, number][] = [
    ["In-2 isan-kerinandro — 10 points", 10],
    ["In-1 isan-kerinandro — 5 points", 5],
    ["Tsy misy — 0 point", 0],
  ];

  const oraOptions: [string, number][] = [
    ["Mihoatra ny adiny 4 — 10 points", 10],
    ["Adiny 2-3 — 5 points", 5],
    ["Latsaky ny adiny 2 — 2 points", 2],
    ["Tsy voafaritra — 0 point", 0],
  ];

  const standard10: [string, number][] = [
    ["Valiny mazava sy feno — 10 points", 10],
    ["Valiny antonony — 5 points", 5],
    ["Valiny manjavozavo — 2 points", 2],
    ["Tsy misy valiny — 0 point", 0],
  ];

  const enregistrerVaomiera = async () => {
    const { error } = await supabase
      .from("vti_vaomiera_arapanahy_fanabeazana")
      .insert([
        {
          vti_id: Number(vtiId),
          mivory_score: Number(mivoryScore || 0),
          ora_score: Number(oraScore || 0),
          herinandro_score: Number(herinandroScore || 0),
          fanaka_score: Number(fanakaScore || 0),
          fanaka_dimy: fanakaDimy || "",
          fanamby_140_andro: fanamby140 || "",
          fanamby_score: Number(fanambyScore || 0),
          olana_fanabeazana: olanaFanabeazana || "",
          olana_score: Number(olanaScore || 0),
          paikady_140_andro: paikady140 || "",
          paikady_score: Number(paikadyScore || 0),
          total_score: Number(totalScore || 0),
        },
      ]);

    if (error) {
      alert("Erreur Vaomiera Ara-panahy : " + JSON.stringify(error));
      return;
    }

    alert("Vaomiera Ara-panahy sy fanabeazana voatahiry tsara !");
    onNext();
  };

  return (
    <section style={styles.block}>
      <h2 style={styles.sectionTitle}>
        A. Vaomiera “Ara-panahy sy fanabeazana”
      </h2>

      <h3>ARA-PANAHY</h3>

      <h4>1. Efa miodina tsara ve ny Vaomiera misy anareo ?</h4>

      <OptionSelect
        label="11. Mivory na manao asa iombonana impiry isan-kerinandro ?"
        options={mivoryOptions}
        onChange={(v: number) => setMivoryScore(v)}
      />

      <OptionSelect
        label="12. Adiny firy isan-kerinandro no atokan’ny mpikambana hiasa ao anaty Vaomiera ?"
        options={oraOptions}
        onChange={(v: number) => setOraScore(v)}
      />

      <p style={refStyle}>
        Référence : 1-Fahamasinana : fialana amin’ny ota mamatotra sy ny fahazaran-dratsy rehetra.
        2-Fanetre-tena.
        3-Fandeferana : fifehezantena, fitoniana, tsy manetsika ady.
        4-Fahaizana mamela heloka : tsy fitehirizana lolompo, tsy famaliana faty.
        5-Fiantrana ny madiniky ny Tompo : asa soa, fanampiana ny madinika, tsy voatery ho fizarana vola aman-karena.
      </p>

      <OptionSelect
        label="2. Efa natombokareo ve ny Herinandro 05 ho an’ny Mpianatry ny Tompo ?"
        options={standard10}
        onChange={(v: number) => setHerinandroScore(v)}
      />

      <h4>3. Fanaka masina dimy / soatoavina dimy sarotra ampiharina</h4>

      <p style={refStyle}>
        Référence : kilasio 1 hatramin’ny 5 izay tena sarotra ampiharina eo anivon’ny fiaraha-monina :
        1-Fahamasinana.
        2-Fanetre-tena.
        3-Fandeferana.
        4-Fahaizana mamela heloka.
        5-Fiantrana ny madiniky ny Tompo.
      </p>

      <textarea
        style={styles.textarea}
        value={fanakaDimy}
        onChange={(e) => setFanakaDimy(e.target.value)}
      />

      <OptionSelect
        label="Score fanadihadiana fanaka dimy"
        options={standard10}
        onChange={(v: number) => setFanakaScore(v)}
      />

      <h4>4. Fanamby lehibe ho tratrarina ao anatin’ny 140 andro</h4>

      <p style={refStyle}>
        Référence : soraty ny fanamby 1 hatramin’ny 5 tian’ny VTI hotratrarina amin’ny Herinandro 05 ny Mpianatry ny Tompo mandritra ny 140 andro.
        Raha mazava sy azo tanterahina tsara = 10 points.
        Raha antonony = 5 points.
        Raha manjavozavo = 2 points.
        Raha tsy misy valiny = 0 point.
      </p>

      <textarea
        style={styles.textarea}
        value={fanamby140}
        onChange={(e) => setFanamby140(e.target.value)}
      />

      <OptionSelect
        label="Score fanamby 140 andro"
        options={standard10}
        onChange={(v: number) => setFanambyScore(v)}
      />

      <h3>FANABEAZANA</h3>

      <h4>5. Olana ara-panabeazana</h4>

      <p style={refStyle}>
        Référence : sokajio araka ny laharam-pahamehana :
        1-Fahabadoana : tsy fahaizana mamaky teny, manoratra ary manisa; mahakasika tanora, ray aman-dreny ary zokiolona.
        2-Fahantrana ara-panabeazana / pauvreté d’apprentissage : mahakasika ny ankizy latsaky ny 10 taona, mianatra an-tsekoly nefa zara raha mahay mamaky teny sy manisa, tsy mahazo lahatsoratra tsotra.
        3-Fitsoahana na fialana an-tsekoly : mahakasika tanora niala an-tsekoly aloha, zara raha nianatra, zara raha mahay mamaky teny sy manoratra.
      </p>

      <textarea
        style={styles.textarea}
        value={olanaFanabeazana}
        onChange={(e) => setOlanaFanabeazana(e.target.value)}
      />

      <OptionSelect
        label="Score olana ara-panabeazana"
        options={standard10}
        onChange={(v: number) => setOlanaScore(v)}
      />

      <h4>6. Paikady iombonana ara-panabeazana ao anatin’ny 140 andro</h4>

      <p style={refStyle}>
        Référence :
        1-Paikady iombonana ho fampianarana mamaky teny sy manoratra, ady amin’ny habadoana.
        2-Paikady iombonana ho tohana pedagojika ho an’ny tanora nitsoaka an-daharana na niala an-tsekoly.
        3-Paikady iombonana ho fametrahana “Sekoly Tsara Kalitao” miaraka amin’ny Kaomina, ZAP, ray aman-dreny, Fokonolona ary Vaomiera/VTI.
      </p>

      <textarea
        style={styles.textarea}
        value={paikady140}
        onChange={(e) => setPaikady140(e.target.value)}
      />

      <OptionSelect
        label="Score paikady sy fanapahan-kevitra"
        options={standard10}
        onChange={(v: number) => setPaikadyScore(v)}
      />

      <h2 style={styles.score}>
        Total Vaomiera Ara-panahy sy fanabeazana : {totalScore} / 70
      </h2>

      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Miverina
        </button>

        <button style={styles.button} onClick={enregistrerVaomiera}>
          Enregistrer sy hanohy Vaomiera Fandraharahana
        </button>
      </div>
    </section>
  );
}

function VaomieraToekarenaForm({ vtiId, onBack, onNext }: any) {
  const [mivoryScore, setMivoryScore] = useState(0);
  const [oraScore, setOraScore] = useState(0);
  const [olanaScore, setOlanaScore] = useState(0);
  const [paikadyScore, setPaikadyScore] = useState(0);

  const [olanaToekarena, setOlanaToekarena] = useState("");
  const [paikadyToekarena, setPaikadyToekarena] = useState("");

  const totalScore =
    Number(mivoryScore || 0) +
    Number(oraScore || 0) +
    Number(olanaScore || 0) +
    Number(paikadyScore || 0);

  const refStyle = {
    fontSize: "12px",
    fontStyle: "italic" as const,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: 10,
  };

  const mivoryOptions: [string, number][] = [
    ["In-2 isan-kerinandro — 10 points", 10],
    ["In-1 isan-kerinandro — 5 points", 5],
    ["Tsy misy — 0 point", 0],
  ];

  const oraOptions: [string, number][] = [
    ["Mihoatra ny adiny 4 — 10 points", 10],
    ["Adiny 2-3 — 5 points", 5],
    ["Latsaky ny adiny 2 — 2 points", 2],
    ["Tsy voafaritra — 0 point", 0],
  ];

  const standard10: [string, number][] = [
    ["Valiny mazava sy feno — 10 points", 10],
    ["Valiny antonony — 5 points", 5],
    ["Valiny manjavozavo — 2 points", 2],
    ["Tsy misy valiny — 0 point", 0],
  ];

  const enregistrerVaomiera = async () => {
    const { error } = await supabase
      .from("vti_vaomiera_fandraharahana_toekarena")
      .insert([
        {
          vti_id: Number(vtiId),
          mivory_score: Number(mivoryScore || 0),
          ora_score: Number(oraScore || 0),
          olana_toekarena: olanaToekarena || "",
          olana_score: Number(olanaScore || 0),
          paikady_toekarena: paikadyToekarena || "",
          paikady_score: Number(paikadyScore || 0),
          total_score: Number(totalScore || 0),
        },
      ]);

    if (error) {
      alert("Erreur Vaomiera Fandraharahana sy Toekarena : " + JSON.stringify(error));
      return;
    }

    alert("Vaomiera Fandraharahana sy Toekarena voatahiry tsara !");
    onNext();
  };

  return (
    <section style={styles.block}>
      <h2 style={styles.sectionTitle}>
        B. Vaomiera “Fandraharahana sy Fizakantena ara-toekarena”
      </h2>

      <h4>1. Efa miodina tsara ve ny Vaomiera misy anareo ?</h4>

      <OptionSelect
        label="11. Mivory na manao asa iombonana impiry isan-kerinandro ?"
        options={mivoryOptions}
        onChange={(v: number) => setMivoryScore(v)}
      />

      <OptionSelect
        label="12. Adiny firy isan-kerinandro no atokan’ny mpikambana hiasa ao anaty Vaomiera ?"
        options={oraOptions}
        onChange={(v: number) => setOraScore(v)}
      />

      <h4>2. Olana ara-toekarena mianjady amin’ny tanora</h4>

      <p style={refStyle}>
        Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
        1-Tsy fananana kolontsain’ny fandraharahana sy tsy fisian’ny torohay.
        2-Famokarana tsy mitodika amin’ny varotra.
        3-Olana fananantany.
        4-Tsy fahampian’ny fiofanana sy fanaraha-maso teknika.
        5-Tsy fahampian’ny tosika ara-pitaovana sy akora.
        6-Tsy fahampian’ny fotodrafitrasa iombonana.
        7-Tsy fisian’ny lalambarotra.
        8-Tsy fisian’ny fiarovana ny mpamokatra.
        9-Fihenan’ny fahefa-mividy sy fiankinan-doha amin’ny PPN.
        10-Olana hafa.
      </p>

      <textarea
        style={styles.textarea}
        value={olanaToekarena}
        onChange={(e) => setOlanaToekarena(e.target.value)}
      />

      <OptionSelect
        label="Score olana ara-toekarena"
        options={standard10}
        onChange={(v: number) => setOlanaScore(v)}
      />

      <h4>3. Paikady ara-toekarena ao anatin’ny 140 andro</h4>

      <p style={refStyle}>
        Référence :
        1-Fametrahana Saha Sekoly.
        2-Paikady fananantany miaraka amin’ny servisy fananantany sy Kaomina.
        3-Fanohanana ny Taniketsa Fandraharahana.
        4-Lalambarotra sy famatsiana ara-tsakafo/PPN maharitra.
        5-Fotodrafitrasa maika voalohany.
        6-Fotodrafitrasa maika faharoa.
        7-Paikady iombonana hafa.
        8-Paikady iombonana hafa.
      </p>

      <textarea
        style={styles.textarea}
        value={paikadyToekarena}
        onChange={(e) => setPaikadyToekarena(e.target.value)}
      />

      <OptionSelect
        label="Score paikady ara-toekarena sy fanapahan-kevitra"
        options={standard10}
        onChange={(v: number) => setPaikadyScore(v)}
      />

      <h2 style={styles.score}>
        Total Vaomiera Fandraharahana sy Toekarena : {totalScore} / 40
      </h2>

      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Miverina
        </button>

        <button style={styles.button} onClick={enregistrerVaomiera}>
          Enregistrer sy hanohy
        </button>
      </div>
    </section>
  );
}

function VaomieraFahasalamanaForm({ vtiId, onBack, onNext }: any) {
  const [mivoryScore, setMivoryScore] = useState(0);
  const [oraScore, setOraScore] = useState(0);
  const [olanaFahasalamanaScore, setOlanaFahasalamanaScore] = useState(0);
  const [voinaScore, setVoinaScore] = useState(0);
  const [paikadyScore, setPaikadyScore] = useState(0);

  const [olanaFahasalamana, setOlanaFahasalamana] = useState("");
  const [voinaTanora, setVoinaTanora] = useState("");
  const [paikadyFahasalamana, setPaikadyFahasalamana] = useState("");
  const [paikadyFiarovana, setPaikadyFiarovana] = useState("");

  const totalScore =
    Number(mivoryScore || 0) +
    Number(oraScore || 0) +
    Number(olanaFahasalamanaScore || 0) +
    Number(voinaScore || 0) +
    Number(paikadyScore || 0);

  const refStyle = {
    fontSize: "12px",
    fontStyle: "italic" as const,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: 10,
  };

  const mivoryOptions: [string, number][] = [
    ["In-2 isan-kerinandro — 10 points", 10],
    ["In-1 isan-kerinandro — 5 points", 5],
    ["Tsy misy — 0 point", 0],
  ];

  const oraOptions: [string, number][] = [
    ["Mihoatra ny adiny 4 — 10 points", 10],
    ["Adiny 2-3 — 5 points", 5],
    ["Latsaky ny adiny 2 — 2 points", 2],
    ["Tsy voafaritra — 0 point", 0],
  ];

  const standard10: [string, number][] = [
    ["Valiny mazava sy feno — 10 points", 10],
    ["Valiny antonony — 5 points", 5],
    ["Valiny manjavozavo — 2 points", 2],
    ["Tsy misy valiny — 0 point", 0],
  ];

  const enregistrerVaomiera = async () => {
    const paikadyMitambatra = `
VAHAOLANA 140 ANDRO — FAHASALAMANA:
${paikadyFahasalamana || ""}

VAHAOLANA 140 ANDRO — FIAROVANA AMIN’NY VOINA MANIMBA NY TANORA:
${paikadyFiarovana || ""}
`;

    const { error } = await supabase
      .from("vti_vaomiera_fahasalamana_fiarovana")
      .insert([
        {
          vti_id: Number(vtiId),
          mivory_score: Number(mivoryScore || 0),
          ora_score: Number(oraScore || 0),
          olana_fahasalamana: olanaFahasalamana || "",
          olana_fahasalamana_score: Number(olanaFahasalamanaScore || 0),
          voina_tanora: voinaTanora || "",
          voina_score: Number(voinaScore || 0),
          paikady_fahasalamana: paikadyMitambatra,
          paikady_score: Number(paikadyScore || 0),
          total_score: Number(totalScore || 0),
        },
      ]);

    if (error) {
      alert("Erreur Vaomiera Fahasalamana : " + JSON.stringify(error));
      return;
    }

    alert("Vaomiera Fahasalamana sy fiarovana ny tanora voatahiry tsara !");
    onNext();
  };

  return (
    <section style={styles.block}>
      <h2 style={styles.sectionTitle}>
        D. Vaomiera “Fahasalamana sy Fiarovana ny tanora”
      </h2>

      <h4>1. Efa miodina tsara ve ny Vaomiera misy anareo ?</h4>

      <OptionSelect
        label="11. Mivory na manao asa iombonana impiry isan-kerinandro ?"
        options={mivoryOptions}
        onChange={(v: number) => setMivoryScore(v)}
      />

      <OptionSelect
        label="12. Adiny firy isan-kerinandro no atokan’ny mpikambana hiasa ao anaty Vaomiera ?"
        options={oraOptions}
        onChange={(v: number) => setOraScore(v)}
      />

      <h4>2. Olana ara-pahasalamana</h4>

      <p style={refStyle}>
        Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
        1-Tazo moka.
        2-Aretim-pivalanana.
        3-Aretina azo amin’ny firaisana ara-nofo, anisan’izany VIH-SIDA.
        4-Areti-mifindra hafa.
        5-Areti-mandoza mandripaka : tosidra, diabeta, homamiadana.
        6-Aretina hafa 1.
        7-Aretina hafa 2.
      </p>

      <textarea
        style={styles.textarea}
        value={olanaFahasalamana}
        onChange={(e) => setOlanaFahasalamana(e.target.value)}
      />

      <OptionSelect
        label="Score olana ara-pahasalamana"
        options={standard10}
        onChange={(v: number) => setOlanaFahasalamanaScore(v)}
      />

      <h4>3. Voina manimba taranaka</h4>

      <p style={refStyle}>
        Référence : saraho amin’ny olana ara-pahasalamana ny fiarovana ny tanora amin’ny voina manimba ny hoaviny :
        1-Vohoka aloha loatra.
        2-Mariazin’ny ankizy.
        3-Fidorohana zava-mahadomelina.
        4-Herisetra.
        5-Fitondran-tena mampidi-doza.
        6-Fahaverezan’ny fanantenana.
        7-Olana hafa manimba ny hoavin’ny tanora.
      </p>

      <textarea
        style={styles.textarea}
        value={voinaTanora}
        onChange={(e) => setVoinaTanora(e.target.value)}
      />

      <OptionSelect
        label="Score voina manimba taranaka"
        options={standard10}
        onChange={(v: number) => setVoinaScore(v)}
      />

      <h4>4A. Vahaolana 140 andro — Fahasalamana</h4>

      <p style={refStyle}>
        Référence :
        1-Ady amin’ny tazo moka.
        2-Ady amin’ny aretim-pivalanana.
        3-Vaksiny.
        4-Fanjarian-tsakafo.
        5-Fampiroboroboana fanatanjahantena sy fialamboly ho an’ny fahasalamana ara-batana sy ara-tsaina.
      </p>

      <textarea
        style={styles.textarea}
        value={paikadyFahasalamana}
        onChange={(e) => setPaikadyFahasalamana(e.target.value)}
      />

      <h4>4B. Vahaolana 140 andro — Fiarovana amin’ny voina manimba ny tanora</h4>

      <p style={refStyle}>
        Référence :
        1-Fisorohana vohoka aloha loatra.
        2-Fisorohana mariazin’ny ankizy.
        3-Fisorohana fidorohana zava-mahadomelina.
        4-Fisorohana herisetra.
        5-Paikady iombonana hafa.
        6-Paikady iombonana hafa.
      </p>

      <textarea
        style={styles.textarea}
        value={paikadyFiarovana}
        onChange={(e) => setPaikadyFiarovana(e.target.value)}
      />

      <OptionSelect
        label="Score paikady ankapobeny ara-pahasalamana sy fiarovana"
        options={standard10}
        onChange={(v: number) => setPaikadyScore(v)}
      />

      <h2 style={styles.score}>
        Total Vaomiera Fahasalamana sy Fiarovana : {totalScore} / 50
      </h2>

      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Miverina
        </button>

        <button style={styles.button} onClick={enregistrerVaomiera}>
          Enregistrer sy hanohy
        </button>
      </div>
    </section>
  );
}

function VaomieraEtikaForm({ vtiId, onBack }: any) {
  const [mivoryScore, setMivoryScore] = useState(0);
  const [oraScore, setOraScore] = useState(0);
  const [fandriampahalemanaScore, setFandriampahalemanaScore] = useState(0);
  const [tontoloIainanaScore, setTontoloIainanaScore] = useState(0);
  const [paikadyScore, setPaikadyScore] = useState(0);

  const [olanaFandriampahalemana, setOlanaFandriampahalemana] = useState("");
  const [olanaTontoloIainana, setOlanaTontoloIainana] = useState("");
  const [paikadyFandriampahalemana, setPaikadyFandriampahalemana] = useState("");
  const [paikadyTontoloIainana, setPaikadyTontoloIainana] = useState("");

  const scoreOlanaMitambatra =
    Number(fandriampahalemanaScore || 0) +
    Number(tontoloIainanaScore || 0);

  const totalScore =
    Number(mivoryScore || 0) +
    Number(oraScore || 0) +
    Number(scoreOlanaMitambatra || 0) +
    Number(paikadyScore || 0);

  const refStyle = {
    fontSize: "12px",
    fontStyle: "italic" as const,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: 10,
  };

  const mivoryOptions: [string, number][] = [
    ["In-2 isan-kerinandro — 10 points", 10],
    ["In-1 isan-kerinandro — 5 points", 5],
    ["Tsy misy — 0 point", 0],
  ];

  const oraOptions: [string, number][] = [
    ["Mihoatra ny adiny 4 — 10 points", 10],
    ["Adiny 2-3 — 5 points", 5],
    ["Latsaky ny adiny 2 — 2 points", 2],
    ["Tsy voafaritra — 0 point", 0],
  ];

  const standard10: [string, number][] = [
    ["Valiny mazava sy feno — 10 points", 10],
    ["Valiny antonony — 5 points", 5],
    ["Valiny manjavozavo — 2 points", 2],
    ["Tsy misy valiny — 0 point", 0],
  ];

  const enregistrerVaomiera = async () => {
    const olanaEtikaMitambatra = `
OLANA VOASOKAJY 1 — Fandriampahalemana sy kolikoly:
${olanaFandriampahalemana || ""}

OLANA VOASOKAJY 2 — Tontolo iainana:
${olanaTontoloIainana || ""}
`;

    const paikadyEtikaMitambatra = `
VAHAOLANA 140 ANDRO — FANDRIAMPAHALEMANA SY ADY AMIN’NY KOLIKOLY:
${paikadyFandriampahalemana || ""}

VAHAOLANA 140 ANDRO — TONTOLO IAINANA:
${paikadyTontoloIainana || ""}
`;

    const { error } = await supabase
      .from("vti_vaomiera_etika_fampandrosoana")
      .insert([
        {
          vti_id: Number(vtiId),
          mivory_score: Number(mivoryScore || 0),
          ora_score: Number(oraScore || 0),
          olana_fandriampahalemana: olanaFandriampahalemana || "",
          olana_fandriampahalemana_score: Number(fandriampahalemanaScore || 0),
          olana_tontolo_iainana: olanaTontoloIainana || "",
          olana_tontolo_iainana_score: Number(tontoloIainanaScore || 0),
          olana_etika: olanaEtikaMitambatra,
          olana_score: Number(scoreOlanaMitambatra || 0),
          paikady_etika: paikadyEtikaMitambatra,
          paikady_score: Number(paikadyScore || 0),
          total_score: Number(totalScore || 0),
        },
      ]);

    if (error) {
      alert("Erreur Vaomiera Etika : " + JSON.stringify(error));
      return;
    }

    alert("Vaomiera Etika Fampandrosoana maharitra voatahiry tsara !");
  };

  return (
    <section style={styles.block}>
      <h2 style={styles.sectionTitle}>
        E. Vaomiera “Etikan’ny fampandrosoana maharitra”
      </h2>

      <h4>1. Efa miodina tsara ve ny Vaomiera misy anareo ?</h4>

      <OptionSelect
        label="11. Mivory na manao asa iombonana impiry isan-kerinandro ?"
        options={mivoryOptions}
        onChange={(v: number) => setMivoryScore(v)}
      />

      <OptionSelect
        label="12. Adiny firy isan-kerinandro no atokan’ny mpikambana hiasa ao anaty Vaomiera ?"
        options={oraOptions}
        onChange={(v: number) => setOraScore(v)}
      />

      <h4>2. Olana mikasika ny fandriampahalemana sy kolikoly</h4>

      <p style={refStyle}>
        Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
        1-Halatra be vava miaraka amin’ny vono olona.
        2-Halabotry.
        3-Disadisa ara-piarahamonina.
        4-Ady lahy sy fizarazarana ara-politika.
        5-Kolikoly sy fahalovana miantraika amin’ny fiainam-piaraha-monina.
      </p>

      <textarea
        style={styles.textarea}
        value={olanaFandriampahalemana}
        onChange={(e) => setOlanaFandriampahalemana(e.target.value)}
      />

      <OptionSelect
        label="Score olana fandriampahalemana sy kolikoly"
        options={standard10}
        onChange={(v: number) => setFandriampahalemanaScore(v)}
      />

      <h4>3. Olana mikasika ny tontolo iainana</h4>

      <p style={refStyle}>
        Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
        1-Doro tanety.
        2-Fandripahana ny ala.
        3-Fandripahana na fandrobana ny harena voajanahary sy loharanon-karena iombonana.
        4-Faharitry ny loharano sy haintany.
        5-Fiankinandoha amin’ny saribao sy kitay.
        6-Loza voajanahary : rivo-doza, tondradrano.
        7-Olana hafa.
      </p>

      <textarea
        style={styles.textarea}
        value={olanaTontoloIainana}
        onChange={(e) => setOlanaTontoloIainana(e.target.value)}
      />

      <OptionSelect
        label="Score olana tontolo iainana"
        options={standard10}
        onChange={(v: number) => setTontoloIainanaScore(v)}
      />

      <h4>4A. Vahaolana 140 andro — Fandriampahalemana sy ady amin’ny kolikoly</h4>

      <p style={refStyle}>
        Référence :
        1-Fanamafisana fihavanana.
        2-Fametrahana fandriampahalemana maharitra.
        3-Fisorohana sy ady amin’ny fahalovana.
        4-Fanabeazana olom-pirenena.
        5-Dina sy fitsipika iombonana.
      </p>

      <textarea
        style={styles.textarea}
        value={paikadyFandriampahalemana}
        onChange={(e) => setPaikadyFandriampahalemana(e.target.value)}
      />

      <h4>4B. Vahaolana 140 andro — Tontolo iainana</h4>

      <p style={refStyle}>
        Référence :
        1-Fambolena hazo/ala.
        2-Fefy velona manodidina ny Taniketsa Voly rakotra 500m².
        3-Ady amin’ny doro tanety sy fandripahana ala.
        4-Angovo maintso.
        5-Famokarana biolojika miaro ny natiora.
        6-Fanodinana fako.
        7-Paikady hafa.
      </p>

      <textarea
        style={styles.textarea}
        value={paikadyTontoloIainana}
        onChange={(e) => setPaikadyTontoloIainana(e.target.value)}
      />

      <OptionSelect
        label="Score paikady etika sy fampandrosoana maharitra"
        options={standard10}
        onChange={(v: number) => setPaikadyScore(v)}
      />

      <h2 style={styles.score}>
        Total Vaomiera Etika Fampandrosoana maharitra : {totalScore} / 50
      </h2>

      <div style={styles.actions}>
        <button style={styles.secondaryButton} onClick={onBack}>
          Miverina
        </button>

        <button style={styles.button} onClick={enregistrerVaomiera}>
          Enregistrer Vaomiera Etika
        </button>
      </div>
    </section>
  );
}
function FormulaireViergeVti({ onBack }: any) {
  const refStyle = {
    fontSize: "12px",
    fontStyle: "italic" as const,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: 10,
  };

  const answerBox = {
    border: "1px solid #999",
    minHeight: "120px",
    padding: "10px",
    marginTop: "8px",
    marginBottom: "15px",
    borderRadius: "6px",
  };

  const largeAnswerBox = {
    border: "1px solid #999",
    minHeight: "220px",
    padding: "10px",
    marginTop: "8px",
    marginBottom: "15px",
    borderRadius: "6px",
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Formulaire vierge — Tombana iombonana ao anaty VTI
        </h1>

        <p style={styles.text}>
          Ity formulaire ity dia azo imprimer-na sy fenoina à la main.
          Ny valiny sy ny scores ihany no hofenoina isaky ny Vaomiera.
        </p>

        <h2>1. Famantarana ny VTI</h2>

        <p>VTI Anarany :</p>
        <div style={answerBox}></div>

        <p>Faritra :</p>
        <div style={answerBox}></div>

        <p>Distrika :</p>
        <div style={answerBox}></div>

        <p>Kaomina :</p>
        <div style={answerBox}></div>

        <p>Karazana Kaomina : □ Ambanivohitra □ Andrenivohitra</p>

        <p>Fokontany :</p>
        <div style={answerBox}></div>

        <p>Isan’ny Mponina :</p>
        <div style={answerBox}></div>

        <hr />

        <h2>A. Vaomiera “Ara-panahy sy fanabeazana”</h2>

        <h3>ARA-PANAHY</h3>

        <h4>1. Efa miodina tsara ve ny Vaomiera misy anareo ?</h4>

        <p>
          11. Mivory na manao asa iombonana impiry isan-kerinandro ?
          □ in-2 = 10 points □ in-1 = 5 points □ tsy misy = 0 point
        </p>
        <p>Score 11 : ______ / 10</p>

        <p>
          12. Adiny firy isan-kerinandro ny mpikambana no manoka-tena hiasa
          ao anaty Vaomiera ?
          □ mihoatra ny adiny 4 = 20 points
          □ adiny 2-3 = 10 points
          □ latsaky ny adiny 2 = 5 points
          □ tsy voafaritra = 0 point
        </p>
        <p>Score 12 : ______ / 20</p>
        <p><strong>Total 11 + 12 : ______ / 30</strong></p>

        <h4>2. Herinandro 05 ho an’ny Mpianatry ny Tompo</h4>
        <p style={refStyle}>
          Référence :
          1-Fahamasinana : fialana amin’ny ota mamatotra sy ny fahazaran-dratsy rehetra.
          2-Fanetre-tena.
          3-Fandeferana : fifehezantena, fitoniana, tsy manetsika ady.
          4-Fahaizana mamela heloka : tsy fitehirizana lolompo, tsy famaliana faty.
          5-Fiantrana ny madiniky ny Tompo : asa soa, fanampiana ny madinika, tsy voatery ho fizarana vola aman-karena.
        </p>
        <p>
          Efa natombokareo ve ?
          □ Eny = 10 points
          □ Eo am-panomanana / hanomboka tsy ho ela = 5 points
          □ Mbola tsy voaeritreritra = 0 point
        </p>
        <p>Score : ______ / 10</p>

        <h4>3. Fanaka masina dimy / soatoavina dimy sarotra ampiharina</h4>
        <p style={refStyle}>
          Référence : kilasio 1 hatramin’ny 5 izay tena sarotra ampiharina eo anivon’ny fiaraha-monina :
          1-Fahamasinana.
          2-Fanetre-tena.
          3-Fandeferana.
          4-Fahaizana mamela heloka.
          5-Fiantrana ny madiniky ny Tompo.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>

        <h4>4. Fanamby lehibe ho tratrarina ao anatin’ny 140 andro</h4>
        <p style={refStyle}>
          Référence : soraty ny fanamby 1 hatramin’ny 5 tian’ny VTI hotratrarina amin’ny Herinandro 05 ny Mpianatry ny Tompo mandritra ny 140 andro.
          Raha mazava sy azo tanterahina tsara = 20 points.
          Raha manjavozavo fa azo tanterahina = 10 points.
          Raha tsy mazava na tsy azo tanterahina = 2 points.
        </p>

        <p><strong>Fanamby lehibe 1 :</strong></p>
        <div style={answerBox}></div>

        <p><strong>Fanamby lehibe 2 :</strong></p>
        <div style={answerBox}></div>

        <p><strong>Fanamby lehibe 3 :</strong></p>
        <div style={answerBox}></div>

        <p><strong>Fanamby lehibe 4 :</strong></p>
        <div style={answerBox}></div>

        <p><strong>Fanamby lehibe 5 :</strong></p>
        <div style={answerBox}></div>

        <p>Score fanamby : ______ / 20</p>

        <h3>FANABEAZANA</h3>

        <h4>5. Olana ara-panabeazana</h4>
        <p style={refStyle}>
          Référence : sokajio araka ny laharam-pahamehana :
          1-Fahabadoana : tsy fahaizana mamaky teny, manoratra ary manisa; mahakasika tanora, ray aman-dreny ary zokiolona.
          2-Fahantrana ara-panabeazana / pauvreté d’apprentissage : mahakasika ny ankizy latsaky ny 10 taona, mianatra an-tsekoly nefa zara raha mahay mamaky teny sy manisa, tsy mahazo lahatsoratra tsotra.
          3-Fitsoahana na fialana an-tsekoly : mahakasika tanora niala an-tsekoly aloha, zara raha nianatra, zara raha mahay mamaky teny sy manoratra.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 5</p>

        <h4>6. Paikady iombonana ara-panabeazana ao anatin’ny 140 andro</h4>
        <p style={refStyle}>
          Référence :
          1-Paikady iombonana ho fampianarana mamaky teny sy manoratra, ady amin’ny habadoana.
          2-Paikady iombonana ho tohana pedagojika ho an’ny tanora nitsoaka an-daharana na niala an-tsekoly.
          3-Paikady iombonana ho fametrahana “Sekoly Tsara Kalitao” miaraka amin’ny Kaomina, ZAP, ray aman-dreny, Fokonolona ary Vaomiera/VTI.
        </p>
        <p><strong>Paikady sy fanapahan-kevitry ny Vaomiera/VTI :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 20</p>

        <h3>Total Vaomiera Ara-panahy sy fanabeazana : ______ / 85</h3>

        <hr />

        <h2>B. Vaomiera “Fandraharahana sy Fizakantena ara-toekarena”</h2>

        <h4>1. Efa miodina tsara ve ny Vaomiera ?</h4>
        <p>11. Fivoriana : □ in-2 = 10 □ in-1 = 5 □ tsy misy = 0</p>
        <p>Score 11 : ______ / 10</p>
        <p>12. Ora iasana : □ mihoatra ny adiny 4 = 20 □ adiny 2-3 = 10 □ latsaky ny adiny 2 = 5 □ tsy voafaritra = 0</p>
        <p>Score 12 : ______ / 20</p>
        <p><strong>Total 11 + 12 : ______ / 30</strong></p>

        <h4>2. Olana ara-toekarena mianjady amin’ny tanora</h4>
        <p style={refStyle}>
          Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
          1-Tsy fananana kolontsain’ny fandraharahana sy tsy fisian’ny torohay.
          2-Famokarana tsy mitodika amin’ny varotra.
          3-Olana fananantany.
          4-Tsy fahampian’ny fiofanana sy fanaraha-maso teknika.
          5-Tsy fahampian’ny tosika ara-pitaovana sy akora.
          6-Tsy fahampian’ny fotodrafitrasa iombonana.
          7-Tsy fisian’ny lalambarotra.
          8-Tsy fisian’ny fiarovana ny mpamokatra.
          9-Fihenan’ny fahefa-mividy sy fiankinan-doha amin’ny PPN.
          10-Olana hafa.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 10</p>

        <h4>3. Paikady ara-toekarena ao anatin’ny 140 andro</h4>
        <p style={refStyle}>
          Référence :
          1-Fametrahana Saha Sekoly.
          2-Paikady fananantany miaraka amin’ny servisy fananantany sy Kaomina.
          3-Fanohanana ny Taniketsa Fandraharahana.
          4-Lalambarotra sy famatsiana ara-tsakafo/PPN maharitra.
          5-Fotodrafitrasa maika voalohany.
          6-Fotodrafitrasa maika faharoa.
          7-Paikady iombonana hafa.
          8-Paikady iombonana hafa.
        </p>
        <p><strong>Paikady sy fanapahan-kevitra :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 20</p>

        <h3>Total Vaomiera Fandraharahana sy Toekarena : ______ / 60</h3>

        <hr />

        <h2>D. Vaomiera “Fahasalamana sy Fiarovana ny tanora”</h2>

        <h4>1. Efa miodina tsara ve ny Vaomiera ?</h4>
        <p>11. Fivoriana : □ in-2 = 10 □ in-1 = 5 □ tsy misy = 0</p>
        <p>Score 11 : ______ / 10</p>
        <p>12. Ora iasana : □ mihoatra ny adiny 4 = 20 □ adiny 2-3 = 10 □ latsaky ny adiny 2 = 5 □ tsy voafaritra = 0</p>
        <p>Score 12 : ______ / 20</p>
        <p><strong>Total 11 + 12 : ______ / 30</strong></p>

        <h4>2. Olana ara-pahasalamana</h4>
        <p style={refStyle}>
          Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
          1-Tazo moka.
          2-Aretim-pivalanana.
          3-Aretina azo amin’ny firaisana ara-nofo, anisan’izany VIH-SIDA.
          4-Areti-mifindra hafa.
          5-Areti-mandoza mandripaka : tosidra, diabeta, homamiadana.
          6-Aretina hafa 1.
          7-Aretina hafa 2.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 10</p>

        <h4>3. Voina manimba taranaka</h4>
        <p style={refStyle}>
          Référence : saraho amin’ny olana ara-pahasalamana ny fiarovana ny tanora amin’ny voina manimba ny hoaviny :
          1-Vohoka aloha loatra.
          2-Mariazin’ny ankizy.
          3-Fidorohana zava-mahadomelina.
          4-Herisetra.
          5-Fitondran-tena mampidi-doza.
          6-Fahaverezan’ny fanantenana.
          7-Olana hafa manimba ny hoavin’ny tanora.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 10</p>

        <h4>4A. Vahaolana 140 andro — Fahasalamana</h4>
        <p style={refStyle}>
          Référence :
          1-Ady amin’ny tazo moka.
          2-Ady amin’ny aretim-pivalanana.
          3-Vaksiny.
          4-Fanjarian-tsakafo.
          5-Fampiroboroboana fanatanjahantena sy fialamboly ho an’ny fahasalamana ara-batana sy ara-tsaina.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>

        <h4>4B. Vahaolana 140 andro — Fiarovana amin’ny voina manimba ny tanora</h4>
        <p style={refStyle}>
          Référence :
          1-Fisorohana vohoka aloha loatra.
          2-Fisorohana mariazin’ny ankizy.
          3-Fisorohana fidorohana zava-mahadomelina.
          4-Fisorohana herisetra.
          5-Paikady iombonana hafa.
          6-Paikady iombonana hafa.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score paikady ankapobeny : ______ / 20</p>

        <h3>Total Vaomiera Fahasalamana sy Fiarovana : ______ / 70</h3>

        <hr />

        <h2>E. Vaomiera “Etikan’ny fampandrosoana maharitra”</h2>

        <h4>1. Efa miodina tsara ve ny Vaomiera ?</h4>
        <p>11. Fivoriana : □ in-2 = 10 □ in-1 = 5 □ tsy misy = 0</p>
        <p>Score 11 : ______ / 10</p>
        <p>12. Ora iasana : □ mihoatra ny adiny 4 = 20 □ adiny 2-3 = 10 □ latsaky ny adiny 2 = 5 □ tsy voafaritra = 0</p>
        <p>Score 12 : ______ / 20</p>
        <p><strong>Total 11 + 12 : ______ / 30</strong></p>

        <h4>2. Olana mikasika ny fandriampahalemana sy kolikoly</h4>
        <p style={refStyle}>
          Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
          1-Halatra be vava miaraka amin’ny vono olona.
          2-Halabotry.
          3-Disadisa ara-piarahamonina.
          4-Ady lahy sy fizarazarana ara-politika.
          5-Kolikoly sy fahalovana miantraika amin’ny fiainam-piaraha-monina.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 10</p>

        <h4>3. Olana mikasika ny tontolo iainana</h4>
        <p style={refStyle}>
          Référence : kilasio 1 raha tena olana mafy, 2 raha olana mafy fa mbola azo leferina, 3 raha tsy olana :
          1-Doro tanety.
          2-Fandripahana ny ala.
          3-Fandripahana na fandrobana ny harena voajanahary sy loharanon-karena iombonana.
          4-Faharitry ny loharano sy haintany.
          5-Fiankinandoha amin’ny saribao sy kitay.
          6-Loza voajanahary : rivo-doza, tondradrano.
          7-Olana hafa.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score : ______ / 10</p>

        <h4>4A. Vahaolana 140 andro — Fandriampahalemana sy ady amin’ny kolikoly</h4>
        <p style={refStyle}>
          Référence :
          1-Fanamafisana fihavanana.
          2-Fametrahana fandriampahalemana maharitra.
          3-Fisorohana sy ady amin’ny fahalovana.
          4-Fanabeazana olom-pirenena.
          5-Dina sy fitsipika iombonana.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>

        <h4>4B. Vahaolana 140 andro — Tontolo iainana</h4>
        <p style={refStyle}>
          Référence :
          1-Fambolena hazo/ala.
          2-Fefy velona manodidina ny Taniketsa Voly rakotra 500m².
          3-Ady amin’ny doro tanety sy fandripahana ala.
          4-Angovo maintso.
          5-Famokarana biolojika miaro ny natiora.
          6-Fanodinana fako.
          7-Paikady hafa.
        </p>
        <p><strong>Valiny :</strong></p>
        <div style={largeAnswerBox}></div>
        <p>Score paikady ankapobeny : ______ / 20</p>

        <h3>Total Vaomiera Etika Fampandrosoana maharitra : ______ / 70</h3>

        <hr />

        <h2>6. Synthèse générale VTI</h2>
        <p>Total Ara-panahy sy fanabeazana : ______ / 85</p>
        <p>Total Fandraharahana sy Toekarena : ______ / 60</p>
        <p>Total Fahasalamana sy Fiarovana : ______ / 70</p>
        <p>Total Etika Fampandrosoana maharitra : ______ / 70</p>
        <h3>Total général VTI : ______ / 285</h3>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={() => window.print()}>
            Imprimer
          </button>

          <button style={styles.secondaryButton} onClick={() => window.print()}>
            Télécharger PDF
          </button>
        </div>
      </section>
    </main>
  );
}
function FicheRemplieVti({ onBack }: any) {
  const [vtiIdInput, setVtiIdInput] = useState("");
  const [vti, setVti] = useState<any>(null);
  const [arapanahy, setArapanahy] = useState<any>(null);
  const [toekarena, setToekarena] = useState<any>(null);
  const [fahasalamana, setFahasalamana] = useState<any>(null);
  const [etika, setEtika] = useState<any>(null);

  const chargerFiche = async () => {
    const id = Number(vtiIdInput);

    if (!id) {
      alert("Ampidiro aloha ny ID VTI.");
      return;
    }

    const { data: vtiData, error: vtiError } = await supabase
      .from("vti")
      .select("*")
      .eq("id", id)
      .single();

    if (vtiError) {
      alert("Tsy hita ny ID VTI : " + JSON.stringify(vtiError));
      return;
    }

    const { data: araData } = await supabase
      .from("vti_vaomiera_arapanahy_fanabeazana")
      .select("*")
      .eq("vti_id", id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: toeData } = await supabase
      .from("vti_vaomiera_fandraharahana_toekarena")
      .select("*")
      .eq("vti_id", id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: fahData } = await supabase
      .from("vti_vaomiera_fahasalamana_fiarovana")
      .select("*")
      .eq("vti_id", id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: etiData } = await supabase
      .from("vti_vaomiera_etika_fampandrosoana")
      .select("*")
      .eq("vti_id", id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    setVti(vtiData);
    setArapanahy(araData);
    setToekarena(toeData);
    setFahasalamana(fahData);
    setEtika(etiData);
  };

  const show = (value: any) => value || "—";
  const score = (value: any) => Number(value || 0);

  const totalGeneral =
    score(arapanahy?.total_score) +
    score(toekarena?.total_score) +
    score(fahasalamana?.total_score) +
    score(etika?.total_score);

  const boxStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    background: "#fafafa",
    whiteSpace: "pre-wrap" as const,
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fiche remplie VTI</h1>

        <label style={styles.label}>Ampidiro ny ID VTI</label>
        <input
          style={styles.input}
          type="number"
          value={vtiIdInput}
          onChange={(e) => setVtiIdInput(e.target.value)}
        />

        <div style={styles.actions}>
          <button style={styles.button} onClick={chargerFiche}>
            Charger la fiche
          </button>

          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>

        {vti && (
          <>
            <hr />

            <h2>1. Famantarana ny VTI</h2>
            <p><strong>ID VTI :</strong> {vti.id}</p>
            <p><strong>VTI Anarany :</strong> {show(vti.nom_vti)}</p>
            <p><strong>Faritra :</strong> {show(vti.faritra)}</p>
            <p><strong>Distrika :</strong> {show(vti.distrika)}</p>
            <p><strong>Kaomina :</strong> {show(vti.kaomina)}</p>
            <p><strong>Karazana Kaomina :</strong> {show(vti.type_kaomina)}</p>
            <p><strong>Fokontany :</strong> {show(vti.fokontany)}</p>
            <p><strong>Isan’ny Mponina :</strong> {show(vti.isan_mponina)}</p>

            <hr />

            <h2>A. Vaomiera Ara-panahy sy fanabeazana</h2>
            <p><strong>Total :</strong> {score(arapanahy?.total_score)} / 70</p>
            <p>Fivoriana : {score(arapanahy?.mivory_score)} points</p>
            <p>Ora iasana : {score(arapanahy?.ora_score)} points</p>
            <p>Herinandro dimy : {score(arapanahy?.herinandro_score)} points</p>

            <h4>Fanaka dimy</h4>
            <div style={boxStyle}>{show(arapanahy?.fanaka_dimy)}</div>
            <p>Score : {score(arapanahy?.fanaka_score)} points</p>

            <h4>Fanamby 140 andro</h4>
            <div style={boxStyle}>{show(arapanahy?.fanamby_140_andro)}</div>
            <p>Score : {score(arapanahy?.fanamby_score)} points</p>

            <h4>Olana ara-panabeazana</h4>
            <div style={boxStyle}>{show(arapanahy?.olana_fanabeazana)}</div>
            <p>Score : {score(arapanahy?.olana_score)} points</p>

            <h4>Paikady ara-panabeazana</h4>
            <div style={boxStyle}>{show(arapanahy?.paikady_140_andro)}</div>
            <p>Score : {score(arapanahy?.paikady_score)} points</p>

            <hr />

            <h2>B. Vaomiera Fandraharahana sy Toekarena</h2>
            <p><strong>Total :</strong> {score(toekarena?.total_score)} / 40</p>
            <p>Fivoriana : {score(toekarena?.mivory_score)} points</p>
            <p>Ora iasana : {score(toekarena?.ora_score)} points</p>

            <h4>Olana ara-toekarena</h4>
            <div style={boxStyle}>{show(toekarena?.olana_toekarena)}</div>
            <p>Score : {score(toekarena?.olana_score)} points</p>

            <h4>Paikady ara-toekarena</h4>
            <div style={boxStyle}>{show(toekarena?.paikady_toekarena)}</div>
            <p>Score : {score(toekarena?.paikady_score)} points</p>

            <hr />

            <h2>D. Vaomiera Fahasalamana sy Fiarovana ny tanora</h2>
            <p><strong>Total :</strong> {score(fahasalamana?.total_score)} / 50</p>
            <p>Fivoriana : {score(fahasalamana?.mivory_score)} points</p>
            <p>Ora iasana : {score(fahasalamana?.ora_score)} points</p>

            <h4>Olana ara-pahasalamana</h4>
            <div style={boxStyle}>{show(fahasalamana?.olana_fahasalamana)}</div>
            <p>Score : {score(fahasalamana?.olana_fahasalamana_score)} points</p>

            <h4>Voina manimba taranaka</h4>
            <div style={boxStyle}>{show(fahasalamana?.voina_tanora)}</div>
            <p>Score : {score(fahasalamana?.voina_score)} points</p>

            <h4>Vahaolana 140 andro — Fahasalamana sy fiarovana</h4>
            <div style={boxStyle}>{show(fahasalamana?.paikady_fahasalamana)}</div>
            <p>Score : {score(fahasalamana?.paikady_score)} points</p>

            <hr />

            <h2>E. Vaomiera Etikan’ny fampandrosoana maharitra</h2>
            <p><strong>Total :</strong> {score(etika?.total_score)} / 50</p>
            <p>Fivoriana : {score(etika?.mivory_score)} points</p>
            <p>Ora iasana : {score(etika?.ora_score)} points</p>

            <h4>Olana fandriampahalemana sy kolikoly</h4>
            <div style={boxStyle}>{show(etika?.olana_fandriampahalemana)}</div>
            <p>Score : {score(etika?.olana_fandriampahalemana_score)} points</p>

            <h4>Olana tontolo iainana</h4>
            <div style={boxStyle}>{show(etika?.olana_tontolo_iainana)}</div>
            <p>Score : {score(etika?.olana_tontolo_iainana_score)} points</p>

            <h4>Vahaolana 140 andro — Etika sy fampandrosoana maharitra</h4>
            <div style={boxStyle}>{show(etika?.paikady_etika)}</div>
            <p>Score : {score(etika?.paikady_score)} points</p>

            <hr />

            <h2>Synthèse générale VTI</h2>
            <p>Total Ara-panahy sy fanabeazana : {score(arapanahy?.total_score)} / 70</p>
            <p>Total Fandraharahana sy Toekarena : {score(toekarena?.total_score)} / 40</p>
            <p>Total Fahasalamana sy Fiarovana : {score(fahasalamana?.total_score)} / 50</p>
            <p>Total Etika Fampandrosoana maharitra : {score(etika?.total_score)} / 50</p>

            <h2 style={styles.score}>
              Total général VTI : {totalGeneral} / 210
            </h2>

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
      </section>
    </main>
  );
}
function IdentiteForm({ onBack, onNext, onSaved }: any) {
  const [anarana, setAnarana] = useState("");
  const [age, setAge] = useState("");
  const [sexe, setSexe] = useState("");
  const [faritra, setFaritra] = useState("");
  const [distrika, setDistrika] = useState("");
  const [typeKaomina, setTypeKaomina] = useState("Ambanivohitra");
  const [kaomina, setKaomina] = useState("");
  const [fokontany, setFokontany] = useState("");
  const [vtiId, setVtiId] = useState("");
  const [vaomieraMisyAzy, setVaomieraMisyAzy] = useState("");

  const enregistrerIdentite = async () => {
    const { data, error } = await supabase
      .from("tanora")
      .insert([
        {
          anarana,
          taona: Number(age || 0),
          sexe,
          kaomina,
          fokontany,
          vti: String(vtiId || ""),
          faritra,
          distrika,
          type_kaomina: typeKaomina,
          vti_id: vtiId ? Number(vtiId) : null,
          vaomiera_misy_azy: vaomieraMisyAzy || "",
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Erreur Identité Tanora : " + JSON.stringify(error));
      return;
    }

    onSaved(data.id);
    alert("Identité Tanora voatahiry tsara ! ID Tanora : " + data.id);
    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Famantarana ny Tanora</h1>

        <label style={styles.label}>ID VTI mifandray</label>
        <input
          style={styles.input}
          type="number"
          value={vtiId}
          onChange={(e) => setVtiId(e.target.value)}
          placeholder="Ampidiro eto ny ID VTI"
        />

        <label style={styles.label}>Vaomiera misy azy</label>
        <input
          style={styles.input}
          value={vaomieraMisyAzy}
          onChange={(e) => setVaomieraMisyAzy(e.target.value)}
          placeholder="Ara-panahy / Fandraharahana / Fahasalamana / Etika"
        />

        <label style={styles.label}>Anarana</label>
        <input
          style={styles.input}
          value={anarana}
          onChange={(e) => setAnarana(e.target.value)}
        />

        <label style={styles.label}>Taona</label>
        <input
          style={styles.input}
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label style={styles.label}>Lahy / Vavy</label>
        <select
          style={styles.input}
          value={sexe}
          onChange={(e) => setSexe(e.target.value)}
        >
          <option value="">Safidio</option>
          <option value="Lahy">Lahy</option>
          <option value="Vavy">Vavy</option>
        </select>

        <label style={styles.label}>Faritra</label>
        <input
          style={styles.input}
          value={faritra}
          onChange={(e) => setFaritra(e.target.value)}
        />

        <label style={styles.label}>Distrika</label>
        <input
          style={styles.input}
          value={distrika}
          onChange={(e) => setDistrika(e.target.value)}
        />

        <label style={styles.label}>Type de Kaomina</label>
        <select
          style={styles.input}
          value={typeKaomina}
          onChange={(e) => setTypeKaomina(e.target.value)}
        >
          <option value="Ambanivohitra">Kaomina Ambanivohitra</option>
          <option value="Andrenivohitra">Kaomina Andrenivohitra</option>
        </select>

        <label style={styles.label}>Kaomina</label>
        <input
          style={styles.input}
          value={kaomina}
          onChange={(e) => setKaomina(e.target.value)}
        />

        <label style={styles.label}>Fokontany</label>
        <input
          style={styles.input}
          value={fokontany}
          onChange={(e) => setFokontany(e.target.value)}
        />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>

          <button style={styles.button} onClick={enregistrerIdentite}>
            Enregistrer Identité Tanora sy hanohy
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
function TaniketsaForm({ tanoraId, onBack }: any) {
  const filieres = [
    { type: "voly", name: "Voly rakotra 500m²", unitQuestion: "Parcelle 500m² firy no ho volenao ?", unitName: "parcelle", caRef: [754800, 876800, 876800], depRef: [230000, 110000, 170000] },
    { type: "vary", name: "Voly vary 750m²", unitQuestion: "Parcelle 750m² firy no ho volenao ?", unitName: "parcelle", caRef: [450000, 600000, 600000], depRef: [350000, 350000, 350000] },
    { type: "akoho", name: "Akoho gasy", unitQuestion: "Tranon’akoho firy no hanombohanao amin’ny Taona 1 ?", unitName: "tranon’akoho", caRef: [0, 0, 0], depRef: [0, 0, 0] },
    { type: "kisoa", name: "Fanatavezana kisoa", unitQuestion: "Kisoa firy no hatavezinao ?", unitName: "kisoa", caRef: [1400000, 1400000, 1400000], depRef: [756440, 756440, 756440] },
    { type: "tantely", name: "Tantely", unitQuestion: "Tohon-tantely firy no hompianao ?", unitName: "tohon-tantely", caRef: [378000, 378000, 378000], depRef: [295000, 135000, 135000] },
  ];

  const [selected, setSelected] = useState<boolean[]>(Array(5).fill(false));
  const [units, setUnits] = useState<number[][]>(filieres.map(() => [0, 0, 0]));

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
      const ruchesActives = units[i][year];
      const ruchesAvant = year === 0 ? 0 : units[i][year - 1];
      const ruchesNouvelles = Math.max(ruchesActives - ruchesAvant, 0);
      const ruchesAnciennes = ruchesActives - ruchesNouvelles;

      const caParRuche = 42 * 9000;
      const dep = ruchesNouvelles * 295000 + ruchesAnciennes * 135000;
      const ca = ruchesActives * caParRuche;

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: `${ruchesActives} tohontantely actifs ; ${ruchesNouvelles} vaovao ; ${ruchesAnciennes} efa nisy ; 42 L/an/tohontantely × 9 000 Ar/L ; dépenses vaovao 295 000 Ar, dépenses manaraka 135 000 Ar`,
      };
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

                        <p>{d.detail}</p>
                        <strong>CA calculé : </strong>{d.ca.toLocaleString()} Ar<br />
                        <strong>Dépenses calculées : </strong>{d.dep.toLocaleString()} Ar<br />
                        <strong>Bénéfice calculé : </strong>{d.benefice.toLocaleString()} Ar
                      </div>
                    );
                  })}

                  <h4 style={styles.sectionTitle}>A. Fananantany — 5 points</h4>
                  <textarea style={styles.textarea} placeholder="An’iza ny tany ? Fanananao ve, an’ny ray aman-dreny, hofaina, sa hafa ? Firy ny refiny ?" value={reponses[i].fananantany} onChange={(e) => updateReponse(i, "fananantany", e.target.value)} />
                  <ScoreSelect label="Score fananantany" max={5} onChange={(v: number) => updateScore(i, "tany", v)} />

                  <h4 style={styles.sectionTitle}>B. Fiofanana — 15 points</h4>
                  <textarea style={styles.textarea} placeholder="Efa nahazo fiofanana ve ? Hazavao ny votoatin’ny fiofanana sy izay hainao ampiharina." value={reponses[i].fiofanana} onChange={(e) => updateReponse(i, "fiofanana", e.target.value)} />
                  <ScoreSelect label="Score fiofanana" max={15} onChange={(v: number) => updateScore(i, "fiofanana", v)} />

                  <h4 style={styles.sectionTitle}>C. Ezaka sy anjara biriky — 20 points</h4>
                  <textarea style={styles.textarea} placeholder="Sorito ny ezaka sy anjara biriky: tany, fitaovana, vola, asa tanana, akora, sary, taratasy fanekena." value={reponses[i].ezaka} onChange={(e) => updateReponse(i, "ezaka", e.target.value)} />
                  <ScoreSelect label="Score ezaka sy anjara biriky" max={20} onChange={(v: number) => updateScore(i, "ezaka", v)} />

                  <h4 style={styles.sectionTitle}>D. Tohana ilaina — 5 points</h4>
                  <textarea style={styles.textarea} placeholder="Inona no tohana tena ilaina izay tsy vitanao irery intsony ?" value={reponses[i].tohana} onChange={(e) => updateReponse(i, "tohana", e.target.value)} />
                  <ScoreSelect label="Score tohana ilaina" max={5} onChange={(v: number) => updateScore(i, "tohana", v)} />

                  <h4 style={styles.sectionTitle}>E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points</h4>
                  <textarea style={styles.textarea} placeholder="Efa nivarotra zavatra ve ianao tao anatin’ny 3 taona farany ? Fantatrao ve ny dépenses sy tombom-barotra ? Inona ny fiofanana ilainao ?" value={reponses[i].diagnostic} onChange={(e) => updateReponse(i, "diagnostic", e.target.value)} />
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
function FicheRemplie({ onBack }: any) {
  const [id, setId] = useState("");
  const [tanora, setTanora] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [eco, setEco] = useState<any>(null);
  const [rep, setRep] = useState<any>(null);
  const [repSpirituel, setRepSpirituel] = useState<any>(null);
  const [repVti, setRepVti] = useState<any>(null);

  const [vtiLie, setVtiLie] = useState<any>(null);
  const [annexeVaomiera, setAnnexeVaomiera] = useState<any>(null);
  const [annexeTitre, setAnnexeTitre] = useState("");

  const chargerFiche = async () => {
    const tanoraId = parseInt(id);

    if (!tanoraId) {
      alert("Ampidiro aloha ny ID Tanora.");
      return;
    }

    setTanora(null);
    setScores(null);
    setEco(null);
    setRep(null);
    setRepSpirituel(null);
    setRepVti(null);
    setVtiLie(null);
    setAnnexeVaomiera(null);
    setAnnexeTitre("");

    const { data: tanoraData } = await supabase
      .from("tanora")
      .select("*")
      .eq("id", tanoraId)
      .maybeSingle();

    if (!tanoraData) {
      alert("Tsy hita ny ID Tanora.");
      return;
    }

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

    if (tanoraData?.vti_id && vtiData?.vti_q5) {
      const vtiId = Number(tanoraData.vti_id);
      const vaomieraChoisie = String(vtiData.vti_q5 || "");

      const { data: vtiLieData } = await supabase
        .from("vti")
        .select("*")
        .eq("id", vtiId)
        .maybeSingle();

      setVtiLie(vtiLieData);

      let tableVaomiera = "";
      let titreVaomiera = "";

      if (vaomieraChoisie.includes("Ara-panahy")) {
        tableVaomiera = "vti_vaomiera_arapanahy_fanabeazana";
        titreVaomiera = "Vaomiera Ara-panahy sy fanabeazana";
      } else if (vaomieraChoisie.includes("Fandraharahana")) {
        tableVaomiera = "vti_vaomiera_fandraharahana_toekarena";
        titreVaomiera = "Vaomiera Fandraharahana sy Toekarena";
      } else if (vaomieraChoisie.includes("Fahasalamana")) {
        tableVaomiera = "vti_vaomiera_fahasalamana_fiarovana";
        titreVaomiera = "Vaomiera Fahasalamana sy Fiarovana ny tanora";
      } else if (vaomieraChoisie.includes("Etika")) {
        tableVaomiera = "vti_vaomiera_etika_fampandrosoana";
        titreVaomiera = "Vaomiera Etika Fampandrosoana maharitra";
      }

      if (tableVaomiera) {
        const { data: vaomieraData } = await supabase
          .from(tableVaomiera)
          .select("*")
          .eq("vti_id", vtiId)
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();

        setAnnexeTitre(titreVaomiera);
        setAnnexeVaomiera(vaomieraData);
      }
    }
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
            <p>Anarana : {tanora.nom || tanora.anarana || "—"}</p>
            <p>Fanampin’anarana : {tanora.prenom || "—"}</p>
            <p>Taona : {tanora.age || tanora.taona || "—"}</p>
            <p>Lahy / Vavy : {tanora.sexe || "—"}</p>
            <p>Faritra : {tanora.faritra || "—"}</p>
            <p>Distrika : {tanora.distrika || "—"}</p>
            <p>Kaomina : {tanora.kaomina || "—"}</p>
            <p>Fokontany : {tanora.fokontany || "—"}</p>
            <p><strong>ID VTI mifandray :</strong> {tanora.vti_id || "—"}</p>

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

            <h2>3. Function VTI — Anjara ao amin’ny VTI</h2>

            <LigneQuestion numero="1" question="Tena tafiditra ao anaty VTI ve ilay Tanora ?" reponse={repVti?.vti_q1} />
            <LigneQuestion numero="2" question="Mahafantatra ny tanjon’ny VTI ve izy ?" reponse={repVti?.vti_q2} />
            <LigneQuestion numero="3" question="Mandray andraikitra ve izy ?" reponse={repVti?.vti_q3} />
            <LigneQuestion numero="4" question="Manana anjara biriky ve izy ?" reponse={repVti?.vti_q4} />
            <LigneQuestion numero="5" question="Vaomiera misy azy" reponse={repVti?.vti_q5} />

            <h3>Total VTI : {scores?.score_vti || 0} / 55</h3>

            <hr />

            <h2>4. Taniketsa Fandraharahana</h2>

            <h3>Voly rakotra</h3>
            <p>Fananantany : {rep?.voly_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.voly_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.voly_ezaka || "—"}</p>
            <p>Tohana : {rep?.voly_tohana || "—"}</p>
            <p>Diagnostic : {rep?.voly_diagnostic || "—"}</p>
            <p>Score : {scores?.score_voly || 0} / 55</p>
            <p>CA : {eco?.ca_voly || 0} Ar — Dépenses : {eco?.depenses_voly || 0} Ar — Bénéfice : {eco?.benefice_voly || 0} Ar</p>

            <h3>Vary</h3>
            <p>Fananantany : {rep?.vary_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.vary_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.vary_ezaka || "—"}</p>
            <p>Tohana : {rep?.vary_tohana || "—"}</p>
            <p>Diagnostic : {rep?.vary_diagnostic || "—"}</p>
            <p>Score : {scores?.score_vary || 0} / 55</p>
            <p>CA : {eco?.ca_vary || 0} Ar — Dépenses : {eco?.depenses_vary || 0} Ar — Bénéfice : {eco?.benefice_vary || 0} Ar</p>

            <h3>Akoho gasy</h3>
            <p>Fananantany : {rep?.akoho_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.akoho_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.akoho_ezaka || "—"}</p>
            <p>Tohana : {rep?.akoho_tohana || "—"}</p>
            <p>Diagnostic : {rep?.akoho_diagnostic || "—"}</p>
            <p>Score : {scores?.score_akoho || 0} / 55</p>
            <p>CA : {eco?.ca_akoho || 0} Ar — Dépenses : {eco?.depenses_akoho || 0} Ar — Bénéfice : {eco?.benefice_akoho || 0} Ar</p>

            <h3>Kisoa</h3>
            <p>Fananantany : {rep?.kisoa_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.kisoa_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.kisoa_ezaka || "—"}</p>
            <p>Tohana : {rep?.kisoa_tohana || "—"}</p>
            <p>Diagnostic : {rep?.kisoa_diagnostic || "—"}</p>
            <p>Score : {scores?.score_kisoa || 0} / 55</p>
            <p>CA : {eco?.ca_kisoa || 0} Ar — Dépenses : {eco?.depenses_kisoa || 0} Ar — Bénéfice : {eco?.benefice_kisoa || 0} Ar</p>

            <h3>Tantely</h3>
            <p>Fananantany : {rep?.tantely_fananantany || "—"}</p>
            <p>Fiofanana : {rep?.tantely_fiofanana || "—"}</p>
            <p>Ezaka : {rep?.tantely_ezaka || "—"}</p>
            <p>Tohana : {rep?.tantely_tohana || "—"}</p>
            <p>Diagnostic : {rep?.tantely_diagnostic || "—"}</p>
            <p>Score : {scores?.score_tantely || 0} / 55</p>
            <p>CA : {eco?.ca_tantely || 0} Ar — Dépenses : {eco?.depenses_tantely || 0} Ar — Bénéfice : {eco?.benefice_tantely || 0} Ar</p>

            <hr />

            <h2>5. Synthèse générale</h2>
            <p>Total CA 3 ans : {eco?.ca_total || 0} Ar</p>
            <p>Total dépenses 3 ans : {eco?.depenses_total || 0} Ar</p>
            <p>Total bénéfice 3 ans : {eco?.benefice_total || 0} Ar</p>

            {vtiLie && (
              <>
                <hr />

                <h2>TOVANA — Vaomiera mifandray amin’ny VTI</h2>

                <p><strong>ID VTI :</strong> {vtiLie.id}</p>
                <p><strong>Anaran’ny VTI :</strong> {vtiLie.nom_vti || "—"}</p>
                <p><strong>Faritra :</strong> {vtiLie.faritra || "—"}</p>
                <p><strong>Distrika :</strong> {vtiLie.distrika || "—"}</p>
                <p><strong>Kaomina :</strong> {vtiLie.kaomina || "—"}</p>
                <p><strong>Fokontany :</strong> {vtiLie.fokontany || "—"}</p>

                <h3>{annexeTitre || "Vaomiera mifandray"}</h3>
                <p><strong>Vaomiera misy ilay Tanora :</strong> {repVti?.vti_q5 || "—"}</p>

                {annexeVaomiera ? (
                  <div style={styles.miniBox}>
                    <p><strong>Total score Vaomiera :</strong> {annexeVaomiera.total_score || 0}</p>

                    {Object.entries(annexeVaomiera).map(([key, value]) => {
                      if (
                        key === "id" ||
                        key === "vti_id" ||
                        key === "created_at" ||
                        key.includes("_score") ||
                        key === "total_score"
                      ) {
                        return null;
                      }

                      return (
                        <p key={key}>
                          <strong>{key} :</strong> {String(value || "—")}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p>Aucune donnée Vaomiera trouvée pour ce VTI.</p>
                )}
              </>
            )}

            {!vtiLie && tanora.vti_id && (
              <>
                <hr />
                <h2>TOVANA — Vaomiera mifandray amin’ny VTI</h2>
                <p>
                  ID VTI hita ao amin’ny Tanora, fa tsy mbola hita na tsy mbola feno ny Vaomiera mifandray.
                </p>
              </>
            )}

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
