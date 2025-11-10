import React, { useEffect, useState } from "react";
import AddItemSection from "../components/AddItemSection";
import SetSection from "../components/SetSection";
import FilterSection from "../components/FilterSection";
import ItemList from "../components/ItemList";
import "./Home.css";

const GOOGLE_SHEETS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbymwHCRtzYDalsN49Bv5enNcyvbnSEl3WjuJ_O_eKc6EA1ZWgYLx6-q5MOThGJZtnQ/exec";
// "https://script.google.com/macros/s/AKfycbxLJBkKSW9Ynz_LDh2yneXkVaXpQZUSWeCt0doffFzA1doBe9DHP3ZLqnmDQCCCjPkK/exec";

// key cho localStorage
const LS_ITEMS = "inventory_items";
const LS_OPS = "inventory_pending_ops";

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
  const [toolType, setToolType] = useState("kim móc ");
  const [colorSku, setColorSku] = useState("");
  const [setQtyInput, setSetQtyInput] = useState("1");

  // dirty flag dựa trên pending ops
  const [pendingOpsCount, setPendingOpsCount] = useState(0);

  // state cho khung code JS lọc
  const [filteredType, setFilteredType] = useState("");

  // Demo gen code JS từ dữ liệu đã lọc cách thủ công
  // const generateFilteredJson = (typeName) => {
  //   const filteredItems = items.filter(item => {
  //     if (typeName === "Len Cotton Love") return item.name.toLowerCase().includes("len cotton love");
  //     if (typeName === "Len Yaoh Wool") return item.name.toLowerCase().includes("len yaoh wool");
  //     if (typeName === "Kim đan") return item.name.toLowerCase().includes("kim đan");
  //     if (typeName === "Kim móc") return item.name.toLowerCase().includes("kim móc");
  //     return false;
  //   });
  
  //   // Tạo array dữ liệu chuẩn
  //   const jsonData = filteredItems.map(item => {
  //     if (typeName.startsWith("Len")) {
  //       const colorMatch = item.name.match(/màu (\d+)/i);
  //       return { màu: colorMatch ? colorMatch[1] : "unknown", qty: Number(item.qty || 0) };
  //     } else if (typeName === "Kim đan") {
  //       const sizeMatch = item.name.match(/(\d+cm)\s*(\d+\.\d+mm)/i);
  //       return { loại: sizeMatch ? `[${sizeMatch[1]}] ${sizeMatch[2]}` : item.name, qty: Number(item.qty || 0) };
  //     } else if (typeName === "Kim móc") {
  //       const hookMatch = item.name.match(/(\d+(\.\d+)?mm)/i);
  //       return { loại: hookMatch ? hookMatch[1] : item.name, qty: Number(item.qty || 0) };
  //     }
  //     return {};
  //   });
  
  //   // Sinh code JS để cập nhật DOM
  //   const codeLines = jsonData.map(entry => {
  //     const prefix = entry.màu || entry.loại;
  //     const newQty = entry.qty;
  //     return `
  // document.querySelectorAll("p.flex").forEach(p => {
  //   const text = p.textContent.trim();
  //   if (text.startsWith("${prefix}")) {
  //     const tr = p.closest("tr");
  //     if (tr) {
  //       const qtyInput = Array.from(tr.querySelectorAll('input.core-input.core-input-size-default'))
  //         .find(input => input.hasAttribute('aria-valuenow') && parseInt(input.getAttribute('aria-valuenow')) < 1000);
  //       if (qtyInput) {
  //         const currentQty = parseInt(qtyInput.value) || 0;
  //         qtyInput.value = ${newQty};
  //         qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
  //         qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
  //         console.log(\`Row "\${text}" updated: \${currentQty} → ${newQty}\`);
  //       }
  //     }
  //   }
  // });`;
  //   });
  
  //   setGeneratedCode(codeLines.join("\n\n"));
  //   setFilteredType(typeName);
  // };
  
  // Generate code JS tối ưu hơn với 1 loop duy nhất
  const generateFilteredJson = (typeName) => {
    // Lọc items theo loại
    const filteredItems = items.filter(item => {
      if (typeName === "Len Cotton Love") return item.name.toLowerCase().includes("len cotton love");
      if (typeName === "Len Yaoh Wool") return item.name.toLowerCase().includes("len yaoh wool");
      if (typeName === "Kim đan") return item.name.toLowerCase().includes("kim đan");
      if (typeName === "Kim móc") return item.name.toLowerCase().includes("kim móc");
      return false;
    });
  
    // Chuyển items thành JSON chuẩn
    const jsonData = filteredItems.map(item => {
      if (typeName.startsWith("Len")) {
        const colorMatch = item.name.match(/màu (\d+)/i);
        return { prefix: colorMatch ? colorMatch[1] : "unknown", qty: Number(item.qty || 0) };
      } else if (typeName === "Kim đan") {
        const sizeMatch = item.name.match(/(\d+cm)\s*(\d+\.\d+mm)/i);
        return { prefix: sizeMatch ? `[${sizeMatch[1]}] ${sizeMatch[2]}` : item.name, qty: Number(item.qty || 0) };
      } else if (typeName === "Kim móc") {
        const hookMatch = item.name.match(/(\d+(\.\d+)?mm)/i);
        return { prefix: hookMatch ? hookMatch[1] : item.name, qty: Number(item.qty || 0) };
      }
      return {};
    });
  
    // Sinh code JS gọn: 1 loop duy nhất đọc JSON
    const code = `
  const data = ${JSON.stringify(jsonData, null, 2)};
  
  data.forEach(entry => {
    document.querySelectorAll("p.flex").forEach(p => {
      if (p.textContent.trim().startsWith(entry.prefix)) {
        const tr = p.closest("tr");
        if (tr) {
          const qtyInput = Array.from(tr.querySelectorAll('input.core-input.core-input-size-default'))
            .find(input => input.hasAttribute('aria-valuenow') && parseInt(input.getAttribute('aria-valuenow')) < 1000);
          if (qtyInput) {
            const currentQty = parseInt(qtyInput.value) || 0;
            qtyInput.value = entry.qty;
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
            qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(\`Row "\${p.textContent.trim()}" updated: \${currentQty} → \${entry.qty}\`);
          }
        }
      }
    });
  });
  `;
  
    setGeneratedCode(code);
    setFilteredType(typeName);
  };
  

  // state quản lý khung code JS
  const [showJsCode, setShowJsCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("// JS code sẽ hiển thị ở đây\nconsole.log('Hello world');");

  // copy code function
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
      .then(() => alert("✅ Code đã được copy!"))
      .catch(() => alert("❌ Copy thất bại"));
  };



  // -----------------------
  // Helpers cho localStorage
  // -----------------------
  const readLocalItems = () => {
    try {
      const raw = localStorage.getItem(LS_ITEMS);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Parse local items failed", err);
      return [];
    }
  };
  const writeLocalItems = (arr) => {
    localStorage.setItem(LS_ITEMS, JSON.stringify(arr));
    setPendingOpsCount(readPendingOps().length);
  };

  const readPendingOps = () => {
    try {
      const raw = localStorage.getItem(LS_OPS);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Parse pending ops failed", err);
      return [];
    }
  };
  const writePendingOps = (ops) => {
    localStorage.setItem(LS_OPS, JSON.stringify(ops));
    setPendingOpsCount(ops.length);
  };
  const pushPendingOp = (op) => {
    const ops = readPendingOps();
    ops.push(op);
    writePendingOps(ops);
  };

  // -----------------------
  // Load từ server (GET)
  // -----------------------
  const loadItemsFromServer = async () => {
    try {
      setLoading(true);
      const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL);
      const data = await res.json();
      setItems(data);
      localStorage.setItem(LS_ITEMS, JSON.stringify(data));
      // Khi vừa load từ server, xóa pending ops nếu bạn muốn đảm bảo clean state?
      // Nhưng chúng ta chỉ xóa pending ops khi sync thành công. Không xóa ở đây.
    } catch (err) {
      alert("❌ Lỗi tải dữ liệu: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Hàm gọi server (GET) - tận dụng API hiện có
  // Sửa nhẹ để có thể skip loadItems giữa các op (skipReload)
  // -----------------------
  const updateQtyServer = async (skuParam, deltaParam, skipReload = true) => {
    try {
      const params = new URLSearchParams({
        action: "updateQty",
        sku: skuParam,
        delta: deltaParam,
      });
      const res = await fetch(`${GOOGLE_SHEETS_WEBAPP_URL}?${params.toString()}`);
      const data = await res.json();
      console.log("UpdateQty response:", data);
      if (!skipReload) {
        await loadItemsFromServer();
      }
      return { ok: true, data };
    } catch (err) {
      console.error("❌ updateQty failed:", err);
      return { ok: false, err };
    }
  };

  const setExactQtyServer = async (skuParam, qtyParam, skipReload = true) => {
    try {
      const params = new URLSearchParams({
        action: "setQty",
        sku: skuParam,
        qty: qtyParam,
      });
      const res = await fetch(`${GOOGLE_SHEETS_WEBAPP_URL}?${params.toString()}`);
      const data = await res.json();
      console.log("SetExactQty response:", data);
      if (!skipReload) {
        await loadItemsFromServer();
      }
      return { ok: true, data };
    } catch (err) {
      console.error("❌ setExactQty failed:", err);
      return { ok: false, err };
    }
  };

  const addItemServer = async (payloadObj, skipReload = true) => {
    try {
      const params = new URLSearchParams({
        action: "add",
        sku: payloadObj.sku,
        name: payloadObj.name || "",
        type: payloadObj.type || "",
        qty: parseInt(payloadObj.qty || 0, 10),
        image: payloadObj.image || "",
      });
      const res = await fetch(`${GOOGLE_SHEETS_WEBAPP_URL}?${params.toString()}`);
      const data = await res.json();
      console.log("Add response:", data);
      if (!skipReload) {
        await loadItemsFromServer();
      }
      return { ok: true, data };
    } catch (err) {
      console.error("❌ addItem failed:", err);
      return { ok: false, err };
    }
  };

  // -----------------------
  // Sync: replay pending ops one-by-one
  // Nếu op thành công thì remove nó, tiếp tục. Nếu fail -> dừng.
  // -----------------------
  const syncToServer = async () => {
    const ops = readPendingOps();
    if (!ops.length) {
      alert("☁️ Không có tác vụ cần đồng bộ.");
      return;
    }

    if (!window.confirm(`🔁 Đồng bộ ${ops.length} tác vụ lên server bây giờ?`)) return;

    let remaining = [...ops];

    try {
      // loop tuần tự
      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        console.log("Sync op:", op);

        let res;
        if (op.action === "updateQty") {
          res = await updateQtyServer(op.sku, op.delta, true);
        } else if (op.action === "setQty") {
          res = await setExactQtyServer(op.sku, op.qty, true);
        } else if (op.action === "add") {
          res = await addItemServer(op.payload || op, true);
        } else {
          // unknown op - skip it (or remove)
          console.warn("Unknown op:", op);
          res = { ok: true };
        }

        if (res.ok) {
          // remove first op
          remaining.shift();
          writePendingOps(remaining);
        } else {
          // stop on first failure, keep remaining in queue
          alert("❌ Lỗi khi đồng bộ: " + (res.err?.message || res.err));
          console.error("Sync failed for op:", op, res.err);
          return;
        }
      }

      // nếu tất cả ok -> làm reload dữ liệu thật từ server
      await loadItemsFromServer();
      alert("✅ Đồng bộ thành công tất cả tác vụ!");
    } catch (err) {
      console.error("Sync process error:", err);
      alert("❌ Lỗi đồng bộ: " + (err.message || err));
    }
  };

  // -----------------------
  // Cập nhật local và push op
  // Các hàm này chỉ tác động local, thêm op vào queue để sync sau
  // -----------------------
  const updateLocalQty = (skuParam, deltaParam) => {
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.sku === skuParam
          ? { ...i, qty: Number(i.qty || 0) + Number(deltaParam || 0) }
          : i
      );
      writeLocalItems(updated);
      return updated;
    });

    // push op (dùng chính API updateQty)
    pushPendingOp({ action: "updateQty", sku: skuParam, delta: deltaParam });
  };

  const setExactLocalQty = (skuParam, qtyParam) => {
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.sku === skuParam ? { ...i, qty: Number(qtyParam) } : i
      );
      writeLocalItems(updated);
      return updated;
    });

    pushPendingOp({ action: "setQty", sku: skuParam, qty: qtyParam });
  };

  const addLocalItem = () => {
    const newItem = { sku, name, type, qty: parseInt(qty || "0", 10), image };
    setItems((prev) => {
      const updated = [...prev, newItem];
      writeLocalItems(updated);
      return updated;
    });

    // push add op: store payload under payload key
    pushPendingOp({ action: "add", payload: newItem });

    // reset form
    setSku("");
    setName("");
    setQty("");
    setType("");
    setImage(null);
  };

  // -----------------------
  // HÀM GỐC DÙNG CHO GIAO DIỆN / COMPONENTS
  // chúng ta expose hai dạng:
  // - updateQty, setExactQty, addItem: local-first (enqueue)
  // - updateQtyServer...: internal gọi server (đã định nghĩa trên)
  // -----------------------
  const pickImage = async () => {
    alert("⚠️ Tính năng chọn ảnh chưa hỗ trợ trên web.");
  };

  // Làm wrapper để component gọi — cập nhật local + queue
  const updateQty = async (skuParam, deltaParam) => {
    updateLocalQty(skuParam, deltaParam);
  };

  const setExactQty = async (skuParam, qtyParam) => {
    setExactLocalQty(skuParam, qtyParam);
  };

  const addItem = async () => {
    if (!sku || !qty) return alert("⚠️ Thiếu thông tin SKU hoặc số lượng");
    addLocalItem();
    alert("✅ Đã thêm sản phẩm (lưu vào local, chờ đồng bộ).");
  };

  // -----------------------
  // Set / Restock thao tác local + op queue
  // -----------------------
  const createSet = async () => {
    const n = parseInt(setQtyInput || "0", 10);
    const yarnQty = setSize * n;
    let toolSku = "";
    if (toolType === "kim móc") toolSku = "KMD60";
    else if (toolType === "Kim đan 25cm 5.5mm") toolSku = "KD2555";
    else if (toolType === "Kim đan 25cm 6.0mm") toolSku = "KD2560";
    else if (toolType === "Kim đan 35cm 5.5mm") toolSku = "KD3555";
    else if (toolType === "Kim đan 35cm 6.0mm") toolSku = "KD3560";

    // Thao tác local
    updateLocalQty(colorSku, -yarnQty);
    updateLocalQty(toolSku, -n);
    updateLocalQty("TDH", -n);
    updateLocalQty("KKN", -n);
    updateLocalQty("GDD", -n * 5);

    alert(`✅ Tạo set thành công (ghi vào local, chờ đồng bộ).`);
  };

  const restockSet = async () => {
    const n = parseInt(setQtyInput || "0", 10);
    const yarnQty = setSize * n;
    let toolSku = "";
    if (toolType === "kim móc") toolSku = "KMD60";
    else if (toolType === "Kim đan 25cm 5.5mm") toolSku = "KD2555";
    else if (toolType === "Kim đan 25cm 6.0mm") toolSku = "KD2560";
    else if (toolType === "Kim đan 35cm 5.5mm") toolSku = "KD3555";
    else if (toolType === "Kim đan 35cm 6.0mm") toolSku = "KD3560";

    updateLocalQty(colorSku, yarnQty);
    updateLocalQty(toolSku, n);
    updateLocalQty("TDH", n);
    updateLocalQty("KKN", n);
    updateLocalQty("GDD", n * 5);

    alert(`✅ Bơm hàng thành công (ghi vào local, chờ đồng bộ).`);
  };

  // -----------------------
  // Auto sync mỗi 5 phút nếu có pending ops
  // -----------------------
  useEffect(() => {
    // ensure pendingOpsCount is initialised
    setPendingOpsCount(readPendingOps().length);

    // const interval = setInterval(() => {
    //   const ops = readPendingOps();
    //   if (ops && ops.length > 0) {
    //     // call sync silently (no confirm) — but we keep try/catch inside
    //     (async () => {
    //       console.log("Auto-sync triggered, ops:", ops.length);
    //       await syncToServer();
    //     })();
    //   }
    // }, 5 * 60 * 1000);

    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------
  // Filtered items
  // -----------------------
  const filteredItems = items.filter((i) => {
    const nameOk = filterName
      ? typeof i.name === "string" && i.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    const typeOk = filterType
      ? typeof i.type === "string" && i.type.toLowerCase().includes(filterType.toLowerCase())
      : true;
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

        <button onClick={syncToServer}>☁️ Đồng bộ thủ công ({pendingOpsCount})</button>
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
          onAdd={addItem}
          loadItems={loadItemsFromServer}
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

      {/* Nút mở khung JS code ngay dưới mục thêm hàng */}
      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setShowJsCode(!showJsCode)}>
          {showJsCode ? "🔽 Ẩn JS code" : "💻 Mở JS code"}
        </button>

        {showJsCode && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <button onClick={() => generateFilteredJson("Len Cotton Love")}>Len Cotton Love</button>
              <button onClick={() => generateFilteredJson("Len Yaoh Wool")}>Len Yaoh Wool</button>
              <button onClick={() => generateFilteredJson("Kim đan")}>Kim đan</button>
              <button onClick={() => generateFilteredJson("Kim móc")}>Kim móc</button>
            </div>
            <div>
              <textarea
                readOnly
                value={generatedCode}
                style={{ width: "100%", height: "200px", fontFamily: "monospace" }}
                placeholder="JSON code sẽ hiển thị ở đây..."
              />
            </div>
            <button onClick={copyCodeToClipboard} disabled={!generatedCode}>Copy code</button>
          </div>
        )}
      </div>


      <ItemList
        items={filteredItems}
        loading={loading}
        onRefresh={loadItemsFromServer}
        updateQty={updateQty}
        setExactQty={setExactQty}
      />
    </div>
  );
}
