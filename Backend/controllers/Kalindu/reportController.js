import PDFDocument from "pdfkit";
import RawMaterialRequest from "../../models/Kalindu/RawMaterialRequest.js";
import Supplier from "../../models/Kalindu/Suplier.js";

// Get Supplier Performance
export const getSupplierPerformance = async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    const report = await Promise.all(
      suppliers.map(async (s) => {
        const total = await RawMaterialRequest.countDocuments({ supplierId: s._id });
        const delivered = await RawMaterialRequest.countDocuments({ supplierId: s._id, status: "Delivered" });
        const pending = await RawMaterialRequest.countDocuments({ supplierId: s._id, status: "Pending" });
        const rejected = await RawMaterialRequest.countDocuments({ supplierId: s._id, status: "Rejected" });

        return { _id: s._id, name: s.name, total, delivered, pending, rejected };
      })
    );

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching supplier data", error });
  }
};

// Get All Requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await RawMaterialRequest.find()
      .populate("supplierId", "name email")
      .populate("materialId", "name unit")
      .sort({ requestedAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Export Request PDF
export const exportRequestPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RawMaterialRequest.findById(id)
      .populate("supplierId", "name email")
      .populate("materialId", "name unit");

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Set PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=request_${request.requestId || id}.pdf`
    );

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: [500, 800] });
    doc.pipe(res);

    // ---------- HEADER ----------
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill("#3b82f6") // blue banner
      .fillColor("#ffffff")
      .fontSize(22)
      .text("Ruhunu Yoghurt Management System", 50, 30, { align: "center" });

    doc.moveDown(2);

    // ---------- TITLE ----------
    doc.fillColor("#111827")
      .fontSize(18)
      .text(" Request Report", { align: "center" });

    doc.moveDown(2);

    // ---------- REQUEST DETAILS ----------
    doc.fontSize(12).fillColor("#374151");

    const details = [
      { label: "Request ID", value: request.requestId || "N/A" },
      { label: "Supplier Name", value: request.supplierId?.name || "N/A" },
      { label: "Supplier Email", value: request.supplierId?.email || "N/A" },
      { label: "Material", value: request.materialId?.name || "N/A" },
      {
        label: "Quantity",
        value: `${request.quantity || "N/A"} ${request.materialId?.unit || ""}`,
      },
      { label: "Status", value: request.status || "Pending" },
      {
        label: "Requested At",
        value: new Date(request.requestedAt).toLocaleString(),
      },
      {
        label: "Delivered At",
        value: request.deliveredAt
          ? new Date(request.deliveredAt).toLocaleString()
          : "Not Delivered",
      },
    ];

    const labelX = 70;
    const valueX = 250;
    let y = 180;

    details.forEach((d) => {
      doc.font("Helvetica-Bold").text(`${d.label}:`, labelX, y);
      doc.font("Helvetica").text(d.value, valueX, y);
      y += 25;
    });

    // ---------- Divider ----------
    doc.moveTo(50, y + 10)
      .lineTo(doc.page.width - 50, y + 10)
      .strokeColor("#e5e7eb")
      .stroke();

    // ---------- FOOTER ----------
    doc.fontSize(10)
      .fillColor("#6b7280")
      .text("Generated automatically by Ruhunu Yoghurt System © 2025", 50, doc.page.height - 60, {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};