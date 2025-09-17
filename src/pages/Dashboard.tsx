import { useState } from "react";
import { Calendar, TrendingUp, Camera, Heart, Users, MapPin, Utensils, Pill, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const moodOptions = [
  { emoji: "☀️", label: "Sunny", color: "hsl(var(--mood-sunny))", description: "Feeling great!" },
  { emoji: "☁️", label: "Cloudy", color: "hsl(var(--mood-cloudy))", description: "It's okay" },
  { emoji: "🌧️", label: "Rainy", color: "hsl(var(--mood-rainy))", description: "Feeling down" },
  { emoji: "💨", label: "Windy", color: "hsl(var(--mood-windy))", description: "Anxious/Restless" },
];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [companions, setCompanions] = useState("");
  const [diet, setDiet] = useState("");
  const [medication, setMedication] = useState("");
  const [sleep, setSleep] = useState("");
  const { toast } = useToast();

  const handleMoodSave = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today before saving.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a database
    toast({
      title: "Mood logged successfully!",
      description: "Your wellness entry has been saved for today.",
    });

    // Reset form
    setSelectedMood(null);
    setMoodNote("");
    setCompanions("");
    setDiet("");
    setMedication("");
    setSleep("");
  };

  const selectedMoodData = moodOptions.find(mood => mood.label === selectedMood);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wellness Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your mental wellness journey</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Today's Mood Tracking */}
      <Card className="border-2 border-[hsl(var(--wellness-primary)/0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--wellness-primary))]">
            <Heart className="w-5 h-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selector */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select your mood</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedMood === mood.label
                      ? "border-[hsl(var(--wellness-primary))] bg-[hsl(var(--wellness-primary)/0.1)]"
                      : "border-border hover:border-[hsl(var(--wellness-primary)/0.5)]"
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                  <div className="text-xs text-muted-foreground">{mood.description}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-[hsl(var(--wellness-primary))]">
                <span className="text-2xl">{selectedMoodData?.emoji}</span>
                <span className="font-medium">Feeling {selectedMood} today</span>
              </div>

              {/* Mood Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      Who are you with?
                    </label>
                    <Input
                      placeholder="Family, friends, alone..."
                      value={companions}
                      onChange={(e) => setCompanions(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4" />
                      What did you eat?
                    </label>
                    <Input
                      placeholder="Breakfast, lunch, dinner..."
                      value={diet}
                      onChange={(e) => setDiet(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4" />
                      Medication taken?
                    </label>
                    <Input
                      placeholder="Yes/No, which ones..."
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Moon className="w-4 h-4" />
                      Sleep quality (1-10)
                    </label>
                    <Input
                      placeholder="Rate your sleep..."
                      value={sleep}
                      onChange={(e) => setSleep(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What's on your mind today?
                </label>
                <Textarea
                  placeholder="Share your thoughts, experiences, or anything you'd like to remember about today..."
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleMoodSave} className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Today's Entry
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">5 entries</p>
              </div>
              <Heart className="w-8 h-8 text-[hsl(var(--wellness-primary))]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mood Trend</p>
                <p className="text-2xl font-bold">Improving</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[hsl(var(--mood-sunny))]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
              <Calendar className="w-8 h-8 text-[hsl(var(--wellness-primary))]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}