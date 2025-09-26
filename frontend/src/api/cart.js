// cart.js

// Get cart for a specific user
export function getCart(id) {
    if (!id) return []; // fallback if no user
    let cart = localStorage.getItem(`cart_${id}`);
    if (!cart) {
        cart = [];
        localStorage.setItem(`cart_${id}`, JSON.stringify(cart));
    } else {
        cart = JSON.parse(cart);
    }
    return cart;
}

// Save cart for a specific user
export function setCart(id, cart) {
    if (!id) return;
    localStorage.setItem(`cart_${id}`, JSON.stringify(cart));
}

// Add a product to the user's cart
export function addToCart(id, product, qty) {
    if (!id) return;
    let cart = getCart(id);

    let index = cart.findIndex(item => item.productId === product.productId);

    if (index === -1) {
        cart.push({
            productId: product.productId,
            name: product.name,
            image: product.image || (product.images ? product.images[0] : ""),
            price: product.price,
            labelledPrice: product.labelledPrice,
            qty: qty
        });
    } else {
        const newQty = cart[index].qty + qty;
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].qty = newQty;
        }
    }

    setCart(id, cart);
}

// Remove a product from the user's cart
export function removeFromCart(id, productId) {
    if (!id) return;
    let cart = getCart(id);
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(id, newCart);
}

// Get total price of the user's cart
export function getTotal(id) {
    let cart = getCart(id);
    return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}
