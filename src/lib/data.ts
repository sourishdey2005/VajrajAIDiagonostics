

import { Transformer, HealthHistory, FaultHistory, Complaint, EngineerPerformance } from './types';

export const transformers: Transformer[] = [
    {
        "id": "TR-001",
        "name": "Bandra Substation",
        "location": "Mumbai, MH",
        "zone": "West",
        "latitude": 50,
        "longitude": 20,
        "status": "Operational",
        "criticality": "High",
        "health_score": 94,
        "last_inspection": "2024-03-15",
        "manufacturer": "Siemens India",
        "servicedBy": "Ravi Kumar",
        "load": 85,
        "nextServiceDate": "2024-09-15"
    },
    {
        "id": "TR-002",
        "name": "Powai Substation",
        "location": "Mumbai, MH",
        "zone": "West",
        "latitude": 40,
        "longitude": 30,
        "status": "Needs Attention",
        "criticality": "High",
        "health_score": 85,
        "last_inspection": "2024-02-20",
        "manufacturer": "ABB India",
        "servicedBy": "Priya Sharma",
        "load": 92,
        "nextServiceDate": "2024-07-20"
    },
    {
        "id": "TR-003",
        "name": "Koramangala GSS",
        "location": "Bengaluru, KA",
        "zone": "South",
        "latitude": 75,
        "longitude": 60,
        "status": "Operational",
        "criticality": "Medium",
        "health_score": 97,
        "last_inspection": "2024-05-10",
        "manufacturer": "Crompton Greaves",
        "servicedBy": "Anil Singh",
        "load": 78,
        "nextServiceDate": "2024-11-10"
    },
    {
        "id": "TR-004",
        "name": "Nehru Place GSS",
        "location": "Delhi, DL",
        "zone": "North",
        "latitude": 20,
        "longitude": 50,
        "status": "Under Maintenance",
        "criticality": "High",
        "health_score": 90,
        "last_inspection": "2024-01-30",
        "manufacturer": "Bharat Heavy Electricals",
        "servicedBy": "Sanjay Das",
        "load": 0,
        "nextServiceDate": "2024-08-15"
    },
    {
        "id": "TR-005",
        "name": "Salt Lake Sector V",
        "location": "Kolkata, WB",
        "zone": "East",
        "latitude": 45,
        "longitude": 85,
        "status": "Operational",
        "criticality": "Medium",
        "health_score": 96,
        "last_inspection": "2024-04-22",
        "manufacturer": "GE T&D India",
        "servicedBy": "Meena Iyer",
        "load": 65,
        "nextServiceDate": "2024-10-22"
    },
    {
        "id": "TR-006",
        "name": "Hitech City GSS",
        "location": "Hyderabad, TS",
        "zone": "South",
        "latitude": 85,
        "longitude": 55,
        "status": "Operational",
        "criticality": "High",
        "health_score": 96,
        "last_inspection": "2024-03-01",
        "manufacturer": "Schneider Electric",
        "servicedBy": "Anil Singh",
        "load": 88,
        "nextServiceDate": "2024-09-01"
    },
    {
        "id": "TR-007",
        "name": "Adyar Substation",
        "location": "Chennai, TN",
        "zone": "South",
        "latitude": 90,
        "longitude": 70,
        "status": "Operational",
        "criticality": "Medium",
        "health_score": 98,
        "last_inspection": "2024-05-18",
        "manufacturer": "Kirloskar Electric",
        "servicedBy": "Anil Singh",
        "load": 72,
        "nextServiceDate": "2024-11-18"
    },
    {
        "id": "TR-008",
        "name": "Civil Lines Substation",
        "location": "Nagpur, MH",
        "zone": "West",
        "latitude": 60,
        "longitude": 40,
        "status": "Operational",
        "criticality": "Low",
        "health_score": 99,
        "last_inspection": "2024-06-05",
        "manufacturer": "Siemens India",
        "servicedBy": "Ravi Kumar",
        "load": 55,
        "nextServiceDate": "2024-12-05"
    },
    {
        "id": "TR-009",
        "name": "Sector 17 Substation",
        "location": "Chandigarh, CH",
        "zone": "North",
        "latitude": 10,
        "longitude": 45,
        "status": "Needs Attention",
        "criticality": "Medium",
        "health_score": 88,
        "last_inspection": "2024-02-11",
        "manufacturer": "ABB India",
        "servicedBy": "Sanjay Das",
        "load": 80,
        "nextServiceDate": "2024-08-11"
    },
    {
        "id": "TR-010",
        "name": "Ballygunge GSS",
        "location": "Kolkata, WB",
        "zone": "East",
        "latitude": 50,
        "longitude": 90,
        "status": "Operational",
        "criticality": "Medium",
        "health_score": 97,
        "last_inspection": "2024-04-30",
        "manufacturer": "Crompton Greaves",
        "servicedBy": "Meena Iyer",
        "load": 68,
        "nextServiceDate": "2024-10-30"
    },
    {
        "id": "TR-011",
        "name": "Guindy Industrial Estate",
        "location": "Chennai, TN",
        "zone": "South",
        "latitude": 92,
        "longitude": 75,
        "status": "Operational",
        "criticality": "Low",
        "health_score": 99,
        "last_inspection": "2024-06-01",
        "manufacturer": "GE T&D India",
        "servicedBy": "Anil Singh",
        "load": 45,
        "nextServiceDate": "2024-12-01"
    },
    {
        "id": "TR-012",
        "name": "Connaught Place",
        "location": "Delhi, DL",
        "zone": "North",
        "latitude": 18,
        "longitude": 55,
        "status": "Operational",
        "criticality": "High",
        "health_score": 95,
        "last_inspection": "2024-04-10",
        "manufacturer": "Siemens India",
        "servicedBy": "Sanjay Das",
        "load": 82,
        "nextServiceDate": "2024-10-10"
    },
    {
        "id": "TR-013",
        "name": "Viman Nagar GSS",
        "location": "Pune, MH",
        "zone": "West",
        "latitude": 65,
        "longitude": 35,
        "status": "Operational",
        "criticality": "Medium",
        "health_score": 96,
        "last_inspection": "2024-05-25",
        "manufacturer": "Bharat Heavy Electricals",
        "servicedBy": "Priya Sharma",
        "load": 70,
        "nextServiceDate": "2024-11-25"
    },
    {
        "id": "TR-014",
        "name": "Whitefield GSS",
        "location": "Bengaluru, KA",
        "zone": "South",
        "latitude": 78,
        "longitude": 65,
        "status": "Under Maintenance",
        "criticality": "Medium",
        "health_score": 92,
        "last_inspection": "2024-04-01",
        "manufacturer": "ABB India",
        "servicedBy": "Anil Singh",
        "load": 0,
        "nextServiceDate": "2024-10-01"
    },
    {
        "id": "TR-015",
        "name": "Juhu Substation",
        "location": "Mumbai, MH",
        "zone": "West",
        "latitude": 48,
        "longitude": 25,
        "status": "Needs Attention",
        "criticality": "Low",
        "health_score": 90,
        "last_inspection": "2024-01-15",
        "manufacturer": "Schneider Electric",
        "servicedBy": "Ravi Kumar",
        "load": 75,
        "nextServiceDate": "2024-07-15"
    }
];

