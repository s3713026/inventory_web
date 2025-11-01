import React, { useEffect, useState } from "react";
import AddItemSection from "../components/AddItemSection";
import SetSection from "../components/SetSection";
import FilterSection from "../components/FilterSection";
import ItemList from "../components/ItemList";
import "./Home.css";

const GOOGLE_SHEETS_WEBAPP_URL = 
  // "https://script.google.com/macros/s/AKfycbymwHCRtzYDalsN49Bv5enNcyvbnSEl3WjuJ_O_eKc6EA1ZWgYLx6-q5MOThGJZtnQ/exec";
  "https://script.google.com/macros/s/AKfycbxLJBkKSW9Ynz_LDh2yneXkVaXpQZUSWeCt0doffFzA1doBe9DHP3ZLqnmDQCCCjPkK/exec";
  // "/gas";


export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [image, setImage] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterQty, setFilterQty] = useState("");
  const [filterZero, setFilterZero] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showSet, setShowSet] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [setSize, setSetSize] = useState(3);
  const [toolType, setToolType] = useState("kim đan");
  const [colorSku, setColorSku] = useState("");
  const [setQtyInput, setSetQtyInput] = useState("1");

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      alert("❌ Lỗi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const pickImage = async () => {
    alert("⚠️ Tính năng chọn ảnh chưa hỗ trợ trên web.");
  };

  const updateQty = async (sku, delta) => {
    const payload = { action: "updateQty", sku, delta };
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    await loadItems();
  };

  const setExactQty = async (sku, qty) => {
    const payload = { action: "setQty", sku, qty };
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    await loadItems();
  };

  const addItem = async () => {
    if (!sku || !qty) return alert("⚠️ Thiếu thông tin SKU hoặc số lượng");
    const payload = { action: "add", sku, name, type, qty: parseInt(qty), image };
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    await loadItems();
    setSku("");
    setName("");
    setQty("");
    setType("");
    setImage(null);
  };

  const createSet = async () => {
    const n = parseInt(setQtyInput);
    const yarnQty = setSize * n;
    const toolSku = toolType === "kim đan" ? "KD3560" : "KMD6";
    await updateQty(colorSku, -yarnQty);
    await updateQty(toolSku, -n);
    await updateQty("TDH", -n);
    await updateQty("KKN", -n);
    await updateQty("GDD", -n * 5);
    alert(`✅ Tạo set thành công!\nĐã trừ ${yarnQty} len và ${n} ${toolType}`);
  };

  const restockSet = async () => {
    const n = parseInt(setQtyInput);
    const yarnQty = setSize * n;
    const toolSku = toolType === "kim đan" ? "KD3560" : "KMD6";
    await updateQty(colorSku, yarnQty);
    await updateQty(toolSku, n);
    await updateQty("TDH", n);
    await updateQty("KKN", n);
    await updateQty("GDD", n * 5);
    alert(`✅ Bơm hàng thành công!\nĐã cộng ${yarnQty} len và ${n} ${toolType}`);
  };

  const filteredItems = items.filter((i) => {
    const nameOk = filterName ? i.name?.toLowerCase().includes(filterName.toLowerCase()) : true;
    const typeOk = filterType ? i.type?.toLowerCase().includes(filterType.toLowerCase()) : true;
    const qtyOk = filterQty ? i.qty <= parseInt(filterQty) : true;
    const zeroOk = filterZero ? i.qty === 0 : true;
    return nameOk && typeOk && qtyOk && zeroOk;
  });

  return (
    <div className="home-container">
      {/* Thanh nút chính */}
      <div className="button-row">
        <button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "🔽 Ẩn thêm hàng" : "➕ Thêm hàng"}
        </button>
        <button onClick={() => setShowSet(!showSet)}>
          {showSet ? "🔽 Ẩn set" : "🎁 Tạo set"}
        </button>
        <button onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? "🔽 Ẩn lọc" : "🔍 Bộ lọc"}
        </button>
      </div>

      {/* 3 phần mở rộng */}
      {showAdd && (
        <AddItemSection
          sku={sku}
          name={name}
          type={type}
          qty={qty}
          image={image}
          loading={loading}
          setSku={setSku}
          setName={setName}
          setType={setType}
          setQty={setQty}
          pickImage={pickImage}
          addItem={addItem}
          loadItems={loadItems}
        />
      )}

      {showSet && (
        <SetSection
          setSize={setSize}
          toolType={toolType}
          colorSku={colorSku}
          setQtyInput={setQtyInput}
          loading={loading}
          setSetSize={setSetSize}
          setToolType={setToolType}
          setColorSku={setColorSku}
          setSetQtyInput={setSetQtyInput}
          createSet={createSet}
          restockSet={restockSet}
        />
      )}

      {showFilter && (
        <FilterSection
          filterName={filterName}
          filterType={filterType}
          filterQty={filterQty}
          filterZero={filterZero}
          setFilterName={setFilterName}
          setFilterType={setFilterType}
          setFilterQty={setFilterQty}
          setFilterZero={setFilterZero}
        />
      )}

      {/* Danh sách hàng */}
      <ItemList
        items={filteredItems}
        loading={loading}
        onRefresh={loadItems}
        updateQty={updateQty}
        setExactQty={setExactQty}
      />
    </div>
  );
}


