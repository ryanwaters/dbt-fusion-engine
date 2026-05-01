import { useState, useEffect } from "react";

// ─── Colors ───
const C = {
  orange: "#FF694A",
  orangeLight: "#FFF0EC",
  bg: "#FFFFFF",
  bgAlt: "#F8F9FB",
  bgCode: "#1E1E2E",
  border: "#E5E7EB",
  text: "#1A1D2B",
  textSec: "#5A6178",
  textMuted: "#8B90A5",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  red: "#DC2626",
  yellow: "#CA8A04",
  yellowBg: "#FEFCE8",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  codeFg: "#CDD6F4",
  codeKw: "#CBA6F7",
  codeFn: "#F9E2AF",
  codeCol: "#89B4FA",
  codeStr: "#A6E3A1",
  codeCm: "#6C7086",
};

// ─── Shared ───
const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: { bg: C.orangeLight, color: C.orange },
    green: { bg: C.greenBg, color: C.green },
    purple: { bg: C.purpleBg, color: C.purple },
    yellow: { bg: C.yellowBg, color: C.yellow },
    blue: { bg: C.blueBg, color: C.blue },
    muted: { bg: C.bgAlt, color: C.textMuted },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>
      {children}
    </span>
  );
};

// ─── Editor Chrome ───
function EditorShell({ title, statusLeft, statusRight, children }) {
  return (
    <div style={{ background: C.bgCode, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <div style={{ background: "#181825", padding: "7px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #2A2E45" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F38BA8" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FAB387" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#A6E3A1" }} />
        </div>
        <span style={{ color: "#9BA0B8", fontSize: 11, flex: 1 }}>{title || "models/marts/fct_orders.sql"}</span>
      </div>
      <div style={{ padding: "14px 18px", minHeight: 180 }}>{children}</div>
      {statusLeft && (
        <div style={{ background: C.orange, padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#fff", fontWeight: 500 }}>
          <span>{statusLeft}</span>
          {statusRight && <span>{statusRight}</span>}
        </div>
      )}
    </div>
  );
}

function CodeLine({ children }) {
  return <pre style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: C.codeFg, whiteSpace: "pre-wrap" }}>{children}</pre>;
}

// ─── Feature Mockups ───

function MockupLiveErrors() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t); }, []);
  return (
    <EditorShell title="models/staging/stg_customers.sql" statusLeft="dbt Fusion v2.0 — Static Analysis: Strict">
      <CodeLine>
        <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>customer_id</span>,{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>first_name</span>,{"\n"}
        {"  "}<span style={{ color: show ? C.red : C.codeCol, textDecoration: show ? "wavy underline" : "none", textDecorationColor: C.red, textUnderlineOffset: "3px" }}>not_a_column</span>{"\n"}
        <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>raw_customers</span>') {"}}"}
      </CodeLine>
      {show && (
        <div style={{ marginTop: 14, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, animation: "fadeSlideIn 0.3s ease-out" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(220,38,38,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.red, fontWeight: 700, flexShrink: 0 }}>!</div>
          <span style={{ color: "#F38BA8", fontSize: 12 }}>Column 'not_a_column' not found in model 'raw_customers'</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: C.codeCm }}>No warehouse query needed</span>
        </div>
      )}
    </EditorShell>
  );
}

function MockupIntelliSense() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);
  return (
    <EditorShell title="models/marts/dim_customers.sql" statusLeft="dbt Fusion v2.0">
      <CodeLine>
        <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>o.order_id</span>,{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>o.amount</span>,{"\n"}
        {"  "}{"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>|</span>
      </CodeLine>
      {show && (
        <div style={{ marginTop: 4, marginLeft: 60, background: "#313244", borderRadius: 8, border: "1px solid #3A3F5C", overflow: "hidden", animation: "fadeSlideIn 0.2s ease-out", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", maxWidth: 260 }}>
          {["stg_customers", "stg_orders", "stg_payments", "fct_orders"].map((item, i) => (
            <div key={item} style={{ padding: "5px 14px", fontSize: 12, color: i === 0 ? "#fff" : "#9BA0B8", background: i === 0 ? "rgba(255,105,74,0.15)" : "transparent", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.blue, fontSize: 10, fontWeight: 600 }}>ref</span>
              <span style={{ fontFamily: "monospace" }}>{item}</span>
              {i === 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: C.codeCm }}>model</span>}
            </div>
          ))}
        </div>
      )}
    </EditorShell>
  );
}

function MockupGoToDef() {
  const [highlight, setHighlight] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHighlight(true), 700); return () => clearTimeout(t); }, []);
  return (
    <EditorShell title="models/marts/fct_orders.sql" statusLeft="Cmd+Click to navigate">
      <CodeLine>
        <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>c.customer_id</span>,{"\n"}
        {"  "}<span style={{ color: C.codeFn }}>SUM</span>(<span style={{ color: C.codeCol }}>p.amount</span>) <span style={{ color: C.codeKw }}>AS</span> <span style={{ color: C.codeStr }}>revenue</span>{"\n"}
        <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange, background: highlight ? "rgba(255,105,74,0.2)" : "transparent", padding: highlight ? "0 2px" : 0, borderRadius: 3, cursor: "pointer", textDecoration: highlight ? "underline" : "none", transition: "all 0.3s" }}>ref</span>('<span style={{ color: C.codeStr, background: highlight ? "rgba(255,105,74,0.2)" : "transparent", padding: highlight ? "0 2px" : 0, borderRadius: 3, transition: "all 0.3s" }}>stg_customers</span>') {"}}"} c
      </CodeLine>
      {highlight && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, animation: "fadeSlideIn 0.3s ease-out" }}>
          <div style={{ background: "#313244", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,105,74,0.3)" }}>
            <span style={{ color: C.orange, fontSize: 12 }}>Go to Definition</span>
            <span style={{ color: C.codeCm, fontSize: 11 }}>models/staging/stg_customers.sql</span>
          </div>
          <div style={{ background: "#313244", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #3A3F5C" }}>
            <span style={{ color: C.codeCol, fontSize: 12 }}>Find All References</span>
            <span style={{ color: C.codeCm, fontSize: 11 }}>4 references</span>
          </div>
        </div>
      )}
    </EditorShell>
  );
}

