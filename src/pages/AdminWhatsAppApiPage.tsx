import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { Shield, CheckCircle2, XCircle, Loader2, Send, Activity, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiLog {
  id: string;
  timestamp: string;
  action: string;
  success: boolean;
  status?: number;
  latency_ms?: number;
  error?: unknown;
  data?: unknown;
  network_error?: boolean;
}

const AdminWhatsAppApiPage = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [validating, setValidating] = useState(false);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<ApiLog[]>([]);

  // Send message form
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [httpMethod, setHttpMethod] = useState("POST");
  const [customEndpoint, setCustomEndpoint] = useState("");

  const addLog = (log: Omit<ApiLog, "id" | "timestamp">) => {
    setLogs((prev) => [
      {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-api-proxy", {
        body: { action: "validate" },
      });

      if (error) {
        addLog({ action: "validate", success: false, error: error.message });
      } else {
        addLog({
          action: "validate",
          success: data.success,
          status: data.status,
          latency_ms: data.latency_ms,
          error: data.error,
          data: data.data,
        });
      }
    } catch (err) {
      addLog({ action: "validate", success: false, error: err instanceof Error ? err.message : "Unknown error", network_error: true });
    } finally {
      setValidating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!recipientPhone.trim() || !messageText.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-api-proxy", {
        body: {
          action: "send_message",
          body: {
            messaging_product: "whatsapp",
            to: recipientPhone.replace(/[^0-9]/g, ""),
            type: "text",
            text: { body: messageText },
          },
        },
      });

      if (error) {
        addLog({ action: `send → ${recipientPhone}`, success: false, error: error.message });
      } else {
        addLog({
          action: `send → ${recipientPhone}`,
          success: data.success,
          status: data.status,
          latency_ms: data.latency_ms,
          error: data.error,
          data: data.data,
          network_error: data.network_error,
        });
      }
    } catch (err) {
      addLog({ action: `send → ${recipientPhone}`, success: false, error: err instanceof Error ? err.message : "Unknown error", network_error: true });
    } finally {
      setSending(false);
    }
  };

  const handleCustomProxy = async () => {
    if (!customEndpoint.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-api-proxy", {
        body: {
          action: "proxy",
          endpoint: customEndpoint,
          method: httpMethod,
        },
      });

      if (error) {
        addLog({ action: `${httpMethod} ${customEndpoint}`, success: false, error: error.message });
      } else {
        addLog({
          action: `${httpMethod} ${customEndpoint}`,
          success: data.success,
          status: data.status,
          latency_ms: data.latency_ms,
          error: data.error,
          data: data.data,
          network_error: data.network_error,
        });
      }
    } catch (err) {
      addLog({ action: `${httpMethod} ${customEndpoint}`, success: false, error: err instanceof Error ? err.message : "Unknown error", network_error: true });
    } finally {
      setSending(false);
    }
  };

  if (roleLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="p-4">
          <UnauthorizedAlert requiredRole="admin" pageName="WhatsApp API Console" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">WhatsApp API Console</h1>
            <p className="text-sm text-muted-foreground">Admin-only proxy — bypasses CORS restrictions</p>
          </div>
        </div>

        {/* Validate Credentials */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Validate Configuration
            </CardTitle>
            <CardDescription>Test that your WhatsApp Cloud API credentials are working</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleValidate} disabled={validating}>
              {validating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Validate Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Send Test Message */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Test Message
            </CardTitle>
            <CardDescription>Send a WhatsApp message through the server-side proxy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Recipient phone (e.g. 919876543210)"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
            <Textarea
              placeholder="Message text..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={3}
            />
            <Button onClick={handleSendMessage} disabled={sending || !recipientPhone || !messageText}>
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Custom API Call */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Custom API Call
            </CardTitle>
            <CardDescription>Call any whitelisted WhatsApp Cloud API endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Select value={httpMethod} onValueChange={setHttpMethod}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="/v18.0/{PHONE_ID}/messages"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                className="flex-1"
              />
            </div>
            <Button onClick={handleCustomProxy} disabled={sending || !customEndpoint} variant="outline">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Execute
            </Button>
          </CardContent>
        </Card>

        {/* Response Logs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Response Log</CardTitle>
            <CardDescription>{logs.length} request(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No requests yet. Validate or send a message above.</p>
            ) : (
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {log.success ? (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        ) : log.network_error ? (
                          <AlertTriangle className="w-4 h-4 text-accent-foreground shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive shrink-0" />
                        )}
                        <span className="font-mono text-sm font-medium">{log.action}</span>
                        {log.status && (
                          <Badge variant={log.success ? "default" : "destructive"} className="text-xs">
                            {log.status}
                          </Badge>
                        )}
                        {log.latency_ms != null && (
                          <Badge variant="outline" className="text-xs">{log.latency_ms}ms</Badge>
                        )}
                        {log.network_error && (
                          <Badge variant="destructive" className="text-xs">CORS / Network</Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {log.error && (
                        <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded overflow-auto max-h-40">
                          {typeof log.error === "string" ? log.error : JSON.stringify(log.error, null, 2)}
                        </pre>
                      )}
                      {log.data && (
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminWhatsAppApiPage;
