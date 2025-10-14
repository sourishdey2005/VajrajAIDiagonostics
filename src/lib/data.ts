
import { format, parseISO, addMonths, isBefore, isAfter } from 'date-fns';

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

export type EngineerPerformance = {
    engineerId: string;
    name: string;
    avatar: string;
    faultsDetected: number;
    reportsSubmitted: number;
    onTimeCompletion: number;
    avgResolutionHours: number;
}

export const engineerPerformanceData: EngineerPerformance[] = [
  {
    engineerId: 'E-001',
    name: 'Ravi Kumar',
    avatar: 'user-avatar-1',
    faultsDetected: 28,
    reportsSubmitted: 45,
    onTimeCompletion: 95,
    avgResolutionHours: 24,
  },
  {
    engineerId: 'E-002',
    name: 'Priya Sharma',
    avatar: 'user-avatar-2',
    faultsDetected: 35,
    reportsSubmitted: 52,
    onTimeCompletion: 98,
    avgResolutionHours: 18,
  },
  {
    engineerId: 'E-003',
    name: 'Anil Singh',
    avatar: 'user-avatar-3',
    faultsDetected: 22,
    reportsSubmitted: 48,
    onTimeCompletion: 92,
    avgResolutionHours: 36,
  },
  {
    engineerId: 'E-004',
    name: 'Meena Iyer',
    avatar: 'user-avatar-4',
    faultsDetected: 30,
    reportsSubmitted: 42,
    onTimeCompletion: 96,
    avgResolutionHours: 22,
  },
  {
    engineerId: 'E-005',
    name: 'Sanjay Das',
    avatar: 'user-avatar-5',
    faultsDetected: 18,
    reportsSubmitted: 38,
    onTimeCompletion: 88,
    avgResolutionHours: 48,
  },
];

export const engineerZones = {
    'Ravi Kumar': 'West',
    'Priya Sharma': 'North',
    'Anil Singh': 'South',
    'Meena Iyer': 'South',
    'Sanjay Das': 'East',
};

export type Note = {
    noteId: string;
    transformerId: string;
    author: string;
    authorRole: 'field_engineer' | 'manager';
    timestamp: string;
    content: string;
    replies: Note[];
    escalationStatus: 'none' | 'escalated' | 'resolved';
}

export const transformerNotes: Note[] = [
    {
        noteId: 'NOTE-001',
        transformerId: 'TR-002',
        author: 'Priya Sharma',
        authorRole: 'field_engineer',
        timestamp: '2024-06-21T10:00:00Z',
        content: 'Detected significant deviations in the FRA signature consistent with winding deformation. IoT sensors show a temperature spike. Recommend immediate attention.',
        replies: [
            {
                noteId: 'REPLY-001',
                transformerId: 'TR-002',
                author: 'Rohan Sharma',
                authorRole: 'manager',
                timestamp: '2024-06-21T10:15:00Z',
                content: 'Acknowledged, Priya. I\'m escalating this for an emergency maintenance check. Keep monitoring the live sensor data.',
                replies: [],
                escalationStatus: 'none',
            }
        ],
        escalationStatus: 'escalated',
    },
    {
        noteId: 'NOTE-002',
        transformerId: 'TR-009',
        author: 'Meena Iyer',
        authorRole: 'field_engineer',
        timestamp: '2024-06-20T14:30:00Z',
        content: 'Minor core fault detected during routine diagnostics. Load is stable, but we should schedule a follow-up inspection within the next 30 days.',
        replies: [],
        escalationStatus: 'none',
    },
    {
        noteId: 'NOTE-003',
        transformerId: 'TR-002',
        author: 'Priya Sharma',
        authorRole: 'field_engineer',
        timestamp: '2024-06-18T09:00:00Z',
        content: 'Previous maintenance cycle completed. Bushing was cleaned and all readings were nominal at the time.',
        replies: [],
        escalationStatus: 'none',
    },
];

export const environmentalData = [
  { month: 'Jan', region: 'North', lightningStrikes: 5, heatwaveDays: 0, faults: 2 },
  { month: 'Feb', region: 'North', lightningStrikes: 8, heatwaveDays: 0, faults: 3 },
  { month: 'Mar', region: 'North', lightningStrikes: 12, heatwaveDays: 2, faults: 4 },
  { month: 'Apr', region: 'North', lightningStrikes: 15, heatwaveDays: 5, faults: 6 },
  { month: 'May', region: 'North', lightningStrikes: 10, heatwaveDays: 10, faults: 8 },
  { month: 'Jun', region: 'North', lightningStrikes: 18, heatwaveDays: 12, faults: 10 },
  { month: 'Jan', region: 'South', lightningStrikes: 10, heatwaveDays: 3, faults: 4 },
  { month: 'Feb', region: 'South', lightningStrikes: 12, heatwaveDays: 4, faults: 5 },
  { month: 'Mar', region: 'South', lightningStrikes: 20, heatwaveDays: 8, faults: 9 },
  { month: 'Apr', region: 'South', lightningStrikes: 25, heatwaveDays: 12, faults: 14 },
  { month: 'May', region: 'South', lightningStrikes: 15, heatwaveDays: 15, faults: 12 },
  { month: 'Jun', region: 'South', lightningStrikes: 30, heatwaveDays: 18, faults: 16 },
  { month: 'Jan', region: 'West', lightningStrikes: 2, heatwaveDays: 1, faults: 1 },
  { month: 'Feb', region: 'West', lightningStrikes: 3, heatwaveDays: 2, faults: 2 },
  { month: 'Mar', region: 'West', lightningStrikes: 5, heatwaveDays: 4, faults: 3 },
  { month: 'Apr', region: 'West', lightningStrikes: 8, heatwaveDays: 6, faults: 4 },
  { month: 'May', region: 'West', lightningStrikes: 6, heatwaveDays: 8, faults: 5 },
  { month: 'Jun', region: 'West', lightningStrikes: 10, heatwaveDays: 10, faults: 6 },
];

