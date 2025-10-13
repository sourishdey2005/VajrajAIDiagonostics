

export type Transformer = {
    id: string;
    name: string;
    location: string;
    zone: 'North' | 'South' | 'East' | 'West';
    latitude: number;
    longitude: number;
    status: 'Operational' | 'Needs Attention' | 'Under Maintenance';
    criticality: 'High' | 'Medium' | 'Low';
    last_inspection: string;
    manufacturer: string;
    servicedBy: string;
    load: number;
    nextServiceDate: string;
};


export const transformers: Transformer[] = [
  {
    id: 'TR-001',
    name: 'Bandra Substation',
    location: 'Mumbai, MH',
    zone: 'West',
    latitude: 50,
    longitude: 20,
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2023-10-15',
    manufacturer: 'Bharat Heavy Electricals',
    servicedBy: 'Ravi Kumar',
    load: 75,
    nextServiceDate: '2024-10-15',
  },
  {
    id: 'TR-002',
    name: 'Cyber City Substation',
    location: 'Gurgaon, HR',
    zone: 'North',
    latitude: 28,
    longitude: 45,
    status: 'Needs Attention',
    criticality: 'High',
    last_inspection: '2024-05-20',
    manufacturer: 'Siemens India',
    servicedBy: 'Priya Sharma',
    load: 85,
    nextServiceDate: '2024-07-15', 
  },
  {
    id: 'TR-003',
    name: 'Koramangala Grid',
    location: 'Bengaluru, KA',
    zone: 'South',
    latitude: 80,
    longitude: 75,
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2024-02-01',
    manufacturer: 'ABB India',
    servicedBy: 'Anil Singh',
    load: 60,
    nextServiceDate: '2025-02-01',
  },
  {
    id: 'TR-004',
    name: 'T. Nagar Power Hub',
    location: 'Chennai, TN',
    zone: 'South',
    latitude: 90,
    longitude: 60,
    status: 'Under Maintenance',
    criticality: 'Medium',
    last_inspection: '2024-06-10',
    manufacturer: 'Crompton Greaves',
    servicedBy: 'Meena Iyer',
    load: 55,
    nextServiceDate: '2024-08-25',
  },
  {
    id: 'TR-005',
    name: 'Salt Lake Sector V',
    location: 'Kolkata, WB',
    zone: 'East',
    latitude: 45,
    longitude: 90,
    status: 'Operational',
    criticality: 'Low',
    last_inspection: '2023-11-05',
    manufacturer: 'Bharat Heavy Electricals',
    servicedBy: 'Sanjay Das',
    load: 40,
    nextServiceDate: '2024-11-05',
  },
  {
    id: 'TR-006',
    name: 'Hitec City Feeder',
    location: 'Hyderabad, TS',
    zone: 'South',
    latitude: 70,
    longitude: 40,
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2024-04-18',
    manufacturer: 'Siemens India',
    servicedBy: 'Anil Singh',
    load: 88,
    nextServiceDate: '2025-04-18',
  },
   {
    id: 'TR-007',
    name: 'Magarpatta IT Park',
    location: 'Pune, MH',
    zone: 'West',
    latitude: 65,
    longitude: 25,
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2024-01-30',
    manufacturer: 'ABB India',
    servicedBy: 'Ravi Kumar',
    load: 65,
    nextServiceDate: '2025-01-30',
  },
  {
    id: 'TR-008',
    name: 'Connaught Place Ring',
    location: 'New Delhi, DL',
    zone: 'North',
    latitude: 20,
    longitude: 50,
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2024-03-11',
    manufacturer: 'GE T&D India',
    servicedBy: 'Priya Sharma',
    load: 82,
    nextServiceDate: '2025-03-11',
  },
  {
    id: 'TR-009',
    name: 'Guindy Industrial Estate',
    location: 'Chennai, TN',
    zone: 'South',
    latitude: 85,
    longitude: 65,
    status: 'Needs Attention',
    criticality: 'Medium',
    last_inspection: '2023-09-01',
    manufacturer: 'Crompton Greaves',
    servicedBy: 'Meena Iyer',
    load: 78,
    nextServiceDate: '2024-07-01',
  },
  {
    id: 'TR-010',
    name: 'New Town Financial Hub',
    location: 'Kolkata, WB',
    zone: 'East',
    latitude: 40,
    longitude: 85,
    status: 'Under Maintenance',
    criticality: 'High',
    last_inspection: '2024-05-25',
    manufacturer: 'Schneider Electric',
    servicedBy: 'Sanjay Das',
    load: 90,
    nextServiceDate: '2024-09-10',
  },
  {
    id: 'TR-011',
    name: 'Infopark Kochi',
    location: 'Kochi, KL',
    zone: 'South',
    latitude: 95,
    longitude: 80,
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2024-03-01',
    manufacturer: 'Kirloskar Electric',
    servicedBy: 'Anil Singh',
    load: 68,
    nextServiceDate: '2025-03-01',
  },
  {
    id: 'TR-012',
    name: 'DLF IT Park',
    location: 'Noida, UP',
    zone: 'North',
    latitude: 25,
    longitude: 55,
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2023-12-12',
    manufacturer: 'Siemens India',
    servicedBy: 'Priya Sharma',
    load: 72,
    nextServiceDate: '2024-12-12',
  },
  {
    id: 'TR-013',
    name: 'Ambattur Industrial Estate',
    location: 'Chennai, TN',
    zone: 'South',
    latitude: 88,
    longitude: 58,
    status: 'Operational',
    criticality: 'Low',
    last_inspection: '2024-02-28',
    manufacturer: 'ABB India',
    servicedBy: 'Meena Iyer',
    load: 45,
    nextServiceDate: '2025-02-28',
  },
  {
    id: 'TR-014',
    name: 'Bhubaneswar IT Park',
    location: 'Bhubaneswar, OD',
    zone: 'East',
    latitude: 55,
    longitude: 92,
    status: 'Needs Attention',
    criticality: 'Low',
    last_inspection: '2024-04-05',
    manufacturer: 'Bharat Heavy Electricals',
    servicedBy: 'Sanjay Das',
    load: 58,
    nextServiceDate: '2024-10-05',
  },
  {
    id: 'TR-015',
    name: 'BKC Business District',
    location: 'Mumbai, MH',
    zone: 'West',
    latitude: 52,
    longitude: 18,
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2024-05-30',
    manufacturer: 'GE T&D India',
    servicedBy: 'Ravi Kumar',
    load: 80,
    nextServiceDate: '2025-05-30',
  },
];

