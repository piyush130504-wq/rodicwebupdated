import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "@/rodic.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HERO_IMG = "https://images.unsplash.com/photo-1708357997379-e55c1636e0d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw0fHxhZXJpYWwlMjBoaWdod2F5JTIwaW50ZXJjaGFuZ2UlMjBpbmRpYSUyMGluZnJhc3RydWN0dXJlfGVufDB8fHx8MTc4MjMyNTI0NXww&ixlib=rb-4.1.0&q=85";

const SECTORS = [
  { id: "all", label: "All" },
  { id: "roads", label: "Roads" },
  { id: "bridges", label: "Bridges" },
  { id: "railways", label: "Railways" },
  { id: "urban", label: "Urban" },
  { id: "water", label: "Water" },
  { id: "power", label: "Power" },
  { id: "mining", label: "Mining" },
  { id: "agriculture", label: "Agriculture" },
  { id: "climate", label: "Climate" },
  { id: "health", label: "Health" },
  { id: "drones", label: "Drones" },
  { id: "legal", label: "Legal" },
  { id: "crosscutting", label: "Cross-Cutting" },
];

const SECTOR_LABEL = SECTORS.reduce((a, s) => ({ ...a, [s.id]: s.label }), {});

const problemStatements = [
  { sector: "roads", title: "Pavement Defect Detection from Dashcam", desc: "Edge-deployable AI on 4K dashcam feed at highway speeds — >90% precision, IRC-82 defect-code-aligned outputs, auto-NCR drafting." },
  { sector: "roads", title: "Highway Asset Inventory", desc: "Automated inventory of road furniture using LiDAR + computer vision. Reduce manual survey cycles from months to days." },
  { sector: "roads", title: "Traffic & Toll Demand Forecasting", desc: "Real-time traffic forecasting using AI. Feed directly into HAM/TOT/OMT cure-period management." },
  { sector: "roads", title: "Authority Engineer Co-Pilot", desc: "AI co-pilot with auto-NCR drafting, evidence linking, and Pavement Condition Index forecasting at corridor level." },
  { sector: "roads", title: "AI-Driven DPR Generation", desc: "Compress survey-to-DPR cycle using LiDAR + AI. Generate alignment, terrain, and quantity estimates automatically." },
  { sector: "bridges", title: "Structural Health Monitoring", desc: "IoT sensor network + AI anomaly detection for real-time bridge integrity. Vibration-based fatigue prediction." },
  { sector: "bridges", title: "Crack Detection from Drone Imagery", desc: "Computer vision on drone footage to detect cracks and corrosion. Auto-link to inspection records with blockchain anchoring." },
  { sector: "bridges", title: "Digital Twin for Tunnel Monitoring", desc: "BIM-element-level live progress tracking — per pour, weld, pier, girder, bearing — against construction schedule." },
  { sector: "bridges", title: "Smartphone-Based SHM", desc: "Phone-as-sensor edge AI for structural health monitoring. Works online and offline for low-connectivity sites." },
  { sector: "railways", title: "Track Defect Detection", desc: "On-board sensor AI for real-time track defect detection. Direct integration with maintenance scheduling systems." },
  { sector: "railways", title: "Predictive Maintenance for Rolling Stock", desc: "RAMS asset intelligence and reliability engineering for multi-structure rail corridors." },
  { sector: "railways", title: "Rail Corridor Encroachment Detection", desc: "Automated detection from satellite or drone imagery. Auto-alert pipeline to authority engineers." },
  { sector: "railways", title: "AI Risks & Compliance Agent", desc: "Compliance agent for Railway/Metro/HSR/DFC/RRTS programs. Auto-maps regulatory requirements to project status." },
  { sector: "railways", title: "Energy Optimisation", desc: "Cross-traction and station load optimisation using AI forecasting. Reduce AT&C losses on metro corridors." },
  { sector: "urban", title: "Municipal Grievance Triage", desc: "GenAI grievance handling in 12+ Indic languages for ULBs. Auto-routing to department, auto-response drafting." },
  { sector: "urban", title: "AI Tender Drafting for ULBs", desc: "AI co-pilot for urban local bodies — tender drafting, bid evaluation, and compliance checking against regulations." },
  { sector: "urban", title: "Smart Solid Waste Routing", desc: "AI-driven optimisation of solid waste collection routes. Real-time rerouting based on load and traffic." },
  { sector: "urban", title: "Building Plan Compliance", desc: "Automated building plan review against local bye-laws. Reduce approval time from weeks to hours." },
  { sector: "water", title: "Non-Revenue Water Analytics", desc: "Fuse pressure sensors, flow meters, and satellite data to identify NRW losses in city distribution networks." },
  { sector: "water", title: "Reservoir Inflow Forecasting", desc: "AI-based inflow forecasting for dams. Bias-aware handling of under-prediction of extreme precipitation." },
  { sector: "water", title: "Flood Early Warning System", desc: "Multi-agent flood defence platform with ECMWF/IMD/CWC data ingest. CAP-XML alert fan-out to field teams." },
  { sector: "water", title: "Water Quality Anomaly Detection", desc: "Real-time water quality monitoring at treatment and distribution points. Auto-alert on contamination events." },
  { sector: "power", title: "Grid Load Forecasting", desc: "Load forecasting and congestion management at DISCOM and SLDC level. Renewable integration and outage prediction." },
  { sector: "power", title: "AT&C Loss Reduction", desc: "Energy theft detection and AT&C loss reduction using AMI + ML. Smart metering anomaly detection." },
  { sector: "power", title: "India Energy Stack Application", desc: "Build on Ministry of Power's UPI-equivalent DPI for the power sector — consumer data, DISCOM analytics, grid intelligence." },
  { sector: "power", title: "Predictive Maintenance for Grid Assets", desc: "Predictive maintenance for transformers, transmission lines, and substation assets across a DISCOM network." },
  { sector: "power", title: "EV Charging Demand Modelling", desc: "Forecast EV charging demand by zone, time, and grid capacity. Feed into DISCOMs' grid planning workflows." },
  { sector: "mining", title: "Drone-Based Mineral Volume Estimation", desc: "Autonomous BVLOS drone fleets for volumetric survey in mine pits. Compress survey cycle from weeks to hours." },
  { sector: "mining", title: "Mine Safety Computer Vision", desc: "Real-time detection of hazardous conditions, unsafe zones, and PPE violations in mine operations." },
  { sector: "mining", title: "Slope Instability Detection", desc: "Auto-detection of slope and bench instability using drone + InSAR. Early warning before failure events." },
  { sector: "mining", title: "HEMM Predictive Maintenance", desc: "Predictive maintenance for heavy earth-moving machinery. Reduce unplanned downtime on active mining sites." },
  { sector: "agriculture", title: "Crop Health Monitoring", desc: "Satellite and drone NDVI analysis for crop health at district and block level. Integrate with district agriculture departments." },
  { sector: "agriculture", title: "Precision Irrigation Advisory", desc: "AI-driven irrigation advisory based on soil moisture, weather, and crop stage data from IoT sensors." },
  { sector: "agriculture", title: "Voice-First Farmer Advisory", desc: "Voice-first AI advisory for farmers in 12+ Indic languages. Works on 2G. No smartphone required." },
  { sector: "agriculture", title: "Crop Loss Insurance Automation", desc: "Satellite imagery-based crop loss assessment for insurance claims. Reduce claim processing from months to days." },
  { sector: "climate", title: "Carbon Footprint Accounting for Infra", desc: "Carbon footprint accounting system for infrastructure projects. Auto-generate TCFD-aligned ESG reports from project data." },
  { sector: "climate", title: "Deforestation Detection", desc: "Satellite-based deforestation and land-use change detection for project site environs. MoEFCC clearance tracking." },
  { sector: "climate", title: "Landslide & Slope Risk Modelling", desc: "SAR + LiDAR fusion for slope risk modelling on linear infrastructure (roads, rail, transmission lines)." },
  { sector: "climate", title: "Heat Stress Alerting for Construction Sites", desc: "Real-time heat stress and air quality alerting for field workers. Auto-update site engineer dashboards." },
  { sector: "health", title: "Population Health Intelligence", desc: "Disease burden mapping, social determinants of health analytics, and district-level health risk scoring." },
  { sector: "health", title: "Cancer Screening AI on Imaging", desc: "AI on mammography, cervical, oral, and lung imaging for early detection. Works with existing hospital PACS systems." },
  { sector: "health", title: "ASHA/ANM Field Worker Co-Pilot", desc: "AI co-pilot for ASHA and ANM field workers in 12+ Indian languages. Offline-first, works on basic smartphones." },
  { sector: "health", title: "Disease Surveillance System", desc: "Fuse HMIS, lab, syndromic, and 102/108 emergency call data for early outbreak detection at block level." },
  { sector: "drones", title: "Automated Survey-to-DPR Pipeline", desc: "Photogrammetry + LiDAR fusion to generate highway corridor DPR — alignment, terrain, quantities — in days not months." },
  { sector: "drones", title: "ROW & Encroachment Detection", desc: "Satellite imagery analytics for right-of-way monitoring and encroachment detection on linear infrastructure." },
  { sector: "drones", title: "Multi-Sensor Live Progress Fabric", desc: "Fuse drone, satellite, IoT, and CCTV data into a single live-progress view for project monitoring." },
  { sector: "legal", title: "Contract Review & Tender Bid Analysis", desc: "GenAI contract review and tender bid analysis. Precedent retrieval and RAG over case archives with cited source spans." },
  { sector: "legal", title: "Litigation Pattern Detection", desc: "Cross-department contractor litigation pattern detection. Frivolous-claim profiling and hearing-prep co-pilot." },
  { sector: "legal", title: "AI Finance Dashboard", desc: "Natural-language P&L, forecasting, and what-if scenarios for project finance. Board-ready exec-briefing note generator." },
  { sector: "crosscutting", title: "Multilingual Stakeholder Engagement", desc: "GenAI for 12+ Indian languages — citizen queries, grievance triage, progress reports. On-prem deployable." },
  { sector: "crosscutting", title: "Site Engineer Voice DPR", desc: "Voice-to-DPR via Indic ASR (IndicConformer/Whisper). Field engineer speaks, system generates structured progress report." },
  { sector: "crosscutting", title: "PPE & Safety Compliance CV", desc: "Computer-vision PPE compliance and unsafe-zone alerting on existing CCTV infrastructure. Auto-NCR drafting." },
  { sector: "crosscutting", title: "Sovereign On-Prem RAG", desc: "Air-gapped, hash-chain-audited RAG with tamper-evident decision trails. For classified government infrastructure data." },
];

