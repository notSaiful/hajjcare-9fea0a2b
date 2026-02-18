import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldX, Clock, ArrowLeft, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SimpleHeader } from '@/components/SimpleHeader';

interface ErrorState {
  statusCode?: number;
  endpoint?: string;
  detail?: string;
  returnTo?: string;
}

const CONFIG: Record<number, {
  icon: React.ElementType;
  badge: string;
  title: string;
  reason: string;
  suggestion: string;
  color: string;
}> = {
  403: {
    icon: ShieldX,
    badge: '403 Forbidden',
    title: 'Access Forbidden',
    reason: 'This endpoint is restricted to server-side processes only. It cannot be called directly from the browser.',
    suggestion: 'If you believe you should have access, ensure you are signed in with an admin account and try again.',
    color: 'text-destructive',
  },
  429: {
    icon: Clock,
    badge: '429 Too Many Requests',
    title: 'Rate Limit Exceeded',
    reason: 'Too many requests have been sent in a short period. The system has temporarily blocked further calls to protect the backend.',
    suggestion: 'Please wait 60 seconds before retrying. If this persists, contact system support.',
    color: 'text-warning',
  },
};

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ErrorState;

  const statusCode = state.statusCode ?? (location.pathname.includes('rate-limited') ? 429 : 403);
  const config = CONFIG[statusCode] ?? CONFIG[403];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border border-border">
            <Icon className={`w-10 h-10 ${config.color}`} />
          </div>

          {/* Badge + Title */}
          <div className="text-center space-y-2">
            <Badge
              variant={statusCode === 403 ? 'destructive' : 'secondary'}
              className="font-mono text-xs px-3 py-1"
            >
              {config.badge}
            </Badge>
            <h1 className={`text-3xl font-bold ${config.color}`}>{config.title}</h1>
            <p className="text-muted-foreground max-w-md">{config.reason}</p>
          </div>

          {/* Technical details card */}
          <Card className="w-full border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-foreground/60" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-muted/60 border border-border p-3 font-mono text-xs space-y-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">Status:</span>
                  <span className="text-foreground">{statusCode}</span>
                </div>
                {state.endpoint && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">Endpoint:</span>
                    <span className="text-foreground break-all">{state.endpoint}</span>
                  </div>
                )}
                {state.detail && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">Detail:</span>
                    <span className="text-foreground">{state.detail}</span>
                  </div>
                )}
                <Separator className="my-1" />
                <p className="text-muted-foreground">
                  Internal endpoints require the service-role key and must be
                  called from a backend function, not from the browser.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{config.suggestion}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(state.returnTo ?? location.state?.returnTo ?? -1 as any)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForbiddenPage;
