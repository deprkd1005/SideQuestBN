import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateReceipt = (tx) => {
  const doc = new jsPDF();

  // Branding
  doc.setFontSize(22);
  doc.setTextColor(0, 165, 80);
  doc.text("SideQuest.BN", 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Official Payment Receipt", 20, 28);
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);

  // Transaction Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Transaction ID: ${tx.id}`, 20, 45);
  doc.text(`Status: ${tx.status}`, 20, 52);
  doc.text(`Date: ${new Date(tx.date).toLocaleString()}`, 20, 59);

  // Table
  doc.autoTable({
    startY: 70,
    head: [['Description', 'Amount']],
    body: [
      [tx.type, `BND ${Math.abs(tx.amount).toFixed(2)}`],
    ],
    headStyles: { fillStyle: [0, 165, 80] },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`TOTAL: BND ${Math.abs(tx.amount).toFixed(2)}`, 140, finalY);

  // Verified Stamp
  doc.setDrawColor(0, 165, 80);
  doc.setLineWidth(1);
  doc.rect(140, finalY + 10, 40, 15);
  doc.setTextColor(0, 165, 80);
  doc.setFontSize(10);
  doc.text("VERIFIED", 150, finalY + 20);

  doc.save(`Receipt_${tx.id}.pdf`);
};
