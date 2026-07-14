# memory.py — Patient Memory Management
# Two-layer extraction:
#   Layer 1 — LLM-based (accurate, may fail silently)
#   Layer 2 — Regex fallback (always works, zero API calls)
# Both run on every message and results are merged.

import re
import json
from datetime import datetime
# Use relative import to avoid conflict with 'config' package in site-packages
from .config import EMERGENCY_KEYWORDS, EXTRACTION_MODEL, EXTRACT_MAX_TOKENS


# ── Default Memory ─────────────────────────────────────────────
def default_memory() -> dict:
    return {
        "symptoms"             : [],
        "duration"             : "",
        "severity"             : "",
        "body_parts"           : [],
        "medications_mentioned": [],
        "medical_history"      : [],
        "vitals"               : {},
        "allergies"            : [],
        "age"                  : "",
        "gender"               : "",
        "consultation_date"    : datetime.now().strftime("%Y-%m-%d %H:%M"),
    }


# ══════════════════════════════════════════════════
# LAYER 1 — LLM Extraction (accurate, may fail)
# ══════════════════════════════════════════════════
def _llm_extract(text: str, client) -> dict:
    """Tries LLM-based extraction. Returns {} on any failure — never raises."""
    if not client:
        return {}
    try:
        resp = client.chat.completions.create(
            model=EXTRACTION_MODEL,
            max_tokens=EXTRACT_MAX_TOKENS,
            temperature=0.0,
            messages=[{
                "role": "user",
                "content": (
                    "Extract medical data from this text. "
                    "Return ONLY a JSON object. No markdown, no explanation.\n\n"
                    f'Text: "{text}"\n\n'
                    'JSON: {"symptoms":[],"duration":"","severity":"",'
                    '"body_parts":[],"medications_mentioned":[],'
                    '"medical_history":[],"vitals":{},'
                    '"allergies":[],"age":"","gender":""}'
                )
            }]
        )
        raw = resp.choices[0].message.content.strip()
        raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
        # Extract first JSON object in case of extra text
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            raw = match.group(0)
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}   # Silent fail — regex will cover this


# ══════════════════════════════════════════════════
# LAYER 2 — Regex Fallback (always works, no API)
# ══════════════════════════════════════════════════

_SYMPTOM_KEYWORDS = [
    # ── Fever
    "fever", "high fever",
    # ── Head
    "headache", "migraine", "head pain",
    # ── Throat & Nose
    "sore throat", "throat pain", "throat swelling", "throat infection",
    "runny nose", "blocked nose", "nasal congestion", "sneezing",
    # ── Chest & Breathing
    "cough", "dry cough", "wet cough", "chest pain", "chest tightness",
    "shortness of breath", "difficulty breathing", "breathlessness", "wheezing",
    # ── Stomach & Digestion
    "nausea", "vomiting", "stomach pain", "abdominal pain",
    "diarrhea", "loose motions", "constipation",
    "bloating", "indigestion", "acidity", "heartburn", "loss of appetite",
    # ── Body & Muscles
    "body ache", "body pain", "muscle pain", "joint pain",
    "back pain", "neck pain", "chills", "shivering",
    "fatigue", "tiredness", "weakness", "lethargy",
    # ── Skin
    "rash", "itching", "hives", "swelling", "redness",
    # ── Neuro
    "dizziness", "vertigo", "blurred vision",
    # ── Urinary
    "frequent urination", "burning urination", "painful urination",
    # ── General
    "sweating", "night sweats", "bleeding", "anxiety",
    "depression", "insomnia", "mucus", "phlegm", "ear pain", "eye pain",
    "cold", "flu",
]

_DURATION_PATTERNS = [
    r'from\s+last\s+(\d+)\s*(day|days|week|weeks)',
    r'(\d+)\s*(day|days|week|weeks|month|months|hour|hours|hr|hrs)',
    r'since\s+(yesterday|this morning|last night|last week|last month)',
    r'for\s+(?:the\s+)?(?:last\s+)?(a\s+day|a\s+week|a\s+few\s+days|several\s+days)',
    r'past\s+(\d+)\s*(day|days|week|weeks)',
]

_SEVERITY_PATTERNS = [
    r'(\d+)\s*/\s*10',
    r'(mild|moderate|severe|very\s+severe|extreme|slight|little)',
    r'(very\s+high|high|low|very\s+low)\s*(fever|temperature|pain)',
]

