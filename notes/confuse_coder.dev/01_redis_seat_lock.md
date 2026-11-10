# Seat "Hold" Lock: Redis NX + TTL
**confuse_coder.dev · Reel 01 notes** · Comment keyword: **NOTES**

---

## 1. Problem kya hai?
Ek seat (E7), aur 1000 log ek hi second mein "Book" dabate hain.
Agar hum normal tareeke se check karein:

```
if seat free:      # 1000 requests ek saath yahan pahunchi
    book seat      # sab ko laga seat free hai → double booking ❌
```
Isko **race condition** kehte hain: "check" aur "book" ke beech mein kisi aur ki request ghus jaati hai.

## 2. Redis hi kyun?
- **In-memory**: data RAM mein rehta hai, isliye reply usually 1 ms se kam mein aa jaata hai.
- **Commands ek-ek karke chalte hain**: Redis commands ko ek single thread pe, ek ke baad ek execute karta hai. 1000 requests aayein, tab bhi har command **atomic** hai. Do commands kabhi "beech mein" mix nahi hote.

## 3. The magic command
```
SET seat:show42:E7 user_A NX EX 600
```
| Part | Matlab |
|---|---|
| `seat:show42:E7` | key: kaunsa show, kaunsi seat |
| `user_A` | value: lock kiske paas hai |
| `NX` | **N**ot e**X**ists: sirf tab set karo jab key pehle se na ho |
| `EX 600` | TTL = 600 sec = **10 min**, uske baad key apne aap delete |

Reply:
- `OK` → tumhe lock mil gaya, seat 10 min ke liye tumhari ✅
- `(nil)` → kisi aur ke paas lock hai → "Seat busy" ❌

Check + lock **ek hi atomic command** hai, isliye race condition khatam.

## 4. Pura flow
```
User clicks seat
   └─ SET seat:E7 user_A NX EX 600
        ├─ OK   → payment page (timer 10:00 chalu)
        │     ├─ payment success → DB mein booking save → lock DEL → seat BOOKED
        │     └─ payment fail / app band → kuch mat karo… TTL khatam → key gayab → seat FREE
        └─ nil  → "Seat busy, doosri seat chuno"
```
**TTL hi safety net hai**: user bhaag gaya, app crash hui, network gaya, phir bhi seat hamesha ke liye atakti nahi.

## 5. Code (Node.js, ioredis)
```js
// hold
const ok = await redis.set(`seat:${showId}:${seat}`, userId, 'NX', 'EX', 600);
if (ok !== 'OK') return res.status(409).send('Seat busy');

// confirm (payment success)
const owner = await redis.get(`seat:${showId}:${seat}`);
if (owner !== userId) return res.status(410).send('Hold expired');
await db.bookings.insert({showId, seat, userId});   // source of truth = DB
await redis.del(`seat:${showId}:${seat}`);
```

## 6. Interview-level gotchas
1. **Payment late aaya, TTL already khatam?** Confirm karne se pehle check karo ki lock abhi bhi *tumhara* hai (upar `owner !== userId`). Warna refund flow chalao.
2. **Galat banda lock delete na kare**: seedha `DEL` mat karo. Pehle value check karo, phir delete, aur dono kaam ek Lua script mein atomic karo:
   ```lua
   if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end
   ```
3. **Redis sirf lock hai, booking nahi**: final booking DB mein jaati hai (unique constraint on `show_id + seat`), double safety ke liye.
4. **Multiple Redis nodes?** Ek single Redis down ho gaya to? Wahan *Redlock* ya DB-level locking ki baat aati hai (next level topic).
5. **TTL kitna rakhein?** Payment gateway ke time + buffer. Mostly 5–10 min. Bahut lamba → seats atki rehti hain, bahut chhota → payment ke beech mein hold chhoot jaata hai.

## 7. One-line yaad rakho
> **`SET key value NX EX 600` = "agar seat free hai to 10 min ke liye meri, warna busy"**, aur TTL ensure karta hai ki koi seat hamesha ke liye atke nahi.

---
Aisi aur tech ki kahaniyan → follow **@confuse__coder.dev**
