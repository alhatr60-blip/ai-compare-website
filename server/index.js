const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simulated AI responses (replace with real API calls when you add your keys)
async function getChatGPTResponse(query) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== 'your_openai_api_key_here') {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: query }],
                    max_tokens: 1024
                })
            });
            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            }
            return `Error: ${data.error?.message || 'Unknown error from OpenAI'}`;
        } catch (error) {
            return `Error connecting to ChatGPT: ${error.message}`;
        }
    }

    // Demo response when no API key is set
    return generateDemoResponse('ChatGPT', query);
}

async function getClaudeResponse(query) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey && apiKey !== 'your_anthropic_api_key_here') {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: query }]
                })
            });
            const data = await response.json();
            if (data.content && data.content[0]) {
                return data.content[0].text;
            }
            return `Error: ${data.error?.message || 'Unknown error from Anthropic'}`;
        } catch (error) {
            return `Error connecting to Claude: ${error.message}`;
        }
    }

    return generateDemoResponse('Claude', query);
}

async function getGeminiResponse(query) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: query }] }]
                    })
                }
            );
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                return data.candidates[0].content.parts[0].text;
            }
            return `Error: ${data.error?.message || 'Unknown error from Gemini'}`;
        } catch (error) {
            return `Error connecting to Gemini: ${error.message}`;
        }
    }

    return generateDemoResponse('Gemini', query);
}

