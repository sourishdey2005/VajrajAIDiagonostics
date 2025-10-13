export type AuditLogEntry = {
    id: string;
    actorName: string;
    actorRole: 'Manager' | 'Field Engineer' | 'System';
    action: string;
    targetId: string;
    targetType: 'Transformer' | 'Analysis' | 'Report' | 'Note' | 'User';
    timestamp: string;
    details: string;
}

export const auditLogData: AuditLogEntry[] = [
    {
        id: 'LOG-001',
        actorName: 'Rohan Sharma',
        actorRole: 'Manager',
        action: 'ESCALATED',
        targetId: 'NOTE-001',
        targetType: 'Note',
        timestamp: '2024-06-21T10:15:00Z',
        details: 'Manager escalated a note regarding winding deformation on TR-002.',
    },
    {
        id: 'LOG-002',
        actorName: 'Priya Sharma',
        actorRole: 'Field Engineer',
        action: 'CREATE',
        targetId: 'NOTE-001',
        targetType: 'Note',
        timestamp: '2024-06-21T10:00:00Z',
        details: 'Engineer added a new note about a temperature spike on TR-002.',
    },
    {
        id: 'LOG-003',
        actorName: 'Rohan Sharma',
        actorRole: 'Manager',
        action: 'GENERATE',
        targetId: 'REPORT-001',
        targetType: 'Report',
        timestamp: '2024-06-20T17:00:00Z',
        details: 'Manager downloaded a full analysis report for TR-004.',
    },
    {
        id: 'LOG-004',
        actorName: 'System',
        actorRole: 'System',
        action: 'ANALYSIS_COMPLETE',
        targetId: 'ANALYSIS-123',
        targetType: 'Analysis',
        timestamp: '2024-06-20T16:55:00Z',
        details: 'AI analysis for TR-004 completed. Fault detected: Inter-turn Short.',
    },
    {
        id: 'LOG-005',
        actorName: 'Meena Iyer',
        actorRole: 'Field Engineer',
        action: 'CREATE',
        targetId: 'NOTE-002',
        targetType: 'Note',
        timestamp: '2024-06-20T14:30:00Z',
        details: 'Engineer noted a minor core fault on TR-009, recommending follow-up.',
    },
    {
        id: 'LOG-006',
        actorName: 'System',
        actorRole: 'System',
        action: 'ALERT',
        targetId: 'TR-002',
        targetType: 'Transformer',
        timestamp: '2024-06-18T09:05:00Z',
        details: 'Transformer TR-002 status changed to "Needs Attention" based on live sensor data.',
    },
    {
        id: 'LOG-007',
        actorName: 'Rohan Sharma',
        actorRole: 'Manager',
        action: 'UPDATE',
        targetId: 'TR-004',
        targetType: 'Transformer',
        timestamp: '2024-06-15T11:00:00Z',
        details: 'Manager updated maintenance schedule for TR-004.',
    },
];