const tracks = [
  {
    num: "01", tab: "Pilot Track", title: "Pilot Partnership",
    headline: "Deploy on Live Projects",
    oneliner: "Structured 90–120 day pilots on actual Rodic mandates. Pre-agreed KPIs. Government access. Paid.",
    expanded: "Duration: 90–120 days. Pilot value decided per use case — scope, hardware footprint, KPI complexity. Successful pilots roll into annual licensing, revenue share, or co-development. Rodic's CMD-level government relationships used to position validated solutions to ministries and PSUs. Year 1 capacity: 8–12 startups.",
  },
  {
    num: "02", tab: "Hackathon", title: "Hackathon",
    headline: "Build Against Real Problem Statements",
    oneliner: "One flagship hackathon per year. Real data. Ministry-anchored themes. Winners fast-tracked to Track 01.",
    expanded: "Co-launched with NASSCOM AI Foundry, Startup India, and state government partners. Themes anchored on India Energy Stack (Ministry of Power) and PM Gati Shakti NMP (1,700+ GIS layers). Prize pool: ₹30L. Winners enter Track 01 without queuing.",
  },
  {
    num: "03", tab: "Investment", title: "Strategic Investment",
    headline: "Capital + Government Access",
    oneliner: "For mature startups at Seed–Series A. ₹50–75L average cheque. Minority stake. Rodic's project pipeline as your distribution channel.",
    expanded: "4–5 investments over 24 months. Sectors: roadways tech, geospatial, drone analytics, structural health monitoring, GenAI for engineering, smart water/utility. Pipeline sourced from Tracks 01 and 02. Co-investment alongside ecosystem VCs welcomed.",
  },
];

