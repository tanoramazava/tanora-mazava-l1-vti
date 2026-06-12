"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
function DashboardAnalytique({ onBack }: any) {
  const [loading, setLoading] = useState(false);

  const [tanora, setTanora] = useState<any[]>([]);
  const [vti, setVti] = useState<any[]>([]);
  const [spirituel, setSpirituel] = useState<any[]>([]);
  const [repVti, setRepVti] = useState<any[]>([]);
  const [unites, setUnites] = useState<any[]>([]);
  const [eco, setEco] = useState<any[]>([]);
  const [repTaniketsa, setRepTaniketsa] = useState<any[]>([]);

  const [vtiArap, setVtiArap] = useState<any[]>([]);
  const [vtiToek, setVtiToek] = useState<any[]>([]);
  const [vtiFahas, setVtiFahas] = useState<any[]>([]);
  const [vtiEtika, setVtiEtika] = useState<any[]>([]);
  // ===============================
// SEGMENTATION VTI / FO-MIRAY
// ===============================

const tanoraVTI = tanora.filter(
  (t) => Number(t.taona || 0) <= 35
);

const vehivavyFOMIRAY = tanora.filter(
  (t) =>
    Number(t.taona || 0) > 35 &&
    String(t.sexe || "").toLowerCase().includes("vavy")
);

const loholonaFOMIRAY = tanora.filter(
  (t) =>
    Number(t.taona || 0) > 35 &&
    String(t.sexe || "").toLowerCase().includes("lahy")
);

// Statistiques rapides

const nbTanoraVTI = tanoraVTI.length;
const nbVehivavyFOMIRAY = vehivavyFOMIRAY.length;
const nbLoholonaFOMIRAY = loholonaFOMIRAY.length;

  const money = (v: any) => Number(v || 0).toLocaleString("fr-FR") + " Ar";
  const txt = (v: any) => String(v || "").toLowerCase();

  const total = (rows: any[], field: string) =>
    rows.reduce((s, r) => s + Number(r[field] || 0), 0);

  const latestByKey = (rows: any[], key: string) => {
    const map = new Map();

    rows.forEach((r) => {
      const k = r[key];
      if (!k) return;

      const old = map.get(k);
      if (!old || Number(r.id || 0) > Number(old.id || 0)) {
        map.set(k, r);
      }
    });

    return Array.from(map.values());
  };

  const latestByTanoraId = (rows: any[]) => latestByKey(rows, "tanora_id");
  const latestByVtiId = (rows: any[]) => latestByKey(rows, "vti_id");

  const latestByTanoraAndFiliere = (rows: any[]) => {
    const map = new Map();

    rows.forEach((r) => {
      const tanoraId = r.tanora_id;
      const type = r.type_taniketsa;

      if (!tanoraId || !type) return;

      const key = `${tanoraId}_${type}`;
      const old = map.get(key);

      if (!old || Number(r.id || 0) > Number(old.id || 0)) {
        map.set(key, r);
      }
    });

    return Array.from(map.values());
  };

  const countTheme = (rows: any[], field: string, keys: string[]) =>
    rows.filter((r) => keys.some((k) => txt(r[field]).includes(k))).length;

  const extractTexts = (rows: any[], field: string) =>
    rows.map((r) => r[field]).filter(Boolean);

  const countPriority = (rows: any[], field: string, keys: string[]) =>
    rows.filter((r) => keys.some((k) => txt(r[field]).includes(k))).length;

  const priorityLine = (
    label: string,
    rows: any[],
    field: string,
    keys: string[]
  ) => (
    <p>
      <strong>{label} :</strong> {countPriority(rows, field, keys)}
    </p>
  );
  const syntheseAutomatique = (
  titre: string,
  rows: any[],
  field: string,
  themes: { label: string; keys: string[]; conseil?: string }[]
) => {
  const totalReponses = rows.filter((r) => String(r[field] || "").trim()).length;

  const resultats = themes
    .map((theme) => ({
      ...theme,
      count: countPriority(rows, field, theme.keys),
    }))
    .filter((theme) => theme.count > 0)
    .sort((a, b) => b.count - a.count);

  if (totalReponses === 0) {
    return (
      <div style={styles.miniBox}>
        <h4>{titre}</h4>
        <p>Aucune réponse détaillée enregistrée pour le moment.</p>
      </div>
    );
  }

  if (resultats.length === 0) {
    return (
      <div style={styles.miniBox}>
        <h4>{titre}</h4>
        <p>
          Les réponses existent, mais elles ne correspondent pas encore clairement
          aux références prévues. Elles doivent être analysées comme valiny hafa /
          cas particuliers.
        </p>
      </div>
    );
  }

  const priorite1 = resultats[0];

  return (
    <div style={styles.miniBox}>
      <h4>{titre}</h4>

      <p>
        <strong>Nombre de fiches analysées :</strong> {totalReponses}
      </p>

      <p>
        <strong>Priorité principale :</strong> {priorite1.label}{" "}
        ({priorite1.count} réponse(s)).
      </p>

      <p>
        <strong>Synthèse :</strong> D’après les réponses détaillées enregistrées,
        le thème le plus récurrent est <strong>{priorite1.label}</strong>. Il
        doit être considéré comme une priorité d’intervention ou de décision.
      </p>

      {priorite1.conseil && (
        <p>
          <strong>Orientation proposée :</strong> {priorite1.conseil}
        </p>
      )}

      <h5>Classement automatique des thèmes</h5>
      {resultats.map((r, i) => (
        <p key={`${field}-${r.label}`}>
          <strong>Priorité {i + 1} :</strong> {r.label} — {r.count} réponse(s)
        </p>
      ))}
    </div>
  );
};

  const otherResponses = (rows: any[], field: string, knownKeys: string[]) =>
    rows
      .map((r) => String(r[field] || ""))
      .filter((v) => v && !knownKeys.some((k) => txt(v).includes(k)));

  const parseSurfaceNumber = (raw: string) => {
    const value = String(raw || "").trim().toLowerCase();

    if (value.includes("/")) {
      const [a, b] = value.split("/").map((x) => Number(x.trim()));
      if (!isNaN(a) && !isNaN(b) && b !== 0) {
        return a / b;
      }
    }

    const cleaned = value
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return Number(cleaned);
  };

  const extractSurfacesM2 = (texts: string[]) =>
    texts
      .flatMap((text) => {
        const t = String(text || "").toLowerCase();
        const results: number[] = [];

        const haMatches = t.matchAll(
          /(\d+\/\d+|\d[\d\s.,]*)\s*(ha|hectare|hektara|hekitara)/g
        );

        for (const m of haMatches) {
          const value = parseSurfaceNumber(m[1]);
          if (!isNaN(value)) {
            results.push(value * 10000);
          }
        }

        const m2Matches = t.matchAll(
          /(\d[\d\s.,]*)\s*(m2|m²|metatra toradroa)/g
        );

        for (const m of m2Matches) {
          const value = parseSurfaceNumber(m[1]);
          if (!isNaN(value)) {
            results.push(value);
          }
        }

        return results;
      })
      .filter((n) => !isNaN(n) && n > 0);

  const surfaceStats = (texts: string[]) => {
    const nums = extractSurfacesM2(texts);

    if (nums.length === 0) {
      return {
        min: 0,
        max: 0,
        total: 0,
        avg: 0,
      };
    }

    const totalSurface = nums.reduce((a, b) => a + b, 0);
    const nombreJeunes = texts.length || 1;

    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
      total: totalSurface,
      avg: Math.round(totalSurface / nombreJeunes),
    };
  };

  const surfaceLabel = (m2: number) => {
    if (!m2) return "—";
    return `${m2.toLocaleString("fr-FR")} m²`;
  };
  const thematicSummary = (title: string, texts: string[]) => {
    const themes = [
      { label: "Manana tany / tany azo ampiasaina", keys: ["manana tany", "taniko", "ahy", "tany misy"] },
      { label: "Tanin’ny ray aman-dreny / fianakaviana", keys: ["ray aman-dreny", "fianakaviana", "lova", "havana"] },
      { label: "Tsy manana tany / mila tany", keys: ["tsy manana", "mila tany", "tsy misy tany"] },
      { label: "Misy taratasy ara-dalàna", keys: ["titre", "certificat", "voasoratra", "ara-dalàna"] },
      { label: "Tsy mbola misy taratasy", keys: ["tsy misy taratasy", "tsy voasoratra", "mbola tsy"] },
      { label: "Mila fiofanana", keys: ["mila fiofanana", "tsy mbola niofana", "fanofanana"] },
      { label: "Efa nahazo fiofanana", keys: ["efa niofana", "nahazo fiofanana", "mahafehy"] },
      { label: "Mila renivola / financement", keys: ["renivola", "vola", "financement", "tosika"] },
      { label: "Mila fitaovana / akora", keys: ["fitaovana", "akora", "masomboly", "zezika"] },
      { label: "Mila tsena / lalambarotra", keys: ["tsena", "lalambarotra", "varotra"] },
      { label: "Mila fanaraha-maso teknika", keys: ["fanaraha-maso", "teknika", "encadrement"] },
      { label: "Mila gestion / comptabilité", keys: ["gestion", "bokim-bola", "dépenses", "tombom-barotra", "comptabilité"] },
    ];

    const found = themes
      .map((t) => ({
        label: t.label,
        count: texts.filter((x) => t.keys.some((k) => txt(x).includes(k))).length,
      }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);

    return (
      <div style={styles.miniBox}>
        <h4>{title}</h4>
        <p><strong>Isan’ny valiny voaray :</strong> {texts.length}</p>

        {found.length === 0 && (
          <p>Tsy mbola ampy ny valiny hanaovana regroupement thématique.</p>
        )}

        {found.map((f) => (
          <p key={f.label}>
            <strong>{f.label} :</strong> {f.count}
          </p>
        ))}

        {texts.length > 0 && (
          <p>
            <strong>Synthèse intelligente :</strong>{" "}
            {found.length > 0
              ? `Lohahevitra miverimberina indrindra: ${found[0].label}. Ity no tokony hodinihina ho laharam-pahamehana amin’ny fanapahan-kevitra.`
              : "Mbola mila valiny maromaro kokoa vao afaka mamoaka fehin-kevitra matanjaka."}
          </p>
        )}
      </div>
    );
  };

  const chargerDashboard = async () => {
    setLoading(true);

    const { data: tanoraData } = await supabase.from("tanora").select("*");
    const { data: vtiData } = await supabase.from("vti").select("*");
    const { data: spirituelData } = await supabase.from("reponses_spirituel").select("*");
    const { data: repVtiData } = await supabase.from("reponses_vti").select("*");
    const { data: unitesData } = await supabase.from("taniketsa_unites").select("*");
    const { data: ecoData } = await supabase.from("economies_taniketsa").select("*");
    const { data: repTanData } = await supabase.from("reponses_taniketsa_detaillees").select("*");

    const { data: arapData } = await supabase.from("vti_vaomiera_arapanahy_fanabeazana").select("*");
    const { data: toekData } = await supabase.from("vti_vaomiera_fandraharahana_toekarena").select("*");
    const { data: fahasData } = await supabase.from("vti_vaomiera_fahasalamana_fiarovana").select("*");
    const { data: etikaData } = await supabase.from("vti_vaomiera_etika_fampandrosoana").select("*");

    setTanora(tanoraData || []);
    setVti(vtiData || []);

    setSpirituel(latestByTanoraId(spirituelData || []));
    setRepVti(latestByTanoraId(repVtiData || []));
    setUnites(latestByTanoraAndFiliere(unitesData || []));
    setEco(latestByTanoraId(ecoData || []));
    setRepTaniketsa(latestByTanoraId(repTanData || []));

    setVtiArap(latestByVtiId(arapData || []));
    setVtiToek(latestByVtiId(toekData || []));
    setVtiFahas(latestByVtiId(fahasData || []));
    setVtiEtika(latestByVtiId(etikaData || []));

    setLoading(false);
  };

  const age18 = tanora.filter((t) => Number(t.taona) <= 18).length;
  const age19_24 = tanora.filter((t) => Number(t.taona) >= 19 && Number(t.taona) <= 24).length;
  const age25_35 = tanora.filter((t) => Number(t.taona) >= 25 && Number(t.taona) <= 35).length;
  const age35plus = tanora.filter((t) => Number(t.taona) > 35).length;

  const filieres = [
    {
      type: "voly",
      name: "Voly rakotra 500m²",
      ca: "ca_voly_rakotra",
      dep: "depenses_voly_rakotra",
      ben: "benefice_voly_rakotra",
    },
    {
      type: "vary",
      name: "Voly vary 750m²",
      ca: "ca_vary",
      dep: "depenses_vary",
      ben: "benefice_vary",
    },
    {
      type: "akoho",
      name: "Akoho gasy",
      ca: "ca_akoho_gasy",
      dep: "depenses_akoho_gasy",
      ben: "benefice_akoho_gasy",
    },
    {
      type: "kisoa",
      name: "Fanatavezana kisoa",
      ca: "ca_kisoa",
      dep: "depenses_kisoa",
      ben: "benefice_kisoa",
    },
    {
      type: "tantely",
      name: "Fiompiana tantely",
      ca: "ca_tantely",
      dep: "depenses_tantely",
      ben: "benefice_tantely",
    },
  ];

  const getEcoByTanora = (tanoraId: any) =>
    eco.find((e) => Number(e.tanora_id) === Number(tanoraId));

  const getUnitsByTanoraAndType = (tanoraId: any, type: string) =>
    unites.find(
      (u) =>
        Number(u.tanora_id) === Number(tanoraId) &&
        String(u.type_taniketsa || "") === type
    );

  const getFiliereRows = (f: any) => {
  const ids = new Set<number>();

  eco.forEach((e) => {
    if (
      Number(e[f.ca] || 0) !== 0 ||
      Number(e[f.dep] || 0) !== 0 ||
      Number(e[f.ben] || 0) !== 0
    ) {
      ids.add(Number(e.tanora_id));
    }
  });

  unites
    .filter((u) => u.type_taniketsa === f.type)
    .forEach((u) => ids.add(Number(u.tanora_id)));

  return Array.from(ids).map((tanoraId) => {
    const unit = getUnitsByTanoraAndType(tanoraId, f.type);
    const ecoRow = getEcoByTanora(tanoraId);

    const caEco = Number(ecoRow?.[f.ca] || 0);
    const depEco = Number(ecoRow?.[f.dep] || 0);
    const benEco = Number(ecoRow?.[f.ben] || 0);

    const caFromUnits =
      Number(unit?.ca_annee_1 || 0) +
      Number(unit?.ca_annee_2 || 0) +
      Number(unit?.ca_annee_3 || 0);

    const depFromUnits =
      Number(unit?.depenses_annee_1 || 0) +
      Number(unit?.depenses_annee_2 || 0) +
      Number(unit?.depenses_annee_3 || 0);

    const benFromUnits =
      Number(unit?.benefice_annee_1 || 0) +
      Number(unit?.benefice_annee_2 || 0) +
      Number(unit?.benefice_annee_3 || 0);

    let u1 = Number(unit?.unite_annee_1 || 0);
    let u2 = Number(unit?.unite_annee_2 || 0);
    let u3 = Number(unit?.unite_annee_3 || 0);

    if ((!u1 && !u2 && !u3) && caEco > 0) {
      if (f.type === "akoho") {
        const caParTokatrano3Ans = 82560000;
        const initial = Math.round(caEco / caParTokatrano3Ans);

        u1 = initial;
        u2 = initial * 6;
        u3 = initial * 36;
      }

      if (f.type === "voly") {
        u1 = Math.round(caEco / (754800 + 876800 + 876800));
        u2 = u1;
        u3 = u1;
      }

      if (f.type === "vary") {
        u1 = Math.round(caEco / (450000 + 600000 + 600000));
        u2 = u1;
        u3 = u1;
      }

      if (f.type === "kisoa") {
        u1 = Math.round(caEco / (1400000 * 3));
        u2 = u1;
        u3 = u1;
      }

      if (f.type === "tantely") {
        u1 = Math.round(caEco / (378000 * 3));
        u2 = u1;
        u3 = u1;
      }
    }

    return {
      tanora_id: tanoraId,
      unite_annee_1: u1,
      unite_annee_2: u2,
      unite_annee_3: u3,
      ca_total: caFromUnits || caEco,
      dep_total: depFromUnits || depEco,
      ben_total: benFromUnits || benEco,
    };
  });
};

  const allFiliereRows = filieres.flatMap((f) => getFiliereRows(f));

  const caGlobal = allFiliereRows.reduce((s, r) => s + Number(r.ca_total || 0), 0);
  const depensesGlobal = allFiliereRows.reduce((s, r) => s + Number(r.dep_total || 0), 0);
  const beneficeGlobal = allFiliereRows.reduce((s, r) => s + Number(r.ben_total || 0), 0);

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Dashboard Analytique Tanora Mazava L1 — V5</h1>

        <div style={styles.actions}>
          <button style={styles.button} onClick={chargerDashboard}>
            Charger / Actualiser Dashboard
          </button>
          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>

        {loading && <p>Chargement...</p>}

        <hr />

        <h2>1. Dashboard Général</h2>
        <div style={styles.scoreBox}>
          <p><strong>Tanora voasoratra :</strong> {tanora.length}</p>
          <p><strong>VTI voasoratra :</strong> {vti.length}</p>
          <p><strong>Lahy :</strong> {countTheme(tanora, "sexe", ["lahy"])}</p>
          <p><strong>Vavy :</strong> {countTheme(tanora, "sexe", ["vavy"])}</p>
          <p><strong>18 taona midina :</strong> {age18}</p>
          <p><strong>19–24 taona :</strong> {age19_24}</p>
          <p><strong>25–35 taona :</strong> {age25_35}</p>
          <p><strong>Mihoatra ny 35 taona :</strong> {age35plus}</p>
          <p><strong>Ambanivohitra :</strong> {countTheme(tanora, "type_kaomina", ["ambanivohitra"])}</p>
          <p><strong>Andrenivohitra :</strong> {countTheme(tanora, "type_kaomina", ["andrenivohitra"])}</p>
        </div>

        <hr />

        <h2>2. Dashboard Ara-panahy Tanora — Informations qualitatives</h2>
        <div style={styles.miniBox}>
          <p><strong>Fiches ara-panahy finales raisina :</strong> {spirituel.length}</p>

          <h3>Vavaka Betela</h3>
          <p><strong>Isan’andro :</strong> {countTheme(spirituel, "spirituel_q3", ["isan’andro", "isanandro"])}</p>
          <p><strong>In-3 isan-kerinandro :</strong> {countTheme(spirituel, "spirituel_q3", ["in-3", "intelo"])}</p>
          <p><strong>In-1 isan-kerinandro :</strong> {countTheme(spirituel, "spirituel_q3", ["in-1", "indray"])}</p>
          <p><strong>Mbola tsy nanomboka :</strong> {countTheme(spirituel, "spirituel_q3", ["mbola tsy", "tsy nanomboka"])}</p>

          <h3>Pratika ara-panahy — qualité des réponses</h3>
          <p><strong>Fibebahana sy fiderana mahafapo :</strong> {countTheme(spirituel, "spirituel_q4", ["mahafapo", "mazava", "voafehy", "tsara"])}</p>
          <p><strong>Fanaka dimy / Soatoavina mahafapo :</strong> {countTheme(spirituel, "spirituel_q5", ["mahafapo", "mazava", "voafehy", "tsara"])}</p>
          <p><strong>Fandroahana demonia mahafapo :</strong> {countTheme(spirituel, "spirituel_q6", ["mahafapo", "mazava", "voafehy", "tsara"])}</p>
          <p><strong>Vavaka mamindra tendrombohitra mahafapo :</strong> {countTheme(spirituel, "spirituel_q7", ["mahafapo", "mazava", "voafehy", "tsara"])}</p>
        </div>

        {thematicSummary("Synthèse ara-panahy — regroupement des réponses", [
          ...extractTexts(spirituel, "spirituel_q4"),
          ...extractTexts(spirituel, "spirituel_q5"),
          ...extractTexts(spirituel, "spirituel_q6"),
          ...extractTexts(spirituel, "spirituel_q7"),
        ])}

        <hr />

        <h2>3. Dashboard Engagement VTI Tanora — Informations qualitatives</h2>
        <div style={styles.miniBox}>
          <p><strong>Fiches VTI Tanora finales raisina :</strong> {repVti.length}</p>
          <p><strong>Efa nikambana fikambanana taloha :</strong> {countTheme(repVti, "vti_q1", ["eny", "efa"])}</p>
          <p><strong>Mahafantatra mazava ny VTI :</strong> {countTheme(repVti, "vti_q2", ["mazava", "tsara"])}</p>
          <p><strong>Mandray andraikitra mavitrika :</strong> {countTheme(repVti, "vti_q3", ["mavitrika", "mandray", "eny"])}</p>
          <p><strong>Manana anjara biriky :</strong> {countTheme(repVti, "vti_q4", ["eny", "manana"])}</p>
          <p><strong>Mahafantatra Vaomiera misy azy :</strong> {countTheme(repVti, "vti_q5", ["ara-panahy", "toekarena", "fahasalamana", "etika"])}</p>
        </div>

        {thematicSummary("Synthèse engagement VTI — regroupement des réponses", [
          ...extractTexts(repVti, "vti_q1"),
          ...extractTexts(repVti, "vti_q2"),
          ...extractTexts(repVti, "vti_q3"),
          ...extractTexts(repVti, "vti_q4"),
          ...extractTexts(repVti, "vti_q5"),
        ])}

        <hr />

        <h2>4. Dashboard Taniketsa Fandraharahana — Données économiques corrigées</h2>

        {filieres.map((f) => {
          const rows = getFiliereRows(f);

          return (
            <div key={f.type} style={styles.miniBox}>
              <h3>{f.name}</h3>
              <p><strong>Tanora concernés :</strong> {rows.length}</p>
              <p><strong>Unités Taona 1 :</strong> {total(rows, "unite_annee_1")}</p>
              <p><strong>Unités Taona 2 :</strong> {total(rows, "unite_annee_2")}</p>
              <p><strong>Unités Taona 3 :</strong> {total(rows, "unite_annee_3")}</p>
              <p><strong>CA total 3 ans :</strong> {money(total(rows, "ca_total"))}</p>
              <p><strong>Dépenses totales 3 ans :</strong> {money(total(rows, "dep_total"))}</p>
              <p><strong>Bénéfice total 3 ans :</strong> {money(total(rows, "ben_total"))}</p>
            </div>
          );
        })}

        <div style={styles.scoreBox}>
          <h3>Synthèse économique globale 3 ans</h3>
          <p><strong>CA total global :</strong> {money(caGlobal)}</p>
          <p><strong>Dépenses totales globales :</strong> {money(depensesGlobal)}</p>
          <p><strong>Bénéfice total global :</strong> {money(beneficeGlobal)}</p>
          <p>
            <strong>Base de calcul :</strong> dernières données par ID Tanora et par filière, avec récupération complémentaire depuis economies_taniketsa si taniketsa_unites est incomplet.
          </p>
        </div>

        <hr />

   <h2>5. Analyse économique qualitative par filière</h2>

{[
  ["Voly rakotra", "voly_rakotra"],
  ["Vary", "vary"],
  ["Akoho gasy", "akoho_gasy"],
  ["Kisoa", "kisoa"],
  ["Tantely", "tantely"],
].map(([label, key]) => (
  <div key={key} style={styles.miniBox}>
    <h3>{label}</h3>

    <h4>Fananantany</h4>

    {(() => {
      const fananantanyTexts = extractTexts(repTaniketsa, `${key}_fananantany`);
      const stats = surfaceStats(fananantanyTexts);

      return (
        <>
          {fananantanyTexts.map((v, i) => (
            <p key={`${key}-fan-${i}`}>{v}</p>
          ))}

          <h5>Statistiques surface</h5>
          <p><strong>Refy ambany indrindra :</strong> {surfaceLabel(stats.min)}</p>
          <p><strong>Refy ambony indrindra :</strong> {surfaceLabel(stats.max)}</p>
          <p><strong>Surface totale :</strong> {surfaceLabel(stats.total)}</p>
          <p><strong>Surface moyenne par Tanora :</strong> {surfaceLabel(stats.avg)}</p>
        </>
      );
    })()}

    <h4>Fiofanana</h4>
    {extractTexts(repTaniketsa, `${key}_fiofanana`).map((v, i) => (
      <p key={`${key}-fio-${i}`}>{v}</p>
    ))}

    <h4>Anjara biriky</h4>
    {extractTexts(repTaniketsa, `${key}_ezaka`).map((v, i) => (
      <p key={`${key}-ez-${i}`}>{v}</p>
    ))}

    <h4>Tohana ilaina</h4>
    {extractTexts(repTaniketsa, `${key}_tohana`).map((v, i) => (
      <p key={`${key}-toh-${i}`}>{v}</p>
    ))}

    <h4>Diagnostic</h4>
    {extractTexts(repTaniketsa, `${key}_diagnostic`).map((v, i) => (
      <p key={`${key}-diag-${i}`}>{v}</p>
    ))}
  </div>
))}

<hr /> 
        <h2>5B. Dashboard Production & Valeur Ajoutée</h2>

{(() => {
  const sum = (rows: any[], field: string) =>
    rows.reduce((s, r) => s + Number(r[field] || 0), 0);

  const filieresProd = [
    {
      titre: "Voly rakotra",
      type: "voly",
      ca: "ca_voly_rakotra",
      dep: "depenses_voly_rakotra",
      ben: "benefice_voly_rakotra",
    },
    {
      titre: "Vary",
      type: "vary",
      ca: "ca_vary",
      dep: "depenses_vary",
      ben: "benefice_vary",
    },
    {
      titre: "Akoho gasy",
      type: "akoho",
      ca: "ca_akoho_gasy",
      dep: "depenses_akoho_gasy",
      ben: "benefice_akoho_gasy",
    },
    {
      titre: "Kisoa",
      type: "kisoa",
      ca: "ca_kisoa",
      dep: "depenses_kisoa",
      ben: "benefice_kisoa",
    },
    {
      titre: "Tantely",
      type: "tantely",
      ca: "ca_tantely",
      dep: "depenses_tantely",
      ben: "benefice_tantely",
    },
  ];

  return (
    <>
      {filieresProd.map((f) => {
        const rows = getFiliereRows(f);

        const u1 = sum(rows, "unite_annee_1");
        const u2 = sum(rows, "unite_annee_2");
        const u3 = sum(rows, "unite_annee_3");
        const uTotal = u1 + u2 + u3;

        return (
          <div key={f.type} style={styles.miniBox}>
            <h3>{f.titre}</h3>

            <p><strong>Isan’ny ID Tanora concernés :</strong> {rows.length}</p>

            <h4>Quantités par année</h4>
            <p><strong>Année 1 :</strong> {u1}</p>
            <p><strong>Année 2 :</strong> {u2}</p>
            <p><strong>Année 3 :</strong> {u3}</p>
            <p><strong>Total unités 3 ans :</strong> {uTotal}</p>

            {f.type === "voly" && (
              <>
                <h4>Production estimée Voly rakotra</h4>
                <p><strong>Katsaka :</strong> {uTotal * 120} kg / 3 ans</p>
                <p><strong>Tsaramaso :</strong> {uTotal * 60} kg / 3 ans</p>
                <p><strong>Voanjo :</strong> {uTotal * 50} kg / 3 ans</p>
                <p><strong>Anana / legioma :</strong> {uTotal * 80} kg / 3 ans</p>
              </>
            )}

            {f.type === "vary" && (
              <>
                <h4>Production estimée Vary</h4>
                <p><strong>Production totale :</strong> {uTotal * 300} kg / 3 ans</p>
                <p><strong>Production totale :</strong> {(uTotal * 300 / 1000).toLocaleString("fr-FR")} tonnes / 3 ans</p>
              </>
            )}

            {f.type === "akoho" && (
              <>
                <h4>Production estimée Akoho gasy</h4>
                <p><strong>Akoho velona Année 1 :</strong> {u1 * 160}</p>
                <p><strong>Akoho velona Année 2 :</strong> {u2 * 160}</p>
                <p><strong>Akoho velona Année 3 :</strong> {u3 * 160}</p>
                <p><strong>Total akoho velona 3 ans :</strong> {uTotal * 160}</p>
                <p><strong>Akoho amidy estimés :</strong> {(uTotal * 160 * 0.75).toLocaleString("fr-FR")}</p>
                <p><strong>Akoho tazonina fanitarana :</strong> {(uTotal * 160 * 0.25).toLocaleString("fr-FR")}</p>
              </>
            )}

            {f.type === "kisoa" && (
              <>
                <h4>Production estimée Kisoa</h4>
                <p><strong>Kisoa total 3 ans :</strong> {uTotal}</p>
                <p><strong>Lanja total :</strong> {uTotal * 80} kg / 3 ans</p>
                <p><strong>Lanja total :</strong> {(uTotal * 80 / 1000).toLocaleString("fr-FR")} tonnes / 3 ans</p>
              </>
            )}

            {f.type === "tantely" && (
              <>
                <h4>Production estimée Tantely</h4>
                <p><strong>Production Année 1 :</strong> {u1 * 7 * 6} litres</p>
                <p><strong>Production Année 2 :</strong> {u2 * 7 * 6} litres</p>
                <p><strong>Production Année 3 :</strong> {u3 * 7 * 6} litres</p>
                <p><strong>Total 3 ans :</strong> {uTotal * 7 * 6} litres</p>
              </>
            )}

            <h4>Valeur ajoutée économique</h4>
            <p><strong>CA total 3 ans :</strong> {money(sum(rows, "ca_total"))}</p>
            <p><strong>Dépenses totales 3 ans :</strong> {money(sum(rows, "dep_total"))}</p>
            <p><strong>Bénéfice total 3 ans :</strong> {money(sum(rows, "ben_total"))}</p>
          </div>
        );
      })}
    </>
  );
})()}

<hr />
        <h2>6. Dashboard Identité VTI</h2>

        {vti.map((v) => {
          const tanoraVti = tanora.filter((t) => Number(t.vti_id) === Number(v.id));

          return (
            <div key={v.id} style={styles.miniBox}>
              <h3>{v.nom_vti || "VTI sans nom"}</h3>
              <p><strong>ID VTI :</strong> {v.id}</p>
              <p><strong>Faritra :</strong> {v.faritra}</p>
              <p><strong>Distrika :</strong> {v.distrika}</p>
              <p><strong>Kaomina :</strong> {v.kaomina}</p>
              <p><strong>Type Kaomina :</strong> {v.type_kaomina}</p>
              <p><strong>Fokontany :</strong> {v.fokontany}</p>
              <p><strong>Isan’ny mponina iandraiketany :</strong> {v.isan_mponina}</p>
              <p><strong>Tanora mifandray amin’ity VTI ity :</strong> {tanoraVti.length}</p>
              <p><strong>Lahy :</strong> {countTheme(tanoraVti, "sexe", ["lahy"])}</p>
              <p><strong>Vavy :</strong> {countTheme(tanoraVti, "sexe", ["vavy"])}</p>
            </div>
          );
        })}

        <hr />

      <h2>7. Dashboard Ara-panahy sy Fanabeazana</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Fanaka masina dimy / Soatoavina dimy</h4>
  <p>1. Fahamasinana</p>
  <p>2. Fanetre-tena</p>
  <p>3. Fandeferana</p>
  <p>4. Fahaizana mamela heloka</p>
  <p>5. Fiantrana ny madiniky ny Tompo</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fanaka dimy / Soatoavina</h4>
  {vtiArap.map((r: any) => (
    <p key={`fanaka-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.fanaka_dimy || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Fanaka dimy / Soatoavina sarotra ampiharina",
  vtiArap,
  "fanaka_dimy",
  [
    {
      label: "Fahamasinana",
      keys: ["fahamasinana"],
      conseil: "Hamafisina ny fampianarana sy fampiharana fiainana masina isan’andro.",
    },
    {
      label: "Fanetre-tena",
      keys: ["fanetre-tena", "fanetretena"],
      conseil: "Ampidirina amin’ny fanofanana sy fijoroana vavolombelona ny fanetre-tena.",
    },
    {
      label: "Fandeferana",
      keys: ["fandeferana"],
      conseil: "Hamafisina ny fanabeazana momba ny fihavanana, fifehezantena ary tsy fampirisihana ady.",
    },
    {
      label: "Fahaizana mamela heloka",
      keys: ["mamela heloka", "famelan-keloka"],
      conseil: "Atao laharam-pahamehana ny fampianarana momba ny famelan-keloka sy ny fanasitranana fifandraisana.",
    },
    {
      label: "Fiantrana ny madiniky ny Tompo",
      keys: ["fiantrana", "madiniky"],
      conseil: "Arotsaka amin’ny asa soa sy fanampiana ireo marefo ao amin’ny fiarahamonina.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation des soatoavina sarotra ampiharina</h4>

  {priorityLine("Fahamasinana", vtiArap, "fanaka_dimy", ["fahamasinana"])}
  {priorityLine("Fanetre-tena", vtiArap, "fanaka_dimy", ["fanetre-tena", "fanetretena"])}
  {priorityLine("Fandeferana", vtiArap, "fanaka_dimy", ["fandeferana"])}
  {priorityLine("Fahaizana mamela heloka", vtiArap, "fanaka_dimy", ["mamela heloka", "famelan-keloka"])}
  {priorityLine("Fiantrana ny madiniky ny Tompo", vtiArap, "fanaka_dimy", ["fiantrana", "madiniky"])}

  <h5>Valiny hafa / valiny manokana</h5>
  {otherResponses(vtiArap, "fanaka_dimy", [
    "fahamasinana",
    "fanetre-tena",
    "fanetretena",
    "fandeferana",
    "mamela heloka",
    "famelan-keloka",
    "fiantrana",
    "madiniky"
  ]).map((v, i) => (
    <p key={`fanaka-other-${i}`}>{v}</p>
  ))}
</div>

<div style={styles.miniBox}>
  <h4>Fanamby ara-panahy ao anatin’ny 140 andro</h4>

  <p>
    <strong>Référence :</strong> Ny fanamby dia apetraka amin’ny laharam-pahamehana mazava araka izay tena sarotra sy tena ilain’ny VTI hatsaraina ao anatin’ny 140 andro.
  </p>

  {vtiArap.map((r: any) => (
    <p key={`fanamby-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.fanamby_140_andro || "—"}
    </p>
  ))}

  {syntheseAutomatique(
    "Synthèse automatique — Fanamby ara-panahy 140 andro",
    vtiArap,
    "fanamby_140_andro",
    [
      {
        label: "Fampianarana sy fampiharana Vavaka Betela",
        keys: ["vavaka betela", "betela"],
        conseil: "Atao laharam-pahamehana ny fampianarana sy fampiharana Vavaka Betela ao amin’ny VTI.",
      },
      {
        label: "Fijoroana vavolombelona sy fitoriana",
        keys: ["fijoroana vavolombelona", "fitoriana"],
        conseil: "Hamafisina ny fijoroana vavolombelona sy fizarana ny tombontsoa azo amin’ny fampiharana.",
      },
      {
        label: "Herinandro 05 ho an’ny Mpianatry ny Tompo",
        keys: ["herinandro", "mpianatry ny tompo"],
        conseil: "Apetraka tsara ny fandaharam-potoana 5 herinandro mifototra amin’ny soatoavina kristiana.",
      },
      {
        label: "Fampahafantarana ny fiarahamonina",
        keys: ["fampahafantarana", "fiarahamonina", "mpiara-monina"],
        conseil: "Entina eny amin’ny fiarahamonina ny soatoavina mba ho lasa fomba fiaina iombonana.",
      },
    ]
  )}

  <h5>Synthèse intelligente — Priorisation des fanamby ara-panahy</h5>

  {priorityLine("Fampianarana sy fampiharana Vavaka Betela", vtiArap, "fanamby_140_andro", ["vavaka betela", "betela"])}
  {priorityLine("Fijoroana vavolombelona sy fitoriana", vtiArap, "fanamby_140_andro", ["fijoroana vavolombelona", "fitoriana"])}
  {priorityLine("Herinandro 05 ho an’ny Mpianatry ny Tompo", vtiArap, "fanamby_140_andro", ["herinandro", "mpianatry ny tompo"])}
  {priorityLine("Fampahafantarana ny fiarahamonina", vtiArap, "fanamby_140_andro", ["fampahafantarana", "fiarahamonina", "mpiara-monina"])}

  <h5>Valiny hafa / fanamby manokana</h5>
  {otherResponses(vtiArap, "fanamby_140_andro", [
    "vavaka betela",
    "betela",
    "fijoroana vavolombelona",
    "fitoriana",
    "herinandro",
    "mpianatry ny tompo",
    "fampahafantarana",
    "fiarahamonina",
    "mpiara-monina"
  ]).map((v, i) => (
    <p key={`fanamby-other-${i}`}>{v}</p>
  ))}
</div>

<hr />

<h2>7B. Dashboard Fanabeazana</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Olana ara-panabeazana</h4>
  <p>1. Fahabadoana : tsy fahaizana mamaky teny, manoratra ary manisa</p>
  <p>2. Fahantrana ara-panabeazana / pauvreté d’apprentissage</p>
  <p>3. Fitsoahana na fialana an-tsekoly</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Olana ara-panabeazana</h4>
  {vtiArap.map((r: any) => (
    <p key={`fanab-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.olana_fanabeazana || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Olana ara-panabeazana",
  vtiArap,
  "olana_fanabeazana",
  [
    {
      label: "Fahabadoana : tsy fahaizana mamaky teny, manoratra ary manisa",
      keys: ["fahabadoana", "mamaky teny", "manoratra", "manisa"],
      conseil: "Atao laharam-pahamehana ny fampianarana mamaky teny, manoratra ary manisa.",
    },
    {
      label: "Fahantrana ara-panabeazana / pauvreté d’apprentissage",
      keys: ["fahantrana ara-panabeazana", "pauvreté", "apprentissage"],
      conseil: "Hamafisina ny tohana pedagojika ho an’ny ankizy sy tanora marefo ara-panabeazana.",
    },
    {
      label: "Fitsoahana na fialana an-tsekoly",
      keys: ["fitsoahana", "fialana", "an-tsekoly", "niala an-tsekoly"],
      conseil: "Apetraka ny accompagnement sy tohana pedagojika ho an’ny tanora niala an-tsekoly.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  <h5>Sokajy voalohany : olana tena mafy, miantraika amin’ny daholobe / ankamaroany</h5>

  {priorityLine(
    "Fahabadoana : tsy fahaizana mamaky teny, manoratra ary manisa",
    vtiArap,
    "olana_fanabeazana",
    ["fahabadoana", "mamaky teny", "manoratra", "manisa"]
  )}

  {priorityLine(
    "Fahantrana ara-panabeazana / pauvreté d’apprentissage",
    vtiArap,
    "olana_fanabeazana",
    ["fahantrana ara-panabeazana", "pauvreté", "apprentissage"]
  )}

  {priorityLine(
    "Fitsoahana na fialana an-tsekoly",
    vtiArap,
    "olana_fanabeazana",
    ["fitsoahana", "fialana", "an-tsekoly", "niala an-tsekoly"]
  )}

  <h5>Sokajy faharoa : olana misy hafa, tranga vitsy na mbola azo leferina</h5>
  {vtiArap.map((r: any) => (
    <p key={`fanab2-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.olana_fanabeazana || "").includes("OLANA MAFY, MBOLA AZO LEFERINA")
        ? String(r.olana_fanabeazana).split("OLANA MAFY, MBOLA AZO LEFERINA")[1]
        : "—"}
    </p>
  ))}

  <h5>Valiny hafa / valiny manokana</h5>
  {otherResponses(vtiArap, "olana_fanabeazana", [
    "fahabadoana",
    "mamaky teny",
    "manoratra",
    "manisa",
    "fahantrana ara-panabeazana",
    "pauvreté",
    "apprentissage",
    "fitsoahana",
    "fialana",
    "an-tsekoly",
    "niala an-tsekoly"
  ]).map((v, i) => (
    <p key={`fanab-other-${i}`}>{v}</p>
  ))}
