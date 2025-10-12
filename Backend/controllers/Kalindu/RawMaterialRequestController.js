import RawMaterialRequest from "../../models/Kalindu/RawMaterialRequest.js";
import Supplier from "../../models/Kalindu/Suplier.js";
import Rawmaterial from "../../models/Kalindu/Rawmaterial.js";
import nodemailer from "nodemailer";

/** 🧩 Helper 1: Auto-generate Request ID */
const generateRequestId = async () => {
  const count = await RawMaterialRequest.countDocuments();
  return `REQ${String(count + 1).padStart(4, "0")}`;
};

/** ✉️ Helper 2: Reusable email sender */
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your Company" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

/** 📩 Create new raw material request + send email */
export const createRequest = async (req, res) => {
  try {
    const { supplierId, materialId, quantity, unit } = req.body;

    const supplier = await Supplier.findById(supplierId);
    const material = await Rawmaterial.findById(materialId);

    if (!supplier || !material) {
      return res.status(404).json({ error: "Supplier or Material not found" });
    }

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

    /** ✉️ Send email */
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

/** ✏️ Update request status (Approved / Rejected / Delivered) */
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const request = await RawMaterialRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Update status and timestamp
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

/** 🛑 Close a request (set status = Delivered) */
export const closeRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RawMaterialRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = "Delivered";
    request.deliveredAt = new Date();

    await request.save();

    res.status(200).json({ message: "✅ Request closed successfully", data: request });
  } catch (err) {
    console.error("❌ Error closing request:", err);
    res.status(500).json({ error: "Failed to close request" });
  }
};
