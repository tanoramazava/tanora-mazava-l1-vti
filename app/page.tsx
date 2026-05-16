function EconomieForm({ onBack }: { onBack: () => void }) {
  const [production, setProduction] = useState(0);
  const [depenses, setDepenses] = useState(0);
  const [autoconsommation, setAutoconsommation] = useState(0);
  const [quantiteVendue, setQuantiteVendue] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);

  const revenu = quantiteVendue * prixUnitaire;
  const benefice = revenu - depenses;

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Fizarana 3 — Fanadihadiana Ara-toekarena sy Ara-bola</h1>
        <p style={styles.text}>Ny 03 taona farany — Totalibeny : 48 points</p>

        <div style={styles.scoreBox}>
          <strong>Revenu automatique : </strong>
          {revenu.toLocaleString()} Ar
          <br />
          <strong>Bénéfice estimé : </strong>
          {benefice.toLocaleString()} Ar
        </div>

        <div style={styles.grid}>
          <Input label="Anaran’ny seha-pihariana voalohany" />

          <label style={styles.label}>
            Production isan-taona
            <input
              style={styles.input}
              type="number"
              onChange={(e) => setProduction(Number(e.target.value))}
              placeholder="Ohatra : 500"
            />
          </label>

          <label style={styles.label}>
            Dépenses annuelles
            <input
              style={styles.input}
              type="number"
              onChange={(e) => setDepenses(Number(e.target.value))}
              placeholder="Ariary"
            />
          </label>

          <label style={styles.label}>
            Autoconsommation
            <input
              style={styles.input}
              type="number"
              onChange={(e) => setAutoconsommation(Number(e.target.value))}
              placeholder="Quantité"
            />
          </label>

          <label style={styles.label}>
            Quantité vendue
            <input
              style={styles.input}
              type="number"
              onChange={(e) => setQuantiteVendue(Number(e.target.value))}
              placeholder="Quantité vendue"
            />
          </label>

          <label style={styles.label}>
            Prix unitaire
            <input
              style={styles.input}
              type="number"
              onChange={(e) => setPrixUnitaire(Number(e.target.value))}
              placeholder="Ar / unité"
            />
          </label>
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
          <button style={styles.button}>
            Manaraka
          </button>
        </div>
      </section>
    </main>
  );
}
