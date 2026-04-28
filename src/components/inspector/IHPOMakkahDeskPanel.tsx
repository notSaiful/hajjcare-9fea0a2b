import { IHPODeskPanel } from "@/components/inspector/IHPODeskPanel";
import { IHPO_MAKKAH_DESKS } from "@/data/ihpoMakkahDesks";

export const IHPOMakkahDeskPanel = () => (
  <IHPODeskPanel city="Makkah" desks={IHPO_MAKKAH_DESKS} />
);

export default IHPOMakkahDeskPanel;