function MockupHover() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t); }, []);
  return (
    <EditorShell title="models/marts/dim_customers.sql" statusLeft="Hover for type information">
      <CodeLine>
        <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
        {"  "}<span style={{ color: C.codeCol }}>customer_id</span>,{"\n"}
        {"  "}<span style={{ color: C.codeCol, background: show ? "rgba(137,180,250,0.15)" : "transparent", padding: "0 2px", borderRadius: 3, cursor: "pointer", transition: "all 0.3s" }}>*</span>{"\n"}
        <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>stg_customers</span>') {"}}"}
      </CodeLine>
      {show && (
        <div style={{ position: "relative", marginTop: 4, marginLeft: 40 }}>
          <div style={{ background: "#313244", borderRadius: 8, border: "1px solid rgba(137,180,250,0.3)", padding: "12px 16px", animation: "fadeSlideIn 0.2s ease-out", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", maxWidth: 340 }}>
            <div style={{ fontSize: 11, color: C.codeCol, fontWeight: 600, marginBottom: 8, borderBottom: "1px solid #3A3F5C", paddingBottom: 6 }}>SELECT * expansion — stg_customers</div>
            {[["customer_id", "INTEGER"], ["first_name", "VARCHAR(256)"], ["last_name", "VARCHAR(256)"], ["email", "VARCHAR(512)"], ["created_at", "TIMESTAMP_NTZ"]].map(([col, type]) => (
              <div key={col} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", color: C.codeFg }}>
                <span style={{ fontFamily: "monospace" }}>{col}</span>
                <span style={{ color: C.codeCm }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </EditorShell>
  );
}

function MockupColumnLineage() {
  const [step, setStep] = useState(0);
  useEffect(() => { const iv = setInterval(() => setStep(s => Math.min(s + 1, 3)), 500); return () => clearInterval(iv); }, []);
  const nodes = [
    { label: "raw.payments.amount", type: "source" },
    { label: "stg_payments.amount", dep: "copy" },
    { label: "fct_orders.revenue", dep: "transform" },
    { label: "dim_customers.lifetime_value", dep: "transform" },
  ];
  const depColor = { copy: C.green, transform: C.orange, inspect: C.blue };
  return (
    <EditorShell title="Column Lineage — lifetime_value" statusLeft="Tracing: dim_customers.lifetime_value">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {nodes.map((n, i) => i <= step && (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, animation: "fadeSlideIn 0.3s ease-out" }}>
            {i > 0 && (<><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${depColor[n.dep]}18`, color: depColor[n.dep], fontWeight: 600 }}>{n.dep}</span><span style={{ color: "#6C7086" }}>from</span></>)}
            {i === 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${C.blue}18`, color: C.blue, fontWeight: 600 }}>origin</span>}
            <span style={{ fontFamily: "monospace", fontSize: 12, color: i === nodes.length - 1 ? C.orange : C.codeCol }}>{n.label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 10, color: C.codeCm }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.green, marginRight: 4 }} />Copy — passed through unchanged</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.orange, marginRight: 4 }} />Transform — derived expression</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.blue, marginRight: 4 }} />Inspect — used in filter/join</span>
      </div>
    </EditorShell>
  );
}

function MockupCTEPreview() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 700); return () => clearTimeout(t); }, []);
  return (
    <EditorShell title="models/marts/fct_orders.sql" statusLeft="Cmd+Enter to preview CTE">
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ flex: 1, borderRight: "1px solid #3A3F5C", paddingRight: 14 }}>
          <div style={{ fontSize: 10, color: C.codeCm, marginBottom: 6 }}>Source</div>
          <CodeLine>
            <span style={{ color: C.codeKw }}>WITH</span> <span style={{ color: C.codeStr }}>order_totals</span> <span style={{ color: C.codeKw }}>AS</span> ({"\n"}
            {"  "}<span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
            {"    "}<span style={{ color: C.codeCol }}>order_id</span>,{"\n"}
            {"    "}<span style={{ color: C.codeFn }}>SUM</span>(<span style={{ color: C.codeCol }}>amount</span>) <span style={{ color: C.codeKw }}>AS</span> <span style={{ color: C.codeStr }}>total</span>{"\n"}
            {"  "}<span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>stg_payments</span>') {"}}"}{"\n"}
            {"  "}<span style={{ color: C.codeKw }}>GROUP BY</span> 1{"\n"}
            )
          </CodeLine>
          <div style={{ marginTop: 8, display: "inline-block", background: "rgba(255,105,74,0.15)", color: C.orange, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>Preview CTE</div>
        </div>
        {show && (
          <div style={{ flex: 1, paddingLeft: 14, animation: "fadeSlideIn 0.3s ease-out" }}>
            <div style={{ fontSize: 10, color: C.green, marginBottom: 6, fontWeight: 600 }}>Query Results — 3 rows, 0.08s</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, color: C.codeFg }}>
              <thead><tr style={{ borderBottom: "1px solid #3A3F5C" }}><th style={{ textAlign: "left", padding: "4px 8px", color: C.orange, fontWeight: 600, fontSize: 10 }}>order_id</th><th style={{ textAlign: "right", padding: "4px 8px", color: C.orange, fontWeight: 600, fontSize: 10 }}>total</th></tr></thead>
              <tbody>{[[1, 33.50], [2, 81.00], [3, 12.25]].map(([id, tot]) => (<tr key={id} style={{ borderBottom: "1px solid rgba(58,63,92,0.2)" }}><td style={{ padding: "4px 8px", fontFamily: "monospace" }}>{id}</td><td style={{ padding: "4px 8px", fontFamily: "monospace", textAlign: "right" }}>${tot.toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </EditorShell>
  );
}

function MockupCompiledSQL() {
  return (
    <EditorShell title="Compiled SQL — fct_orders.sql" statusLeft="Live compiled view">
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ flex: 1, borderRight: "1px solid #3A3F5C", paddingRight: 14 }}>
          <div style={{ fontSize: 10, color: C.codeCm, marginBottom: 6 }}>Source (Jinja)</div>
          <CodeLine>
            <span style={{ color: C.codeKw }}>SELECT</span> *{"\n"}
            <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>stg_orders</span>') {"}}"}{"\n"}
            <span style={{ color: C.codeKw }}>WHERE</span> <span style={{ color: C.codeCol }}>status</span> = '<span style={{ color: C.codeStr }}>completed</span>'
          </CodeLine>
        </div>
        <div style={{ flex: 1, paddingLeft: 14 }}>
          <div style={{ fontSize: 10, color: C.orange, marginBottom: 6, fontWeight: 600 }}>Compiled (SQL)</div>
          <CodeLine>
            <span style={{ color: C.codeKw }}>SELECT</span> *{"\n"}
            <span style={{ color: C.codeKw }}>FROM</span> <span style={{ color: C.codeStr }}>analytics.dbt_prod.stg_orders</span>{"\n"}
            <span style={{ color: C.codeKw }}>WHERE</span> <span style={{ color: C.codeCol }}>status</span> = '<span style={{ color: C.codeStr }}>completed</span>'
          </CodeLine>
        </div>
      </div>
    </EditorShell>
  );
}

function MockupRefactoring() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <EditorShell title="Rename Symbol — project-wide" statusLeft="Static Analysis: Strict — required for rename">
      <div style={{ fontSize: 10, color: C.codeCm, marginBottom: 10 }}>Renaming column: <span style={{ color: C.orange }}>amount</span> → <span style={{ color: C.green }}>payment_amount</span></div>
      {[
        { file: "models/staging/stg_payments.sql", line: "  payment_amount  -- was: amount" },
        { file: "models/marts/fct_orders.sql", line: "  SUM(p.payment_amount) AS revenue" },
        { file: "models/marts/dim_customers.sql", line: "  SUM(o.payment_amount) AS lifetime_value" },
        { file: "models/schema.yml", line: "    - name: payment_amount  # updated" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", opacity: i <= phase + 1 ? 1 : 0.3, transition: "opacity 0.5s" }}>
          <span style={{ color: i <= phase ? C.green : C.codeCm, fontSize: 13, width: 16 }}>{i <= phase ? "\u2713" : "\u00B7"}</span>
          <span style={{ color: C.codeCm, fontSize: 11, minWidth: 220, fontFamily: "monospace" }}>{item.file}</span>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: C.codeFg }}>{item.line}</span>
        </div>
      ))}
    </EditorShell>
  );
}

