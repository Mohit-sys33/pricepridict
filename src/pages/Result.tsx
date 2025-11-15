import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Home, TrendingUp, MapPin, Bed, Bath } from "lucide-react";
import { useEffect } from "react";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, formData } = location.state || {};

  useEffect(() => {
    if (!prediction) {
      navigate("/predict");
    }
  }, [prediction, navigate]);

  if (!prediction) return null;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const priceCategory = prediction.predictedPrice < 5000000 ? "Low" : 
                       prediction.predictedPrice < 15000000 ? "Medium" : "High";

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/predict")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>

          {/* Main Result Card */}
          <Card className="shadow-large mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-hero text-primary-foreground">
              <CardTitle className="text-3xl text-center">Predicted Price</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="text-5xl md:text-6xl font-bold text-primary">
                  {formatPrice(prediction.predictedPrice)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={priceCategory === "Low" ? "secondary" : priceCategory === "Medium" ? "default" : "destructive"}>
                    {priceCategory} Range
                  </Badge>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Based on current market trends and property features in {formData.location.city}, {formData.location.district}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Property Summary */}
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Property Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{formData.location.city}, {formData.location.district}, {formData.location.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Bed className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Configuration</p>
                      <p className="font-semibold">{formData.bhk} BHK, {formData.bathroom} Bath</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold">{formData.area} sq ft</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-semibold">{formData.houseType || "Not specified"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Furnishing</p>
                    <p className="font-semibold">{formData.furnishing || "Not specified"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Amenities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.lift && <Badge variant="secondary">Lift</Badge>}
                      {formData.security && <Badge variant="secondary">Security</Badge>}
                      {formData.gym && <Badge variant="secondary">Gym</Badge>}
                      {formData.swimmingPool && <Badge variant="secondary">Pool</Badge>}
                      {formData.parking === "Yes" && <Badge variant="secondary">Parking</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Range Comparison */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Price Range Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Range</span>
                  <span className="font-semibold">{formatPrice(prediction.priceRange.low)}</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-hero"
                    style={{ 
                      width: `${((prediction.predictedPrice - prediction.priceRange.low) / 
                               (prediction.priceRange.high - prediction.priceRange.low)) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Range</span>
                  <span className="font-semibold">{formatPrice(prediction.priceRange.high)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-8">
            <Button 
              className="flex-1 bg-accent hover:bg-accent-light text-accent-foreground"
              onClick={() => navigate("/predict")}
            >
              Make Another Prediction
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Result;
