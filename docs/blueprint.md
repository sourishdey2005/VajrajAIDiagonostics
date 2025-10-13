# **App Name**: VajraAI Diagnostics

## Core Features:

- FRA Data Ingestion: Accepts FRA files in CSV, XML, and binary formats, with format validation and error handling.
- Data Parsing and Storage: Parses uploaded FRA data and stores it in Firestore collections.
- AI-Powered Fault Analysis: Sends parsed data to a Cloud Function to run a basic ML model (anomaly detection or CNN) for fault classification with confidence score. Includes a tool for making judgments on when to present which insights.
- Dashboard Visualization: Displays fault probability scores in visual graphs using Chart.js or D3.js, with actionable maintenance suggestions derived from the expert system.
- User Authentication: Allows secure login via Firebase Authentication, integrated with role-based access control (Field Engineer vs Manager) using Firebase Custom Claims.
- Email Notifications: Sends optional email notifications for fault severity alerts via Firebase Functions + SendGrid integration.
- Expert System for Maintenance: Provides maintenance suggestions based on detected fault and transformer criticality level, implemented via JSON or Firestore rules.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust, reliability, and intelligence.
- Background color: Light gray (#F5F5F5), desaturated to 20%, for a clean, professional look.
- Accent color: Vibrant orange (#FF9800), approximately 30 degrees to the left of blue, for warnings and highlights.
- Headline font: 'Space Grotesk' (sans-serif) for headlines; Body font: 'Inter' (sans-serif) for body.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use industry-standard icons for diagnostic tools, files, alerts, and maintenance actions.
- Dashboard layout with clear sections for data input, analysis results, visualizations, and maintenance suggestions.
- Subtle loading animations and transitions to enhance user experience during data processing and analysis.