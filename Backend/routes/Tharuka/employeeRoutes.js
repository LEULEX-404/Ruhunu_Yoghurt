import express from "express";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee, getSearchEmployee, getEmployeeById } from "../../controllers/Tharuka/employeeController.js";

const router= express.Router();

router.post("/add",createEmployee);
router.get("/search",getSearchEmployee);
router.get("/",getEmployees);
router.get("/:id",getEmployeeById);
router.put("/update/:id",updateEmployee);
router.delete("/delete/:id",deleteEmployee);

export default router;