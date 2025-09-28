import Employee from '../../models/Tharuka/Employee.js';
import Driver from '../../models/Tharuka/Driver.js';

export const createEmployee = async (req, res) => {
    try{
        const { employeeID, name, email, position, phone, password } = req.body;

        const newEmployee = new Employee({
            employeeID,
            name,
            email,
            position,
            phone,
            password
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

export const getEmployees = async (req, res) =>{
    try{
        const employees = await Employee.find();
        res.status(200).json(employees);

    }catch(error){
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try{
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if(!employee){
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);

    }catch(error){
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    try{
        const { id } = req.params;
        const { employeeID, name, email, position, phone, vehicleCapacity } = req.body;

        const updatEmployee = await Employee.findByIdAndUpdate(
            id,
            { employeeID, name, email, position, phone },
            { new: true }
        );

        if(!updatEmployee){
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (position === "Driver") {
          const existingDriver = await Driver.findOne({ driverID: updatEmployee._id });

          if (!existingDriver) {

            const newDriver = new Driver({
              driverID: updatEmployee._id,
              employeeID: updatEmployee.employeeID,
              name: updatEmployee.name,
              email: updatEmployee.email,
              phone: updatEmployee.phone,
              vehicleCapacity: Number(vehicleCapacity)
            });


            await newDriver.save();

          }else {

            existingDriver.employeeID = updatEmployee.employeeID;
            existingDriver.name = updatEmployee.name;
            existingDriver.email = updatEmployee.email;
            existingDriver.phone = updatEmployee.phone;
            existingDriver.vehicleCapacity = Number(vehicleCapacity);

            await existingDriver.save();
          }

        } else {

          await Driver.findOneAndDelete({ employeeID: updatEmployee.employeeID });

        }

        res.status(200).json({ message: 'Employee updated successfully', employee: updatEmployee,employeeID: updatEmployee.employeeID });

    }catch(error){
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try{
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if(!deletedEmployee){
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    
    if(req.user.role == "Product Manager" || req.user.role == "Stock Manager") {
        return true;
    }
    
    return false;
};

export const getSearchEmployee =async (req, res) =>{

        const search = req.query.search || "";

        console.log('search',search);

        let query = { };

        if(search){
            query.$or = [
                {employeeID: {$regex: search, $options: "i"}},
                {name: {$regex: search, $options: "i"}},
                {position: {$regex: search, $options: "i"}}
            ]
        };
    try{
        const employees = await Employee.find(query).select(
            "employeeID name email position phone"
        );

        res.json(employees);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};