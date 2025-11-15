import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, Award, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-house.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Predict Your <span className="bg-gradient-hero bg-clip-text text-transparent">Dream Home's</span> Price
              </h1>
              <p className="text-lg text-muted-foreground">
                Get accurate house price predictions powered by advanced machine learning algorithms. 
                Make informed decisions with confidence.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-accent hover:shadow-accent text-accent-foreground shadow-medium transition-all hover:scale-105"
                  onClick={() => navigate("/predict")}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Predict Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="hover:bg-secondary hover:scale-105 transition-all"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Modern house architecture" 
                className="rounded-2xl shadow-large w-full h-auto relative z-10 hover:shadow-glow transition-all duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-hero text-primary-foreground p-6 rounded-xl shadow-glow animate-float">
                <p className="text-sm font-semibold">AI-Powered</p>
                <p className="text-3xl font-bold">98% Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose PricePredict?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Smart Algorithm</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced ML models trained on extensive real estate data
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">Market Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time market trends and comparative analysis
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Accurate Results</h3>
                <p className="text-sm text-muted-foreground">
                  98% prediction accuracy across major Indian cities
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">Secure & Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Instant predictions with complete data privacy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Discover Your Home's Worth?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Get started now and receive an instant, accurate price prediction for any property in India
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-light text-accent-foreground shadow-large"
            onClick={() => navigate("/predict")}
          >
            Start Prediction
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
