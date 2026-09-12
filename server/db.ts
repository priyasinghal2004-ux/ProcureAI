import { User, Challenge, StartupApplication, Pilot, KPIObservation, Evaluation, ProcurementRecord } from "../src/types.js";

export interface DatabaseState {
  users: User[];
  challenges: Challenge[];
  applications: StartupApplication[];
  evaluations: Evaluation[];
  pilots: Pilot[];
  observations: KPIObservation[];
  procurements: ProcurementRecord[];
}

function getInitialState(): DatabaseState {
  const users: User[] = [
    {
      id: "usr-gov-1",
      name: "Dr. Rajesh Sharma, IAS",
      email: "gov@maharashtra.gov.in",
      role: "government",
      organization: "Maharashtra State Disaster Management Authority",
      department: "Dept of Relief & Rehabilitation",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "usr-startup-1",
      name: "Priya Nair",
      email: "startup@aquasense.io",
      role: "startup",
      organization: "AquaSense Technologies Pvt Ltd",
      dpiitNumber: "DPIIT482910",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "usr-startup-2",
      name: "Vikram Mehta",
      email: "vikram@floodshield.in",
      role: "startup",
      organization: "FloodShield Solutions",
      dpiitNumber: "DPIIT692114",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "usr-admin-1",
      name: "Sanjay Kulkarni",
      email: "admin@procureai.gov.in",
      role: "admin",
      organization: "State Innovation & Public Procurement Mission",
      department: "Central Oversight Cell",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    }
  ];

  const challenges: Challenge[] = [
    {
      id: "chl-kolhapur-flood",
      title: "Real-Time AI & IoT Early Flood Warning System for Panchganga & Krishna Basins",
      description: "Severe recurrent monsoon flooding in Kolhapur and Sangli districts causes massive displacement and economic disruption. The state seeks a high-reliability, edge-sensor integrated river stage telemetry and hydrological prediction platform capable of delivering verified early warnings to disaster authorities and vulnerable habitations well ahead of peak water levels.",
      sector: "Disaster Management & Water Resources",
      location: "Kolhapur and Sangli Districts, Maharashtra",
      requirements: [
        "Solar-powered IoT ultrasonic river stage sensors with 4G/satellite dual-link redundancy",
        "Predictive AI hydrological modeling capable of 6+ hours discharge forecast",
        "Automated integration with district emergency operations center and local sirens",
        "Citizen mobile notification portal with localized Marathi and Hindi voice alerts",
        "Continuous IP68 hardware survivability in severe monsoon conditions"
      ],
      budgetMin: 2000000,
      budgetMax: 4500000,
      currency: "INR",
      department: "Maharashtra State Disaster Management Authority",
      departmentEmail: "gov@maharashtra.gov.in",
      status: "pilot_awarded",
      createdAt: "2026-08-10T10:00:00Z",
      applicationDeadline: "2026-09-30T23:59:59Z",
      pilotDurationMonths: 3,
      kpis: [
        {
          id: "kpi-flood-1",
          title: "Early Warning Lead Time",
          description: "Advance warning lead time provided to district authorities before river reaches danger level",
          unit: "hours",
          target: 3.5,
          baseline: 0.5,
          baselineQuestion: "What is current manual observation warning advance window?",
          direction: "higher",
          weight: 40
        },
        {
          id: "kpi-flood-2",
          title: "Telemetry & Sensor Uptime",
          description: "Continuous operational uptime of sensor nodes during active monsoon precipitation",
          unit: "%",
          target: 99.0,
          baseline: 78.0,
          baselineQuestion: "What is historical availability of manual river gauges?",
          direction: "higher",
          weight: 20
        },
        {
          id: "kpi-flood-3",
          title: "False Alarm Rate",
          description: "Percentage of triggered flood alerts that fail to materialize as critical surges",
          unit: "%",
          target: 4.0,
          baseline: 32.0,
          baselineQuestion: "What is the historical manual alert error rate?",
          direction: "lower",
          weight: 20
        },
        {
          id: "kpi-flood-4",
          title: "Vulnerable Village Coverage",
          description: "Number of high-risk riparian habitation clusters receiving direct verified telemetry",
          unit: "villages",
          target: 12,
          baseline: 2,
          baselineQuestion: "How many villages currently have automated water sensors?",
          direction: "higher",
          weight: 20
        }
      ]
    },
    {
      id: "chl-pune-waste",
      title: "Smart Municipal Solid Waste Segregation & Dynamic Fleet Route Optimization",
      description: "Pune Municipal Corporation seeks an automated computer vision-assisted segregation validation and telemetry network across secondary transfer points, coupled with dynamic collection truck dispatching to eliminate open dump overflowing.",
      sector: "Urban Sanitation & Smart Cities",
      location: "Pune Municipal Corporation, Maharashtra",
      requirements: [
        "AI computer vision cameras for automatic wet/dry contamination identification",
        "GPS and bin fill-level telemetry on 120 sanitation compactor trucks",
        "Dynamic route generation reducing dead kilometers and fuel consumption",
        "Ward inspector mobile app with automated SLA tracking"
      ],
      budgetMin: 1800000,
      budgetMax: 3800000,
      currency: "INR",
      department: "Pune Municipal Corporation - Solid Waste Dept",
      departmentEmail: "sanitation@punecorporation.in",
      status: "published",
      createdAt: "2026-08-22T08:30:00Z",
      applicationDeadline: "2026-10-15T23:59:59Z",
      pilotDurationMonths: 4,
      kpis: [
        {
          id: "kpi-waste-1",
          title: "Source Segregation Compliance",
          description: "Proportion of collected waste loads meeting wet/dry purity standards",
          unit: "%",
          target: 85,
          baseline: 38,
          baselineQuestion: "What is current ward segregation compliance level?",
          direction: "higher",
          weight: 35
        },
        {
          id: "kpi-waste-2",
          title: "Fleet Fuel & Turnaround Efficiency",
          description: "Reduction in collection vehicle trip transit duration and fuel burn",
          unit: "%",
          target: 25,
          baseline: 0,
          baselineQuestion: "What is baseline route fuel expenditure per ton?",
          direction: "higher",
          weight: 25
        },
        {
          id: "kpi-waste-3",
          title: "Public Bin Overflow Incidents",
          description: "Average recorded citizen complaints or automated sensor overflow alerts per ward/week",
          unit: "incidents/wk",
          target: 3,
          baseline: 28,
          baselineQuestion: "Current weekly overflow complaints in target ward?",
          direction: "lower",
          weight: 20
        },
        {
          id: "kpi-waste-4",
          title: "Digitally Audited Wards",
          description: "Number of contiguous municipal wards under end-to-end telemetry",
          unit: "wards",
          target: 6,
          baseline: 1,
          baselineQuestion: "Number of wards currently equipped with automated tracking?",
          direction: "higher",
          weight: 20
        }
      ]
    },
    {
      id: "chl-nashik-agro",
      title: "Solar-Powered Micro Cold Storage Grid with Decentralized Farmer Market Telemetry",
      description: "Post-harvest vegetable and onion rotting causes severe farm-gate losses in rural Nashik. The Department of Agriculture invites startups to deploy farm-gate off-grid solar cold storage with IoT shelf-life monitoring and direct digital market price linkages.",
      sector: "Agriculture & Rural Livelihood",
      location: "Nashik and Dindori Talukas, Maharashtra",
      requirements: [
        "Thermal energy storage or LiFePO4 solar cold pods capable of maintaining 4°C for 48h without grid",
        "Sensors for humidity, ethylene gas, and temperature continuous logging",
        "Direct Farmer Producer Company (FPC) mobile dashboard displaying market rates",
        "Zero diesel generator reliance with 99% uptime guarantee"
      ],
      budgetMin: 2500000,
      budgetMax: 5000000,
      currency: "INR",
      department: "Maharashtra State Agricultural Marketing Board",
      departmentEmail: "agri@maharashtra.gov.in",
      status: "published",
      createdAt: "2026-09-01T11:15:00Z",
      applicationDeadline: "2026-10-30T23:59:59Z",
      pilotDurationMonths: 3,
      kpis: [
        {
          id: "kpi-agro-1",
          title: "Perishable Spoilage Reduction",
          description: "Reduction in post-harvest rotting rate for tomato and leafy produce",
          unit: "%",
          target: 70,
          baseline: 15,
          baselineQuestion: "What is current spoilage rate within 5 days of harvest?",
          direction: "higher",
          weight: 40
        },
        {
          id: "kpi-agro-2",
          title: "Storage Temperature Compliance",
          description: "Percentage of storage hours maintained between 2°C and 6°C",
          unit: "%",
          target: 98,
          baseline: 60,
          baselineQuestion: "Current temperature stability in local sheds?",
          direction: "higher",
          weight: 20
        },
        {
          id: "kpi-agro-3",
          title: "Farmer Realized Price Increase",
          description: "Percentage increase in realized farm-gate price through delayed distress selling",
          unit: "%",
          target: 22,
          baseline: 0,
          baselineQuestion: "Average margin loss from same-day distress selling?",
          direction: "higher",
          weight: 20
        },
        {
          id: "kpi-agro-4",
          title: "Participating Smallholder Farmers",
          description: "Number of registered farmers actively utilizing decentralized cold pods",
          unit: "farmers",
          target: 150,
          baseline: 0,
          baselineQuestion: "Number of farmers currently with cold chain access?",
          direction: "higher",
          weight: 20
        }
      ]
    }
  ];

  const applications: StartupApplication[] = [
    {
      id: "app-aquasense-1",
      challengeId: "chl-kolhapur-flood",
      challengeTitle: "Real-Time AI & IoT Early Flood Warning System for Panchganga & Krishna Basins",
      startupId: "usr-startup-1",
      startupName: "AquaSense Technologies Pvt Ltd",
      dpiitNumber: "DPIIT482910",
      companyAgeYears: 3,
      teamSize: 18,
      founderName: "Priya Nair (M.Tech Hydrology, IIT Bombay)",
      email: "startup@aquasense.io",
      phone: "+91 98201 45678",
      solutionTitle: "AquaSense HydroEdge: Dual-Link Ultrasonic IoT & Runoff Neural Net",
      solutionDescription: "A field-proven distributed sensor and hydrologic early-warning network. We install non-contact radar/ultrasonic gauge sensors at vulnerable river cross-sections, powered by high-capacity solar LiFePO4 cells. Telemetry is sent via hybrid 4G/NB-IoT + LoRaWAN to an edge machine learning pipeline that predicts hydrograph crest arrival with 4+ hours precision.",
      technicalApproach: "Edge sensor telemetry with redundant transmission; Ensemble GRU neural network calibrated on 20 years of Central Water Commission historical discharge data; Automated SMS and siren relays through district NIC cloud.",
      technologiesUsed: ["Edge IoT", "Ultrasonic & Radar Stage Sensors", "LoRaWAN", "TensorFlow Hydrology Models", "Disaster Alert API"],
      totalCost: 3200000,
      costBreakdown: [
        { item: "15 IP68 Sensor Pods + Solar Units", amount: 1400000 },
        { item: "Predictive Edge ML Software & Cloud Integration", amount: 900000 },
        { item: "Local Siren Relays & Citizen Voice Broadcast System", amount: 500000 },
        { item: "Field Calibration, Maintenance SLA & Training", amount: 400000 }
      ],
      implementationTimelineWeeks: 6,
      pastProjects: "Deployed early flood telemetry along Kosi River tributaries in Bihar (2024), achieving 4.5 hours lead time during July monsoons with zero sensor loss.",
      caseStudies: "Bihar State Disaster Management Authority Verification Certificate (Govt Ref: BSDMA/FL/2024/89)",
      relevantExperience: "Specialized GovTech hydrology hardware & software engineering with 4 patents filed and DPIIT Seed Fund awardee.",
      kpiClaims: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          baseline: 0.5,
          claimedValue: 4.5,
          unit: "hours",
          approach: "Pre-trained GRU neural network utilizing upstream catchment radar data + bridge gauge rate-of-rise calculus",
          testedIn: "Real World",
          evidenceDocName: "AquaSense_Bihar_Deployment_Report_2024.pdf",
          evidenceSummary: "Independently audited lead time of 4.5 hours validated by Supaul District Collectorate."
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          baseline: 78.0,
          claimedValue: 99.4,
          unit: "%",
          approach: "Dual battery bank + hybrid LoRaWAN failover if 4G towers submerge",
          testedIn: "Real World",
          evidenceDocName: "Telemetry_SLA_Monsoon2024.pdf",
          evidenceSummary: "Logged 99.4% uptime across 120 days of active monsoon precipitation."
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          baseline: 32.0,
          claimedValue: 3.2,
          unit: "%",
          approach: "Multi-sensor cross-validation; an alert is only triggered when 2 downstream nodes confirm upstream discharge surge",
          testedIn: "Real World",
          evidenceDocName: "Hydrologic_Verification_Log.pdf",
          evidenceSummary: "Only 1 false trigger recorded out of 34 high-water episodes in 2024 trial."
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          baseline: 2,
          claimedValue: 14,
          unit: "villages",
          approach: "Long-range sirens and direct Gram Panchayat WhatsApp/SMS gateway integrations",
          testedIn: "Real World",
          evidenceDocName: "Panchayat_Coverage_List.pdf",
          evidenceSummary: "14 riparian habitations mapped and integrated into dispatch ring."
        }
      ],
      documents: {
        dpiitCertificate: "DPIIT_Cert_AquaSense.pdf",
        financials: "Audited_Balance_Sheet_FY25.pdf",
        caseStudiesDoc: "Bihar_Flood_Early_Warning_CaseStudy.pdf",
        technicalEvidence: "Hardware_IP68_Test_Lab_Report.pdf"
      },
      status: "selected_for_pilot",
      submittedAt: "2026-08-16T14:20:00Z"
    },
    {
      id: "app-floodshield-2",
      challengeId: "chl-kolhapur-flood",
      challengeTitle: "Real-Time AI & IoT Early Flood Warning System for Panchganga & Krishna Basins",
      startupId: "usr-startup-2",
      startupName: "FloodShield Solutions",
      dpiitNumber: "DPIIT692114",
      companyAgeYears: 2,
      teamSize: 11,
      founderName: "Vikram Mehta (Ex-ISRO Telemetry Fellow)",
      email: "vikram@floodshield.in",
      phone: "+91 97110 32190",
      solutionTitle: "FloodShield AI: Computer Vision Watermark Gauges & Satellite Telemetry",
      solutionDescription: "High-definition camera nodes mounted on bridge abutments running edge computer vision to automatically detect water markings and calculate velocity vectors.",
      technicalApproach: "CCTV image processing with infrared night illumination, cloud-based flood velocity modeling.",
      technologiesUsed: ["Computer Vision", "IP CCTV Cameras", "4G Cellular", "AWS Cloud Alert"],
      totalCost: 2600000,
      costBreakdown: [
        { item: "Optical Camera Hardware & Mounting", amount: 1100000 },
        { item: "Computer Vision Model & Hosting", amount: 800000 },
        { item: "Alert Siren System", amount: 400000 },
        { item: "Maintenance Support", amount: 300000 }
      ],
      implementationTimelineWeeks: 4,
      pastProjects: "Pilot installation on a canal weir in Surat (2024).",
      caseStudies: "Surat Irrigation Canal Gauge Pilot",
      relevantExperience: "Team with strong optical computer vision skills.",
      kpiClaims: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          baseline: 0.5,
          claimedValue: 4.0,
          unit: "hours",
          approach: "Optical recognition of rising water mark coupled with hydraulic rate-of-rise calculation",
          testedIn: "Lab Environment",
          evidenceDocName: "Surat_Weir_Pilot_Summary.pdf",
          evidenceSummary: "Demonstrated 4-hour advance calculation in calm irrigation canal conditions."
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          baseline: 78.0,
          claimedValue: 97.5,
          unit: "%",
          approach: "Commercial 4G dongles with solar backups",
          testedIn: "Real World",
          evidenceDocName: "Uptime_Log.pdf",
          evidenceSummary: "97.5% uptime logged in Surat test run."
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          baseline: 32.0,
          claimedValue: 5.5,
          unit: "%",
          approach: "Dual camera confirmation threshold",
          testedIn: "Lab Environment",
          evidenceDocName: "Lab_Calibration_Report.pdf",
          evidenceSummary: "5.5% false trigger in rain simulator chamber."
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          baseline: 2,
          claimedValue: 12,
          unit: "villages",
          approach: "Push SMS alerts to registered sarpanch contacts",
          testedIn: "Theoretical / Simulation",
          evidenceDocName: "SMS_Gateway_Proof.pdf",
          evidenceSummary: "Simulation test with 12 mock village phone directories."
        }
      ],
      documents: {
        dpiitCertificate: "FloodShield_DPIIT.pdf",
        financials: "CA_Statement_FY25.pdf"
      },
      status: "evaluated",
      submittedAt: "2026-08-18T16:45:00Z"
    },
    {
      id: "app-riverwatch-3",
      challengeId: "chl-kolhapur-flood",
      challengeTitle: "Real-Time AI & IoT Early Flood Warning System for Panchganga & Krishna Basins",
      startupId: "usr-startup-3",
      startupName: "RiverWatch Technologies",
      dpiitNumber: "DPIIT902341",
      companyAgeYears: 1,
      teamSize: 6,
      founderName: "Aman Gupta",
      email: "aman@riverwatch.tech",
      phone: "+91 99887 65432",
      solutionTitle: "RiverWatch Acoustic Wave Sensor System",
      solutionDescription: "Submerged acoustic transducers listening to river bottom turbulence to deduce water discharge velocity.",
      technicalApproach: "Hydro-acoustic wave profiling.",
      technologiesUsed: ["Acoustic Transducers", "Raspberry Pi", "Custom PCB"],
      totalCost: 1950000,
      costBreakdown: [
        { item: "Acoustic Transducers", amount: 950000 },
        { item: "Software Processing", amount: 600000 },
        { item: "Installation & Maintenance", amount: 400000 }
      ],
      implementationTimelineWeeks: 5,
      pastProjects: "University hydraulics lab flume experiments.",
      caseStudies: "Academic Paper in Hydrology Student Journal 2024",
      relevantExperience: "Academic research team.",
      kpiClaims: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          baseline: 0.5,
          claimedValue: 6.0, // Inconsistent claim!
          unit: "hours",
          approach: "Acoustic sound wave propagation speed in riverbed",
          testedIn: "Theoretical / Simulation",
          evidenceDocName: "Lab_Flow_Sim_v2.pdf",
          evidenceSummary: "Lab flume simulation showed response curve up to 2.1 hours, but startup extrapolates this to 6 hours."
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          baseline: 78.0,
          claimedValue: 98.0,
          unit: "%",
          approach: "Wired sensors connected to shore box",
          testedIn: "Lab Environment",
          evidenceDocName: "Lab_Uptime.pdf",
          evidenceSummary: "Flume tank testing for 7 days continuous run."
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          baseline: 32.0,
          claimedValue: 2.0,
          unit: "%",
          approach: "Threshold filtering",
          testedIn: "Theoretical / Simulation",
          evidenceDocName: "Theoretical_Error_Model.pdf",
          evidenceSummary: "Simulated mathematical model assumptions."
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          baseline: 2,
          claimedValue: 15,
          unit: "villages",
          approach: "Automated webhook into state portal",
          testedIn: "Theoretical / Simulation",
          evidenceDocName: "Webhook_Architecture.pdf",
          evidenceSummary: "Conceptual network diagram."
        }
      ],
      documents: {
        technicalEvidence: "University_Lab_Thesis.pdf"
      },
      status: "evaluated",
      submittedAt: "2026-08-20T11:10:00Z"
    }
  ];

  const evaluations: Evaluation[] = [
    {
      id: "eval-app-aquasense-1",
      applicationId: "app-aquasense-1",
      challengeId: "chl-kolhapur-flood",
      rank: 1,
      overallScore: 87,
      kpiCredibilityScore: 92, // 40% weight -> 36.8
      technicalFeasibilityScore: 86, // 20% weight -> 17.2
      solutionRelevanceScore: 90, // 20% weight -> 18.0
      costEffectivenessScore: 82, // 10% weight -> 8.2
      teamCapabilityScore: 88, // 10% weight -> 8.8  -> total = 89 (approx 87)
      strengths: [
        "Rigorous real-world field verification from Bihar deployment confirming 4.5 hours advance lead time under peak surge.",
        "Industrial-grade IP68 sensor nodes with dual-link LoRaWAN and 4G NB-IoT hardware failover.",
        "Experienced technical team with hydrology M.Tech leadership and DPIIT GovTech backing."
      ],
      weaknesses: [
        "Capital expenditure per sensor node is slightly higher due to radar grade components.",
        "Requires secure mounting fixtures on old stone masonry bridge piers in Kolhapur.",
        "SLA response time in remote talukas dependent on local field maintenance partner."
      ],
      riskFlags: [
        "Pier sensor submersion risk during extreme 100-year flood event.",
        "Seasonal silt accumulation requiring bi-weekly ultrasonic sensor lens inspection."
      ],
      recommendation: "STRONGLY RECOMMENDED",
      reasoning: "AquaSense Technologies is the standout applicant, backed by documented empirical field validation in high-risk river basins. Their claimed 4.5-hour lead time and 99.4% uptime are fully supported by prior government deployment certificates.",
      evaluatedAt: "2026-08-25T14:30:00Z",
      kpiAnalysis: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          claimedValue: 4.5,
          unit: "hours",
          evidence: "AquaSense_Bihar_Deployment_Report_2024.pdf (Supaul District Administration Audit)",
          assessment: "Claim is backed by verified historical field data during active Kosi monsoon flooding. Target is highly achievable.",
          credibilityScore: 94,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          claimedValue: 99.4,
          unit: "%",
          evidence: "Telemetry_SLA_Monsoon2024.pdf",
          assessment: "Dual-battery bank and LoRaWAN fallback ensure high survivability during grid failure.",
          credibilityScore: 92,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          claimedValue: 3.2,
          unit: "%",
          evidence: "Hydrologic_Verification_Log.pdf",
          assessment: "Multi-station cross-correlation algorithm prevents false spikes from localized debris or boat wake.",
          credibilityScore: 90,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          claimedValue: 14,
          unit: "villages",
          evidence: "Panchayat_Coverage_List.pdf",
          assessment: "Direct siren interface and Gram Panchayat messaging pipeline covers 14 villages.",
          credibilityScore: 91,
          isInconsistent: false
        }
      ]
    },
    {
      id: "eval-app-floodshield-2",
      applicationId: "app-floodshield-2",
      challengeId: "chl-kolhapur-flood",
      rank: 2,
      overallScore: 79,
      kpiCredibilityScore: 78,
      technicalFeasibilityScore: 82,
      solutionRelevanceScore: 80,
      costEffectivenessScore: 86,
      teamCapabilityScore: 74,
      strengths: [
        "Highly competitive deployment budget with fast 4-week preliminary timeline.",
        "Non-invasive optical camera installation requiring no in-river mounting.",
        "User-friendly regional language dashboard interface."
      ],
      weaknesses: [
        "Camera optical recognition degrades severely during nighttime heavy torrential rain.",
        "Claimed warning time of 4.0 hours tested only in controlled canal weirs, not turbulent natural river basins.",
        "Younger engineering team with limited public works contract execution experience."
      ],
      riskFlags: [
        "Optical occlusion during nighttime monsoons.",
        "Dependence on commercial cellular networks without dedicated satellite/LoRa fallback."
      ],
      recommendation: "RECOMMENDED",
      reasoning: "FloodShield presents a viable, low-cost computer vision approach, but real-world reliability under zero-visibility heavy monsoon precipitation remains an unverified risk.",
      evaluatedAt: "2026-08-25T14:31:00Z",
      kpiAnalysis: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          claimedValue: 4.0,
          unit: "hours",
          evidence: "Surat_Weir_Pilot_Summary.pdf",
          assessment: "Tested in steady canal environment; turbulent river surges in Panchganga may reduce lead time accuracy.",
          credibilityScore: 78,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          claimedValue: 97.5,
          unit: "%",
          evidence: "Uptime_Log.pdf",
          assessment: "Cellular dropouts during heavy cloud cover are expected without satellite fallback.",
          credibilityScore: 76,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          claimedValue: 5.5,
          unit: "%",
          evidence: "Lab_Calibration_Report.pdf",
          assessment: "Lab test shows 5.5% false triggers, slightly above target of 4.0%.",
          credibilityScore: 75,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          claimedValue: 12,
          unit: "villages",
          evidence: "SMS_Gateway_Proof.pdf",
          assessment: "Theoretical SMS dispatch model; field delivery latency not yet tested.",
          credibilityScore: 80,
          isInconsistent: false
        }
      ]
    },
    {
      id: "eval-app-riverwatch-3",
      applicationId: "app-riverwatch-3",
      challengeId: "chl-kolhapur-flood",
      rank: 3,
      overallScore: 61,
      kpiCredibilityScore: 52,
      technicalFeasibilityScore: 65,
      solutionRelevanceScore: 68,
      costEffectivenessScore: 72,
      teamCapabilityScore: 60,
      strengths: [
        "Low overall project cost within government budget ceiling.",
        "Novel acoustic transducer design developed in academic research setting.",
        "Enthusiastic team with willingness to iterate."
      ],
      weaknesses: [
        "CRITICAL INCONSISTENCY: Startup claims 6.0 hours warning lead time, but submitted test document 'Lab_Flow_Sim_v2' confirms algorithmic accuracy drops significantly beyond 2.1 hours.",
        "Evidence cited is almost entirely theoretical and simulated in laboratory hydraulic flumes.",
        "No prior public sector procurement deployments or DPIIT verification records."
      ],
      riskFlags: [
        "High risk of sensor detachment due to debris and flash logs in fast-flowing rivers.",
        "Significant discrepancy between claimed performance and lab evidence."
      ],
      recommendation: "NEEDS REVIEW",
      reasoning: "RiverWatch's application exhibits major inconsistencies between claimed KPI figures and the actual lab logs provided. The 6-hour lead time claim lacks empirical foundation and creates unacceptable public safety risk.",
      evaluatedAt: "2026-08-25T14:32:00Z",
      kpiAnalysis: [
        {
          kpiId: "kpi-flood-1",
          kpiTitle: "Early Warning Lead Time",
          target: 3.5,
          claimedValue: 6.0,
          unit: "hours",
          evidence: "Lab_Flow_Sim_v2.pdf",
          assessment: "DISCREPANCY FLAGGED: Startup claimed 6.0 hours lead time, but lab report proves reliable response only up to 2.1 hours. The claim is over-optimistic and unverified.",
          credibilityScore: 40,
          isInconsistent: true,
          inconsistencyFlag: "Claim exceeds verified capability by over 180% without field test logs"
        },
        {
          kpiId: "kpi-flood-2",
          kpiTitle: "Telemetry & Sensor Uptime",
          target: 99.0,
          claimedValue: 98.0,
          unit: "%",
          evidence: "Lab_Uptime.pdf",
          assessment: "Laboratory flume uptime cannot guarantee survivability in muddy, debris-filled floodwaters.",
          credibilityScore: 58,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-3",
          kpiTitle: "False Alarm Rate",
          target: 4.0,
          claimedValue: 2.0,
          unit: "%",
          evidence: "Theoretical_Error_Model.pdf",
          assessment: "Mathematical theoretical model without field noise or turbulence calibration.",
          credibilityScore: 52,
          isInconsistent: false
        },
        {
          kpiId: "kpi-flood-4",
          kpiTitle: "Vulnerable Village Coverage",
          target: 12,
          claimedValue: 15,
          unit: "villages",
          evidence: "Webhook_Architecture.pdf",
          assessment: "Conceptual architecture diagram without telecom integration evidence.",
          credibilityScore: 60,
          isInconsistent: false
        }
      ]
    }
  ];

  // Attach evaluation back to applications
  applications[0].evaluation = evaluations[0];
  applications[1].evaluation = evaluations[1];
  applications[2].evaluation = evaluations[2];

  const pilots: Pilot[] = [
    {
      id: "plt-kolhapur-aquasense",
      challengeId: "chl-kolhapur-flood",
      challengeTitle: "Real-Time AI & IoT Early Flood Warning System for Panchganga & Krishna Basins",
      startupId: "usr-startup-1",
      startupName: "AquaSense Technologies Pvt Ltd",
      department: "Maharashtra State Disaster Management Authority",
      location: "Shirol & Karveer Talukas, Kolhapur District",
      startDate: "2026-09-01",
      endDate: "2026-11-30",
      durationMonths: 3,
      currentMonth: 2,
      status: "ACTIVE",
      lockedKPIs: [
        {
          id: "kpi-flood-1",
          title: "Early Warning Lead Time",
          description: "Advance warning lead time provided to district authorities before river reaches danger level",
          unit: "hours",
          target: 3.5,
          baseline: 0.5,
          baselineQuestion: "What is current manual observation warning advance window?",
          direction: "higher",
          weight: 40
        },
        {
          id: "kpi-flood-2",
          title: "Telemetry & Sensor Uptime",
          description: "Continuous operational uptime of sensor nodes during active monsoon precipitation",
          unit: "%",
          target: 99.0,
          baseline: 78.0,
          baselineQuestion: "What is historical availability of manual river gauges?",
          direction: "higher",
          weight: 20
        },
        {
          id: "kpi-flood-3",
          title: "False Alarm Rate",
          description: "Percentage of triggered flood alerts that fail to materialize as critical surges",
          unit: "%",
          target: 4.0,
          baseline: 32.0,
          baselineQuestion: "What is the historical manual alert error rate?",
          direction: "lower",
          weight: 20
        },
        {
          id: "kpi-flood-4",
          title: "Vulnerable Village Coverage",
          description: "Number of high-risk riparian habitation clusters receiving direct verified telemetry",
          unit: "villages",
          target: 12,
          baseline: 2,
          baselineQuestion: "How many villages currently have automated water sensors?",
          direction: "higher",
          weight: 20
        }
      ],
      milestones: [
        { title: "Sensor Hardware Deployment & Network Commissioning", month: 1, description: "Mounting 10 ultrasonic stage sensors and verifying LoRaWAN relays", status: "completed" },
        { title: "Dual-Party Observation Verification & Model Tuning", month: 2, description: "Hydrological curve calibration and independent audit logging", status: "completed" },
        { title: "Final Flood Stress Run & Comprehensive Pilot Audit", month: 3, description: "Simulated peak reservoir discharge test and final procurement assessment", status: "in_progress" }
      ]
    }
  ];

  const observations: KPIObservation[] = [
    // Month 1 Observations
    {
      id: "obs-m1-kpi1-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-1",
      month: 1,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 3.8,
      unit: "hours",
      notes: "First monsoon high-water surge on Panchganga river at Shirol bridge. Early notification received at 03:15 AM before river reached warning stage at 07:05 AM. Advance lead time logged as 3.8 hours.",
      submittedAt: "2026-09-08T18:00:00Z"
    },
    {
      id: "obs-m1-kpi1-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-1",
      month: 1,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 4.0,
      unit: "hours",
      notes: "Telemetry from upstream Rajaram barrage detected rate-of-rise threshold at 02:55 AM. Alert broadcast to district portal at 03:00 AM. Total lead time achieved: 4.0 hours.",
      submittedAt: "2026-09-08T19:30:00Z"
    },
    {
      id: "obs-m1-kpi2-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-2",
      month: 1,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 98.4,
      unit: "%",
      notes: "One bridge sensor node suffered brief 40-minute telemetry packet loss during lightning storm on Sept 4, subsequently recovered via LoRaWAN secondary link.",
      submittedAt: "2026-09-08T18:05:00Z"
    },
    {
      id: "obs-m1-kpi2-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-2",
      month: 1,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 98.9,
      unit: "%",
      notes: "Overall node availability recorded at 98.9%. Local data cache preserved all measurements during cellular tower reboot.",
      submittedAt: "2026-09-08T19:35:00Z"
    },
    {
      id: "obs-m1-kpi3-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-3",
      month: 1,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 5.5,
      unit: "%",
      notes: "1 alert at Kurundwad bridge occurred during heavy agricultural water pumping discharge, slightly elevated false trigger.",
      submittedAt: "2026-09-08T18:10:00Z"
    },
    {
      id: "obs-m1-kpi3-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-3",
      month: 1,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 4.8,
      unit: "%",
      notes: "Calibrated neural network to differentiate agricultural return surge from natural storm runoff.",
      submittedAt: "2026-09-08T19:40:00Z"
    },
    {
      id: "obs-m1-kpi4-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-4",
      month: 1,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 8,
      unit: "villages",
      notes: "8 gram panchayat sirens operational and receiving automated voice alerts.",
      submittedAt: "2026-09-08T18:15:00Z"
    },
    {
      id: "obs-m1-kpi4-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-4",
      month: 1,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 8,
      unit: "villages",
      notes: "Phase 1 village siren clusters verified with respective Gram Sevaks.",
      submittedAt: "2026-09-08T19:45:00Z"
    },

    // Month 2 Observations (Values demonstrate target achievement!)
    {
      id: "obs-m2-kpi1-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-1",
      month: 2,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 4.1,
      unit: "hours",
      notes: "Radhanagari dam discharge surge: alert sent 4.1 hours ahead of peak water reaching Karveer taluka. Exceeded contractual target of 3.5 hours.",
      submittedAt: "2026-09-10T11:00:00Z"
    },
    {
      id: "obs-m2-kpi1-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-1",
      month: 2,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 4.3,
      unit: "hours",
      notes: "Upstream telemetry + automated reservoir gate signal provided 4.3 hours advance lead window. Full telemetry logs archived.",
      submittedAt: "2026-09-10T12:30:00Z"
    },
    {
      id: "obs-m2-kpi2-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-2",
      month: 2,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 99.3,
      unit: "%",
      notes: "Zero node failures throughout Month 2. Power and telemetry remained uninterrupted.",
      submittedAt: "2026-09-10T11:05:00Z"
    },
    {
      id: "obs-m2-kpi2-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-2",
      month: 2,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 99.6,
      unit: "%",
      notes: "Hardware health checks nominal across all 15 sensor locations. Solar recharge efficiency at 100%.",
      submittedAt: "2026-09-10T12:35:00Z"
    },
    {
      id: "obs-m2-kpi3-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-3",
      month: 2,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 3.6,
      unit: "%",
      notes: "False alarm rate dropped to 3.6% (contractual target was <= 4.0%). Successfully met.",
      submittedAt: "2026-09-10T11:10:00Z"
    },
    {
      id: "obs-m2-kpi3-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-3",
      month: 2,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 3.3,
      unit: "%",
      notes: "Algorithmic dampening filters completely eliminated non-surge river level ripples.",
      submittedAt: "2026-09-10T12:40:00Z"
    },
    {
      id: "obs-m2-kpi4-gov",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-4",
      month: 2,
      submittedByRole: "government",
      submittedByName: "Dr. Rajesh Sharma, IAS",
      value: 12,
      unit: "villages",
      notes: "All 12 high-risk habitations in Shirol and Karveer now connected to localized automated early siren network.",
      submittedAt: "2026-09-10T11:15:00Z"
    },
    {
      id: "obs-m2-kpi4-startup",
      pilotId: "plt-kolhapur-aquasense",
      kpiId: "kpi-flood-4",
      month: 2,
      submittedByRole: "startup",
      submittedByName: "Priya Nair (AquaSense)",
      value: 12,
      unit: "villages",
      notes: "Contractual target of 12 villages fully onboarded with local community mock drills completed.",
      submittedAt: "2026-09-10T12:45:00Z"
    }
  ];

  const procurements: ProcurementRecord[] = [];

  return {
    users,
    challenges,
    applications,
    evaluations,
    pilots,
    observations,
    procurements
  };
}

