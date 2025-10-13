export const transformers = [
  {
    id: 'TR-001',
    name: 'Bandra Substation',
    location: 'Mumbai, MH',
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
    status: 'Needs Attention',
    criticality: 'High',
    last_inspection: '2024-05-20',
    manufacturer: 'Siemens India',
    servicedBy: 'Priya Sharma',
    load: 85,
    nextServiceDate: '2024-11-20',
  },
  {
    id: 'TR-003',
    name: 'Koramangala Grid',
    location: 'Bengaluru, KA',
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
    status: 'Under Maintenance',
    criticality: 'Medium',
    last_inspection: '2024-06-10',
    manufacturer: 'Crompton Greaves',
    servicedBy: 'Meena Iyer',
    load: 55,
    nextServiceDate: '2024-12-10',
  },
  {
    id: 'TR-005',
    name: 'Salt Lake Sector V',
    location: 'Kolkata, WB',
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
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2024-04-18',
    manufacturer: 'Siemens India',
    servicedBy: 'Priya Sharma',
    load: 88,
    nextServiceDate: '2025-04-18',
  },
   {
    id: 'TR-007',
    name: 'Magarpatta IT Park',
    location: 'Pune, MH',
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2024-01-30',
    manufacturer: 'ABB India',
    servicedBy: 'Ravi Kumar',
    load: 65,
    nextServiceDate: '2025-01-30',
  },
];

export const dashboardStats = {
  monitored: 12,
  alerts: 3,
  operational: 9,
  health: 92,
};

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

export const transformerStatusData = [
  { name: 'Operational', value: 9, fill: 'hsl(var(--chart-2))' },
  { name: 'Needs Attention', value: 2, fill: 'hsl(var(--destructive))' },
  { name: 'Under Maintenance', value: 1, fill: 'hsl(var(--chart-3))' },
];

export const criticalityDistributionData = [
    { name: 'High', value: 3, fill: 'hsl(var(--destructive))' },
    { name: 'Medium', value: 3, fill: 'hsl(var(--chart-3))' },
    { name: 'Low', value: 1, fill: 'hsl(var(--chart-1))' },
]
