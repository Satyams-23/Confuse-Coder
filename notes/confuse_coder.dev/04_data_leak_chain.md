# Data leak attack chain: todne ki checklist
*@confuse__coder.dev · DEV 04 · Reel: 1 SMS se 4 accounts khaali*

---

## 1. Chain kaise chali (Aman ki kahani)

| Step | Hacker ne kya kiya | Kya gaya | Kahan tootni thi |
|---|---|---|---|
| 1 | "KYC pending, account block" SMS + fake link | Bank ka password (paise nahi, OTP chahiye tha) | Link pe click hi nahi |
| 2 | Wahi password Gmail pe try kiya (**credential stuffing**) | Gmail | Har site ka alag password |
| 3 | Gmail se Instagram ka "forgot password" | Instagram | Gmail pe 2FA |
| 4 | Pehle install kiye fake APK ne SMS padh ke OTP bheja | Bank ke paise | APK sirf Play Store se, SMS permission Deny |
| 5 | Aman ke Instagram se dosto ko wahi link | Dosto ke account bhi khatre mein | — |

Ek kamzor kadi → poori chain. Pehli kadi todo, baaki sab bach jaata.

---

## 2. SMS ke 3 red flags (pinned comment ka answer)
1. **Jaldi ka darr:** "aaj hi update karo warna block" → scammer tumhe sochne ka time nahi dena chahta.
2. **Domain bank ka nahi:** `bankkyc-update.in` jaisa naam asli lagta hai, par bank ki official site ka exact domain nahi hai.
3. **Bank SMS mein link bhej ke password/KYC nahi maangta.** RBI aur banks baar baar yahi kehte hain.

---

## 3. Link check kaise karo
- Domain **right se left** padho: `bank.com.kyc-help.in` ka asli malik `kyc-help.in` hai.
- Doubt ho toh link mat kholo. Bank ki app ya website **khud** kholo.
- URL ko **VirusTotal** (virustotal.com) pe paste karke scan kar sakte ho.

## 4. Password
- **Har site ka alag password.** Yaad nahi rehta? Password manager use karo (**Bitwarden**, free).
- **haveibeenpwned.com** pe apna email daalo: pata chalega kaunse purane leaks mein tumhara data hai. Wahan ke passwords turant badlo.

## 5. 2FA (sabse bada shield)
- Gmail, Instagram pe **authenticator app** (Google Authenticator / Authy) ya **passkey** on karo.
- SMS OTP sabse kamzor 2FA hai, kyunki fake APK ya SIM swap se chori ho sakta hai.

## 6. APK aur permissions
- Apps sirf **Play Store / App Store** se. "Free premium game.apk" = classic trap.
- Settings → **Install unknown apps** → sab OFF.
- Game ko SMS, contacts, accessibility, notification access kyun chahiye? Nahi chahiye → **Deny**.
- **Exodus Privacy** (exodus-privacy.eu.org) batata hai app kaunse trackers aur permissions use karta hai.

## 7. VPN kya karta hai, kya nahi
- Karta hai: WiFi/ISP se tumhara traffic chhupata hai, IP badalta hai.
- **Nahi karta:** fake link pe password daalne se nahi rokta, fake app se nahi bachata.
- Public WiFi pe asli khatra: **same naam ka fake hotspot** + fake "login page". WiFi ka exact naam staff se poocho, WiFi login page pe Google/bank password kabhi mat daalo.

## 8. Fraud ho gaya? Turant
1. **1930** call karo (National Cyber Crime Helpline) ya **cybercrime.gov.in** pe report.
2. Bank ko call karke account/card **freeze** karwao.
3. Baaki sab accounts ke passwords badlo, "log out of all devices" karo.
4. Dosto ko batao ki tumhare account se aaye link na kholein.

---
**Yaad rakho:** Asli bank kabhi SMS mein link bhej ke password nahi maangta. Chain wahin todo.
