import Product from "../../models/Pathum/product.js";

// Get all products (for stock manager dashboard)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); 
    console.log(products); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increase quantity
export const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body; 

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity += amount;
    product.isAvailable = product.quantity > 0;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Decrease quantity
export const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body; 

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.quantity < amount) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.quantity -= amount;
    product.isAvailable = product.quantity > 0;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
