import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface LocationData {
  state: string;
  district: string;
  city: string;
  area: string;
}

interface PredictionFormData {
  location: LocationData;
  area: string;
  bhk: string;
  bathroom: string;
  balcony: string;
  furnishing: string;
  parking: string;
  houseAge: string;
  houseType: string;
  floorNum: string;
  totalFloors: string;
  companyId: string;
  lift: boolean;
  security: boolean;
  swimmingPool: boolean;
  gym: boolean;
  powerBackup: boolean;
  waterSupply: boolean;
}

const Predict = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionFormData>({
    location: { state: "", district: "", city: "", area: "" },
    area: "",
    bhk: "",
    bathroom: "",
    balcony: "",
    furnishing: "",
    parking: "",
    houseAge: "",
    houseType: "",
    floorNum: "",
    totalFloors: "",
    companyId: "",
    lift: false,
    security: false,
    swimmingPool: false,
    gym: false,
    powerBackup: false,
    waterSupply: false,
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.location.state || !formData.location.city || !formData.area || !formData.bhk || !formData.bathroom) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("predict-price", {
        body: formData,
      });

      if (error) throw error;

      // Save prediction to history
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data.predictedPrice) {
        await supabase.from("prediction_history").insert({
          user_id: user.id,
          location_state: formData.location.state,
          location_district: formData.location.district || null,
          location_city: formData.location.city,
          location_area: formData.location.area,
          area: parseFloat(formData.area),
          bhk: parseInt(formData.bhk),
          bathroom: parseInt(formData.bathroom),
          balcony: formData.balcony ? parseInt(formData.balcony) : null,
          furnishing: formData.furnishing || null,
          parking: formData.parking ? parseInt(formData.parking) : null,
          house_age: formData.houseAge ? parseInt(formData.houseAge) : null,
          house_type: formData.houseType || null,
          floor_num: formData.floorNum ? parseInt(formData.floorNum) : null,
          total_floors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          company_id: formData.companyId || null,
          lift: formData.lift,
          security: formData.security,
          swimming_pool: formData.swimmingPool,
          gym: formData.gym,
          power_backup: formData.powerBackup,
          water_supply: formData.waterSupply,
          predicted_price: data.predictedPrice,
        });
      }

      // Navigate to result page with prediction data
      navigate("/result", { state: { prediction: data, formData } });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Unable to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">House Price Prediction</h1>
            <p className="text-muted-foreground">
              Enter your property details to get an accurate price estimate
            </p>
          </div>

          <Card className="shadow-large">
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Fill in all the information about the property for accurate prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <LocationAutocomplete
                      value={formData.location.state ? formData.location : null}
                      onLocationSelect={(location) =>
                        setFormData({ ...formData, location })
                      }
                    />

                    <div className="space-y-2">
                      <Label htmlFor="area">Area (sq ft) *</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bhk">BHK *</Label>
                      <Select value={formData.bhk} onValueChange={(value) => setFormData({ ...formData, bhk: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 BHK</SelectItem>
                          <SelectItem value="2">2 BHK</SelectItem>
                          <SelectItem value="3">3 BHK</SelectItem>
                          <SelectItem value="4">4 BHK</SelectItem>
                          <SelectItem value="5">5+ BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathroom">Bathrooms *</Label>
                      <Select value={formData.bathroom} onValueChange={(value) => setFormData({ ...formData, bathroom: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of bathrooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="balcony">Balconies</Label>
                      <Select value={formData.balcony} onValueChange={(value) => setFormData({ ...formData, balcony: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of balconies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Property Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="furnishing">Furnishing Status</Label>
                      <Select value={formData.furnishing} onValueChange={(value) => setFormData({ ...formData, furnishing: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fully-Furnished">Fully Furnished</SelectItem>
                          <SelectItem value="Semi-Furnished">Semi Furnished</SelectItem>
                          <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parking">Parking</Label>
                      <Select value={formData.parking} onValueChange={(value) => setFormData({ ...formData, parking: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Parking availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="houseAge">Age of Property (years)</Label>
                      <Input
                        id="houseAge"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.houseAge}
                        onChange={(e) => setFormData({ ...formData, houseAge: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="houseType">Type of House</Label>
                      <Select value={formData.houseType} onValueChange={(value) => setFormData({ ...formData, houseType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select house type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Independent House">Independent House</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floorNum">Floor Number</Label>
                      <Input
                        id="floorNum"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.floorNum}
                        onChange={(e) => setFormData({ ...formData, floorNum: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalFloors">Total Floors</Label>
                      <Input
                        id="totalFloors"
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company">Company/Builder/Agency</Label>
                      <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company (optional)" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {companies?.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name} ({company.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Amenities</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lift"
                        checked={formData.lift}
                        onCheckedChange={(checked) => setFormData({ ...formData, lift: checked as boolean })}
                      />
                      <Label htmlFor="lift" className="cursor-pointer">Lift</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="security"
                        checked={formData.security}
                        onCheckedChange={(checked) => setFormData({ ...formData, security: checked as boolean })}
                      />
                      <Label htmlFor="security" className="cursor-pointer">Security</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="swimmingPool"
                        checked={formData.swimmingPool}
                        onCheckedChange={(checked) => setFormData({ ...formData, swimmingPool: checked as boolean })}
                      />
                      <Label htmlFor="swimmingPool" className="cursor-pointer">Swimming Pool</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gym"
                        checked={formData.gym}
                        onCheckedChange={(checked) => setFormData({ ...formData, gym: checked as boolean })}
                      />
                      <Label htmlFor="gym" className="cursor-pointer">Gym</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="powerBackup"
                        checked={formData.powerBackup}
                        onCheckedChange={(checked) => setFormData({ ...formData, powerBackup: checked as boolean })}
                      />
                      <Label htmlFor="powerBackup" className="cursor-pointer">Power Backup</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="waterSupply"
                        checked={formData.waterSupply}
                        onCheckedChange={(checked) => setFormData({ ...formData, waterSupply: checked as boolean })}
                      />
                      <Label htmlFor="waterSupply" className="cursor-pointer">Water Supply</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    "Get Price Prediction"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Predict;
