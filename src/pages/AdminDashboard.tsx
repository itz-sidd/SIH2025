import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Clock } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform administration and management</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-[hsl(var(--wellness-primary)/0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--wellness-primary))]">
            <Settings className="w-5 h-5" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The admin dashboard will be built later. This will include user management, 
              system analytics, content moderation, and platform configuration tools.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}