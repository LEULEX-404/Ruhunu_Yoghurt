import Rawmaterial from "../../models/Kalindu/Rawmaterial.js";

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
    console.log("Materials from DB:", materials); 
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




// Increase quantity
export const increaseQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const rawMaterial = await Rawmaterial.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Raw material not found" });

    rawMaterial.quantity += Number(quantity);
    await rawMaterial.save();

    res.status(200).json(rawMaterial);  // <-- return directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Decrease quantity
export const decreaseQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const rawMaterial = await Rawmaterial.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Raw material not found" });

    if (rawMaterial.quantity < Number(quantity)) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    rawMaterial.quantity -= Number(quantity);
    await rawMaterial.save();

    res.status(200).json(rawMaterial);  // <-- return directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
