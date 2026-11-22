"""Tiny Devanagari helpers: rough romanisation + a consonant "skeleton" used to fuzzy-match
ASR words against lyric words (works whether either side is Devanagari, Urdu-ish romanised, or Hinglish)."""
import re
import unicodedata

_CONS = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "n",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "f", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh",
    "ष": "sh", "स": "s", "ह": "h", "ळ": "l", "क़": "k", "ख़": "kh", "ग़": "g", "ज़": "z", "ड़": "r", "ढ़": "rh",
    "फ़": "f", "य़": "y",
}
_VOW = {"अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "o"}
_SIGN = {"ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o"}
_NASAL = {"ं": "n", "ँ": "n", "ः": "h"}
VIRAMA, NUKTA = "्", "़"
DEV = re.compile(r"[ऀ-ॿ]")


def has_devanagari(s: str) -> bool:
    return bool(DEV.search(s))


def romanise(word: str) -> str:
    """Rough, readable romanisation (schwa kept between consonants, dropped at word end)."""
    w = unicodedata.normalize("NFC", word)
    out, i = [], 0
    while i < len(w):
        ch = w[i]
        if i + 1 < len(w) and w[i + 1] == NUKTA and ch + NUKTA in _CONS:
            ch = ch + NUKTA
            i += 1
        if ch in _CONS:
            out.append(_CONS[ch])
            nxt = w[i + 1] if i + 1 < len(w) else ""
            if nxt in _SIGN:
                out.append(_SIGN[nxt])
                i += 1
            elif nxt == VIRAMA:
                i += 1
            elif nxt and (nxt in _CONS or nxt + (w[i + 2] if i + 2 < len(w) else "") in _CONS):
                out.append("a")
        elif ch in _VOW:
            out.append(_VOW[ch])
        elif ch in _SIGN:
            out.append(_SIGN[ch])
        elif ch in _NASAL:
            out.append(_NASAL[ch])
        elif ch.isascii() and ch.isalnum():
            out.append(ch.lower())
        i += 1
    return "".join(out)


def skeleton(word: str) -> str:
    """Comparable key: romanise, lowercase, unify spellings, drop vowels after the first letter, collapse repeats."""
    r = romanise(word) if has_devanagari(word) else re.sub(r"[^a-z0-9]", "", word.lower())
    for a, b in [("ph", "f"), ("w", "v"), ("q", "k"), ("z", "j"), ("ee", "i"), ("oo", "u"), ("sh", "s"), ("chh", "ch"),
                 ("kh", "k"), ("gh", "g"), ("th", "t"), ("dh", "d"), ("bh", "b"), ("jh", "j")]:
        r = r.replace(a, b)
    if not r:
        return ""
    head, tail = r[0], re.sub(r"[aeiouy]", "", r[1:])
    return re.sub(r"(.)\1+", r"\1", head + tail)


def clean_word(w: str) -> str:
    return re.sub(r"^[^\wऀ-ॿ]+|[^\wऀ-ॿ]+$", "", w)
