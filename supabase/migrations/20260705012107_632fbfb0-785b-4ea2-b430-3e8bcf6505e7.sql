
-- 1) Lost & Found reports: remove blanket coordinator/medical_staff read on full row.
--    Full row (with reporter mobile/whatsapp) is now visible only to the reporter (owner)
--    and admins. Coordinators and other staff can still discover reports via the
--    contact-free public view (lost_and_found_public).
DROP POLICY IF EXISTS "Staff and owners can view reports with contact" ON public.lost_and_found;

CREATE POLICY "Owners and admins can view full reports"
  ON public.lost_and_found
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- 2) Lost & Found claims: mask claimant contact details until the claim is approved.
--    Report owners can see the claimant's name + description while the claim is pending,
--    but the phone / WhatsApp number is only revealed after the owner approves the claim
--    (or to the claimant themselves / admins). This prevents a malicious report owner from
--    harvesting contact details of every person who tries to claim their post.

-- Revoke direct column read of sensitive fields; force reads through the safe view / RPC.
REVOKE SELECT (claimant_mobile, claimant_whatsapp)
  ON public.lost_found_claims FROM anon, authenticated;

-- Safe view: enforces the same row visibility as the base RLS (claimant, owner, admin)
-- and masks contact columns until approved. Also embeds a minimal, safe projection of the
-- related report so the UI does not need a second join into lost_and_found.
CREATE OR REPLACE VIEW public.lost_found_claims_safe AS
SELECT
  c.id,
  c.report_id,
  c.owner_user_id,
  c.claimant_user_id,
  c.claimant_name,
  CASE
    WHEN c.status = 'approved'
      OR auth.uid() = c.claimant_user_id
      OR public.has_role(auth.uid(), 'admin'::app_role)
    THEN c.claimant_mobile
    ELSE NULL
  END AS claimant_mobile,
  CASE
    WHEN c.status = 'approved'
      OR auth.uid() = c.claimant_user_id
      OR public.has_role(auth.uid(), 'admin'::app_role)
    THEN c.claimant_whatsapp
    ELSE NULL
  END AS claimant_whatsapp,
  c.claim_description,
  c.proof_photo_url,
  c.status,
  c.owner_response_note,
  c.responded_at,
  c.created_at,
  c.updated_at,
  r.item_name          AS report_item_name,
  r.person_name        AS report_person_name,
  r.photo_url          AS report_photo_url,
  r.last_seen_location AS report_last_seen_location,
  r.post_kind          AS report_post_kind,
  -- Reporter contact is only exposed to the claimant once the owner approves,
  -- to the report owner themselves, or to admins.
  CASE
    WHEN c.status = 'approved'
      OR auth.uid() = r.user_id
      OR public.has_role(auth.uid(), 'admin'::app_role)
    THEN r.reporter_mobile
    ELSE NULL
  END AS report_reporter_mobile,
  CASE
    WHEN c.status = 'approved'
      OR auth.uid() = r.user_id
      OR public.has_role(auth.uid(), 'admin'::app_role)
    THEN r.reporter_whatsapp
    ELSE NULL
  END AS report_reporter_whatsapp
FROM public.lost_found_claims c
LEFT JOIN public.lost_and_found r ON r.id = c.report_id
WHERE
  auth.uid() = c.claimant_user_id
  OR auth.uid() = c.owner_user_id
  OR public.has_role(auth.uid(), 'admin'::app_role);

-- Runs with definer rights so it can bypass the column REVOKE and the tightened
-- lost_and_found RLS while still enforcing its own auth.uid()-based checks.
ALTER VIEW public.lost_found_claims_safe SET (security_invoker = off);

GRANT SELECT ON public.lost_found_claims_safe TO authenticated;