export type Kpi = {
    name: string;
    value: number;
    unit: string;
    change: number;
    changeDirection: 'up' | 'down';
    trendData: { month: string; value: number }[];
};

export const kpiData: Kpi[] = [
    {
        name: 'Fault Reduction YoY',
        value: 15,
        unit: '%',
        change: 5,
        changeDirection: 'up',
        trendData: [
            { month: 'Jan', value: 20 },
            { month: 'Feb', value: 18 },
            { month: 'Mar', value: 16 },
            { month: 'Apr', value: 15 },
            { month: 'May', value: 14 },
            { month: 'Jun', value: 12 },
        ]
    },
    {
        name: 'Downtime Saved (hrs)',
        value: 1200,
        unit: 'hrs',
        change: 25,
        changeDirection: 'up',
        trendData: [
            { month: 'Jan', value: 800 },
            { month: 'Feb', value: 950 },
            { month: 'Mar', value: 1000 },
            { month: 'Apr', value: 1100 },
            { month: 'May', value: 1150 },
            { month: 'Jun', value: 1200 },
        ]
    },
    {
        name: 'MTTR (Mean Time to Repair)',
        value: 22.5,
        unit: 'hrs',
        change: 10,
        changeDirection: 'down',
        trendData: [
            { month: 'Jan', value: 32 },
            { month: 'Feb', value: 30 },
            { month: 'Mar', value: 28 },
            { month: 'Apr', value: 25 },
            { month: 'May', value: 24 },
            { month: 'Jun', value: 22.5 },
        ]
    },
     {
        name: 'Proactive Maintenance Rate',
        value: 78,
        unit: '%',
        change: 12,
        changeDirection: 'up',
        trendData: [
            { month: 'Jan', value: 50 },
            { month: 'Feb', value: 55 },
            { month: 'Mar', value: 60 },
            { month: 'Apr', value: 68 },
            { month: 'May', value: 72 },
            { month: 'Jun', value: 78 },
        ]
    },
];

export const recentlyResolved = [
    {
        id: 'RES-001',
        transformerId: 'TR-004',
        faultType: 'Inter-turn Short',
        resolvedBy: 'Meena Iyer',
        resolvedDate: '2024-06-18T14:00:00Z',
    },
    {
        id: 'RES-002',
        transformerId: 'TR-010',
        faultType: 'Core Fault',
        resolvedBy: 'Sanjay Das',
        resolvedDate: '2024-06-20T11:00:00Z',
    }
];

export type Complaint = {
  id: string;
  issueType: 'power_outage' | 'voltage_drop' | 'sparking';
  description: string;
  address: string;
  pincode: string;
  zone: 'North' | 'South' | 'East' | 'West';
  timestamp: string;
  status: 'Open' | 'In Progress' | 'Resolved';
};

export const complaintsData: Complaint[] = [
    {
        id: 'COMP-001',
        issueType: 'power_outage',
        description: 'Complete blackout in the area for over an hour.',
        address: '45, MG Road, Sector 28',
        pincode: '122002',
        zone: 'North',
        timestamp: '2024-06-22T11:00:00Z',
        status: 'Open',
    },
    {
        id: 'COMP-002',
        issueType: 'sparking',
        description: 'Sparks are flying from the transformer pole on our street corner.',
        address: '112, Cyber Hub, DLF Phase 2',
        pincode: '122008',
        zone: 'North',
        timestamp: '2024-06-22T09:30:00Z',
        status: 'In Progress',
    },
    {
        id: 'COMP-003',
        issueType: 'voltage_drop',
        description: 'Lights are constantly flickering and dimming.',
        address: '7, Juhu Tara Road',
        pincode: '400049',
        zone: 'West',
        timestamp: '2024-06-21T18:45:00Z',
        status: 'Open',
    },
     {
        id: 'COMP-004',
        issueType: 'power_outage',
        description: 'Frequent short power cuts throughout the day.',
        address: 'Building 7, Gachibowli',
        pincode: '500032',
        zone: 'South',
        timestamp: '2024-06-22T12:00:00Z',
        status: 'Open',
    }
];
