import { ProjectOSData } from './types';

export const getInitialData = (): ProjectOSData => {
  return {
    projects: [
      {
        id: 'proj-1',
        name: 'SignSense',
        description: 'Real-time AI-powered American Sign Language (ASL) detection using computer vision, wrapped in a lightweight Chrome Extension for video call integration.',
        category: 'AI/ML',
        status: 'Building',
        priority: 'Critical',
        progress: 60, // calculated as completed milestones / total milestones
        startDate: '2026-05-10',
        deadline: '2026-07-15',
        tags: ['Computer Vision', 'TensorFlow.js', 'Chrome API', 'React'],
        milestones: [
          { id: 'ms-1-1', name: 'Dataset Collection & Augmentation', completed: true },
          { id: 'ms-1-2', name: 'Model Training (MobileNetV2 Backbone)', completed: true },
          { id: 'ms-1-3', name: 'Chrome Extension Pipeline & Injector', completed: false },
          { id: 'ms-1-4', name: 'WebRTC Web Cam Interface', completed: true },
          { id: 'ms-1-5', name: 'Production Deployment & Launch', completed: false }
        ],
        tasks: [
          { id: 'task-1-1', projectId: 'proj-1', title: 'Optimize model weights for browser (Sharding)', description: 'Convert TF model to format optimized for WebGL backends to reduce extension memory footprint.', dueDate: '2026-06-21', status: 'In Progress', priority: 'High' },
          { id: 'task-1-2', projectId: 'proj-1', title: 'Fix Zoom overlay positioning issue', description: 'Ensure output captions are correctly centered on low-bandwidth Zoom rooms.', dueDate: '2026-06-25', status: 'Todo', priority: 'Medium' },
          { id: 'task-1-3', projectId: 'proj-1', title: 'Push initial GitHub repo updates', description: 'Clean up README, add developer guidelines and commit model training notebook.', dueDate: '2026-06-18', status: 'Done', priority: 'Low' },
          { id: 'task-1-4', projectId: 'proj-1', title: 'Train model on advanced gestures', description: 'Collect 500 more samples for double-hand signals.', dueDate: '2026-06-19', status: 'In Progress', priority: 'Critical' },
          { id: 'task-1-5', projectId: 'proj-1', title: 'Secure local video stream stream capture', description: 'Implement browser canvas grabbing logic safely protecting keyframes.', dueDate: '2026-06-15', status: 'Done', priority: 'High' }
        ]
      },
      {
        id: 'proj-2',
        name: 'Chatpal',
        description: 'A privacy-first, fully local context-aware chatbot helper executing entirely on-device using WebGPU with Llama-3-8B-Instruct quantized models.',
        category: 'AI/ML',
        status: 'Testing',
        priority: 'High',
        progress: 80,
        startDate: '2026-04-20',
        deadline: '2026-06-28',
        tags: ['WebGPU', 'ONNX Runtime', 'WebLLM', 'Local Storage'],
        milestones: [
          { id: 'ms-2-1', name: 'Model compilation using ONNX-Web', completed: true },
          { id: 'ms-2-2', name: 'Structured vector embedding storage (indexedDB)', completed: true },
          { id: 'ms-2-3', name: 'Fluid conversational streaming interface', completed: true },
          { id: 'ms-2-4', name: 'Custom context ingestion logic (TXT & PDFs)', completed: true },
          { id: 'ms-2-5', name: 'Performance stress-tests & VRAM balancing', completed: false }
        ],
        tasks: [
          { id: 'task-2-1', projectId: 'proj-2', title: 'Benchmark speed on Apple M-series chips', description: 'Gather tokens/sec metrics to display live performance analytics.', dueDate: '2026-06-20', status: 'In Progress', priority: 'Medium' },
          { id: 'task-2-2', projectId: 'proj-2', title: 'Fix context window crash when importing 100+ pages', description: 'Implement token sliding window / simple RAG summary truncation.', dueDate: '2026-06-23', status: 'Todo', priority: 'High' },
          { id: 'task-2-3', projectId: 'proj-2', title: 'UI polish for message hover states', description: 'Add copy code buttons and markdown table formatting styling wrapper.', dueDate: '2026-06-17', status: 'Done', priority: 'Low' },
          { id: 'task-2-4', projectId: 'proj-2', title: 'Add local export to PDF/TXT', description: 'Enable users to print chat transcript histories local only.', dueDate: '2026-06-16', status: 'Done', priority: 'Low' }
        ]
      },
      {
        id: 'proj-3',
        name: 'Portfolio Website',
        description: 'Ultra-fast personal landing page and interactive project playground designed as a modern OS with three-dimensional canvas assets.',
        category: 'Web Development',
        status: 'Completed',
        priority: 'Medium',
        progress: 100,
        startDate: '2026-03-01',
        deadline: '2026-05-01',
        tags: ['Three.js', 'Vite', 'Tailwind', 'Framer Motion'],
        milestones: [
          { id: 'ms-3-1', name: 'Design dark cyberpunk wireframes', completed: true },
          { id: 'ms-3-2', name: 'Implement draggable windows and desktop interface', completed: true },
          { id: 'ms-3-3', name: 'Assemble local work showcase items', completed: true },
          { id: 'ms-3-4', name: 'Incorporate 3D model loaders with orbit controls', completed: true }
        ],
        tasks: [
          { id: 'task-3-1', projectId: 'proj-3', title: 'Purchase custom domain and configure DNS', description: 'Transfer domain registration and point A records to edge-routing host.', dueDate: '2026-05-01', status: 'Done', priority: 'Medium' },
          { id: 'task-3-2', projectId: 'proj-3', title: 'Slight desktop responsive optimization', description: 'Fix coordinate drift of 3D objects on mobile aspect ratios.', dueDate: '2026-04-28', status: 'Done', priority: 'High' }
        ]
      },
      {
        id: 'proj-4',
        name: 'Local Web Agency',
        description: 'A freelance web development boutique focused on developing bespoke, fast-loading, highly optimized websites for micro-businesses, restaurants, and medical centers.',
        category: 'Business',
        status: 'Building',
        priority: 'High',
        progress: 40,
        startDate: '2026-05-25',
        deadline: '2026-09-01',
        tags: ['Client Acquisition', 'Figma', 'SEO Optimization', 'React Router'],
        milestones: [
          { id: 'ms-4-1', name: 'Brand guidelines & Landing page build', completed: true },
          { id: 'ms-4-2', name: 'Standard pricing tier and proposal template design', completed: true },
          { id: 'ms-4-3', name: 'First paying client acquisition', completed: false },
          { id: 'ms-4-4', name: 'Cold outreach system & LinkedIn pipeline automation', completed: false },
          { id: 'ms-4-5', name: 'Build template warehouse (3 standard landing pages)', completed: false }
        ],
        tasks: [
          { id: 'task-4-1', projectId: 'proj-4', title: 'Cold-message 15 local dentist offices', description: 'Personalized loom videos addressing their mobile score issues.', dueDate: '2026-06-22', status: 'Todo', priority: 'High' },
          { id: 'task-4-2', projectId: 'proj-4', title: 'Prepare proposal for Downtown Cafe', description: 'Assemble Figma mockups showcasing responsive online menu.', dueDate: '2026-06-20', status: 'In Progress', priority: 'Medium' },
          { id: 'task-4-3', projectId: 'proj-4', title: 'Design business card and QR redirect stickers', description: 'Draft print-ready materials with high-density vector symbols.', dueDate: '2026-06-15', status: 'Done', priority: 'Low' }
        ]
      },
      {
        id: 'proj-5',
        name: 'AI Automation Toolkit',
        description: 'An internal suite of micro-agents designed for small businesses to automate standard pipeline task matching, email auto-responders, and vector document categorization.',
        category: 'AI/ML',
        status: 'Planning',
        priority: 'Medium',
        progress: 20,
        startDate: '2026-06-01',
        deadline: '2026-08-30',
        tags: ['FastAPI', 'LangChain', 'Gmail API', 'Slack Webhooks'],
        milestones: [
          { id: 'ms-5-1', name: 'Draft functional workflow engine architecture', completed: true },
          { id: 'ms-5-2', name: 'OAuth security credentials proxy config', completed: false },
          { id: 'ms-5-3', name: 'Integrate dynamic agent scheduling triggers', completed: false },
          { id: 'ms-5-4', name: 'Alpha testing phase with local sandbox files', completed: false }
        ],
        tasks: [
          { id: 'task-5-1', projectId: 'proj-5', title: 'Draft schema for configurable automation pipelines', description: 'Identify optimal JSON notation mapping graph triggers to agent tasks.', dueDate: '2026-06-24', status: 'Todo', priority: 'High' },
          { id: 'task-5-2', projectId: 'proj-5', title: 'Setup local server env with secure secrets loading', description: 'Configure basic environment reading scripts with fallbacks.', dueDate: '2026-06-15', status: 'Done', priority: 'Medium' }
        ]
      }
    ],
    goals: [
      {
        id: 'goal-1',
        title: 'Maintain 3.9 Semester GPA',
        category: 'Academic',
        targetValue: 4.0,
        currentValue: 3.92,
        unit: 'GPA',
        deadline: '2026-07-20',
        notes: 'Final exam papers left: Deep Learning Theory, Ethics in AI, and Distributed Systems.'
      },
      {
        id: 'goal-2',
        title: 'Complete 3 Advanced Coursera Specializations',
        category: 'Academic',
        targetValue: 3,
        currentValue: 2,
        unit: 'Certificates',
        deadline: '2026-08-15',
        notes: 'Currently 75% through Hugging Face NLP course.'
      },
      {
        id: 'goal-3',
        title: 'Acquire First $3k Freelance Client',
        category: 'Career',
        targetValue: 3000,
        currentValue: 1800,
        unit: 'USD',
        deadline: '2026-07-30',
        notes: 'Close custom invoice draft sent to Midtown Real Estate agent.'
      },
      {
        id: 'goal-4',
        title: 'Build 10 Websites Portfolio',
        category: 'Career',
        targetValue: 10,
        currentValue: 6,
        unit: 'Sites',
        deadline: '2026-12-31',
        notes: 'Keep targeting high-end micro brands wanting elegant custom framer layouts.'
      },
      {
        id: 'goal-5',
        title: 'Run a 10k under 50 minutes',
        category: 'Personal',
        targetValue: 50,
        currentValue: 53.4,
        unit: 'Minutes',
        deadline: '2026-09-01',
        notes: 'Cardio training thrice weekly. Track heart-rate zones.'
      },
      {
        id: 'goal-6',
        title: 'Read 24 books this year',
        category: 'Personal',
        targetValue: 24,
        currentValue: 11,
        unit: 'Books',
        deadline: '2026-12-31',
        notes: 'Currently reading: "Designing Data-Intensive Applications".'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        category: 'Python',
        progress: 85,
        hoursStudied: 140,
        notes: 'Highly proficient. Advanced OOP concepts, data pipelines, asyncio scripting, and writing customizable decorators.',
        resources: ['Fluent Python (Book)', 'PyCon 2024 Talks', 'Core python dev guides']
      },
      {
        id: 'skill-2',
        category: 'Machine Learning',
        progress: 80,
        hoursStudied: 185,
        notes: 'Thorough understanding of regressions, classification trees, custom loss functions, and dataset gradient tuning calculations.',
        resources: ['Hands-On Machine Learning (Geron Book)', 'Andrew Ng Stanford lectures']
      },
      {
        id: 'skill-3',
        category: 'Deep Learning',
        progress: 65,
        hoursStudied: 120,
        notes: 'Building neural network models with PyTorch, transformers attention mechanisms, and custom layer backward propagation tweaks.',
        resources: ['Fast.ai Neural Networks Program', 'Karpathy YouTube Lectures', 'Attention is All You Need (Paper)']
      },
      {
        id: 'skill-4',
        category: 'DSA',
        progress: 75,
        hoursStudied: 95,
        notes: 'Gid-problems solving. Proficient in dynamic programming, complex tree traversals, hashing algorithms, and matrix pathfinding.',
        resources: ['NeetCode 150', 'Algorithm Design Manual', 'LeetCode exercises']
      },
      {
        id: 'skill-5',
        category: 'React',
        progress: 90,
        hoursStudied: 210,
        notes: 'Extremely proficient in React 18 & 19, compound pattern design, custom server actions state caching, and fine-tuning rendering trees.',
        resources: ['React documentation beta', 'Dan Abramov interactive blog', 'Frontend Masters courses']
      },
      {
        id: 'skill-6',
        category: 'Next.js',
        progress: 70,
        hoursStudied: 80,
        notes: 'Familiar with App Router, server layouts, Suspense streams caching headers, and localized middleware routing configs.',
        resources: ['Next.js documentation', 'Vercel template warehouses', 'Lee Robinson design tutorials']
      },
      {
        id: 'skill-7',
        category: 'AI Engineering',
        progress: 60,
        hoursStudied: 75,
        notes: 'Knowledge of dynamic tool-calling agent pipelines, multi-layer RAG evaluation vectors, prompt chaining configurations.',
        resources: ['LangChain Cookbooks', 'Mendable AI evaluations', 'Anthropic prompt optimization guides']
      }
    ],
    revenue: [
      { id: 'rev-1', clientName: 'Oakwood Bistro', projectName: 'SEO Website Redesign', amount: 1200, status: 'Completed', date: '2026-05-15' },
      { id: 'rev-2', clientName: 'Midtown Realty', projectName: 'Portfolio Landing Agency', amount: 1800, status: 'Paid', date: '2026-06-05' },
      { id: 'rev-3', clientName: 'Dr. Evans Ortho', projectName: 'Booking Suite Webapp', amount: 3500, status: 'Negotiating', date: '2026-06-12' },
      { id: 'rev-4', clientName: 'Innovate AI Corp', projectName: 'Llama integration training', amount: 2500, status: 'Proposal Sent', date: '2026-06-18' },
      { id: 'rev-5', clientName: 'Greenery Plants', projectName: 'Local Shop E-Commerce', amount: 800, status: 'Completed', date: '2026-04-10' }
    ],
    dailyLogs: [
      { id: '2026-06-01', completed: 'Completed tensorflow model conversion to web-ready format. Setup initial React code files.', challenges: 'WebGL canvas grabbing buffers was occasionally crashing the browser tab.', wins: 'Loaded quantized mobileNet weights in under 1 second.', lessons: 'Garbage collect offline tensors properly in cleanup callback.', rating: 4, dateString: 'Mon, Jun 1, 2026' },
      { id: '2026-06-02', completed: 'Drafted pipeline structures for local vector embeddings indexedDB schema.', challenges: 'IndexedDB transaction locking blocks the main event thread.', wins: 'Established web worker to manage storage asynchronously.', lessons: 'Run complex DB tasks inside secondary thread scripts.', rating: 5, dateString: 'Tue, Jun 2, 2026' },
      { id: '2026-06-03', completed: 'Refined Three.js interactive load state coordinates on primary portfolio page.', challenges: 'Flickering during HMR changes caused orbit controls to freeze.', wins: 'Corrected coordinate offset with client viewport size calculations.', lessons: 'Always throttle scroll handler callbacks.', rating: 3, dateString: 'Wed, Jun 3, 2026' },
      { id: '2026-06-04', completed: 'Finished cold outreach script template. Researched 10 local businesses in the county.', challenges: 'Difficulty identifying direct emails or mobile numbers for decision makers.', wins: 'Identified direct LinkedIn links for restaurant managers.', lessons: 'Warm introductions are 10x better than standard cold mail blasts.', rating: 4, dateString: 'Thu, Jun 4, 2026' },
      { id: '2026-06-05', completed: 'Received payment from Midtown Realty project! Deployed their new custom landing page.', challenges: 'Configured SSL redirection took 3 hours to propagate fully.', wins: 'First major payment of the quarter cleared in bank!', lessons: 'Start DNS configuration 24 hours prior to final client handover.', rating: 5, dateString: 'Fri, Jun 5, 2026' },
      { id: '2026-06-08', completed: 'Solved LeetCode daily dynamic programming question. Completed 3 course modules on Neural Networks.', challenges: 'Struggled to visualize backpropagation derivatives inside LSTM gates.', wins: 'Drafted complete mathematical derivative diagram on iPad sketches.', lessons: 'Write out multi-variable matrix shapes before doing derivation.', rating: 4, dateString: 'Mon, Jun 8, 2026' },
      { id: '2026-06-09', completed: 'Implemented local streaming message logic with quantized WebLLM chat framework.', challenges: 'VRAM exhaustion triggers webgpu device lost interrupts.', wins: 'Gracefully fell back to low accuracy weights and updated instructions UI.', lessons: 'Monitor user WebGPU status before loading rich canvas models.', rating: 5, dateString: 'Tue, Jun 9, 2026' },
      { id: '2026-06-10', completed: 'Trained model on third gestural dataset. Refactored navigation bar on Chrome Extension.', challenges: 'Model training over-fit to hand gestures captured on darker backgrounds.', wins: 'Augmented dataset with random brightness adjustments.', lessons: 'Background variation is key to robust gesture models.', rating: 4, dateString: 'Wed, Jun 10, 2026' },
      { id: '2026-06-11', completed: 'Studied Transformers architecture. Implemented simple dot-product attention in PyTorch.', challenges: 'Understanding multi-head dimension splitting and concatenation.', wins: 'Successfully wrote standard self-attention module that passes dummy tests.', lessons: 'Reshaping tensors can be heavily counter-intuitive; write down shapes.', rating: 4, dateString: 'Thu, Jun 11, 2026' },
      { id: '2026-06-12', completed: 'Met with Dr. Evans team. Presented mockup for web-based booking suite.', challenges: 'They wanted customizable SMS alert features which adds scope creep.', wins: 'Managed to compromise on email alerts first for MVP release.', lessons: 'Clearly define functional MVP line items in initial proposal briefs.', rating: 5, dateString: 'Fri, Jun 12, 2026' },
      { id: '2026-06-15', completed: 'Drafted schema for automation pipeline graphs. Cleaned up repo templates.', challenges: 'Circular pipeline graphs would trigger infinite loops.', wins: 'Wrote cycle-detection DFS check before activating graphs.', lessons: 'Always treat graphs with skepticism; validate user inputs.', rating: 4, dateString: 'Mon, Jun 15, 2026' },
      { id: '2026-06-16', completed: 'Added local file export to Chatpal. Created PDF parser helper script.', challenges: 'Parsing multi-column pdf layouts is highly inconsistent.', wins: 'Fallback to raw text stream with neat whitespace groupings.', lessons: 'Raw text scanners remain robust when visual hierarchy is obscure.', rating: 3, dateString: 'Tue, Jun 16, 2026' },
      { id: '2026-06-17', completed: 'UI polish for Chatpal messages. Fixed bubble shadows and styling wrappers.', challenges: 'Framer motion layout layout animation stutter on standard Chrome.', wins: 'Fixed stutter by moving to hardware accelerated scale options.', lessons: 'Prefer simple transform changes inside heavy scroll panels.', rating: 4, dateString: 'Wed, Jun 17, 2026' },
      { id: '2026-06-18', completed: 'Submitted invoice proposal for Llama Integration Training for Innovate AI.', challenges: 'They require customized enterprise compliance questionnaires filled out.', wins: 'Sent forms ahead of deadline hoping to clear security board.', lessons: 'Compliance forms take time; build interactive standard decks.', rating: 4, dateString: 'Thu, Jun 18, 2026' },
      { id: '2026-06-19', completed: 'Trained SignSense model on double-handed signals. Fixed Chrome Extension overlays.', challenges: 'Extension layout conflicts with Google Meet sidebar custom injections.', wins: 'Updated DOM injector target classes to prevent visual interference.', lessons: 'Use strict scoped shadow-dom blocks when injecting files into external platforms.', rating: 5, dateString: 'Fri, Jun 19, 2026' }
    ],
    weeklyReviews: [
      {
        id: '2026-W22',
        weekLabel: 'Week 22 (Jun 1 - Jun 7)',
        completedThisWeek: 'Redesigned Midtown Realty landing page, completed TensorFlow model porting, set up local database schemas.',
        blockedTasks: 'Cold calling was blocked due to lack of verified dentist lead lists.',
        biggestWins: 'Midtown Realty page was hand-coded and loaded under 250ms, earning client appreciation.',
        mistakesMade: 'Wasted an afternoon on custom WebGL render loops before finding a lightweight library.',
        focusNextWeek: 'Assemble professional lead database. Study transformers model inputs.',
        dateCreated: '2026-06-07'
      },
      {
        id: '2026-W23',
        weekLabel: 'Week 23 (Jun 8 - Jun 14)',
        completedThisWeek: 'Coded local vector streaming with Llama-3 WebGPU. Met with Dr. Evans and agreed on scope limits. Polished UI message bubbles.',
        blockedTasks: 'PyTorch model training was slow because local GPU cuda drivers needed updating.',
        biggestWins: 'Llama model works 100% offline in browser at 14 tokens/second.',
        mistakesMade: 'Over-committed potential delivery times to Dr. Evans before checking SMS API complexity.',
        focusNextWeek: 'Draft core automation architecture. Secure Innovate AI proposal signatures.',
        dateCreated: '2026-06-14'
      }
    ],
    settings: {
      userName: 'Alex Rivers',
      avatarUrl: '',
      role: 'AI Engineer & Student Founder',
      theme: 'dark',
      notificationsEnabled: true,
      mainFocusProjectId: 'proj-1', // SignSense
      todayFocusTaskId1: 'task-1-4', // Train model on advanced gestures
      todayFocusTaskId2: 'task-1-1', // Optimize model weights
      todayFocusTaskId3: 'task-1-2', // Fix Zoom overlay layout
      todayLearningGoal: 'Deep Learning — Attention Mechanisms'
    }
  };
};
