import Cart from "../../models/Pathum/cart.js";

// Utility: recalc totals
const recalcTotals = (cart) => {
  cart.totalCost = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  cart.totalWeight = cart.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
  return cart;
};

// Get cart by customerId
export const getCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    let cart = await Cart.findOne({ customerId }).populate("items.productId");

    if (!cart) {
      return res.json({ customerId, items: [], totalCost: 0, totalWeight: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add or update item in cart
export const addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity, price, weight } = req.body;

    let cart = await Cart.findOne({ customerId });
    if (!cart) {
      cart = new Cart({ customerId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      cart.items.push({
        productId,
        quantity,
        price,
        subtotal: quantity * price,
      });
    } else {
      cart.items[index].quantity += quantity;
      if (cart.items[index].quantity <= 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].subtotal = cart.items[index].quantity * cart.items[index].price;
      }
    }

    recalcTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove one product
export const removeFromCart = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    recalcTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const { customerId } = req.body;

    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.totalCost = 0;
    cart.totalWeight = 0;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