export const healthHistory: HealthHistory[] = [
    // TR-001
    { id: 1, transformer_id: 'TR-001', date: '2023-09-01', health_score: 97 },
    { id: 2, transformer_id: 'TR-001', date: '2023-12-01', health_score: 95 },
    { id: 3, transformer_id: 'TR-001', date: '2024-03-01', health_score: 94 },
    { id: 4, transformer_id: 'TR-001', date: '2024-06-01', health_score: 94 },
    // TR-002
    { id: 5, transformer_id: 'TR-002', date: '2023-09-01', health_score: 92 },
    { id: 6, transformer_id: 'TR-002', date: '2023-12-01', health_score: 88 },
    { id: 7, transformer_id: 'TR-002', date: '2024-03-01', health_score: 85 },
    { id: 8, transformer_id: 'TR-002', date: '2024-06-01', health_score: 85 },
    // TR-003
    { id: 9, transformer_id: 'TR-003', date: '2023-09-01', health_score: 99 },
    { id: 10, transformer_id: 'TR-003', date: '2023-12-01', health_score: 98 },
    { id: 11, transformer_id: 'TR-003', date: '2024-03-01', health_score: 98 },
    { id: 12, transformer_id: 'TR-003', date: '2024-06-01', health_score: 97 },
    // TR-004
    { id: 13, transformer_id: 'TR-004', date: '2023-09-01', health_score: 96 },
    { id: 14, transformer_id: 'TR-004', date: '2023-12-01', health_score: 94 },
    { id: 15, transformer_id: 'TR-004', date: '2024-03-01', health_score: 92 },
    { id: 16, transformer_id: 'TR-004', date: '2024-06-01', health_score: 90 },
    // TR-005
    { id: 17, transformer_id: 'TR-005', date: '2023-09-01', health_score: 98 },
    { id: 18, transformer_id: 'TR-005', date: '2023-12-01', health_score: 97 },
    { id: 19, transformer_id: 'TR-005', date: '2024-03-01', health_score: 97 },
    { id: 20, transformer_id: 'TR-005', date: '2024-06-01', health_score: 96 },
    // TR-006
    { id: 21, transformer_id: 'TR-006', date: '2023-09-01', health_score: 98 },
    { id: 22, transformer_id: 'TR-006', date: '2023-12-01', health_score: 96 },
    { id: 23, transformer_id: 'TR-006', date: '2024-03-01', health_score: 96 },
    { id: 24, transformer_id: 'TR-006', date: '2024-06-01', health_score: 96 },
    // Add more for others to ensure data exists
    { id: 25, transformer_id: 'TR-007', date: '2024-06-01', health_score: 98 },
    { id: 26, transformer_id: 'TR-008', date: '2024-06-01', health_score: 99 },
    { id: 27, transformer_id: 'TR-009', date: '2024-06-01', health_score: 88 },
    { id: 28, transformer_id: 'TR-010', date: '2024-06-01', health_score: 97 },
    { id: 29, transformer_id: 'TR-011', date: '2024-06-01', health_score: 99 },
    { id: 30, transformer_id: 'TR-012', date: '2024-06-01', health_score: 95 },
    { id: 31, transformer_id: 'TR-013', date: '2024-06-01', health_score: 96 },
    { id: 32, transformer_id: 'TR-014', date: '2024-06-01', health_score: 92 },
    { id: 33, transformer_id: 'TR-015', date: '2024-06-01', health_score: 90 },
];

