import { useState, useEffect } from "react";
import { getSqlSchemaAndQueries } from "../services/sqlService";
import { analyzeReportWithAI } from "../services/aiService";
import { runEventLoopSimulation } from "../utils/eventLoopDemo";
import { demonstrateHoisting } from "../utils/hoistingDemo";
import { createMemoizer, createReportCounter } from "../utils/closures";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import { toast } from "react-toastify";

const TABS = [
  { id: "ai", label: "🤖 AI App Eng", icon: "🧠" },
  { id: "backend", label: "⚙️ Backend & System Design", icon: "🛡️" },
  { id: "javascript", label: "⚡ JavaScript Core & Async", icon: "📜" },
  { id: "react", label: "⚛️ React Composition & Hooks", icon: "🧩" },
  { id: "sql", label: "🐘 PostgreSQL Schema & JOINs", icon: "📊" },
  { id: "git", label: "🌿 Git Workflow", icon: "🔀" },
];

function ConceptsHub() {
  const [activeTab, setActiveTab] = useState("ai");

  // AI Tab State
  const [aiInput, setAiInput] = useState({
    title: "Large sinkhole near bus depot",
    description: "The road collapsed overnight forming an 8-foot wide dangerous cavity. Pedestrians and vehicles cannot pass.",
    location: "MG Road, Zone 2, Jaipur",
    reportedSeverity: "Critical",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // JavaScript Tab State
  const [eventLoopLogs, setEventLoopLogs] = useState([]);
  const [hoistingData, setHoistingData] = useState([]);
  const [closureCounter] = useState(() => createReportCounter(10));
  const [counterVal, setCounterVal] = useState(10);
  const [memoLog, setMemoLog] = useState([]);

  // React Tab State
  const [modalOpen, setModalOpen] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);

  // SQL Tab State
  const [sqlData, setSqlData] = useState(null);
  const [selectedJoin, setSelectedJoin] = useState(null);
  const [loadingSql, setLoadingSql] = useState(true);

  // Load SQL and Hoisting data on mount
  useEffect(() => {
    const fetchSqlData = async () => {
      try {
        const res = await getSqlSchemaAndQueries();
        setSqlData(res.data);
        if (res.data?.joins?.length > 0) {
          setSelectedJoin(res.data.joins[0]);
        }
      } catch (err) {
        console.error("SQL fetch error:", err);
      } finally {
        setLoadingSql(false);
      }
    };

    fetchSqlData();
    setHoistingData(demonstrateHoisting());
  }, []);

  // Run AI Test
  const handleTestAI = async () => {
    try {
      setAiLoading(true);
      const token = localStorage.getItem("token") || "";
      const res = await analyzeReportWithAI(aiInput, token);
      setAiResult(res.data);
      toast.success("AI Structured Problem Modeling executed!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "AI triage error");
    } finally {
      setAiLoading(false);
    }
  };

  // Run Event Loop Simulation
  const handleRunEventLoop = async () => {
    setEventLoopLogs([]);
    const logs = await runEventLoopSimulation();
    setEventLoopLogs(logs);
    toast.success("Event Loop execution cycles recorded!");
  };

  // Memoizer Demo
  const handleTestMemoizer = async () => {
    const squareFn = async (n) => {
      await new Promise((r) => setTimeout(r, 400));
      return n * n;
    };

    const memoizedSquare = createMemoizer(squareFn);
    const t0 = performance.now();
    const res1 = await memoizedSquare(7);
    const t1 = performance.now();
    const res2 = await memoizedSquare(7);
    const t2 = performance.now();

    setMemoLog([
      { call: "1st Call: square(7)", fromCache: res1.fromCache, time: `${(t1 - t0).toFixed(1)} ms`, result: res1.data },
      { call: "2nd Call: square(7)", fromCache: res2.fromCache, time: `${(t2 - t1).toFixed(1)} ms (Instant Cache Hit)`, result: res2.data },
    ]);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden">
      {/* Blueprint Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Evaluation Rubric & Architectural Concept Hub
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Concepts & Implementation Showcase
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Interactive live demonstration of all mandatory evaluation topics built into RoadWatch:
            AI Problem Modeling, Centralized Error Handling, Advanced JavaScript, Component Composition, and PostgreSQL Schema & JOINs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-amber-300 shadow-lg shadow-slate-900/20 scale-105"
                  : "bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: AI APPLICATION ENGINEERING */}
        {/* ================================================================= */}
        {activeTab === "ai" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    AI Application Engineering: Prompt Engineering, Structured Outputs & Problem Modeling
                  </h2>
                  <p className="text-sm text-slate-500">
                    Combines role-constrained system prompting, OpenAI JSON Schema strict enforcement, and civic hazard triage modeling.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mt-6">
                {/* Input form */}
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span>1️⃣</span> Input Incident Problem for AI Modeling
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Issue Title</label>
                    <input
                      type="text"
                      value={aiInput.title}
                      onChange={(e) => setAiInput({ ...aiInput, title: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={aiInput.description}
                      onChange={(e) => setAiInput({ ...aiInput, description: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Location</label>
                      <input
                        type="text"
                        value={aiInput.location}
                        onChange={(e) => setAiInput({ ...aiInput, location: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Reported Severity</label>
                      <select
                        value={aiInput.reportedSeverity}
                        onChange={(e) => setAiInput({ ...aiInput, reportedSeverity: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleTestAI}
                    loading={aiLoading}
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon="✨"
                  >
                    Execute Prompt & Structured Output Triage
                  </Button>
                </div>

                {/* Structured Output Result */}
                <div className="space-y-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                      <span>2️⃣</span> Strict JSON Schema Output (Validated Shape)
                    </h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      strict: true
                    </span>
                  </div>

                  {aiResult ? (
                    <div className="space-y-3 font-mono text-xs">
                      <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 overflow-x-auto border border-slate-800 max-h-72">
                        {JSON.stringify(aiResult, null, 2)}
                      </pre>

                      <div className="pt-2 text-slate-300 space-y-1 text-xs">
                        <p><strong>Taxonomy:</strong> {aiResult.category}</p>
                        <p><strong>Urgency Score:</strong> {aiResult.urgencyScore} / 10</p>
                        <p><strong>Hazard Flag:</strong> {aiResult.safetyHazard ? "⚠️ YES (Immediate Threat)" : "No"}</p>
                        <p><strong>Departments:</strong> {aiResult.departmentsToNotify?.join(", ")}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center p-6 border border-dashed border-slate-700 rounded-xl">
                      <span className="text-3xl mb-2">⚡</span>
                      <p className="text-xs">Click "Execute Prompt & Structured Output Triage" to run live problem modeling.</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: BACKEND & SYSTEM DESIGN */}
        {/* ================================================================= */}
        {activeTab === "backend" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🛡️</span>
                  <h3 className="text-xl font-bold text-slate-900">Server-Side Error Handling</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Centralized error pipeline with custom <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">AppError</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">asyncHandler</code>.
                </p>
                <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-200 p-4 rounded-xl">
                  <div className="text-amber-400">// Centralized AppError Hierarchy</div>
                  <div className="text-emerald-400">class AppError extends Error {'{'}</div>
                  <div className="pl-4">constructor(message, statusCode) {'{'}</div>
                  <div className="pl-8">super(message);</div>
                  <div className="pl-8">this.statusCode = statusCode;</div>
                  <div className="pl-8">this.isOperational = true;</div>
                  <div className="pl-4">{'}'}</div>
                  <div className="text-emerald-400">{'}'}</div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <li>✅ Mongoose CastError (invalid ObjectId &rarr; 400)</li>
                  <li>✅ Duplicate Key Error 11000 (&rarr; 409 Conflict)</li>
                  <li>✅ JWT Expired / Invalid Token (&rarr; 401 Unauthorized)</li>
                  <li>✅ Multer file size & type limit errors</li>
                  <li>✅ 404 Unmatched Route Handler</li>
                </ul>
              </Card>

              <Card className="p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔐</span>
                  <h3 className="text-xl font-bold text-slate-900">Environment Variables & Secrets</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Centralized configuration validation in <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">server/config/env.js</code>.
                </p>
                <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-200 p-4 rounded-xl">
                  <div className="text-amber-400">// Startup Secrets Validator</div>
                  <div className="text-slate-300">const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];</div>
                  <div className="text-slate-300">const missing = requiredEnv.filter(k =&gt; !process.env[k]);</div>
                  <div className="text-slate-400">// Warns on missing keys without leaking secrets</div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <li>✅ Zero hardcoded secrets in source repository</li>
                  <li>✅ <code className="bg-slate-100 px-1 rounded">.env.example</code> templates for Client and Server</li>
                  <li>✅ Protected with strict root <code className="bg-slate-100 px-1 rounded">.gitignore</code></li>
                  <li>✅ Sanitized error logs preventing secret leakage</li>
                </ul>
              </Card>
            </div>

            <Card className="p-7">
              <h3 className="text-xl font-bold text-slate-900 mb-2">🌐 End-to-End System Integration</h3>
              <p className="text-sm text-slate-600 mb-6">
                Architectural breakdown of how Frontend, Express Backend, MongoDB, PostgreSQL, Cloudinary, and Leaflet Maps integrate.
              </p>
              <div className="grid sm:grid-cols-5 gap-3 text-center text-xs font-bold">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  1. React SPA<br/><span className="text-[10px] font-normal text-slate-600">Vite + Tailwind</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                  2. Express REST API<br/><span className="text-[10px] font-normal text-slate-600">JWT Auth + Routing</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  3. MongoDB / Mongoose<br/><span className="text-[10px] font-normal text-slate-600">Document Store</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
                  4. Cloudinary CDN<br/><span className="text-[10px] font-normal text-slate-600">Image Evidence</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                  5. OpenAI Triage<br/><span className="text-[10px] font-normal text-slate-600">JSON Schema</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: JAVASCRIPT CORE & ASYNC */}
        {/* ================================================================= */}
        {activeTab === "javascript" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Event Loop Runner */}
            <Card className="p-7">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">⚡ JavaScript Event Loop Execution Order</h3>
                  <p className="text-xs text-slate-500">
                    Demonstrates Call Stack &rarr; Microtasks (Promises/queueMicrotask) &rarr; Macrotasks (setTimeout).
                  </p>
                </div>
                <Button onClick={handleRunEventLoop} variant="primary" size="sm" icon="▶️">
                  Run Event Loop Simulation
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-1">
                  <div className="text-amber-400">// Code Execution Structure</div>
                  <div>console.log("1. Sync script start");</div>
                  <div className="text-rose-400">setTimeout(() =&gt; console.log("4. Macrotask"), 0);</div>
                  <div className="text-emerald-400">Promise.resolve().then(() =&gt; console.log("3. Microtask"));</div>
                  <div>console.log("2. Sync script end");</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Live Execution Sequence</h4>
                  {eventLoopLogs.length === 0 ? (
                    <p className="text-xs text-slate-400">Click "Run Event Loop Simulation" to observe logs.</p>
                  ) : (
                    <div className="space-y-1.5 font-mono text-xs">
                      {eventLoopLogs.map((log) => (
                        <div key={log.step} className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                            {log.step}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            log.phase.includes("Microtask") ? "bg-emerald-100 text-emerald-800" :
                            log.phase.includes("Macrotask") ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {log.phase}
                          </span>
                          <span className="text-slate-700 truncate">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Closures & Memoizer */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-7">
                <h3 className="text-xl font-bold text-slate-900 mb-2">🔒 Closures: Lexical Scope Encapsulation</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Private variable <code className="bg-slate-100 px-1 rounded font-mono">count</code> preserved in enclosing function scope.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">Encapsulated Counter:</span>
                  <span className="text-2xl font-extrabold text-slate-900">{counterVal}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCounterVal(closureCounter.increment())}>
                    + Increment
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setCounterVal(closureCounter.decrement())}>
                    - Decrement
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setCounterVal(closureCounter.reset())}>
                    Reset
                  </Button>
                </div>
              </Card>

              <Card className="p-7">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">📦 Memoizer Closure</h3>
                  <Button size="sm" variant="primary" onClick={handleTestMemoizer}>
                    Test Cache
                  </Button>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Encloses internal <code className="bg-slate-100 px-1 rounded font-mono">cache = new Map()</code> to eliminate redundant computations.
                </p>

                <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl min-h-24">
                  {memoLog.length === 0 ? (
                    <span className="text-slate-500">Click "Test Cache" to verify instant memoized closure return.</span>
                  ) : (
                    memoLog.map((m, idx) => (
                      <div key={idx} className={m.fromCache ? "text-amber-300 font-bold" : "text-emerald-400"}>
                        &gt; {m.call} &rarr; {m.time} [fromCache: {String(m.fromCache)}]
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Hoisting & TDZ */}
            <Card className="p-7">
              <h3 className="text-xl font-bold text-slate-900 mb-3">🪜 Hoisting & Temporal Dead Zone (TDZ)</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {hoistingData.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <h4 className="font-bold text-slate-900 mb-1">{item.concept}</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: REACT COMPOSITION & HOOKS */}
        {/* ================================================================= */}
        {activeTab === "react" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <Card className="p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                ⚛️ React Component Composition (Compound Components)
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Demonstrating compound slots: <code className="bg-slate-100 px-1 rounded font-mono text-xs">&lt;Card&gt;</code>,{" "}
                <code className="bg-slate-100 px-1 rounded font-mono text-xs">&lt;Card.Header&gt;</code>,{" "}
                <code className="bg-slate-100 px-1 rounded font-mono text-xs">&lt;Card.Body&gt;</code>, and{" "}
                <code className="bg-slate-100 px-1 rounded font-mono text-xs">&lt;Card.Footer&gt;</code>.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card hoverable>
                  <Card.Header>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900">Severity Badges</h4>
                      <Badge variant="danger">Critical</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="success">Resolved</Badge>
                      <Badge variant="warning">In Progress</Badge>
                      <Badge variant="info">Pending</Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <span className="text-xs text-slate-400">Composable Badge variants</span>
                  </Card.Footer>
                </Card>

                <Card hoverable>
                  <Card.Header>
                    <h4 className="font-bold text-slate-900">Composable Buttons</h4>
                  </Card.Header>
                  <Card.Body className="space-y-2">
                    <Button variant="primary" size="sm" className="w-full">Primary Action</Button>
                    <Button variant="secondary" size="sm" className="w-full">Secondary Action</Button>
                    <Button variant="outline" size="sm" className="w-full">Outline Action</Button>
                  </Card.Body>
                  <Card.Footer>
                    <span className="text-xs text-slate-400">Polymorphic button variants</span>
                  </Card.Footer>
                </Card>

                <Card hoverable>
                  <Card.Header>
                    <h4 className="font-bold text-slate-900">Composable Modal</h4>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-xs text-slate-600 mb-3">
                      Modal with keyboard escape listener and scroll lock cleanup using <code className="font-mono">useEffect</code>.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="w-full">
                      Open Modal
                    </Button>
                  </Card.Body>
                  <Card.Footer>
                    <span className="text-xs text-slate-400">Effect cleanup demo</span>
                  </Card.Footer>
                </Card>
              </div>
            </Card>

            {/* Modal Demonstration */}
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="React Composable Modal Dialog"
              footer={
                <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                  Close Dialog
                </Button>
              }
            >
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  This modal demonstrates <strong>React component composition</strong> with customizable backdrop, header title slot, body slot, and action footer.
                </p>
                <p>
                  It also features <strong>Side effects with useEffect</strong> with an event listener cleanup function on <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border">Esc</kbd> key.
                </p>
              </div>
            </Modal>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SQL (POSTGRESQL RELATIONAL SCHEMA & JOINS) */}
        {/* ================================================================= */}
        {activeTab === "sql" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <Card className="p-8">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    🐘 PostgreSQL Relational Schema Design & SQL JOINs
                  </h3>
                  <p className="text-sm text-slate-600">
                    Complete schema with Primary Keys (PK), Foreign Keys (FK), ON DELETE CASCADE/SET NULL, constraints, and all 6 JOIN types.
                  </p>
                </div>
                <Badge variant="purple">Postgres SQL</Badge>
              </div>

              {/* Schema Tables Metadata Grid */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  1. Relational Entities & Constraints
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sqlData?.schema?.map((t) => (
                    <div key={t.tableName} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-slate-900 font-mono text-sm">
                          {t.tableName}
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                          PK: {t.primaryKey}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2">{t.description}</p>
                      {t.foreignKeys.length > 0 && (
                        <div className="text-[11px] text-blue-700 font-mono bg-blue-50/70 p-1.5 rounded">
                          {t.foreignKeys.map((fk, idx) => (
                            <div key={idx}>FK: {fk.column} &rarr; {fk.references}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SQL JOINs Explorer */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  2. Interactive SQL JOINs Query Catalog
                </h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  {sqlData?.joins?.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setSelectedJoin(j)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedJoin?.id === j.id
                          ? "bg-slate-900 text-amber-300 shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {j.type}
                    </button>
                  ))}
                </div>

                {selectedJoin && (
                  <div className="grid lg:grid-cols-2 gap-6 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-amber-300 text-sm">{selectedJoin.title}</h5>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {selectedJoin.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{selectedJoin.description}</p>

                      <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                        {selectedJoin.sql}
                      </pre>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">
                        Query Execution Result Set
                      </h5>
                      <pre className="bg-slate-950 p-4 rounded-xl text-amber-300 font-mono text-xs overflow-x-auto border border-slate-800 max-h-80">
                        {JSON.stringify(selectedJoin.sampleResults, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: GIT WORKFLOW */}
        {/* ================================================================= */}
        {activeTab === "git" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <Card className="p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                🌿 Professional Git Workflow & Engineering Practices
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Standardized branch lifecycle, Conventional Commits specification, and Pull Request review processes.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">1. Branch Strategy</h4>
                  <p className="text-slate-600">
                    <strong>main:</strong> Production-ready code only.<br/>
                    <strong>develop:</strong> Staging integration branch.<br/>
                    <strong>feat/*:</strong> New feature development.<br/>
                    <strong>fix/*:</strong> Bug fixes and patches.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">2. Conventional Commits</h4>
                  <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                    <li><strong>feat:</strong> New user-facing capability</li>
                    <li><strong>fix:</strong> Bug fix in API or UI</li>
                    <li><strong>docs:</strong> Documentation updates</li>
                    <li><strong>refactor:</strong> Code improvement</li>
                    <li><strong>chore:</strong> Build scripts & dependencies</li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">3. PR Review Gates</h4>
                  <p className="text-slate-600">
                    Every Pull Request enforces automated linting, test checks, description templates, and reviewer approvals before merging.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConceptsHub;
