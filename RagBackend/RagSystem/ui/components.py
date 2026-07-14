# ui/components.py — Reusable HTML Components
# ─────────────────────────────────────────────────────────────


def app_header(name: str, subtitle: str, icon: str = "🩺") -> str:
    return f"""
<div class="app-header">
  <span style="font-size:2.2rem;">{icon}</span>
  <div>
    <h1>{name}</h1>
    <p>{subtitle}</p>
  </div>
</div>"""


def welcome_box() -> str:
    return """
<div class="welcome-box">
  <h2>HOW CAN I HELP YOU TODAY?</h2>
  <p>
    Describe your symptoms — I'll diagnose like a doctor, ask follow-up questions,
    and recommend treatments backed by the <strong style="color:#b39dff;">Standard Treatment Guidelines</strong>.
  </p>
  <div class="feature-row">
    <span class="feature-chip">🧠 Smart Memory</span>
    <span class="feature-chip">🩺 Doctor-style Q&A</span>
    <span class="feature-chip rag">📖 STG-backed Answers</span>
    <span class="feature-chip">💊 Medicine Recommendations</span>
    <span class="feature-chip">🚨 Emergency Guidance</span>
    <span class="feature-chip">🔒 Medical Only</span>
  </div>
</div>"""


def emergency_banner(message: str = "") -> str:
    body = message or (
        "Call emergency services immediately — <strong>112 / 911 / 108</strong>. "
        "Do not wait. Seek professional help right now."
    )
    return f"""
<div class="emergency-wrap">
  <h3>🚨 EMERGENCY DETECTED</h3>
  <p>{body}</p>
</div>"""


def user_message(content: str) -> str:
    return f"""
<div class="msg-wrap">
  <div class="msg-user">
    <div class="msg-label lbl-user">👤 PATIENT</div>
    {content}
  </div>
</div>"""


def ai_message(content: str, rag_used: bool = False) -> str:
    badge = '<span class="rag-badge">📖 STG</span>' if rag_used else ""
    return f"""
<div class="msg-wrap">
  <div class="msg-ai">
    <div class="msg-label lbl-ai">🩺 MEDIASSIST AI {badge}</div>
    {content}
  </div>
</div>"""


def emergency_message(content: str) -> str:
    clean = content.replace("[EMERGENCY]", "").strip()
    return f"""
<div class="emergency-wrap">
  <h3>🚨 EMERGENCY ALERT</h3>
  <p>{clean}</p>
</div>"""


def stg_sources_panel(rag_results: list) -> str:
    """
    Shows the STG references used for the last response.
    Collapsible details showing page + short excerpt.
    """
    if not rag_results:
        return ""

    refs = ""
    for i, r in enumerate(rag_results, 1):
        excerpt = r.get("text", "")[:180].strip() + "..."
        score   = r.get("score", 0)
        page    = r.get("page", "?")
        refs += f"""
<div class="stg-ref">
  <div class="stg-meta">Reference {i} &nbsp;·&nbsp; STG Page {page} &nbsp;·&nbsp; {score:.0%} match</div>
  {excerpt}
</div>"""

    return f"""
<div class="stg-panel">
  <div class="stg-panel-title">📖 STG Sources Used</div>
  {refs}
</div>"""


def rag_status_box(status: dict) -> str:
    """Renders the RAG/STG status in the sidebar."""
    if not status:
        return ""
    msg = status.get("message", "")
    src = status.get("source", "error")
    chunks = status.get("chunks", 0)

    if status.get("success"):
        source_label = "Cached index" if src == "cache" else "Built from PDF"
        return f"""
<div class="rag-status-ok">
  ✅ STG Ready<br>
  <span style="font-size:0.65rem;opacity:0.8;">{chunks} knowledge chunks · {source_label}</span>
</div>"""
    elif src == "building":
        return '<div class="rag-building">⏳ Building STG index... (first time only)</div>'
    else:
        return f'<div class="rag-status-err">⚠️ {msg}</div>'


def rag_not_loaded_warning() -> str:
    return """
<div class="rag-status-warn">
  ⚠️ <strong>STG not loaded.</strong><br>
  Place your <code>stg.pdf</code> in the <code>data/</code> folder and restart.
  The AI will still answer using its training knowledge.
</div>"""


def stage_badge(label: str, is_emergency: bool = False) -> str:
    cls = "stage-badge emergency" if is_emergency else "stage-badge"
    return f'<div class="{cls}">{label}</div>'


def status_dot(connected: bool) -> str:
    if connected:
        return '<span class="dot dot-on"></span>Connected'
    return '<span class="dot dot-off"></span>Enter API key to start'


def memory_tags(items: list, tag_class: str) -> str:
    return "".join(f'<span class="tag {tag_class}">{i}</span>' for i in items)


def sidebar_disclaimer() -> str:
    return """
<div style="font-size:0.72rem; color:#4a6080; line-height:1.65; margin-top:1rem;">
  ⚠️ <strong style="color:#64748b;">Disclaimer:</strong> MediAssist AI provides
  general medical information based on Standard Treatment Guidelines and AI training.
  It is <u>not</u> a substitute for professional medical advice.
  Always consult a qualified healthcare provider.
  <br><br>
  🆓 Free Groq API key:<br>
  <a href="https://console.groq.com" target="_blank" style="color:#00d4ff;">console.groq.com</a>
</div>"""


def input_hint() -> str:
    return (
        '<p style="color:#4a6080; font-size:0.73rem; text-align:right; margin-top:4px;">'
        'Click SEND to submit &nbsp;•&nbsp; For emergencies call 112 / 911 / 108</p>'
    )
