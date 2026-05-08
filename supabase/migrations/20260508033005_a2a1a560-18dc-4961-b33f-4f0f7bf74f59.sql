-- Remove client-side write access on billing_invoices to prevent fake payment status
DROP POLICY IF EXISTS "Users can update own invoices" ON public.billing_invoices;
DROP POLICY IF EXISTS "Users can insert own invoices" ON public.billing_invoices;

-- Invoices are now only written by the verify-razorpay-payment edge function
-- using the service role key, after HMAC signature verification.
-- Users retain SELECT access via existing "Users can view own invoices" policy.