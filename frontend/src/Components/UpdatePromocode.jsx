import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function UpdatePromocode({ editingPromo, fetchPromocodes, cancelEdit }) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingPromo) {
      setCode(editingPromo.code);
      setDiscountType(editingPromo.discountType);
      setDiscountValue(editingPromo.discountValue);
      setExpiryDate(editingPromo.expiryDate.split("T")[0]);
      setUsageLimit(editingPromo.usageLimit);
    }
  }, [editingPromo]);

   const validateForm = () => {
      if (!code.trim() || code.length < 3) {
        toast.error("Code must be at least 3 characters long.");
        return false;
      }
      if (!discountValue || Number(discountValue) <= 0) {
        toast.error("Discount value must be greater than 0.");
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
      if (!usageLimit || Number(usageLimit) < 1) {
        toast.error("Usage limit must be at least 1.");
        return false;
      }
      return true;
    };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const promoData = { code, discountType, discountValue: Number(discountValue), expiryDate, usageLimit: Number(usageLimit) };

    try {
      const res = await fetch(`http://localhost:8070/api/promocode/update/${editingPromo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Promocode updated successfully!");
        fetchPromocodes();
        cancelEdit();
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (!editingPromo) return null;

  return (
    
    <form onSubmit={handleUpdate}>
      <div className="update-promo">
      <h2>Update Promocode</h2>
      <label>Code</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
      <label>Discount Type</label>
      <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed</option>
      </select>
      <label>Discount Value</label>
        <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required />
      <label>Expiry Date</label>
        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
      <label>Usage Limit</label>
        <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
      <div className="btn-row">
        <button type="submit">Update Promocode</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </div>
      {message && <p className="message">{message}</p>}
      </div>
    </form>
  );
}

export default UpdatePromocode;
