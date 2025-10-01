import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Worker, Alert } from '@/data/workers';

const VIOLATION_PENALTY = 2; // ₹2 per violation
const HOLIDAY_PENALTY = 0.5; // 0.5 day per violation
const INITIAL_HOLIDAYS = 4;

const getSalaryByRole = (role: string): number => {
  const salaryRanges: { [key: string]: number } = {
    'Site Supervisor': 20000,
    'Safety Inspector': 18000,
    'Safety Officer': 18000,
    'Construction Worker': 15000,
    'Equipment Operator': 17000,
    'Electrician': 16500,
    'Welder': 16000,
    'Quality Control': 17500,
    'Crane Operator': 18500,
    'Plumber': 15500,
  };
  return salaryRanges[role] || 15000;
};

export const generatePDFReport = (workers: Worker[], alerts: Alert[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Factory Safety & Monitoring Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text('Devbhoomi Uttarakhand University', 14, 35);
  
  // Summary Statistics
  const presentWorkers = workers.filter(w => w.attendance === 'Present').length;
  const ppeViolations = workers.filter(w => w.ppeStatus === 'Not Wearing' && w.attendance === 'Present').length;
  const totalViolations = alerts.length;
  
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Summary Statistics', 14, 45);
  
  doc.setFontSize(10);
  doc.text(`Total Workers: ${workers.length}`, 14, 53);
  doc.text(`Present Today: ${presentWorkers} (${((presentWorkers / workers.length) * 100).toFixed(1)}%)`, 14, 60);
  doc.text(`PPE Violations: ${ppeViolations}`, 14, 67);
  doc.text(`Total Alerts: ${totalViolations}`, 14, 74);
  
  // Worker Details Table
  autoTable(doc, {
    startY: 85,
    head: [['ID', 'Name', 'Role', 'Attendance', 'PPE Status', 'Last Seen']],
    body: workers.map(w => [
      w.id,
      w.name,
      w.role,
      w.attendance,
      w.ppeStatus,
      w.lastSeen
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { top: 10 }
  });
  
  // Recent Alerts Table
  const finalY = (doc as any).lastAutoTable.finalY || 85;
  doc.setFontSize(14);
  doc.text('Recent Alerts', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Alert ID', 'Worker', 'Type', 'Message', 'Severity']],
    body: alerts.map(a => [
      a.id,
      a.workerName,
      a.type,
      a.message,
      a.severity.toUpperCase()
    ]),
    theme: 'striped',
    headStyles: { fillColor: [239, 68, 68] },
  });
  
  // Save PDF
  doc.save(`factory-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateSalaryExcel = (workers: Worker[], alerts: Alert[]) => {
  // Calculate violations per worker
  const violationCounts = alerts.reduce((acc, alert) => {
    acc[alert.workerId] = (acc[alert.workerId] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  // Prepare salary data
  const salaryData = workers.map(worker => {
    const baseSalary = getSalaryByRole(worker.role);
    const violations = violationCounts[worker.id] || 0;
    const salaryDeduction = violations * VIOLATION_PENALTY;
    const finalSalary = baseSalary - salaryDeduction;
    const holidayDeduction = violations * HOLIDAY_PENALTY;
    const remainingHolidays = Math.max(0, INITIAL_HOLIDAYS - holidayDeduction);
    
    return {
      'Worker ID': worker.id,
      'Name': worker.name,
      'Role': worker.role,
      'Attendance': worker.attendance,
      'PPE Status': worker.ppeStatus,
      'Base Salary (₹)': baseSalary,
      'Violations': violations,
      'Salary Deduction (₹)': salaryDeduction,
      'Final Salary (₹)': finalSalary,
      'Initial Holidays': INITIAL_HOLIDAYS,
      'Holiday Deduction': holidayDeduction,
      'Remaining Holidays': remainingHolidays,
    };
  });
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Salary Sheet
  const ws1 = XLSX.utils.json_to_sheet(salaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Salary Report');
  
  // Summary Sheet
  const summaryData = [
    { 'Metric': 'Total Workers', 'Value': workers.length },
    { 'Metric': 'Present Today', 'Value': workers.filter(w => w.attendance === 'Present').length },
    { 'Metric': 'Total Violations', 'Value': alerts.length },
    { 'Metric': 'Total Salary Deductions (₹)', 'Value': salaryData.reduce((sum, w) => sum + w['Salary Deduction (₹)'], 0) },
    { 'Metric': 'Total Final Salary (₹)', 'Value': salaryData.reduce((sum, w) => sum + w['Final Salary (₹)'], 0) },
  ];
  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary');
  
  // Save Excel
  XLSX.writeFile(wb, `salary-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};