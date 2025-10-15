

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
