import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, History, Home, BarChart3, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dashboardBanner from "@/assets/dashboard-banner.jpg";
import aiIllustration from "@/assets/ai-illustration.jpg";
import analyticsVisual from "@/assets/analytics-visual.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={dashboardBanner} 
            alt="Dashboard analytics" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">{user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal dashboard for property price predictions and insights
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Total Predictions</p>
                    <p className="text-3xl font-bold text-primary">0</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-all hover:shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">This Month</p>
                    <p className="text-3xl font-bold text-accent">0</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Avg. Accuracy</p>
                    <p className="text-3xl font-bold text-primary">98%</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Visual Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-gradient-accent hover:shadow-accent text-accent-foreground"
                  size="lg"
                  onClick={() => navigate("/predict")}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  New Price Prediction
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-secondary"
                  size="lg"
                  onClick={() => navigate("/about")}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Learn About Our Model
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-secondary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                >
                  <History className="w-5 h-5 mr-2" />
                  Get Support
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="shadow-medium relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={aiIllustration} 
                  alt="AI technology" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex items-start gap-3 p-3 bg-gradient-card rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm">Advanced ML Algorithm</p>
                    <p className="text-sm text-muted-foreground">Using latest real estate market data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-card rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm">98% Prediction Accuracy</p>
                    <p className="text-sm text-muted-foreground">Validated across major Indian cities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-card rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm">Real-time Market Trends</p>
                    <p className="text-sm text-muted-foreground">Continuously updated pricing models</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-medium md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 relative">
                  <div className="absolute inset-0 opacity-5">
                    <img 
                      src={analyticsVisual} 
                      alt="Analytics dashboard" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="relative z-10">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No predictions yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Start your first prediction to see your activity here</p>
                    <Button 
                      onClick={() => navigate("/predict")}
                      className="bg-gradient-accent hover:shadow-accent text-accent-foreground"
                    >
                      Create Your First Prediction
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