const faqs = [
  { q: "Who can apply?", a: "Startups at any stage with deployed or near-deployed AI solutions, student teams from IITs/NITs/IIITs, and independent researchers. Each track has different eligibility — Track 01 prioritizes revenue or strong pilot validation; Track 02 is open to student teams; Track 03 targets Seed–Series A startups." },
  { q: "What sectors are covered?", a: "13. Roads & Highways, Bridges & Tunnels, Railways & Metros, Urban Infrastructure, Water & Hydropower, Power & Energy, Mining, Agriculture, Climate & Environment, Health & Population Intelligence, Drones & Satellite, Legal & Finance (Internal), and Cross-cutting GenAI applications. All use cases are real Rodic problem statements from live projects." },
  { q: "Is the pilot actually paid?", a: "Yes. Track 01 pilots are funded — value decided per use case based on scope, hardware footprint, and KPI complexity. Rodic doesn't believe in one-size pilot budgets. Software-only pilots and multi-state hardware deployments are priced differently." },
  { q: "Who owns the IP?", a: "You do. Standard participation agreement specifies that all IP developed during the competition remains with the participants. Rodic's commercial path post-pilot is licensing, revenue share, or co-development — not acquisition of your IP." },
  { q: "How does Track 02 connect to Tracks 01 and 03?", a: "Directly. Hackathon winners are fast-tracked into Track 01 without entering the standard queue. Startups that complete Track 01 pilots successfully are evaluated for Track 03 strategic investment. The three tracks are designed to be a funnel, not three separate programs." },
  { q: "What government relationships does Rodic bring?", a: "CMD-level relationships across central ministries (MoRTH, Ministry of Power, Ministry of Jal Shakti), state governments, and PSU clients. Validated pilot solutions are positioned to ministry procurement pipelines. This is not networking — it is deployment infrastructure." },
  { q: "Can I apply to multiple tracks?", a: "Yes, with caveats. Track 02 (Hackathon) is open to all. Track 01 (Pilot) and Track 03 (Investment) require separate evaluation. Being in Track 01 doesn't automatically put you in Track 03 — investment evaluation is a separate process with NASSCOM AI Foundry co-diligence." },
  { q: "When does the program launch?", a: "The first cohort of Track 01 pilot startups will be announced following the MoU between Rodic and NASSCOM AI Foundry. Track 02 hackathon dates are targeted for Q3 2026. Register now to receive announcements directly." },
];

