import Supplier from "../../models/Kalindu/Suplier.js";
//  Add new supplier
export const addSupplier = async (req, res) => {
  try {
    console.log("Request body:", req.body); 
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    console.log("Request body:", req.body); 
    res.status(400).json({ message: err.message });
  }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get a single supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update supplier details
export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc + validate
    );
    if (!updatedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Rate supplier
export const rateSupplier = async (req, res) => {
  try {
    const { rating } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Update average rating
    supplier.numRatings += 1;
    supplier.rating = ((supplier.rating * (supplier.numRatings - 1)) + rating) / supplier.numRatings;

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
