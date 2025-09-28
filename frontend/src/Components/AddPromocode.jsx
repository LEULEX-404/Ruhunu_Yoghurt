import React, { useState } from "react";
import { toast } from "react-toastify";

function AddPromocodeModal({ fetchPromocodes, onClose }) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState(1);

  const validateForm = () => {
    if (!code.trim() || code.length < 3) {
      toast.error("Code must be at least 3 characters long.");
      return false;
    }
    if (!discountValue || Number(discountValue) <= 0 ) {
      toast.error("Discount value must be greater than 0 and less than 50.");
      return false;
    }


    if (discountType === 'percentage' && (Number(discountValue) <= 0 || Number(discountValue) > 50)) {
      toast.error("Percentage discount must be between 1 and 50.");
      return false;
    }

    if (discountType === 'fixed' && (Number(discountValue) <= 0 || Number(discountValue) > 1500)) {
      toast.error("Fixed discount must be between 1 and 1500.");
      return false;
    }

    if (!expiryDate) {
      toast.error("Please select an expiry date.");
      return false;
    }
    const today = new Date();
    const selectedDate = new Date(expiryDate);
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Expiry date cannot be in the past.");
      return false;
    }
    if (!usageLimit || Number(usageLimit) < 1 || Number(usageLimit) > 100) {
      toast.error("Usage limit must be more than 1 and less than 100");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const promoData = {
      code,
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      usageLimit: Number(usageLimit),
    };

    try {
      const res = await fetch("http://localhost:8070/api/promocode/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Promocode "${data.promo.code}" added successfully!`);
        setCode("");
        setDiscountValue("");
        setExpiryDate("");
        setUsageLimit(1);
        setDiscountType("percentage");
        fetchPromocodes();
        onClose();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="promo-update-modal-overlay">
      <div className="promo-update-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <form className="update-promo" onSubmit={handleSubmit}>
          <h2>Add Promocode</h2>

          <label>Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SUMMER23"
          />

          <label>Discount Type</label>
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <label>Discount Value</label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="e.g. 10"
          />

          <label>Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />

          <label>Usage Limit</label>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="e.g. 100"
          />

          <div className="btn-row">
            <button type="submit" className="btn-primary">Add Promocode</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPromocodeModal;