const navItems = [
  { id: "program", label: "Tracks" },
  { id: "problems", label: "Problems", tablet: true },
  { id: "prizes", label: "Prizes" },
  { id: "partners", label: "Partners", tablet: true },
  { id: "how-it-works", label: "Process", tablet: true },
  { id: "faq", label: "FAQ" },
];

const partners = [
  { name: "Rodic Consultants", desc: "Infrastructure Consultancy" },
  { name: "NASSCOM AI Foundry", desc: "AI Ecosystem Partner" },
  { name: "Startup India", desc: "DPIIT" },
  { name: "Ministry of Power", desc: "India Energy Stack" },
  { name: "BISAG-N", desc: "Geospatial Technology" },
  { name: "State Governments", desc: "Partners — TBD" },
];

const timeline = [
  { n: "01", label: "Program Launch", desc: "MoU signed. Startup call opens. Track 01 pilot scouting begins." },
  { n: "02", label: "Problem Statements", desc: "Live problem bank released across 13 sectors from real Rodic projects." },
  { n: "03", label: "Track 02 Hackathon", desc: "Flagship hackathon against ministry-anchored themes. Real data." },
  { n: "04", label: "Pilot Selection", desc: "Winners and qualified startups fast-tracked into Track 01 pilots." },
  { n: "05", label: "Track 03 Evaluation", desc: "Successful pilots evaluated for strategic investment with NASSCOM." },
  { n: "06", label: "Scale Deployment", desc: "Validated solutions positioned to ministry procurement pipelines." },
];

const monogram = (name) => name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const Eyebrow = ({ children }) => <span className="eyebrow">{children}</span>;

const Section = ({ id, index, variant = "", children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal")),
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={`band ${variant}`} data-testid={`section-${id}`}>
      <div className="wrap">
        {index && <span className="sec-index">{index} / 11</span>}
        {children}
      </div>
    </section>
  );
};

