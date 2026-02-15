
-- Create billing_invoices table for GST-compliant billing ledger
CREATE TABLE public.billing_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Service details
  service_name TEXT NOT NULL,
  
  -- Amount breakdown (all in INR, stored as paise for precision)
  base_amount INTEGER NOT NULL,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  gst_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  
  -- Payment details
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
  payment_transaction_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Customer details (snapshot at time of invoice)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Organization details
  org_name TEXT NOT NULL DEFAULT 'Sazo Management Private Limited',
  org_address TEXT NOT NULL DEFAULT 'India',
  org_gstin TEXT,
  
  -- Invoice storage
  invoice_pdf_url TEXT,
  
  -- Notifications
  whatsapp_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

-- Users can view their own invoices
CREATE POLICY "Users can view own invoices"
ON public.billing_invoices
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own invoices
CREATE POLICY "Users can insert own invoices"
ON public.billing_invoices
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own invoices (for payment status updates)
CREATE POLICY "Users can update own invoices"
ON public.billing_invoices
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all invoices
CREATE POLICY "Admins can view all invoices"
ON public.billing_invoices
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-generate invoice number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
DECLARE
  v_seq INTEGER;
  v_year TEXT;
  v_month TEXT;
BEGIN
  v_year := to_char(now(), 'YY');
  v_month := to_char(now(), 'MM');
  SELECT COUNT(*) + 1 INTO v_seq FROM public.billing_invoices
    WHERE invoice_date >= date_trunc('month', now());
  RETURN 'HC-' || v_year || v_month || '-' || LPAD(v_seq::TEXT, 5, '0');
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_billing_invoices_updated_at
BEFORE UPDATE ON public.billing_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_billing_invoices_user_id ON public.billing_invoices(user_id);
CREATE INDEX idx_billing_invoices_invoice_number ON public.billing_invoices(invoice_number);
CREATE INDEX idx_billing_invoices_payment_status ON public.billing_invoices(payment_status);