export const faultHistory: FaultHistory[] = [
    { id: 1, transformer_id: 'TR-002', date: '2024-03-15', fault_type: 'Winding Deformation', severity: 'High' },
    { id: 2, transformer_id: 'TR-009', date: '2024-02-28', fault_type: 'Core Fault', severity: 'Medium' },
    { id: 3, transformer_id: 'TR-015', date: '2024-01-20', fault_type: 'Bushing Fault', severity: 'Low' },
    { id: 4, transformer_id: 'TR-002', date: '2023-12-10', fault_type: 'Axial Displacement', severity: 'Medium' },
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

export const notesData = [
    // TR-001
    {
      id: 101,
      transformer_id: 'TR-001',
      author_name: 'Ravi Kumar',
      author_role: 'field_engineer',
      created_at: '2024-06-15T09:00:00Z',
      content: 'Routine inspection completed. All parameters are normal. Slight discoloration on the tank, but it seems superficial. Will monitor.',
      parent_log_id: null,
      escalation_status: 'none',
      replies: []
    },
    // TR-002
    {
      id: 1,
      transformer_id: 'TR-002',
      author_name: 'Priya Sharma',
      author_role: 'field_engineer',
      created_at: '2024-06-21T10:00:00Z',
      content: 'Initial check shows high temperature readings around the main bushing. Recommend immediate follow-up.',
      parent_log_id: null,
      escalation_status: 'escalated',
      replies: [
        {
          id: 3,
          transformer_id: 'TR-002',
          author_name: 'Rohan Sharma',
          author_role: 'manager',
          created_at: '2024-06-21T10:05:00Z',
          content: 'Acknowledged. I\'ve escalated this to the maintenance team. Keep monitoring.',
          parent_log_id: 1,
          escalation_status: 'none'
        }
      ]
    },
    {
      id: 2,
      transformer_id: 'TR-002',
      author_name: 'Sanjay Das',
      author_role: 'field_engineer',
      created_at: '2024-06-19T14:30:00Z',
      content: 'Audible buzzing noise heard from the main tank. No visual signs of distress.',
      parent_log_id: null,
      escalation_status: 'none',
      replies: []
    },
    // TR-003
    {
      id: 103,
      transformer_id: 'TR-003',
      author_name: 'Anil Singh',
      author_role: 'field_engineer',
      created_at: '2024-05-11T11:00:00Z',
      content: 'Following up on the previous voltage fluctuation report. The issue seems to have been resolved after grid stabilization. All readings are stable now.',
      parent_log_id: null,
      escalation_status: 'resolved',
      replies: []
    },
    // TR-004
    {
      id: 104,
      transformer_id: 'TR-004',
      author_name: 'Sanjay Das',
      author_role: 'field_engineer',
      created_at: '2024-06-20T12:00:00Z',
      content: 'Maintenance is underway. We are replacing the main cooling fans. Expected completion by EOD.',
      parent_log_id: null,
      escalation_status: 'none',
      replies: [
         {
          id: 105,
          transformer_id: 'TR-004',
          author_name: 'Rohan Sharma',
          author_role: 'manager',
          created_at: '2024-06-20T12:15:00Z',
          content: 'Thanks for the update, Sanjay. Let me know if you need any additional resources.',
          parent_log_id: 104,
          escalation_status: 'none'
        }
      ]
    },
    // TR-005
    {
      id: 106,
      transformer_id: 'TR-005',
      author_name: 'Meena Iyer',
      author_role: 'field_engineer',
      created_at: '2024-04-23T15:00:00Z',
      content: 'Inspection complete. The area is prone to flooding during monsoon season. Recommended raising the plinth level during next major service.',
      parent_log_id: null,
      escalation_status: 'none',
      replies: []
    },
    // TR-006
    {
        id: 107,
        transformer_id: 'TR-006',
        author_name: 'Anil Singh',
        author_role: 'field_engineer',
        created_at: '2024-03-02T13:00:00Z',
        content: 'High load observed during peak IT park hours. The transformer is handling it well but we should watch its temperature profile.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-007
    {
        id: 108,
        transformer_id: 'TR-007',
        author_name: 'Anil Singh',
        author_role: 'field_engineer',
        created_at: '2024-05-19T10:30:00Z',
        content: 'Post-inspection note: No issues found. Asset is in very good condition.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-008
    {
        id: 109,
        transformer_id: 'TR-008',
        author_name: 'Ravi Kumar',
        author_role: 'field_engineer',
        created_at: '2024-06-06T16:00:00Z',
        content: 'Routine checkup. Everything looks fine. Low criticality and stable load.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-009
    {
        id: 110,
        transformer_id: 'TR-009',
        author_name: 'Sanjay Das',
        author_role: 'field_engineer',
        created_at: '2024-06-18T11:00:00Z',
        content: 'FRA analysis from today shows a significant deviation in the low-frequency range, indicating a possible core fault. Needs further investigation.',
        parent_log_id: null,
        escalation_status: 'escalated',
        replies: []
    },
    // TR-010
    {
        id: 111,
        transformer_id: 'TR-010',
        author_name: 'Meena Iyer',
        author_role: 'field_engineer',
        created_at: '2024-05-01T12:00:00Z',
        content: 'Checked the silica gel breather, it has turned pink. Replaced it.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-011
    {
        id: 112,
        transformer_id: 'TR-011',
        author_name: 'Anil Singh',
        author_role: 'field_engineer',
        created_at: '2024-06-02T14:00:00Z',
        content: 'Updated the firmware on the remote monitoring unit attached to this transformer.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-012
    {
        id: 113,
        transformer_id: 'TR-012',
        author_name: 'Rohan Sharma',
        author_role: 'manager',
        created_at: '2024-05-20T17:00:00Z',
        content: 'Keep an eye on this asset. It serves a high-priority commercial area and load can be unpredictable.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-013
    {
        id: 114,
        transformer_id: 'TR-013',
        author_name: 'Priya Sharma',
        author_role: 'field_engineer',
        created_at: '2024-05-26T11:30:00Z',
        content: 'General inspection passed. No anomalies detected.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    },
    // TR-014
    {
        id: 115,
        transformer_id: 'TR-014',
        author_name: 'Anil Singh',
        author_role: 'field_engineer',
        created_at: '2024-06-15T10:00:00Z',
        content: 'Core fault confirmed and resolved. The transformer is now back in operational state.',
        parent_log_id: null,
        escalation_status: 'resolved',
        replies: []
    },
    // TR-015
    {
        id: 116,
        transformer_id: 'TR-015',
        author_name: 'Ravi Kumar',
        author_role: 'field_engineer',
        created_at: '2024-06-22T09:45:00Z',
        content: 'Consumer complaint of voltage drop traced to this asset. FRA analysis shows minor bushing fault. Scheduling for replacement.',
        parent_log_id: null,
        escalation_status: 'none',
        replies: []
    }
];

export type { Transformer, HealthHistory, FaultHistory, Complaint, EngineerPerformance };

export const complaintsData: Complaint[] = [
    {
        id: "COM-001",
        issueType: 'power_outage',
        description: 'Complete power outage in the entire building for the last 2 hours.',
        address: 'A-12, Sundar Nagar',
        pincode: '400051',
        zone: 'West',
        timestamp: '2024-06-21T08:00:00Z',
        status: 'Open',
    },
    {
        id: "COM-002",
        issueType: 'voltage_drop',
        description: 'Lights are flickering constantly and some appliances are not working.',
        address: '45, Rajiv Gandhi IT Park',
        pincode: '411057',
        zone: 'West',
        timestamp: '2024-06-20T18:30:00Z',
        status: 'In Progress',
    },
    {
        id: "COM-003",
        issueType: 'sparking',
        description: 'Saw sparks coming from the transformer on the street corner. It looks dangerous.',
        address: 'Near HSR Layout BDA Complex',
        pincode: '560102',
        zone: 'South',
        timestamp: '2024-06-19T22:00:00Z',
        status: 'Resolved',
    }
];

export const engineerPerformanceData: EngineerPerformance[] = [
    {
        engineerId: 'E-001',
        name: 'Ravi Kumar',
        avatar: 'user-avatar-1',
        faultsDetected: 25,
        reportsSubmitted: 40,
        onTimeCompletion: 98,
        avgResolutionHours: 28,
    },
    {
        engineerId: 'E-002',
        name: 'Priya Sharma',
        avatar: 'user-avatar-2',
        faultsDetected: 32,
        reportsSubmitted: 48,
        onTimeCompletion: 95,
        avgResolutionHours: 24,
    },
    {
        engineerId: 'E-003',
        name: 'Anil Singh',
        avatar: 'user-avatar-3',
        faultsDetected: 28,
        reportsSubmitted: 42,
        onTimeCompletion: 92,
        avgResolutionHours: 35,
    },
    {
        engineerId: 'E-004',
        name: 'Meena Iyer',
        avatar: 'user-avatar-4',
        faultsDetected: 22,
        reportsSubmitted: 35,
        onTimeCompletion: 99,
        avgResolutionHours: 30,
    },
     {
        engineerId: 'E-005',
        name: 'Sanjay Das',
        avatar: 'user-avatar-5',
        faultsDetected: 18,
        reportsSubmitted: 30,
        onTimeCompletion: 88,
        avgResolutionHours: 42,
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

export const budgetEstimates = [
    { fault_type: 'Winding Deformation', criticality: 'High', estimated_repair_cost: 7500000, preventative_maintenance_cost: 1500000, potential_savings: 6000000, cost_breakdown: 'High criticality winding deformation can lead to catastrophic failure. Reactive repair involves full winding replacement and significant downtime costs. Preventative action involves scheduled inspection, minor repairs, and oil treatment.' },
    { fault_type: 'Winding Deformation', criticality: 'Medium', estimated_repair_cost: 4000000, preventative_maintenance_cost: 800000, potential_savings: 3200000, cost_breakdown: 'Medium criticality winding deformation requires significant repair. Preventative action includes detailed FRA analysis and localized repairs.' },
    { fault_type: 'Winding Deformation', criticality: 'Low', estimated_repair_cost: 1500000, preventative_maintenance_cost: 400000, potential_savings: 1100000, cost_breakdown: 'Low criticality winding deformation can often be monitored. Reactive repair is less severe but still costly. Preventative action is mainly monitoring and minor adjustments.' },
    { fault_type: 'Core Fault', criticality: 'High', estimated_repair_cost: 6000000, preventative_maintenance_cost: 1200000, potential_savings: 4800000, cost_breakdown: 'Core faults are serious. Reactive repair may require core re-stacking or replacement. Preventative action involves regular DGA and magnetic balance tests.' },
    { fault_type: 'Core Fault', criticality: 'Medium', estimated_repair_cost: 3000000, preventative_maintenance_cost: 600000, potential_savings: 2400000, cost_breakdown: 'Medium criticality core faults can be managed if caught early. Preventative action focuses on insulation and grounding checks.' },
    { fault_type: 'Core Fault', criticality: 'Low', estimated_repair_cost: 1000000, preventative_maintenance_cost: 300000, potential_savings: 700000, cost_breakdown: 'Low criticality core faults are rare but can be addressed with minor repairs if detected early.' },
    { fault_type: 'Bushing Fault', criticality: 'High', estimated_repair_cost: 5000000, preventative_maintenance_cost: 500000, potential_savings: 4500000, cost_breakdown: 'Bushing faults are a major fire risk. Reactive repair often means full transformer loss. Preventative action is a simple bushing replacement.' },
    { fault_type: 'Bushing Fault', criticality: 'Medium', estimated_repair_cost: 2500000, preventative_maintenance_cost: 400000, potential_savings: 2100000, cost_breakdown: 'Early detection of bushing issues allows for replacement with minimal downtime.' },
    { fault_type: 'Bushing Fault', criticality: 'Low', estimated_repair_cost: 800000, preventative_maintenance_cost: 200000, potential_savings: 600000, cost_breakdown: 'Even at low criticality, a bushing fault is worth addressing proactively due to the high potential savings.' },
    { fault_type: 'Inter-turn Short', criticality: 'High', estimated_repair_cost: 8000000, preventative_maintenance_cost: 2000000, potential_savings: 6000000, cost_breakdown: 'The most severe fault. Reactive repair often means total loss. Preventative action is costly but far cheaper than replacement.' },
    { fault_type: 'Inter-turn Short', criticality: 'Medium', estimated_repair_cost: 4500000, preventative_maintenance_cost: 1200000, potential_savings: 3300000, cost_breakdown: 'Detecting an early-stage inter-turn short is critical. Proactive repair can save the asset.' },
    { fault_type: 'Inter-turn Short', criticality: 'Low', estimated_repair_cost: 2000000, preventative_maintenance_cost: 700000, potential_savings: 1300000, cost_breakdown: 'Even a low-criticality asset with this fault is a major concern. Proactive repair is highly recommended.' },
    // Add more combinations as needed...
];

export const recentlyResolved = [
    { id: 1, transformer_id: 'TR-014', fault_type: 'Core Fault', resolved_by: 'Anil Singh', resolved_date: '2024-06-15T10:00:00Z' },
    { id: 2, transformer_id: 'TR-004', fault_type: 'Bushing Replacement', resolved_by: 'Sanjay Das', resolved_date: '2024-06-12T15:30:00Z' },
    { id: 3, transformer_id: 'COM-003', fault_type: 'Sparking Issue', resolved_by: 'Field Team', resolved_date: '2024-06-20T09:00:00Z' },
];

export const simulationData = [
  { load_scenario: '75% Load', projected_health_score: 93, lifespan_reduction_percent: 2, recommendation: 'Optimal performance. Standard maintenance schedule recommended.' },
  { load_scenario: '80% Load', projected_health_score: 91, lifespan_reduction_percent: 3, recommendation: 'Slightly increased load. Monitor temperature during peak hours.' },
  { load_scenario: '85% Load', projected_health_score: 89, lifespan_reduction_percent: 5, recommendation: 'Increased load. Consider quarterly oil quality checks.' },
  { load_scenario: '90% Load', projected_health_score: 86, lifespan_reduction_percent: 8, recommendation: 'High load. Recommend biannual comprehensive inspection.' },
  { load_scenario: '95% Load', projected_health_score: 82, lifespan_reduction_percent: 12, recommendation: 'Very high load. Risk of accelerated aging. Consider load balancing.' },
  { load_scenario: '100% Load', projected_health_score: 78, lifespan_reduction_percent: 18, recommendation: 'At maximum capacity. High risk. Recommend immediate review of load management.' },
  { load_scenario: '105% Load', projected_health_score: 72, lifespan_reduction_percent: 25, recommendation: 'Overloaded. Significant risk of thermal stress and premature failure. Urgent action required.' },
  { load_scenario: '110% Load', projected_health_score: 65, lifespan_reduction_percent: 35, recommendation: 'Critically overloaded. High probability of imminent failure. Immediate load reduction is necessary.' },
  { load_scenario: '115% Load', projected_health_score: 55, lifespan_reduction_percent: 50, recommendation: 'Dangerously overloaded. Asset integrity compromised. De-energize if possible and conduct emergency assessment.' },
  { load_scenario: '120% Load', projected_health_score: 40, lifespan_reduction_percent: 70, recommendation: 'Extreme overload. Catastrophic failure is imminent. Evacuate area and de-energize immediately.' },
];
