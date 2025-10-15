-- Seed data for transformers table
INSERT INTO transformers (id, name, location, zone, latitude, longitude, status, criticality, last_inspection, manufacturer, servicedBy, load, nextServiceDate) VALUES
('TR-001', 'Bandra Substation', 'Mumbai, MH', 'West', 50, 20, 'Operational', 'High', '2023-10-15', 'Bharat Heavy Electricals', 'Ravi Kumar', 75, '2024-10-15'),
('TR-002', 'Cyber City Substation', 'Gurgaon, HR', 'North', 28, 45, 'Needs Attention', 'High', '2024-05-20', 'Siemens India', 'Priya Sharma', 85, '2024-07-15'),
('TR-003', 'Koramangala Grid', 'Bengaluru, KA', 'South', 80, 75, 'Operational', 'Medium', '2024-02-01', 'ABB India', 'Anil Singh', 60, '2025-02-01'),
('TR-004', 'T. Nagar Power Hub', 'Chennai, TN', 'South', 90, 60, 'Under Maintenance', 'Medium', '2024-06-10', 'Crompton Greaves', 'Meena Iyer', 55, '2024-08-25'),
('TR-005', 'Salt Lake Sector V', 'Kolkata, WB', 'East', 45, 90, 'Operational', 'Low', '2023-11-05', 'Bharat Heavy Electricals', 'Sanjay Das', 40, '2024-11-05'),
('TR-006', 'Hitec City Feeder', 'Hyderabad, TS', 'South', 70, 40, 'Operational', 'High', '2024-04-18', 'Siemens India', 'Anil Singh', 88, '2025-04-18'),
('TR-007', 'Magarpatta IT Park', 'Pune, MH', 'West', 65, 25, 'Operational', 'Medium', '2024-01-30', 'ABB India', 'Ravi Kumar', 65, '2025-01-30'),
('TR-008', 'Connaught Place Ring', 'New Delhi, DL', 'North', 20, 50, 'Operational', 'High', '2024-03-11', 'GE T&D India', 'Priya Sharma', 82, '2025-03-11'),
('TR-009', 'Guindy Industrial Estate', 'Chennai, TN', 'South', 85, 65, 'Needs Attention', 'Medium', '2023-09-01', 'Crompton Greaves', 'Meena Iyer', 78, '2024-07-01'),
('TR-010', 'New Town Financial Hub', 'Kolkata, WB', 'East', 40, 85, 'Under Maintenance', 'High', '2024-05-25', 'Schneider Electric', 'Sanjay Das', 90, '2024-09-10'),
('TR-011', 'Infopark Kochi', 'Kochi, KL', 'South', 95, 80, 'Operational', 'Medium', '2024-03-01', 'Kirloskar Electric', 'Anil Singh', 68, '2025-03-01'),
('TR-012', 'DLF IT Park', 'Noida, UP', 'North', 25, 55, 'Operational', 'Medium', '2023-12-12', 'Siemens India', 'Priya Sharma', 72, '2024-12-12'),
('TR-013', 'Ambattur Industrial Estate', 'Chennai, TN', 'South', 88, 58, 'Operational', 'Low', '2024-02-28', 'ABB India', 'Meena Iyer', 45, '2025-02-28'),
('TR-014', 'Bhubaneswar IT Park', 'Bhubaneswar, OD', 'East', 55, 92, 'Needs Attention', 'Low', '2024-04-05', 'Bharat Heavy Electricals', 'Sanjay Das', 58, '2024-10-05'),
('TR-015', 'BKC Business District', 'Mumbai, MH', 'West', 52, 18, 'Operational', 'High', '2024-05-30', 'GE T&D India', 'Ravi Kumar', 80, '2025-05-30'),
('TR-016', 'Gandhinagar Gift City', 'Ahmedabad, GJ', 'West', 48, 15, 'Operational', 'High', '2024-02-20', 'Siemens India', 'Ravi Kumar', 85, '2025-02-20'),
('TR-017', 'Chandigarh IT Park', 'Chandigarh, CH', 'North', 15, 48, 'Operational', 'Medium', '2023-11-20', 'Schneider Electric', 'Priya Sharma', 62, '2024-11-20'),
('TR-018', 'Electronic City Phase 1', 'Bengaluru, KA', 'South', 82, 78, 'Needs Attention', 'High', '2024-06-01', 'GE T&D India', 'Anil Singh', 91, '2024-07-20'),
('TR-019', 'Jubilee Hills Grid', 'Hyderabad, TS', 'South', 72, 42, 'Operational', 'Medium', '2024-01-10', 'Bharat Heavy Electricals', 'Anil Singh', 70, '2025-01-10'),
('TR-020', 'Patna Industrial Area', 'Patna, BR', 'East', 35, 88, 'Under Maintenance', 'Low', '2024-06-15', 'Kirloskar Electric', 'Sanjay Das', 50, '2024-07-30');