function MockupStaticAnalysis() {
  const [mode, setMode] = useState("strict");
  const modes = {
    off: { color: C.textMuted, desc: "Jinja rendering only. No SQL validation.", features: ["Table lineage", "YAML validation", "SQL preview"], pipeline: [true, false, false, true] },
    baseline: { color: "#CA8A04", desc: "Catches most SQL errors. Warnings only \u2014 project keeps running.", features: ["Syntax error detection", "CTE previews", "Basic column validation"], pipeline: [true, true, false, true] },
    strict: { color: C.green, desc: "Full type-checking compiler. Nothing runs until the project is proven valid.", features: ["Column go-to-definition", "Auto rename refactoring", "Column lineage (copy/transform/inspect)", "Data type and function signature validation"], pipeline: [true, true, true, true] },
  };
  const m = modes[mode];
  const pipeLabels = ["Jinja Render", "Logical Plan", "Type Check", "Execute SQL"];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(modes).map(([k, v]) => (
          <button key={k} onClick={() => setMode(k)} style={{ background: mode === k ? `${v.color}14` : "transparent", color: mode === k ? v.color : C.textMuted, border: `1px solid ${mode === k ? v.color : C.border}`, borderRadius: 8, padding: "7px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{k}</button>
        ))}
      </div>
      <div style={{ background: C.bgAlt, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: m.color, marginBottom: 4 }}>static_analysis: {mode}</div>
        <div style={{ color: C.textSec, fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>{m.desc}</div>
        <div style={{ fontSize: 12 }}>{m.features.map((f, i) => (<div key={i} style={{ padding: "3px 0", display: "flex", alignItems: "center", gap: 8, color: C.text }}><span style={{ color: m.color, fontSize: 13 }}>+</span> {f}</div>))}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 16, flexWrap: "wrap" }}>
          {pipeLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: m.pipeline[i] ? m.color : C.textMuted, background: m.pipeline[i] ? `${m.color}10` : C.bgAlt, border: `1px solid ${m.pipeline[i] ? m.color : C.border}`, transition: "all 0.3s" }}>{label}</div>
              {i < 3 && <span style={{ color: C.textMuted, margin: "0 4px", fontSize: 14 }}>&rarr;</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupCompare() {
  return (
    <EditorShell title="Compare Changes — fct_orders.sql vs production" statusLeft="Comparing against last production manifest">
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ flex: 1, borderRight: "1px solid #3A3F5C", paddingRight: 14 }}>
          <div style={{ fontSize: 10, color: C.codeCm, marginBottom: 6 }}>Production (current)</div>
          <CodeLine>
            <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
            {"  "}<span style={{ color: C.codeCol }}>customer_id</span>,{"\n"}
            {"  "}<span style={{ background: "rgba(220,38,38,0.15)", color: "#F38BA8" }}>  amount</span>{"\n"}
            <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>stg_orders</span>') {"}}"}
          </CodeLine>
        </div>
        <div style={{ flex: 1, paddingLeft: 14 }}>
          <div style={{ fontSize: 10, color: C.green, marginBottom: 6, fontWeight: 600 }}>Working copy (modified)</div>
          <CodeLine>
            <span style={{ color: C.codeKw }}>SELECT</span>{"\n"}
            {"  "}<span style={{ color: C.codeCol }}>customer_id</span>,{"\n"}
            {"  "}<span style={{ background: "rgba(22,163,74,0.15)", color: C.codeStr }}>  payment_amount,</span>{"\n"}
            {"  "}<span style={{ background: "rgba(22,163,74,0.15)", color: C.codeStr }}>  order_date</span>{"\n"}
            <span style={{ color: C.codeKw }}>FROM</span> {"{{ "}<span style={{ color: C.orange }}>ref</span>('<span style={{ color: C.codeStr }}>stg_orders</span>') {"}}"}
          </CodeLine>
        </div>
      </div>
    </EditorShell>
  );
}

