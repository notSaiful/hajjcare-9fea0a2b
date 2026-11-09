export const RECEIPT_PURPOSE = "स्वैच्छिक सेवा शुल्क";
export const RECEIPT_ISSUER = "SAZO Management Private Limited";
export const RECEIPT_GSTIN = "27ABDCS8059C1Z8";
export const RECEIPT_CONTACT = "info@hajjcare.in";

export interface ServiceFeeReceipt {
  receipt_number: string;
  payer_name: string;
  amount_inr: number;
  paid_at_ist: string;
  payment_id: string;
  purpose: typeof RECEIPT_PURPOSE;
  issuer: typeof RECEIPT_ISSUER;
  gstin: typeof RECEIPT_GSTIN;
  contact: typeof RECEIPT_CONTACT;
  voluntary: true;
  email: { status: "not_configured" | "stubbed"; sent: false };
}

export function formatIst(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

/** Never sends mail. A configured provider is recorded as stubbed until a later follow-up. */
export function receiptEmailStatus(env: { url?: string; key?: string; from?: string }): ServiceFeeReceipt["email"] {
  if (env.url?.trim() && env.key?.trim() && env.from?.trim()) return { status: "stubbed", sent: false };
  return { status: "not_configured", sent: false };
}

export function buildServiceFeeReceipt(input: {
  receiptNumber: string;
  payerName: string;
  amountInr: number;
  paidAtIso: string;
  paymentId: string;
  emailEnv?: { url?: string; key?: string; from?: string };
}): ServiceFeeReceipt | null {
  if (!input.receiptNumber || !input.paymentId) return null;
  if (!Number.isFinite(input.amountInr) || input.amountInr <= 0) return null;
  if (Number.isNaN(new Date(input.paidAtIso).getTime())) return null;
  return {
    receipt_number: input.receiptNumber,
    payer_name: input.payerName.trim() || "—",
    amount_inr: Math.round(input.amountInr * 100) / 100,
    paid_at_ist: formatIst(input.paidAtIso),
    payment_id: input.paymentId,
    purpose: RECEIPT_PURPOSE,
    issuer: RECEIPT_ISSUER,
    gstin: RECEIPT_GSTIN,
    contact: RECEIPT_CONTACT,
    voluntary: true,
    email: receiptEmailStatus(input.emailEnv ?? {}),
  };
}

export function receiptText(receipt: ServiceFeeReceipt): string {
  return [
    receipt.issuer,
    `GSTIN ${receipt.gstin}`,
    receipt.purpose,
    `Receipt ${receipt.receipt_number}`,
    `Name: ${receipt.payer_name}`,
    `Amount: ₹${receipt.amount_inr.toFixed(2)}`,
    `Date: ${receipt.paid_at_ist} IST`,
    `Payment ID: ${receipt.payment_id}`,
    `Contact: ${receipt.contact}`,
    "This fee is voluntary and not compulsory for any Haji.",
  ].join("\n");
}
