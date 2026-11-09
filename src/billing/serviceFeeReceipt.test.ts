import { describe, expect, it, vi } from "vitest";
import {
  RECEIPT_CONTACT,
  RECEIPT_GSTIN,
  RECEIPT_ISSUER,
  RECEIPT_PURPOSE,
  buildServiceFeeReceipt,
  receiptText,
} from "../../supabase/functions/verify-razorpay-payment/receipt";

describe("service fee receipt", () => {
  it("builds a receipt only from verified payment fields and does not send email", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const receipt = buildServiceFeeReceipt({
      receiptNumber: "HC-1001",
      payerName: "Amina Khan",
      amountInr: 234.82,
      paidAtIso: "2026-11-09T20:42:00.000Z",
      paymentId: "pay_test_123",
    });
    expect(receipt).toMatchObject({
      receipt_number: "HC-1001",
      payer_name: "Amina Khan",
      amount_inr: 234.82,
      payment_id: "pay_test_123",
      purpose: RECEIPT_PURPOSE,
      issuer: RECEIPT_ISSUER,
      gstin: RECEIPT_GSTIN,
      contact: RECEIPT_CONTACT,
      voluntary: true,
      email: { status: "not_configured", sent: false },
    });
    expect(receipt?.paid_at_ist).toMatch(/2026/);
    expect(receiptText(receipt!)).toContain("not compulsory for any Haji");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("refuses a receipt without a payment id and stubs email without sending", () => {
    expect(buildServiceFeeReceipt({
      receiptNumber: "HC-1",
      payerName: "A",
      amountInr: 10,
      paidAtIso: "2026-11-09T20:42:00.000Z",
      paymentId: "",
    })).toBeNull();
    const receipt = buildServiceFeeReceipt({
      receiptNumber: "HC-2",
      payerName: "A",
      amountInr: 10,
      paidAtIso: "2026-11-09T20:42:00.000Z",
      paymentId: "pay_2",
      emailEnv: { url: "https://mail.example", key: "k", from: "receipts@hajjcare.in" },
    });
    expect(receipt?.email).toEqual({ status: "stubbed", sent: false });
  });
});
