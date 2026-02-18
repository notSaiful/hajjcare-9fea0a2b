import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ForbiddenErrorProps {
  /** HTTP status code that triggered this (default 403) */
  statusCode?: number;
  /** The internal endpoint or action that was blocked */
  endpoint?: string;
  /** Additional context shown to admins */
  detail?: string;
  /** Called when the user wants to retry */
  onRetry?: () => void;
}

const STATUS_LABELS: Record<number, { title: string; reason: string; badge: string }> = {
  403: {
    title: 'Access Forbidden',
    reason:
      'This endpoint is restricted to server-side processes only. It cannot be called directly from the browser.',
    badge: '403 Forbidden',
  },
  429: {
    title: 'Rate Limit Exceeded',
    reason:
      'Too many requests have been sent in a short period. Please wait before retrying.',
    badge: '429 Too Many Requests',
  },
};

export const ForbiddenError: React.FC<ForbiddenErrorProps> = ({
  statusCode = 403,
  endpoint,
  detail,
  onRetry,
}) => {
  const navigate = useNavigate();
  const info = STATUS_LABELS[statusCode] ?? STATUS_LABELS[403];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-lg w-full border-destructive/30 bg-destructive/5">
        <CardContent className="p-6 space-y-5">
          {/* Icon + badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-destructive" />
            </div>
            <Badge variant="destructive" className="font-mono text-xs">
              {info.badge}
            </Badge>
          </div>

          {/* Title + reason */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-destructive">{info.title}</h2>
            <p className="text-sm text-muted-foreground">{info.reason}</p>
          </div>

          {/* Technical details for admins */}
          {(endpoint || detail) && (
            <div className="rounded-md bg-muted/60 border border-border p-3 space-y-1 text-xs font-mono">
              {endpoint && (
                <p>
                  <span className="text-muted-foreground">Endpoint: </span>
                  <span className="text-foreground break-all">{endpoint}</span>
                </p>
              )}
              {detail && (
                <p>
                  <span className="text-muted-foreground">Detail: </span>
                  <span className="text-foreground">{detail}</span>
                </p>
              )}
              <p className="text-muted-foreground pt-1">
                Internal endpoints require the service-role key and must be called
                from a backend function, not from the browser.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Go Back
            </Button>

            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}

            <Button
              size="sm"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
