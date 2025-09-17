import { Phone, MessageCircle, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const emergencyContacts = [
  {
    name: "Crisis Helpline",
    number: "988",
    description: "24/7 Crisis support",
    type: "national"
  },
  {
    name: "Campus Counseling",
    number: "(555) 123-HELP",
    description: "On-campus mental health services",
    type: "campus"
  },
  {
    name: "Emergency Services",
    number: "911",
    description: "Immediate medical emergency",
    type: "emergency"
  },
  {
    name: "Text Crisis Line",
    number: "Text HOME to 741741",
    description: "Crisis support via text",
    type: "text"
  }
];

const campusResources = [
  {
    name: "Student Counseling Center",
    location: "Student Union Building, 2nd Floor",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    phone: "(555) 123-4567",
    services: ["Individual counseling", "Group therapy", "Crisis intervention"]
  },
  {
    name: "Health & Wellness Center",
    location: "Campus Health Building",
    hours: "Mon-Fri: 7:30 AM - 5:30 PM",
    phone: "(555) 123-4568",
    services: ["Medical care", "Psychiatric services", "Wellness programs"]
  },
  {
    name: "Peer Support Center",
    location: "Residence Hall Commons",
    hours: "Daily: 6:00 PM - 12:00 AM",
    phone: "(555) 123-4569",
    services: ["Peer counseling", "Study groups", "Social events"]
  }
];

export default function Emergency() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\D/g, '')}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-[hsl(var(--emergency))]" />
          <h1 className="text-3xl font-bold text-foreground">Emergency Help</h1>
        </div>
        <p className="text-muted-foreground">Immediate support when you need it most</p>
      </div>

      {/* Crisis Warning */}
      <Card className="mb-6 border-[hsl(var(--emergency))] bg-[hsl(var(--emergency)/0.05)]">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[hsl(var(--emergency))] mt-1" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--emergency))] mb-2">
                If you're having thoughts of self-harm or suicide
              </h3>
              <p className="text-sm mb-4">
                Please reach out immediately. You are not alone, and help is available right now.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => handleCall('988')}
                  className="bg-[hsl(var(--emergency))] hover:bg-[hsl(var(--emergency)/0.9)]"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 988 Now
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Text Crisis Line
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Contacts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {emergencyContacts.map((contact, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {contact.type === 'emergency' && <AlertTriangle className="w-5 h-5 text-[hsl(var(--emergency))]" />}
                {contact.type === 'text' && <MessageCircle className="w-5 h-5 text-[hsl(var(--community))]" />}
                {(contact.type === 'national' || contact.type === 'campus') && <Phone className="w-5 h-5 text-[hsl(var(--wellness-primary))]" />}
                {contact.name}
              </CardTitle>
              <Badge 
                variant="outline"
                className={
                  contact.type === 'emergency' ? 'border-[hsl(var(--emergency))] text-[hsl(var(--emergency))]' :
                  contact.type === 'text' ? 'border-[hsl(var(--community))] text-[hsl(var(--community))]' :
                  'border-[hsl(var(--wellness-primary))] text-[hsl(var(--wellness-primary))]'
                }
              >
                {contact.type === 'emergency' ? '24/7 Emergency' :
                 contact.type === 'text' ? 'Text Support' :
                 contact.type === 'national' ? '24/7 National' : 'Campus'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{contact.description}</p>
              <Button 
                onClick={() => handleCall(contact.number)}
                className={`w-full ${
                  contact.type === 'emergency' ? 'bg-[hsl(var(--emergency))] hover:bg-[hsl(var(--emergency)/0.9)]' :
                  contact.type === 'text' ? 'bg-[hsl(var(--community))] hover:bg-[hsl(var(--community)/0.9)]' :
                  'bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary)/0.9)]'
                }`}
                size="sm"
              >
                {contact.type === 'text' ? (
                  <MessageCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Phone className="w-4 h-4 mr-2" />
                )}
                {contact.number}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campus Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Campus Resources</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {campusResources.map((resource, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{resource.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{resource.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{resource.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Services:</h4>
                  <div className="space-y-1">
                    {resource.services.map((service, serviceIndex) => (
                      <Badge key={serviceIndex} variant="secondary" className="mr-2 mb-1 text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleCall(resource.phone)}
                    size="sm"
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}