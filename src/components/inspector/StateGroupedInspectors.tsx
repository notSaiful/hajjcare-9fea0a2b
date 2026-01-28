import { useMemo, useState } from "react";
import { HajInspector, getStateStats, INSPECTOR_STATES } from "@/data/hajInspectorsData";
import { InspectorCard } from "./InspectorCard";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, MapPin, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface StateGroupedInspectorsProps {
  inspectors: HajInspector[];
  selectedState: string;
  translations: Record<string, string>;
}

export const StateGroupedInspectors = ({ 
  inspectors, 
  selectedState, 
  translations: t 
}: StateGroupedInspectorsProps) => {
  const [expandedInspectorId, setExpandedInspectorId] = useState<string | null>(null);
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  // Group inspectors by state
  const groupedByState = useMemo(() => {
    const groups: Record<string, HajInspector[]> = {};
    
    inspectors.forEach(inspector => {
      const state = inspector.state;
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state].push(inspector);
    });
    
    // Sort states alphabetically
    const sortedStates = Object.keys(groups).sort();
    const sortedGroups: Record<string, HajInspector[]> = {};
    sortedStates.forEach(state => {
      sortedGroups[state] = groups[state];
    });
    
    return sortedGroups;
  }, [inspectors]);

  // If a specific state is selected, show only that state's inspectors
  if (selectedState) {
    const stateInspectors = groupedByState[selectedState] || [];
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{selectedState}</span>
          <Badge variant="secondary" className="ml-auto">
            {stateInspectors.length} {t.total.toLowerCase()}
          </Badge>
        </div>
        {stateInspectors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t.noResults}
          </div>
        ) : (
          stateInspectors.map((inspector) => (
            <InspectorCard
              key={inspector.id}
              inspector={inspector}
              isExpanded={expandedInspectorId === inspector.id}
              onToggle={() => setExpandedInspectorId(
                expandedInspectorId === inspector.id ? null : inspector.id
              )}
              translations={t}
            />
          ))
        )}
      </div>
    );
  }

  // Show all states in accordion
  return (
    <Accordion 
      type="multiple" 
      value={expandedStates}
      onValueChange={setExpandedStates}
      className="space-y-2"
    >
      {Object.entries(groupedByState).map(([state, stateInspectors]) => {
        const stateStats = getStateStats(state);
        return (
          <AccordionItem 
            key={state} 
            value={state}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3 w-full pr-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{state}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{stateStats.total} inspectors</span>
                    <span>•</span>
                    <span className="text-emerald-600">{stateStats.selected} selected</span>
                    {stateStats.waitlisted > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600">{stateStats.waitlisted} waitlisted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                {stateInspectors.map((inspector) => (
                  <InspectorCard
                    key={inspector.id}
                    inspector={inspector}
                    isExpanded={expandedInspectorId === inspector.id}
                    onToggle={() => setExpandedInspectorId(
                      expandedInspectorId === inspector.id ? null : inspector.id
                    )}
                    translations={t}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
