import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import contactHero from "@/assets/contact-hero.jpg";
import serviceIllustration from "@/assets/service-illustration.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Show success message
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image Section */}
          <div className="relative mb-12 rounded-2xl overflow-hidden shadow-large">
            <img 
              src={contactHero} 
              alt="Contact Us" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60 flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl">
                  Have questions? We'd love to hear from you.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-medium">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold">Email</h3>
                <p className="text-sm text-muted-foreground">info@pricepredict.com</p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-sm text-muted-foreground">+91 123 456 7890</p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold">Location</h3>
                <p className="text-sm text-muted-foreground">Mumbai, India</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="shadow-large">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Service Illustration */}
          <Card className="shadow-large overflow-hidden">
            <img 
              src={serviceIllustration} 
              alt="Our Services" 
              className="w-full h-full object-cover"
            />
          </Card>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
