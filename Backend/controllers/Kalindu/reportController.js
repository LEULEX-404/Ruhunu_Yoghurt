import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// Dummy data (replace with DB models later)
const sampleSuppliers = [
  { _id: "s1", name: "ABC Supplies", total: 10, delivered: 7, pending: 2, rejected: 1 },
  { _id: "s2", name: "XYZ Traders", total: 8, delivered: 5, pending: 2, rejected: 1 },
];

const sampleRequests = [
  {
    _id: "r1",
    requestId: "REQ-001",
    supplierId: { name: "ABC Supplies" },
    materialId: { name: "Milk Powder" },
    quantity: 50,
    unit: "kg",
    status: "Delivered",
    requestedAt: new Date(),
  },
  {
    _id: "r2",
    requestId: "REQ-002",
    supplierId: { name: "XYZ Traders" },
    materialId: { name: "Butter" },
    quantity: 20,
    unit: "kg",
    status: "Pending",
    requestedAt: new Date(),
  },
];

// ✅ Get Supplier Performance
export const getSupplierPerformance = async (req, res) => {
  try {
    res.status(200).json(sampleSuppliers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching supplier data", error });
  }
};

// ✅ Get All Requests
export const getAllRequests = async (req, res) => {
  try {
    res.status(200).json(sampleRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// ✅ Export Single Request as PDF
export const exportRequestPDF = async (req, res) => {
  try {
    const id = req.params.id;
    const request = sampleRequests.find((r) => r._id === id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const doc = new PDFDocument();
    const filePath = path.resolve(`./exports/request_${id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("Raw Material Request Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Request ID: ${request.requestId}`);
    doc.text(`Supplier: ${request.supplierId.name}`);
    doc.text(`Material: ${request.materialId.name}`);
    doc.text(`Quantity: ${request.quantity} ${request.unit}`);
    doc.text(`Status: ${request.status}`);
    doc.text(`Requested At: ${request.requestedAt.toLocaleString()}`);
    doc.end();

    stream.on("finish", () => {
      res.download(filePath, `request_${id}.pdf`, (err) => {
        if (err) console.error(err);
        fs.unlinkSync(filePath); // Delete after sending
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};