export const faultDistributionData = [
  { name: 'Axial Displacement', value: 8, fill: 'hsl(var(--chart-1))' },
  { name: 'Winding Deformation', value: 5, fill: 'hsl(var(--chart-2))' },
  { name: 'Core Faults', value: 3, fill: 'hsl(var(--chart-3))' },
  { name: 'Bushing Faults', value: 2, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 4, fill: 'hsl(var(--chart-5))' },
];

export const analysisTrendData = [
  { date: 'Jan', Analyses: 30, Alerts: 5 },
  { date: 'Feb', Analyses: 45, Alerts: 8 },
  { date: 'Mar', Analyses: 60, Alerts: 12 },
  { date: 'Apr', Analyses: 50, Alerts: 7 },
  { date: 'May', Analyses: 70, Alerts: 10 },
  { date: 'Jun', Analyses: 85, Alerts: 15 },
];

export const faultProgressionData = [
    { date: '2023-11-01', deviation: 0.5, status: 'Healthy' },
    { date: '2024-01-15', deviation: 1.2, status: 'Minor Deviation' },
    { date: '2024-03-22', deviation: 2.5, status: 'Moderate Deviation' },
    { date: '2024-05-10', deviation: 4.8, status: 'Significant Deviation' },
    { date: '2024-06-20', deviation: 7.2, status: 'Critical Fault Detected' },
];

export const healthHistory = [
    { transformerId: 'TR-001', date: '2023-07-01', healthScore: 98 },
    { transformerId: 'TR-001', date: '2023-10-01', healthScore: 97 },
    { transformerId: 'TR-001', date: '2024-01-01', healthScore: 95 },
    { transformerId: 'TR-001', date: '2024-04-01', healthScore: 96 },
    { transformerId: 'TR-002', date: '2023-07-01', healthScore: 85 },
    { transformerId: 'TR-002', date: '2023-10-01', healthScore: 82 },
    { transformerId: 'TR-002', date: '2024-01-01', healthScore: 78 },
    { transformerId: 'TR-002', date: '2024-04-01', healthScore: 70 },
    { transformerId: 'TR-003', date: '2023-07-01', healthScore: 99 },
    { transformerId: 'TR-003', date: '2023-10-01', healthScore: 98 },
    { transformerId: 'TR-003', date: '2024-01-01', healthScore: 97 },
    { transformerId: 'TR-003', date: '2024-04-01', healthScore: 95 },
    { transformerId: 'TR-006', date: '2023-07-01', healthScore: 92 },
    { transformerId: 'TR-006', date: '2023-10-01', healthScore: 90 },
    { transformerId: 'TR-006', date: '2024-01-01', healthScore: 88 },
    { transformerId: 'TR-006', date: '2024-04-01', healthScore: 89 },
];

