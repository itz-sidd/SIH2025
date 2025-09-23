import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Users, Shield, Brain, MessageCircle, LogIn, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function SigninPage() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated  
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      toast({
        title: "Welcome back! 🎉",
        description: "Successfully signed in to MindEase.",
      });
    } else {
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Heart,
      title: "Track Your Journey",
      description: "Continue monitoring your emotional wellbeing with detailed insights"
    },
    {
      icon: Brain,
      title: "Personalized Support",
      description: "AI recommendations tailored to your mental health patterns"
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Rejoin conversations with your supportive peer network"
    },
    {
      icon: Shield,
      title: "Always Available",
      description: "24/7 access to crisis resources and professional guidance"
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
              Welcome Back
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold">
              Continue Your{" "}
              <span className="text-[hsl(var(--wellness-primary))]">Wellness</span>{" "}
              <span className="text-[hsl(var(--mood-sunny))]">Journey</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Sign back in to access your mental health dashboard, connect with your support network, 
              and continue building healthier habits with MindEase.
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

        {/* Right Side - Signin Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 w-16 h-16 bg-gradient-to-br from-[hsl(var(--wellness-primary))] to-[hsl(var(--mood-sunny))] rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-sm text-muted-foreground">Sign in to continue your wellness journey</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-12 border-[hsl(var(--wellness-primary)/0.3)] focus:border-[hsl(var(--wellness-primary))] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[hsl(var(--wellness-primary)/0.2)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">New to MindEase?</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-[hsl(var(--wellness-primary)/0.3)] hover:bg-[hsl(var(--wellness-primary)/0.1)] transition-colors"
                onClick={() => navigate('/')}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Button>

              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-sm text-[hsl(var(--wellness-primary))] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Home
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your mental health data is always private and secure with end-to-end encryption.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}