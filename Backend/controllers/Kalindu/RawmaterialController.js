import Rawmaterial from "../../models/Kalindu/Rawmaterial.js";
import RawMaterialHistory from "../../models/Kalindu/RawMaterialHistory.js";


// Add new raw material
export const addRawMaterial = async (req, res) => {
  try {
    const newRawMaterial = new Rawmaterial(req.body);
    const savedRawMaterial = await newRawMaterial.save();
    res.status(201).json(savedRawMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all raw materials
export const getAllRawMaterials = async (req, res) => {
  try {
    const materials = await Rawmaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get raw material by ID
export const getRawMaterialById = async (req, res) => {
  try {
    const material = await Rawmaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Raw material not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update raw material
export const updateRawMaterial = async (req, res) => {
  try {
    const updatedMaterial = await Rawmaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMaterial) return res.status(404).json({ message: "Raw material not found" });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete raw material
export const deleteRawMaterial = async (req, res) => {
  try {
    const deletedMaterial = await Rawmaterial.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) return res.status(404).json({ message: "Raw material not found" });
    res.json({ message: "Raw material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increase quantity + Add to History
export const increaseQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const rawMaterial = await Rawmaterial.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Raw material not found" });

    const qty = Number(quantity);
    rawMaterial.quantity += qty;
    await rawMaterial.save();

    // Add history record
    await RawMaterialHistory.create({
      MID: rawMaterial.MID,
      name: rawMaterial.name,
      action: "Add",
      quantity: qty
    });

    res.status(200).json(rawMaterial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Decrease quantity + Add to History
export const decreaseQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const rawMaterial = await Rawmaterial.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Raw material not found" });

    const qty = Number(quantity);
    if (rawMaterial.quantity < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    rawMaterial.quantity -= qty;
    await rawMaterial.save();

    // Add history record
    await RawMaterialHistory.create({
      MID: rawMaterial.MID,
      name: rawMaterial.name,
      action: "Remove",
      quantity: qty
    });

    res.status(200).json(rawMaterial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional stock update with alert
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const material = await Rawmaterial.findByIdAndUpdate(id, { quantity }, { new: true });

    if (material.quantity < 10) {
      await Alert.create({
        message: `Material "${material.name}" is running low (only ${material.quantity} left)!`,
        type: "low_stock",
      });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
