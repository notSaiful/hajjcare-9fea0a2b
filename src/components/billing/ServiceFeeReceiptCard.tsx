import type { ServiceFeeReceipt } from "../../../supabase/functions/verify-razorpay-payment/receipt";
import { receiptText } from "../../../supabase/functions/verify-razorpay-payment/receipt";
import { Button } from "@/components/ui/button";

export function ServiceFeeReceiptCard({ receipt }: { receipt: ServiceFeeReceipt }) {
  const text = receiptText(receipt);

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${receipt.receipt_number}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-xl border bg-card p-4 space-y-2" aria-label="Service fee receipt">
      <h2 className="text-lg font-semibold">{receipt.issuer}</h2>
      <p className="text-sm">GSTIN {receipt.gstin}</p>
      <p className="font-medium">{receipt.purpose}</p>
      <p>Receipt {receipt.receipt_number}</p>
      <p>Name: {receipt.payer_name}</p>
      <p>Amount: ₹{receipt.amount_inr.toFixed(2)}</p>
      <p>Date: {receipt.paid_at_ist} IST</p>
      <p>Payment ID: {receipt.payment_id}</p>
      <p>Contact: {receipt.contact}</p>
      <p className="text-sm text-muted-foreground">This fee is voluntary and not compulsory for any Haji.</p>
      <p className="text-sm text-muted-foreground">
        {receipt.email.sent ? "" : "No email was sent."}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => window.print()}>Print</Button>
        <Button type="button" variant="outline" onClick={download}>Download</Button>
      </div>
    </section>
  );
}
