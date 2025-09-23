import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Shield, Brain, MessageCircle, UserPlus, LogIn, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const { register, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await register(registerData.username, registerData.email, registerData.password);
    
    if (success) {
      toast({
        title: "Welcome to MindEase! 🎉",
        description: "Your mental wellness journey begins now.",
      });
    } else {
      toast({
        title: "Registration failed",
        description: "This email might already be taken. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Heart,
      title: "Daily Mood Tracking",
      description: "Monitor your emotional wellbeing with our intuitive mood tracker"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your mental health patterns"
    },
    {
      icon: Users,
      title: "Supportive Community",
      description: "Connect with peers in a safe, moderated environment"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Support",
      description: "Access emergency resources and professional help when needed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--wellness-secondary))] via-background to-[hsl(var(--mood-sunny)/0.1)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Hero Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <Badge className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)] text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Wellness Journey
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold">
              Welcome to{" "}
              <span className="text-[hsl(var(--wellness-primary))]">Mind</span>
              <span className="text-[hsl(var(--mood-sunny))]">Ease</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Your comprehensive mental wellness platform. Track your mood, connect with supportive peers, 
              and access professional resources - all in one safe space.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-[hsl(var(--wellness-primary)/0.2)] hover:bg-white/80 transition-colors"
              >
                <div className="p-2 rounded-lg bg-[hsl(var(--wellness-primary)/0.1)]">
                  <feature.icon className="w-5 h-5 text-[hsl(var(--wellness-primary))]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--wellness-primary))]">1000+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--mood-sunny))]">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--community))]">Safe</div>
              <div className="text-sm text-muted-foreground">& Moderated</div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--wellness-primary))] to-[hsl(var(--mood-sunny))] rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
              <p className="text-sm text-muted-foreground">Join thousands on their wellness journey</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="h-12 border-[hsl(var(--wellness-primary)/0.3)] focus:border-[hsl(var(--wellness-primary))] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="h-12 border-[hsl(var(--wellness-primary)/0.3)] focus:border-[hsl(var(--wellness-primary))] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="h-12 border-[hsl(var(--wellness-primary)/0.3)] focus:border-[hsl(var(--wellness-primary))] transition-colors"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[hsl(var(--wellness-primary))] to-[hsl(var(--mood-sunny))] hover:opacity-90 transition-opacity text-white font-semibold shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Start Your Journey
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[hsl(var(--wellness-primary)/0.2)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-[hsl(var(--wellness-primary)/0.3)] hover:bg-[hsl(var(--wellness-primary)/0.1)] transition-colors"
                onClick={() => navigate('/auth')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In Instead
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By signing up, you agree to our Terms of Service and Privacy Policy. 
                  Your mental health data is always private and secure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}