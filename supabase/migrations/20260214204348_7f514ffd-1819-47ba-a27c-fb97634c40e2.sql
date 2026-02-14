
-- Step 1: Drop the overly permissive policies
DROP POLICY IF EXISTS "Anon can check mobile duplicates" ON public.volunteers;
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON public.volunteers;

-- Step 2: Create a restricted public view for status tracking (no PII)
CREATE OR REPLACE VIEW public.volunteers_public
WITH (security_invoker = on) AS
  SELECT 
    volunteer_id,
    status,
    city,
    skills,
    created_at
  FROM public.volunteers;
-- Excludes: full_name, father_name, mobile, whatsapp, email, full_address, district, state

-- Step 3: Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.volunteers_public TO anon, authenticated;

-- Step 4: Create a security definer function for mobile duplicate check (returns only boolean)
CREATE OR REPLACE FUNCTION public.check_volunteer_mobile_exists(p_mobile text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.volunteers WHERE mobile = p_mobile
  );
$$;

-- Step 5: Create a security definer function for volunteer status lookup by mobile
CREATE OR REPLACE FUNCTION public.lookup_volunteer_status(p_query text)
RETURNS TABLE(full_name text, volunteer_id text, status text, city text, skills text[], created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT v.full_name, v.volunteer_id, v.status, v.city, v.skills, v.created_at
  FROM public.volunteers v
  WHERE v.mobile = p_query OR v.volunteer_id = upper(p_query)
  LIMIT 1;
$$;

-- Step 6: Replace INSERT policy - still public but with basic validation
CREATE POLICY "Public volunteer registration"
  ON public.volunteers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure required fields are not empty
    length(trim(full_name)) > 0
    AND length(trim(mobile)) >= 10
    AND length(trim(city)) > 0
  );