function Nav({ onNav }) {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); onNav(id); };
  return (
    <>
      <nav className="nav" data-testid="main-nav">
        <div className="nav-logo" data-testid="nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          Rodic<span className="x">×</span>NASSCOM
        </div>
        <div className="nav-links">
          {navItems.map((n) => (
            <span
              key={n.id}
              className={`nav-link${n.tablet ? " hide-tablet" : ""}`}
              data-testid={`nav-link-${n.id}`}
              onClick={() => go(n.id)}
            >
              {n.label}
            </span>
          ))}
          <button className="btn btn-primary nav-cta" data-testid="nav-register-btn" onClick={() => go("registration")}>
            Register
          </button>
        </div>
        <button className="hamburger" aria-label="Menu" data-testid="hamburger-btn" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
      </nav>
      <div className={`mobile-panel${open ? " open" : ""}`} data-testid="mobile-panel">
        {navItems.map((n) => (
          <span key={n.id} className="nav-link" data-testid={`mobile-link-${n.id}`} onClick={() => go(n.id)}>
            {n.label}
          </span>
        ))}
        <button className="btn btn-primary" data-testid="mobile-register-btn" onClick={() => go("registration")}>
          Register for the Program
        </button>
      </div>
    </>
  );
}

const ledgerStats = [
  { k: "Tracks", v: "03" },
  { k: "Sectors", v: "13" },
  { k: "Problem Statements", v: <>50<small>+</small></> },
  { k: "Pilot Budget", v: <>₹2–3<small>CR</small></> },
  { k: "Prize Pool", v: <>₹30<small>L</small></> },
];

