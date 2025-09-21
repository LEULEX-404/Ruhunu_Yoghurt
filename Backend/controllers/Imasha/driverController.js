import Driver from '../../models/Tharuka/Driver.js';

export const getDriverById = async (req, res) =>{
    try{
        const { id } = req.params;
        const driver = await Driver.findById(id);

        if(!driver){
            return res.status(404).json({message : "Driver not found "});
        }

        res.status(200).json(driver);
    }
    catch(err){
        res.status(500).json({message: "Error fetching Driver", error: err.message});
    }
}