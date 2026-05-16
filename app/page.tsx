export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            color: "#008000",
            textAlign: "center",
          }}
        >
          TOMBANA TANORA MAZAVA L1
        </h1>

        <h2
          style={{
            fontSize: "28px",
            color: "#cc0000",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          TOMBANA FANOMBOHANA VTI
        </h2>

        <p
          style={{
            marginTop: "40px",
            fontSize: "20px",
            lineHeight: "1.8",
            textAlign: "center",
          }}
        >
          Tongasoa eto amin’ny plateforme numérique
          fanombanana sy fanaraha-maso
          Tanora Mazava L1.
        </p>
      </div>
    </main>
  );
}
