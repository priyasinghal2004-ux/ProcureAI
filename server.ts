import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";
import {
  generateStructuredChallenge,
  evaluateStartupApplications,
  detectKPIConflict,
  generateFinalPilotReport
} from "./server/aiService.js";
import { User, Challenge, StartupApplication, Pilot, KPIObservation, ProcurementRecord } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ProcureAI GovTech Server" });
  });

  // -------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------
  app.get("/api/auth/demo-users", (req, res) => {
    res.json({ users: db.getUsers() });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, role } = req.body;
    let user = db.getUserByEmail(email);
    if (!user) {
      // Find default user for role
      const users = db.getUsers();
      user = users.find(u => u.role === role) || users[0];
    }
    res.json({ user, token: `demo-token-${user.id}` });
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, organization, role, department, dpiitNumber } = req.body;
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || 'startup',
      organization,
      department,
      dpiitNumber,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    };
    db.createUser(newUser);
    res.json({ user: newUser, token: `demo-token-${newUser.id}` });
  });

  // -------------------------------------------------------------
  // CHALLENGE ROUTES
  // -------------------------------------------------------------
  app.get("/api/challenges", (req, res) => {
    const challenges = db.getChallenges();
    res.json(challenges);
  });

  app.get("/api/challenges/:id", (req, res) => {
    const challenge = db.getChallengeById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json(challenge);
  });

  app.post("/api/challenges", (req, res) => {
    const challengeData: Challenge = {
      ...req.body,
      id: `chl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: req.body.status || "published"
    };
    const created = db.createChallenge(challengeData);
    res.status(201).json(created);
  });

  app.put("/api/challenges/:id", (req, res) => {
    const updated = db.updateChallenge(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Challenge not found" });
    res.json(updated);
  });

  // -------------------------------------------------------------
  // AI CHALLENGE GENERATION
  // -------------------------------------------------------------
  app.post("/api/ai/generate-challenge", async (req, res) => {
    try {
      const { problemText } = req.body;
      if (!problemText || problemText.trim().length === 0) {
        return res.status(400).json({ error: "Problem text is required" });
      }
      const structuredChallenge = await generateStructuredChallenge(problemText);
      res.json(structuredChallenge);
    } catch (err: any) {
      console.error("Error generating challenge:", err);
      res.status(500).json({ error: err.message || "Failed to generate challenge" });
    }
  });

  // -------------------------------------------------------------
  // APPLICATION ROUTES
  // -------------------------------------------------------------
  app.get("/api/applications", (req, res) => {
    const { challengeId } = req.query;
    const apps = db.getApplications(challengeId as string);
    res.json(apps);
  });

  app.get("/api/applications/:id", (req, res) => {
    const appRecord = db.getApplicationById(req.params.id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });
    res.json(appRecord);
  });

  app.post("/api/applications", (req, res) => {
    const newApp: StartupApplication = {
      ...req.body,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "submitted"
    };
    const created = db.createApplication(newApp);
    res.status(201).json(created);
  });

  // -------------------------------------------------------------
  // AI STARTUP EVALUATION
  // -------------------------------------------------------------
  app.post("/api/ai/evaluate-applications", async (req, res) => {
    try {
      const { challengeId } = req.body;
      const challenge = db.getChallengeById(challengeId);
      if (!challenge) return res.status(404).json({ error: "Challenge not found" });

      const applications = db.getApplications(challengeId);
      if (applications.length === 0) {
        return res.status(400).json({ error: "No applications found for this challenge to evaluate" });
      }

      // Run AI evaluation across the 5 weighted criteria
      const evaluations = await evaluateStartupApplications(challenge, applications);
      db.saveEvaluations(evaluations);

      // Update challenge status
      db.updateChallenge(challengeId, { status: "under_evaluation" });

      res.json({ evaluations });
    } catch (err: any) {
      console.error("Evaluation error:", err);
      res.status(500).json({ error: err.message || "Failed to evaluate applications" });
    }
  });

  app.get("/api/evaluations/:challengeId", (req, res) => {
    const evals = db.getEvaluations(req.params.challengeId);
    res.json(evals);
  });

  // -------------------------------------------------------------
  // PILOT ROUTES
  // -------------------------------------------------------------
  app.get("/api/pilots", (req, res) => {
    const pilots = db.getPilots();
    res.json(pilots);
  });

  app.get("/api/pilots/:id", (req, res) => {
    const pilot = db.getPilotById(req.params.id);
    if (!pilot) return res.status(404).json({ error: "Pilot not found" });
    res.json(pilot);
  });

  app.post("/api/pilots", (req, res) => {
    const { challengeId, startupId, startupName, department, location, startDate, endDate, durationMonths, lockedKPIs, milestones } = req.body;
    const challenge = db.getChallengeById(challengeId);
    
    const newPilot: Pilot = {
      id: `plt-${Date.now()}`,
      challengeId,
      challengeTitle: challenge ? challenge.title : "Government Innovation Pilot",
      startupId,
      startupName,
      department: department || (challenge ? challenge.department : "Gov Dept"),
      location: location || (challenge ? challenge.location : "Designated Talukas"),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      durationMonths: durationMonths || 3,
      currentMonth: 1,
      status: "ACTIVE",
      lockedKPIs: lockedKPIs || (challenge ? challenge.kpis : []),
      milestones: milestones || [
        { title: "Equipment Installation & Baseline Setup", month: 1, description: "Deployment and initial synchronization", status: "in_progress" },
        { title: "Mid-Term Dual Observation Review", month: 2, description: "Monthly telemetry audit", status: "pending" },
        { title: "Final Performance Audit & Report", month: 3, description: "AI Final verification for procurement", status: "pending" }
      ]
    };

    const created = db.createPilot(newPilot);
    res.status(201).json(created);
  });

  app.put("/api/pilots/:id", (req, res) => {
    const updated = db.updatePilot(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Pilot not found" });
    res.json(updated);
  });

  // -------------------------------------------------------------
  // OBSERVATION & CONFLICT DETECTION ROUTES
  // -------------------------------------------------------------
  app.get("/api/observations", (req, res) => {
    const { pilotId } = req.query;
    const obs = db.getObservations(pilotId as string);
    res.json(obs);
  });

  app.post("/api/observations", (req, res) => {
    const { pilotId, kpiId, month, submittedByRole, submittedByName, value, unit, notes } = req.body;
    const newObs: KPIObservation = {
      id: `obs-${Date.now()}`,
      pilotId,
      kpiId,
      month: Number(month),
      submittedByRole,
      submittedByName,
      value: Number(value),
      unit: unit || "",
      notes: notes || "",
      submittedAt: new Date().toISOString()
    };
    const saved = db.addObservation(newObs);
    res.status(201).json(saved);
  });

  app.post("/api/ai/detect-conflicts", (req, res) => {
    const { pilotId, kpiId, month } = req.body;
    const pilot = db.getPilotById(pilotId);
    if (!pilot) return res.status(404).json({ error: "Pilot not found" });

    const kpi = pilot.lockedKPIs.find(k => k.id === kpiId);
    if (!kpi) return res.status(404).json({ error: "KPI not found" });

    const obs = db.getObservations(pilotId);
    const govObs = obs.find(o => o.kpiId === kpiId && o.month === Number(month) && o.submittedByRole === 'government');
    const startupObs = obs.find(o => o.kpiId === kpiId && o.month === Number(month) && o.submittedByRole === 'startup');

    const analysis = detectKPIConflict(kpi, govObs, startupObs);
    res.json({ analysis, govObs, startupObs });
  });

  // -------------------------------------------------------------
  // FINAL PILOT REPORT & PROCUREMENT
  // -------------------------------------------------------------
  app.post("/api/ai/final-report", async (req, res) => {
    try {
      const { pilotId } = req.body;
      const pilot = db.getPilotById(pilotId);
      if (!pilot) return res.status(404).json({ error: "Pilot not found" });

      const observations = db.getObservations(pilotId);
      const report = await generateFinalPilotReport(pilot, observations);
      
      // Save on pilot
      pilot.finalReport = report;
      pilot.status = 'COMPLETED';
      db.updatePilot(pilotId, { finalReport: report, status: 'COMPLETED' });

      res.json(report);
    } catch (err: any) {
      console.error("Final report error:", err);
      res.status(500).json({ error: err.message || "Failed to generate final report" });
    }
  });

  app.post("/api/procurement/approve", (req, res) => {
    const { pilotId, decisionNotes } = req.body;
    const pilot = db.getPilotById(pilotId);
    if (!pilot) return res.status(404).json({ error: "Pilot not found" });

    const record: ProcurementRecord = {
      id: `proc-${Date.now()}`,
      pilotId,
      challengeId: pilot.challengeId,
      startupName: pilot.startupName,
      department: pilot.department,
      procurementDate: new Date().toISOString(),
      certificateId: `MH-GOV-PROC-${Math.floor(100000 + Math.random() * 900000)}`,
      contractValue: 12500000, // 1.25 Cr expansion
      status: "PROCURED",
      scaleUpPlan: [
        {
          phase: "Phase 1",
          title: "Immediate Riparian Vulnerability Zone Deployment",
          targetCoverage: "1 District (Kolhapur) / 5 Critical High-Flood Habitations (Kurundwad, Shirol, Chikhali, Balinga, Ambewadi)",
          timeline: "Months 1 - 3",
          description: "Full commissioning of 25 ruggedized IoT stage sensors, dedicated sirens at gram panchayats, and direct integration with Collectorate Disaster Cell.",
          estimatedBudget: "₹ 35,00,000"
        },
        {
          phase: "Phase 2",
          title: "Inter-District Krishna-Panchganga Basin Expansion",
          targetCoverage: "3 Districts (Kolhapur, Sangli, Satara) / 25 Riparian Habitats & 8 Barrages",
          timeline: "Months 4 - 9",
          description: "Integration with Irrigation Dept dam release telemetry, multi-lingual automated IVR citizen phone dispatch, and flood risk prediction maps.",
          estimatedBudget: "₹ 65,00,000"
        },
        {
          phase: "Phase 3",
          title: "State-Wide Hydrological AI Platform Deployment",
          targetCoverage: "All Target High-Flood River Basins Across Maharashtra State (Panchganga, Krishna, Godavari, Tapi)",
          timeline: "Months 10 - 18",
          description: "State-level procurement integration under SDRF guidelines; unified central command dashboard at Mantralaya Mumbai.",
          estimatedBudget: "₹ 1,50,00,000"
        }
      ]
    };

    db.addProcurement(record);
    if (pilot.finalReport) {
      pilot.finalReport.decision = 'APPROVE_PROCUREMENT';
      pilot.finalReport.decisionDate = new Date().toISOString();
      pilot.finalReport.decisionNotes = decisionNotes;
    }

    res.json(record);
  });

  // -------------------------------------------------------------
  // STATS & ADMIN RESET
  // -------------------------------------------------------------
  app.get("/api/stats", (req, res) => {
    res.json(db.getStats());
  });

  app.post("/api/admin/reset", (req, res) => {
    const result = db.reset();
    res.json(result);
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE / STATIC ASSETS
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProcureAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
