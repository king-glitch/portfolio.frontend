### Portfolio

## About Me

Hi, I’m William, or Tiger. I write Go and TypeScript, mostly the kind with sockets, queues and smart contracts behind it. I like systems that are general, dynamic and still standing when traffic triples, and I build the simple front end on top because a clean UI is half of a reliable product. I learned by building, breaking and rebuilding. Off the clock: games, green tea and too much Reddit.

## Skills
- Programming Languages: Golang, Typescript, Solidity, Python, PHP, Java, C#
- Frameworks and Libraries: MongoDB, SQL, React
- Tools and Technologies: Git, Docker, AWS, Google Cloud Platform, Web3, Blockchain
- Soft Skills: Problem-solving, Time Management, Communication, Teamwork
- Hardskills: Backend Development, Server-side Development, Smart Contract Development, Socket Communication, Performance Optimization, Scalability, Security Measures.

## Experience
- **Software Engineer X10 Interactive** (2023 - Present)
  - Build and look after game servers, web apps and blockchain products on the Soneium and Bitkub chains, from the first prototype to live launches.
  - Keep quality high with code reviews and tests, and ship alongside designers, client developers and product people.
- **Fullstack Developer Intern Bangkok University Multimedia Intelligent Technology** (June 2022 - June 2023)
  - Interned in the university research lab, building AADS, a military air defence system, and the School Bus Backend and Administration System.

## Education
- **Bangkok University** (2019 - 2023)
  - Bachelor of Science in Computer Science, majoring in multimedia intelligent technology. GPA 3.90. Senior project: the School Bus Backend and Administration System.

## Core Skills
- Backend Development: General, dynamic servers that scale with traffic and keep data safe.
- Smart Contract Development: Solidity contracts for games and apps on Soneium and Bitkub, written with security in mind from the first line.
- Socket Communication: Real-time links between players and servers, so every screen shows the same thing at the same moment.
- Performance Optimization: Measuring first, then fixing the slow parts of code and architecture without breaking the rest.
- Security Measures: Encryption, authentication and careful coding, so the only people inside are the ones invited.

## Projects

1. **Morning Moon Pocket**

# About

Morning Moon Village, rebuilt for phones. The same farming and resource gathering on a touch-first screen, with the whole server side rewritten for global players on the Soneium chain.

# Role

- Rewrote the server side in Golang and MongoDB with a new database schema and optimised code, so it scales to far more players.
- Moved the old features onto the new architecture and kept the live ones working.
- Added new features such as a shop system and a mission system, and kept every player in sync in real time.
- Rewrote most of the Solidity smart contracts for the game’s DeFi mechanics, so they are safe, efficient and fit the new architecture.
- Worked with the client-side team so server features felt smooth on mobile.

# Challenges

- Rewriting old features on a new architecture while keeping the old ones working took careful planning with the client-side team.
- More players with the same feel, on a short timeline, left a lot of testing and debugging to keep the new build stable.
- The smart contracts had to get faster and stay just as secure, which left no room for shortcuts.

2. **Metal Valley**

# About

A hybrid game that mixes Web2 gameplay with Web3 ownership. Players are mech hunters on a distant archipelago: they find wandering robots, capture and train them, customise them, and restore them to help humanity again.

# Role

- Built the Golang WebSocket layer that links players to the game, made to stay fast, secure and reliable with many players online.
- Built core mechanics such as capturing and training robots.
- Kept the socket server and the API server in step by sharing the same MongoDB state.
- Wrote most of the Solidity smart contracts for the game’s DeFi mechanics on the Bitkub chain, focused on safety and efficiency.
- Built the website and backend that bridge items between the game and the chain, where players manage their assets and NFTs.
- Worked with the client-side team so server features fit the game smoothly.

# Challenges

- Many players at once meant fast and secure sockets, planned for scale from day one.
- The networked game state and the game logic both had to be optimised, without drifting apart.
- Sharing state between the socket server and the API server, so they always agree.
- The smart contracts had to be efficient without giving up any security.
- With blockchain mechanics and NFTs in the mix, testing and debugging never stopped until the game was stable.

3. **Evermoon SocialFi**

# About

Evermoon SocialFi is a platform from Evermoon that rewards people for taking part. Users join monthly quests, complete social media tasks and earn Moon Power (XP) to unlock rewards. With Web3 built in, active users can also collect $EVM tokens, NFTs and exclusive content. The campaign has since ended.

# Role

- Built the server side of the platform in Golang and MongoDB, including the mission system and the quest engine for monthly quests and social-task verification.

# Challenges

- The quest engine had to work hand in hand with the client-side team, so testing and communication mattered as much as the code.

4. **Estic AI**

# About

Estic AI is a real estate platform that helps you find a home by simply talking to it. It pairs generative AI with detailed local data, so every search comes with context, not just listings. It offers features such as conversational search, hyper-local insights, climate-risk simulation, white-label chatbots, and a data marketplace for licensing-grade real estate datasets.

# Role

- Developed the client-side of the platform as a freelance frontend developer with Tetregram: the map, the search and the interface people use every day, in React and TypeScript.
- Worked with the server-side team so the screens stayed fast with real data behind them.

# Challenges

- The product used new tools and patterns, so the UI framework needed careful groundwork.
- The map shows 4k+ pins zoomed out and about 1k+ zoomed in, so it asks the backend for only the pins in the current view and clusters them on the client with Leaflet.
- Many features and data sources meant security had to be part of every integration.

5. **Morning Moon Village**

# About

A farming game with real DeFi yield farming inside it. Players grow crops, gather resources and learn how yield farming works while they play, earning tokens along the way. NFTs add a competitive edge, and the cute 3D world keeps it friendly.

# Role

- Learned a Golang backend that had grown for five years under other hands, then extended it with features such as the new shop system and resource spawning.
- Connected the game to the blockchain so its DeFi mechanics and NFTs work in play.
- Wrote Solidity smart contracts for the DeFi mechanics, built with security in mind.
- Worked closely with the client-side team, so new features landed in the game without friction.

# Challenges

- Understanding five years of server-side code written by others, so new features fit instead of fighting it.
- The DeFi mechanics live in Solidity smart contracts, so every contract had to be secure before it went live.
- Real money moves through NFTs and DeFi, so testing went deep on both how things work and how they could be abused.

6. **AADS (Army Air Defense System)**

# About

Software that turns raw radar signals into a live air picture for military operators in Thailand. It tracks aircraft from surveillance radars, lets operators talk and message each other, and raises an alert when an aircraft looks hostile. Access to each control depends on where the operator logs in from.

# Role

- Built the TypeScript backend as the full-stack developer on a four-person team, from my internship at the university research lab.
- Decoded radar messages in the TRML and DR127ADV protocols and turned them into readable tracks on a map.
- Built the socket link between server and client, so every operator sees updates and control changes in real time.
- Designed the operator screen: a live map with zoom and pan, voice calls, messaging and alerts for suspect aircraft.

# Features

- Real-time aircraft tracking from surveillance radars
- Fake aircraft for training and for rehearsing real situations
- Access control based on the operator's IP address
- Voice calls and encrypted messaging between operators
- Alerts for suspect aircraft, so operators react sooner
- One-click state changes, like marking an aircraft as friend or enemy
- A map you can zoom and pan, with alert settings each operator can tune

# Challenges

- The radar protocols are dense and the data never stops, so decoding had to be both exact and fast.
- The socket link had to stay up and stay private, which meant planning the network and its security together.
- Operators work under pressure. The screen went through many rounds of testing until it felt obvious to use.
