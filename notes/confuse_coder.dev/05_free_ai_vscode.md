# ₹0 AI coder in VS Code — koi extension nahi
*@confuse__coder.dev · Reel 05 · Comment "NOTES" → ye notes DM mein*

---

## 1. Ek line mein idea
**AI model = ek URL + ek key.** VS Code (ya koi bhi app) bas ye do cheezein jaanna chahta hai. URL wahi rehta hai, sirf **model ka naam** badlo aur doosra model chalne lagta hai.

---

## 2. Setup (jo reel mein dikhaya, step by step)

**Step 1 · Free model chuno**
1. **openrouter.ai** kholo, sign in karo.
2. **Models** mein search karo. Naam ke aage **(free)** likha ho, wahi lo.
3. Reel wala model: `baidu/ernie-5.5-flash-preview:free` (Price: Free, Context: 1M).

**Step 2 · Key banao**
1. **Keys → New key**, koi bhi naam do.
2. Expiration aur credit limit **set karo**. "No limit" mat chuno: key leak hui toh koi bhi tumhare naam pe use kar sakta hai.
3. Key copy karo. Ye **password jaisi hai**, kisi ko mat dikhao, GitHub pe mat daalo.

**Step 3 · VS Code mein jodo (built-in, koi extension nahi)**
1. `Ctrl + Shift + P` → **Chat: Manage Language Models**
2. **Add Models → OpenRouter** → key paste karo.
3. List mein jo model ke aage **(free)** likha hai, uska eye icon on karo.
4. Chat panel ke model picker mein woh model chuno. Ho gaya.

> Agar tumhara VS Code purana hai aur ye option nahi dikhta, toh VS Code update karo.

---

## 3. Mere top 5 free models (13 Nov 2026 ko real code pe test kiye)
Har model ko 3 coding tasks diye (merge intervals, LRU cache, brackets wala calculator) aur unka **code chala ke** check kiya.

| # | Model ID (OpenRouter) | Result | Speed |
|---|---|---|---|
| 1 | `baidu/ernie-5.5-flash-preview:free` | 3/3 | sabse fast (2s easy, 7s hard) |
| 2 | `nvidia/nemotron-3-ultra-550b-a55b:free` | 3/3 | 7s / 42s |
| 3 | `recursive/flint-v1.0:free` | 3/3 | 2–4s / 20s |
| 4 | `particle-ai/particle-1:free` | 3/3 | thoda slow hard task pe |
| 5 | `cohere/north-mini-code:free` | 3/3 | code ke liye bana, par bahut lamba jawab deta hai |

- Google **Gemma 4** bhi free list mein hai, par test ke din har baar "busy" tha.
- Free list har kuch hafte badalti hai. Koi model band ho jaaye toh doosra **(free)** wala chuno, baaki setup same.
- OpenRouter free limit: **20 requests/min, 50 requests/din**.

---

## 4. Doosri jagah bhi free (limit ke saath)
*Ye maine khud test nahi kiye. Limits public info se hain aur badalti rehti hain, use se pehle check karo.*

| Kahan | Kya milta hai | Limit |
|---|---|---|
| **Google Gemini API** (AI Studio key) | Flash models | roz ki limit (2026 mein kaafi kam ho gayi) |
| **Groq** | bahut fast replies, open models | roz ki limit |
| **GitHub Copilot Free** | VS Code mein built-in | mahine ki limit |
| **Ollama** | model tumhare laptop pe chalta hai | **no limit, bina internet** (RAM chahiye: 8 GB = chhote models) |

---

## 5. Free ka trap
- Kuch free models tumhare **prompts se seekh sakte hain** (OpenRouter pe har model ki data policy alag hai).
- Isliye **company ka code, passwords, API keys, client data kabhi paste mat karo**.
- Jo key screen pe ya video mein dikh gayi, use **delete karke nayi** banao.

**Yaad rakho:** model = URL + key. Free model seekhne aur side projects ke liye best hai. Secrets ke liye kabhi nahi.
