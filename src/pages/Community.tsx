import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Heart, Shield, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

interface Room {
  id: string;
  name: string;
  description: string;
  members: number;
  active: number;
  lastMessage: string;
  category: string;
}

export default function Community() {
  const { user, isLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const roomsData = await response.json();
        setRooms(roomsData);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Fallback to static data if backend is not available
      setRooms([
        { id: '1', name: "General Support", description: "A safe space for general mental health discussions", members: 234, active: 12, lastMessage: "2 minutes ago", category: "support" },
        { id: '2', name: "Anxiety & Stress", description: "Share coping strategies and support for anxiety", members: 189, active: 8, lastMessage: "5 minutes ago", category: "anxiety" },
        { id: '3', name: "Study Pressure", description: "Academic stress and study-life balance", members: 156, active: 15, lastMessage: "1 minute ago", category: "academic" },
        { id: '4', name: "Daily Motivation", description: "Share positive thoughts and daily inspiration", members: 298, active: 20, lastMessage: "just now", category: "motivation" }
      ]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleJoinChat = (roomId: string) => {
    navigate(`/community/room/${roomId}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Support</h1>
        <p className="text-muted-foreground">Connect with peers in a safe, moderated environment</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-[hsl(var(--community))] text-white">
            <Shield className="w-3 h-3 mr-1" />
            Moderated 24/7
          </Badge>
          <Badge variant="outline">
            <Users className="w-3 h-3 mr-1" />
            877 Active Members
          </Badge>
        </div>
      </div>

      {/* Community Guidelines */}
      <Card className="mb-6 border-[hsl(var(--community)/0.3)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--community))]">
            <Shield className="w-5 h-5" />
            Community Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm">✅ Be respectful and supportive</p>
              <p className="text-sm">✅ Share resources and coping strategies</p>
              <p className="text-sm">✅ Listen without judgment</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">❌ No medical advice or diagnosis</p>
              <p className="text-sm">❌ No triggering content without warnings</p>
              <p className="text-sm">❌ Respect privacy and confidentiality</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Rooms */}
      <div className="grid md:grid-cols-2 gap-6">
        {loadingRooms ? (
          <div className="col-span-full text-center py-8">Loading rooms...</div>
        ) : (
          rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {room.description}
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    room.category === 'support' ? 'border-[hsl(var(--community))] text-[hsl(var(--community))]' :
                    room.category === 'anxiety' ? 'border-[hsl(var(--mood-rainy))] text-[hsl(var(--mood-rainy))]' :
                    room.category === 'academic' ? 'border-[hsl(var(--mood-windy))] text-[hsl(var(--mood-windy))]' :
                    'border-[hsl(var(--mood-sunny))] text-[hsl(var(--mood-sunny))]'
                  }
                >
                  {room.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.members} members
                  </span>
                  <span className="flex items-center gap-1 text-[hsl(var(--wellness-primary))]">
                    <div className="w-2 h-2 bg-[hsl(var(--wellness-primary))] rounded-full"></div>
                    {room.active} active
                  </span>
                </div>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {room.lastMessage}
                </span>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-[hsl(var(--community))] hover:bg-[hsl(var(--community)/0.9)]"
                  size="sm"
                  onClick={() => handleJoinChat(room.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Chat
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Coming Soon Features */}
      <Card className="mt-6 bg-muted/50">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium">Private Groups</h4>
              <p className="text-sm text-muted-foreground">Create or join private support groups</p>
            </div>
            <div className="text-center p-4">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium">Video Calls</h4>
              <p className="text-sm text-muted-foreground">Face-to-face peer support sessions</p>
            </div>
            <div className="text-center p-4">
              <Heart className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium">Buddy System</h4>
              <p className="text-sm text-muted-foreground">Get matched with a peer supporter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}