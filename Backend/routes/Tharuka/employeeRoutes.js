import express from "express";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "../controllers/Tharuka/employeeController.js";

const router= express.Router();

router.post("/add",createEmployee);
router.get("/",getEmployees);
router.put("/update/:id",updateEmployee);
router.delete("/delete/:id",deleteEmployee);

export default router;