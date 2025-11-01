import React, { useState } from "react";
import "./SetSection.css"; // (tạo file css riêng để style gọn hơn)

export default function SetSection({
    setSize,
    toolType,
    colorSku,
    setQtyInput,
    loading,
    setSetSize,
    setToolType,
    setColorSku,
    setSetQtyInput,
    createSet,
    restockSet,
}) {

    const selectKim = (type) => {
        setToolType(type);
        if (type === "kim đan") {
            setShowKim(true);
        } else {
            setShowKim(false);
        }
    }

    const [showKim, setShowKim] = useState(false);

    return (
        <div className="set-box">
            <h3>🧶 Tạo hoặc bom hàng theo set</h3>

            <label>Chọn số cuộn:</label>
            <div className="row">
                {[3, 4, 5].map((n) => (
                    <button
                        key={n}
                        className={`choice ${setSize === n ? "selected" : ""}`}
                        onClick={() => setSetSize(n)}
                    >
                        {n} cuộn
                    </button>
                ))}
            </div>

            <label>Chọn loại dụng cụ:</label>
            <div className="row">
                {["kim đan", "kim móc"].map((t) => (
                    <button
                        key={t}
                        className={`choice ${toolType === t ? "selected" : ""}`}
                        onClick={() => selectKim(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
            {showKim && (
                <>
                <label>Chọn loại kim đan:</label>
                <div className="row">
                  {["Kim đan 25cm 5.5mm", "Kim đan 25cm 6.0mm", "Kim đan 35cm 5.5mm", "Kim đan 35cm 6.0mm"].map((t, i) => (
                    <div key={t} className="radio-item">
                      <input
                        type="radio"
                        id={`kim-${i}`}
                        name="kimType"
                        value={t}
                        checked={toolType === t}
                        onChange={() => setToolType(t)}
                      />
                      <label htmlFor={`kim-${i}`}>{t}</label>
                    </div>
                  ))}
                </div>
              </>
            )}
            <input
                type="text"
                placeholder="SKU màu (VD: YARN-A01)"
                value={colorSku}
                onChange={(e) => setColorSku(e.target.value)}
            />
            <input
                type="number"
                placeholder="Số lượng set"
                value={setQtyInput}
                onChange={(e) => setSetQtyInput(e.target.value)}
            />

            <div className="row">
                <button onClick={createSet} disabled={loading}>
                    🎁 Tạo set (trừ hàng)
                </button>
                <button onClick={restockSet} disabled={loading}>
                    📦 Bom hàng (cộng hàng)
                </button>
            </div>
        </div>
    );
}
