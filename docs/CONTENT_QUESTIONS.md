# Content questions — round 1

Fill every `**A:**` line directly in this file. Short, messy answers are fine: bullets, fragments, Thai or English. Skip with `skip` or `unsure` and I will propose a draft for you to approve.

When done, tell me. I read it, rewrite all copy (`src/locales/en.json`, mock data, `content/ME.md`), and ask round 2 for anything still thin.

Current copy is a placeholder written by me, not by you. Treat all of it as wrong until you confirm it.

---

## 0. Goal and audience

1. **Why does this site exist?** (get hired, get freelance clients, show off craft, personal brand, all)
   **A:** all
2. **Who reads it first?** (recruiter, CTO, game studio, web3 founder, client, other developers)
   **A:** recruiter, CTO, client, other developers
3. **What should a visitor do after 2 minutes?** (email you, read resume, open a project, hire you)
   **A:** read resume, open a project, email you
4. **Are you looking for a job, freelance, or neither right now?** Where (Bangkok, remote, abroad)?
   **A:** all, Bangkok, remote, abroad
5. **Primary language of the site: English only, or English + Thai?**
   **A:** English + Thai i18n for thai will be implemented later, but English is the main language.

## 1. Voice

6. **Pick 3 words for how you want to sound.** (calm, witty, technical, humble, bold, playful, formal …)
   **A:** calm, technical, humble, playful
7. **First person ("I build…") or neutral?** Humor level 0–10? Is the "quiet code, loud products" and mascot playfulness really you?
   **A:** humor level 7-8 like humor, i like the "quiet code, loud products" and mascot playfulness, first person is fine.
8. **Words or phrases you hate / never want on the site.**
   **A:** i don't know, just i don't like to implement the code just it to work, i want complex systems, dynamic, general, and scalable systems.
9. **Paste 2–3 sentences you wrote yourself (any context: README, Slack, LinkedIn) so I can match your natural voice.**
   **A:** https://www.linkedin.com/in/william-siefert/, https://github.com/king-glitch/portfolio

## 2. Identity

10. **Name shown:** "William Siefert" everywhere? Nickname? Thai name? Pronouns (for third-person text)?
    **A:** Fullname: William Siefert, Nickname: Tiger
    **Claude draft/notes (confirm or edit):** GitHub README tone: dry, self-deprecating ("Just trying to look busy while VS Code is open", green tea, Reddit, games). LinkedIn blocked my fetch (HTTP 999): paste your LinkedIn headline + About here if you want it matched.
11. **Job title you want:** "Software developer"? "Backend engineer"? "Blockchain / game backend engineer"? Something else?
    **A:** "Software developer", "Software engineer", "Full-stack developer only web for frontend", "Web3 / Blockchain", "Game backend engineer"
12. **One sentence: what do you do and for whom?** (current hero: "I build the back half of apps and games — servers, real-time connections and smart contracts")
    **A:** idk, it sounds cool. i just like coding, i like to build the backend with complex systems, dynamic, general, and scalable systems.
13. **Is "backend / the part nobody sees" truly your positioning?** You also built a client-side UI (Estic AI map) and an operator screen (AADS). Keep the framing, widen it, or change it?
    **A:** widen it, i like to build the backend with complex systems, dynamic, general, and scalable systems. but i also like to build the frontend with simple and easy to use UI.
14. **Location / timezone / availability** to show (or hide).
    **A:** Bangkok, Thailand / GMT+7 / available for remote work
15. **Photo or avatar?** None (mascot only) or add one?
    **A:** none

## 3. Hero, About ("Hello"), Marquee

16. **Hero headline** is "Quiet code / loud products." Keep, or give me what you would say instead.
    **A:** i like it.
17. **Hero tags** `@always-on @game-ready @zero-drama` — keep, replace, or remove?
    **A:** change to texts after you understand the all contexts
    **Claude draft/notes (confirm or edit):** Candidates: `@scalable` `@general-purpose` `@web3` `@low-latency` `@reliable`. Pick 3 later.
