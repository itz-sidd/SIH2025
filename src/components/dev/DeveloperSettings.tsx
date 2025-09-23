import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Server, Database, Wifi } from 'lucide-react';

export function DeveloperSettings() {
  const [authMode, setAuthMode] = useState<'mock' | 'real'>('mock');
  const [socketMode, setSocketMode] = useState<'mock' | 'real'>('mock');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load current settings from localStorage
    const currentAuthMode = localStorage.getItem('authMode') as 'mock' | 'real' || 'mock';
    const currentSocketMode = localStorage.getItem('socketMode') as 'mock' | 'real' || 'mock';
    
    setAuthMode(currentAuthMode);
    setSocketMode(currentSocketMode);
  }, []);

  const handleAuthModeChange = (checked: boolean) => {
    const newMode = checked ? 'real' : 'mock';
    setAuthMode(newMode);
    localStorage.setItem('authMode', newMode);
    
    // Show reload message
    if (window.confirm(`Authentication mode changed to ${newMode}. Reload page to apply changes?`)) {
      window.location.reload();
    }
  };

  const handleSocketModeChange = (checked: boolean) => {
    const newMode = checked ? 'real' : 'mock';
    setSocketMode(newMode);
    localStorage.setItem('socketMode', newMode);
    
    // Show reload message
    if (window.confirm(`Socket mode changed to ${newMode}. Reload page to apply changes?`)) {
      window.location.reload();
    }
  };

  const resetToMock = () => {
    localStorage.setItem('authMode', 'mock');
    localStorage.setItem('socketMode', 'mock');
    window.location.reload();
  };

  const switchToReal = () => {
    localStorage.setItem('authMode', 'real');
    localStorage.setItem('socketMode', 'real');
    window.location.reload();
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Developer Settings
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-mode" className="flex items-center gap-2 text-sm">
                <Database className="h-3 w-3" />
                Authentication
                <Badge variant={authMode === 'real' ? 'default' : 'secondary'}>
                  {authMode}
                </Badge>
              </Label>
              <Switch
                id="auth-mode"
                checked={authMode === 'real'}
                onCheckedChange={handleAuthModeChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="socket-mode" className="flex items-center gap-2 text-sm">
                <Wifi className="h-3 w-3" />
                Real-time Chat
                <Badge variant={socketMode === 'real' ? 'default' : 'secondary'}>
                  {socketMode}
                </Badge>
              </Label>
              <Switch
                id="socket-mode"
                checked={socketMode === 'real'}
                onCheckedChange={handleSocketModeChange}
              />
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={switchToReal}
            >
              <Server className="h-3 w-3 mr-2" />
              Switch to Real Backend
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={resetToMock}
            >
              Reset to Mock Mode
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p><strong>Real Backend Requirements:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Backend server running on :3001</li>
              <li>MongoDB running on :27017</li>
              <li>Valid .env configuration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}