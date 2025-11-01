import React from "react";

export default function AddItemSection({
  sku,
  name,
  type,
  qty,
  setSku,
  setName,
  setType,
  setQty,
  image,
  loading,
  pickImage,
  onAdd,
  loadItems
}) {
  return (
    <div className="box">
      <h2>➕ Thêm hàng</h2>

      <input
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <input
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Loại hàng"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số lượng"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <div className="row">
        <button onClick={onAdd} disabled={loading}>
          ✅ Lưu hàng
        </button>
        <button onClick={loadItems}>☁️ Làm mới</button>
      </div>
    </div>
  );
}