18. **About paragraph (the scroll-reveal text).** Write it in your own words, 3–5 sentences: who you are, what you like, what drives you, one human detail (hobby, game you play, coffee …).
    **A:** at github https://github.com/king-glitch README.md
    **Claude draft/notes (confirm or edit):** Hi, I'm William (Tiger). I write Go and TypeScript, mostly the kind with sockets, queues and smart contracts behind it. I like systems that are general, dynamic and still standing when traffic triples, and I build the simple front end on top because a clean UI is half of a reliable product. I learned by building, breaking and rebuilding: 6,100+ tracked coding hours so far. Off the clock: games, green tea, too much Reddit. — Source: your GitHub README is self-deprecating ("writes code that sometimes works"). Keep that joke on the site, or only in the mascot?
19. **Marquee phrases** ("Make it work / fast / fair / last / fun / Then ship it"). Is that your real motto? Give your own 4–6 or `keep`.
    **A:** Optimization, Performance, Scalability, Reliability, Security, Maintainability
20. **Spotlight section** ("What you see: a button, a map, a cute farm" vs "What I see: every player, every pin, every coin counted"). Keep or rework? Which examples are true for your projects?
    **A:** idk, i want full rework, use something that match the contexts that you understand. like what i focus on.
    **Claude draft/notes (confirm or edit):** Rework as What you see (a button, a map, a farm) vs What I see (queues draining, sockets staying open, state that stays correct, contracts nobody can rewrite). Matches your complex/dynamic/scalable focus. Approve?

## 4. Global stats (replaces the "4k+ pins" tile)

The "pins" number is a project stat, not yours. The row currently shows: projects shipped, languages, years, pins. Real global numbers only, or nothing.

