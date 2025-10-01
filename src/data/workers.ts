export interface Worker {
  id: string;
  name: string;
  role: string;
  attendance: 'Present' | 'Absent';
  ppeStatus: 'Wearing' | 'Not Wearing';
  lastSeen: string;
}

export const workers: Worker[] = [
  {
    id: 'W001',
    name: 'Rajesh Sharma',
    role: 'Site Supervisor',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '2 mins ago',
  },
  {
    id: 'W002',
    name: 'Priya Verma',
    role: 'Safety Inspector',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '5 mins ago',
  },
  {
    id: 'W003',
    name: 'Anil Kumar',
    role: 'Construction Worker',
    attendance: 'Present',
    ppeStatus: 'Not Wearing',
    lastSeen: '1 min ago',
  },
  {
    id: 'W004',
    name: 'Sunita Patel',
    role: 'Equipment Operator',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '10 mins ago',
  },
  {
    id: 'W005',
    name: 'Vikram Singh',
    role: 'Construction Worker',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '3 mins ago',
  },
  {
    id: 'W006',
    name: 'Meera Reddy',
    role: 'Electrician',
    attendance: 'Absent',
    ppeStatus: 'Not Wearing',
    lastSeen: '2 hours ago',
  },
  {
    id: 'W007',
    name: 'Rahul Gupta',
    role: 'Welder',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '7 mins ago',
  },
  {
    id: 'W008',
    name: 'Anjali Desai',
    role: 'Quality Control',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '4 mins ago',
  },
  {
    id: 'W009',
    name: 'Karan Malhotra',
    role: 'Construction Worker',
    attendance: 'Present',
    ppeStatus: 'Not Wearing',
    lastSeen: '6 mins ago',
  },
  {
    id: 'W010',
    name: 'Pooja Nair',
    role: 'Crane Operator',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '8 mins ago',
  },
  {
    id: 'W011',
    name: 'Arjun Rao',
    role: 'Plumber',
    attendance: 'Absent',
    ppeStatus: 'Not Wearing',
    lastSeen: '1 day ago',
  },
  {
    id: 'W012',
    name: 'Deepa Joshi',
    role: 'Safety Officer',
    attendance: 'Present',
    ppeStatus: 'Wearing',
    lastSeen: '1 min ago',
  },
];

export interface Alert {
  id: string;
  workerId: string;
  workerName: string;
  type: 'PPE Violation' | 'Safety Breach' | 'Equipment Issue';
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export const alerts: Alert[] = [
  {
    id: 'A001',
    workerId: 'W003',
    workerName: 'Anil Kumar',
    type: 'PPE Violation',
    message: 'Worker not wearing safety helmet in Zone A',
    timestamp: '5 mins ago',
    severity: 'high',
  },
  {
    id: 'A002',
    workerId: 'W009',
    workerName: 'Karan Malhotra',
    type: 'PPE Violation',
    message: 'Missing safety vest in construction area',
    timestamp: '15 mins ago',
    severity: 'high',
  },
  {
    id: 'A003',
    workerId: 'W006',
    workerName: 'Meera Reddy',
    type: 'Safety Breach',
    message: 'Unauthorized access to restricted zone',
    timestamp: '1 hour ago',
    severity: 'medium',
  },
  {
    id: 'A004',
    workerId: 'W011',
    workerName: 'Arjun Rao',
    type: 'PPE Violation',
    message: 'Safety boots not detected',
    timestamp: '2 hours ago',
    severity: 'medium',
  },
];
