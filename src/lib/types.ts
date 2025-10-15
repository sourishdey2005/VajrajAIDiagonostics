
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

export type HealthHistory = {
    id: number;
    transformer_id: string;
    date: string;
    health_score: number;
}

export type FaultHistory = {
    id: number;
    transformer_id: string;
    date: string;
    fault_type: string;
    severity: 'High' | 'Medium' | 'Low';
}

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

export type EngineerPerformance = {
    engineerId: string;
    name: string;
    avatar: string;
    faultsDetected: number;
    reportsSubmitted: number;
    onTimeCompletion: number;
    avgResolutionHours: number;
}