21. **Which stats are true and you are comfortable showing?** Tick or edit:
    - [/] Projects shipped (currently 6 — correct? count only public ones?)
    - [/] Programming languages (currently 7: Go, TypeScript, Solidity, Python, PHP, Java, C# — all really "work in"? or fewer?)
    - [/] Years of experience (currently derived from 2023 start; do you count from 2022 research/intern? when did you write your first code?, my first code was in 2019, so 5 years of experience)
    - [many in bitkub chain and sonieum chain] Smart contracts written / audited / deployed (number?)
    - [idk] Peak concurrent players / users you served (number?)
    - [Soneium, Bitkub] Chains deployed on (Soneium, others?)
    - [3] Games shipped to production (number?)
    - [ ] Other:
          **Claude draft/notes (confirm or edit):** you wrote "5 years" from 2019, but today is Oct 2026: that is 7 years since first code, 3 years professional (X10 since 2023). Which to show: "7 yrs coding" or "3 yrs shipping"? Proposed stats (playful): **6 projects shipped** ("Launch days survived"), **7 languages** ("Languages I argue in"), **7 years** ("Years of breaking things on purpose"). Optional extras: 6,100+ coding hours (your GitHub), 3 games live, 2 chains (Soneium, Bitkub). Pick 3.
22. **If you have no solid numbers for a stat, should I drop it?** (3 stats or 2 is fine; layout will adapt.)
    **A:** number of projects shipped, programming languages, years of experience.
23. **Labels:** want them dry ("Projects shipped") or playful ("Games that survived launch day")?
    **A:** playful

## 5. "How I work" — five habits

Current: Build the engine room · Write rules that can't bend · Keep everyone in sync · Make waiting disappear · Lock the doors.

24. **Are these your real working principles?** Rewrite, replace, or reduce to 3–4. For each, one true example from real work.
    **A:** rewrite, replace.
    **Claude draft/notes (confirm or edit):** (1) Build it general, not one-off. (2) Scale before it has to. (3) Measure, then optimise. (4) Money and keys are loaded guns: review twice. (5) Keep it boring to maintain. I need one true example each from you in round 2.
25. **Section title** ("Five habits, no exceptions") — keep?
    **A:** no, rewrite, replace.
    **Claude draft/notes (confirm or edit):** "How I think about systems" or "Rules I build by". Pick or rewrite.

## 6. "How a tap becomes a thing" (stack diagram)

Six stops: Your screen → A live line (sockets) → The brain (game/server logic) → The memory (database) → The rulebook (smart contract) → The ledger (chain).

26. **Does this flow match how your projects really work?** Which stop is wrong or missing (queue, cache, CDN, auth, indexer, cloud)?
    **A:** yes, backend (includes queue and api), db, socket, chain, frontend.
    **Claude draft/notes (confirm or edit):** Flow becomes 5 stops: Frontend (React/TS) → Backend (Go: API + queue) → Socket (WebSocket) → Database (MongoDB, PostgreSQL) → Chain (Solidity: Soneium, Bitkub). Friendly names stay, real tech shown beneath.
27. **For each project, which stops does it use?** (see project tables in section 9; answer there)
28. **Real technology names under each stop?** (Go, MongoDB, Redis, WebSocket, Solidity, Soneium, AWS, GCP …) Show them or keep the friendly metaphors only?
    **A:** Go, MongoDB, WebSocket, Solidity, PostgreSQL.

## 7. Timeline, experience, education

29. **Timeline entries.** List every item with real dates and one line each. Current: Bangkok University 2019–2023; BU research lab Jun 2022–Jun 2023; X10 Interactive 2023–present.
    - Exact start month of X10? Job title there (Software Developer? Backend?) Level?
    - The BU "Multimedia Intelligent Technology" role: research assistant? intern? exact name?
    - Other jobs, freelance, hackathons, certificates, awards, open source, talks?
      **A:** i seems correct
30. **School bus tracking system** (BU research): do you want it shown as a project? What did you do?
    **A:** hmm, it's never been shipped, but i can show it as a project, i did the backend and frontend.
    **Claude draft/notes (confirm or edit):** Show as project 7 "School Bus Backend & Administration System" (BU, backend + frontend by you, never shipped, tagged Prototype). Need: what it tracked (GPS, routes, parent app?), stack, team.
31. **Education wording:** "B.Sc. Computer Science, focus multimedia intelligent technology" — GPA, thesis, honors worth showing?
    **A:** School Bus Backend and Administration System. AADS is a military project, that i was interned in BU research lab, GPA 3.90
    **Claude draft/notes (confirm or edit):** GPA 3.90 goes on Resume. Confirm: AADS = BU research lab internship, Jun 2022–Jun 2023, "Fullstack Developer"; school bus system = senior project.
32. **X10 Interactive: may I name the company on the site?** Any wording rules from them?
    **A:** no
33. **Resume page:** want a downloadable PDF? Show phone/address (no by default)?
    **A:** no

## 8. Toolkit / skills bubbles

34. **Real tools list, by confidence.** Mark each: daily / comfortable / dabbled / remove. Current list: Golang, TypeScript, Solidity, Python, PHP, Java, C#, MongoDB, SQL, React, Git, Docker, AWS, GCP, Web3, Blockchain, + soft skills.
    **A:** yes, daily: Golang, TypeScript, React, MongoDB, SQL. comfortable: Solidity, Python, PHP, Java, C#, Git, Docker, AWS, GCP, Web3, Blockchain.
35. **Missing tools?** (Redis, PostgreSQL, Kafka, gRPC, WebSocket libs, Hardhat/Foundry, Kubernetes, Terraform, Next.js …)
    **A:** no
36. **Soft skills in bubbles (Problem-solving, Teamwork …) feel generic. Remove them?**
    **A:** no

## 9. Projects (most important)

Six projects now: AADS, Morning Moon Village, Morning Moon Pocket, Metal Valley, Evermoon SocialFi, Estic AI.

General:

37. **For each project, which can be public?** Any NDA, client approval, name or screenshot restrictions? (AADS is military — what may I say about Thai radars, protocols, "hostile" alerts?)
    **A:** no
38. **Order on the site?** (best first, newest first, by theme)
    **A:** best first.
39. **Real screenshots, videos or recordings available?** Currently every visual is an illustrative mock. Provide files (put in `public/` or send paths), or stay with mocks?
    **A:** mock for now, i will provide real screenshots later.
40. **Where do all the invented labels come from?** I made up UI mock text ("Day 18", "Moon Power · 12,450 XP", "TRK 041", "Wild mech Lv 12", "[LISTING TITLE]", "Operator 02"). Replace with real or generic text? Fine to keep as obviously fake?
    **A:** it's mocked, i will provide real screenshots later.

Answer this block for **each** project (copy it six times below):

```
Project:
- Years / months worked on it, and your exact title:
- Team size and who you worked with (designers, client devs, product):
- Live link, store link, GitHub, press, trailer (any public URL):
- Current status: live / shut down / in development:
- One-sentence pitch in plain words (what is it, for whom):
- What YOU personally built (not the team):
- The hardest problem and how you solved it (concrete, technical, honest):
- One real number you are proud of (users, players, TPS, latency, pins, uptime, money moved, tests). Mark each: public / internal:
- Tech actually used (language, DB, protocol, chain, cloud):
- Which stack stops (screen / live line / brain / memory / rulebook / ledger) does it use:
- What went wrong or what you would do differently:
- Anything that must NOT be mentioned:
```

**AADS:**
**A:**

- 1 year, Fullstack Developer
- Backend 1 (Me), Frontend 1, Leader 1, Supervisor 1
- Live link: NDA, no public URL
- Pitch: turns raw radar signals into a live air picture for operators. You built: backend, TRML/DR127ADV decoding, socket link, IP-based access, messaging/voice. Hardest: decoding dense continuous data exactly and fast, keeping the socket private. Missing: tech stack (TS), real numbers (none), status (unknown).

**Morning Moon Village:**
**A:**

- Months / title: ~3 Years in X10 Interactive Company · Team: X10 Interactive · Public link: morningmoonvillage.com · Status: live
- Pitch: farming game with real DeFi yield farming inside; NFTs add competition.
- You built: shop system, resource spawning, server↔chain integration (DeFi, NFTs), Solidity contracts.
- Hardest: shipping secure contracts + keeping server features in step with the client team. Understanding 5 years of Backend code written by others.
- Tech: Go, MongoDB, Solidity, chain (Bitkub) · Stops: all 5

**Morning Moon Pocket:**
**A:**

- Months / title: 9 months in X10 Interactive Company · Team: X10 Interactive · Public link: morningmoonpocket.com · Status: lives
- Pitch: Village rebuilt for phones, global players on Soneium.
- You built: whole server rewrite (Go, MongoDB), shop + mission systems, most Solidity contracts rewritten.
- Hardest: more players, same feel, short deadline. Rewrite old features in new architecture, keep old features working.
- Tech: Go, MongoDB, Solidity, Soneium · Stops: all 5

**Metal Valley:**
**A:**

- Months / title: 2 years in X10 Interactive Company · Team: X10 Interactive · Public link: x10.games · Status: live
- Pitch: hybrid Web3 game, mech hunters capture and train robots.
- You built: WebSocket layer, capture/training mechanics, most Solidity contracts, bridge website + backend (game items ↔ chain assets).
- Hardest: fast and secure sockets at scale; optimization of networked and logical game state, and sharing state between socket server and api server.
- Tech: Go, WebSocket, Solidity, chain Bitkub · Stops: all 5

**Evermoon SocialFi:**
**A:**

- Months / title: 2 months · Team: Evermoon Team · Public link: https://moonmission.evermoon.games · Status: ended
- Pitch: SocialFi platform, monthly quests + social tasks earn Moon Power (XP), $EVM tokens, NFTs.
- You built: server side, mission system only with quest engine, backend.
- Hardest: Testing and comunication · Number: ? · Tech: Go, MongoDB · Stops: ?

**Estic AI:**
**A:**

- Months / title: 1 year · Team: Tetregram · Public link: estic.ai · Status: live
- Pitch: find a home by talking to an AI, backed by hyper-local data.
- You built: client side — map, search, UI (frontend project, React/TS).
- Hardest: 4k+ pins smooth on one map; map optimization. clustering. like fetch the boundery to backend to get the pins from current view, like if zoomout the pin are like 4k+ pins, but if zoomin the pin are like 1k+ pins. and the backend is like a search engine to find the home by talking to AI.
- Tech: React, TypeScript, map lib? (Leaflet) · Stops: frontend + search API

41. **Project big-number tiles** (e.g. AADS "2 protocols", Estic "4k+ pins"): these belong on the project page, not global. Give me the real number per project, or `remove`.
    **A:** Remove
42. **Cover/short names and taglines** ("Evermoon — quests & XP", "Estic AI — map search", "AADS — radar, decoded"): approve or give your own one-liners per project.
    **A:** DRAFT (Claude, confirm or edit): AADS — radar, decoded · Morning Moon Village — farming meets DeFi · Morning Moon Pocket — the farm, rebuilt for phones · Metal Valley — mech hunters, on-chain · Evermoon SocialFi — quests & Moon Power · Estic AI — find a home by ai · School Bus System — tracking, administered.
43. **Project tags** (e.g. Real-time, Radar protocols, Encryption, Maps): approve per project or rewrite.
    **A:** DRAFT (Claude, confirm or edit): AADS: Real-time, Radar protocols, Encryption, Maps. Village: Go, Solidity, DeFi, NFTs. Pocket: Go, MongoDB, Soneium, Scale. Metal Valley: Sockets, Solidity, Bridge, Game server. Evermoon: Go, Missions, SocialFi. Estic AI: React, Maps, AI search. (Need to verify Village/Evermoon language: Go?)
44. **Anything else you shipped that is missing** (side projects, bots, tools, open source)?
    **A:** From your GitHub: `hexag` (Go hexagonal-architecture framework, pushed Sep 2026 — fits "general, scalable systems", worth showing as an open-source project), Sponge/Pixelmon Minecraft plugins in Java (2022–23: guilds, boosters, showdown, texture tokens), `px.frontend` (TypeScript, 2026), a Spicetify extension (fork), `cs-434` data-mining final project (2021), `project-tid-rod` (C#, 2021). Which are worth listing? Suggest: hexag + Minecraft plugins as "Side quests".

## 10. Notes (blog)

The five posts now are samples I invented ("Your socket server is a state machine", "Rewriting a live game backend without stopping the game", "Reading your own Solidity like an attacker", "Four thousand pins, one smooth map", "Binary protocols, human screens").

45. **Do you want a Notes section at all right now?** If you have nothing written yet, I can hide it (home teaser, nav, menu, terminal, About tile) until you do.
    **A:** yes
46. **If yes: do you have real posts or drafts?** Paste titles + text or paths. Or which 3–5 topics could you honestly write about from experience?
    **A:** no, but i wan you to write 1-2 posts for me, like "How to build a scalable backend for a game" and "How to write secure smart contracts for DeFi" or use my github to write the posts.
47. **Notes headline** ("Notes from behind the screen") — keep? Who are notes for?
    **A:** any reader

## 11. Contact

48. **Contact email shown:** wilhelm.hsf@gmail.com — correct and the one you want public? GitHub `king-glitch`, LinkedIn `william-siefert` OK?
    **A:** DRAFT (Claude, confirm or edit): yes: wilhelm.hsf@gmail.com, github.com/king-glitch, linkedin.com/in/william-siefert. Confirm email is public-OK.
49. **Other channels** (X, Telegram, LINE, Discord, Medium, CV link)? Any to hide?
    **A:** discord is rachamon
50. **Contact section wording** ("Let's talk — I'll help make it boring, in the best way."): keep? What kind of conversations do you want (full-time, contract, advice, collaboration)?
    **A:** DRAFT (Claude, confirm or edit): "Hiring, contracts, or a hard backend problem? Let's talk." Conversations wanted: full-time, contract/freelance, remote or abroad.

## 12. Fun layer (mascot, terminal, loader)

51. **Mascot:** keep the companion bubbles on every page? They are my invented jokes ("Zero downtime. I checked.", "He writes things down. I just read them."). Keep the idea, rewrite lines, or remove?
    **A:** DRAFT (Claude, confirm or edit): Keep, rewrite lines with your voice (humor 7–8): e.g. "Zero downtime. I checked." → keep; "He writes things down." → remove (notes hidden). Mascot talks about: scaling, queues, green tea, 3 a.m. alerts.
52. **Mascot name?** Any personality notes (shy, snarky, supportive)?
    **A:** ? (Suggest: "Bracket" — it is the Brackets face. Personality: supportive with dry humor.)
53. **Terminal easter eggs** (`sudo hire william`, `whoami`, titlebar `william@x10`). Keep? Change the whoami text? Add your own commands or in-jokes?
    **A:** DRAFT (Claude, confirm or edit): Keep `sudo hire william`; change titlebar from `william@x10` to `tiger@portfolio` (X10 name must not appear, per your Q32 answer); whoami → "William 'Tiger' Siefert — software developer. Go, TypeScript, Solidity. Builds systems that scale." Add `ls hours` (6,104 coding hours) ?
54. **Preloader lines** ("Warming things up… / Wiring the sockets… / Reading the contracts twice…"). Keep or personalise?
    **A:** DRAFT (Claude, confirm or edit): "Spinning up goroutines…" / "Opening the sockets…" / "Reading the contract twice…" / "Ready. Say hi."
55. **About → Explore "wall of tiles":** captions like "of my work happens behind the scenes", "Real-time, everywhere", "Is it live yet? / It's been live ✓". Keep which? Add personal tiles (hobbies, favourite games, music, city, coffee)?
    **A:** DRAFT (Claude, confirm or edit): Keep: Real-time, Live both ways, Golang, Solidity, Education. Drop: "of my work happens behind the scenes" (too narrow). Add personal: green tea, games, Bangkok, 6,100 coding hours. Which games?

## 13. Meta, SEO, legal

56. **Page titles / description for search and link previews.** Current: "William Siefert — Software developer". Want a 1-line description and a social preview image?
    **A:** DRAFT (Claude, confirm or edit): Title: "William Siefert — Software developer, Go · TypeScript · Web3". Description: "Bangkok-based software developer building scalable backends, real-time systems and smart contracts, plus the clean UI on top." Preview image: later.
57. **Footer line** (© year + name). Add anything: "Built with …", "Hosted on …", a license line?
    **A:** DRAFT (Claude, confirm or edit): © 2026 William Siefert · Built with React Router, Tailwind, shadcn. (Hosting: Firebase.) OK?
58. **Domain name** the site will live on (for canonical/OG tags)?
    **A:** ? (Firebase site id is `portfolio-rachamon`; custom domain?)

## 14. Anything else

59. **What do you want people to remember you for?**
    **A:** ?
60. **What does the current site say that is NOT true or not you?** (be harsh)
    **A:** DRAFT (Claude, confirm or edit): (a) "Parts you never see" / backend-only framing is too narrow; widened. (b) X10 Interactive appears on the resume and terminal; you said no company name. (c) "4k+ pins" is not global. (d) Hello copy about "real people use" is generic. Add your own list.
61. **Anything I did not ask that matters.**
    **A:** ?

---

# Round 2 — gaps and conflicts after your answers

Answer under each. After this I start writing.

## A. Conflicts to resolve

62. **X10 name.** Q32 says do not name X10, but your project answers list "Team: X10 Interactive" and the link x10.games. Which is it? Options: (a) show X10 everywhere (resume, timeline, projects); (b) hide X10, say "game studio in Bangkok"; (c) show it only on the resume. Is the public link x10.games OK to show?
    **A:** i mean like the mock before was puttin x10 interactive (current work), like everywhere like i want portfolio to show my work, not the company focus. like the header has software engineer, it was x10 interactive.
63. **Years.** Pick one to show: "7 years coding (since 2019)" or "3 years professional (since 2023)". Playful label ideas: "Years of breaking things on purpose" / "Years getting paid to".
    **A:** playful.
64. **Is the Estic AI team "Tetregram" a company you worked for?** Dates, your title (Frontend developer? Contract?), and was it alongside X10 or after? Public name OK?
    **A:** it was freelance contract, i was frontend developer, it was alongside X10, public name is OK.
65. **Timeline gap check.** Estic AI (1 year), Village (~3 yrs), Pocket (9 months), Metal Valley (2 yrs), Evermoon (2 months) overlap. Give approximate start–end per project (year-month) so the timeline and resume line up.
    **A:** it was all in 2023 to 2026 concurrently, x10 is the main company, and estic is freelance contract, so the timeline is like 2023-2026.

## B. Missing project facts

66. **AADS:** backend language is TypeScript (Node)? Status: delivered / in use / prototype? Any safe number (radars connected, tracks/sec, operators)? May I say "military" and "Thailand", or say "defence software" only?
    **A:** you can say military and Thailand, backend language is TypeScript (Node), status: unknown, no safe number to say.
67. **Best-first order.** Rank your six (plus School Bus, hexag) from most impressive to least.
    **A:** 1. Morning Moon Pocket, 2. Metal Valley, 3. Evermoon SocialFi, 4. Estic AI, 5. Morning Moon Village, 6. hexag, 7. AADS, 8. School Bus.
68. **Real numbers (any, even rough, mark public/private):** players or wallets on Village/Pocket/Metal Valley; contracts deployed; peak concurrent sockets; requests/s; uptime; pins fetch latency on Estic (4k+ zoomed out / 1k+ zoomed in is already great). If none, I use none.
    **A:** no
69. **Estic AI map:** your explanation (bounding-box fetch, pin count shrinks as you zoom) is great. Confirm: backend returns pins per viewport and clusters server-side or client-side? Leaflet plus a cluster plugin or custom?
    **A:** client-side clustering, Leaflet plus a cluster plugin.
70. **Metal Valley:** "sharing state between socket server and API server" — how (Redis pub/sub, queue, shared DB)? One sentence.
    **A:** shared DB, the socket server and API server share the same MongoDB database, so they can read and write the same state.
71. **Pocket:** what was "the old architecture" vs "the new" in one sentence each (monolith → modules? new DB schema?), and what did you keep compatible?
    **A:** new db schema, new code optimization.
72. **Evermoon:** "ended" — campaign finished or product shut down? What was the quest engine (monthly quests, social-task verification)?
    **A:** compaign finished, the quest engine was monthly quests and social-task verification.
73. **Village:** "5 years of backend code written by others" — you inherited a long-lived Go codebase. One example of what you improved or untangled.
    **A:** i add more features. so i needed to understand the old codebase, and i add more features to the backend, like new shop system.
74. **School Bus:** what it tracked (GPS? routes? students?), backend language, frontend stack, team size, one challenge.
    **A:** in bus will has like an iot device to track the bus, and sends the data to the backend, and the backend will store the data in the database, and the frontend will show the data in the map, and the team size is 4 people.
75. **hexag:** one-line pitch (what it generates or enforces), is it ready to link as open source? Keep as a "Side quest"?
    **A:** it's helps ai to implement hexagonal architecture, in a coding style like i want and implemented. so that me and ai can keep the codebase clean and scalable.
76. **Other GitHub items to show or hide:** Minecraft/Pixelmon plugins (Java, 2022–23), cs-434 data mining, px.frontend. Show as "Side quests", or hide?
    **A:** Minecraft are ok. data mining is project for school, so i will hide it. px.frontend is a project that i will show it later.

## C. Voice and copy decisions

77. **Hero tags:** pick 3 from `@scalable` `@general-purpose` `@web3` `@low-latency` `@reliable` `@go-ish` or write yours.
    **A:** @scalable, @optimized, @secure
78. **Self-deprecating GitHub humor** ("writes code that sometimes works") on the site, in the mascot only, or never?
    **A:**
79. **Five habits (Q24):** approve or edit the draft below, and give one true example for each from your work.
    1. Build it general, not one-off. Example: generic type, can be used in many scaenarios, like a generic queue system, that many services/projects can use it.
    2. Scale before it has to. Example:
    3. Measure, then optimise. Example:
    4. Money and keys are loaded guns: review twice. Example:
    5. Keep it boring to maintain. Example:
       **A:**
80. **Section title for habits:** "How I think about systems" or "Rules I build by" or yours?
    **A:**
81. **Spotlight (Q20) approve?** See = a button, a map, a farm. I see = queues draining, sockets staying open, state that stays correct, contracts nobody can rewrite. Edit or approve.
    **A:** something about my coding style, like i want to build a system that is general, dynamic, and scalable, optimized, and secure. so i will change the spotlight to "What you see: a button, a map, a farm. What I see: a system that is general, dynamic, scalable, optimized, and secure."
82. **Mascot name** (default: "Bracket"). Approve or rename. Any phrase it should repeat?
    **A:** Name: Void
83. **Stats (final):** projects shipped (6, or 7 with School Bus?) · languages (7) · years (see 63). Playful labels? Approve mine: "Launch days survived", "Languages I argue in", "Years of breaking things on purpose".
    **A:** School Bus is not shipped, so 6 projects shipped. Languages 7, years 7. Approve playful labels.
84. **Notes posts:** I write 2 from your real work. Confirm topics and what I may state as fact. Proposed:
    1. "How to build a scalable game backend" (Go, MongoDB, WebSocket, queue, sharing state between socket and API servers, inheriting 5 years of code).
    2. "Writing smart contracts you can sleep next to" (review twice, upgrade paths, Bitkub/Soneium).
       Add a third from Estic: "4,000 pins, one smooth map". Which? Any detail I must not claim (audits, losses, incidents)? Tone: calm, technical, a little funny. Do you want them marked "Draft by Claude, edit me"?
       **A:**
85. **Notes headline** for any reader: "Notes from behind the screen" or "Things I learned the loud way"?
    **A:**
86. **Discord** `rachamon`: show in contact next to email, GitHub, LinkedIn? Public email OK?
    **A:** yes
87. **Domain** (custom or the Firebase default)? And social preview image: use the mascot?
    **A:**
88. **What do you want people to remember you for?** (one line; I use it as the closing line)
    **A:**
89. **Games on the About wall (Q55):** which games do you play? Which tea?
    **A:**
90. **Thai:** keep the English copy culturally neutral so Thai i18n can follow later? Anything to avoid translating (names, project titles)?
    **A:**

---

### Notes for me (not for you)

- Remove "pins" stat tile and its config (`config.home.hello.pinsStat`, `home.hello.stats.pins`, About `pins` tile) once Q21 is answered.
- Hello stats row layout alignment: revisit after final stat count.
- Copy sources to rewrite: `src/locales/en.json`, `src/api/mocks/portfolio/{profile,projects,posts}.ts` (generated from `content/ME.md` by `bun run build:portfolio`; note `content/ME.md` is currently deleted in the working tree, restore from git or recreate).
