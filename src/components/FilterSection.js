import React from "react";
import "./FilterSection.css"; // tuỳ chọn nếu muốn style riêng

export default function FilterSection({
  filterName, filterType, filterQty, filterZero,
  setFilterName, setFilterType, setFilterQty, setFilterZero
}) {
  return (
    <div className="filter-box">
      <h3>🔍 Bộ lọc:</h3>

      <input
        className="input"
        type="text"
        placeholder="Lọc theo tên sản phẩm"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />
      <input
        className="input"
        type="text"
        placeholder="Lọc theo loại hàng"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      />
      <input
        className="input"
        type="number"
        placeholder="Lọc theo số lượng nhỏ hơn"
        value={filterQty}
        onChange={(e) => setFilterQty(e.target.value)}
      />

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={filterZero}
          onChange={(e) => setFilterZero(!filterZero)}
        />
        <span>Chỉ hiển thị hàng hết (qty = 0)</span>
      </label>
    </div>
  );
}