</div>

<div style={styles.miniBox}>
  <h4>Paikady ara-panabeazana ao anatin’ny 140 andro</h4>

  <p>
    <strong>Références :</strong> 1-Paikady iombonana ho fampianarana mamaky teny sy manoratra, ady amin’ny habadoana ; 2-Paikady iombonana ho tohana pedagojika ho an’ny tanora nitsoaka an-daharana na niala an-tsekoly ; 3-Paikady iombonana ho fametrahana “Sekoly Tsara Kalitao” miaraka amin’ny Kaomina, ZAP, ray aman-dreny, Fokonolona ary Vaomiera/VTI.
  </p>

  {vtiArap.map((r: any) => (
    <p key={`paikady-fanab-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.paikady_140_andro || "—"}
    </p>
  ))}

  {syntheseAutomatique(
    "Synthèse automatique — Paikady ara-panabeazana 140 andro",
    vtiArap,
    "paikady_140_andro",
    [
      {
        label: "Fampianarana mamaky teny sy manoratra / ady amin’ny habadoana",
        keys: ["mamaky teny", "manoratra", "habadoana"],
        conseil: "Atomboka ny hetsika iombonana ho fampianarana mamaky teny sy manoratra.",
      },
      {
        label: "Tohana pedagojika ho an’ny tanora niala an-tsekoly",
        keys: ["tohana pedagojika", "nitsoaka", "niala an-tsekoly"],
        conseil: "Apetraka ny accompagnement ho an’ny tanora nitsoaka an-daharana na niala an-tsekoly.",
      },
      {
        label: "Sekoly Tsara Kalitao",
        keys: ["sekoly tsara kalitao", "kaomina", "zap", "ray aman-dreny", "fokonolona"],
        conseil: "Hamafisina ny fiaraha-miasa Kaomina, ZAP, ray aman-dreny, Fokonolona ary VTI.",
      },
    ]
  )}

  <h5>Valiny hafa / paikady manokana</h5>
  {otherResponses(vtiArap, "paikady_140_andro", [
    "mamaky teny",
    "manoratra",
    "habadoana",
    "tohana pedagojika",
    "nitsoaka",
    "niala an-tsekoly",
    "sekoly tsara kalitao",
    "kaomina",
    "zap",
    "ray aman-dreny",
    "fokonolona"
  ]).map((v, i) => (
    <p key={`paikady-fanab-other-${i}`}>{v}</p>
  ))}
</div>

<hr />

     <h2>8. Dashboard Fandraharahana sy Toekarena</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Olana ara-toekarena</h4>
  <p>1. Tsy fananana kolontsain’ny fandraharahana sy tsy fisian’ny torohay</p>
  <p>2. Famokarana tsy mitodika amin’ny varotra</p>
  <p>3. Olana fananantany</p>
  <p>4. Tsy fahampian’ny fiofanana sy fanaraha-maso teknika</p>
  <p>5. Tsy fahampian’ny tosika ara-pitaovana sy akora</p>
  <p>6. Tsy fahampian’ny fotodrafitrasa iombonana</p>
  <p>7. Tsy fisian’ny lalambarotra</p>
  <p>8. Tsy fisian’ny fiarovana ny mpamokatra</p>
  <p>9. Fihenan’ny fahefa-mividy sy fiankinan-doha amin’ny PPN</p>
  <p>10. Olana hafa</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fiches remplies</h4>
  {vtiToek.map((r: any) => (
    <p key={`toek-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.olana_toekarena || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Olana ara-toekarena",
  vtiToek,
  "olana_toekarena",
  [
    {
      label: "Tsy fananana kolontsain’ny fandraharahana sy tsy fisian’ny torohay",
      keys: ["kolontsain", "fandraharahana", "torohay"],
      conseil: "Hamafisina ny fanabeazana ara-toekarena sy ny torohay ho an’ny tanora.",
    },
    {
      label: "Famokarana tsy mitodika amin’ny varotra",
      keys: ["famokarana", "varotra"],
      conseil: "Ampifandraisina amin’ny tsena sy lalambarotra ny famokarana.",
    },
    {
      label: "Olana fananantany",
      keys: ["fananantany"],
      conseil: "Atao laharam-pahamehana ny paikady fananantany miaraka amin’ny Kaomina sy ny servisy fananantany.",
    },
    {
      label: "Tsy fahampian’ny fiofanana sy fanaraha-maso teknika",
      keys: ["fiofanana", "fanaraha-maso", "teknika"],
      conseil: "Apetraka ny Saha Sekoly sy encadrement teknika akaiky.",
    },
    {
      label: "Tsy fahampian’ny tosika ara-pitaovana sy akora",
      keys: ["tosika", "fitaovana", "akora"],
      conseil: "Hojerena ny rafitra fanohanana ara-pitaovana sy famatsiana akora.",
    },
    {
      label: "Tsy fahampian’ny fotodrafitrasa iombonana",
      keys: ["fotodrafitrasa"],
      conseil: "Faritana ireo fotodrafitrasa maika voalohany sy faharoa.",
    },
    {
      label: "Tsy fisian’ny lalambarotra",
      keys: ["lalambarotra", "tsena"],
      conseil: "Hamafisina ny débouchés, tsena ary fifandraisana amin’ny mpividy.",
    },
    {
      label: "Tsy fisian’ny fiarovana ny mpamokatra",
      keys: ["fiarovana", "mpamokatra"],
      conseil: "Apetraka ny rafitra fiarovana ny mpamokatra sy ny vokatra.",
    },
    {
      label: "Fihenan’ny fahefa-mividy sy fiankinan-doha amin’ny PPN",
      keys: ["fahefa-mividy", "ppn", "fiankinan-doha"],
      conseil: "Hamafisina ny famokarana sakafo ifotony sy ny famatsiana maharitra.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  <h5>Sokajy voalohany : Olana tena mafy, miantraika amin’ny daholobe / ankamaroany</h5>

  {priorityLine("Tsy fananana kolontsain’ny fandraharahana sy tsy fisian’ny torohay", vtiToek, "olana_toekarena", ["kolontsain", "fandraharahana", "torohay"])}
  {priorityLine("Famokarana tsy mitodika amin’ny varotra", vtiToek, "olana_toekarena", ["famokarana", "varotra"])}
  {priorityLine("Olana fananantany", vtiToek, "olana_toekarena", ["fananantany"])}
  {priorityLine("Tsy fahampian’ny fiofanana sy fanaraha-maso teknika", vtiToek, "olana_toekarena", ["fiofanana", "fanaraha-maso", "teknika"])}
  {priorityLine("Tsy fahampian’ny tosika ara-pitaovana sy akora", vtiToek, "olana_toekarena", ["tosika", "fitaovana", "akora"])}
  {priorityLine("Tsy fahampian’ny fotodrafitrasa iombonana", vtiToek, "olana_toekarena", ["fotodrafitrasa"])}
  {priorityLine("Tsy fisian’ny lalambarotra", vtiToek, "olana_toekarena", ["lalambarotra", "tsena"])}
  {priorityLine("Tsy fisian’ny fiarovana ny mpamokatra", vtiToek, "olana_toekarena", ["fiarovana", "mpamokatra"])}
  {priorityLine("Fihenan’ny fahefa-mividy sy fiankinan-doha amin’ny PPN", vtiToek, "olana_toekarena", ["fahefa-mividy", "ppn", "fiankinan-doha"])}

  <h5>Sokajy faharoa : Olana misy hafa, tranga vitsy na mbola azo leferina</h5>

  {vtiToek.map((r: any) => (
    <p key={`toek-2-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.olana_toekarena || "").includes("OLANA MAFY, MBOLA AZO LEFERINA")
        ? String(r.olana_toekarena).split("OLANA MAFY, MBOLA AZO LEFERINA")[1]
        : "—"}
    </p>
  ))}

  <h5>Valiny hafa / valiny manokana</h5>

  {otherResponses(vtiToek, "olana_toekarena", [
    "kolontsain",
    "fandraharahana",
    "torohay",
    "famokarana",
    "varotra",
    "fananantany",
    "fiofanana",
    "fanaraha-maso",
    "teknika",
    "tosika",
    "fitaovana",
    "akora",
    "fotodrafitrasa",
    "lalambarotra",
    "tsena",
    "fiarovana",
    "mpamokatra",
    "fahefa-mividy",
    "ppn",
    "fiankinan-doha"
  ]).map((v, i) => (
    <p key={`toek-other-${i}`}>{v}</p>
  ))}
</div>

<div style={styles.miniBox}>
  <h4>Paikady ara-toekarena ao anatin’ny 140 andro</h4>

  <p>
    <strong>Références :</strong> 1-Fametrahana Saha Sekoly ; 2-Paikady fananantany miaraka amin’ny servisy fananantany sy Kaomina ; 3-Fanohanana ny Taniketsa Fandraharahana ; 4-Lalambarotra sy famatsiana ara-tsakafo/PPN maharitra ; 5-Fotodrafitrasa maika voalohany ; 6-Fotodrafitrasa maika faharoa ; 7-Paikady iombonana hafa ; 8-Paikady iombonana hafa.
  </p>

  {vtiToek.map((r: any) => (
    <p key={`toek-paikady-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.paikady_toekarena || "—"}
    </p>
  ))}
</div>

<hr />

       <h2>9. Dashboard Fahasalamana</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Formulaire VTI</h4>

  <p>1- Tazo moka</p>
  <p>2- Aretim-pivalanana</p>
  <p>3- VIH/SIDA sy IST</p>
  <p>4- Tsy fahampian-tsakafo</p>
  <p>5- Tosidra</p>
  <p>6- Diabeta</p>
  <p>7- Homamiadana</p>
  <p>8- Fahasembanana</p>
  <p>9- Fahasalamana ara-tsaina</p>
  <p>10- Olana hafa</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fiches remplies</h4>

  {vtiFahas.map((r: any) => (
    <p key={`fahas-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {r.olana_fahasalamana || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Olana ara-pahasalamana",
  vtiFahas,
  "olana_fahasalamana",
  [
    {
      label: "Tazo moka",
      keys: ["tazo moka"],
      conseil: "Atao laharam-pahamehana ny ady amin’ny moka, fanadiovana tontolo iainana ary fanentanana isan-tokantrano.",
    },
    {
      label: "Aretim-pivalanana",
      keys: ["aretim-pivalanana"],
      conseil: "Hamafisina ny rano fisotro madio, fahadiovana ary fanentanana momba ny fidiovana.",
    },
    {
      label: "VIH/SIDA sy IST",
      keys: ["vih", "sida", "ist"],
      conseil: "Hamafisina ny fanabeazana ara-pahasalamana sy ny fisorohana amin’ny tanora.",
    },
    {
      label: "Tsy fahampian-tsakafo",
      keys: ["tsy fahampian-tsakafo", "fanjarian-tsakafo"],
      conseil: "Ampifandraisina amin’ny Taniketsa sy fanjarian-tsakafo ny paikady ara-pahasalamana.",
    },
    {
      label: "Tosidra",
      keys: ["tosidra"],
      conseil: "Atao fanentanana momba ny fitiliana sy ny fomba fiaina ara-pahasalamana.",
    },
    {
      label: "Diabeta",
      keys: ["diabeta"],
      conseil: "Ampidirina ao anatin’ny fanentanana ny sakafo ara-pahasalamana sy fitiliana.",
    },
    {
      label: "Homamiadana",
      keys: ["homamiadana"],
      conseil: "Ilaina ny fanentanana momba ny fitiliana mialoha sy ny fanohanana ireo marary.",
    },
    {
      label: "Fahasembanana",
      keys: ["fahasembanana"],
      conseil: "Hojerena ny fandraisana anjara sy ny fanohanana ireo olona manana fahasembanana.",
    },
    {
      label: "Fahasalamana ara-tsaina",
      keys: ["ara-tsaina", "stress", "fahakiviana"],
      conseil: "Hamafisina ny fanohanana ara-tsaina, fanatanjahantena ary fialamboly mahasalama.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  <h5>Sokajy voalohany : Olana tena mafy</h5>

  {priorityLine("Tazo moka", vtiFahas, "olana_fahasalamana", ["tazo moka"])}
  {priorityLine("Aretim-pivalanana", vtiFahas, "olana_fahasalamana", ["aretim-pivalanana"])}
  {priorityLine("VIH/SIDA sy IST", vtiFahas, "olana_fahasalamana", ["vih", "sida", "ist"])}
  {priorityLine("Tsy fahampian-tsakafo", vtiFahas, "olana_fahasalamana", ["tsy fahampian-tsakafo"])}
  {priorityLine("Tosidra", vtiFahas, "olana_fahasalamana", ["tosidra"])}
  {priorityLine("Diabeta", vtiFahas, "olana_fahasalamana", ["diabeta"])}
  {priorityLine("Homamiadana", vtiFahas, "olana_fahasalamana", ["homamiadana"])}
  {priorityLine("Fahasembanana", vtiFahas, "olana_fahasalamana", ["fahasembanana"])}
  {priorityLine("Fahasalamana ara-tsaina", vtiFahas, "olana_fahasalamana", ["ara-tsaina"])}

  <h5>Sokajy faharoa : Olana misy fa mbola tranga vitsy</h5>

  {vtiFahas.map((r: any) => (
    <p key={`fahas-2-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.olana_fahasalamana || "").includes("OLANA MBOLA AZO LEFERINA")
        ? String(r.olana_fahasalamana).split("OLANA MBOLA AZO LEFERINA")[1]
        : "—"}
    </p>
  ))}

  <h5>Valiny hafa / valiny manokana</h5>

  {otherResponses(vtiFahas, "olana_fahasalamana", [
    "tazo moka",
    "aretim-pivalanana",
    "vih",
    "sida",
    "ist",
    "tsy fahampian-tsakafo",
    "fanjarian-tsakafo",
    "tosidra",
    "diabeta",
    "homamiadana",
    "fahasembanana",
    "ara-tsaina",
    "stress",
    "fahakiviana"
  ]).map((v, i) => (
    <p key={`fahas-other-${i}`}>{v}</p>
  ))}
</div>

<div style={styles.miniBox}>
  <h4>Paikady 140 andro — Fahasalamana</h4>

  <p>
    <strong>Références :</strong> 1-Ady amin’ny tazo moka ; 2-Ady amin’ny aretim-pivalanana ; 3-Vaksiny ; 4-Fanjarian-tsakafo ; 5-Fampiroboroboana fanatanjahantena sy fialamboly ho an’ny fahasalamana ara-batana sy ara-tsaina.
  </p>

  {vtiFahas.map((r: any) => (
    <p key={`fahas-paikady-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.paikady_fahasalamana || "").split("FIAROVANA")[0] || "—"}
    </p>
  ))}
</div>

<hr />

<h2>10. Dashboard Fiarovana ny Tanora</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Formulaire VTI</h4>
  <p>1- Vohoka aloha loatra</p>
  <p>2- Mariazin'ny ankizy</p>
  <p>3- Zava-mahadomelina</p>
  <p>4- Herisetra</p>
  <p>5- Fahaverezan'ny fanantenana</p>
  <p>6- Olana hafa</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fiches remplies</h4>
  {vtiFahas.map((r: any) => (
    <p key={`voina-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.voina_tanora || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Fiarovana ny Tanora",
  vtiFahas,
  "voina_tanora",
  [
    {
      label: "Vohoka aloha loatra",
      keys: ["vohoka"],
      conseil: "Hamafisina ny fanabeazana sy fisorohana vohoka aloha loatra amin’ny tanora.",
    },
    {
      label: "Mariazin'ny ankizy",
      keys: ["mariazy", "mariazin"],
      conseil: "Atao laharam-pahamehana ny fanentanana sy fiarovana ny ankizy amin’ny fanambadiana aloha loatra.",
    },
    {
      label: "Zava-mahadomelina",
      keys: ["mahadomelina", "fidorohana"],
      conseil: "Hatsangana ny fanentanana, fanaraha-maso ary hetsika fisorohana fidorohana zava-mahadomelina.",
    },
    {
      label: "Herisetra",
      keys: ["herisetra"],
      conseil: "Hamafisina ny rafitra fiarovana, fihainoana ary fanampiana ireo tanora iharan’ny herisetra.",
    },
    {
      label: "Fahaverezan'ny fanantenana",
      keys: ["fanantenana", "fahakiviana"],
      conseil: "Hamafisina ny fanohanana ara-tsaina, fanatanjahantena, fialamboly ary mentorat ho an’ny tanora.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  {priorityLine("Vohoka aloha loatra", vtiFahas, "voina_tanora", ["vohoka"])}
  {priorityLine("Mariazin'ny ankizy", vtiFahas, "voina_tanora", ["mariazy", "mariazin"])}
  {priorityLine("Zava-mahadomelina", vtiFahas, "voina_tanora", ["mahadomelina", "fidorohana"])}
  {priorityLine("Herisetra", vtiFahas, "voina_tanora", ["herisetra"])}
  {priorityLine("Fahaverezan'ny fanantenana", vtiFahas, "voina_tanora", ["fanantenana", "fahakiviana"])}

  <h5>Valiny hafa / valiny manokana</h5>

  {otherResponses(vtiFahas, "voina_tanora", [
    "vohoka",
    "mariazy",
    "mariazin",
    "mahadomelina",
    "fidorohana",
    "herisetra",
    "fanantenana",
    "fahakiviana"
  ]).map((v, i) => (
    <p key={`voina-other-${i}`}>{v}</p>
  ))}
</div>

<div style={styles.miniBox}>
  <h4>Paikady 140 andro — Fiarovana ny Tanora</h4>

  <p>
    <strong>Références :</strong> 1-Fisorohana vohoka aloha loatra ; 2-Fisorohana mariazin’ny ankizy ; 3-Fisorohana fidorohana zava-mahadomelina ; 4-Fisorohana herisetra ; 5-Paikady iombonana hafa ; 6-Paikady iombonana hafa.
  </p>

  {vtiFahas.map((r: any) => (
    <p key={`voina-paikady-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.paikady_fahasalamana || "").includes("FIAROVANA")
        ? "FIAROVANA" + String(r.paikady_fahasalamana).split("FIAROVANA")[1]
        : "—"}
    </p>
  ))}
</div>

<hr />
   <h2>10. Dashboard Fandriampahalemana sy Ady amin'ny Kolikoly</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Formulaire VTI</h4>
  <p>1. Halatra be vava miaraka amin’ny vono olona</p>
  <p>2. Halabotry</p>
  <p>3. Disadisa ara-piarahamonina</p>
  <p>4. Ady lahy sy fizarazarana ara-politika</p>
  <p>5. Kolikoly sy fahalovana miantraika amin’ny fiainam-piaraha-monina</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fiches remplies</h4>
  {vtiEtika.map((r: any) => (
    <p key={`fd-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.olana_fandriampahalemana || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Fandriampahalemana sy Ady amin'ny Kolikoly",
  vtiEtika,
  "olana_fandriampahalemana",
  [
    {
      label: "Halatra be vava miaraka amin’ny vono olona",
      keys: ["halatra be vava", "vono olona", "dahalo"],
      conseil: "Hamafisina ny rafitra fandriampahalemana ifotony sy ny fiaraha-miasa amin’ny fokonolona.",
    },
    {
      label: "Halabotry",
      keys: ["halabotry"],
      conseil: "Atao laharam-pahamehana ny fisorohana sy ny fanaraha-maso eny anivon’ny fiarahamonina.",
    },
    {
      label: "Disadisa ara-piarahamonina",
      keys: ["disadisa"],
      conseil: "Hamafisina ny fihavanana, ny fifampihainoana ary ny fanelanelanana ara-piarahamonina.",
    },
    {
      label: "Ady lahy sy fizarazarana ara-politika",
      keys: ["ady lahy", "fizarazarana", "politika"],
      conseil: "Ilaina ny fanabeazana olom-pirenena sy ny fanamafisana ny firaisankina.",
    },
    {
      label: "Kolikoly sy fahalovana",
      keys: ["kolikoly", "fahalovana"],
      conseil: "Hamafisina ny etika, mangarahara, dina ary ady amin’ny fahalovana.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  <h5>Sokajy voalohany : olana tena mafy, miantraika amin’ny daholobe / ankamaroany</h5>
  {priorityLine("Halatra be vava miaraka amin’ny vono olona", vtiEtika, "olana_fandriampahalemana", ["halatra be vava", "vono olona", "dahalo"])}
  {priorityLine("Halabotry", vtiEtika, "olana_fandriampahalemana", ["halabotry"])}
  {priorityLine("Disadisa ara-piarahamonina", vtiEtika, "olana_fandriampahalemana", ["disadisa"])}
  {priorityLine("Ady lahy sy fizarazarana ara-politika", vtiEtika, "olana_fandriampahalemana", ["ady lahy", "fizarazarana", "politika"])}
  {priorityLine("Kolikoly sy fahalovana", vtiEtika, "olana_fandriampahalemana", ["kolikoly", "fahalovana"])}

  <h5>Sokajy faharoa : olana misy hafa, tranga vitsy na mbola azo leferina</h5>
  {vtiEtika.map((r: any) => (
    <p key={`fd2-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.olana_fandriampahalemana || "").includes("OLANA MAFY, MBOLA AZO LEFERINA")
        ? String(r.olana_fandriampahalemana).split("OLANA MAFY, MBOLA AZO LEFERINA")[1]
        : "—"}
    </p>
  ))}

  <h5>Valiny hafa / valiny manokana</h5>
  {otherResponses(vtiEtika, "olana_fandriampahalemana", [
    "halatra", "vono olona", "dahalo", "halabotry", "disadisa", "ady lahy", "fizarazarana", "politika", "kolikoly", "fahalovana"
  ]).map((v, i) => <p key={`fd-other-${i}`}>{v}</p>)}
</div>

<div style={styles.miniBox}>
  <h4>Paikady 140 andro — Fandriampahalemana sy ady amin’ny kolikoly</h4>
  <p>Références : 1-Fanamafisana fihavanana ; 2-Fametrahana fandriampahalemana maharitra ; 3-Fisorohana sy ady amin’ny fahalovana ; 4-Fanabeazana olom-pirenena ; 5-Dina sy fitsipika iombonana.</p>

  {vtiEtika.map((r: any) => (
    <p key={`fd-paikady-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.paikady_etika || "").split("VAHAOLANA 140 ANDRO — TONTOLO IAINANA:")[0] || "—"}
    </p>
  ))}
</div>

<hr /> 
<h2>11. Dashboard Tontolo Iainana sy Harena Voajanahary</h2>

<div style={styles.miniBox}>
  <h4>Références officielles — Formulaire VTI</h4>
  <p>1. Doro tanety</p>
  <p>2. Fandripahana ny ala</p>
  <p>3. Fandripahana na fandrobana harena voajanahary sy loharanon-karena iombonana</p>
  <p>4. Faharitry ny loharano sy haintany</p>
  <p>5. Fiankinandoha amin’ny saribao sy kitay</p>
  <p>6. Loza voajanahary : rivo-doza, tondradrano</p>
  <p>7. Olana hafa</p>
</div>

<div style={styles.miniBox}>
  <h4>Valiny détaillées — Fiches remplies</h4>
  {vtiEtika.map((r: any) => (
    <p key={`env-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong> {r.olana_tontolo_iainana || "—"}
    </p>
  ))}
</div>

{syntheseAutomatique(
  "Synthèse automatique — Tontolo Iainana sy Harena Voajanahary",
  vtiEtika,
  "olana_tontolo_iainana",
  [
    {
      label: "Doro tanety",
      keys: ["doro tanety"],
      conseil: "Atao laharam-pahamehana ny ady amin’ny doro tanety sy ny fanentanana ifotony.",
    },
    {
      label: "Fandripahana ny ala",
      keys: ["fandripahana ala", "fandripahana ny ala", "ala"],
      conseil: "Hamafisina ny fiarovana ala, fambolen-kazo ary fanaraha-maso iombonana.",
    },
    {
      label: "Fandrobana harena voajanahary",
      keys: ["harena voajanahary", "loharanon-karena", "fandrobana"],
      conseil: "Apetraka ny rafitra fiarovana ny harena voajanahary sy ny loharanon-karena iombonana.",
    },
    {
      label: "Faharitry ny loharano sy haintany",
      keys: ["loharano", "haintany"],
      conseil: "Hamafisina ny fiarovana loharano, fefy velona ary fambolena hazo.",
    },
    {
      label: "Fiankinandoha amin’ny saribao sy kitay",
      keys: ["saribao", "kitay"],
      conseil: "Ampidirina ny paikady angovo maintso sy fomba fahandro mitsitsy angovo.",
    },
    {
      label: "Loza voajanahary",
      keys: ["rivo-doza", "tondradrano", "loza voajanahary"],
      conseil: "Hatsangana ny fanomanana sy fiarovana amin’ny loza voajanahary.",
    },
  ]
)}

<div style={styles.miniBox}>
  <h4>Synthèse intelligente — Priorisation détaillée</h4>

  <h5>Sokajy voalohany : olana tena mafy, miantraika amin’ny daholobe / ankamaroany</h5>
  {priorityLine("Doro tanety", vtiEtika, "olana_tontolo_iainana", ["doro tanety"])}
  {priorityLine("Fandripahana ala", vtiEtika, "olana_tontolo_iainana", ["fandripahana ala", "fandripahana ny ala", "ala"])}
  {priorityLine("Fandrobana harena voajanahary", vtiEtika, "olana_tontolo_iainana", ["harena voajanahary", "loharanon-karena", "fandrobana"])}
  {priorityLine("Faharitry ny loharano sy haintany", vtiEtika, "olana_tontolo_iainana", ["loharano", "haintany"])}
  {priorityLine("Fiankinan-doha amin’ny saribao sy kitay", vtiEtika, "olana_tontolo_iainana", ["saribao", "kitay"])}
  {priorityLine("Loza voajanahary", vtiEtika, "olana_tontolo_iainana", ["rivo-doza", "tondradrano", "loza voajanahary"])}

  <h5>Sokajy faharoa : olana misy hafa, tranga vitsy na mbola azo leferina</h5>
  {vtiEtika.map((r: any) => (
    <p key={`env2-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.olana_tontolo_iainana || "").includes("OLANA MBOLA AZO LEFERINA")
        ? String(r.olana_tontolo_iainana).split("OLANA MBOLA AZO LEFERINA")[1]
        : "—"}
    </p>
  ))}

  <h5>Valiny hafa / valiny manokana</h5>
  {otherResponses(vtiEtika, "olana_tontolo_iainana", [
    "doro tanety",
    "ala",
    "harena voajanahary",
    "loharanon-karena",
    "fandrobana",
    "loharano",
    "haintany",
    "saribao",
    "kitay",
    "rivo-doza",
    "tondradrano",
    "loza voajanahary"
  ]).map((v, i) => <p key={`env-other-${i}`}>{v}</p>)}
</div>

<div style={styles.miniBox}>
  <h4>Paikady 140 andro — Tontolo iainana</h4>
  <p>
    <strong>Références :</strong> 1-Fambolena hazo/ala ; 2-Fefy velona manodidina ny Taniketsa Voly rakotra 500m² ; 3-Ady amin’ny doro tanety sy fandripahana ala ; 4-Angovo maintso ; 5-Famokarana biolojika miaro ny natiora ; 6-Fanodinana fako ; 7-Paikady hafa.
  </p>

  {vtiEtika.map((r: any) => (
    <p key={`env-paikady-${r.id}`}>
      <strong>ID VTI {r.vti_id} :</strong>{" "}
      {String(r.paikady_etika || "").includes("VAHAOLANA 140 ANDRO — TONTOLO IAINANA:")
        ? "VAHAOLANA 140 ANDRO — TONTOLO IAINANA:" + String(r.paikady_etika).split("VAHAOLANA 140 ANDRO — TONTOLO IAINANA:")[1]
        : "—"}
    </p>
  ))}
</div>
        <hr />

<div style={styles.actions}>
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
type Screen =
  | "home"
  | "identite"
  | "spirituel"
  | "vti"
  | "taniketsa"
  | "imprimable"
  | "fiche"
  | "modifier_tanora"
  | "vti_iombonana"
  | "vti_imprimable"
  | "vti_fiche"
  | "modifier_vti"
  | "dashboard";

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

  if (screen === "modifier_tanora") {
    return <ModifierCompleterTanora onBack={() => setScreen("home")} />;
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

  if (screen === "modifier_vti") {
    return <ModifierCompleterVti onBack={() => setScreen("home")} />;
  }

  if (screen === "dashboard") {
    return <DashboardAnalytique onBack={() => setScreen("home")} />;
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>TOMBANA TANORA MAZAVA L1</h1>

        <h2 style={styles.subtitle}>TOMBANA FANOMBOHANA ID TANORA</h2>

        <button style={styles.button} onClick={() => setScreen("identite")}>
          Hanomboka ny Tombana ID Tanora
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("imprimable")}>
          Version imprimable vierge ID Tanora
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("fiche")}>
          Fiche remplie par ID Tanora
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("modifier_tanora")}>
          Modifier / Compléter Fiche ID Tanora
        </button>

        <hr />

        <h2 style={styles.subtitle}>TOMBANA IOMBONANA AO ANATY VTI</h2>

        <button style={styles.button} onClick={() => setScreen("vti_iombonana")}>
          Hanomboka Tombana iombonana VTI
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("vti_imprimable")}>
          Formulaire vierge VTI
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("vti_fiche")}>
          Fiche remplie VTI par ID VTI
        </button>

        <button style={styles.secondaryButton} onClick={() => setScreen("modifier_vti")}>
          Modifier / Compléter Fiche ID VTI
        </button>

        <hr />

        <h2 style={styles.subtitle}>TABLEAU DE BORD ANALYTIQUE</h2>

        <button style={styles.button} onClick={() => setScreen("dashboard")}>
          Ouvrir Dashboard Analytique
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
function ModifierCompleterVti({ onBack }: any) {
  const [idVti, setIdVti] = useState("");
  const [vti, setVti] = useState<any>(null);
  const [mode, setMode] = useState<
    "menu" | "identite" | "arapanahy" | "toekarena" | "fahasalamana" | "etika"
  >("menu");

  const [arap, setArap] = useState<any>(null);
  const [toek, setToek] = useState<any>(null);
  const [fahas, setFahas] = useState<any>(null);
  const [etika, setEtika] = useState<any>(null);

  const chargerVti = async () => {
    const id = Number(idVti);

    if (!id) {
      alert("Ampidiro aloha ny ID VTI.");
      return;
    }

    const { data, error } = await supabase
      .from("vti")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      alert("Tsy hita ny ID VTI : " + JSON.stringify(error));
      return;
    }

    setVti(data);
    setMode("menu");
  };

  const chargerVaomiera = async (type: string) => {
    if (!vti?.id) return;

    const tableMap: any = {
      arapanahy: "vti_vaomiera_arapanahy_fanabeazana",
      toekarena: "vti_vaomiera_fandraharahana_toekarena",
      fahasalamana: "vti_vaomiera_fahasalamana_fiarovana",
      etika: "vti_vaomiera_etika_fampandrosoana",
    };

    const { data } = await supabase
      .from(tableMap[type])
      .select("*")
      .eq("vti_id", vti.id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (type === "arapanahy") setArap(data || { vti_id: vti.id });
    if (type === "toekarena") setToek(data || { vti_id: vti.id });
    if (type === "fahasalamana") setFahas(data || { vti_id: vti.id });
    if (type === "etika") setEtika(data || { vti_id: vti.id });

    setMode(type as any);
  };

  const saveIdentite = async () => {
    const { error } = await supabase
      .from("vti")
      .update({
        nom_vti: vti.nom_vti || "",
        faritra: vti.faritra || "",
        distrika: vti.distrika || "",
        kaomina: vti.kaomina || "",
        type_kaomina: vti.type_kaomina || "",
        fokontany: vti.fokontany || "",
        isan_mponina: Number(vti.isan_mponina || 0),
      })
      .eq("id", vti.id);

    if (error) {
      alert("Erreur modification VTI : " + JSON.stringify(error));
      return;
    }

    alert("Identité VTI nohavaozina tsara.");
    setMode("menu");
  };

  const saveVaomiera = async (table: string, data: any, setter: any) => {
    const payload = { ...data, vti_id: Number(vti.id) };

    if (payload.id) {
      const { error } = await supabase.from(table).update(payload).eq("id", payload.id);
      if (error) {
        alert("Erreur modification Vaomiera : " + JSON.stringify(error));
        return;
      }
    } else {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
        .single();

      if (error) {
        alert("Erreur insertion Vaomiera : " + JSON.stringify(error));
        return;
      }

      setter(inserted);
    }

    alert("Vaomiera nohavaozina tsara.");
    setMode("menu");
  };

  const Field = ({ label, value, onChange, type = "text" }: any) => (
    <>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value || 0) : e.target.value)}
      />
    </>
  );

  const Area = ({ label, value, onChange }: any) => (
    <>
      <label style={styles.label}>{label}</label>
      <textarea
        style={styles.textarea}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );

  if (vti && mode === "identite") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>Modifier Identité VTI</h1>

          <Field label="Anaran’ny VTI" value={vti.nom_vti} onChange={(v: any) => setVti({ ...vti, nom_vti: v })} />
          <Field label="Faritra" value={vti.faritra} onChange={(v: any) => setVti({ ...vti, faritra: v })} />
          <Field label="Distrika" value={vti.distrika} onChange={(v: any) => setVti({ ...vti, distrika: v })} />
          <Field label="Kaomina" value={vti.kaomina} onChange={(v: any) => setVti({ ...vti, kaomina: v })} />

          <label style={styles.label}>Type de Kaomina</label>
          <select
            style={styles.input}
            value={vti.type_kaomina || ""}
            onChange={(e) => setVti({ ...vti, type_kaomina: e.target.value })}
          >
            <option value="">Safidio</option>
            <option value="Ambanivohitra">Kaomina Ambanivohitra</option>
            <option value="Andrenivohitra">Kaomina Andrenivohitra</option>
          </select>

          <Field label="Fokontany" value={vti.fokontany} onChange={(v: any) => setVti({ ...vti, fokontany: v })} />
          <Field label="Isan’ny mponina" type="number" value={vti.isan_mponina} onChange={(v: any) => setVti({ ...vti, isan_mponina: v })} />

          <div style={styles.actions}>
            <button style={styles.button} onClick={saveIdentite}>Enregistrer</button>
            <button style={styles.secondaryButton} onClick={() => setMode("menu")}>Annuler</button>
          </div>
        </section>
      </main>
    );
  }

  if (vti && mode === "arapanahy") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>Modifier Vaomiera Ara-panahy sy Fanabeazana</h1>

          <Field label="Score fivoriana" type="number" value={arap?.mivory_score} onChange={(v: any) => setArap({ ...arap, mivory_score: v })} />
          <Field label="Score ora iasana" type="number" value={arap?.ora_score} onChange={(v: any) => setArap({ ...arap, ora_score: v })} />
          <Field label="Score herinandro 05" type="number" value={arap?.herinandro_score} onChange={(v: any) => setArap({ ...arap, herinandro_score: v })} />
          <Area label="Fanaka dimy" value={arap?.fanaka_dimy} onChange={(v: any) => setArap({ ...arap, fanaka_dimy: v })} />
          <Field label="Score fanaka dimy" type="number" value={arap?.fanaka_score} onChange={(v: any) => setArap({ ...arap, fanaka_score: v })} />
          <Area label="Fanamby ara-panahy 140 andro" value={arap?.fanamby_140_andro} onChange={(v: any) => setArap({ ...arap, fanamby_140_andro: v })} />
          <Field label="Score fanamby" type="number" value={arap?.fanamby_score} onChange={(v: any) => setArap({ ...arap, fanamby_score: v })} />
          <Area label="Olana ara-panabeazana" value={arap?.olana_fanabeazana} onChange={(v: any) => setArap({ ...arap, olana_fanabeazana: v })} />
          <Field label="Score olana" type="number" value={arap?.olana_score} onChange={(v: any) => setArap({ ...arap, olana_score: v })} />
          <Area label="Paikady ara-panabeazana 140 andro" value={arap?.paikady_140_andro} onChange={(v: any) => setArap({ ...arap, paikady_140_andro: v })} />
          <Field label="Score paikady" type="number" value={arap?.paikady_score} onChange={(v: any) => setArap({ ...arap, paikady_score: v })} />

          <div style={styles.actions}>
            <button
              style={styles.button}
              onClick={() =>
                saveVaomiera("vti_vaomiera_arapanahy_fanabeazana", {
                  ...arap,
                  total_score:
                    Number(arap?.mivory_score || 0) +
                    Number(arap?.ora_score || 0) +
                    Number(arap?.herinandro_score || 0) +
                    Number(arap?.fanaka_score || 0) +
                    Number(arap?.fanamby_score || 0) +
                    Number(arap?.olana_score || 0) +
                    Number(arap?.paikady_score || 0),
                }, setArap)
              }
            >
              Enregistrer
            </button>
            <button style={styles.secondaryButton} onClick={() => setMode("menu")}>Annuler</button>
          </div>
        </section>
      </main>
    );
  }

  if (vti && mode === "toekarena") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>Modifier Vaomiera Fandraharahana sy Toekarena</h1>

          <Field label="Score fivoriana" type="number" value={toek?.mivory_score} onChange={(v: any) => setToek({ ...toek, mivory_score: v })} />
          <Field label="Score ora iasana" type="number" value={toek?.ora_score} onChange={(v: any) => setToek({ ...toek, ora_score: v })} />
          <Area label="Olana ara-toekarena" value={toek?.olana_toekarena} onChange={(v: any) => setToek({ ...toek, olana_toekarena: v })} />
          <Field label="Score olana" type="number" value={toek?.olana_score} onChange={(v: any) => setToek({ ...toek, olana_score: v })} />
          <Area label="Paikady ara-toekarena 140 andro" value={toek?.paikady_toekarena} onChange={(v: any) => setToek({ ...toek, paikady_toekarena: v })} />
          <Field label="Score paikady" type="number" value={toek?.paikady_score} onChange={(v: any) => setToek({ ...toek, paikady_score: v })} />

          <div style={styles.actions}>
            <button
              style={styles.button}
              onClick={() =>
                saveVaomiera("vti_vaomiera_fandraharahana_toekarena", {
                  ...toek,
                  total_score:
                    Number(toek?.mivory_score || 0) +
                    Number(toek?.ora_score || 0) +
                    Number(toek?.olana_score || 0) +
                    Number(toek?.paikady_score || 0),
                }, setToek)
              }
            >
              Enregistrer
            </button>
            <button style={styles.secondaryButton} onClick={() => setMode("menu")}>Annuler</button>
          </div>
        </section>
      </main>
    );
  }

  if (vti && mode === "fahasalamana") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>Modifier Vaomiera Fahasalamana sy Fiarovana</h1>

          <Field label="Score fivoriana" type="number" value={fahas?.mivory_score} onChange={(v: any) => setFahas({ ...fahas, mivory_score: v })} />
          <Field label="Score ora iasana" type="number" value={fahas?.ora_score} onChange={(v: any) => setFahas({ ...fahas, ora_score: v })} />
          <Area label="Olana ara-pahasalamana" value={fahas?.olana_fahasalamana} onChange={(v: any) => setFahas({ ...fahas, olana_fahasalamana: v })} />
          <Field label="Score olana fahasalamana" type="number" value={fahas?.olana_fahasalamana_score} onChange={(v: any) => setFahas({ ...fahas, olana_fahasalamana_score: v })} />
          <Area label="Voina manimba taranaka" value={fahas?.voina_tanora} onChange={(v: any) => setFahas({ ...fahas, voina_tanora: v })} />
          <Field label="Score voina" type="number" value={fahas?.voina_score} onChange={(v: any) => setFahas({ ...fahas, voina_score: v })} />
          <Area label="Paikady Fahasalamana sy Fiarovana 140 andro" value={fahas?.paikady_fahasalamana} onChange={(v: any) => setFahas({ ...fahas, paikady_fahasalamana: v })} />
          <Field label="Score paikady" type="number" value={fahas?.paikady_score} onChange={(v: any) => setFahas({ ...fahas, paikady_score: v })} />

          <div style={styles.actions}>
            <button
              style={styles.button}
              onClick={() =>
                saveVaomiera("vti_vaomiera_fahasalamana_fiarovana", {
                  ...fahas,
                  total_score:
                    Number(fahas?.mivory_score || 0) +
                    Number(fahas?.ora_score || 0) +
                    Number(fahas?.olana_fahasalamana_score || 0) +
                    Number(fahas?.voina_score || 0) +
                    Number(fahas?.paikady_score || 0),
                }, setFahas)
              }
            >
              Enregistrer
            </button>
            <button style={styles.secondaryButton} onClick={() => setMode("menu")}>Annuler</button>
          </div>
        </section>
      </main>
    );
  }

  if (vti && mode === "etika") {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.titleSmall}>Modifier Vaomiera Etika sy Fampandrosoana Maharitra</h1>

          <Field label="Score fivoriana" type="number" value={etika?.mivory_score} onChange={(v: any) => setEtika({ ...etika, mivory_score: v })} />
          <Field label="Score ora iasana" type="number" value={etika?.ora_score} onChange={(v: any) => setEtika({ ...etika, ora_score: v })} />
          <Area label="Olana fandriampahalemana sy kolikoly" value={etika?.olana_fandriampahalemana} onChange={(v: any) => setEtika({ ...etika, olana_fandriampahalemana: v })} />
          <Field label="Score fandriampahalemana" type="number" value={etika?.olana_fandriampahalemana_score} onChange={(v: any) => setEtika({ ...etika, olana_fandriampahalemana_score: v })} />
          <Area label="Olana tontolo iainana" value={etika?.olana_tontolo_iainana} onChange={(v: any) => setEtika({ ...etika, olana_tontolo_iainana: v })} />
          <Field label="Score tontolo iainana" type="number" value={etika?.olana_tontolo_iainana_score} onChange={(v: any) => setEtika({ ...etika, olana_tontolo_iainana_score: v })} />
          <Area label="Paikady Etika sy Fampandrosoana Maharitra" value={etika?.paikady_etika} onChange={(v: any) => setEtika({ ...etika, paikady_etika: v })} />
          <Field label="Score paikady" type="number" value={etika?.paikady_score} onChange={(v: any) => setEtika({ ...etika, paikady_score: v })} />

          <div style={styles.actions}>
            <button
              style={styles.button}
              onClick={() =>
                saveVaomiera("vti_vaomiera_etika_fampandrosoana", {
                  ...etika,
                  olana_score:
                    Number(etika?.olana_fandriampahalemana_score || 0) +
                    Number(etika?.olana_tontolo_iainana_score || 0),
                  total_score:
                    Number(etika?.mivory_score || 0) +
                    Number(etika?.ora_score || 0) +
                    Number(etika?.olana_fandriampahalemana_score || 0) +
                    Number(etika?.olana_tontolo_iainana_score || 0) +
                    Number(etika?.paikady_score || 0),
                }, setEtika)
              }
            >
              Enregistrer
            </button>
            <button style={styles.secondaryButton} onClick={() => setMode("menu")}>Annuler</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Modifier / Compléter Fiche ID VTI</h1>

        <label style={styles.label}>Ampidiro ny ID VTI</label>
        <input
          style={styles.input}
          type="number"
          value={idVti}
          onChange={(e) => setIdVti(e.target.value)}
          placeholder="Ohatra : 1"
        />

        <div style={styles.actions}>
          <button style={styles.button} onClick={chargerVti}>
            Charger ID VTI
          </button>

          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>

        {vti && mode === "menu" && (
          <>
            <hr />
            <h2>Fiche VTI hita</h2>
            <p><strong>ID VTI :</strong> {vti.id}</p>
            <p><strong>Anaran’ny VTI :</strong> {vti.nom_vti}</p>
            <p><strong>Faritra :</strong> {vti.faritra}</p>
            <p><strong>Distrika :</strong> {vti.distrika}</p>
            <p><strong>Kaomina :</strong> {vti.kaomina}</p>
            <p><strong>Type Kaomina :</strong> {vti.type_kaomina}</p>
            <p><strong>Fokontany :</strong> {vti.fokontany}</p>
            <p><strong>Isan’ny mponina :</strong> {vti.isan_mponina}</p>

            <div style={styles.actions}>
              <button style={styles.button} onClick={() => setMode("identite")}>
                Modifier Identité VTI
              </button>

              <button style={styles.secondaryButton} onClick={() => chargerVaomiera("arapanahy")}>
                Modifier Vaomiera Ara-panahy sy Fanabeazana
              </button>

              <button style={styles.secondaryButton} onClick={() => chargerVaomiera("toekarena")}>
                Modifier Vaomiera Fandraharahana sy Toekarena
              </button>

              <button style={styles.secondaryButton} onClick={() => chargerVaomiera("fahasalamana")}>
                Modifier Vaomiera Fahasalamana sy Fiarovana
              </button>

              <button style={styles.secondaryButton} onClick={() => chargerVaomiera("etika")}>
                Modifier Vaomiera Etika sy Fampandrosoana Maharitra
              </button>
            </div>
          </>
        )}
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
  const [nomVti, setNomVti] = useState("");
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
          nom_vti: nomVti || "",
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

    alert(
      "Identité Tanora voatahiry tsara ! ID Tanora : " +
        data.id
    );

    onNext();
  };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Famantarana ny Tanora
        </h1>

        <label style={styles.label}>
          ID VTI mifandray
        </label>

        <input
          style={styles.input}
          type="number"
          value={vtiId}
          onChange={(e) => setVtiId(e.target.value)}
          placeholder="Ampidiro eto ny ID VTI"
        />

        <label style={styles.label}>
          Anaran'ny VTI
        </label>

        <input
          style={styles.input}
          value={nomVti}
          onChange={(e) => setNomVti(e.target.value)}
          placeholder="Ohatra : VTI Betela Marofarihy"
        />

        <label style={styles.label}>
          Vaomiera misy azy
        </label>

        <input
          style={styles.input}
          value={vaomieraMisyAzy}
          onChange={(e) =>
            setVaomieraMisyAzy(e.target.value)
          }
          placeholder="Ara-panahy / Fandraharahana / Fahasalamana / Etika"
        />

        <label style={styles.label}>
          Anarana
        </label>

        <input
          style={styles.input}
          value={anarana}
          onChange={(e) =>
            setAnarana(e.target.value)
          }
        />

        <label style={styles.label}>
          Taona
        </label>

        <input
          style={styles.input}
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label style={styles.label}>
          Lahy / Vavy
        </label>

        <select
          style={styles.input}
          value={sexe}
          onChange={(e) => setSexe(e.target.value)}
        >
          <option value="">Safidio</option>
          <option value="Lahy">Lahy</option>
          <option value="Vavy">Vavy</option>
        </select>

        <label style={styles.label}>
          Faritra
        </label>

        <input
          style={styles.input}
          value={faritra}
          onChange={(e) =>
            setFaritra(e.target.value)
          }
        />

        <label style={styles.label}>
          Distrika
        </label>

        <input
          style={styles.input}
          value={distrika}
          onChange={(e) =>
            setDistrika(e.target.value)
          }
        />

        <label style={styles.label}>
          Type de Kaomina
        </label>

        <select
          style={styles.input}
          value={typeKaomina}
          onChange={(e) =>
            setTypeKaomina(e.target.value)
          }
        >
          <option value="Ambanivohitra">
            Kaomina Ambanivohitra
          </option>

          <option value="Andrenivohitra">
            Kaomina Andrenivohitra
          </option>
        </select>

        <label style={styles.label}>
          Kaomina
        </label>

        <input
          style={styles.input}
          value={kaomina}
          onChange={(e) =>
            setKaomina(e.target.value)
          }
        />

        <label style={styles.label}>
          Fokontany
        </label>

        <input
          style={styles.input}
          value={fokontany}
          onChange={(e) =>
            setFokontany(e.target.value)
          }
        />

        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={onBack}
          >
            Miverina
          </button>

          <button
            style={styles.button}
            onClick={enregistrerIdentite}
          >
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
    filieres.map(() => ({ tany: 0, fiofanana: 0, ezaka: 0, tohana: 0, economie: 0 }))
  );

  const [reponses, setReponses] = useState(
    filieres.map(() => ({ fananantany: "", fiofanana: "", ezaka: "", tohana: "", diagnostic: "" }))
  );

  useEffect(() => {
    const chargerAnciennesDonnees = async () => {
      if (!tanoraId) return;
      const id = Number(tanoraId);

      const { data: unitesData } = await supabase
        .from("taniketsa_unites")
        .select("*")
        .eq("tanora_id", id)
        .order("id", { ascending: false });

      const { data: repData } = await supabase
        .from("reponses_taniketsa_detaillees")
        .select("*")
        .eq("tanora_id", id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: scoreData } = await supabase
        .from("scores")
        .select("*")
        .eq("tanora_id", id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      const newSelected = Array(5).fill(false);
      const newUnits = filieres.map(() => [0, 0, 0]);
      const newScores = filieres.map(() => ({ tany: 0, fiofanana: 0, ezaka: 0, tohana: 0, economie: 0 }));
      const newReponses = filieres.map(() => ({ fananantany: "", fiofanana: "", ezaka: "", tohana: "", diagnostic: "" }));

      filieres.forEach((f, i) => {
        const ligne = (unitesData || []).find((u: any) => u.type_taniketsa === f.type);

        if (ligne) {
          newSelected[i] = true;
          newUnits[i] = [
            Number(ligne.unite_annee_1 || 0),
            Number(ligne.unite_annee_2 || 0),
            Number(ligne.unite_annee_3 || 0),
          ];
        }
      });

      if (repData) {
        const keys = [
          "voly_rakotra",
          "vary",
          "akoho_gasy",
          "kisoa",
          "tantely",
        ];

        keys.forEach((key, i) => {
          newReponses[i] = {
            fananantany: repData[`${key}_fananantany`] || "",
            fiofanana: repData[`${key}_fiofanana`] || "",
            ezaka: repData[`${key}_ezaka`] || "",
            tohana: repData[`${key}_tohana`] || "",
            diagnostic: repData[`${key}_diagnostic`] || "",
          };

          if (
            newReponses[i].fananantany ||
            newReponses[i].fiofanana ||
            newReponses[i].ezaka ||
            newReponses[i].tohana ||
            newReponses[i].diagnostic
          ) {
            newSelected[i] = true;
          }
        });
      }

      if (scoreData) {
        newScores[0].economie = Number(scoreData.score_voly_rakotra || 0);
        newScores[1].economie = Number(scoreData.score_vary || 0);
        newScores[2].economie = Number(scoreData.score_akoho_gasy || 0);
        newScores[3].economie = Number(scoreData.score_kisoa || 0);
        newScores[4].economie = Number(scoreData.score_tantely || 0);
      }

      setSelected(newSelected);
      setUnits(newUnits);
      setScores(newScores);
      setReponses(newReponses);
    };

    chargerAnciennesDonnees();
  }, [tanoraId]);

  const updateSelected = (i: number, checked: boolean) => {
    const copy = [...selected];
    copy[i] = checked;
    setSelected(copy);
  };

  const updateUnit = (i: number, year: number, value: number) => {
    const copy = units.map((row) => [...row]);
    copy[i][year] = Number(value || 0);
    setUnits(copy);
  };

  const updateScore = (i: number, key: string, value: number) => {
    const copy = scores.map((s) => ({ ...s }));
    copy[i] = { ...copy[i], [key]: Number(value || 0) };
    setScores(copy);
  };

  const updateReponse = (i: number, key: string, value: string) => {
    const copy = reponses.map((r) => ({ ...r }));
    copy[i] = { ...copy[i], [key]: value };
    setReponses(copy);
  };

  const scoreFiliere = (i: number) =>
    Number(scores[i].tany || 0) +
    Number(scores[i].fiofanana || 0) +
    Number(scores[i].ezaka || 0) +
    Number(scores[i].tohana || 0) +
    Number(scores[i].economie || 0);

  const getUniteAnnee = (i: number, year: number) => {
    const f = filieres[i];

    if (f.type === "akoho") {
      const initialHouses = Number(units[i][0] || 0);
      if (year === 0) return initialHouses;
      if (year === 1) return initialHouses * 6;
      return initialHouses * 36;
    }

    return Number(units[i][year] || 0);
  };

  const yearData = (i: number, year: number) => {
    const f = filieres[i];

    if (f.type === "akoho") {
      const activeHouses = getUniteAnnee(i, year);
      const totalPoussins = activeHouses * 160;
      const reinvestis = totalPoussins * 0.25;
      const vendus = totalPoussins * 0.75;
      const ca = vendus * 16000;
      const dep = vendus * 7000 + (year === 0 ? Number(units[i][0] || 0) * 430000 : 0);

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: `${activeHouses.toLocaleString()} tranon’akoho actifs ; ${totalPoussins.toLocaleString()} poussins ; ${reinvestis.toLocaleString()} réinvestis ; ${vendus.toLocaleString()} amidy`,
      };
    }

    if (f.type === "tantely") {
      const ruchesActives = Number(units[i][year] || 0);
      const ruchesAvant = year === 0 ? 0 : Number(units[i][year - 1] || 0);
      const ruchesNouvelles = Math.max(ruchesActives - ruchesAvant, 0);
      const ruchesAnciennes = ruchesActives - ruchesNouvelles;

      const caParRuche = 42 * 9000;
      const dep = ruchesNouvelles * 295000 + ruchesAnciennes * 135000;
      const ca = ruchesActives * caParRuche;

      return {
        ca,
        dep,
        benefice: ca - dep,
        detail: `${ruchesActives} tohontantely actifs ; ${ruchesNouvelles} vaovao ; ${ruchesAnciennes} efa nisy`,
      };
    }

    const n = Number(units[i][year] || 0);
    const ca = n * f.caRef[year];
    const dep = n * f.depRef[year];

    return {
      ca,
      dep,
      benefice: ca - dep,
      detail: `${n} ${f.unitName} × référence Taona ${year + 1}`,
    };
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
    return sum + Number(s.economie || 0);
  }, 0);

  const sauvegarderScoresTaniketsa = async () => {
    if (!tanoraId) {
      alert("ID Tanora tsy hita.");
      return;
    }

    const id = Number(tanoraId);

    await supabase.from("taniketsa_unites").delete().eq("tanora_id", id);
    await supabase.from("economies_taniketsa").delete().eq("tanora_id", id);
    await supabase.from("reponses_taniketsa_detaillees").delete().eq("tanora_id", id);

    const { error: scoreError } = await supabase.from("scores").upsert(
      {
        tanora_id: id,
        score_taniketsa: totalScore,
        score_economie: totalEconomie,
        score_taniketsa_max: maxScore,
        score_voly_rakotra: selected[0] ? scoreFiliere(0) : 0,
        score_vary: selected[1] ? scoreFiliere(1) : 0,
        score_akoho_gasy: selected[2] ? scoreFiliere(2) : 0,
        score_kisoa: selected[3] ? scoreFiliere(3) : 0,
        score_tantely: selected[4] ? scoreFiliere(4) : 0,
      },
      { onConflict: "tanora_id" }
    );

    if (scoreError) {
      alert("Erreur Scores : " + JSON.stringify(scoreError));
      return;
    }

    const { error: ecoError } = await supabase.from("economies_taniketsa").insert([
      {
        tanora_id: id,
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

    const unitesPayload = filieres
      .map((f, i) => {
        if (!selected[i]) return null;

        const y1 = yearData(i, 0);
        const y2 = yearData(i, 1);
        const y3 = yearData(i, 2);

        return {
          tanora_id: id,
          type_taniketsa: f.type,
          unite_label: f.unitName,
          unite_annee_1: getUniteAnnee(i, 0),
          unite_annee_2: getUniteAnnee(i, 1),
          unite_annee_3: getUniteAnnee(i, 2),
          ca_annee_1: y1.ca,
          depenses_annee_1: y1.dep,
          benefice_annee_1: y1.benefice,
          ca_annee_2: y2.ca,
          depenses_annee_2: y2.dep,
          benefice_annee_2: y2.benefice,
          ca_annee_3: y3.ca,
          depenses_annee_3: y3.dep,
          benefice_annee_3: y3.benefice,
          score_filiere: scoreFiliere(i),
        };
      })
      .filter(Boolean);

    const { error: unitesError } = await supabase
  .from("taniketsa_unites")
  .upsert(unitesPayload, {
    onConflict: "tanora_id,type_taniketsa",
  });

    if (unitesError) {
      alert("Erreur Unités Taniketsa : " + JSON.stringify(unitesError));
      return;
    }

    const { error: repError } = await supabase.from("reponses_taniketsa_detaillees").insert([
      {
        tanora_id: id,
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

    alert("Tombana Taniketsa voatahiry tsara, avec pré-remplissage et sans doublon !");
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
                <input
                  type="checkbox"
                  checked={selected[i]}
                  onChange={(e) => updateSelected(i, e.target.checked)}
                />
                Safidio ity Taniketsa ity : {f.name}
              </label>

              {selected[i] && (
                <>
                  <h3 style={styles.sectionTitle}>{i + 1}. {f.name}</h3>

                  {f.type === "akoho" && (
                    <>
                      <label style={styles.label}>{f.unitQuestion}</label>
                      <input
                        style={styles.input}
                        type="number"
                        min="0"
                        value={units[i][0]}
                        onChange={(e) => updateUnit(i, 0, Number(e.target.value))}
                      />
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
                            <input
                              style={styles.input}
                              type="number"
                              min="0"
                              value={units[i][year]}
                              onChange={(e) => updateUnit(i, year, Number(e.target.value))}
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
                  <textarea style={styles.textarea} value={reponses[i].fananantany} onChange={(e) => updateReponse(i, "fananantany", e.target.value)} />
                  <ScoreSelect label="Score fananantany" max={5} onChange={(v: number) => updateScore(i, "tany", v)} />

                  <h4 style={styles.sectionTitle}>B. Fiofanana — 15 points</h4>
                  <textarea style={styles.textarea} value={reponses[i].fiofanana} onChange={(e) => updateReponse(i, "fiofanana", e.target.value)} />
                  <ScoreSelect label="Score fiofanana" max={15} onChange={(v: number) => updateScore(i, "fiofanana", v)} />

                  <h4 style={styles.sectionTitle}>C. Ezaka sy anjara biriky — 20 points</h4>
                  <textarea style={styles.textarea} value={reponses[i].ezaka} onChange={(e) => updateReponse(i, "ezaka", e.target.value)} />
                  <ScoreSelect label="Score ezaka sy anjara biriky" max={20} onChange={(v: number) => updateScore(i, "ezaka", v)} />

                  <h4 style={styles.sectionTitle}>D. Tohana ilaina — 5 points</h4>
                  <textarea style={styles.textarea} value={reponses[i].tohana} onChange={(e) => updateReponse(i, "tohana", e.target.value)} />
                  <ScoreSelect label="Score tohana ilaina" max={5} onChange={(v: number) => updateScore(i, "tohana", v)} />

                  <h4 style={styles.sectionTitle}>E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points</h4>
                  <textarea style={styles.textarea} value={reponses[i].diagnostic} onChange={(e) => updateReponse(i, "diagnostic", e.target.value)} />
                  <ScoreSelect label="Score diagnostic ara-toekarena sy ara-pitantanana" max={10} onChange={(v: number) => updateScore(i, "economie", v)} />

                  <h2 style={styles.score}>Score {f.name} : {score} / 55</h2>
                </>
              )}
            </div>
          );
        })}

        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onBack}>Miverina</button>
          <button style={styles.button} onClick={sauvegarderScoresTaniketsa}>Vita ny Tombana</button>
        </div>
      </section>
    </main>
  );
}
function ModifierCompleterTanora({ onBack }: any) {
  const [idTanora, setIdTanora] = useState("");
  const [tanora, setTanora] = useState<any>(null);
  const [mode, setMode] = useState<"menu" | "identite" | "spirituel" | "vti" | "taniketsa">("menu");

  const chargerTanora = async () => {
    const id = Number(idTanora);
    if (!id) {
      alert("Ampidiro aloha ny ID Tanora.");
      return;
    }

    const { data, error } = await supabase
      .from("tanora")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      alert("Tsy hita ny ID Tanora : " + JSON.stringify(error));
      return;
    }

    setTanora(data);
    setMode("menu");
  };

  const ouvrirSpirituel = async () => {
    if (!tanora?.id) return;
    await supabase.from("reponses_spirituel").delete().eq("tanora_id", tanora.id);
    setMode("spirituel");
  };

  const ouvrirVti = async () => {
    if (!tanora?.id) return;
    await supabase.from("reponses_vti").delete().eq("tanora_id", tanora.id);
    setMode("vti");
  };

  const ouvrirTaniketsa = async () => {
    if (!tanora?.id) return;

    const ok = confirm(
      "Hofafana aloha ny anciennes données Taniketsa an’ity ID Tanora ity, dia hosoloina vaovao. Hanohy ve ianao ?"
    );
    if (!ok) return;

    await supabase.from("taniketsa_unites").delete().eq("tanora_id", tanora.id);
    await supabase.from("economies_taniketsa").delete().eq("tanora_id", tanora.id);
    await supabase.from("reponses_taniketsa_detaillees").delete().eq("tanora_id", tanora.id);

    setMode("taniketsa");
  };

  const enregistrerIdentite = async () => {
    if (!tanora?.id) return;

    const { error } = await supabase
      .from("tanora")
      .update({
        anarana: tanora.anarana,
        taona: Number(tanora.taona || 0),
        sexe: tanora.sexe,
        faritra: tanora.faritra,
        distrika: tanora.distrika,
        type_kaomina: tanora.type_kaomina,
        kaomina: tanora.kaomina,
        fokontany: tanora.fokontany,
        vti_id: tanora.vti_id ? Number(tanora.vti_id) : null,
        nom_vti: tanora.nom_vti || "",
        vaomiera_misy_azy: tanora.vaomiera_misy_azy || "",
      })
      .eq("id", tanora.id);

    if (error) {
      alert("Erreur modification identité : " + JSON.stringify(error));
      return;
    }

    alert("Identité Tanora nohavaozina tsara.");
    setMode("menu");
  };

  if (mode === "spirituel" && tanora?.id) {
    return (
      <SpirituelForm
        tanoraId={tanora.id}
        onBack={() => setMode("menu")}
        onNext={() => setMode("menu")}
      />
    );
  }

  if (mode === "vti" && tanora?.id) {
    return (
      <VtiForm
        tanoraId={tanora.id}
        onBack={() => setMode("menu")}
        onNext={() => setMode("menu")}
      />
    );
  }

  if (mode === "taniketsa" && tanora?.id) {
    return (
      <TaniketsaForm
        tanoraId={tanora.id}
        onBack={() => setMode("menu")}
      />
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>Modifier / Compléter Fiche ID Tanora</h1>

        <label style={styles.label}>Ampidiro ny ID Tanora</label>
        <input
          style={styles.input}
          type="number"
          value={idTanora}
          onChange={(e) => setIdTanora(e.target.value)}
          placeholder="Ohatra : 2"
        />

        <div style={styles.actions}>
          <button style={styles.button} onClick={chargerTanora}>
            Charger ID Tanora
          </button>

          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>

        {tanora && mode === "menu" && (
          <>
            <hr />

            <h2>Fiche hita</h2>
            <p><strong>ID Tanora :</strong> {tanora.id}</p>
            <p><strong>Anarana :</strong> {tanora.anarana}</p>
            <p><strong>Taona :</strong> {tanora.taona}</p>
            <p><strong>Lahy / Vavy :</strong> {tanora.sexe}</p>
            <p><strong>VTI ID :</strong> {tanora.vti_id}</p>
            <p><strong>Anaran’ny VTI :</strong> {tanora.nom_vti}</p>
            <p><strong>Vaomiera misy azy :</strong> {tanora.vaomiera_misy_azy}</p>

            <div style={styles.actions}>
              <button style={styles.button} onClick={() => setMode("identite")}>
                Modifier Identité Tanora
              </button>

              <button style={styles.secondaryButton} onClick={ouvrirSpirituel}>
                Modifier Ara-panahy
              </button>

              <button style={styles.secondaryButton} onClick={ouvrirVti}>
                Modifier Function VTI
              </button>

              <button style={styles.secondaryButton} onClick={ouvrirTaniketsa}>
                Modifier / Compléter Taniketsa
              </button>
            </div>
          </>
        )}

        {tanora && mode === "identite" && (
          <>
            <hr />
            <h2>Modifier Identité Tanora</h2>

            <label style={styles.label}>Anarana</label>
            <input
              style={styles.input}
              value={tanora.anarana || ""}
              onChange={(e) => setTanora({ ...tanora, anarana: e.target.value })}
            />

            <label style={styles.label}>Taona</label>
            <input
              style={styles.input}
              type="number"
              value={tanora.taona || ""}
              onChange={(e) => setTanora({ ...tanora, taona: e.target.value })}
            />

            <label style={styles.label}>Lahy / Vavy</label>
            <select
              style={styles.input}
              value={tanora.sexe || ""}
              onChange={(e) => setTanora({ ...tanora, sexe: e.target.value })}
            >
              <option value="">Safidio</option>
              <option value="Lahy">Lahy</option>
              <option value="Vavy">Vavy</option>
            </select>

            <label style={styles.label}>Faritra</label>
            <input
              style={styles.input}
              value={tanora.faritra || ""}
              onChange={(e) => setTanora({ ...tanora, faritra: e.target.value })}
            />

            <label style={styles.label}>Distrika</label>
            <input
              style={styles.input}
              value={tanora.distrika || ""}
              onChange={(e) => setTanora({ ...tanora, distrika: e.target.value })}
            />

            <label style={styles.label}>Type de Kaomina</label>
            <select
              style={styles.input}
              value={tanora.type_kaomina || ""}
              onChange={(e) => setTanora({ ...tanora, type_kaomina: e.target.value })}
            >
              <option value="Ambanivohitra">Kaomina Ambanivohitra</option>
              <option value="Andrenivohitra">Kaomina Andrenivohitra</option>
            </select>

            <label style={styles.label}>Kaomina</label>
            <input
              style={styles.input}
              value={tanora.kaomina || ""}
              onChange={(e) => setTanora({ ...tanora, kaomina: e.target.value })}
            />

            <label style={styles.label}>Fokontany</label>
            <input
              style={styles.input}
              value={tanora.fokontany || ""}
              onChange={(e) => setTanora({ ...tanora, fokontany: e.target.value })}
            />

            <label style={styles.label}>ID VTI</label>
            <input
              style={styles.input}
              type="number"
              value={tanora.vti_id || ""}
              onChange={(e) => setTanora({ ...tanora, vti_id: e.target.value })}
            />

            <label style={styles.label}>Anaran’ny VTI</label>
            <input
              style={styles.input}
              value={tanora.nom_vti || ""}
              onChange={(e) => setTanora({ ...tanora, nom_vti: e.target.value })}
            />

            <label style={styles.label}>Vaomiera misy azy</label>
            <input
              style={styles.input}
              value={tanora.vaomiera_misy_azy || ""}
              onChange={(e) =>
                setTanora({ ...tanora, vaomiera_misy_azy: e.target.value })
              }
            />

            <div style={styles.actions}>
              <button style={styles.button} onClick={enregistrerIdentite}>
                Enregistrer modification identité
              </button>

              <button style={styles.secondaryButton} onClick={() => setMode("menu")}>
                Annuler
              </button>
            </div>
          </>
        )}
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
  const [unitesTaniketsa, setUnitesTaniketsa] = useState<any[]>([]);

  const [vtiLie, setVtiLie] = useState<any>(null);
  const [annexeVaomiera, setAnnexeVaomiera] = useState<any>(null);
  const [annexeTitre, setAnnexeTitre] = useState("");
  const [annexeType, setAnnexeType] = useState("");

  const show = (v: any) =>
    v === null || v === undefined || v === "" ? "—" : String(v);

  const money = (v: any) =>
    Number(v || 0).toLocaleString("fr-FR") + " Ar";

  const extractPoints = (value: any) => {
    const text = String(value || "");
    const match = text.match(/—\s*(\d+)\s*point/i);
    return match ? Number(match[1]) : 0;
  };

  const getUnites = (type: string) => {
    const lignes = unitesTaniketsa
      .filter((u: any) => u.type_taniketsa === type)
      .sort((a: any, b: any) => Number(b.id || 0) - Number(a.id || 0));

    return lignes[0];
  };

  const totalSpirituelCalcule =
    extractPoints(repSpirituel?.spirituel_q1) +
    extractPoints(repSpirituel?.spirituel_q2) +
    extractPoints(repSpirituel?.spirituel_q3) +
    extractPoints(repSpirituel?.spirituel_q4) +
    extractPoints(repSpirituel?.spirituel_q5) +
    extractPoints(repSpirituel?.spirituel_q6) +
    extractPoints(repSpirituel?.spirituel_q7);

  const totalVtiCalcule =
    extractPoints(repVti?.vti_q1) +
    extractPoints(repVti?.vti_q2) +
    extractPoints(repVti?.vti_q3) +
    extractPoints(repVti?.vti_q4) +
    extractPoints(repVti?.vti_q5);

  const chargerFiche = async () => {
    const tanoraId = Number(id);

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
    setUnitesTaniketsa([]);
    setVtiLie(null);
    setAnnexeVaomiera(null);
    setAnnexeTitre("");
    setAnnexeType("");

    const { data: tanoraData, error: tanoraError } = await supabase
      .from("tanora")
      .select("*")
      .eq("id", tanoraId)
      .maybeSingle();

    if (tanoraError || !tanoraData) {
      alert("Tsy hita ny ID Tanora : " + JSON.stringify(tanoraError));
      return;
    }

    const { data: scoresData } = await supabase
      .from("scores")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: ecoData } = await supabase
      .from("economies_taniketsa")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: repData } = await supabase
      .from("reponses_taniketsa_detaillees")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: unitesData } = await supabase
      .from("taniketsa_unites")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false });

    const { data: spirituelData } = await supabase
      .from("reponses_spirituel")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: vtiData } = await supabase
      .from("reponses_vti")
      .select("*")
      .eq("tanora_id", tanoraId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    setTanora(tanoraData);
    setScores(scoresData);
    setEco(ecoData);
    setRep(repData);
    setUnitesTaniketsa(unitesData || []);
    setRepSpirituel(spirituelData);
    setRepVti(vtiData);

    const vtiId = Number(tanoraData?.vti_id || 0);

    if (vtiId) {
      const { data: vtiLieData } = await supabase
        .from("vti")
        .select("*")
        .eq("id", vtiId)
        .maybeSingle();

      setVtiLie(vtiLieData);

      const vaomieraSource = String(
        tanoraData?.vaomiera_misy_azy || vtiData?.vti_q5 || ""
      ).toLowerCase();

      let tableVaomiera = "";
      let titreVaomiera = "";
      let typeVaomiera = "";

      if (
        vaomieraSource.includes("ara-panahy") ||
        vaomieraSource.includes("fanabeazana")
      ) {
        tableVaomiera = "vti_vaomiera_arapanahy_fanabeazana";
        titreVaomiera = "Vaomiera Ara-panahy sy fanabeazana";
        typeVaomiera = "arapanahy";
      } else if (
        vaomieraSource.includes("fandraharahana") ||
        vaomieraSource.includes("toekarena")
      ) {
        tableVaomiera = "vti_vaomiera_fandraharahana_toekarena";
        titreVaomiera = "Vaomiera Fandraharahana sy Toekarena";
        typeVaomiera = "toekarena";
      } else if (
        vaomieraSource.includes("fahasalamana") ||
        vaomieraSource.includes("fiarovana")
      ) {
        tableVaomiera = "vti_vaomiera_fahasalamana_fiarovana";
        titreVaomiera = "Vaomiera Fahasalamana sy Fiarovana ny tanora";
        typeVaomiera = "fahasalamana";
      } else if (
        vaomieraSource.includes("etika") ||
        vaomieraSource.includes("fampandrosoana")
      ) {
        tableVaomiera = "vti_vaomiera_etika_fampandrosoana";
        titreVaomiera = "Vaomiera Etika Fampandrosoana maharitra";
        typeVaomiera = "etika";
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
        setAnnexeType(typeVaomiera);
        setAnnexeVaomiera(vaomieraData);
      }
    }
  };

  const Champ = ({ label, value }: any) => (
    <p>
      <strong>{label} :</strong> {show(value)}
    </p>
  );

  const LigneQuestion = ({ numero, question, reponse }: any) => (
    <div style={styles.miniBox}>
      <h4>
        {numero}. {question}
      </h4>
      <p>
        <strong>Valiny nomena :</strong> {show(reponse)}
      </p>
    </div>
  );

  const FiliereTaniketsa = ({
    titre,
    fananantany,
    fiofanana,
    ezaka,
    tohana,
    diagnostic,
    score,
    scoreMax,
    ca,
    depenses,
    benefice,
    unites,
  }: any) => {
    const hasData =
      show(fananantany) !== "—" ||
      show(fiofanana) !== "—" ||
      show(ezaka) !== "—" ||
      show(tohana) !== "—" ||
      show(diagnostic) !== "—" ||
      Number(ca || 0) > 0 ||
      Number(depenses || 0) > 0 ||
      Number(benefice || 0) !== 0 ||
      Number(unites?.unite_annee_1 || 0) > 0 ||
      Number(unites?.unite_annee_2 || 0) > 0 ||
      Number(unites?.unite_annee_3 || 0) > 0;

    if (!hasData) return null;

    return (
      <div style={styles.miniBox}>
        <h3>{titre}</h3>

        <h4>Unités prévues sur 3 ans</h4>
        <Champ
          label={`Taona 1 (${unites?.unite_label || "unité"})`}
          value={unites?.unite_annee_1 || 0}
        />
        <Champ
          label={`Taona 2 (${unites?.unite_label || "unité"})`}
          value={unites?.unite_annee_2 || 0}
        />
        <Champ
          label={`Taona 3 (${unites?.unite_label || "unité"})`}
          value={unites?.unite_annee_3 || 0}
        />

        <h4>A. Fananantany — 5 points</h4>
        <Champ label="Valiny" value={fananantany} />

        <h4>B. Fiofanana — 15 points</h4>
        <Champ label="Valiny" value={fiofanana} />

        <h4>C. Ezaka sy anjara biriky — 20 points</h4>
        <Champ label="Valiny" value={ezaka} />

        <h4>D. Tohana ilaina — 5 points</h4>
        <Champ label="Valiny" value={tohana} />

        <h4>E. Diagnostic ara-toekarena sy ara-pitantanana — 10 points</h4>
        <Champ label="Valiny" value={diagnostic} />

        <p>
          <strong>Score filière :</strong>{" "}
          {Number(score || unites?.score_filiere || 0)} / {scoreMax || 55}
        </p>

        <h4>Projection économique globale sur 3 ans</h4>
        <Champ label="CA total 3 ans" value={money(ca)} />
        <Champ label="Dépenses totales 3 ans" value={money(depenses)} />
        <Champ label="Bénéfice total 3 ans" value={money(benefice)} />
      </div>
    );
  };

 const TovanaVaomiera = () => {
  if (!tanora?.vti_id) return null;

  const ChampLong = ({ label, value }: any) => (
    <div style={styles.miniBox}>
      <h4>{label}</h4>
      <p>{show(value)}</p>
    </div>
  );

  return (
    <>
      <hr />
      <h2>TOVANA — Fiche VTI mifandray amin’ny Vaomiera misy ny Tanora</h2>

      <h3>1. Fifandraisana Tanora — VTI</h3>
      <Champ label="ID Tanora" value={tanora?.id} />
      <Champ label="Anaran’ny Tanora" value={tanora?.anarana} />
      <Champ label="ID VTI" value={tanora?.vti_id} />
      <Champ label="Anaran’ny VTI" value={tanora?.nom_vti || vtiLie?.nom_vti} />
      <Champ label="Vaomiera misy ilay Tanora" value={tanora?.vaomiera_misy_azy || repVti?.vti_q5} />

      {vtiLie && (
        <>
          <h3>2. Famantarana ny VTI</h3>
          <Champ label="VTI Anarany" value={vtiLie?.nom_vti} />
          <Champ label="Faritra" value={vtiLie?.faritra} />
          <Champ label="Distrika" value={vtiLie?.distrika} />
          <Champ label="Kaomina" value={vtiLie?.kaomina} />
          <Champ label="Karazana Kaomina" value={vtiLie?.type_kaomina} />
          <Champ label="Fokontany" value={vtiLie?.fokontany} />
        </>
      )}

      <h3>3. {annexeTitre || "Vaomiera tsy mbola voafaritra"}</h3>

      {!annexeVaomiera && (
        <p>
          Tsy mbola hita ny données feno an’io Vaomiera io ao amin’ny Tombana Iombonana VTI.
        </p>
      )}

      {annexeVaomiera && (
        <>
          <div style={styles.miniBox}>
            <Champ label="Total score Vaomiera" value={annexeVaomiera.total_score || 0} />
            <Champ label="Fivoriana" value={annexeVaomiera.mivory_score} />
            <Champ label="Ora iasana" value={annexeVaomiera.ora_score} />
          </div>

          {annexeType === "arapanahy" && (
            <>
              <Champ label="Herinandro dimy" value={annexeVaomiera.herinandro_score} />
              <ChampLong label="Fanaka dimy / Soatoavina dimy" value={annexeVaomiera.fanaka_dimy} />
              <Champ label="Score Fanaka dimy" value={annexeVaomiera.fanaka_dimy_score} />
              <ChampLong label="Fanamby ara-panahy 140 andro" value={annexeVaomiera.fanamby_140_andro} />
              <Champ label="Score Fanamby 140 andro" value={annexeVaomiera.fanamby_140_andro_score} />
              <ChampLong label="Olana ara-panabeazana" value={annexeVaomiera.olana_fanabeazana} />
              <Champ label="Score Olana ara-panabeazana" value={annexeVaomiera.olana_fanabeazana_score} />
              <ChampLong label="Paikady ara-panabeazana 140 andro" value={annexeVaomiera.paikady_140_andro} />
              <Champ label="Score Paikady ara-panabeazana" value={annexeVaomiera.paikady_140_andro_score} />
            </>
          )}

          {annexeType === "toekarena" && (
            <>
              <ChampLong label="Olana ara-toekarena" value={annexeVaomiera.olana_toekarena} />
              <Champ label="Score Olana ara-toekarena" value={annexeVaomiera.olana_toekarena_score} />
              <ChampLong label="Paikady ara-toekarena 140 andro" value={annexeVaomiera.paikady_toekarena} />
              <Champ label="Score Paikady ara-toekarena" value={annexeVaomiera.paikady_toekarena_score} />
            </>
          )}

          {annexeType === "fahasalamana" && (
            <>
              <ChampLong label="Olana ara-pahasalamana" value={annexeVaomiera.olana_fahasalamana} />
              <Champ label="Score Olana ara-pahasalamana" value={annexeVaomiera.olana_fahasalamana_score} />
              <ChampLong label="Voina manimba taranaka" value={annexeVaomiera.voina_tanora} />
              <Champ label="Score Voina manimba taranaka" value={annexeVaomiera.voina_tanora_score} />
              <ChampLong label="Vahaolana 140 andro — Fahasalamana sy Fiarovana" value={annexeVaomiera.paikady_fahasalamana} />
              <Champ label="Score Vahaolana 140 andro" value={annexeVaomiera.paikady_fahasalamana_score} />
            </>
          )}

          {annexeType === "etika" && (
            <>
              <ChampLong label="Olana fandriampahalemana sy kolikoly" value={annexeVaomiera.olana_fandriampahalemana} />
              <Champ label="Score Fandriampahalemana sy kolikoly" value={annexeVaomiera.olana_fandriampahalemana_score} />
              <ChampLong label="Olana tontolo iainana" value={annexeVaomiera.olana_tontolo_iainana} />
              <Champ label="Score Tontolo iainana" value={annexeVaomiera.olana_tontolo_iainana_score} />
              <ChampLong label="Vahaolana 140 andro — Etika sy fampandrosoana maharitra" value={annexeVaomiera.paikady_etika} />
              <Champ label="Score Vahaolana 140 andro" value={annexeVaomiera.paikady_etika_score} />
            </>
          )}
        </>
      )}
    </>
  );
};

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.titleSmall}>
          Fiche individuelle scientifique remplie
        </h1>

        <label style={styles.label}>Ampidiro ny ID Tanora</label>
        <input
          style={styles.input}
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <div style={styles.actions}>
          <button style={styles.button} onClick={chargerFiche}>
            Charger la fiche
          </button>

          <button style={styles.secondaryButton} onClick={onBack}>
            Miverina
          </button>
        </div>

        {tanora && (
          <>
            <hr />

            <h2>1. Famantarana ny Tanora</h2>
            <Champ label="ID Tanora" value={tanora.id} />
            <Champ label="Anarana" value={tanora.anarana} />
            <Champ label="Taona" value={tanora.taona} />
            <Champ label="Lahy / Vavy" value={tanora.sexe} />
            <Champ label="Faritra" value={tanora.faritra} />
            <Champ label="Distrika" value={tanora.distrika} />
            <Champ label="Type de Kaomina" value={tanora.type_kaomina} />
            <Champ label="Kaomina" value={tanora.kaomina} />
            <Champ label="Fokontany" value={tanora.fokontany} />
            <Champ label="ID VTI mifandray" value={tanora.vti_id} />
            <Champ label="Anaran’ny VTI" value={tanora.nom_vti} />
            <Champ label="Vaomiera misy azy" value={tanora.vaomiera_misy_azy} />

            <hr />

            <h2>2. Tombana ara-panahy — 52 points</h2>
            <LigneQuestion numero="1" question="Efa zatra nitokam-bavaka ve ?" reponse={repSpirituel?.spirituel_q1} />
            <LigneQuestion numero="2" question="Efa nanana fiainam-bavaka nitohy ve ?" reponse={repSpirituel?.spirituel_q2} />
            <LigneQuestion numero="3" question="Efa manao pratika ny Vavaka Betela ve ?" reponse={repSpirituel?.spirituel_q3} />
            <LigneQuestion numero="4" question="Fibebahana sy fiderana" reponse={repSpirituel?.spirituel_q4} />
            <LigneQuestion numero="5" question="Fo madio sy Fanaka dimy" reponse={repSpirituel?.spirituel_q5} />
            <LigneQuestion numero="6" question="Fandroahana devoly sy fandravana planina satanika isan’andro" reponse={repSpirituel?.spirituel_q6} />
            <LigneQuestion numero="7" question="Vavaka mamindra tendrombohitra" reponse={repSpirituel?.spirituel_q7} />

            <h3>
              Total ara-panahy : {scores?.score_arapanahy || totalSpirituelCalcule || 0} / 52
            </h3>

            <hr />

            <h2>3. Function VTI — Anjara ao amin’ny VTI</h2>
            <LigneQuestion numero="1" question="Tena tafiditra ao anaty VTI ve ilay Tanora ?" reponse={repVti?.vti_q1} />
            <LigneQuestion numero="2" question="Mahafantatra ny tanjon’ny VTI ve izy ?" reponse={repVti?.vti_q2} />
            <LigneQuestion numero="3" question="Mandray andraikitra ve izy ?" reponse={repVti?.vti_q3} />
            <LigneQuestion numero="4" question="Manana anjara biriky ve izy ?" reponse={repVti?.vti_q4} />
            <LigneQuestion numero="5" question="Vaomiera misy azy" reponse={repVti?.vti_q5 || tanora.vaomiera_misy_azy} />

            <h3>Total VTI : {scores?.score_vti || totalVtiCalcule || 0} / 29</h3>

            <hr />

            <h2>4. Taniketsa Fandraharahana</h2>

            {(rep || eco) && (
              <>
                <FiliereTaniketsa
                  titre="1. Voly rakotra 500m²"
                  fananantany={rep?.voly_rakotra_fananantany}
                  fiofanana={rep?.voly_rakotra_fiofanana}
                  ezaka={rep?.voly_rakotra_ezaka}
                  tohana={rep?.voly_rakotra_tohana}
                  diagnostic={rep?.voly_rakotra_diagnostic}
                  score={scores?.score_voly_rakotra}
                  scoreMax={55}
                  ca={eco?.ca_voly_rakotra}
                  depenses={eco?.depenses_voly_rakotra}
                  benefice={eco?.benefice_voly_rakotra}
                  unites={getUnites("voly")}
                />

                <FiliereTaniketsa
                  titre="2. Voly vary 750m²"
                  fananantany={rep?.vary_fananantany}
                  fiofanana={rep?.vary_fiofanana}
                  ezaka={rep?.vary_ezaka}
                  tohana={rep?.vary_tohana}
                  diagnostic={rep?.vary_diagnostic}
                  score={scores?.score_vary}
                  scoreMax={55}
                  ca={eco?.ca_vary}
                  depenses={eco?.depenses_vary}
                  benefice={eco?.benefice_vary}
                  unites={getUnites("vary")}
                />

                <FiliereTaniketsa
                  titre="3. Akoho gasy"
                  fananantany={rep?.akoho_gasy_fananantany}
                  fiofanana={rep?.akoho_gasy_fiofanana}
                  ezaka={rep?.akoho_gasy_ezaka}
                  tohana={rep?.akoho_gasy_tohana}
                  diagnostic={rep?.akoho_gasy_diagnostic}
                  score={scores?.score_akoho_gasy}
                  scoreMax={55}
                  ca={eco?.ca_akoho_gasy}
                  depenses={eco?.depenses_akoho_gasy}
                  benefice={eco?.benefice_akoho_gasy}
                  unites={getUnites("akoho")}
                />

                <FiliereTaniketsa
                  titre="4. Fanatavezana kisoa"
                  fananantany={rep?.kisoa_fananantany}
                  fiofanana={rep?.kisoa_fiofanana}
                  ezaka={rep?.kisoa_ezaka}
                  tohana={rep?.kisoa_tohana}
                  diagnostic={rep?.kisoa_diagnostic}
                  score={scores?.score_kisoa}
                  scoreMax={55}
                  ca={eco?.ca_kisoa}
                  depenses={eco?.depenses_kisoa}
                  benefice={eco?.benefice_kisoa}
                  unites={getUnites("kisoa")}
                />

                <FiliereTaniketsa
                  titre="5. Tantely"
                  fananantany={rep?.tantely_fananantany}
                  fiofanana={rep?.tantely_fiofanana}
                  ezaka={rep?.tantely_ezaka}
                  tohana={rep?.tantely_tohana}
                  diagnostic={rep?.tantely_diagnostic}
                  score={scores?.score_tantely}
                  scoreMax={55}
                  ca={eco?.ca_tantely}
                  depenses={eco?.depenses_tantely}
                  benefice={eco?.benefice_tantely}
                  unites={getUnites("tantely")}
                />

                <h3>Synthèse générale Taniketsa</h3>
                <Champ
                  label="Score total Taniketsa"
                  value={`${scores?.score_taniketsa || 0} / ${scores?.score_taniketsa_max || 0}`}
                />
                <Champ label="Score économie" value={scores?.score_economie || 0} />
                <Champ label="Total CA 3 ans" value={money(eco?.ca_total)} />
                <Champ label="Total dépenses 3 ans" value={money(eco?.depenses_total)} />
                <Champ label="Total bénéfice 3 ans" value={money(eco?.benefice_total)} />
              </>
            )}

            <TovanaVaomiera />

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
