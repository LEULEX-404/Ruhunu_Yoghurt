import React from "react";
import { FiEdit, FiTrash2, FiTag } from "react-icons/fi";

function PromocodeList({ promocodes, fetchPromocodes, setEditingPromo }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this promocode?")) {
      await fetch(`http://localhost:8070/api/promocode/delete/${id}`, { method: "DELETE" });
      fetchPromocodes();
    }
  };

  return (
    <section className="promo-list-card">
      <div className="promo-list-header">
        <FiTag className="promo-icon" />
        <h2>All Promocodes</h2>
      </div>

      <div className="promo-table-wrapper">
        <table className="promo-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Expiry</th>
              <th>Usage Limit</th>
              <th>Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promocodes.length > 0 ? (
              promocodes.map((promo) => (
                <tr key={promo._id}>
                  <td className="code-cell">{promo.code}</td>
                  <td>{promo.discountType}</td>
                  <td>
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `Rs. ${promo.discountValue}`}
                  </td>
                  <td>{new Date(promo.expiryDate).toLocaleDateString()}</td>
                  <td>{promo.usageLimit}</td>
                  <td>{promo.usedCount}</td>
                  <td>
                    <div className="btn-row">
                      <button
                        className="btn-small"
                        onClick={() => setEditingPromo(promo)}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        className="btn-small danger"
                        onClick={() => handleDelete(promo._id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-message">
                  No promocodes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PromocodeList;