-- Seed data for communication_logs table
INSERT INTO communication_logs (transformer_id, author_name, author_role, created_at, content, parent_log_id, escalation_status) VALUES
('TR-002', 'Priya Sharma', 'field_engineer', '2024-06-21T10:00:00Z', 'Detected significant deviations in the FRA signature consistent with winding deformation. IoT sensors show a temperature spike. Recommend immediate attention.', NULL, 'escalated'),
('TR-002', 'Rohan Sharma', 'manager', '2024-06-21T10:15:00Z', 'Acknowledged, Priya. I''m escalating this for an emergency maintenance check. Keep monitoring the live sensor data.', 1, 'none'),
('TR-009', 'Meena Iyer', 'field_engineer', '2024-06-20T14:30:00Z', 'Minor core fault detected during routine diagnostics. Load is stable, but we should schedule a follow-up inspection within the next 30 days.', NULL, 'none'),
('TR-002', 'Priya Sharma', 'field_engineer', '2024-06-18T09:00:00Z', 'Previous maintenance cycle completed. Bushing was cleaned and all readings were nominal at the time.', NULL, 'none'),
('TR-018', 'Anil Singh', 'field_engineer', '2024-06-22T11:30:00Z', 'High load and temperature readings for the past 48 hours. FRA signature is starting to show minor deviations from baseline. Recommend monitoring.', NULL, 'none'),
('TR-014', 'Sanjay Das', 'field_engineer', '2024-06-19T16:00:00Z', 'Visual inspection shows some corrosion on the tank. No immediate risk, but should be addressed during next maintenance cycle.', NULL, 'none'),
('TR-014', 'Rohan Sharma', 'manager', '2024-06-20T09:00:00Z', 'Thanks for the update, Sanjay. I have scheduled a team to address this next month.', 6, 'none'),
('TR-009', 'Rohan Sharma', 'manager', '2024-06-22T15:00:00Z', 'Follow-up on NOTE-002. I have escalated this to ''resolved'' after Meena confirmed the on-site inspection is complete and parameters are stable.', NULL, 'resolved');

-- Seed data for complaints table
INSERT INTO complaints (id, issue_type, description, address, pincode, zone, timestamp, status) VALUES
('COMP-001', 'power_outage', 'Complete blackout in the area for over an hour.', '45, MG Road, Sector 28', '122002', 'North', '2024-06-22T11:00:00Z', 'Open'),
('COMP-002', 'sparking', 'Sparks are flying from the transformer pole on our street corner.', '112, Cyber Hub, DLF Phase 2', '122008', 'North', '2024-06-22T09:30:00Z', 'In Progress'),
('COMP-003', 'voltage_drop', 'Lights are constantly flickering and dimming.', '7, Juhu Tara Road', '400049', 'West', '2024-06-21T18:45:00Z', 'Open'),
('COMP-004', 'power_outage', 'Frequent short power cuts throughout the day.', 'Building 7, Gachibowli', '500032', 'South', '2024-06-22T12:00:00Z', 'Open');


-- Seed data for engineer_performance table
INSERT INTO engineer_performance (engineerId, name, avatar, faultsDetected, reportsSubmitted, onTimeCompletion, avgResolutionHours) VALUES
('E-001', 'Ravi Kumar', 'user-avatar-1', 28, 45, 95, 24),
('E-002', 'Priya Sharma', 'user-avatar-2', 35, 52, 98, 18),
('E-003', 'Anil Singh', 'user-avatar-3', 22, 48, 92, 36),
('E-004', 'Meena Iyer', 'user-avatar-4', 30, 42, 96, 22),
('E-005', 'Sanjay Das', 'user-avatar-5', 18, 38, 88, 48);

