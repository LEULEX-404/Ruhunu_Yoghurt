import RawMaterialRequest from "../../models/Kalindu/RawMaterialRequest.js";
import Supplier from "../../models/Kalindu/Suplier.js";
import Rawmaterial from "../../models/Kalindu/Rawmaterial.js";
import  sendEmail  from "../../utils/sendEmails.js";  
import dotenv from "dotenv";

dotenv.config();
console.log("🔧 EMAIL_USER:", process.env.EMAIL_USER);



/** Helper: Generate Request ID */
const generateRequestId = async () => {
  const count = await RawMaterialRequest.countDocuments();
  return `REQ${String(count + 1).padStart(4, "0")}`;
};

/** Helper: Email Sender */


/** ✉️ New: send only email */
export const sendCustomEmail = async (req, res) => {
  try {
    const { supplierEmail, subject, message } = req.body;
    if (!supplierEmail || !subject || !message)
      return res.status(400).json({ error: "Missing required fields" });

    await sendEmail(supplierEmail, subject, message);
    res.status(200).json({ message: "✅ Email sent successfully" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

/** 📩 Create new raw material request + send email */
export const createRequest = async (req, res) => {
  try {
    const { supplierId, materialId, quantity, unit } = req.body;

    const supplier = await Supplier.findById(supplierId);
    const material = await Rawmaterial.findById(materialId);

    if (!supplier || !material)
      return res.status(404).json({ error: "Supplier or Material not found" });

    const requestId = await generateRequestId();

    const newRequest = new RawMaterialRequest({
      requestId,
      supplierId,
      materialId,
      quantity,
      unit,
      status: "Pending",
    });

    await newRequest.save();

    const emailBody = `
Hello ${supplier.name},

We would like to request the following raw materials:

- Material: ${material.name}
- Quantity: ${quantity} ${unit}
- Request ID: ${requestId}
- Status: Pending

Please confirm availability and delivery timeline.

Thank you,
Your Company
`;

    await sendEmail(supplier.email, `New Raw Material Request - ${requestId}`, emailBody);

    res.status(201).json({
      message: "✅ Request created and email sent successfully",
      data: newRequest,
    });
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ error: "Failed to create request" });
  }
};

/** 📦 Get all requests */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await RawMaterialRequest.find()
      .populate("supplierId", "name email")
      .populate("materialId", "name unit")
      .sort({ requestedAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

/** ✏️ Update request status */
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected", "Delivered"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const request = await RawMaterialRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = status;
    if (status === "Approved") request.approvedAt = new Date();
    if (status === "Rejected") request.rejectedAt = new Date();
    if (status === "Delivered") request.deliveredAt = new Date();

    await request.save();
    res.status(200).json({ message: "✅ Status updated", data: request });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

/** 🛑 Close request */
export const closeRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RawMaterialRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "Delivered";
    request.deliveredAt = new Date();

    await request.save();
    res.status(200).json({ message: "✅ Request closed", data: request });
  } catch (err) {
    console.error("❌ Error closing request:", err);
    res.status(500).json({ error: "Failed to close request" });
  }
};
