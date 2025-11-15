import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Database, LineChart, Shield } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import propertyShowcase from "@/assets/property-showcase.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">About PricePredict</h1>
            <p className="text-lg text-muted-foreground">
              Advanced AI-powered house price prediction system for the Indian real estate market
            </p>
          </div>

          {/* Team Illustration */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-large animate-fade-up">
            <img 
              src={aboutTeam} 
              alt="Our team working with property data and technology" 
              className="w-full h-auto"
            />
          </div>

          <Card className="shadow-large mb-8">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">What We Do</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PricePredict is a cutting-edge machine learning system designed to provide accurate house 
                  price predictions across major Indian cities. We analyze multiple property features including 
                  location, size, amenities, and market trends to deliver reliable price estimates.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">How It Works</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our system uses advanced regression algorithms trained on extensive real estate data. 
                  By considering factors like property location, square footage, number of rooms, amenities, 
                  and local market conditions, we generate highly accurate price predictions that help you 
                  make informed decisions.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-medium">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Machine Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by state-of-the-art ML algorithms including Random Forest and Linear Regression 
                  models for optimal accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">Comprehensive Data</h3>
                <p className="text-sm text-muted-foreground">
                  Trained on thousands of real property transactions across Delhi, Mumbai, Bengaluru, 
                  and other major cities.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time market trend analysis and comparative pricing insights for better decision making.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is secure and private. We never store or share your property information 
                  with third parties.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Property Showcase Visual */}
          <Card className="shadow-large mb-8 overflow-hidden">
            <CardContent className="pt-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-3">Why Choose Us?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We combine cutting-edge technology with deep understanding of the Indian real estate 
                  market to provide you with the most reliable price predictions. Our commitment is to 
                  empower your property decisions with data-driven insights.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-medium">
                <img 
                  src={propertyShowcase} 
                  alt="Modern luxury property showcase" 
                  className="w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-large bg-gradient-hero text-primary-foreground">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent-light font-bold">✓</span>
                  <span>Support for 6 major Indian cities with plans to expand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-light font-bold">✓</span>
                  <span>Analysis of 15+ property features and amenities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-light font-bold">✓</span>
                  <span>Instant predictions with 98% accuracy rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-light font-bold">✓</span>
                  <span>Price range analysis for better understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-light font-bold">✓</span>
                  <span>Free to use with no hidden charges</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
