import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Headphones, Wind, Clock, Star } from "lucide-react";

const learningContent = [
  {
    id: 1,
    title: "Breathing Techniques for Anxiety",
    type: "Exercise",
    duration: "5 minutes",
    category: "Anxiety Management",
    description: "Learn the 4-7-8 breathing technique to calm anxiety and stress",
    icon: Wind,
    difficulty: "Beginner",
    rating: 4.8
  },
  {
    id: 2,
    title: "Understanding Depression",
    type: "Video",
    duration: "12 minutes", 
    category: "Education",
    description: "Educational video about depression symptoms, causes, and treatment options",
    icon: Play,
    difficulty: "Beginner",
    rating: 4.9
  },
  {
    id: 3,
    title: "Mindfulness Meditation",
    type: "Audio",
    duration: "15 minutes",
    category: "Meditation",
    description: "Guided mindfulness meditation for stress relief and mental clarity",
    icon: Headphones,
    difficulty: "Beginner",
    rating: 4.7
  },
  {
    id: 4,
    title: "Cognitive Behavioral Therapy Basics",
    type: "Article",
    duration: "8 minutes",
    category: "Education",
    description: "Learn the fundamentals of CBT and how it can help with mental health",
    icon: BookOpen,
    difficulty: "Intermediate",
    rating: 4.6
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation",
    type: "Exercise",
    duration: "20 minutes",
    category: "Relaxation",
    description: "Full body relaxation technique to reduce physical tension and stress",
    icon: Wind,
    difficulty: "Beginner",
    rating: 4.5
  },
  {
    id: 6,
    title: "Sleep Hygiene Guide",
    type: "Article",
    duration: "6 minutes",
    category: "Sleep Health",
    description: "Evidence-based tips for better sleep quality and mental health",
    icon: BookOpen,
    difficulty: "Beginner",
    rating: 4.8
  }
];

const categories = [
  { name: "All", count: learningContent.length, color: "hsl(var(--wellness-primary))" },
  { name: "Anxiety Management", count: 2, color: "hsl(var(--mood-windy))" },
  { name: "Education", count: 2, color: "hsl(var(--mood-cloudy))" },
  { name: "Meditation", count: 1, color: "hsl(var(--mood-sunny))" },
  { name: "Relaxation", count: 1, color: "hsl(var(--mood-rainy))" },
  { name: "Sleep Health", count: 1, color: "hsl(var(--wellness-primary))" }
];

export default function Learn() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
        <p className="text-muted-foreground">
          Educational resources, guided exercises, and tools for mental wellness
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-[hsl(var(--wellness-primary))] text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Evidence-Based Content
          </Badge>
          <Badge variant="outline">
            <Star className="w-3 h-3 mr-1" />
            Expertly Curated
          </Badge>
        </div>
      </div>

      {/* Categories Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.name === "All" ? "default" : "outline"}
                size="sm"
                className={category.name === "All" ? "bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]" : ""}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {learningContent.map((content) => (
          <Card key={content.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[hsl(var(--wellness-primary)/0.1)]">
                    <content.icon className="w-5 h-5 text-[hsl(var(--wellness-primary))]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {content.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[hsl(var(--mood-sunny))]" />
                        <span className="text-xs">{content.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">{content.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {content.duration}
                  </span>
                  <Badge 
                    variant="outline"
                    className={
                      content.difficulty === 'Beginner' ? 'border-[hsl(var(--mood-sunny))] text-[hsl(var(--mood-sunny))]' :
                      'border-[hsl(var(--mood-windy))] text-[hsl(var(--mood-windy))]'
                    }
                  >
                    {content.difficulty}
                  </Badge>
                </div>
              </div>

              <Badge 
                variant="outline"
                className={
                  content.category === 'Anxiety Management' ? 'border-[hsl(var(--mood-windy))] text-[hsl(var(--mood-windy))]' :
                  content.category === 'Education' ? 'border-[hsl(var(--mood-cloudy))] text-[hsl(var(--mood-cloudy))]' :
                  content.category === 'Meditation' ? 'border-[hsl(var(--mood-sunny))] text-[hsl(var(--mood-sunny))]' :
                  content.category === 'Relaxation' ? 'border-[hsl(var(--mood-rainy))] text-[hsl(var(--mood-rainy))]' :
                  'border-[hsl(var(--wellness-primary))] text-[hsl(var(--wellness-primary))]'
                }
              >
                {content.category}
              </Badge>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]"
                  size="sm"
                >
                  <content.icon className="w-4 h-4 mr-2" />
                  {content.type === 'Video' ? 'Watch' : 
                   content.type === 'Audio' ? 'Listen' :
                   content.type === 'Exercise' ? 'Practice' : 'Read'}
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-[hsl(var(--wellness-primary))]" />
            Quick Wellness Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <Wind className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--mood-windy))]" />
              <h4 className="font-medium mb-2">Box Breathing</h4>
              <p className="text-sm text-muted-foreground mb-3">
                4-4-4-4 breathing pattern for instant calm
              </p>
              <Button size="sm" className="bg-[hsl(var(--mood-windy))] hover:bg-[hsl(var(--mood-windy)/0.9)]">
                Start Now
              </Button>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <Headphones className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--mood-sunny))]" />
              <h4 className="font-medium mb-2">Calming Sounds</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Nature sounds and white noise for focus
              </p>
              <Button size="sm" className="bg-[hsl(var(--mood-sunny))] hover:bg-[hsl(var(--mood-sunny)/0.9)]">
                Listen Now
              </Button>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--wellness-primary))]" />
              <h4 className="font-medium mb-2">Mood Journal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Guided prompts for emotional reflection
              </p>
              <Button size="sm" className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]">
                Start Writing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}