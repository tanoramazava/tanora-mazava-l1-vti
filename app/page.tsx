import { useState } from "react";

type Screen = "home" | "identite" | "arapanahy" | "vti";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "identite") {
    return (
      <IdentiteForm
        onBack={() => setScreen("home")}
        onNext={() => setScreen("arapanahy")}
      />
    );
  }

  if (screen === "arapanahy") {
    return (
      <AraPanahyForm
        onBack={() => setScreen("identite")}
        onNext={() => setScreen("vti")}
      />
    );
  }

  if (screen === "vti") {
    return <VtiForm onBack={() => setScreen("arapanahy")} />;
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

function IdentiteForm({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
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
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function AraPanahyForm({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [vavakaTaloha, setVavakaTaloha] = useState("isanandro");
  const [vavakaBetela, setVavakaBetela] = useState("isanandro");
  const [fibebahana, setFibebahana] = useState("mahafapo2");

  const scoreVavakaTaloha = vavakaTaloha === "isanandro" ? 5 : vavakaTaloha === "mihoatra3" ? 3 : vavakaTaloha === "latsaky1" ? 2 : vavakaTaloha === "in3volana" ? 1 : 0;
  const scoreVavakaBetela = vavakaBetela === "isanandro" ? 5 : vavakaBetela === "mihoatra3" ? 3 : vavakaBetela === "latsaky1" ? 1 : 0;
  const scoreFibebahana = fibebahana === "mahafapo2" ? 10 : fibebahana === "mahafapo1" ? 5 : fibebahana === "tsyfeno" ? 2 : 0;

  const totalAraPanahy = scoreVavakaTaloha + scoreVavakaBetela + scoreFibebahana;

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana Voalohany Ara-panahy</h1>
        <p style={styles.text}>Fanabeazana mitohy ho “Mpianatry ny Tompo” — Totalibeny : 52 points</p>

        <div style={styles.scoreBox}>Total Ara-panahy vonjimaika : <strong>{totalAraPanahy} / 52</strong></div>

        <QuestionCard title="Efa zatra nitokam-bavaka ve ?" value={vavakaTaloha} onChange={setVavakaTaloha} score={scoreVavakaTaloha}
          options={[
            ["isanandro", "Isan’andro — 5 points"],
            ["mihoatra3", "Mihoatra in-3 isan-kerinandro — 3 points"],
            ["latsaky1", "Latsaky ny in-1 isan-kerinandro — 2 points"],
            ["in3volana", "In-3 isam-bolana — 1 point"],
            ["tsy_misy", "Latsaky ny in-3 isam-bolana / Tsy misy — 0 point"],
          ]}
        />

        <QuestionCard title="Efa manao pratika ny Vavaka Betela ve ?" value={vavakaBetela} onChange={setVavakaBetela} score={scoreVavakaBetela}
          options={[
            ["isanandro", "Isan’andro — 5 points"],
            ["mihoatra3", "Mihoatra in-3 isan-kerinandro — 3 points"],
            ["latsaky1", "Latsaky ny in-1 isan-kerinandro — 1 point"],
            ["tsy_misy", "Tsy misy — 0 point"],
          ]}
        />

        <QuestionCard title="Hazavao ny antony hanaovana vavaka fibebahana sy fiderana" value={fibebahana} onChange={setFibebahana} score={scoreFibebahana}
          options={[
            ["mahafapo2", "Valiny mahafapo 2/2 — 10 points"],
            ["mahafapo1", "Valiny mahafapo 1/2 — 5 points"],
            ["tsyfeno", "Valiny tsy feno / tsy mahafapo tsara — 2 points"],
            ["diso", "Valiny tena diso — 0 point"],
          ]}
        />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={onNext}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function VtiForm({ onBack }: { onBack: () => void }) {
  const [fikambanana, setFikambanana] = useState("eny");
  const [fikambananaTanora, setFikambananaTanora] = useState("eny");
  const [andraikitraTaloha, setAndraikitraTaloha] = useState("mazava");
  const [fahalalanaVti, setFahalalanaVti] = useState("mazava");
  const [vaomiera, setVaomiera] = useState("mazava");
  const [andraikitraVaomiera, setAndraikitraVaomiera] = useState("mazava");
  const [ora, setOra] = useState("4");

  const scoreFikambanana = fikambanana === "eny" ? 2 : 0;
  const scoreFikambananaTanora = fikambananaTanora === "eny" ? 2 : 0;
  const scoreAndraikitraTaloha = andraikitraTaloha === "mazava" ? 5 : andraikitraTaloha === "manjavozavo" ? 2 : 0;
  const scoreFahalalanaVti = fahalalanaVti === "mazava" ? 5 : fahalalanaVti === "manjavozavo" ? 2 : 0;
  const scoreVaomiera = vaomiera === "mazava" ? 5 : 0;
  const scoreAndraikitraVaomiera = andraikitraVaomiera === "mazava" ? 5 : andraikitraVaomiera === "manjavozavo" ? 2 : 0;
  const scoreOra = ora === "4" ? 5 : ora === "2" ? 3 : ora === "latsaky2" ? 1 : 0;

  const totalVti = scoreFikambanana + scoreFikambananaTanora + scoreAndraikitraTaloha + scoreFahalalanaVti + scoreVaomiera + scoreAndraikitraVaomiera + scoreOra;

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 2 — Firotsahana ao anaty VTI</h1>
        <p style={styles.text}>Fandraisana andraikitra feno ao anaty VTI — Totalibeny : 29 points</p>

        <div style={styles.scoreBox}>Total VTI vonjimaika : <strong>{totalVti} / 29</strong></div>

        <QuestionCard title="Efa tao anaty fikambanana ve ?" value={fikambanana} onChange={setFikambanana} score={scoreFikambanana}
          options={[["eny", "Eny — 2 points"], ["tsia", "Tsia — 0 point"]]}
        />

        <QuestionCard title="Efa tao anaty fikambanana tanora ve ?" value={fikambananaTanora} onChange={setFikambananaTanora} score={scoreFikambananaTanora}
          options={[["eny", "Eny — 2 points"], ["tsia", "Tsia — 0 point"]]}
        />

        <QuestionCard title="Andraikitra azo tsapain-tanana efa noraisinao teo anivon’ny vohitra na Fokontany" value={andraikitraTaloha} onChange={setAndraikitraTaloha} score={scoreAndraikitraTaloha}
          options={[["mazava", "Andraikitra tena mivaingana sy mazava — 5 points"], ["manjavozavo", "Manjavozavo / tsy mazava tsara — 2 points"], ["tsy_misy", "Tsy nisy — 0 point"]]}
        />

        <QuestionCard title="Fahalalana mikasika ny VTI misy anao" value={fahalalanaVti} onChange={setFahalalanaVti} score={scoreFahalalanaVti}
          options={[["mazava", "Mazava tsara ary marina — 5 points"], ["manjavozavo", "Manjavozavo / tsy mazava tsara — 2 points"], ["tsy_voavaly", "Tsy voavaly — 0 point"]]}
        />

        <QuestionCard title="Ao anaty Vaomiera inona no misy anao ?" value={vaomiera} onChange={setVaomiera} score={scoreVaomiera}
          options={[["mazava", "Ao anaty Vaomiera mazava tsara — 5 points"], ["tsy_misy", "Tsy ao anaty Vaomiera — 0 point"]]}
        />

        <QuestionCard title="Inona no andraikitrao ao anatin’ny Vaomiera ?" value={andraikitraVaomiera} onChange={setAndraikitraVaomiera} score={scoreAndraikitraVaomiera}
          options={[["mazava", "Mazava tsara ary marina — 5 points"], ["manjavozavo", "Manjavozavo / tsy mazava tsara — 2 points"], ["tsy_voavaly", "Tsy voavaly — 0 point"]]}
        />

        <QuestionCard title="Adiny firy isan-kerinandro no atokanao hiasa ao anaty Vaomiera ?" value={ora} onChange={setOra} score={scoreOra}
          options={[["4", "Adiny 4 na mihoatra — 5 points"], ["2", "Adiny 2 mihoatra — 3 points"], ["latsaky2", "Latsaky ny adiny 2 — 1 point"], ["tsy_misy", "Tsy misy — 0 point"]]}
        />

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button}>Manaraka</button>
        </div>
      </section>
    </main>
  );
}

function QuestionCard({ title, value, onChange, score, options }: any) {
  return (
    <div style={styles.questionCard}>
      <div style={styles.questionHeader}>
        <h3 style={styles.questionTitle}>{title}</h3>
        <div style={styles.scoreSmall}>{score} pts</div>
      </div>

      <div style={styles.options}>
        {options.map(([key, label]: string[]) => (
          <label key={key} style={styles.radioLabel}>
            <input type="radio" checked={value === key} onChange={() => onChange(key)} />
            {label}
          </label>
        ))}
      </div>
    </div>
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
  main: { minHeight: "100vh", background: "linear-gradient(135deg, #064e3b, #f8fafc)", fontFamily: "Arial, sans-serif", padding: "30px" },
  card: { maxWidth: "1000px", margin: "0 auto", background: "white", borderRadius: "28px", padding: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.18)" },
  title: { color: "#047857", fontSize: "44px", textAlign: "center", marginBottom: "8px" },
  titleSmall: { color: "#047857", fontSize: "34px", marginBottom: "8px" },
  subtitle: { color: "#b91c1c", fontSize: "30px", textAlign: "center", marginTop: 0 },
  text: { fontSize: "18px", lineHeight: 1.7, marginTop: "24px" },
  button: { background: "#047857", color: "white", border: "none", padding: "16px 26px", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "30px" },
  secondaryButton: { background: "#f1f5f9", color: "#064e3b", border: "1px solid #cbd5e1", padding: "16px 26px", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "30px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginTop: "30px" },
  label: { display: "flex", flexDirection: "column", fontWeight: "bold", color: "#064e3b", gap: "8px", marginTop: "18px" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "16px" },
  actions: { display: "flex", justifyContent: "space-between", gap: "16px", marginTop: "20px" },
  scoreBox: { background: "#ecfdf5", border: "1px solid #10b981", color: "#064e3b", padding: "18px", borderRadius: "16px", fontSize: "20px", marginTop: "24px" },
  questionCard: { marginTop: "24px", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "22px", background: "#f8fafc" },
  questionHeader: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" },
  questionTitle: { color: "#064e3b", fontSize: "20px", margin: 0 },
  scoreSmall: { background: "#047857", color: "white", padding: "10px 14px", borderRadius: "12px", fontWeight: "bold", whiteSpace: "nowrap" },
  options: { display: "grid", gap: "12px", marginTop: "18px" },
  radioLabel: { display: "flex", gap: "10px", alignItems: "center", background: "white", padding: "14px", borderRadius: "12px", border: "1px solid #e5e7eb", fontWeight: "bold" },
};
