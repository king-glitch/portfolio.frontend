/* me-data.js — the single data source for every artboard.
   Parses ME.md (embedded below), builds each project's block layout
   (the same [{ type, params }] shape a backend would send) and holds the blog posts.
   Exposes window.ME. */
(function () {
  var RAW = `## About Me

My name is William Siefert, and I am a software developer with a passion for creating innovative solutions to complex problems. With a strong background in computer science and experience in various programming languages, I have developed a diverse skill set that allows me to tackle a wide range of projects. I am always eager to learn new technologies and stay up-to-date with industry trends, which helps me to continuously improve my skills and deliver high-quality work.

## Skills
- Programming Languages: Golang, Typescript, Solidity, Python, PHP, Java, C#
- Frameworks and Libraries: MongoDB, SQL, React
- Tools and Technologies: Git, Docker, AWS, Google Cloud Platform, Web3, Blockchain
- Soft Skills: Problem-solving, Time Management, Communication, Teamwork
- Hardskills: Backend Development, Server-side Development, Smart Contract Development, Socket Communication, Performance Optimization, Scalability, Security Measures.

## Experience
- **Bangkok University Multimedia Intelligent Technology** (June 2022 - June 2023)
  - As a student, I have been actively involved in various projects and research related to multimedia intelligent technology. During my time at the university, I have been working on various projects, including AADS (Army Air Defense System), School Bus Tracking System.
- **Software Developer X10 Interactive** (2023 - Present)
  - Developed and maintained various software applications, including web applications, and blockchain-based solutions.
  - Implemented best practices for software development, including code reviews, testing to ensure the quality and reliability of the software, and collaborated with cross-functional teams to deliver high-quality products on time.

## Education
- **Bangkok University** (2019 - 2023)
  - Bachelor of Science in Computer Science, with a focus on multimedia intelligent technology. During my time at the university, I have gained a strong foundation in computer science principles and have had the opportunity to work on various projects and research related to multimedia intelligent technology, which has helped me to develop my skills and knowledge in this field.

## Core Skills
- Backend Development: Proficient in developing server-side applications using various programming languages and frameworks, with a focus on performance optimization, scalability, and security measures.
- Smart Contract Development: Experienced in developing smart contracts using Solidity for blockchain-based applications, with a strong understanding of blockchain technology and security considerations.
- Socket Communication: Skilled in implementing socket communication for real-time updates and interactions between clients and servers, ensuring optimized performance and reliability.
- Performance Optimization: Adept at optimizing code and system architecture to improve performance and scalability, while also ensuring the security and reliability of the applications.
- Security Measures: Knowledgeable in implementing security measures to protect applications and data, including encryption, authentication, and secure coding practices.

## Projects

1. **AADS (Army Air Defense System)**

# About

A military program that tracks the aircraft from surveillance radars and let user to control the system. with permissions system based on the ip address of the user. The system includes Voice Call, Messaging, Control State of the Aircrafts, and Alert if the aircraft is suspect as a enemy.

# Role

- Implemented a military program to control aircraft from surveillance radars around Thailand by decoding encoded messages using TRML and DR127ADV protocols and converting it to readable format for the user.
- Established communication between server and client using sockets to allow real-time updates and control of the system.
- Developed a user interface that allows users to easily monitor and control the aircraft, including features such as voice call, messaging, and alert notifications for suspect aircraft.

# Features

- Real-time tracking of aircraft from surveillance radars
- Fake aircraft creation for testing and preparing for real combat situations
- Permission system based on the IP address of the user to control access to the system
- Voice call and encrypted messaging for secure communication between users
- Alert notifications for suspect aircraft to enhance situational awareness and response time
- Control state of the aircraft, like changing the flag of the aircraft to friend or enemy, to help the user to easily identify the aircraft and make informed decisions.
- User-friendly interface that allows users to easily monitor and control the aircraft, with features such as zooming and panning on the map, and customizable settings for alerts and notifications.

# Challenges

- Decoding the encoded messages from the surveillance radars was a complex task that required a deep understanding of the TRML and DR127ADV protocols, as well as the ability to handle large amounts of data in real-time.
- Establishing communication between the server and client using sockets required careful consideration of the network architecture and security measures to ensure that the system was reliable and secure.
- Developing a user interface that was both functional and user-friendly required a lot of design and testing to ensure that it met the needs of the users and provided a seamless experience.

2. **Morning Moon Village**

# About

A Cryto game that combines farming and resource gathering with DeFi yield farming mechanics. Players can learn how to be a yield farmer and earn digital tokens while enjoying the fun of a farming-style game with cute 3D graphics. The game also features NFTs that enhance the competitive aspect of the game.

# Role
- Developed the server-side features of the game including the implementation of the some of the core mechanics of the game such as shop system, new resource spawning features, and the integration of blockchain into the game to support the DeFi mechanics and NFTs, while also ensuring that the server-side features were optimized for performance and scalability.
- Collaborated with the client-side development team to ensure seamless integration of server-side features.

# Challenges

- Implementing smart contracts using Solidity for the game's DeFi mechanics required a deep understanding of blockchain technology and careful consideration of security measures to ensure that the contracts were reliable and secure.
- Developing the server-side features of the game required careful planning and coordination with the client-side development.
- Ensuring not only the functionality but also the security of the game, especially with the integration of NFTs and DeFi mechanics, was a significant challenge that required thorough testing and attention to detail.

3. **Morning Moon Pocket**

# About

A mobile version of the Morning Moon Village game that allows players to enjoy the same farming and resource gathering mechanics on their mobile devices. The game features a user-friendly interface and optimized performance for mobile platforms, while still maintaining the core gameplay experience of the original game.

# Role

- Rewrite the server-side features of the game using Golang, MongoDB, and Solidity to optimize performance and ensure compatibility, Scalability, and security catch up with the new architecture of the word to support global players in soneium chain.
- Implemented new features like shop system, mission system, and more, focus on optimizing the performance and scalability of the server-side features to support a large number of players.
- Implemented and Rewrite most of the solidity smart contracts for the game's DeFi mechanics to ensure that they were reliable and secure, while also optimizing, scalable, and compatible with the new architecture of the game.
- Collaborated with the client-side development team to ensure seamless integration of server-side features and optimized performance for mobile platforms.

# Challenges

- Optimizing the server-side code and rewrite to improve new architecture of the system to support a large number of players while maintaining the core gameplay experience of the original game was a significant challenge that required careful planning and coordination with the client-side development team.
- Ensuring the security and reliability of the smart contracts while optimizing them for performance and scalability was a complex task that required a deep understanding of blockchain technology and careful consideration of security measures.
- Loads of testing and debugging was required to ensure that the game was stable and provided a seamless experience in a short implementation time, especially with the integration of new features and optimizations.

4. **Metal Valley**

# About

A Hybrid NFT game that combines the strengths of Web2 and Web3 games. Players can explore a world of living robots, embark on an adventure as a mech hunter in a distant archipelago, discover wandering robots, capture, train, customize and restore them to their former aid to humanity.

# Role

- Developed the server-side of socket communication between the client and server using with optimized performance and scalability to support a large number of players, while also ensuring the security and reliability of the communication.
- Implemented the core mechanics of the game, such as the robot capturing and training system, while also ensuring that the server-side features were optimized for performance and scalability.
- Collaborated with the client-side development team to ensure seamless integration of server-side features and optimized performance for the game.
- Implemented most of the solidity smart contracts for the game's DeFi mechanics to ensure that they were reliable and secure, while also optimizing, scalable, and compatible with the new architecture of the game.
- Implemented website and backend to support user bridge the game item and chain assets, between the game and the blockchain, and also support the user to manage their assets and NFTs in the game.

# Challenges

- Developing the server-side features of the game while ensuring optimized performance and scalability to support a large number of players was a significant challenge that required careful planning and coordination with the client-side development team.
- Ensuring the security and reliability of the socket communication while optimizing it for performance and scalability was a complex task that required a deep understanding of network architecture and security measures.
- Implementing the core mechanics of the game, such as the robot capturing and training system, while also ensuring that the server-side features were optimized for performance and scalability, required careful consideration of game design and architecture.
- Ensuring the security and reliability of the smart contracts while optimizing them for performance and scalability was a complex task that required a deep understanding of blockchain technology and careful consideration of security measures.
- Loads of testing and debugging was required to ensure that the game was stable and provided a seamless experience, especially with the integration of new features and optimizations, and also with the integration of blockchain mechanics and NFTs.

5. **Evermoon SocialFi**

# About

Evermoon SocialFi is an innovative SocialFi platform developed by Evermoon, designed to engage users through a wide variety of tasks, activities, and Play-to-Earn (P2E) features. Players can participate in monthly quests, complete social media tasks, and earn Moon Power (XP) while unlocking exciting rewards. Through Web3 integration, Evermoon SocialFi offers unique earning opportunities, allowing participants to collect $EVM tokens, NFTs, and exclusive content by actively engaging with the platform.

# Role

- Developed the server-side features of the platform like mission system.

# Challenges

- Implementing the mission system and other server-side features required careful planning and coordination with the client-side development team to ensure seamless integration and optimized performance.

6. **Estic AI**

# About

Estic AI is an AI-powered real estate platform that finds your perfect property through conversation. It combines generative AI with deep, hyper-local data to provide users with a seamless and informed property search experience. The platform offers features such as conversational search, hyper-local insights, climate-risk simulation, white-label chatbots, and a data marketplace for licensing-grade real estate datasets.

# Role

- Developed the client-side features of the platform, including the implementation of map features, search functionality, and user interface to provide a seamless and intuitive user experience.
- Collaborated with the server-side development team to ensure seamless integration of client-side features and optimized performance for the platform.

# Challenges

- New technologies and features required careful implementation of the ui framework.
- Optimize the performance of the map with 4k+ pins in the map, and also the search functionality to provide a seamless experience for users.
- Ensuring the security and reliability of the platform while integrating various features and data sources required careful consideration of security measures.
`;

  function parse() {
    var out = { about: '', skills: [], experience: [], education: [], core: [], projects: [] };
    var section = '', proj = null, sub = '', entry = null;
    var lines = RAW.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/\s+$/, '');
      var m = line.match(/^## (.+)/);
      if (m) { section = m[1].trim().toLowerCase(); proj = null; sub = ''; entry = null; continue; }
      if (section === 'projects') {
        m = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
        if (m) { proj = { title: m[1], about: '', role: [], features: [], challenges: [] }; out.projects.push(proj); sub = ''; continue; }
        m = line.match(/^#\s+(.+)/);
        if (m) { sub = m[1].trim().toLowerCase(); continue; }
        if (!proj || !sub) continue;
        m = line.match(/^\s*-\s+(.+)/);
        if (m) { if (Array.isArray(proj[sub])) proj[sub].push(m[1].trim()); continue; }
        if (sub === 'about' && line.trim()) proj.about += (proj.about ? ' ' : '') + line.trim();
        continue;
      }
      if (section === 'about me') { if (line.trim()) out.about += (out.about ? ' ' : '') + line.trim(); continue; }
      if (section === 'skills') {
        m = line.match(/^-\s+([^:]+):\s*(.+)/);
        if (m) out.skills.push({ label: m[1].trim(), items: m[2].replace(/\.$/, '').split(',').map(function (s) { return s.trim(); }).filter(Boolean) });
        continue;
      }
      if (section === 'core skills') {
        m = line.match(/^-\s+([^:]+):\s*(.+)/);
        if (m) out.core.push({ label: m[1].trim(), text: m[2].trim() });
        continue;
      }
      if (section === 'experience' || section === 'education') {
        m = line.match(/^-\s+\*\*(.+?)\*\*\s*\((.+?)\)/);
        if (m) { entry = { title: m[1].trim(), period: m[2].trim().replace(' - ', ' — '), notes: [], kind: section === 'education' ? 'Education' : 'Work' }; out[section].push(entry); continue; }
        m = line.match(/^\s+-\s+(.+)/);
        if (m && entry) entry.notes.push(m[1].trim());
      }
    }
    var KW = [['Golang', 'golang'], ['MongoDB', 'mongodb'], ['Solidity', 'solidity'], ['Real-time', 'socket'], ['Radar protocols', 'trml'], ['Encryption', 'encrypt'], ['DeFi', 'defi'], ['NFTs', 'nft'], ['Web3', 'web3'], ['Soneium', 'soneium'], ['Missions', 'mission system'], ['In-game shop', 'shop system'], ['Generative AI', 'generative ai'], ['Maps', 'map']];
    function kindFor(t) {
      var s = t.toLowerCase();
      if (s.indexOf('aads') > -1 || s.indexOf('defense') > -1) return 'radar';
      if (s.indexOf('pocket') > -1) return 'pixel';
      if (s.indexOf('village') > -1) return 'moon';
      if (s.indexOf('metal') > -1) return 'hex';
      if (s.indexOf('evermoon') > -1) return 'orbit';
      if (s.indexOf('estic') > -1) return 'pins';
      return 'hex';
    }
    out.projects = out.projects.map(function (p, i) {
      var pm = p.title.match(/^(.+?)\s*\((.+)\)\s*$/);
      var hay = (p.about + ' ' + p.role.join(' ') + ' ' + p.features.join(' ') + ' ' + p.challenges.join(' ')).toLowerCase();
      var roleTxt = p.role.join(' ').toLowerCase();
      var kind = kindFor(p.title);
      return Object.assign({}, p, {
        name: pm ? pm[1] : p.title,
        full: pm ? pm[2] : p.title,
        num: String(i + 1).padStart(4, '0'),
        kind: kind,
        hay: hay,
        tags: KW.filter(function (k) { return hay.indexOf(k[1]) > -1; }).map(function (k) { return k[0]; }).slice(0, 5),
        side: roleTxt.indexOf('developed the client-side') > -1 ? 'On screen' : 'Behind the scenes',
        web3: /web3|solidity|nft|defi|blockchain/.test(hay),
        mockView: (kind === 'pixel') ? 'phone' : 'desktop'
      });
    });
    return out;
  }

  /* Per-project page layout — the same [{ type, params }] shape a backend would send. */
  function layout(p, all) {
    function H(variant) { return { type: 'project-header', params: { variant: variant, title: p.name, subtitle: p.full, index: p.num, discipline: p.side, tags: p.tags, kind: p.kind } }; }
    function first(s) { var m = (s || '').match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : (s || ''); }
    function last(a) { return a[a.length - 1] || ''; }
    var MOCK = 'Illustrative mock — swap for a real screenshot';
    switch (p.kind) {
      case 'radar': return [
        H('split'),
        { type: 'quote', params: { text: first(p.about), cite: 'Brief' } },
        { type: 'mock', params: { label: 'Operator console', kind: 'radar', screen: 'main', view: 'desktop', caption: MOCK } },
        { type: 'big-number', params: { value: '2', label: 'Radar protocols, decoded', caption: 'TRML and DR127ADV messages turned into readable, real-time tracks.' } },
        { type: 'architecture', params: { label: 'How it flows', nodes: [['Surveillance radars', 'Encoded track messages'], ['Decoder', 'TRML · DR127ADV → readable'], ['Socket server', 'Real-time state, both ways'], ['Operator UI', 'Map, voice, messaging, alerts']] } },
        { type: 'feature-grid', params: { label: 'Features', items: p.features } },
        { type: 'timeline', params: { label: 'Role', items: p.role } },
        { type: 'zigzag', params: { label: 'Challenges', items: p.challenges } }
      ];
      case 'moon': return [
        H('center'),
        { type: 'about-split', params: { label: 'About', text: p.about, kind: 'moon' } },
        { type: 'mock', params: { label: 'Farm & shop', kind: 'moon', screen: 'main', view: 'desktop', caption: MOCK } },
        { type: 'stack-cards', params: { label: 'Role', items: p.role } },
        { type: 'architecture', params: { label: 'How it flows', nodes: [['Game client', '3D farming game'], ['Game server', 'Shop, resource spawning'], ['Smart contracts', 'Solidity — DeFi, NFTs']] } },
        { type: 'quote', params: { text: last(p.challenges), cite: 'Hardest part', tone: 'invert' } },
        { type: 'numbered-list', params: { label: 'Challenges', items: p.challenges } }
      ];
      case 'pixel': return [
        H('vertical'),
        { type: 'chips', params: { label: 'The brief', title: 'Rewrite.', text: 'The whole server side, rebuilt for mobile and for global players on the Soneium chain.', items: ['Golang', 'MongoDB', 'Solidity', 'Soneium'] } },
        { type: 'lineage', params: { label: 'Lineage', from: 'Morning Moon Village', to: 'Morning Moon Pocket', text: 'Same farming loop, new pocket-sized client, a rebuilt server side and rewritten contracts underneath.' } },
        { type: 'gallery', params: { label: 'Screens', items: [{ kind: 'pixel', screen: 'main', view: 'phone', caption: 'Farm' }, { kind: 'pixel', screen: 'alt', view: 'phone', caption: 'Missions' }], caption: MOCK } },
        { type: 'numbered-list', params: { label: 'Role', items: p.role } },
        { type: 'architecture', params: { label: 'How it flows', nodes: [['Mobile client', 'Pocket-sized farm'], ['Go services', 'Shop, missions, more'], ['MongoDB', 'Players and progress'], ['Solidity on Soneium', 'Rewritten DeFi contracts']] } },
        { type: 'stack-cards', params: { label: 'Challenges', items: p.challenges } }
      ];
      case 'hex': return [
        H('outline'),
        { type: 'about-split', params: { label: 'About', text: p.about, kind: 'hex' } },
        { type: 'gallery', params: { label: 'Screens', items: [{ kind: 'hex', screen: 'main', view: 'desktop', caption: 'Capture' }, { kind: 'hex', screen: 'alt', view: 'desktop', caption: 'Bridge website' }], caption: MOCK } },
        { type: 'big-number', params: { value: 'W2+W3', label: 'Hybrid by design', caption: 'A Web2 game loop, with items and assets bridged between the game and the chain.' } },
        { type: 'architecture', params: { label: 'How it flows', nodes: [['Game client', 'Explore, capture, train'], ['Socket server', 'Real-time, many players'], ['Core mechanics', 'Capture & training system'], ['Bridge site + backend', 'Game items ↔ chain assets'], ['Smart contracts', 'Solidity — DeFi, NFTs']] } },
        { type: 'timeline', params: { label: 'Role', items: p.role } },
        { type: 'zigzag', params: { label: 'Challenges', items: p.challenges } }
      ];
      case 'orbit': return [
        H('center'),
        { type: 'chips', params: { label: 'About', title: '$EVM', text: p.about, items: ['Monthly quests', 'Social tasks', 'Moon Power XP', 'NFT rewards'] } },
        { type: 'mock', params: { label: 'Quest board', kind: 'orbit', screen: 'main', view: 'desktop', caption: MOCK } },
        { type: 'quote', params: { text: p.role[0] || '', cite: 'Role' } },
        { type: 'architecture', params: { label: 'How it flows', nodes: [['Platform', 'Tasks and activities'], ['Mission system', 'Quests, social tasks, XP'], ['Rewards', '$EVM tokens, NFTs']] } },
        { type: 'quote', params: { text: p.challenges[0] || '', cite: 'Challenge', tone: 'invert' } }
      ];
      case 'pins': {
        var fm = p.about.match(/features such as (.+?)\.?$/i);
        var feats = fm ? fm[1].replace(/,?\s+and\s+/, ', ').split(/,\s*/).map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }) : [];
        return [
          H('split-rev'),
          { type: 'big-number', params: { value: '4k+', label: 'Pins on one map', caption: p.challenges[1] || '' } },
          { type: 'gallery', params: { label: 'Screens', items: [{ kind: 'pins', screen: 'main', view: 'desktop', caption: 'Map search' }, { kind: 'pins', screen: 'alt', view: 'phone', caption: 'Conversation' }], caption: MOCK } },
          { type: 'about-split', params: { label: 'About', text: first(p.about) + ' ' + (p.about.split('. ')[1] || ''), list: feats } },
          { type: 'stack-cards', params: { label: 'Role', items: p.role } },
          { type: 'numbered-list', params: { label: 'Challenges', items: p.challenges } }
        ];
      }
      default: return [
        H('split'),
        { type: 'about-split', params: { label: 'About', text: p.about, kind: p.kind } },
        { type: 'numbered-list', params: { label: 'Role', items: p.role } },
        { type: 'numbered-list', params: { label: 'Challenges', items: p.challenges } }
      ];
    }
  }

  /* Blog posts — SAMPLE content to show the layouts. Replace with your own writing. */
  var POSTS = [
    {
      slug: 'socket-server-state-machine', title: 'Your socket server is a state machine', date: 'Sep 2026', tags: ['Sockets', 'Go'], kind: 'radar',
      excerpt: 'Connections are not “on” or “off”. Treat every one as a small state machine and most real-time bugs stop being mysterious.',
      blocks: [
        { t: 'p', text: 'Most real-time bugs I have chased were not in the business logic. They lived in the gap between “the socket is open” and “this player can actually receive state”. Naming those states explicitly is the cheapest fix there is.' },
        { t: 'h', text: 'Four states, not two' },
        { t: 'list', items: ['Connecting — handshake done, not authenticated yet', 'Ready — authenticated, subscribed, receiving state', 'Draining — server is shutting down or the client is slow', 'Closed — resources released, nothing else may write'] },
        { t: 'p', text: 'Once those states exist, every write path can ask one question first: am I allowed to send in this state? Draining connections get a final snapshot and nothing else. Closed connections never get anything.' },
        { t: 'code', lang: 'go', text: '// Keep the read deadline moving with every pong.\nconn.SetReadDeadline(time.Now().Add(pongWait))\nconn.SetPongHandler(func(string) error {\n    return conn.SetReadDeadline(time.Now().Add(pongWait))\n})\n\n// Never block the hub on one slow client.\nselect {\ncase c.send <- msg:\ndefault:\n    c.setState(Draining) // slow consumer: stop feeding it\n}' },
        { t: 'quote', text: 'A slow client should cost you one connection, never the whole room.' },
        { t: 'h', text: 'Heartbeats are a contract' },
        { t: 'p', text: 'Pick a ping interval, a pong deadline and stick to them on both sides. When the deadline passes, move the connection to Closed and let the client reconnect. Guessing whether a silent socket is “probably fine” is how ghost players happen.' },
        { t: 'callout', text: 'Sample post — replace this with your own writing in me-data.js.' }
      ]
    },
    {
      slug: 'rewriting-a-live-backend', title: 'Rewriting a live game backend without stopping the game', date: 'Aug 2026', tags: ['Go', 'MongoDB', 'Architecture'], kind: 'pixel',
      excerpt: 'Notes on moving a running game to a new server architecture: one route at a time, with a way back at every step.',
      blocks: [
        { t: 'p', text: 'A rewrite is easy to start and hard to land. The game keeps running, players keep buying things, and the old system keeps being the source of truth until the day it is not.' },
        { t: 'h', text: 'Move routes, not the world' },
        { t: 'p', text: 'Put a thin router in front of both systems and move one feature at a time: the shop, then missions, then the rest. Each move is small enough to reason about and small enough to roll back.' },
        { t: 'list', items: ['Shadow-read: call the new service, compare results, still return the old one', 'Flip: return the new result behind a flag', 'Clean up: delete the old path once the flag has been boring for a while'] },
        { t: 'code', lang: 'go', text: 'func (r *Router) Shop(ctx context.Context, req ShopReq) (ShopRes, error) {\n    if !r.flags.On(ctx, "shop_v2") {\n        return r.legacy.Shop(ctx, req)\n    }\n    return r.v2.Shop(ctx, req)\n}' },
        { t: 'quote', text: 'If you cannot turn it off in a minute, you have not shipped it yet.' },
        { t: 'callout', text: 'Sample post — replace this with your own writing in me-data.js.' }
      ]
    },
    {
      slug: 'reading-solidity-like-an-attacker', title: 'Reading your own Solidity like an attacker', date: 'Jul 2026', tags: ['Solidity', 'Security'], kind: 'hex',
      excerpt: 'A short checklist I run before a contract leaves my machine — because on-chain, there is no hotfix.',
      blocks: [
        { t: 'p', text: 'Contracts that hold game items or tokens get read by people who are looking for exactly one mistake. It helps to read them that way first.' },
        { t: 'h', text: 'The checklist' },
        { t: 'list', items: ['Who can call this, and what stops everyone else?', 'Does any external call happen before state is updated?', 'What happens at zero, at max, and at max + 1?', 'Is every important change visible as an event?'] },
        { t: 'code', lang: 'solidity', text: 'function withdraw(uint256 amount) external nonReentrant {\n    require(balances[msg.sender] >= amount, "balance");\n    balances[msg.sender] -= amount;      // effects first\n    (bool ok, ) = msg.sender.call{value: amount}("");\n    require(ok, "transfer");             // interaction last\n    emit Withdrawn(msg.sender, amount);\n}' },
        { t: 'quote', text: 'Checks, effects, interactions — in that order, every time.' },
        { t: 'callout', text: 'Sample post — replace this with your own writing in me-data.js.' }
      ]
    },
    {
      slug: 'four-thousand-pins', title: 'Four thousand pins, one smooth map', date: 'Jun 2026', tags: ['Frontend', 'Performance'], kind: 'pins',
      excerpt: 'The map does not need to draw every pin. It needs to draw the pins you can see, at the size you can see them.',
      blocks: [
        { t: 'p', text: 'Thousands of markers on one map is where a smooth product starts to stutter. The fix is rarely clever; it is mostly about doing less work per frame.' },
        { t: 'h', text: 'Three habits' },
        { t: 'list', items: ['Cull: only render pins inside the viewport plus a small margin', 'Cluster: merge nearby pins when zoomed out', 'Debounce: recompute on move-end, not on every pixel of a drag'] },
        { t: 'code', lang: 'ts', text: 'const visible = pins.filter((p) =>\n  p.lat <= bounds.north && p.lat >= bounds.south &&\n  p.lng <= bounds.east  && p.lng >= bounds.west\n);\nrender(cluster(visible, zoom));' },
        { t: 'callout', text: 'Sample post — replace this with your own writing in me-data.js.' }
      ]
    },
    {
      slug: 'binary-protocols-human-screens', title: 'Binary protocols, human screens', date: 'May 2026', tags: ['Protocols', 'Go'], kind: 'orbit',
      excerpt: 'Turning a stream of fixed-length frames into something an operator can read at a glance.',
      blocks: [
        { t: 'p', text: 'Machine protocols are designed to be compact, not readable. The work is in the translation layer: split the stream into frames, validate them, and turn fields into words a person can act on.' },
        { t: 'code', lang: 'go', text: 'for {\n    if _, err := io.ReadFull(r, frame[:]); err != nil {\n        return err\n    }\n    msg, err := decode(frame)\n    if err != nil {\n        metrics.BadFrame.Inc()\n        continue // never let one bad frame stop the stream\n    }\n    out <- msg\n}' },
        { t: 'quote', text: 'Validate at the edge, so everything downstream can be boring.' },
        { t: 'callout', text: 'Sample post — replace this with your own writing in me-data.js.' }
      ]
    }
  ];

  var out = parse();
  out.projects.forEach(function (p) { p.blocks = layout(p, out.projects); });
  out.posts = POSTS.map(function (p, i) {
    var words = p.blocks.reduce(function (n, b) { return n + ((b.text || '') + ' ' + (b.items || []).join(' ')).split(/\s+/).length; }, 0) + p.title.split(/\s+/).length;
    return Object.assign({}, p, { num: String(i + 1).padStart(2, '0'), read: Math.max(1, Math.round(words / 200)) + ' min', sample: true });
  });
  window.ME = out;
})();
