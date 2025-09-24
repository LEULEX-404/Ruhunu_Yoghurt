import User from '../../models/Tharuka/User.js';

export const updateUser = async (req, res) =>{

    try{
        const { id } = req.params;
        const { name, email, address } = req.body;

        const updateUser = await User.findByIdAndUpdate(
            id,
            { name, email, address },
            { new: true}
        )

        if(!updateUser){
            return res.status(404).json({ message: 'User not found'});
        }

        await updateUser.save();

        res.status(200).json({ message: 'User Updated Successfully'});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error'})
    }
};