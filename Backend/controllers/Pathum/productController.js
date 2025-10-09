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

export async function getProduct(req, res) {
    try {
        const { rating, sort } = req.query;
        const query = {};

        
        // if (!isAdmin(req)) {
        //     query.isAvailable = true;
        // }

    
        if (rating) {
            if (rating === "1-3") {
                query.rating = { $gte: 1, $lte: 3 };
            } else if (rating === "3plus") {
                query.rating = { $gt: 3 }; 
            }
        }

        
        let sortOption = {};
        if (sort === "price_asc") {
            sortOption.price = 1; 
        } else if (sort === "price_desc") {
            sortOption.price = -1; 
        }

        const products = await Product.find(query).sort(sortOption);
        res.json(products);

    } catch (err) {
        res.status(500).json({
            message: "Failed to get products",
            error: err.message
        });
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

        
        if (newRating < 1 || newRating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        
        const newTotalRating = (product.rating * product.numRatings) + newRating;
        const newNumRatings = product.numRatings + 1;
        const newAverageRating = newTotalRating / newNumRatings;


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

export async function searchProducts(req, res){
    const searchQuery = req.params.query
    console.log("Received search query:", searchQuery);
    try {
        const products = await Product.find({
            $or : [
                {name : {$regex : searchQuery, $options : "i"}},
                {altNames : {$elemMatch : {$regex : searchQuery, $options : "i"}}},
            ],
            isAvailable : true
        })
        console.log("Products found:", products);
        res.json(products)
    } catch(err) {
        res.status(500).json({
            message : "Internal server error.",
            error : err
        })
    }
}

export async function getDashboardStats(req, res) {
    try {
        const availableCount = await Product.countDocuments({ isAvailable: true });
        const unavailableCount = await Product.countDocuments({ isAvailable: false });

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const expiringProducts = await Product.find(
            { expDate: { $gte: today, $lte: nextWeek } },
            { productId: 1, _id: 0 }
        );

        res.json({
            availableCount,
            unavailableCount,
            expiringProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }    
}