export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #064e3b, #f8fafc)",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#047857", fontSize: "44px", marginBottom: 8 }}>
            TOMBANA TANORA MAZAVA L1
          </h1>

          <h2 style={{ color: "#b91c1c", fontSize: "30px", marginTop: 0 }}>
            TOMBANA FANOMBOHANA VTI
          </h2>

          <p style={{ fontSize: "19px", lineHeight: 1.7, marginTop: "28px" }}>
            Rafitra siantifika sy nomerika ho fanaraha-maso ny fanovàna
            ara-panahy, ara-tsosialy, ara-toekarena ary ara-piarahamonina
            eny anivon’ny Tanora sy ny VTI.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <Card title="Tombana Isam-batan’olona" color="#047857" />
          <Card title="Tombana Iombonana VTI" color="#b91c1c" />
          <Card title="Dashboard" color="#064e3b" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          <Stat title="Tanora voatombana" value="254" />
          <Stat title="VTI voasoratra" value="18" />
          <Stat title="Fokontany" value="07" />
          <Stat title="Kaomina" value="02" />
          <Stat title="Taniketsa velona" value="143" />
        </div>
      </section>
    </main>
  );
}

function Card({ title, color }: { title: string; color: string }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "28px",
        borderRadius: "22px",
        fontWeight: "bold",
        fontSize: "18px",
        textAlign: "center",
      }}
    >
      {title}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "18px",
        padding: "22px",
        textAlign: "center",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#334155" }}>
        {title}
      </div>
      <div style={{ fontSize: "34px", fontWeight: "bold", color: "#047857" }}>
        {value}
      </div>
    </div>
  );
}
