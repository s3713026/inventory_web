import React, { useState } from "react";
import "./ItemList.css"; // Tùy chọn: để styling riêng

export default function ItemList({ items, loading, onRefresh, updateQty, setExactQty }) {
  const [editingSku, setEditingSku] = useState(null);
  const [newQty, setNewQty] = useState("");
  const [qtyInputs, setQtyInputs] = useState({});

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="item-list">
      <div style={{ display: "flex" , justifyContent: "space-between", alignItems: "center" }}>
      <h2>📋 Danh sách hàng</h2>
      <button className="refresh-btn" onClick={onRefresh}>🔄 Làm mới</button>
      </div>
      {items.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        items.map((item) => (
          <div key={item.sku} className="item-row">
            <div className="item-actions">
              <button
                className="btn-plus"
                onClick={() =>
                  updateQty(item.sku, parseInt(qtyInputs[item.sku] || "1"))
                }
              >
                ＋
              </button>

              <input
                type="number"
                className="qty-input"
                value={qtyInputs[item.sku] || ""}
                placeholder="1"
                onChange={(e) =>
                  setQtyInputs((prev) => ({ ...prev, [item.sku]: e.target.value }))
                }
              />

              <button
                className="btn-minus"
                onClick={() =>
                  updateQty(item.sku, -parseInt(qtyInputs[item.sku] || "1"))
                }
              >
                －
              </button>
            </div>

            
            <div className="item-info">
              <strong className="item-name">{item.name}</strong>
              <div>SKU: {item.sku}</div>
              <div>Loại: {item.type || "—"}</div>

              {editingSku === item.sku ? (
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  onBlur={() => {
                    setExactQty(item.sku, parseInt(newQty));
                    setEditingSku(null);
                  }}
                  autoFocus
                  className="input-inline"
                />
              ) : (
                <span
                  className="qty-label"
                  onClick={() => {
                    setEditingSku(item.sku);
                    setNewQty(item.qty.toString());
                  }}
                >
                  Số lượng: {item.qty}
                </span>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