_VITAL_PATTERNS = {
    "temperature": [
        r'(\d{2,3}(?:\.\d)?)\s*(?:f\b|°f|degree[s]?\s*f|fahrenheit)',
        r'(\d{2,3}(?:\.\d)?)\s*(?:c\b|°c|degree[s]?\s*c|celsius)',
        r'temp(?:erature)?\s+(?:is\s+)?(\d{2,3}(?:\.\d)?)',
        r'(\d{2,3}(?:\.\d)?)\s*degree',
    ],
    "weight": [
        r'(\d{2,3})\s*(?:kg\b|kgs\b|kilogram)',
        r'weight\s+(?:is\s+)?(\d{2,3})',
        r'wt\.?\s+(\d{2,3})',
        r'wigh[t]?\s+(?:is\s+)?(\d{2,3})',   # handles "wight" typo
    ],
    "bp": [
        r'(\d{2,3}/\d{2,3})\s*(?:mmhg|mm\s*hg)',
        r'bp\s+(?:is\s+)?(\d{2,3}/\d{2,3})',
        r'blood\s+pressure\s+(?:is\s+)?(\d{2,3}/\d{2,3})',
    ],
}

_AGE_PATTERNS = [
    r'(?:i\s+am|i\'m|aged?|age\s+is)\s+(\d{1,3})\s*(?:years?|yr|yrs)?',
    r'(\d{1,3})\s*(?:years?\s+old|yr\s+old|y\.?o\.?)',
    r'age[:\s]+(\d{1,3})',
    r'(\d{1,3})\s*(?:year|yr)\s+(?:old\s+)?(?:male|female|man|woman|boy|girl)',
]

_GENDER_MAP = {
    "male"  : [r'\b(male|man|boy)\b'],
    "female": [r'\b(female|woman|girl)\b'],
}

_BODY_PARTS = [
    "head", "forehead", "temple", "throat", "neck", "chest", "stomach",
    "abdomen", "back", "shoulder", "arm", "elbow", "wrist", "leg", "knee",
    "ankle", "foot", "hand", "finger", "ear", "eye", "nose", "mouth",
    "tongue", "lip", "skin", "joint", "muscle", "spine", "hip", "groin",
]

_MED_KEYWORDS = [
    "paracetamol", "ibuprofen", "aspirin", "amoxicillin", "azithromycin",
    "cetirizine", "loratadine", "metformin", "omeprazole", "pantoprazole",
    "dolo", "crocin", "combiflam", "allegra", "benadryl", "tylenol", "advil",
    "mucinex", "guaifenesin", "antibiotic", "antiviral", "steroid",
]


def _fuzzy_match(word: str, keyword: str, threshold: int = 2) -> bool:
    """
    Returns True if word is within `threshold` edit distance of keyword.
    Used to catch typos like 'headche' → 'headache', 'fevr' → 'fever'.
    Simple character-level Levenshtein distance.
    Only applies to single words (not phrases) for performance.
    """
    if abs(len(word) - len(keyword)) > threshold:
        return False
    # Build DP matrix
    rows, cols = len(word) + 1, len(keyword) + 1
    dp = list(range(cols))
    for r in range(1, rows):
        prev, dp[0] = dp[0], r
        for c in range(1, cols):
            prev, dp[c] = dp[c], min(
                dp[c] + 1,                                # deletion
                dp[c - 1] + 1,                            # insertion
                prev + (0 if word[r-1] == keyword[c-1] else 1)  # substitution
            )
    return dp[cols - 1] <= threshold


def _match_symptoms(t: str) -> list:
    """
    Two-pass symptom matching.
    Pass 1 — exact substring (handles normal text + phrases).
    Pass 2 — fuzzy word match for single-word keywords only (handles typos).
              Always adds the CANONICAL keyword, never the raw typo.
    """
    found   = set()
    words   = re.findall(r'\b\w+\b', t)

    for sym in _SYMPTOM_KEYWORDS:
        # Pass 1: exact phrase/word match
        if sym in t:
            found.add(sym)
            continue
        # Pass 2: fuzzy — single-word keywords only, min 4 chars
        if " " not in sym and len(sym) >= 4:
            for w in words:
                if len(w) >= 4 and _fuzzy_match(w, sym, threshold=2):
                    found.add(sym)   # add canonical keyword, NOT the typo
                    break

    return list(found)


