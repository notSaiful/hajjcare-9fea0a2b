import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HajInspector } from "@/data/hajInspectorsData";
import { User, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface InspectorCardProps {
  inspector: HajInspector;
  isExpanded: boolean;
  onToggle: () => void;
  translations: Record<string, string>;
}

export const InspectorCard = ({ inspector, isExpanded, onToggle, translations: t }: InspectorCardProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{inspector.name}</h3>
                    <Badge 
                      variant={inspector.result === 'Selected' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs shrink-0",
                        inspector.result === 'Selected' 
                          ? "bg-emerald-500 hover:bg-emerald-600" 
                          : "bg-amber-500 hover:bg-amber-600"
                      )}
                    >
                      {inspector.result === 'Selected' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" />{t.selected}</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" />{t.waitlisted}</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">ID: {inspector.id}</p>
                  <p className="text-sm text-muted-foreground truncate">{inspector.state}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-muted-foreground">{t.totalMarks}: <strong className="text-foreground">{inspector.totalMarks}</strong></span>
                    <Badge variant="outline" className="text-xs">{inspector.gender}</Badge>
                  </div>
                </div>
              </div>
              <div className="ml-2 text-muted-foreground">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-3 border-t">
            <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
              <div>
                <span className="text-muted-foreground">{t.fatherName}:</span>
                <p className="font-medium">{inspector.fatherName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t.category}:</span>
                <p className="font-medium">{inspector.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.cbtMarks}</div>
                <div className="text-xs text-muted-foreground">{t.cbtMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.interviewMarks}</div>
                <div className="text-xs text-muted-foreground">{t.interviewMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-600">{inspector.totalMarks}</div>
                <div className="text-xs text-muted-foreground">{t.totalMarks}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{inspector.quota}</Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">ID: {inspector.id}</Badge>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
