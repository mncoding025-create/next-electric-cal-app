"use client";

import { useState } from "react";

const FT_RATE = 0.3972;
const VAT_RATE = 0.07;

type Tier = {
  label: string;
  rate: number;
  units: number;
};

function calculateBill(units: number) {
  const tiers: Tier[] = [
    { label: "0 - 150 หน่วย", rate: 3.2484, units: Math.min(units, 150) },
    {
      label: "151 - 400 หน่วย",
      rate: 4.2218,
      units: Math.max(0, Math.min(units - 150, 250)),
    },
    { label: "มากกว่า 400 หน่วย", rate: 4.4217, units: Math.max(0, units - 400) },
  ];
  const baseCharge = tiers.reduce((total, tier) => total + tier.units * tier.rate, 0);
  const ftCharge = units * FT_RATE;
  const beforeVat = baseCharge + ftCharge;
  const vat = beforeVat * VAT_RATE;

  return { tiers, baseCharge, ftCharge, beforeVat, vat, total: beforeVat + vat };
}

const money = (value: number) =>
  value.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Home() {
  const [unitsInput, setUnitsInput] = useState("0");
  const [customerType, setCustomerType] = useState("บ้านอยู่อาศัย ประเภท 1.2");
  const units = Math.max(0, Number(unitsInput) || 0);
  const bill = calculateBill(units);

  return (
    <main className="grid-bg min-h-screen px-5 py-6 text-slate-100 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300/40 bg-amber-300/10 text-lg text-amber-200">⚡</span>
              Energy / Grid 01
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              ค่าไฟฟ้า<span className="text-amber-300">รายเดือน</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              ประมาณการค่าใช้ไฟด้วยอัตราขั้นบันไดบ้านอยู่อาศัย พร้อมแยกค่า Ft และ VAT อย่างชัดเจน
            </p>
          </div>
          <div className="hidden border-l border-cyan-300/30 pl-4 text-right text-xs text-slate-500 sm:block">
            <p className="font-mono text-cyan-300">LIVE CALCULATION</p>
            <p className="mt-2">อัตราจำลอง ปี 2567</p>
          </div>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,0.8fr)_minmax(420px,1.2fr)] lg:gap-16">
          <section className="pt-1">
            <div className="mb-8 flex items-center gap-3">
              <span className="font-mono text-xs text-cyan-300">01</span>
              <h2 className="text-lg font-medium text-white">ข้อมูลการใช้ไฟ</h2>
              <span className="h-px flex-1 bg-slate-700" />
            </div>
            <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
              <label className="block">
                <span className="mb-3 block text-sm text-slate-300">หน่วยไฟฟ้าที่ใช้</span>
                <div className="relative">
                  <input
                    aria-label="หน่วยไฟฟ้าที่ใช้"
                    className="input-field w-full pr-20 font-mono text-3xl font-medium text-white"
                    min="0"
                    onChange={(event) => setUnitsInput(event.target.value)}
                    type="number"
                    value={unitsInput}
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500">kWh</span>
                </div>
                <span className="mt-2 block text-xs text-slate-500">ใส่จำนวนหน่วยตั้งแต่ 0 ขึ้นไป</span>
              </label>
              <label className="block">
                <span className="mb-3 block text-sm text-slate-300">ประเภทผู้ใช้ไฟ</span>
                <select
                  aria-label="ประเภทผู้ใช้ไฟ"
                  className="input-field w-full appearance-none text-sm text-white"
                  onChange={(event) => setCustomerType(event.target.value)}
                  value={customerType}
                >
                  <option>บ้านอยู่อาศัย ประเภท 1.2</option>
                  <option>กิจการขนาดเล็ก (จำลองอัตราบ้านอยู่อาศัย)</option>
                </select>
                <span className="mt-2 block text-xs text-slate-500">กำลังใช้ชุดอัตราจำลองสำหรับบ้านอยู่อาศัย</span>
              </label>
            </form>
            <div className="mt-12 border-t border-slate-800 pt-5 text-xs leading-6 text-slate-500">
              <p className="font-mono text-slate-400">RATE REFERENCE</p>
              <p className="mt-2">ค่า Ft คงที่ {FT_RATE.toFixed(4)} บาท/หน่วย · VAT {VAT_RATE * 100}%</p>
              <p>อัปเดตผลลัพธ์ทันทีที่เปลี่ยนข้อมูล</p>
            </div>
          </section>

          <section className="receipt-wrap" aria-label="สรุปค่าไฟฟ้า">
            <div className="receipt-card">
              <div className="flex items-start justify-between border-b border-dashed border-slate-600 pb-6">
                <div>
                  <p className="font-mono text-xs tracking-[0.18em] text-cyan-300">ELECTRICITY BILL</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">สรุปประมาณการ</h2>
                </div>
                <div className="text-right font-mono text-xs text-slate-500">
                  <p>PERIOD</p>
                  <p className="mt-1 text-slate-300">MONTHLY</p>
                </div>
              </div>

              <div className="total-glow border-b border-dashed border-slate-600 py-7">
                <p className="text-xs text-slate-400">ยอดรวมที่ต้องชำระ</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-semibold tracking-tight text-amber-200 sm:text-6xl">฿{money(bill.total)}</span>
                  <span className="text-sm text-slate-400">บาท</span>
                </div>
                <p className="mt-3 font-mono text-xs text-cyan-300">{units.toLocaleString("th-TH")} kWh · {customerType}</p>
              </div>

              <div className="border-b border-dashed border-slate-600 py-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">ค่าไฟฐานตามขั้น</h3>
                  <span className="font-mono text-xs text-slate-500">BASE RATE</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-700/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/70 text-slate-500">
                      <tr><th className="px-3 py-2 font-normal">ช่วง</th><th className="px-3 py-2 text-right font-normal">หน่วย</th><th className="px-3 py-2 text-right font-normal">เป็นเงิน</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bill.tiers.map((tier) => (
                        <tr key={tier.label} className="text-slate-300">
                          <td className="px-3 py-3">{tier.label}<span className="ml-2 text-[10px] text-slate-600">@ {tier.rate.toFixed(4)}</span></td>
                          <td className="px-3 py-3 text-right font-mono">{tier.units.toLocaleString("th-TH")}</td>
                          <td className="px-3 py-3 text-right font-mono text-white">฿{money(tier.units * tier.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4 py-6 text-sm">
                <div className="flex justify-between text-slate-400"><span>ค่าไฟฐาน</span><span className="font-mono text-slate-200">฿{money(bill.baseCharge)}</span></div>
                <div className="flex justify-between text-slate-400"><span>ค่า Ft <span className="text-xs text-slate-600">({FT_RATE.toFixed(4)} / หน่วย)</span></span><span className="font-mono text-slate-200">฿{money(bill.ftCharge)}</span></div>
                <div className="flex justify-between text-slate-400"><span>ค่าไฟก่อน VAT</span><span className="font-mono text-slate-200">฿{money(bill.beforeVat)}</span></div>
                <div className="flex justify-between text-slate-400"><span>VAT 7%</span><span className="font-mono text-slate-200">฿{money(bill.vat)}</span></div>
              </div>

              <div className="flex justify-between border-t border-dashed border-slate-600 pt-5 text-xs text-slate-500"><span>โปรดตรวจสอบกับใบแจ้งค่าไฟจริง</span><span className="font-mono">ESTIMATE</span></div>
            </div>
          </section>
        </div>
        <footer className="flex justify-between border-t border-slate-800 pt-5 text-[11px] text-slate-600"><span>SMART GRID / HOME ENERGY</span><span className="font-mono">v1.0.0</span></footer>
      </div>
    </main>
  );
}
