
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3000;
const DB_FILE = path.resolve('db.json');

import { MOCK_MEMBERS, MOCK_CONTRIBUTIONS } from './constants';

// --- DATABASE SIMULATION ---
interface DB {
  members: any[];
  contributions: any[];
  settings: any;
}

const INITIAL_DB: DB = {
  members: MOCK_MEMBERS,
  contributions: MOCK_CONTRIBUTIONS,
  settings: {
    targetSqm: 250,
    sqmPrice: 50000,
    targetAmount: 12500000,
    manualRaisedOffset: 0,
    isSimulationMode: true,
    presentationText: "Le projet Kër Serigne Touba est une initiative communautaire...",
    socialLinks: [
      { platform: 'facebook', url: '#', enabled: true },
      { platform: 'instagram', url: '#', enabled: true },
      { platform: 'tiktok', url: '#', enabled: true },
      { platform: 'youtube', url: '#', enabled: true }
    ],
    contactInfo: {
      address: 'Touba, Sénégal',
      phone: '+221 77 000 00 00',
      email: 'contact@kst.sn'
    },
    legalPages: [
      { slug: 'mentions-legales', title: 'Mentions Légales', content: 'Contenu des mentions légales...' },
      { slug: 'politique-confidentialite', title: 'Politique de Confidentialité', content: 'Contenu de la politique...' },
      { slug: 'cgu', title: 'Conditions Générales d\'Utilisation', content: 'Contenu des CGU...' },
      { slug: 'transparence', title: 'Transparence Financière', content: 'Détails sur la gestion des fonds...' }
    ]
  }
};

async function getDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it
    await fs.writeFile(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
    return INITIAL_DB;
  }
}

async function saveDB(db: DB) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

// --- SERVER SETUP ---
async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Get Settings
  app.get('/api/settings', async (req, res) => {
    const db = await getDB();
    res.json(db.settings);
  });

  // Update Settings
  app.put('/api/settings', async (req, res) => {
    const newSettings = req.body;
    const db = await getDB();
    db.settings = { ...db.settings, ...newSettings };
    await saveDB(db);
    res.json(db.settings);
  });

  // Get Legal Page
  app.get('/api/legal-pages/:slug', async (req, res) => {
    const { slug } = req.params;
    const db = await getDB();
    const page = db.settings.legalPages?.find((p: any) => p.slug === slug);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: 'Page non trouvée' });
    }
  });

  // Public Donation
  app.post('/api/donations', async (req, res) => {
    const donation = req.body;
    const db = await getDB();
    
    const newContrib = { 
      ...donation, 
      id: `D${Date.now()}`, 
      status: 'completed', 
      date: new Date().toISOString(),
      type: 'DONATION_LIBRE'
    };
    
    db.contributions.push(newContrib);
    await saveDB(db);

    res.json(newContrib);
  });

  // Auth Login
  app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;
    const db = await getDB();
    
    // Admin backdoor
    if (identifier === 'admin' && password === 'admin123') {
      const admin = db.members.find(m => m.role === 'ADMIN');
      return res.json({ user: admin, token: 'admin-token' });
    }

    // Member login (phone only for demo)
    const member = db.members.find(m => m.phone === identifier);
    if (member) {
      return res.json({ user: member, token: 'member-token' });
    }

    res.status(401).json({ error: 'Identifiants incorrects' });
  });

  // Auth Register
  app.post('/api/auth/register', async (req, res) => {
    const newMember = req.body;
    const db = await getDB();
    
    // Check if exists
    if (db.members.find(m => m.phone === newMember.phone)) {
      return res.status(400).json({ error: 'Ce numéro est déjà inscrit' });
    }

    const memberWithId = { ...newMember, id: `M${Date.now()}`, role: 'MEMBER', status: 'ACTIVE', joinDate: new Date().toISOString() };
    db.members.push(memberWithId);
    await saveDB(db);

    res.json({ user: memberWithId, token: 'new-member-token' });
  });

  // Get Members
  app.get('/api/members', async (req, res) => {
    const db = await getDB();
    res.json(db.members);
  });

  // Get Contributions
  app.get('/api/contributions', async (req, res) => {
    const db = await getDB();
    res.json(db.contributions);
  });

  // Add Contribution
  app.post('/api/contributions', async (req, res) => {
    const contribution = req.body;
    const db = await getDB();
    
    const newContrib = { ...contribution, id: `C${Date.now()}`, status: 'completed', date: new Date().toISOString() };
    db.contributions.push(newContrib);
    await saveDB(db);

    res.json(newContrib);
  });

  // --- REDIS CACHE SIMULATION ---
  const cache = new Map<string, { data: any, expiry: number }>();
  const CACHE_TTL = 5000; // 5 seconds

  // Analytics (Simulating Python Microservice + Redis Cache)
  app.get('/api/analytics/stats', async (req, res) => {
    const cacheKey = 'analytics_stats';
    const now = Date.now();
    
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (now < cached.expiry) {
        // console.log('Serving from Cache (Redis Simulation)');
        return res.json(cached.data);
      }
    }

    const db = await getDB();
    const totalRaised = db.contributions.reduce((acc: number, c: any) => acc + c.amount, 0);
    const totalSqm = db.members.reduce((acc: number, m: any) => acc + m.sqmCommitted, 0);
    
    // Simulating complex calculation delay (Python Service)
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = {
      totalRaised,
      totalSqm,
      completionRate: (totalSqm / db.settings.targetSqm) * 100,
      activeMembers: db.members.filter(m => m.status === 'ACTIVE').length
    };

    cache.set(cacheKey, { data, expiry: now + CACHE_TTL });
    res.json(data);
  });

  // --- WEBSOCKET SERVER & DONATION SIMULATOR ---
  // Create HTTP server first to attach WS
  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
  });

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Donation Simulator Logic
  const simulateDonation = async () => {
    const db = await getDB();
    const randomAmount = Math.floor(Math.random() * 50000) + 5000; // 5k - 55k
    const randomSqm = Math.floor(Math.random() * 5) + 1; // 1 - 5 sqm
    
    const newMember = {
      id: `SIM-${Date.now()}`,
      fullName: `Bâtisseur Anonyme ${Math.floor(Math.random() * 1000)}`,
      phone: `77${Math.floor(Math.random() * 10000000)}`,
      sqmCommitted: randomSqm,
      joinDate: new Date().toISOString(),
      role: 'MEMBER',
      status: 'ACTIVE',
      address: 'Simulation'
    };

    const newContrib = {
      id: `SIM-PAY-${Date.now()}`,
      memberId: newMember.id,
      amount: randomAmount,
      date: new Date().toISOString(),
      method: 'WAVE',
      status: 'completed',
      monthFor: 'Don Spontané'
    };

    // Update DB
    db.members.push(newMember);
    db.contributions.push(newContrib);
    await saveDB(db);

    // Broadcast
    broadcast({
      type: 'NEW_DONATION',
      payload: {
        member: newMember,
        contribution: newContrib
      }
    });
  };

  // Run simulation every 30 seconds
  setInterval(simulateDonation, 30000);

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: httpServer // Attach HMR to the same server to avoid port conflicts
        }
      },
      appType: 'spa', 
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production (if built)
    app.use(express.static(path.resolve('dist')));
  }
}

startServer();