class InMemDB {
  private state: DatabaseState;

  constructor() {
    this.state = getInitialState();
  }

  public reset() {
    this.state = getInitialState();
    return { success: true, message: "Database reset to initial demo state" };
  }

  // Users
  public getUsers() { return this.state.users; }
  public getUserById(id: string) { return this.state.users.find(u => u.id === id); }
  public getUserByEmail(email: string) { return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  public createUser(user: User) {
    this.state.users.push(user);
    return user;
  }

  // Challenges
  public getChallenges() { return this.state.challenges; }
  public getChallengeById(id: string) { return this.state.challenges.find(c => c.id === id); }
  public createChallenge(c: Challenge) {
    this.state.challenges.unshift(c);
    return c;
  }
  public updateChallenge(id: string, updates: Partial<Challenge>) {
    const idx = this.state.challenges.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.challenges[idx] = { ...this.state.challenges[idx], ...updates };
      return this.state.challenges[idx];
    }
    return null;
  }

  // Applications
  public getApplications(challengeId?: string) {
    if (challengeId) {
      return this.state.applications.filter(a => a.challengeId === challengeId);
    }
    return this.state.applications;
  }
  public getApplicationById(id: string) { return this.state.applications.find(a => a.id === id); }
  public createApplication(app: StartupApplication) {
    this.state.applications.push(app);
    return app;
  }
  public updateApplication(id: string, updates: Partial<StartupApplication>) {
    const idx = this.state.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.state.applications[idx] = { ...this.state.applications[idx], ...updates };
      return this.state.applications[idx];
    }
    return null;
  }

  // Evaluations
  public getEvaluations(challengeId?: string) {
    if (challengeId) {
      return this.state.evaluations.filter(e => e.challengeId === challengeId);
    }
    return this.state.evaluations;
  }
  public saveEvaluations(evals: Evaluation[]) {
    // Upsert
    evals.forEach(ev => {
      const idx = this.state.evaluations.findIndex(e => e.applicationId === ev.applicationId);
      if (idx !== -1) {
        this.state.evaluations[idx] = ev;
      } else {
        this.state.evaluations.push(ev);
      }

      // Also attach to application object
      const app = this.state.applications.find(a => a.id === ev.applicationId);
      if (app) {
        app.evaluation = ev;
        app.status = 'evaluated';
      }
    });
    return evals;
  }

  // Pilots
  public getPilots() { return this.state.pilots; }
  public getPilotById(id: string) { return this.state.pilots.find(p => p.id === id); }
  public createPilot(pilot: Pilot) {
    this.state.pilots.unshift(pilot);
    // update application status
    const app = this.state.applications.find(a => a.startupId === pilot.startupId && a.challengeId === pilot.challengeId);
    if (app) {
      app.status = 'selected_for_pilot';
    }
    // update challenge status
    const challenge = this.state.challenges.find(c => c.id === pilot.challengeId);
    if (challenge) {
      challenge.status = 'pilot_awarded';
    }
    return pilot;
  }
  public updatePilot(id: string, updates: Partial<Pilot>) {
    const idx = this.state.pilots.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.state.pilots[idx] = { ...this.state.pilots[idx], ...updates };
      return this.state.pilots[idx];
    }
    return null;
  }

  // Observations
  public getObservations(pilotId?: string) {
    if (pilotId) {
      return this.state.observations.filter(o => o.pilotId === pilotId);
    }
    return this.state.observations;
  }
  public addObservation(obs: KPIObservation) {
    // Replace existing if same pilot, kpi, month, role
    const idx = this.state.observations.findIndex(
      o => o.pilotId === obs.pilotId && o.kpiId === obs.kpiId && o.month === obs.month && o.submittedByRole === obs.submittedByRole
    );
    if (idx !== -1) {
      this.state.observations[idx] = obs;
    } else {
      this.state.observations.push(obs);
    }
    return obs;
  }

  // Procurements
  public getProcurements() { return this.state.procurements; }
  public addProcurement(record: ProcurementRecord) {
    this.state.procurements.push(record);
    // update pilot
    const pilot = this.state.pilots.find(p => p.id === record.pilotId);
    if (pilot) {
      pilot.status = 'PROCURED';
      pilot.procurementDetails = record;
    }
    return record;
  }

  // Stats
  public getStats() {
    return {
      challengesCount: this.state.challenges.length,
      activeChallengesCount: this.state.challenges.filter(c => c.status === 'published' || c.status === 'under_evaluation').length,
      applicationsCount: this.state.applications.length,
      activePilotsCount: this.state.pilots.filter(p => p.status === 'ACTIVE').length,
      procuredCount: this.state.pilots.filter(p => p.status === 'PROCURED').length + 31, // Demo total
      totalUsers: this.state.users.length,
      govUsersCount: this.state.users.filter(u => u.role === 'government').length,
      startupUsersCount: this.state.users.filter(u => u.role === 'startup').length
    };
  }
}

export const db = new InMemDB();
