### Portfolio

## About Me

I’m William. I build the parts of apps and games you never see — the bits that keep everything quick, fair and online when a lot of people show up at once. I like hard problems, short feedback loops, and leaving code a little nicer than I found it.

## Skills
- Programming Languages: Golang, Typescript, Solidity, Python, PHP, Java, C#
- Frameworks and Libraries: MongoDB, SQL, React
- Tools and Technologies: Git, Docker, AWS, Google Cloud Platform, Web3, Blockchain
- Soft Skills: Problem-solving, Time Management, Communication, Teamwork
- Hardskills: Backend Development, Server-side Development, Smart Contract Development, Socket Communication, Performance Optimization, Scalability, Security Measures.

## Experience
- **Bangkok University Multimedia Intelligent Technology** (June 2022 - June 2023)
  - Worked on student research projects in multimedia and intelligent technology, including AADS (an air defence system for the army) and a school bus tracking system.
- **Software Developer X10 Interactive** (2023 - Present)
  - Build and look after web apps, game servers and blockchain products, from the first prototype to live launches.
  - Keep quality high with code reviews and tests, and ship on time alongside designers, client developers and product people.

## Education
- **Bangkok University** (2019 - 2023)
  - Bachelor of Science in Computer Science, majoring in multimedia intelligent technology. Four years of fundamentals plus hands-on research projects, which is where I learned to enjoy the hard parts.

## Core Skills
- Backend Development: Server-side apps that stay fast, scale with traffic and keep data safe.
- Smart Contract Development: Solidity contracts for games and apps, written with security in mind from the first line.
- Socket Communication: Real-time links between players and servers, so every screen shows the same thing at the same moment.
- Performance Optimization: Finding the slow parts of code and architecture, and fixing them without breaking anything else.
- Security Measures: Encryption, authentication and careful coding, so the only people inside are the ones invited.

## Projects

1. **AADS (Army Air Defense System)**

# About

Software that turns raw radar signals into a live air picture for military operators. It tracks aircraft from surveillance radars across Thailand, lets operators talk and message each other, and raises an alert when an aircraft looks hostile. Access to each control depends on where the operator logs in from.

# Role

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

2. **Morning Moon Village**

# About

A farming game with real DeFi yield farming inside it. Players grow crops, gather resources and learn how yield farming works while they play, earning tokens along the way. NFTs add a competitive edge, and the cute 3D world keeps it friendly.

# Role
- Built server-side features such as the shop system and resource spawning, and kept them fast as the player count grew.
- Connected the game to the blockchain so its DeFi mechanics and NFTs work in play.
- Worked closely with the client-side team, so new features landed in the game without friction.

# Challenges

- The DeFi mechanics live in Solidity smart contracts, so every contract had to be secure before it went live.
- Server features only work if the client is ready for them, which took close planning with the client-side team.
- Real money moves through NFTs and DeFi, so testing went deep on both how things work and how they could be abused.

3. **Morning Moon Pocket**

# About

Morning Moon Village, rebuilt for phones. Players get the same farming and resource gathering on a pocket-sized screen, with an interface made for touch and performance tuned for mobile.

# Role

- Rewrote the server-side code in Golang and MongoDB for global players on the Soneium chain, with speed, scale and security as the goals.
- Added new features such as a shop system and a mission system, all built to handle a large number of players.
- Rewrote most of the Solidity smart contracts for the game's DeFi mechanics, so they are safe, efficient and fit the new architecture.
- Worked with the client-side team so server features felt smooth on mobile.

# Challenges

- Rebuilding the server for far more players without changing how the game feels took careful planning with the client-side team.
- The smart contracts had to get faster and stay just as secure, which left no room for shortcuts.
- The timeline was short, so a lot of testing and debugging went into keeping the new build stable.

4. **Metal Valley**

# About

A hybrid game that mixes Web2 gameplay with Web3 ownership. Players are mech hunters on a distant archipelago: they find wandering robots, capture and train them, customise them, and restore them to help humanity again.

# Role

- Built the server-side socket layer that links players to the game, made to stay fast, secure and reliable with many players online.
- Built core mechanics such as capturing and training robots.
- Worked with the client-side team so server features fit the game smoothly.
- Wrote most of the Solidity smart contracts for the game's DeFi mechanics, focused on safety and efficiency.
- Built the website and backend that bridge items between the game and the chain, where players manage their assets and NFTs.

# Challenges

- Many players at once meant the server side had to be planned for scale from day one, together with the client-side team.
- The socket link had to be fast and secure at the same time, which shaped the whole network design.
- Capturing and training robots had to feel good to play and stay cheap to run on the server.
- The smart contracts had to be efficient without giving up any security.
- With blockchain mechanics and NFTs in the mix, testing and debugging never stopped until the game was stable.

5. **Evermoon SocialFi**

# About

Evermoon SocialFi is a platform from Evermoon that rewards people for taking part. Users join monthly quests, complete social media tasks and earn Moon Power (XP) to unlock rewards. With Web3 built in, active users can also collect $EVM tokens, NFTs and exclusive content.

# Role

- Built the server-side features of the platform, including the mission system.

# Challenges

- The mission system had to work hand in hand with the client-side app, so both teams planned it together and kept it fast.

6. **Estic AI**

# About

Estic AI is a real estate platform that helps you find a home by simply talking to it. It pairs generative AI with detailed local data, so every search comes with context, not just listings. It offers features such as conversational search, hyper-local insights, climate-risk simulation, white-label chatbots, and a data marketplace for licensing-grade real estate datasets.

# Role

- Developed the client-side of the platform: the map, search and interface people use every day.
- Worked with the server-side team so the screens stayed fast with real data behind them.

# Challenges

- The product used new tools and patterns, so the UI framework needed careful groundwork.
- The map shows 4k+ pins at once, and both the map and search had to stay smooth.
- Many features and data sources meant security had to be part of every integration.
