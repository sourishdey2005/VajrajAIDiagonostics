

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
    nextServiceDate: '2024-07-15', // Overdue
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
    nextServiceDate: '2024-08-25', // Due Soon
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
    servicedBy: 'Priya Sharma',
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
    nextServiceDate: '2024-07-01', // Overdue
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
    nextServiceDate: '2024-09-10', // Due Soon
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