// ─── Feature Definitions ───
const features = [
  { id: "errors", title: "Live Error Detection", desc: "Catch SQL errors in real-time without querying the warehouse. Missing columns, bad syntax, invalid function arguments \u2014 all flagged instantly.", mockup: MockupLiveErrors },
  { id: "intellisense", title: "IntelliSense", desc: "Context-aware autocomplete for refs, sources, SQL functions, and column names with full type information.", mockup: MockupIntelliSense },
  { id: "goto", title: "Go-to-Definition", desc: "Cmd+click any ref, macro, CTE, or column name to jump directly to its definition. Find all references across your project.", mockup: MockupGoToDef },
  { id: "hover", title: "Hover Insights", desc: "Hover over * to see expanded columns with types. Hover any column for its data type. Hover functions to see their signatures.", mockup: MockupHover },
  { id: "lineage", title: "Column-Level Lineage", desc: "Trace how individual columns flow through the DAG. Each dependency is categorized as copy, transform, or inspect.", tag: "Strict mode", mockup: MockupColumnLineage },
  { id: "cte", title: "Live CTE Preview", desc: "Preview any CTE's output inline without running the full model. Results display instantly in a side panel.", mockup: MockupCTEPreview },
  { id: "compiled", title: "Compiled SQL", desc: "Live side-by-side view of compiled SQL that updates as you save. Click a Jinja expression to highlight its compiled output.", mockup: MockupCompiledSQL },
  { id: "refactor", title: "Instant Refactoring", desc: "Rename a model file or column alias and all refs and downstream references update project-wide automatically.", tag: "Strict mode", mockup: MockupRefactoring },
  { id: "static", title: "Static Analysis", desc: "A full SQL compiler built on Apache DataFusion. Parses every query into a logical plan and validates types across the entire DAG \u2014 before any SQL hits the warehouse. Three modes: off, baseline, and strict.", mockup: MockupStaticAnalysis },
  { id: "compare", title: "Compare Changes", desc: "Diff your working copy against the last production manifest directly in the editor. See exactly what changed before deploying.", tag: "Beta", mockup: MockupCompare },
];

