import Employee from '../../models/Tharuka/Employee.js';

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
        const { name, email, position, phone } = req.body;

        const updatEmployee = await Employee.findByIdAndUpdate(
            id,
            { name, email, position, phone },
            { new: true }
        );

        if(!updatEmployee){
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee: updatEmployee });
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
    if(req.employee == null){
        return false;
    }
    
    if(req.employee.position == "Product Manager" || req.employee.position == "Stock Manager") {
        return true;
    }
    
    return false;
};