export const faultHistory = [
    { transformerId: 'TR-002', date: '2024-05-20', faultType: 'Winding Deformation', severity: 'High' },
    { transformerId: 'TR-002', date: '2023-09-12', faultType: 'Bushing Fault', severity: 'Medium' },
    { transformerId: 'TR-009', date: '2023-09-01', faultType: 'Core Fault', severity: 'Medium' },
    { transformerId: 'TR-014', date: '2024-04-05', faultType: 'Axial Displacement', severity: 'Low' },
    { transformerId: 'TR-004', date: '2024-06-01', faultType: 'Inter-turn Short', severity: 'High (Simulated)' },
];

export const budgetEstimates = {
  'Winding Deformation': {
    High: {
      estimatedRepairCost: 550000,
      preventativeMaintenanceCost: 80000,
      potentialSavings: 470000,
      costBreakdown: "Reactive repair includes costs for emergency crew deployment, replacement windings, and significant revenue loss from extended downtime."
    },
    Medium: {
      estimatedRepairCost: 320000,
      preventativeMaintenanceCost: 55000,
      potentialSavings: 265000,
      costBreakdown: "Primary costs include specialized crew, winding materials, and moderate downtime."
    },
    Low: {
      estimatedRepairCost: 150000,
      preventativeMaintenanceCost: 25000,
      potentialSavings: 125000,
      costBreakdown: "Costs driven by materials and labor for on-site repair."
    }
  },
  'Inter-turn Short': {
    High: {
      estimatedRepairCost: 650000,
      preventativeMaintenanceCost: 95000,
      potentialSavings: 555000,
      costBreakdown: "Extremely high costs due to near-certain catastrophic failure, requiring full transformer replacement and extensive site cleanup."
    },
    Medium: {
      estimatedRepairCost: 400000,
      preventativeMaintenanceCost: 65000,
      potentialSavings: 335000,
      costBreakdown: "Costs include complete rewind, oil replacement, and significant labor."
    },
    Low: {
      estimatedRepairCost: 180000,
      preventativeMaintenanceCost: 30000,
      potentialSavings: 150000,
      costBreakdown: "Includes cost for diagnostics, partial rewind and oil filtering."
    }
  },
  'Core Fault': {
    High: {
      estimatedRepairCost: 450000,
      preventativeMaintenanceCost: 60000,
      potentialSavings: 390000,
      costBreakdown: "Repair involves core re-stacking or replacement, a labor-intensive process requiring full disassembly."
    },
    Medium: {
      estimatedRepairCost: 250000,
      preventativeMaintenanceCost: 40000,
      potentialSavings: 210000,
      costBreakdown: "Costs driven by specialized equipment for core lamination repair and downtime."
    },
    Low: {
      estimatedRepairCost: 120000,
      preventativeMaintenanceCost: 20000,
      potentialSavings: 100000,
      costBreakdown: "Costs include inspection and minor lamination repairs."
    }
  },
  'Axial Displacement': {
    High: {
      estimatedRepairCost: 380000,
      preventativeMaintenanceCost: 50000,
      potentialSavings: 330000,
      costBreakdown: "Costs include re-clamping of windings and structural reinforcement, requiring a full outage."
    },
    Medium: {
      estimatedRepairCost: 200000,
      preventativeMaintenanceCost: 35000,
      potentialSavings: 165000,
      costBreakdown: "Costs from labor for internal inspection and mechanical adjustments."
    },
    Low: {
      estimatedRepairCost: 90000,
      preventativeMaintenanceCost: 15000,
      potentialSavings: 75000,
      costBreakdown: "Preventative action involves tightening and inspection."
    }
  },
  'Bushing Fault': {
    High: {
      estimatedRepairCost: 250000,
      preventativeMaintenanceCost: 25000,
      potentialSavings: 225000,
      costBreakdown: "Failure can cause cascading damage; cost includes replacement bushing, oil, and potential fire damage."
    },
    Medium: {
      estimatedRepairCost: 100000,
      preventativeMaintenanceCost: 15000,
      potentialSavings: 85000,
      costBreakdown: "Cost is for the replacement of the bushing unit and associated labor."
    },
    Low: {
      estimatedRepairCost: 40000,
      preventativeMaintenanceCost: 8000,
      potentialSavings: 32000,
      costBreakdown: "Preventative action is a simple bushing replacement or cleaning."
    }
  }
};
