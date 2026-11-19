# Microsoft 36-hour outage: what actually happened (Nov 12–14, 2026)
*@confuse__coder.dev · DEV 06*

---

## Kya hua (timeline)
- **Nov 12, ~17:00–18:00 UTC (≈ 10:30–11:30 PM IST):** Outlook / Exchange Online down, then Teams, Copilot, SharePoint, OneDrive affected.
- **17:54 UTC:** Microsoft acknowledges the problem. **18:07 UTC:** warns it's global.
- **Nov 13:** "partial recovery" in some regions, Microsoft says only "marginal success" for a while; email queues "approaching normal" by afternoon.
- **Nov 14 morning:** fully restored.

## Kitna bada
- ~1,20,000 concurrent Downdetector reports in the US alone (TechRadar).
- Reports from 74 countries (Al Jazeera). Around 430 million people use Microsoft 365.
- UK NHS: some operations cancelled, paper records. Traders back on phone and fax. Courts in the Philippines and Singapore and Japan's government network were also hit.

## Cause (Microsoft ka official version, ab tak)
- A process on servers that **establishes secure connections** got **overwhelmed**, so servers **stopped handling requests**.
- The load was **not** from more traffic. It came from **servers being unexpectedly unavailable**.
- Fix: **rolled back a recent network configuration change** + **paused all deployments**.
- **Not** a cyber attack, **not** AI agents. A full post-incident report is still pending, so the exact root cause isn't published yet.

## Concept 1: TLS handshake (the "gate")
Before any encrypted request, client and server do a handshake: agree on a cipher, verify the certificate, exchange keys. That's math-heavy (CPU). So when too many new connections arrive at once, the handshake is the first thing to choke.

## Concept 2: Cascading failure
```
6 servers, each at 60% load
2 go down  -> remaining 4 now get 6/4 = 1.5x load -> 90%
one more crosses 100% -> stops answering -> its users move -> 5 servers' worth of load on 3 -> ...
```
Every failure pushes extra load onto the survivors. Retries make it worse: users and apps hit "refresh", which means even more new handshakes.

## Kaise bachte hain (industry patterns, not a claim about Microsoft's internals)
- **Canary / staged rollout:** a config change goes to 1% of servers first, then 10%, then everyone.
- **Fast rollback:** keep the previous config one click away.
- **Load shedding:** when overloaded, politely reject some requests (HTTP 503) instead of falling over completely.
- **Retry with exponential backoff + jitter:** clients wait 1s, 2s, 4s… plus some randomness, so they don't all retry at once.
- **Circuit breaker:** stop calling a failing service for a while so it gets room to recover.
- **Capacity headroom:** plan so N-2 servers can still carry the load.

## Try it (5 min)
```python
import random, time
def call_with_backoff(fn, tries=5):
    for i in range(tries):
        try:
            return fn()
        except Exception:
            time.sleep((2 ** i) + random.random())  # backoff + jitter
    raise RuntimeError("gave up")
```

**Yaad rakho:** outage pe pehla sawaal "kya change hua?" hota hai. Aur rollback ka button hamesha ready rakho.

Sources: Wikipedia "2026 Microsoft outage", Al Jazeera explainer (13 Nov 2026), TechRadar live blog, XDA (13 Nov 2026), BleepingComputer.
