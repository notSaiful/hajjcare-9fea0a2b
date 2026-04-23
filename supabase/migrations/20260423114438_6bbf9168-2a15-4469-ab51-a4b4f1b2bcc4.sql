-- Self-assign demo roles RPC (for testing only).
-- Grants inspector + coordinator + admin to the calling user.
CREATE OR REPLACE FUNCTION public.grant_demo_staff_roles()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_role app_role;
  v_inserted int := 0;
  v_skipped int := 0;
  v_roles app_role[] := ARRAY['inspector','coordinator','admin']::app_role[];
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;

  FOREACH v_role IN ARRAY v_roles LOOP
    IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = v_caller AND role = v_role
    ) THEN
      v_skipped := v_skipped + 1;
    ELSE
      INSERT INTO public.user_roles (user_id, role)
      VALUES (v_caller, v_role);
      v_inserted := v_inserted + 1;
    END IF;
  END LOOP;

  -- Best-effort audit; ignore if it fails
  BEGIN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_table, target_id, details)
    VALUES (
      v_caller,
      'demo_roles_self_assigned',
      'user_roles',
      v_caller::text,
      jsonb_build_object('roles', v_roles, 'inserted', v_inserted, 'skipped', v_skipped)
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN jsonb_build_object(
    'success', true,
    'inserted', v_inserted,
    'skipped', v_skipped,
    'roles', to_jsonb(v_roles)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_demo_staff_roles() TO authenticated;