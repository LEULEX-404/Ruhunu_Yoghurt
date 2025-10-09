//CREATE
import promocode from "../../models/Lasiru/promocode.js";

// Define an async function called addpromocode  
// req = request data coming from client  
// res = response we send back to client
export const addpromocode = async (req, res) => {
    try{
        // Extract values from request body 
        const  {code,discountType,discountValue,expiryDate,usageLimit,usedCount,isActive} = req.body;
        // Create a new promocode object using the model  
        const newpromocode = new promocode ({
            code,
            discountType,
            discountValue,
            expiryDate,
            usageLimit,
            usedCount,
            isActive,
    })
    // Save the new promocode document into the MongoDB database
    await newpromocode.save();
    // Send a response back to the client  
    res.status(201).json({message: "Promocode Created Successfully",promo : newpromocode});

}catch (error){
    // Print error in console
    console.error(error);
    res.status(500).json ({message: "Promocode Created Unsuccessfully",error : error.message})
}
}

//READ
// Get all promocodes
export const getAllPromocodes = async (req, res) => {
    try {
        // get all promo documents from DB
        const promos = await promocode.find(); 
        // send them as JSON
        res.status(200).json(promos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch promocodes", error: error.message });
    }
};

// Get a single promocode by ID
export const getPromocodeById = async (req, res) => {
    try {
        // find promo by ID
        const promo = await promocode.findById(req.params.id); 
        if (!promo) {
            return res.status(404).json({ message: "Promocode not found" });
        }
        res.status(200).json(promo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch promocode", error: error.message });
    }
};

// UPDATE
export const updatePromocode = async (req, res) => {
    try {
        const updatedPromo = await promocode.findByIdAndUpdate(
            req.params.id,
            req.body,
            // return updated document
            { new: true } 
        );
        if (!updatedPromo) {
            return res.status(404).json({ message: "Promocode not found" });
        }
        res.status(200).json({ message: "Promocode Updated Successfully", promo: updatedPromo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update promocode", error: error.message });
    }
};

// DELETE 
export const deletePromocode = async (req, res) => {
    try {
        const deletedPromo = await promocode.findByIdAndDelete(req.params.id);
        if (!deletedPromo) {
            return res.status(404).json({ message: "Promocode not found" });
        }
        res.status(200).json({ message: "Promocode Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete promocode", error: error.message });
    }
};