function Hero({ onNav }) {
  return (
    <section id="home" className="hero" data-testid="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-tag"><span className="dot" /> Open for Registration · Cohort 01</span>
          <h1 data-testid="hero-headline">AI That <span className="it">Builds</span> India. Not Demos It.</h1>
          <p className="sub">
            90-day paid pilots on live government infrastructure. ₹30 lakh prize pool. Strategic equity for 4–5 startups.
            Rodic Consultants × NASSCOM AI Foundry.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" data-testid="hero-register-btn" onClick={() => onNav("registration")}>
              Register for the Program <span className="ar">→</span>
            </button>
            <button className="btn btn-ghost" data-testid="hero-browse-btn" onClick={() => onNav("problems")}>
              Browse 50+ Problem Statements
            </button>
          </div>
        </div>
        <div className="hero-media" data-testid="hero-media">
          <span className="tick tl">+</span>
          <span className="tick tr">+</span>
          <span className="tick br">+</span>
          <img src={HERO_IMG} alt="Aerial view of an Indian highway interchange and coastal skyline" loading="eager" />
          <div className="mtag-box">
            <span className="mtag">Live Corridor · MoRTH Mandate</span>
          </div>
        </div>
      </div>
      <div className="ledger" data-testid="hero-ticker">
        <div className="ledger-row">
          {ledgerStats.map((s, i) => (
            <div className="ledger-cell" key={i} data-testid={`ledger-${i}`}>
              <span className="k">{s.k}</span>
              <span className="v">{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Opportunity() {
  const stats = [
    { n: "16+", t: "Sectors of live infrastructure", d: "Roads, bridges, railways, water, power, mining, climate, health, and more. Rodic operates across all of them." },
    { n: "₹30L", t: "Cash prize pool", d: "₹15L winner, ₹10L first runner-up, ₹5L second runner-up. Plus fast-track pilot funding negotiated per use case." },
    { n: "90", t: "Day paid pilots", d: "Successful hackathon winners enter Track 01 — a structured 90–120 day pilot on a live Rodic project with pre-agreed KPIs." },
    { n: "4–5", t: "Startups for strategic investment", d: "₹50–75L average cheque size. Minority stake. Board observer rights. Rodic's government relationships as distribution." },
  ];
  return (
    <Section id="opportunity" index="01" variant="band-ink">
      <div className="manifesto">
        <div>
          <Eyebrow>Why This Exists</Eyebrow>
          <h2>The gap between AI that <span className="it" style={{ color: "#E8855F" }}>works</span> and AI that <span className="it" style={{ color: "#E8855F" }}>deploys.</span></h2>
        </div>
        <p className="lede">India has no shortage of AI demos. It has a shortage of AI that survives contact with live government infrastructure. This program closes that gap.</p>
      </div>
      <div className="stat-ledger">
        {stats.map((s, i) => (
          <div className="stat-cell" key={i} data-testid={`stat-block-${i}`}>
            <span className="n">{s.n}</span>
            <h4>{s.t}</h4>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Program() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(0);
  const t = tracks[active];
  return (
    <Section id="program" index="02">
      <div className="sec-head">
        <Eyebrow>Three Tracks</Eyebrow>
        <h2>Three tracks. One outcome: deployment at scale.</h2>
      </div>
      <div className="track-tabs">
        {tracks.map((tr, i) => (
          <button
            key={i}
            className={`track-tab${active === i ? " active" : ""}`}
            data-testid={`track-tab-${i}`}
            onClick={() => setActive(i)}
          >
            <span className="tn">{tr.num}</span>
            {tr.tab}
          </button>
        ))}
      </div>
      <div className="track-panel" data-testid="track-panel">
        <div>
          <span className="tp-num">{t.num.charAt(0)}<span>{t.num.charAt(1)}</span></span>
        </div>
        <div>
          <h3>{t.title} — {t.headline}</h3>
          <p className="oneliner">{t.oneliner}</p>
          <p className="expanded">{t.expanded}</p>
        </div>
      </div>

      <div className="track-accordion">
        {tracks.map((tr, i) => (
          <div
            key={i}
            className={`track-card${expanded === i ? " expanded" : ""}`}
            data-testid={`track-card-${i}`}
            onClick={() => setExpanded(expanded === i ? -1 : i)}
          >
            <div className="tc-top">
              <span className="tc-num">{tr.num}</span>
              <h3>{tr.title}</h3>
            </div>
            <span className="tagline">{tr.oneliner}</span>
            <div className="detail"><p>{tr.expanded}</p></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Problems() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? problemStatements : problemStatements.filter((p) => p.sector === filter);
  return (
    <Section id="problems" index="03" variant="">
      <div className="sec-head">
        <Eyebrow>Problem Statement Bank</Eyebrow>
        <h2>Real problems. Live projects. No toy data.</h2>
        <p className="lede">Every statement below maps to an active Rodic mandate. Filter by sector to find your fit.</p>
      </div>
      <div className="prob-bar">
        <div className="chip-row" data-testid="chip-row">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              className={`chip${filter === s.id ? " active" : ""}`}
              data-testid={`chip-${s.id}`}
              onClick={() => setFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="prob-count">Showing {String(visible.length).padStart(2, "0")} / {problemStatements.length}</span>
      </div>
      <div className="problem-grid" data-testid="problem-grid">
        {visible.map((p, i) => (
          <div className="problem-card" key={`${filter}-${i}`} data-testid="problem-card" style={{ animationDelay: `${Math.min(i * 0.025, 0.4)}s` }}>
            <span className="sector-tag">{SECTOR_LABEL[p.sector]}</span>
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Prizes() {
  return (
    <Section id="prizes" index="04" variant="band-ink">
      <div className="sec-head">
        <Eyebrow>What You Win</Eyebrow>
        <h2>Win the prize. Then win the <span className="it" style={{ color: "#E8855F" }}>deployment.</span></h2>
      </div>
      <div className="prize-row">
        <div className="prize-card gold" data-testid="prize-gold">
          <span className="place">Winner</span>
          <div className="amount">₹15,00,000</div>
          <p className="note">Direct entry into Track 01 pilot partnership.</p>
        </div>
        <div className="prize-card silver" data-testid="prize-silver">
          <span className="place">1st Runner-up</span>
          <div className="amount">₹10,00,000</div>
          <p className="note">Priority evaluation for pilot scouting.</p>
        </div>
        <div className="prize-card bronze" data-testid="prize-bronze">
          <span className="place">2nd Runner-up</span>
          <div className="amount">₹5,00,000</div>
          <p className="note">Mentorship from Rodic domain SMEs.</p>
        </div>
      </div>
      <div className="benefit-strip" data-testid="benefit-pilot">
        <span className="bn">01</span>
        <div>
          <h4>Fast-Track Pilot Opportunity</h4>
          <p>90-day paid pilot on a live Rodic project, structured against pre-agreed KPIs. Value decided per use case.</p>
        </div>
      </div>
      <div className="benefit-strip" data-testid="benefit-investment">
        <span className="bn">02</span>
        <div>
          <h4>Strategic Investment Eligibility</h4>
          <p>₹50–75L equity investment for 4–5 startups per 24 months. Minority stake. Board observer rights. Rodic distribution.</p>
        </div>
      </div>
    </Section>
  );
}

function Partners() {
  return (
    <Section id="partners" index="05">
      <div className="sec-head">
        <Eyebrow>Backed By</Eyebrow>
        <h2>The names behind the mandate.</h2>
      </div>
      <div className="partner-grid">
        {partners.map((p, i) => (
          <div className="partner-box" key={i} data-testid={`partner-${i}`}>
            <span className="mono-badge">{monogram(p.name)}</span>
            <span className="pmeta">
              <span className="name">{p.name}</span>
              <span className="desc">{p.desc}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="partner-note">+ More partners to be announced</p>
    </Section>
  );
}

function WhoShouldApply() {
  const cards = [
    { type: "Startups", h: "IP-Driven Builders", items: ["IP-driven AI solutions.", "Revenue or strong pilot validation preferred.", "Seed to Series A.", "Ideally already in Roads, Railways, Water, Power, or adjacent sectors."] },
    { type: "Students", h: "Technical Teams", items: ["Teams of 2–4.", "IITs, NITs, IIITs preferred but open.", "At least one technical co-founder equivalent in each team.", "Should be prepared to engage with real infrastructure data."] },
    { type: "Researchers", h: "Domain + AI Pairs", items: ["Domain SME + AI practitioner pairing is the ideal profile.", "Academic affiliation to IITs, IISc, or national labs adds signal.", "Affiliation is not required."] },
  ];
  return (
    <Section id="who-should-apply" index="06" variant="">
      <div className="sec-head">
        <Eyebrow>Is This For You</Eyebrow>
        <h2>Serious teams only.</h2>
      </div>
      <div className="apply-grid">
        {cards.map((c, i) => (
          <div className="apply-card" key={i} data-testid={`apply-card-${i}`}>
            <span className="type">{c.type}</span>
            <h3>{c.h}</h3>
            {c.items.map((it, j) => (
              <div className="criteria-item" key={j}>{it}</div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section id="how-it-works" index="07">
      <div className="sec-head">
        <Eyebrow>The Process</Eyebrow>
        <h2>From registration to pilot in 120 days.</h2>
      </div>
      <div className="timeline">
        {timeline.map((m, i) => (
          <div className="tl-item" key={i} data-testid={`timeline-${i}`}>
            <div className="tl-node">{m.n}</div>
            <div className="tl-label">{m.label}</div>
            <div className="tl-desc">{m.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Judges() {
  return (
    <Section id="judges" index="08" variant="">
      <div className="sec-head">
        <Eyebrow>The Panel</Eyebrow>
        <h2>Domain SMEs who've built at scale.</h2>
      </div>
      <div className="judge-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="judge-card" key={i} data-testid={`judge-card-${i}`}>
            <span className="tba">TBA</span>
            <span className="ji">Position Title<br />Organisation</span>
          </div>
        ))}
      </div>
      <p className="judge-note">
        Judges and mentors from Rodic's domain SME network, NASSCOM AI Foundry ecosystem, and partner government bodies
        will be announced before competition launch. Register to receive updates.
      </p>
    </Section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" index="09">
      <div className="sec-head">
        <Eyebrow>Questions</Eyebrow>
        <h2>Before you ask.</h2>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div className={`faq-item${open === i ? " open" : ""}`} key={i} data-testid={`faq-item-${i}`}>
            <div className="faq-q" data-testid={`faq-q-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="q">{f.q}</span>
              <span className="faq-toggle">+</span>
            </div>
            <div className="faq-a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const REG_SECTORS = ["roads", "bridges", "railways", "water", "power", "mining", "climate", "health", "urban", "agriculture", "drones", "legal"];

function Registration() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const toggleSector = (s) =>
    setSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleRegistration = async () => {
    setError("");
    const valid = email.trim() && /\S+@\S+\.\S+/.test(email);
    if (!valid) { setError("Enter a valid email address."); return; }
    if (!role) { setError("Select whether you are a startup, student, or researcher."); return; }
    try {
      await axios.post(`${API}/registrations`, { email: email.trim(), role, sectors });
    } catch (e) {
      console.error("registration failed", e);
    }
    setDone(true);
  };

  return (
    <Section id="registration" index="10" variant="band-ink">
      <div className="reg-grid">
        <div className="reg-pitch">
          <Eyebrow>Apply Now</Eyebrow>
          <h2>Ready to <span className="it" style={{ color: "#E8855F" }}>deploy?</span></h2>
          <p className="lede">Register your interest. We'll send competition details and launch announcements straight to your inbox — no spam, no queue.</p>
          <span className="rp-mail">partnerships@rodic.in</span>
        </div>
        <div className="reg-box" id="registrationForm">
          {done ? (
            <div className="success-state" data-testid="reg-success">
              <div className="ok"><span className="ac">/</span> Registration received</div>
              <p>We'll send competition details and launch announcements to your email.</p>
            </div>
          ) : (
            <>
              <div className="reg-field">
                <label className="fl">Email address</label>
                <input
                  className={`reg-input${error && !email ? " err" : ""}`}
                  data-testid="reg-email-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="reg-field">
                <label className="fl">I am a</label>
                <div className="radio-row">
                  {["Startup", "Student", "Researcher"].map((r) => (
                    <label
                      key={r}
                      className={`opt${role === r ? " sel" : ""}`}
                      data-testid={`reg-role-${r.toLowerCase()}`}
                      onClick={() => setRole(r)}
                    >
                      <span className="mark" />{r}
                    </label>
                  ))}
                </div>
              </div>
              <div className="reg-field">
                <label className="fl">Sector focus (select all that apply)</label>
                <div className="check-grid">
                  {REG_SECTORS.map((s) => (
                    <label
                      key={s}
                      className={`opt${sectors.includes(s) ? " sel" : ""}`}
                      data-testid={`reg-sector-${s}`}
                      onClick={() => toggleSector(s)}
                    >
                      <span className="mark" />{SECTOR_LABEL[s]}
                    </label>
                  ))}
                </div>
              </div>
              {error && <div className="reg-error" data-testid="reg-error">{error}</div>}
              <button className="btn btn-primary reg-submit" data-testid="reg-submit-btn" onClick={handleRegistration}>
                Register for the Program <span className="ar">→</span>
              </button>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-inner">
        <div>
          <div className="fbrand">Rodic<span className="x">×</span>NASSCOM</div>
          <p className="ftag">AI Innovation Partnership for Public Infrastructure & Strategic Sectors.</p>
        </div>
        <div>
          <h5>Navigate</h5>
          {[["program", "Program Structure"], ["problems", "Problem Bank"], ["prizes", "Prizes"], ["partners", "Partners"], ["how-it-works", "How It Works"], ["faq", "FAQ"]].map(([id, label]) => (
            <span className="footer-link" key={id} data-testid={`footer-link-${id}`} onClick={() => onNav(id)}>{label}</span>
          ))}
        </div>
        <div>
          <h5>Connect</h5>
          <p className="ftag" style={{ marginBottom: "14px" }}>partnerships@rodic.in</p>
          <div>
            <span className="social">LinkedIn</span>
            <span className="social">X / Twitter</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Rodic Consultants × NASSCOM AI Foundry</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}

function App() {
  const onNav = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="rodic-root">
      <Nav onNav={onNav} />
      <Hero onNav={onNav} />
      <Opportunity />
      <Program />
      <Problems />
      <Prizes />
      <Partners />
      <WhoShouldApply />
      <HowItWorks />
      <Judges />
      <FAQ />
      <Registration />
      <Footer onNav={onNav} />
    </div>
  );
}

export default App;