function generateDemoResponse(model, query) {
    const q = query.toLowerCase().trim();

    // ─── Knowledge Base ───────────────────────────────────────────
    const knowledge = {
        // What is a program / programming
        'program': {
            ChatGPT: `A program is a set of instructions written in a programming language that tells a computer what to do. Think of it like a recipe — each step is an instruction the computer follows in order.\n\nPrograms can be as simple as printing "Hello, World!" to the screen, or as complex as an entire operating system like Windows or Linux.\n\nKey concepts:\n• Source Code – The human-readable instructions (e.g., Python, Java, C++).\n• Compiler/Interpreter – Translates source code into machine code the computer understands.\n• Executable – The final output that the computer can run.\n• Input/Output – Programs take input, process it, and produce output.\n\nExample in Python:\nprint("Hello, World!")\n\nThis single line is a complete program that outputs text to the screen.`,
            Claude: `A program is a precise sequence of instructions that a computer executes to perform a specific task or solve a problem.\n\nLet me break this down systematically:\n\n1. At its core, a program is written in a programming language (Python, JavaScript, C++, etc.) which provides a structured way for humans to communicate with machines.\n\n2. The program goes through a translation process — either compilation (translated all at once before running) or interpretation (translated line by line during execution).\n\n3. Programs operate on the fundamental cycle of:\n   → Input: Receiving data\n   → Processing: Performing operations on that data\n   → Output: Producing results\n\n4. Programs range in complexity from a single print statement to millions of lines of code in systems like operating systems or web browsers.\n\nIt's worth noting that every app on your phone, every website you visit, and every game you play is fundamentally a program — a set of instructions being executed by hardware.`,
            Gemini: `A **program** (also called software) is a collection of instructions that tells a computer how to perform a specific task.\n\n**How it works:**\n| Step | Description |\n|------|-------------|\n| 1. Write | Developer writes code in a programming language |\n| 2. Translate | Code is compiled or interpreted into machine language |\n| 3. Execute | Computer reads and runs the machine instructions |\n| 4. Output | Results are displayed to the user |\n\n**Types of Programs:**\n• **System Software** – Operating systems (Windows, macOS, Linux)\n• **Application Software** – Apps like Chrome, Word, Photoshop\n• **Scripts** – Small automation programs (bash scripts, Python scripts)\n• **Embedded Software** – Code running in devices like microwaves, cars\n\n**Example (JavaScript):**\nconsole.log("Hello, World!");\n\nThis is the simplest form of a program — one instruction that outputs text.`
        },

        // Quantum computing
        'quantum': {
            ChatGPT: `Quantum computing is a type of computing that uses quantum mechanical phenomena — like superposition and entanglement — to process information in fundamentally different ways than classical computers.\n\nClassical computers use bits (0 or 1). Quantum computers use qubits, which can be 0, 1, or both at the same time (superposition). This allows them to explore many solutions simultaneously.\n\nKey concepts:\n• Superposition – A qubit can exist in multiple states at once.\n• Entanglement – Two qubits can be linked so that the state of one instantly affects the other.\n• Quantum Gates – Operations that manipulate qubits, similar to logic gates in classical computing.\n\nPotential applications include drug discovery, cryptography, optimization problems, and AI training. Companies like IBM, Google, and Microsoft are leading quantum research.\n\nHowever, quantum computers are not meant to replace classical computers — they're designed to solve specific types of problems much faster.`,
            Claude: `Quantum computing represents a fundamentally different approach to computation that leverages principles of quantum mechanics.\n\nHere's how I'd explain it:\n\nClassical computers process information as bits — each is definitively 0 or 1. Quantum computers use quantum bits (qubits) that exploit two key quantum properties:\n\n1. **Superposition**: A qubit can exist in a combination of 0 and 1 simultaneously. It's not that we don't know which state it's in — it genuinely occupies both states until measured.\n\n2. **Entanglement**: When qubits become entangled, measuring one instantly determines the state of the other, regardless of distance. This creates correlations that have no classical equivalent.\n\nThese properties mean a quantum computer with n qubits can potentially explore 2^n states simultaneously, giving exponential speedup for certain problems.\n\nPractical implications:\n• Breaking current encryption (Shor's algorithm)\n• Simulating molecular interactions for drug design\n• Optimizing complex logistics and financial models\n\nImportant caveat: Quantum computers won't replace your laptop. They excel at specific problem types but are impractical for everyday tasks like email or word processing.`,
            Gemini: `**Quantum Computing** is an advanced form of computation that harnesses the principles of quantum mechanics to solve problems that are intractable for classical computers.\n\n**Classical vs. Quantum:**\n| Feature | Classical Computer | Quantum Computer |\n|---------|--------------------|-------------------|\n| Basic Unit | Bit (0 or 1) | Qubit (0, 1, or both) |\n| Processing | Sequential/Parallel | Quantum parallelism |\n| Speed | Limited by transistors | Exponentially faster for some problems |\n\n**Core Principles:**\n1. **Superposition** – Qubits can represent multiple states at once\n2. **Entanglement** – Qubits can be correlated across distances\n3. **Interference** – Quantum states can amplify correct answers and cancel wrong ones\n\n**Applications:**\n• Cryptography & cybersecurity\n• Drug discovery & molecular simulation\n• Financial modeling & optimization\n• Artificial intelligence & machine learning\n\n**Key Players:** Google (Sycamore), IBM (Quantum Network), Microsoft (Azure Quantum)\n\nGoogle achieved "quantum supremacy" in 2019, performing a calculation in 200 seconds that would take classical supercomputers ~10,000 years.`
        },

        // Machine learning
        'machine learning': {
            ChatGPT: `Machine learning (ML) is a branch of artificial intelligence where computers learn patterns from data without being explicitly programmed for every scenario.\n\nInstead of writing rules manually, you feed data to an algorithm, and it figures out the patterns on its own.\n\nThree main types:\n\n1. **Supervised Learning** – The model learns from labeled examples.\n   Example: Showing thousands of cat/dog photos with labels so it can classify new ones.\n\n2. **Unsupervised Learning** – The model finds hidden patterns in unlabeled data.\n   Example: Grouping customers by purchasing behavior.\n\n3. **Reinforcement Learning** – The model learns by trial and error, receiving rewards for good actions.\n   Example: Training an AI to play chess.\n\nCommon applications:\n• Email spam filtering\n• Netflix/Spotify recommendations\n• Voice assistants (Siri, Alexa)\n• Self-driving cars\n• Medical diagnosis\n\nPopular tools: Python, TensorFlow, PyTorch, scikit-learn`,
            Claude: `Machine learning is a subset of artificial intelligence focused on building systems that improve their performance through experience — that is, they learn from data rather than following explicitly coded rules.\n\nThe fundamental idea is elegant: instead of telling a computer exactly how to solve a problem, you show it many examples and let it discover the solution pattern itself.\n\nThe key paradigms are:\n\n**Supervised Learning** — You provide input-output pairs, and the model learns the mapping between them. This powers most practical ML applications today: image recognition, language translation, and predictive analytics.\n\n**Unsupervised Learning** — The model receives only inputs and must discover structure on its own. Useful for clustering, anomaly detection, and dimensionality reduction.\n\n**Reinforcement Learning** — An agent learns optimal behavior by interacting with an environment and receiving feedback. This is how DeepMind's AlphaGo mastered the game of Go.\n\nWhat makes ML particularly powerful today is the convergence of three factors:\n1. Massive datasets available via the internet\n2. Cheap, powerful computing (especially GPUs)\n3. Algorithmic advances (deep learning, transformers)\n\nThe current wave of generative AI (ChatGPT, image generators) is built on these ML foundations.`,
            Gemini: `**Machine Learning (ML)** is a field of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.\n\n**How Machine Learning Works:**\n1. **Collect Data** → Gather relevant training data\n2. **Prepare Data** → Clean, organize, and split into training/test sets\n3. **Choose Model** → Select an appropriate algorithm\n4. **Train Model** → Feed training data to find patterns\n5. **Evaluate** → Test accuracy on unseen data\n6. **Deploy** → Use the model in production\n\n**Types of Machine Learning:**\n| Type | Description | Example |\n|------|-------------|---------|\n| Supervised | Learns from labeled data | Spam detection |\n| Unsupervised | Finds patterns in unlabeled data | Customer segmentation |\n| Reinforcement | Learns by trial and feedback | Game-playing AI |\n| Semi-supervised | Mix of labeled and unlabeled | Medical image analysis |\n\n**Real-World Applications:**\n• 🏥 Healthcare: Disease prediction\n• 🚗 Automotive: Self-driving cars\n• 💰 Finance: Fraud detection\n• 🎵 Entertainment: Spotify/Netflix recommendations\n• 📱 Mobile: Face unlock, voice assistants\n\n**Popular Frameworks:** TensorFlow, PyTorch, scikit-learn, Keras`
        },

        // React vs Vue
        'react': {
            ChatGPT: `React and Vue are both popular JavaScript frameworks for building user interfaces, but they have different philosophies.\n\n**React (by Meta/Facebook):**\n• Uses JSX — a syntax that mixes HTML with JavaScript\n• Component-based architecture\n• Huge ecosystem (Next.js, React Native)\n• More flexibility, but more decisions to make\n• Virtual DOM for efficient updates\n• Massive community and job market\n\n**Vue (by Evan You):**\n• Uses single-file components (.vue files) with template syntax\n• Easier learning curve\n• Built-in state management (Pinia) and routing\n• More opinionated — less decision fatigue\n• Also uses Virtual DOM\n• Growing community, very popular in Asia\n\n**When to choose React:** Large teams, complex apps, need for React Native (mobile).\n**When to choose Vue:** Smaller teams, faster prototyping, gentler learning curve.\n\nBoth are excellent choices — the "best" one depends on your project needs and team experience.`,
            Claude: `This is a nuanced comparison, and the honest answer is that both are excellent tools. Let me outline the meaningful differences:\n\n**React:**\n• Developed by Meta, released in 2013\n• It's technically a library, not a full framework — you assemble your own stack\n• Uses JSX, which blends HTML into JavaScript. This feels natural to JS developers but can be jarring initially\n• State management requires choosing between Context API, Redux, Zustand, etc.\n• The ecosystem is enormous: Next.js, Remix, React Native\n• Dominates the job market\n\n**Vue:**\n• Created by Evan You (ex-Google), released in 2014\n• A progressive framework — you can adopt it incrementally\n• Uses HTML-based templates, which feel more familiar to traditional web developers\n• Ships with official solutions for routing and state management\n• Excellent documentation — arguably the best of any framework\n• Nuxt.js serves as its meta-framework (like Next.js for React)\n\n**My assessment:**\nReact gives you more control at the cost of complexity. Vue gives you more structure at the cost of some flexibility. For beginners, Vue is more approachable. For the job market, React is more in-demand. Neither choice is wrong.`,
            Gemini: `**React vs Vue — Comprehensive Comparison**\n\n| Feature | React | Vue |\n|---------|-------|-----|\n| Created by | Meta (Facebook) | Evan You |\n| Released | 2013 | 2014 |\n| Type | Library | Progressive Framework |\n| Language | JSX (JavaScript + HTML) | Template-based (HTML) |\n| Learning Curve | Moderate | Easy |\n| State Management | Redux, Zustand, Context | Pinia (official) |\n| Mobile | React Native | Capacitor / NativeScript |\n| Meta-framework | Next.js | Nuxt.js |\n| Community Size | Very Large | Large |\n| Performance | Excellent | Excellent |\n\n**Choose React if:**\n✅ Building large-scale enterprise applications\n✅ Need React Native for mobile development\n✅ Team already knows JavaScript well\n✅ Want maximum job opportunities\n\n**Choose Vue if:**\n✅ Want a gentler learning curve\n✅ Prefer convention over configuration\n✅ Building small-to-medium projects quickly\n✅ Value excellent documentation\n\n**npm Downloads (weekly):** React ~23M+ | Vue ~4.5M+\n\nBoth frameworks perform similarly in benchmarks and can build the same types of applications.`
        },

        // Python
        'python': {
            ChatGPT: `Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, it has become one of the most popular languages in the world.\n\nWhy Python is popular:\n• Easy to read — syntax resembles English\n• Versatile — used in web dev, data science, AI, automation, and more\n• Huge standard library — "batteries included"\n• Massive community and ecosystem\n\nKey features:\n• Dynamic typing — no need to declare variable types\n• Indentation-based — uses whitespace instead of braces\n• Cross-platform — runs on Windows, Mac, Linux\n• Object-oriented and functional programming support\n\nCommon uses:\n• Web development (Django, Flask)\n• Data Science (Pandas, NumPy, Matplotlib)\n• Machine Learning (TensorFlow, PyTorch)\n• Automation and scripting\n• API development\n\nExample:\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))  # Output: Hello, World!`,
            Claude: `Python is an interpreted, high-level programming language that prioritizes code readability and developer productivity. It was created by Guido van Rossum and first released in 1991.\n\nWhat distinguishes Python from other languages:\n\n1. **Readability as a design philosophy** — Python's use of significant whitespace and clean syntax means Python code often reads almost like pseudocode. This dramatically reduces the barrier to entry.\n\n2. **"Batteries included"** — The standard library is remarkably comprehensive, covering everything from file I/O to web servers to regular expressions.\n\n3. **Multi-paradigm** — You can write procedural, object-oriented, or functional code. Python doesn't force a single approach.\n\n4. **The ecosystem** — PyPI hosts over 400,000 packages. Whatever you're trying to do, there's likely a library for it.\n\nWhere Python excels:\n• Data science and analytics (it's the lingua franca of the field)\n• Machine learning and AI\n• Rapid prototyping\n• Scripting and automation\n• Backend web development\n\nWhere Python struggles:\n• Performance-critical applications (it's 10-100x slower than C)\n• Mobile development\n• Browser-side web development\n\nDespite its speed limitations, Python consistently ranks as the #1 most popular programming language (TIOBE, Stack Overflow surveys).`,
            Gemini: `**Python** is a versatile, high-level programming language emphasizing code readability and simplicity.\n\n**Quick Facts:**\n| Detail | Info |\n|--------|------|\n| Creator | Guido van Rossum |\n| First Released | 1991 |\n| Latest Version | 3.12+ |\n| Typing | Dynamic |\n| Paradigm | Multi-paradigm (OOP, Functional, Procedural) |\n\n**Why Python is #1:**\n• 📖 Readable, clean syntax\n• 📦 400,000+ packages on PyPI\n• 🤖 Dominant in AI/ML\n• 🌐 Cross-platform support\n• 👥 Massive community\n\n**Use Cases & Frameworks:**\n• **Web Development:** Django, Flask, FastAPI\n• **Data Science:** Pandas, NumPy, Matplotlib\n• **Machine Learning:** TensorFlow, PyTorch, scikit-learn\n• **Automation:** Selenium, Beautiful Soup\n• **Game Development:** Pygame\n\n**Hello World Example:**\nprint("Hello, World!")\n\n**Python vs Others (Learning Curve):**\nPython ⭐⭐⭐⭐⭐ (Easiest)\nJavaScript ⭐⭐⭐⭐\nJava ⭐⭐⭐\nC++ ⭐⭐\n\nPython is the #1 language on TIOBE Index and the most taught introductory programming language worldwide.`
        },

        // JavaScript
        'javascript': {
            ChatGPT: `JavaScript is a versatile, high-level programming language primarily used to make websites interactive. It was created by Brendan Eich in just 10 days in 1995 and has since become the most widely used programming language in the world.\n\nKey Facts:\n• Originally designed for web browsers only\n• Now runs everywhere: servers (Node.js), mobile (React Native), desktop (Electron)\n• Dynamic typing, prototype-based object orientation\n• Event-driven and asynchronous by nature\n\nWhat JavaScript does on the web:\n• Adds interactivity (button clicks, form validation)\n• Manipulates the DOM (changes page content dynamically)\n• Handles API calls (fetching data from servers)\n• Creates animations and visual effects\n\nModern JavaScript features:\n• Arrow functions: const add = (a, b) => a + b;\n• Async/Await for clean asynchronous code\n• Destructuring, template literals, modules\n• Classes and modern OOP\n\nEcosystem: React, Vue, Angular (frontend); Node.js, Express (backend); npm has 2M+ packages.\n\nJavaScript runs in every web browser — making it the only language that works natively on both client and server sides of the web.`,
            Claude: `JavaScript is the programming language of the web — and increasingly, of everything else.\n\nSome important context:\n\nJavaScript was created in 1995 by Brendan Eich at Netscape in just 10 days. Despite this rushed origin, it evolved into the world's most ubiquitous programming language. Every web browser has a JavaScript engine built in, which means every computer and smartphone can run JavaScript without installing anything.\n\nWhat makes JavaScript unique:\n\n1. **It's the only language native to web browsers.** HTML provides structure, CSS provides style, and JavaScript provides behavior. There is no alternative for client-side web programming.\n\n2. **It's event-driven and asynchronous.** JavaScript handles user interactions and network requests without blocking, using callbacks, promises, and async/await.\n\n3. **It's remarkably flexible** — supporting functional, object-oriented, and event-driven programming paradigms.\n\n4. **Node.js (2009) changed everything** — JavaScript can now run on servers, enabling full-stack JavaScript development.\n\nThe ecosystem is enormous:\n• Frontend: React, Vue, Angular, Svelte\n• Backend: Node.js, Express, Fastify\n• Mobile: React Native, Ionic\n• Desktop: Electron (VS Code is built with it)\n• npm: 2M+ packages\n\nDespite its quirks (type coercion, \"this\" binding), JavaScript's dominance is unquestionable.`,
            Gemini: `**JavaScript (JS)** is the world's most widely used programming language, essential for web development and increasingly used across all platforms.\n\n**Quick Facts:**\n| Detail | Info |\n|--------|------|\n| Creator | Brendan Eich |\n| Created | 1995 (in 10 days!) |\n| Type | Interpreted, JIT-compiled |\n| Typing | Dynamic, weakly typed |\n| Standard | ECMAScript (ES6+) |\n\n**Where JavaScript Runs:**\n• 🌐 **Browsers** – Chrome (V8), Firefox (SpiderMonkey), Safari (JavaScriptCore)\n• 🖥️ **Servers** – Node.js, Deno, Bun\n• 📱 **Mobile** – React Native, Ionic\n• 🖱️ **Desktop** – Electron (VS Code, Discord, Slack)\n\n**Core Capabilities:**\n• DOM manipulation & interactivity\n• Asynchronous programming (Promises, async/await)\n• Event-driven architecture\n• API communication (fetch, Axios)\n• Full-stack development\n\n**Popular Frameworks:**\n| Category | Options |\n|----------|---------|\n| Frontend | React, Vue, Angular, Svelte |\n| Backend | Node.js, Express, Fastify |\n| Mobile | React Native, Ionic |\n| Testing | Jest, Cypress, Playwright |\n\n**npm** hosts 2M+ packages — the largest software registry in the world.`
        },

        // AI / Artificial Intelligence
        'artificial intelligence': {
            ChatGPT: `Artificial Intelligence (AI) is the simulation of human intelligence by computer systems. It encompasses machines that can perform tasks that typically require human cognition — like understanding language, recognizing images, and making decisions.\n\nTypes of AI:\n\n1. **Narrow AI (ANI)** — Designed for specific tasks. This is all AI that exists today.\n   Examples: Siri, ChatGPT, Google Search, Tesla Autopilot\n\n2. **General AI (AGI)** — Hypothetical AI with human-level understanding across all domains. Does not exist yet.\n\n3. **Super AI (ASI)** — Theoretical AI surpassing human intelligence. Purely speculative.\n\nKey branches of AI:\n• Machine Learning — Learning from data\n• Deep Learning — Neural networks with many layers\n• Natural Language Processing (NLP) — Understanding human language\n• Computer Vision — Understanding images and video\n• Robotics — Physical AI systems\n\nCurrent state:\nAI has made enormous strides since 2020, especially in generative AI (ChatGPT, DALL-E, Midjourney). However, current AI doesn't truly "understand" — it recognizes patterns in data.`,
            Claude: `Artificial Intelligence is the field of computer science dedicated to creating systems that can perform tasks normally requiring human intelligence — perception, reasoning, learning, and decision-making.\n\nI think it's important to separate the hype from reality:\n\n**What AI actually is today:**\nAll current AI is "narrow" — it excels at specific, well-defined tasks but has no general understanding. ChatGPT can write essays but can't make a sandwich. AlphaGo can beat world champions at Go but doesn't know what a board game is.\n\n**The key subfields:**\n• **Machine Learning** — Algorithms that improve through experience\n• **Deep Learning** — Neural networks inspired by brain structure\n• **NLP** — Language understanding and generation (GPT, BERT, Claude)\n• **Computer Vision** — Image and video analysis\n• **Reinforcement Learning** — Learning through trial and reward\n\n**The current AI moment:**\nThe transformer architecture (2017) catalyzed the current AI boom. Large Language Models (LLMs) like GPT-4, Claude, and Gemini have demonstrated remarkable language capabilities, leading to widespread adoption across industries.\n\n**Important nuances:**\n• AI doesn't "think" or "understand" — it processes patterns statistically\n• AI systems reflect biases present in their training data\n• The gap between narrow AI and general AI remains vast\n• Ethical considerations around AI deployment are critical`,
            Gemini: `**Artificial Intelligence (AI)** is the science of creating intelligent computer systems capable of tasks that normally require human intelligence.\n\n**Types of AI:**\n| Type | Description | Status |\n|------|-------------|--------|\n| Narrow AI (ANI) | Task-specific intelligence | ✅ Exists today |\n| General AI (AGI) | Human-level across all domains | 🔬 In research |\n| Super AI (ASI) | Surpasses human intelligence | 🔮 Theoretical |\n\n**Key Branches:**\n• 🧠 Machine Learning — Pattern recognition from data\n• 🔗 Deep Learning — Multi-layered neural networks\n• 💬 NLP — Language understanding (GPT, BERT)\n• 👁️ Computer Vision — Image processing\n• 🤖 Robotics — Physical AI agents\n\n**AI Timeline:**\n• 1956 — Term "AI" coined at Dartmouth Conference\n• 1997 — IBM Deep Blue beats chess champion Kasparov\n• 2012 — Deep learning breakthrough (AlexNet)\n• 2017 — Transformer architecture invented\n• 2022 — ChatGPT launches generative AI era\n• 2024 — Multimodal AI becomes mainstream\n\n**Real-World Applications:**\n• Healthcare: Disease diagnosis\n• Finance: Fraud detection\n• Transportation: Self-driving cars\n• Entertainment: Content recommendation\n• Science: Protein folding (AlphaFold)`
        },

        // HTML
        'html': {
            ChatGPT: `HTML (HyperText Markup Language) is the standard language used to create and structure content on web pages. It's the backbone of every website you visit.\n\nHTML uses "tags" to define elements on a page:\n\n• <h1> to <h6> — Headings\n• <p> — Paragraphs\n• <a> — Links\n• <img> — Images\n• <div> — Container/division\n• <ul>/<ol> — Lists\n• <form> — User input forms\n\nBasic HTML structure:\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>\n\nHTML5 (the current version) introduced semantic elements like <header>, <nav>, <main>, <article>, and <footer> which make code more meaningful and accessible.\n\nHTML works alongside CSS (for styling) and JavaScript (for interactivity) — together they form the three pillars of web development.`,
            Claude: `HTML — HyperText Markup Language — is the foundational language of the web. Every web page you've ever visited is, at its core, an HTML document.\n\nLet me clarify a common misconception: HTML is not a programming language. It's a markup language — it describes the structure and content of a document, but it doesn't contain logic, loops, or variables.\n\nWhat HTML does:\n1. **Structures content** — Defines headings, paragraphs, lists, tables\n2. **Embeds media** — Images, videos, audio\n3. **Creates links** — The "HyperText" part — connecting documents\n4. **Builds forms** — Input fields, buttons, checkboxes\n5. **Provides semantics** — Tells browsers and search engines what content means\n\nHTML5 (current standard) added important capabilities:\n• <video> and <audio> elements (no more Flash)\n• <canvas> for graphics\n• Semantic elements (<article>, <section>, <nav>)\n• Local storage and offline capabilities\n• Geolocation API\n\nThe relationship:\n• HTML = Structure (skeleton)\n• CSS = Presentation (clothing)\n• JavaScript = Behavior (muscles)\n\nYou cannot build a website without HTML. It's the absolute starting point of web development.`,
            Gemini: `**HTML (HyperText Markup Language)** is the standard markup language for creating web pages and web applications.\n\n**Basic Structure:**\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>Page Title</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>\n\n**Common HTML Elements:**\n| Tag | Purpose | Example |\n|-----|---------|--------|\n| <h1>-<h6> | Headings | <h1>Title</h1> |\n| <p> | Paragraph | <p>Text</p> |\n| <a> | Hyperlink | <a href="url">Link</a> |\n| <img> | Image | <img src="photo.jpg"> |\n| <div> | Container | <div>Content</div> |\n| <form> | User input | <form>...</form> |\n\n**HTML5 Semantic Elements:**\n• <header> — Page/section header\n• <nav> — Navigation links\n• <main> — Main content\n• <article> — Self-contained content\n• <footer> — Page/section footer\n\n**The Web Trinity:**\n🏗️ HTML → Structure\n🎨 CSS → Style\n⚡ JavaScript → Interactivity\n\nHTML is the foundation — every website starts with it.`
        },

        // Coding / Haiku
        'haiku': {
            ChatGPT: `Here's a haiku about coding:\n\nSilent keys tap soft,\nLogic blooms on glowing screens,\nBugs hide in the dark.\n\n—\n\nAnd a few more:\n\nSemicolon missed,\nThe whole program falls apart,\nOne character's weight.\n\nStack overflow grows,\nRecursion without an end,\nMemory runs dry.\n\nCommit, push, deploy,\nGreen checkmarks bring quiet joy,\nCode ships to the world.`,
            Claude: `Here's a haiku about coding:\n\nWhite cursor blinking,\nThoughts become instructions here—\nMachines learn to dream.\n\n—\n\nA few more reflections:\n\nIndentation wrong.\nPython raises its concerns.\nSpaces versus tabs.\n\nThe test suite goes green.\nWeeks of doubt dissolve at once.\nShip it. Celebrate.\n\nNull pointer, line five.\nI stare. The code stares back, still.\nCoffee. Try again.`,
            Gemini: `Here's a haiku about coding:\n\nBits and bytes align,\nAlgorithms paint with light—\nWorlds born from a line.\n\n—\n\n**More coding haikus:**\n\n🐛 **The Bug:**\nIt worked yesterday.\nNothing changed, yet nothing works.\nClassic programmer.\n\n☕ **The Ritual:**\nCoffee fuels the mind,\nFingers dance on keys all night,\nDawn breaks — code compiles.\n\n🚀 **The Deploy:**\nGit push to main branch,\nCI/CD pipeline runs—\nProduction is live.\n\n🤔 **The Review:**\n"Who wrote this?" I ask.\nGit blame reveals the answer:\nIt was me. Last week.`
        },

        // CSS
        'css': {
            ChatGPT: `CSS (Cascading Style Sheets) is the language used to style and visually format HTML content. While HTML provides the structure, CSS controls how everything looks.\n\nWhat CSS controls:\n• Colors and backgrounds\n• Fonts and typography\n• Layout and spacing (margin, padding)\n• Responsive design (media queries)\n• Animations and transitions\n• Grid and Flexbox layouts\n\nExample:\nbody {\n  font-family: 'Arial', sans-serif;\n  background-color: #1a1a2e;\n  color: #eee;\n}\n\nh1 {\n  color: #667eea;\n  font-size: 2.5rem;\n}\n\nModern CSS features:\n• CSS Grid — Two-dimensional layouts\n• Flexbox — One-dimensional alignment\n• Custom Properties (CSS Variables) — Reusable values\n• Animations — @keyframes for motion\n• Media Queries — Responsive design for different screens\n\nCSS is one of the three core web technologies (HTML, CSS, JavaScript) and is essential for every web developer.`,
            Claude: `CSS (Cascading Style Sheets) is the language that controls the visual presentation of HTML documents. If HTML is the skeleton of a webpage, CSS is everything you see — colors, fonts, layout, spacing, animations.\n\nThe "cascading" part is important: styles are applied in a specific order of priority:\n1. Browser defaults\n2. External stylesheets\n3. Internal styles (<style> tag)\n4. Inline styles (style attribute)\n5. !important declarations (use sparingly)\n\nCore concepts every developer must understand:\n\n**The Box Model** — Every element is a box with content, padding, border, and margin.\n\n**Flexbox** — One-dimensional layout (rows OR columns). Perfect for navigation bars, card layouts, centering content.\n\n**CSS Grid** — Two-dimensional layout (rows AND columns). Ideal for page-level layouts.\n\n**Responsive Design** — Using media queries and relative units (%, rem, vh/vw) to adapt layouts across screen sizes.\n\n**Custom Properties** — CSS variables that make themes and design systems maintainable.\n\nCSS has evolved dramatically. Modern CSS can handle animations, calculations, container queries, and complex layouts that previously required JavaScript.`,
            Gemini: `**CSS (Cascading Style Sheets)** is the styling language of the web, responsible for the visual presentation of HTML content.\n\n**What CSS Controls:**\n• 🎨 Colors & backgrounds\n• ✍️ Typography (fonts, sizes, spacing)\n• 📐 Layout (Grid, Flexbox)\n• 📱 Responsive design\n• ✨ Animations & transitions\n• 📦 Box model (margin, padding, border)\n\n**CSS Syntax:**\nselector {\n  property: value;\n}\n\n**Modern Layout Methods:**\n| Method | Use Case |\n|--------|----------|\n| Flexbox | 1D layouts (rows/columns) |\n| CSS Grid | 2D layouts (rows + columns) |\n| Float | Legacy layout (avoid) |\n\n**Key Modern Features:**\n• CSS Custom Properties (variables)\n• Container Queries\n• :has() pseudo-class\n• Subgrid\n• @layer for cascade management\n• Native nesting\n\n**Example:**\n:root {\n  --primary: #667eea;\n}\n\n.card {\n  background: var(--primary);\n  border-radius: 16px;\n  padding: 2rem;\n  transition: transform 0.3s;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n}`
        }
    };

    // ─── Find best matching topic ─────────────────────────────────
    let bestMatch = null;
    for (const keyword of Object.keys(knowledge)) {
        if (q.includes(keyword)) {
            bestMatch = keyword;
            break;
        }
    }

    // Check additional keyword aliases
    if (!bestMatch) {
        const aliases = {
            'coding': 'program',
            'code': 'program',
            'programming': 'program',
            'software': 'program',
            'what is a program': 'program',
            'what is program': 'program',
            'qubit': 'quantum',
            'quantum computing': 'quantum',
            'ml': 'machine learning',
            'deep learning': 'machine learning',
            'neural network': 'machine learning',
            'vue': 'react',
            'angular': 'react',
            'frontend framework': 'react',
            'js': 'javascript',
            'ecmascript': 'javascript',
            'node': 'javascript',
            'ai': 'artificial intelligence',
            'chatgpt': 'artificial intelligence',
            'gpt': 'artificial intelligence',
            'llm': 'artificial intelligence',
            'web page': 'html',
            'web development': 'html',
            'webpage': 'html',
            'styling': 'css',
            'stylesheet': 'css',
            'flexbox': 'css',
            'grid layout': 'css',
            'poem': 'haiku',
            'poetry': 'haiku',
        };
        for (const [alias, topic] of Object.entries(aliases)) {
            if (q.includes(alias)) {
                bestMatch = topic;
                break;
            }
        }
    }

    if (bestMatch && knowledge[bestMatch][model]) {
        return knowledge[bestMatch][model];
    }

    // ─── Fallback: Generate a thoughtful generic response ────────
    const fallbackResponses = {
        ChatGPT: `Great question! Here's my take on "${query}":\n\n"${query}" is an interesting topic. Let me share what I know:\n\nThis touches on several key areas that are worth exploring. While I'd need more context to give you the most precise answer, here are the fundamental points:\n\n• This is a topic with both practical and theoretical dimensions\n• Understanding the basics is essential before diving into advanced concepts\n• Real-world applications of this concept are widespread\n• There are multiple perspectives and approaches to consider\n\nFor the most comprehensive and up-to-date response, I recommend connecting this application to the real ChatGPT API by adding your OpenAI API key to the server/.env file. This will give you access to GPT's full knowledge base and reasoning capabilities.`,
        Claude: `Thank you for your question about "${query}." Let me address this thoughtfully:\n\nThis is a topic that deserves careful consideration. While my knowledge in demo mode is limited to pre-built responses, I can offer some general observations:\n\nThe subject you're asking about likely involves understanding foundational concepts, examining different perspectives, and considering practical applications. These are areas where nuanced analysis can provide real value.\n\nA few things worth noting:\n• Context matters significantly when exploring this topic\n• There may be common misconceptions worth addressing\n• Practical experience complements theoretical understanding\n• The field continues to evolve, so staying current is important\n\nFor a comprehensive, tailored response with Claude's full analytical capabilities, add your Anthropic API key to the server/.env file. Claude excels at detailed, nuanced analysis of complex topics.`,
        Gemini: `**Regarding: "${query}"**\n\nThis is a great topic to explore! Here's an overview:\n\n**Key Aspects:**\n• The fundamentals of this subject are well-established\n• Multiple perspectives exist and are worth considering\n• Practical applications continue to grow\n• Staying informed about developments is valuable\n\n**Recommended Next Steps:**\n1. Research the foundational concepts\n2. Explore practical examples and use cases\n3. Consider different viewpoints and approaches\n4. Apply knowledge through hands-on practice\n\n**💡 Tip:** For a complete, detailed response powered by Google's Gemini AI, add your Gemini API key to the server/.env file. Gemini provides comprehensive, data-driven responses with up-to-date information.\n\nThis demo mode covers common topics. Connect to the real API for unlimited, accurate responses to any query.`
    };

    return fallbackResponses[model];
}

// API endpoint to compare responses
app.post('/api/compare', async (req, res) => {
    const { query } = req.body;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const [chatgpt, claude, gemini] = await Promise.all([
            getChatGPTResponse(query),
            getClaudeResponse(query),
            getGeminiResponse(query)
        ]);

        res.json({
            query,
            responses: {
                chatgpt,
                claude,
                gemini
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI responses', details: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Comparator Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/compare`);
});
