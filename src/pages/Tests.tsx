import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Star, CheckCircle } from "lucide-react";

const assessments = [
  {
    id: 1,
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description: "Measures depression severity over the past 2 weeks",
    questions: 9,
    duration: "5 minutes",
    difficulty: "Easy",
    category: "Depression",
    lastTaken: null,
    validated: true
  },
  {
    id: 2,
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder Scale",
    description: "Assesses anxiety symptoms and severity",
    questions: 7,
    duration: "3 minutes", 
    difficulty: "Easy",
    category: "Anxiety",
    lastTaken: "2024-01-15",
    validated: true
  },
  {
    id: 3,
    name: "GHQ-12",
    fullName: "General Health Questionnaire-12",
    description: "Evaluates overall psychological well-being",
    questions: 12,
    duration: "7 minutes",
    difficulty: "Medium",
    category: "General Wellness",
    lastTaken: null,
    validated: true
  },
  {
    id: 4,
    name: "DASS-21",
    fullName: "Depression, Anxiety & Stress Scale",
    description: "Comprehensive assessment of depression, anxiety, and stress",
    questions: 21,
    duration: "10 minutes",
    difficulty: "Medium",
    category: "Comprehensive",
    lastTaken: null,
    validated: true
  },
  {
    id: 5,
    name: "Wellness Check",
    fullName: "Daily Wellness Assessment",
    description: "Quick daily check-in for mood and energy levels",
    questions: 5,
    duration: "2 minutes",
    difficulty: "Easy", 
    category: "Daily Check",
    lastTaken: "Today",
    validated: false
  }
];

export default function Tests() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Assessments</h1>
        <p className="text-muted-foreground">
          Self-assessment tools to help understand your mental health and track progress
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-[hsl(var(--wellness-primary))] text-white">
            <Star className="w-3 h-3 mr-1" />
            Scientifically Validated
          </Badge>
          <Badge variant="outline">
            <FileText className="w-3 h-3 mr-1" />
            5 Available Tests
          </Badge>
        </div>
      </div>

      {/* Important Notice */}
      <Card className="mb-6 border-[hsl(var(--mood-sunny)/0.3)] bg-[hsl(var(--mood-sunny)/0.05)]">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-[hsl(var(--mood-sunny))] mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Important Information</h3>
              <div className="text-sm space-y-2">
                <p>• These assessments are for educational and self-awareness purposes only</p>
                <p>• Results do not constitute a clinical diagnosis</p>
                <p>• Please consult with a healthcare professional for proper evaluation</p>
                <p>• All responses are confidential and stored securely</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-1">{assessment.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">
                    {assessment.fullName}
                  </p>
                </div>
                {assessment.validated && (
                  <Badge className="bg-[hsl(var(--wellness-primary))] text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Validated
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">{assessment.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {assessment.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {assessment.duration}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline"
                  className={
                    assessment.category === 'Depression' ? 'border-[hsl(var(--mood-rainy))] text-[hsl(var(--mood-rainy))]' :
                    assessment.category === 'Anxiety' ? 'border-[hsl(var(--mood-windy))] text-[hsl(var(--mood-windy))]' :
                    assessment.category === 'General Wellness' ? 'border-[hsl(var(--mood-cloudy))] text-[hsl(var(--mood-cloudy))]' :
                    assessment.category === 'Daily Check' ? 'border-[hsl(var(--mood-sunny))] text-[hsl(var(--mood-sunny))]' :
                    'border-[hsl(var(--wellness-primary))] text-[hsl(var(--wellness-primary))]'
                  }
                >
                  {assessment.category}
                </Badge>
                <Badge variant="secondary">
                  {assessment.difficulty}
                </Badge>
              </div>

              {assessment.lastTaken && (
                <div className="text-sm text-muted-foreground">
                  Last taken: {assessment.lastTaken === 'Today' ? 'Today' : new Date(assessment.lastTaken!).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]"
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {assessment.lastTaken ? 'Retake Test' : 'Start Test'}
                </Button>
                {assessment.lastTaken && (
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Complete your first assessment to see your history here</p>
            <p className="text-sm mt-2">Track your progress over time with detailed charts and insights</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}