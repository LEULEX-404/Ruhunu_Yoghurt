import RawMaterialHistory from "../../models/Kalindu/RawMaterialHistory.js";
import PDFDocument from "pdfkit";



// Get all history
export const getHistory = async (req, res) => {
  try {
    const history = await RawMaterialHistory.find().sort({ time: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Export history PDF
export const exportHistoryPDF = async (req, res) => {
  try {
    const history = await RawMaterialHistory.find().sort({ time: -1 });

    // Set headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=raw_material_history.pdf");

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    // ---------- HEADER ----------
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill("#3949ab")
      .fillColor("#ffffff")
      .fontSize(22)
      .text("Ruhunu Yoghurt Management System", 50, 30, { align: "center" });

    doc.moveDown(3);

    // ---------- TITLE ----------
    doc.fillColor("#111827")
      .fontSize(18)
      .text("Transaction History Report", { align: "center" });

    doc.moveDown(1);
    doc.fontSize(12)
      .fillColor("#4b5563")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });

    doc.moveDown(2);

    // ---------- TABLE HEADER ----------
    const tableTop = 170;
    const rowHeight = 22;

    const columns = {
      MID: 40,
      Name: 110,
      Action: 260,
      Quantity: 360,
      Time: 450,
    };

    // Table header background
    doc.rect(40, tableTop - 5, 520, 25).fill("#3b82f6");
    doc.fillColor("#ffffff").fontSize(12);
    doc.text("MID", columns.MID, tableTop);
    doc.text("Name", columns.Name, tableTop);
    doc.text("Transaction Type", columns.Action, tableTop);
    doc.text("Quantity", columns.Quantity, tableTop);
    doc.text("Time", columns.Time, tableTop);

    // ---------- TABLE BODY ----------
    let y = tableTop + rowHeight;
    doc.fontSize(11);

    history.forEach((h, i) => {
      // Alternate row colors for readability
      const rowColor = i % 2 === 0 ? "#f3f4f6" : "#ffffff";
      doc.rect(40, y - 4, 520, rowHeight).fill(rowColor);

      doc.fillColor("#111827");
      doc.text(h.MID || "—", columns.MID, y);
      doc.text(h.name || "—", columns.Name, y);
      doc.fillColor(h.action === "Add" ? "#10b981" : "#ef4444");
      doc.text(h.action || "—", columns.Action, y);
      doc.fillColor("#111827");
      doc.text(h.quantity?.toString() || "—", columns.Quantity, y);
      doc.text(new Date(h.time).toLocaleString(), columns.Time, y);

      y += rowHeight;

      // Add new page if too long
      if (y > 750) {
        doc.addPage();
        y = 100;
        // Repeat table header on new page
        doc.rect(40, y - 5, 520, 25).fill("#3b82f6");
        doc.fillColor("#ffffff").fontSize(12);
        doc.text("MID", columns.MID, y);
        doc.text("Name", columns.Name, y);
        doc.text("Transaction Type", columns.Action, y);
        doc.text("Quantity", columns.Quantity, y);
        doc.text("Time", columns.Time, y);
        y += rowHeight;
      }
    });

    // ---------- FOOTER ----------
    doc.moveDown(2);
    doc.fontSize(10)
      .fillColor("#6b7280")
      .text("Generated automatically by Ruhunu Yoghurt System © 2025", 50, doc.page.height - 60, {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate PDF" });
  }
};