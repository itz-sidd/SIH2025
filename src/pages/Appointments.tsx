import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Star, Phone, Video, MessageCircle } from "lucide-react";

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Student Life"],
    rating: 4.9,
    reviews: 156,
    availability: "Available Today",
    location: "Campus Health Center",
    sessionTypes: ["In-Person", "Video Call"],
    price: "$80/session",
    image: "👩‍⚕️"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Licensed Counselor",
    specialties: ["Stress Management", "Academic Pressure", "CBT"],
    rating: 4.8,
    reviews: 203,
    availability: "Next Available: Tomorrow",
    location: "Student Counseling Center",
    sessionTypes: ["In-Person", "Video Call", "Phone"],
    price: "$75/session",
    image: "👨‍⚕️"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Psychiatrist",
    specialties: ["Medication Management", "Mood Disorders", "ADHD"],
    rating: 4.9,
    reviews: 89,
    availability: "Available This Week",
    location: "University Medical Center",
    sessionTypes: ["In-Person", "Video Call"],
    price: "$120/session",
    image: "👩‍⚕️"
  }
];

const upcomingAppointments = [
  {
    id: 1,
    counselor: "Dr. Sarah Johnson",
    date: "Tomorrow",
    time: "2:00 PM",
    type: "Video Call",
    duration: "50 minutes"
  }
];

export default function Appointments() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Appointments</h1>
        <p className="text-muted-foreground">
          Connect with qualified mental health professionals
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-[hsl(var(--wellness-primary))] text-white">
            <User className="w-3 h-3 mr-1" />
            Licensed Professionals
          </Badge>
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            Flexible Scheduling
          </Badge>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card className="mb-6 border-[hsl(var(--wellness-primary)/0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--wellness-primary))]">
              <Calendar className="w-5 h-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--wellness-primary))] flex items-center justify-center text-white font-bold">
                    {appointment.counselor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{appointment.counselor}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time} ({appointment.duration})
                      </span>
                      <Badge variant="outline">
                        {appointment.type === 'Video Call' && <Video className="w-3 h-3 mr-1" />}
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Join Session</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Counselors */}
      <div className="grid lg:grid-cols-3 gap-6">
        {counselors.map((counselor) => (
          <Card key={counselor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="text-4xl">{counselor.image}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{counselor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{counselor.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[hsl(var(--mood-sunny))]" />
                      <span className="text-sm font-medium">{counselor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({counselor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Availability */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--wellness-primary))]" />
                <span className="text-sm font-medium text-[hsl(var(--wellness-primary))]">
                  {counselor.availability}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{counselor.location}</span>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-sm font-medium mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-1">
                  {counselor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Session Types */}
              <div>
                <h4 className="text-sm font-medium mb-2">Available Sessions:</h4>
                <div className="flex flex-wrap gap-1">
                  {counselor.sessionTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type === 'Video Call' && <Video className="w-3 h-3 mr-1" />}
                      {type === 'Phone' && <Phone className="w-3 h-3 mr-1" />}
                      {type === 'In-Person' && <User className="w-3 h-3 mr-1" />}
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="text-center py-2">
                <span className="text-lg font-bold text-[hsl(var(--wellness-primary))]">
                  {counselor.price}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--wellness-primary)/0.1)] flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-[hsl(var(--wellness-primary))]" />
              </div>
              <h4 className="font-medium mb-2">1. Choose Your Counselor</h4>
              <p className="text-sm text-muted-foreground">
                Browse profiles, specialties, and availability to find the right fit
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--wellness-primary)/0.1)] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-[hsl(var(--wellness-primary))]" />
              </div>
              <h4 className="font-medium mb-2">2. Schedule Your Session</h4>
              <p className="text-sm text-muted-foreground">
                Pick a convenient time and choose your preferred session format
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--wellness-primary)/0.1)] flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-[hsl(var(--wellness-primary))]" />
              </div>
              <h4 className="font-medium mb-2">3. Attend Your Session</h4>
              <p className="text-sm text-muted-foreground">
                Join securely through our platform or meet in person
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}