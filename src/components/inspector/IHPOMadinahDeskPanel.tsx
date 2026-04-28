import { IHPODeskPanel } from "@/components/inspector/IHPODeskPanel";
import { IHPO_MADINAH_DESKS } from "@/data/ihpoMadinahDesks";

export const IHPOMadinahDeskPanel = () => (
  <IHPODeskPanel city="Madinah" desks={IHPO_MADINAH_DESKS} />
);

export default IHPOMadinahDeskPanel;