// ─── Developer Experience Section ───
function DeveloperExperience() {
  const [selected, setSelected] = useState(null);
  if (selected !== null) {
    const feat = features[selected];
    const Mockup = feat.mockup;
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          <span style={{ fontSize: 16 }}>&larr;</span> Back to features
        </button>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>{feat.title}</h2>
            {feat.tag && <Badge variant={feat.tag === "Beta" ? "yellow" : "purple"}>{feat.tag}</Badge>}
          </div>
          <p style={{ color: C.textSec, fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 640 }}>{feat.desc}</p>
        </div>
        <Mockup key={selected} />
      </div>
    );
  }
  return (
    <div>
      <p style={{ color: C.textSec, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        Powered by an LSP backed by the Fusion engine. Available in VS Code and dbt Studio. Every feature works without querying your warehouse.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {features.map((f, i) => (
          <button key={f.id} onClick={() => setSelected(i)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 16px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = "0 2px 12px rgba(255,105,74,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{f.title}</span>
              {f.tag && <Badge variant={f.tag === "Beta" ? "yellow" : "purple"}>{f.tag}</Badge>}
            </div>
            <span style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{f.desc.split(".")[0]}.</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SAO Simulator ───
function SAOSimulator() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [config, setConfig] = useState("default");
  const models = {
    default: [
      { name: "stg_customers", time: "1.2s" }, { name: "stg_orders", time: "0.8s" }, { name: "stg_payments", time: "0.6s" },
      { name: "fct_orders", time: "3.4s" }, { name: "dim_customers", time: "2.1s" },
      { name: "test_unique_id", time: "0.4s", test: true }, { name: "test_not_null", time: "0.3s", test: true },
    ],
    sao: [
      { name: "stg_customers", time: "\u2014", skip: true, reason: "No source changes" }, { name: "stg_orders", time: "0.8s" }, { name: "stg_payments", time: "\u2014", skip: true, reason: "Reused from Job #1042" },
      { name: "fct_orders", time: "3.4s" }, { name: "dim_customers", time: "\u2014", skip: true, reason: "Upstream unchanged" },
      { name: "test_unique_id", time: "\u2014", skip: true, reason: "Semantically guaranteed", test: true }, { name: "test_not_null", time: "0.2s", test: true, bundled: true },
    ],
  };
  const active = models[config];
  useEffect(() => {
    if (!running) return;
    setStep(0);
    let i = 0;
    const iv = setInterval(() => { i++; if (i >= active.length) { clearInterval(iv); setRunning(false); } setStep(i); }, 550);
    return () => clearInterval(iv);
  }, [running, config]);
  const skipped = active.filter(m => m.skip).length;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <button onClick={() => { setConfig("default"); setStep(-1); }} style={{ background: config === "default" ? C.text : "transparent", color: config === "default" ? C.bg : C.textSec, border: `1px solid ${config === "default" ? C.text : C.border}`, borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Without SAO</button>
        <button onClick={() => { setConfig("sao"); setStep(-1); }} style={{ background: config === "sao" ? C.orange : "transparent", color: config === "sao" ? "#fff" : C.textSec, border: `1px solid ${config === "sao" ? C.orange : C.border}`, borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>With SAO</button>
        <button onClick={() => setRunning(true)} disabled={running} style={{ background: running ? C.border : C.green, color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 12, fontWeight: 600, cursor: running ? "default" : "pointer", marginLeft: "auto" }}>{running ? "Running..." : "Run dbt build"}</button>
      </div>
      <div style={{ background: C.bgCode, borderRadius: 10, padding: 16, fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, border: `1px solid ${C.border}`, minHeight: 240 }}>
        <div style={{ color: "#9BA0B8", marginBottom: 8 }}>$ dbt build {config === "sao" && <span style={{ color: C.orange }}>--state-aware</span>}</div>
        {active.map((m, i) => { if (i > step) return null; return (
          <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, color: m.skip ? "#9BA0B8" : C.codeFg, animation: "fadeSlideIn 0.3s ease-out" }}>
            <span style={{ color: m.skip ? "#CA8A04" : C.green, width: 14 }}>{m.skip ? "\u23ED" : "\u2713"}</span>
            <span style={{ color: m.test ? C.codeCol : m.skip ? "#9BA0B8" : C.codeFg }}>{m.test ? "test" : "model"} {m.name}</span>
            {m.bundled && <Badge variant="purple">Bundled</Badge>}
            <span style={{ marginLeft: "auto", color: m.skip ? "#CA8A04" : C.green }}>{m.time}</span>
            {m.reason && <span style={{ fontSize: 10, color: "#CA8A04" }}>{m.reason}</span>}
          </div>
        ); })}
        {step >= active.length - 1 && !running && step >= 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #3A3F5C", color: C.green, animation: "fadeSlideIn 0.3s ease-out" }}>
            Done. {active.length - skipped}/{active.length} executed, {skipped} skipped.{config === "sao" && <span style={{ color: C.orange, fontWeight: 700 }}> ~{Math.round(skipped / active.length * 100)}% compute saved</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Chat ───
function AIChatSim() {
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const [scenario, setScenario] = useState(-1);
  const scenarios = [
    { name: "Query Metadata", msgs: [
      { role: "user", text: "What columns does the dim_customers model have?" },
      { role: "tool", text: "dbt MCP \u2192 Discovery API \u2192 get_model_details('dim_customers')" },
      { role: "ai", text: "The dim_customers model has 6 columns:\n\ncustomer_id (INTEGER) \u2014 primary key\nfirst_name (VARCHAR)\nlast_name (VARCHAR)\nemail (VARCHAR)\norder_count (INTEGER) \u2014 from fct_orders\nlifetime_value (DECIMAL) \u2014 sum of all payments\n\nThe lifetime_value column traces back through fct_orders \u2192 stg_payments \u2192 raw.payments.amount via a transform dependency." },
    ]},
    { name: "Generate SQL", msgs: [
      { role: "user", text: "Write a query to find customers with lifetime value over $500" },
      { role: "tool", text: "dbt MCP \u2192 Semantic Layer \u2192 query_metrics(metric='lifetime_value')" },
      { role: "ai", text: "SELECT\n  customer_id,\n  first_name,\n  lifetime_value\nFROM {{ ref('dim_customers') }}\nWHERE lifetime_value > 500\nORDER BY lifetime_value DESC\n\nValidated against your Fusion Engine schema \u2014 all columns and types confirmed." },
    ]},
    { name: "Debug Pipeline", msgs: [
      { role: "user", text: "Job #2847 failed. What happened?" },
      { role: "tool", text: "dbt MCP \u2192 Admin API \u2192 get_job_run_error(run_id=2847)" },
      { role: "ai", text: "Job #2847 failed on model fct_orders:\n\n\"Column 'order_status' not found in model 'stg_orders'\"\n\nThis column was renamed to 'status' in commit abc123 but fct_orders wasn't updated. Fusion's static analysis in strict mode would catch this before execution." },
    ]},
  ];
  const runScenario = (idx) => {
    if (running) return;
    setScenario(idx); setMessages([]); setRunning(true);
    const msgs = scenarios[idx].msgs; let i = 0;
    const addNext = () => { if (i >= msgs.length) { setRunning(false); return; } setMessages(prev => [...prev, msgs[i]]); i++; setTimeout(addNext, i === 1 ? 700 : 1100); };
    addNext();
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {scenarios.map((s, i) => (<button key={i} onClick={() => runScenario(i)} style={{ background: scenario === i && messages.length > 0 ? C.orange : "transparent", color: scenario === i && messages.length > 0 ? "#fff" : C.textSec, border: `1px solid ${scenario === i && messages.length > 0 ? C.orange : C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: running ? "default" : "pointer" }}>{s.name}</button>))}
      </div>
      <div style={{ background: C.bgCode, borderRadius: 10, border: `1px solid ${C.border}`, minHeight: 280, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #2A2E45", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>C</div>
          <span style={{ color: C.codeFg, fontWeight: 600, fontSize: 13 }}>Claude + dbt MCP Server</span>
          <Badge variant="green">Connected</Badge>
        </div>
        <div style={{ padding: 14, flex: 1 }}>
          {messages.length === 0 && <div style={{ color: "#6C7086", fontSize: 12, textAlign: "center", marginTop: 50 }}>Select a scenario to see how AI agents interact with dbt APIs</div>}
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12, animation: "fadeSlideIn 0.3s ease-out" }}>
              {msg.role === "user" && <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ background: "rgba(37,99,235,0.15)", borderRadius: "12px 12px 2px 12px", padding: "10px 14px", maxWidth: "80%", color: C.codeFg, fontSize: 13 }}>{msg.text}</div></div>}
              {msg.role === "tool" && <div style={{ textAlign: "center" }}><span style={{ fontSize: 10, color: C.orange, background: "rgba(255,105,74,0.1)", padding: "4px 12px", borderRadius: 20, fontFamily: "monospace" }}>{msg.text}</span></div>}
              {msg.role === "ai" && <div style={{ display: "flex", gap: 8 }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: C.orange, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, marginTop: 2 }}>C</div><div style={{ background: "#2A2E45", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", maxWidth: "85%", color: C.codeFg, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{msg.text}</div></div>}
            </div>
          ))}
          {running && <div style={{ textAlign: "center", color: "#6C7086", fontSize: 11 }}><span style={{ animation: "blink 1s infinite" }}>Thinking...</span></div>}
        </div>
      </div>
    </div>
  );
}

// ─── AI Architecture ───
function AIArchDiagram() {
  const layers = [
    { label: "AI Agents", color: C.purple, items: ["Claude", "Cursor", "VS Code Copilot", "Custom Agents"] },
    { label: "dbt MCP Server", color: C.orange, items: ["Local (uvx dbt-mcp)", "Remote (Cloud-hosted)"] },
    { label: "dbt APIs", color: C.blue, items: ["Discovery API", "Semantic Layer", "Admin API", "Fusion Tools"] },
    { label: "Fusion Engine", color: C.green, items: ["SQL Compiler", "Static Analysis", "Column Lineage", "Metadata Cache"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {layers.map((layer, i) => (
        <div key={i}>
          <div style={{ background: C.bgAlt, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${layer.color}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: layer.color, marginBottom: 6 }}>{layer.label}</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>{layer.items.map(item => (<span key={item} style={{ fontSize: 12, color: C.textSec, fontFamily: "monospace" }}>{item}</span>))}</div>
          </div>
          {i < 3 && <div style={{ textAlign: "center", color: C.border, fontSize: 18, lineHeight: 1 }}>&darr;</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Metadata Explorer ───
function MetadataExplorer() {
  const [selected, setSelected] = useState("column_lineage");
  const types = {
    column_lineage: { label: "Column Lineage", desc: "Track how every column flows through the DAG with copy, transform, and inspect dependencies.", example: `{\n  "column": "lifetime_value",\n  "model": "dim_customers",\n  "dependencies": [\n    { "type": "transform", "from": "fct_orders.revenue" },\n    { "type": "transform", "from": "stg_payments.amount" }\n  ],\n  "data_type": "DECIMAL(12,2)"\n}` },
    model_state: { label: "Model State", desc: "Real-time hash cache of each model's data and code state. Powers State-Aware Orchestration.", example: `{\n  "model": "fct_orders",\n  "code_hash": "a3f8c2...",\n  "data_hash": "7b2e91...",\n  "last_run": "2026-04-29T08:14:22Z",\n  "status": "fresh",\n  "upstream_changes": false\n}` },
    semantic: { label: "Semantic Layer", desc: "Business-defined metrics, dimensions, and entities available to every consumer and AI agent.", example: `{\n  "metric": "lifetime_value",\n  "type": "SUM",\n  "expression": "amount",\n  "model": "stg_payments",\n  "dimensions": ["customer_id", "order_date"]\n}` },
    freshness: { label: "Source Freshness", desc: "Automated freshness checks on upstream sources with configurable thresholds.", example: `{\n  "source": "raw.orders",\n  "loaded_at_field": "updated_at",\n  "last_loaded": "2026-04-29T07:58:00Z",\n  "freshness": {\n    "warn_after": { "count": 1, "period": "hour" },\n    "error_after": { "count": 4, "period": "hour" }\n  },\n  "status": "fresh"\n}` },
  };
  const sel = types[selected];
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 170, flexShrink: 0 }}>
        {Object.entries(types).map(([k, v]) => (<button key={k} onClick={() => setSelected(k)} style={{ display: "block", width: "100%", background: selected === k ? C.orangeLight : "transparent", color: selected === k ? C.orange : C.textMuted, border: "none", borderLeft: `2px solid ${selected === k ? C.orange : "transparent"}`, padding: "10px 14px", fontSize: 12, textAlign: "left", cursor: "pointer", fontWeight: selected === k ? 600 : 400 }}>{v.label}</button>))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 4 }}>{sel.label}</div>
        <div style={{ color: C.textSec, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>{sel.desc}</div>
        <pre style={{ background: C.bgCode, borderRadius: 10, padding: 16, fontSize: 12, color: C.codeStr, lineHeight: 1.6, border: `1px solid ${C.border}`, margin: 0, overflow: "auto" }}>{sel.example}</pre>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════
export default function FusionGuide() {
  const [section, setSection] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const sections = ["Developer Experience", "Cost Optimization", "AI Infrastructure"];
  useEffect(() => setSubTab(0), [section]);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", minHeight: "100vh" }}>
      <div style={{ padding: "40px 24px 28px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.orange, letterSpacing: 2, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>dbt Labs</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px", color: C.text }}>The dbt <span style={{ color: C.orange }}>Fusion</span> Engine</h1>
        <p style={{ color: C.textSec, fontSize: 15, margin: 0, maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>A complete rewrite of dbt in Rust. Compiles SQL like TypeScript compiles JavaScript — catching errors before they reach your warehouse.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, background: C.bg }}>
        {sections.map((s, i) => (<button key={i} onClick={() => setSection(i)} style={{ background: "none", border: "none", borderBottom: `2px solid ${section === i ? C.orange : "transparent"}`, color: section === i ? C.text : C.textMuted, padding: "14px 28px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", letterSpacing: 0.2 }}>{s}</button>))}
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px" }}>
        {section === 0 && <DeveloperExperience />}

        {section === 1 && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["SAO Simulator", "How It Works", "Results", "Metadata"].map((t, i) => (<button key={i} onClick={() => setSubTab(i)} style={{ background: subTab === i ? C.text : "transparent", color: subTab === i ? C.bg : C.textSec, border: `1px solid ${subTab === i ? C.text : C.border}`, borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t}</button>))}
            </div>
            {subTab === 0 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>State-Aware Orchestration</h2><p style={{ color: C.textSec, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Fusion tracks every model's code and data hash in real time. On each run, it skips unchanged models, deduplicates cross-job work, reuses semantically-guaranteed tests, and bundles remaining tests into single queries.</p><SAOSimulator /></div>)}
            {subTab === 1 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>How State-Aware Orchestration Works</h2>
              {[{ title: "Model Reuse", desc: "If upstream data and code haven't changed, Fusion skips the rebuild and reuses the previous materialization.", color: C.green },
                { title: "Cross-Job Deduplication", desc: "If two jobs build the same model simultaneously, Fusion waits for the first to finish and reuses its result.", color: C.blue },
                { title: "Semantic Test Reuse", desc: "Using column-aware analysis, if no downstream logic invalidates an upstream test, Fusion reuses the passing result.", color: C.purple },
                { title: "Bundled Test Execution", desc: "When tests need to run, Fusion combines them into a single query instead of one per test.", color: C.yellow }
              ].map(item => (<div key={item.title} style={{ background: C.bgAlt, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${item.color}`, marginBottom: 10 }}><div style={{ fontWeight: 600, color: C.text, marginBottom: 4, fontSize: 14 }}>{item.title}</div><div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{item.desc}</div></div>))}
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "24px 0 10px" }}>Configuration</h3>
              <div style={{ background: C.bgCode, borderRadius: 10, padding: 16, fontSize: 12, lineHeight: 1.7, border: `1px solid ${C.border}` }}><pre style={{ margin: 0, color: C.codeFg }}><span style={{ color: C.codeCm }}># dbt_project.yml</span>{"\n"}<span style={{ color: C.codeCol }}>models</span>:{"\n"}{"  "}<span style={{ color: C.codeCol }}>marts</span>:{"\n"}{"    "}<span style={{ color: C.codeFn }}>+build_after</span>:{"\n"}{"      "}count: <span style={{ color: C.orange }}>2</span>{"\n"}{"      "}period: <span style={{ color: C.codeStr }}>hour</span>{"  "}<span style={{ color: C.codeCm }}># Don't rebuild until 2hrs have passed</span>{"\n\n"}<span style={{ color: C.codeCol }}>sources</span>:{"\n"}{"  "}<span style={{ color: C.codeCol }}>raw_orders</span>:{"\n"}{"    "}<span style={{ color: C.codeFn }}>loaded_at_field</span>: <span style={{ color: C.codeStr }}>updated_at</span>{"\n"}{"    "}<span style={{ color: C.codeFn }}>+updates_on</span>: <span style={{ color: C.codeStr }}>any</span>{"  "}<span style={{ color: C.codeCm }}># Trigger when ANY upstream is fresh</span></pre></div>
            </div>)}
            {subTab === 2 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>Customer Results</h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>{[{ value: "29%+", label: "Warehouse Savings", sub: "Combined optimizations" }, { value: "64%", label: "dbt Labs Internal", sub: "Own data team reduction" }, { value: "30x", label: "Faster Parsing", sub: "Rust vs Python engine" }, { value: "~35%", label: "Models Reused Daily", sub: "Via SAO" }].map(s => (<div key={s.label} style={{ flex: 1, minWidth: 130, background: C.bgAlt, borderRadius: 10, padding: "20px 16px", textAlign: "center", border: `1px solid ${C.border}` }}><div style={{ fontSize: 30, fontWeight: 800, color: C.orange, lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: 13, color: C.text, marginTop: 8, fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.sub}</div></div>))}</div>
              <div style={{ background: C.bgAlt, borderRadius: 10, padding: 24, border: `1px solid ${C.border}` }}><div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 16 }}>Savings Breakdown</div>{[{ label: "SAO activation (zero config)", pct: 10, color: C.green }, { label: "Advanced SAO configuration", pct: 15, color: C.blue }, { label: "Test reuse and bundling", pct: 4, color: C.purple }].map(item => (<div key={item.label} style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}><span style={{ color: C.text }}>{item.label}</span><span style={{ color: item.color, fontWeight: 700 }}>~{item.pct}%</span></div><div style={{ background: C.border, borderRadius: 6, height: 6, overflow: "hidden" }}><div style={{ width: `${item.pct * 3.4}%`, height: "100%", background: item.color, borderRadius: 6 }} /></div></div>))}</div>
            </div>)}
            {subTab === 3 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Rich Metadata</h2><p style={{ color: C.textSec, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Fusion continuously generates structured metadata \u2014 column lineage, model state hashes, semantic definitions, and source freshness \u2014 available via APIs.</p><MetadataExplorer /></div>)}
          </div>
        )}

        {section === 2 && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["Architecture", "Agent Demo", "dbt Agents", "APIs"].map((t, i) => (<button key={i} onClick={() => setSubTab(i)} style={{ background: subTab === i ? C.text : "transparent", color: subTab === i ? C.bg : C.textSec, border: `1px solid ${subTab === i ? C.text : C.border}`, borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t}</button>))}
            </div>
            {subTab === 0 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Fusion as AI Infrastructure</h2><p style={{ color: C.textSec, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Fusion generates structured, accurate context \u2014 column types, lineage, business logic, governance \u2014 exposed via the Model Context Protocol (MCP) to any AI system.</p><AIArchDiagram /></div>)}
            {subTab === 1 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Agent Demo</h2><p style={{ color: C.textSec, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>AI agents use the dbt MCP server to query metadata, generate validated SQL, and debug pipelines.</p><AIChatSim /></div>)}
            {subTab === 2 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Native dbt Agents</h2>
              {[{ name: "Developer Agent", desc: "Built into VS Code and dbt Studio. Explains model logic, flags duplicates, validates code with Fusion, and authors models from natural language.", badge: "Beta", color: C.orange },
                { name: "Analyst Agent", desc: "Built into dbt Insights. Answers natural language questions about models, jobs, and metrics via the Semantic Layer.", badge: "Beta", color: C.blue },
                { name: "Discovery Agent", desc: "Surfaces dataset definitions, freshness, tests, owners, and lineage in Catalog.", badge: "Private Beta", color: C.purple },
                { name: "Observability Agent", desc: "Monitors pipelines, flags root causes, and guides fixes autonomously.", badge: "Coming Soon", color: C.textMuted }
              ].map(a => (<div key={a.name} style={{ background: C.bgAlt, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${a.color}`, marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{a.name}</span><Badge variant={a.color === C.orange ? "default" : a.color === C.blue ? "blue" : a.color === C.purple ? "purple" : "muted"}>{a.badge}</Badge></div><div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{a.desc}</div></div>))}
            </div>)}
            {subTab === 3 && (<div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>APIs and MCP Server</h2>
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>{[{ title: "Local MCP", desc: "Run uvx dbt-mcp locally. Full CLI, Semantic Layer, Fusion tools, codegen.", items: ["dbt CLI commands", "Semantic Layer", "SQL execution", "Codegen tools", "Fusion tools"] }, { title: "Remote MCP", desc: "Cloud-hosted, zero install. HTTP connection to any AI tool.", items: ["Semantic Layer", "SQL execution", "Discovery API", "Admin API", "Fusion tools"] }].map(m => (<div key={m.title} style={{ flex: 1, minWidth: 260, background: C.bgAlt, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}><div style={{ fontWeight: 600, color: C.orange, marginBottom: 4, fontSize: 14 }}>{m.title}</div><div style={{ color: C.textMuted, fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>{m.desc}</div>{m.items.map(item => (<div key={item} style={{ fontSize: 12, color: C.text, padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.green, fontSize: 11 }}>+</span> {item}</div>))}</div>))}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>Fusion-Exclusive Tools</div>
              <div style={{ background: C.bgCode, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}><pre style={{ margin: 0, fontSize: 12, color: C.codeFg, lineHeight: 1.7 }}><span style={{ color: C.codeCm }}>// Fusion-only MCP tools</span>{"\n\n"}<span style={{ color: C.codeKw }}>compile_sql</span>(<span style={{ color: C.codeStr }}>"SELECT * FROM {'{{'}ref('stg_orders'){'}}'}"</span>){"\n"}<span style={{ color: C.codeCm }}>// Returns compiled SQL + validation + type info</span>{"\n\n"}<span style={{ color: C.codeKw }}>get_column_lineage</span>(<span style={{ color: C.codeStr }}>"dim_customers.lifetime_value"</span>){"\n"}<span style={{ color: C.codeCm }}>// Returns full column trace with dependency types</span>{"\n\n"}<span style={{ color: C.codeKw }}>text_to_sql</span>(<span style={{ color: C.codeStr }}>"customers who spent over $500 this quarter"</span>){"\n"}<span style={{ color: C.codeCm }}>// Generates validated SQL via Semantic Layer metrics</span></pre></div>
            </div>)}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