-- Seed data for resolved_issues table
INSERT INTO resolved_issues (transformer_id, fault_type, resolved_by, resolved_date) VALUES
('TR-004', 'Inter-turn Short', 'Meena Iyer', '2024-06-18T14:00:00Z'),
('TR-010', 'Core Fault', 'Sanjay Das', '2024-06-20T11:00:00Z');

-- Seed data for health_history table
INSERT INTO health_history (transformer_id, date, health_score) VALUES
('TR-001', '2023-07-01', 98),
('TR-001', '2023-10-01', 97),
('TR-001', '2024-01-01', 95),
('TR-001', '2024-04-01', 96),
('TR-002', '2023-07-01', 85),
('TR-002', '2023-10-01', 82),
('TR-002', '2024-01-01', 78),
('TR-002', '2024-04-01', 70),
('TR-003', '2023-07-01', 99),
('TR-003', '2023-10-01', 98),
('TR-003', '2024-01-01', 97),
('TR-003', '2024-04-01', 95),
('TR-006', '2023-07-01', 92),
('TR-006', '2023-10-01', 90),
('TR-006', '2024-01-01', 88),
('TR-006', '2024-04-01', 89);

-- Seed data for fault_history table
INSERT INTO fault_history (transformer_id, date, fault_type, severity) VALUES
('TR-002', '2024-05-20', 'Winding Deformation', 'High'),
('TR-002', '2023-09-12', 'Bushing Fault', 'Medium'),
('TR-009', '2023-09-01', 'Core Fault', 'Medium'),
('TR-014', '2024-04-05', 'Axial Displacement', 'Low'),
('TR-004', '2024-06-01', 'Inter-turn Short', 'High (Simulated)');

-- Seed data for budget_estimates table
INSERT INTO budget_estimates (fault_type, criticality, estimated_repair_cost, preventative_maintenance_cost, potential_savings, cost_breakdown) VALUES
('Winding Deformation', 'High', 550000, 80000, 470000, 'Reactive repair includes costs for emergency crew deployment, replacement windings, and significant revenue loss from extended downtime.'),
('Winding Deformation', 'Medium', 320000, 55000, 265000, 'Primary costs include specialized crew, winding materials, and moderate downtime.'),
('Winding Deformation', 'Low', 150000, 25000, 125000, 'Costs driven by materials and labor for on-site repair.'),
('Inter-turn Short', 'High', 650000, 95000, 555000, 'Extremely high costs due to near-certain catastrophic failure, requiring full transformer replacement and extensive site cleanup.'),
('Inter-turn Short', 'Medium', 400000, 65000, 335000, 'Costs include complete rewind, oil replacement, and significant labor.'),
('Inter-turn Short', 'Low', 180000, 30000, 150000, 'Includes cost for diagnostics, partial rewind and oil filtering.'),
('Core Fault', 'High', 450000, 60000, 390000, 'Repair involves core re-stacking or replacement, a labor-intensive process requiring full disassembly.'),
('Core Fault', 'Medium', 250000, 40000, 210000, 'Costs driven by specialized equipment for core lamination repair and downtime.'),
('Core Fault', 'Low', 120000, 20000, 100000, 'Costs include inspection and minor lamination repairs.'),
('Axial Displacement', 'High', 380000, 50000, 330000, 'Costs include re-clamping of windings and structural reinforcement, requiring a full outage.'),
('Axial Displacement', 'Medium', 200000, 35000, 165000, 'Costs from labor for internal inspection and mechanical adjustments.'),
('Axial Displacement', 'Low', 90000, 15000, 75000, 'Preventative action involves tightening and inspection.'),
('Bushing Fault', 'High', 250000, 25000, 225000, 'Failure can cause cascading damage; cost includes replacement bushing, oil, and potential fire damage.'),
('Bushing Fault', 'Medium', 100000, 15000, 85000, 'Cost is for the replacement of the bushing unit and associated labor.'),
('Bushing Fault', 'Low', 40000, 8000, 32000, 'Preventative action is a simple bushing replacement or cleaning.');
