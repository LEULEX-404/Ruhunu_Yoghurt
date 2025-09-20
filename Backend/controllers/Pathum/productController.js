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