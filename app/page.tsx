function TaniketsaForm({ onBack }: any) {
  const filieres = [
    {
      name: "Voly rakotra 500m²",
      unitLabel: "Parcelle 500m² firy ao anatin’ny 3 taona ?",
      caRef: 1753600,
      depRef: 340000,
    },
    {
      name: "Voly vary 750m²",
      unitLabel: "Parcelle 750m² firy ao anatin’ny 3 taona ?",
      caRef: 600000,
      depRef: 350000,
    },
    {
      name: "Akoho gasy",
      unitLabel: "Tokatranon’akoho firy ao anatin’ny 3 taona ?",
      caRef: 1296000,
      depRef: 420000,
    },
    {
      name: "Fanatavezana kisoa",
      unitLabel: "Kisoa hatavezina firy ao anatin’ny 3 taona ?",
      caRef: 640000,
      depRef: 387500,
    },
    {
      name: "Tantely",
      unitLabel: "Tohon-tantely firy ao anatin’ny 3 taona ?",
      caRef: 1500000,
      depRef: 420000,
    },
  ];

  const [units, setUnits] = useState<number[]>(Array(5).fill(0));
  const [humanScores, setHumanScores] = useState<number[]>(Array(5).fill(0));
  const [ecoScores, setEcoScores] = useState<number[]>(Array(5).fill(0));

  const updateUnits = (index: number, value: number) => {
    const copy = [...units];
    copy[index] = value;
    setUnits(copy);
  };

  const updateHumanScore = (index: number, value: number) => {
    const copy = [...humanScores];
    copy[index] = value;
    setHumanScores(copy);
  };

  const updateEcoScore = (index: number, value: number) => {
    const copy = [...ecoScores];
    copy[index] = value;
    setEcoScores(copy);
  };

  const totalCA = filieres.reduce(
    (sum, f, i) => sum + units[i] * f.caRef,
    0
  );

  const totalDepenses = filieres.reduce(
    (sum, f, i) => sum + units[i] * f.depRef,
    0
  );

  const totalBenefice = totalCA - totalDepenses;

  const totalScore = humanScores.reduce((s, v) => s + v, 0) +
    ecoScores.reduce((s, v) => s + v, 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Taniketsa Fandraharahana</h1>

        <p style={styles.text}>
          Fanombanana siantifika ny Taniketsa Fandraharahana mifototra amin’ny
          fiofanana, ezaka, anjara biriky, faisabilité, ary calcul automatique
          ny chiffre d’affaires, dépenses ary bénéfices ao anatin’ny 3 taona.
        </p>

        <div style={styles.scoreBox}>
          <strong>Total CA prévisionnel :</strong>{" "}
          {totalCA.toLocaleString()} Ar
          <br />
          <strong>Total dépenses prévisionnelles :</strong>{" "}
          {totalDepenses.toLocaleString()} Ar
          <br />
          <strong>Bénéfice prévisionnel :</strong>{" "}
          {totalBenefice.toLocaleString()} Ar
          <br />
          <strong>Total Score Taniketsa :</strong>{" "}
          {totalScore} / 275
        </div>

        {filieres.map((f, index) => {
          const ca = units[index] * f.caRef;
          const depenses = units[index] * f.depRef;
          const benefice = ca - depenses;
          const scoreFiliere = humanScores[index] + ecoScores[index];

          return (
            <div key={f.name} style={styles.block}>
              <h3 style={styles.sectionTitle}>
                {index + 1}. {f.name}
              </h3>

              <label style={styles.label}>{f.unitLabel}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="Soraty eto ny isa..."
                onChange={(e) =>
                  updateUnits(index, Number(e.target.value))
                }
              />

              <div style={styles.miniBox}>
                <strong>CA référence par unité :</strong>{" "}
                {f.caRef.toLocaleString()} Ar
                <br />
                <strong>Dépenses référence par unité :</strong>{" "}
                {f.depRef.toLocaleString()} Ar
                <br />
                <strong>CA calculé :</strong>{" "}
                {ca.toLocaleString()} Ar
                <br />
                <strong>Dépenses calculées :</strong>{" "}
                {depenses.toLocaleString()} Ar
                <br />
                <strong>Bénéfice calculé :</strong>{" "}
                {benefice.toLocaleString()} Ar
              </div>

              <h4 style={styles.sectionTitle}>
                A. Fiofanana, ezaka ary anjara biriky — 35 points
              </h4>

              <textarea
                style={styles.textarea}
                placeholder="Hazavao ny fiofanana efa azo, ny traikefa, ny ezaka natao, ny anjara biriky manokana, ny fananantany na fitaovana, ary ny fahavononana hanohy..."
              />

              <ScoreSelect
                label="Score fiofanana + ezaka + anjara biriky + faisabilité humaine/technique"
                max={35}
                onChange={(v: number) => updateHumanScore(index, v)}
              />

              <h4 style={styles.sectionTitle}>
                B. Faisabilité économique sy rentabilité — 20 points
              </h4>

              <textarea
                style={styles.textarea}
                placeholder="Hazavao ny antony mahatonga ity Taniketsa ity ho azo tanterahina ara-toekarena : tsena, vidiny, fandaniana, tombony, fitohizan’ny asa..."
              />

              <ScoreSelect
                label="Score faisabilité économique + rentabilité + projection"
                max={20}
                onChange={(v: number) => updateEcoScore(index, v)}
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