def _regex_extract(text: str) -> dict:
    """Fast local extraction using keyword lists and regex patterns."""
    t = text.lower()
    result = {
        "symptoms": [], "duration": "", "severity": "",
        "body_parts": [], "medications_mentioned": [],
        "medical_history": [], "vitals": {},
        "allergies": [], "age": "", "gender": "",
    }

    # Symptoms (with fuzzy matching for typos)
    result["symptoms"] = _match_symptoms(t)

    # Duration
    for pattern in _DURATION_PATTERNS:
        m = re.search(pattern, t, re.IGNORECASE)
        if m:
            result["duration"] = m.group(0).strip()
            break

    # Severity
    for pattern in _SEVERITY_PATTERNS:
        m = re.search(pattern, t, re.IGNORECASE)
        if m:
            result["severity"] = m.group(0).strip()
            break

    # Vitals
    for vital_name, patterns in _VITAL_PATTERNS.items():
        for pattern in patterns:
            m = re.search(pattern, t, re.IGNORECASE)
            if m:
                try:
                    val = m.group(1).strip()
                except IndexError:
                    val = m.group(0).strip()
                result["vitals"][vital_name] = val
                break

    # Age
    for pattern in _AGE_PATTERNS:
        m = re.search(pattern, t, re.IGNORECASE)
        if m:
            result["age"] = m.group(1).strip()
            break

    # Gender
    for gender, patterns in _GENDER_MAP.items():
        for pattern in patterns:
            if re.search(pattern, t, re.IGNORECASE):
                result["gender"] = gender
                break

    # Body parts
    for part in _BODY_PARTS:
        if re.search(r'\b' + re.escape(part) + r'\b', t):
            result["body_parts"].append(part)

    # Medications
    for med in _MED_KEYWORDS:
        if re.search(r'\b' + re.escape(med) + r'\b', t):
            result["medications_mentioned"].append(med)

    # Allergies
    m = re.search(r'allerg(?:ic|y)\s+to\s+([\w\s]+)', t, re.IGNORECASE)
    if m:
        result["allergies"].append(m.group(1).strip())

    return result


# ══════════════════════════════════════════════════
# PUBLIC FUNCTION — Both layers merged
# ══════════════════════════════════════════════════
def extract_entities(text: str, client) -> dict:
    """
    Runs BOTH extraction methods and merges results.
    - Regex runs first (instant, zero API calls, always works)
    - LLM result fills/overrides regex on non-empty values
    - Even if LLM completely fails, regex ensures memory always updates
    """
    regex_data = _regex_extract(text)          # Always works
    llm_data   = _llm_extract(text, client)    # Best-effort

    merged      = {}
    list_fields = ["symptoms", "body_parts", "medications_mentioned",
                   "medical_history", "allergies"]
    str_fields  = ["duration", "severity", "age", "gender"]

    for field in list_fields:
        llm_val   = llm_data.get(field, []) or []
        regex_val = regex_data.get(field, []) or []
        merged[field] = list(set(llm_val) | set(regex_val))

    for field in str_fields:
        llm_val   = (llm_data.get(field, "") or "").strip()
        regex_val = (regex_data.get(field, "") or "").strip()
        merged[field] = llm_val if llm_val else regex_val

    regex_vitals = regex_data.get("vitals", {}) or {}
    llm_vitals   = llm_data.get("vitals", {}) or {}
    merged["vitals"] = {**regex_vitals, **llm_vitals}  # LLM wins on conflict

    return merged


# ── Memory Update ──────────────────────────────────────────────
def update_memory(memory: dict, new_data: dict) -> dict:
    """Merges extracted entities into persistent session memory."""
    list_fields = ["symptoms", "body_parts", "medications_mentioned",
                   "medical_history", "allergies"]
    str_fields  = ["duration", "severity", "age", "gender"]

    for field in list_fields:
        if new_data.get(field):
            existing = set(memory.get(field, []))
            existing.update(new_data[field])
            memory[field] = list(existing)

    for field in str_fields:
        if new_data.get(field):
            memory[field] = new_data[field]

    if new_data.get("vitals"):
        memory["vitals"].update(
            {k: v for k, v in new_data["vitals"].items() if v}
        )
    return memory


# ── Emergency Detection ────────────────────────────────────────
def is_emergency(text: str) -> bool:
    return any(kw in text.lower() for kw in EMERGENCY_KEYWORDS)


# ── Memory Status (checks more fields now) ────────────────────
def memory_has_data(memory: dict) -> bool:
    return any([
        memory.get("symptoms"),
        memory.get("duration"),
        memory.get("age"),
        memory.get("gender"),
        memory.get("vitals"),
        memory.get("severity"),
        memory.get("body_parts"),
    ])