export const transformers = [
  {
    id: 'TR-001',
    name: 'Main Substation A',
    location: 'New York, NY',
    status: 'Operational',
    criticality: 'High',
    last_inspection: '2023-10-15',
  },
  {
    id: 'TR-002',
    name: 'Industrial Park B',
    location: 'Chicago, IL',
    status: 'Needs Attention',
    criticality: 'High',
    last_inspection: '2023-09-20',
  },
  {
    id: 'TR-003',
    name: 'Downtown C',
    location: 'Los Angeles, CA',
    status: 'Operational',
    criticality: 'Medium',
    last_inspection: '2023-11-01',
  },
  {
    id: 'TR-004',
    name: 'Residential Area D',
    location: 'Houston, TX',
    status: 'Under Maintenance',
    criticality: 'Medium',
    last_inspection: '2023-08-10',
  },
  {
    id: 'TR-005',
    name: 'Commercial Hub E',
    location: 'Phoenix, AZ',
    status: 'Operational',
    criticality: 'Low',
    last_inspection: '2023-11-05',
  },
];

export const dashboardStats = {
  monitored: 12,
  alerts: 3,
  operational: 9,
  health: 92,
};

export const faultDistributionData = [
  { name: 'Axial Displacement', value: 8, fill: 'var(--color-chart-1)' },
  { name: 'Winding Deformation', value: 5, fill: 'var(--color-chart-2)' },
  { name: 'Core Faults', value: 3, fill: 'var(--color-chart-3)' },
  { name: 'Bushing Faults', value: 2, fill: 'var(--color-chart-4)' },
  { name: 'Other', value: 4, fill: 'var(--color-chart-5)' },
];

export const analysisTrendData = [
  { date: 'Jan', Analyses: 30, Alerts: 5 },
  { date: 'Feb', Analyses: 45, Alerts: 8 },
  { date: 'Mar', Analyses: 60, Alerts: 12 },
  { date: 'Apr', Analyses: 50, Alerts: 7 },
  { date: 'May', Analyses: 70, Alerts: 10 },
  { date: 'Jun', Analyses: 85, Alerts: 15 },
];
