"use client";

import { PrintIcon } from "./Icons";

export function PrintButton() {
  return (
    <button type="button" className="d-btn" onClick={() => window.print()}>
      <PrintIcon /> Print / Save PDF
    </button>
  );
}
