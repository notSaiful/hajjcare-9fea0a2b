
CREATE TYPE public.claim_status AS ENUM ('pending','approved','rejected','withdrawn');

CREATE TABLE public.lost_found_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.lost_and_found(id) ON DELETE CASCADE,
  owner_user_id UUID,
  claimant_user_id UUID NOT NULL,
  claimant_name TEXT NOT NULL,
  claimant_mobile TEXT NOT NULL,
  claimant_whatsapp TEXT,
  claim_description TEXT NOT NULL,
  proof_photo_url TEXT,
  status public.claim_status NOT NULL DEFAULT 'pending',
  owner_response_note TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lfc_report ON public.lost_found_claims(report_id);
CREATE INDEX idx_lfc_owner ON public.lost_found_claims(owner_user_id, status, created_at DESC);
CREATE INDEX idx_lfc_claimant ON public.lost_found_claims(claimant_user_id, created_at DESC);

ALTER TABLE public.lost_found_claims ENABLE ROW LEVEL SECURITY;

-- Claimant can create their own claim (must be signed in)
CREATE POLICY "Users create their own claims"
ON public.lost_found_claims FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = claimant_user_id);

-- View: claimant, owner of report, or admin
CREATE POLICY "Claimant/owner/admin can view claims"
ON public.lost_found_claims FOR SELECT
TO authenticated
USING (
  auth.uid() = claimant_user_id
  OR auth.uid() = owner_user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Update: claimant can withdraw; owner can approve/reject; admin all
CREATE POLICY "Claimant can withdraw, owner can respond, admin all"
ON public.lost_found_claims FOR UPDATE
TO authenticated
USING (
  auth.uid() = claimant_user_id
  OR auth.uid() = owner_user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() = claimant_user_id
  OR auth.uid() = owner_user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE TRIGGER update_lost_found_claims_updated_at
BEFORE UPDATE ON public.lost_found_claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-populate owner_user_id from the referenced report
CREATE OR REPLACE FUNCTION public.set_lfc_owner_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
BEGIN
  IF NEW.owner_user_id IS NULL THEN
    SELECT user_id INTO NEW.owner_user_id FROM public.lost_and_found WHERE id = NEW.report_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_lfc_owner
BEFORE INSERT ON public.lost_found_claims
FOR EACH ROW EXECUTE FUNCTION public.set_lfc_owner_user_id();
