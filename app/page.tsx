function TaniketsaForm({ onBack }: any) {
  const filieres = [
    {
      name: "Voly rakotra 500m²",
      unitQuestion: "Parcelle 500m² firy no ho volenao ?",
      unitName: "parcelle",
      productionUnit: "valeur mixte",
      price: 1,
      prodRef: [754800, 876800, 876800],
      depRef: [230000, 110000, 170000],
      note: "Taona 1: 1 parcelle = CA 754 800 Ar ; Taona 2: 1 parcelle = CA 876 800 Ar ; Taona 3: 2 parcelles = 1 753 600 Ar.",
    },
    {
      name: "Voly vary 750m²",
      unitQuestion: "Parcelle 750m² firy no ho volenao ?",
      unitName: "parcelle",
      productionUnit: "kg paddy",
      price: 2000,
      prodRef: [225, 300, 300],
      depRef: [350000, 350000, 350000],
      note: "Rendement: Taona 1 = 225 kg ; Taona 2 sy 3 = 300 kg/parcelle ; prix paddy = 2 000 Ar/kg.",
    },
    {
      name: "Akoho gasy",
      unitQuestion: "Tokatranon’akoho firy no hompianao ?",
      unitName: "tokatrano",
      productionUnit: "poussins vendus",
      price: 3000,
      prodRef: [144, 144, 144],
      depRef: [430000, 350000, 350000],
      note: "1 tokatranon’akoho = 1 coq + 4 poules ; 160 poussins/an ; 90% vendus = 144 poussins ; prix = 3 000 Ar.",
    },
    {
      name: "Fanatavezana kisoa",
      unitQuestion: "Kisoa firy no hatavezinao ?",
      unitName: "kisoa",
      productionUnit: "kg poids vif",
      price: 14000,
      prodRef: [100, 100, 100],
      depRef: [756440, 756440, 756440],
      note: "1 kisoa = 100 kg poids vif ; prix = 14 000 Ar/kg ; dépenses référence = 756 440 Ar/kisoa.",
    },
    {
      name: "Tantely",
      unitQuestion: "Tohon-tantely firy no hompianao ?",
      unitName: "tohon-tantely",
      productionUnit: "litres",
      price: 9000,
      prodRef: [0, 0, 0],
      depRef: [0, 0, 0],
      note: "Ny litres sy dépenses dia ampidirin’ny tanora. Prix référence tantely = 9 000 Ar/litre.",
    },
  ];

  const [units, setUnits] = useState(
    filieres.map(() => [0, 0, 0])
  );

  const [customProd, setCustomProd] = useState(
    filieres.map(() => [0, 0, 0])
  );

  const [customDep, setCustomDep] = useState(
    filieres.map(() => [0, 0, 0])
  );

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

  const updateCustomProd = (i: number, year: number, value: number) => {
    const copy = customProd.map((row) => [...row]);
    copy[i][year] = value;
    setCustomProd(copy);
  };

  const updateCustomDep = (i: number, year: number, value: number) => {
    const copy = customDep.map((row) => [...row]);
    copy[i][year] = value;
    setCustomDep(copy);
  };

  const updateScore = (i: number, key: string, value: number) => {
    const copy = scores.map((s) => ({ ...s }));
    copy[i] = { ...copy[i], [key]: value };
    setScores(copy);
  };

  const getYearData = (f: any, i: number, year: number) => {
    const n = units[i][year];

    const production =
      f.name === "Tantely"
        ? customProd[i][year]
        : n * f.prodRef[year];

    const depenses =
      f.name === "Tantely"
        ? customDep[i][year]
        : n * f.depRef[year];

    const ca =
      f.name === "Voly rakotra 500m²"
        ? n * f.prodRef[year]
        : production * f.price;

    const benefice = ca - depenses;

    return { production, depenses, ca, benefice };
  };

  const totals = filieres.reduce(
    (acc, f, i) => {
      [0, 1, 2].forEach((y) => {
        const d = getYearData(f, i, y);
        acc.ca += d.ca;
        acc.depenses += d.depenses;
        acc.benefice += d.benefice;
      });
      return acc;
    },
    { ca: 0, depenses: 0, benefice: 0 }
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

        <p style={styles.text}>
          Fanombanana siantifika ny Taniketsa: fananantany, fiofanana,
          ezaka sy anjara biriky, tohana ilaina, ary fanadihadiana ara-toekarena
          mandritra ny 3 taona.
        </p>

        <div style={styles.scoreBox}>
          <strong>Total CA prévisionnel 3 taona : </strong>
          {totals.ca.toLocaleString()} Ar
          <br />
          <strong>Total dépenses 3 taona : </strong>
          {totals.depenses.toLocaleString()} Ar
          <br />
          <strong>Bénéfice prévisionnel 3 taona : </strong>
          {totals.benefice.toLocaleString()} Ar
          <br />
          <strong>Total Score Taniketsa rehetra : </strong>
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

              <p style={styles.text}>{f.note}</p>

              {[0, 1, 2].map((year) => {
                const d = getYearData(f, i, year);

                return (
                  <div key={year} style={styles.miniBox}>
                    <h4>Taona {year + 1}</h4>

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

                    {f.name === "Tantely" && (
                      <>
                        <input
                          style={styles.input}
                          type="number"
                          placeholder="Litres tantely vinavinaina"
                          onChange={(e) =>
                            updateCustomProd(i, year, Number(e.target.value))
                          }
                        />

                        <input
                          style={styles.input}
                          type="number"
                          placeholder="Dépenses vinavinaina"
                          onChange={(e) =>
                            updateCustomDep(i, year, Number(e.target.value))
                          }
                        />
                      </>
                    )}

                    <strong>Production calculée : </strong>
                    {d.production.toLocaleString()} {f.productionUnit}
                    <br />
                    <strong>CA calculé : </strong>
                    {d.ca.toLocaleString()} Ar
                    <br />
                    <strong>Dépenses calculées : </strong>
                    {d.depenses.toLocaleString()} Ar
                    <br />
                    <strong>Bénéfice calculé : </strong>
                    {d.benefice.toLocaleString()} Ar
                  </div>
                );
              })}

              <h4 style={styles.sectionTitle}>
                A. Fananantany — 5 points
              </h4>
              <textarea
                style={styles.textarea}
                placeholder="An’iza ny tany hampiasainao ? Fanananao manokana ve, an’ny ray aman-dreny, hofaina, sa hafa ? Firy ny refiny ?"
              />
              <ScoreSelect
                label="Score fananantany"
                max={5}
                onChange={(v: number) => updateScore(i, "tany", v)}
              />

              <h4 style={styles.sectionTitle}>
                B. Fiofanana — 15 points
              </h4>
              <textarea
                style={styles.textarea}
                placeholder="Efa nahazo fiofanana manokana ve ianao ? Hazavao fohy ny votoatin’ny fiofanana sy ny zavatra hainao ampiharina."
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
                placeholder="Sorito mazava ny ezaka efa nataonao sy mbola hataonao: tany, fitaovana, asa tanana, vola, akora, sary, taratasy fanekena, fanomanana."
              />
              <ScoreSelect
                label="Score ezaka sy anjara biriky"
                max={20}
                onChange={(v: number) => updateScore(i, "ezaka", v)}
              />

              <h4 style={styles.sectionTitle}>
                D. Tohana ilaina — 5 points
              </h4>
              <textarea
                style={styles.textarea}
                placeholder="Inona no tohana tena ilainao ? Tokony ho zavatra tsy vitanao irery intsony, ary mifameno amin’ny ezaka efa nataonao."
              />
              <ScoreSelect
                label="Score tohana ilaina"
                max={5}
                onChange={(v: number) => updateScore(i, "tohana", v)}
              />

              <h4 style={styles.sectionTitle}>
                E. Fanadihadiana ara-toekarena sy ara-bola — 10 points
              </h4>
              <textarea
                style={styles.textarea}
                placeholder="Hazavao raha azo tanterahina tsara mandritra ny 3 taona ilay tetikasa, mifanaraka amin’ny tany, fiofanana, ezaka, tohana, dépenses, CA ary bénéfice."
              />
              <ScoreSelect
                label="Score faisabilité économique"
                max={10}
                onChange={(v: number) => updateScore(i, "economie", v)}
              />

              <h2 style={styles.score}>
                Score {f.name} : {scoreFiliere} / 55
              </h2>
            </div>
          );
        })}

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
          <button style={styles.button}>Vita</button>
        </div>
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
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
      >
        <option value={0}>Safidio</option>

        {Array.from(
          { length: max },
          (_, i) => max - i
        ).map((v) => (
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
