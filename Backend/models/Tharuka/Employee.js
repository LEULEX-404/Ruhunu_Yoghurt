import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    position: {
      type: String,
      enum: [
        "Unassigned",
        "HR Manager",
        "Delivery Manager",
        "Product Manager",
        "Stock Manager",
        "Order Manager",
        "Driver",
        "Staff",
      ],
      default: "Unassigned",
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

function getPrefix(position) {
  switch (position) {
    case "Driver":
      return "D";
    default:
      return "EM";
  }
}

employeeSchema.pre("save", async function (next) {
  if (this.isNew && !this.employeeID) {
    const prefix = getPrefix(this.position);

    const employees = await mongoose.models.Employee.find({
      employeeID: { $regex: `^${prefix}\\d+$` },
    }).select("employeeID");

    let maxNumber = 0;
    employees.forEach((emp) => {
      const numPart = parseInt(emp.employeeID.replace(prefix, ""), 10);
      if (!isNaN(numPart) && numPart > maxNumber) {
        maxNumber = numPart;
      }
    });

    const nextNumber = maxNumber + 1;
    this.employeeID = `${prefix}${nextNumber.toString().padStart(2, "0")}`;
  }

  next();
});

export default mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);
