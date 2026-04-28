import { useMemo, useState } from "react";
import { IHPODeskPanel } from "@/components/inspector/IHPODeskPanel";
import { IHPO_MAKKAH_DESKS } from "@/data/ihpoMakkahDesks";
import { useDeskOverrides } from "@/hooks/useDeskOverrides";
import { useUserRole } from "@/hooks/useUserRole";
import EditDeskNumbersDialog from "@/components/inspector/EditDeskNumbersDialog";

const CITY = "Makkah";

export const IHPOMakkahDeskPanel = () => {
  const { isAdmin } = useUserRole();
  const { apply } = useDeskOverrides(CITY);
  const [editOpen, setEditOpen] = useState(false);
  const desks = useMemo(() => apply(IHPO_MAKKAH_DESKS), [apply]);

  return (
    <>
      <IHPODeskPanel
        city={CITY}
        desks={desks}
        canEdit={isAdmin}
        onEdit={() => setEditOpen(true)}
      />
      {isAdmin && (
        <EditDeskNumbersDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          city={CITY}
          baseDesks={IHPO_MAKKAH_DESKS}
        />
      )}
    </>
  );
};

export default IHPOMakkahDeskPanel;
