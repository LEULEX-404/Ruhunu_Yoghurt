import Product from "../../models/Pathum/product.js";
import { isAdmin } from "../../controllers/Tharuka/employeeController.js"


export async function saveProduct(req, res){
    
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to add a product"
        })
        return
    }

    const product = new Product(req.body);

    product.save().then(() => {
        res.json({
            message : "Product added successfully"
        })
    }).catch(() => {
        res.json({
            message : "Failed to add product"
        })
    })
}

export async function getProduct(req, res){
    try {
        if (isAdmin(req)) {
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isAvailable : true})
            res.json(products)
        }
    } catch (err) {
        res.json({
            message : "Failed to get products",
            error : err
        })
    }
}

export async function updateProduct(req, res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update a product"
        })
        return
    }

    const productId = req.params.productId
    const updatingData = req.body

    try {
        await Product.updateOne(
            {productId : productId},
            updatingData
        )

        res.json({
            message : "Product updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }
}

export async function deleteProduct(req, res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to delete a product"
        })
        return
    }

    try {
        await Product.deleteOne({productId : req.params.productId})
        res.json({message : "Product deleted successfully"})

    } catch (err) {
        res.status(500).json({
            message : "Failed to delete product",
            error : err
        })
    }
    
}

export async function getProductById(req, res){
    const productId = req.params.productId

    try {
        const product = await Product.findOne(
            {productId : productId}
        )

        if(product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return
        }

        if(product.isAvailable){
            res.json(product)
        }else{
            if (!isAdmin(req)) {
                res.status(404).json({
                    message : "Product not found"
                })
                return
            } else {
                res.json(product)
            }
        }
    } catch (err) {
        res.status(500).json({
            message : "Internal server error.",
            error : err
        })
    }
}

export async function addRating(req, res) {
    try {
        const { productId, newRating } = req.body;

        // validate rating value
        if (newRating < 1 || newRating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        // find by your custom productId instead of MongoDB _id
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // calculate new average rating
        const newTotalRating = (product.rating * product.numRatings) + newRating;
        const newNumRatings = product.numRatings + 1;
        const newAverageRating = newTotalRating / newNumRatings;

        // update product fields
        product.rating = newAverageRating;
        product.numRatings = newNumRatings;

        await product.save();

        return res.json({
            message: "Rating added successfully",
            rating: product.rating,
            numRatings: product.numRatings,
        });
    } catch (error) {
        console.error("Error adding rating:", error.message);
        return res.status(500).json({
            message: "Error adding rating",
            error: error.message,
        });
    }
}