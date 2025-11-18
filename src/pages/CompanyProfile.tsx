import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Bed, Bath, Maximize, ArrowLeft, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["company-properties", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProperties = properties?.filter((property) => {
    const price = Number(property.predicted_price);
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && price < 5000000) ||
      (priceFilter === "mid" && price >= 5000000 && price < 10000000) ||
      (priceFilter === "high" && price >= 10000000);
    
    const matchesLocation = 
      !locationFilter || 
      property.location_city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      property.location_area?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      property.house_type === typeFilter;
    
    return matchesPrice && matchesLocation && matchesType;
  });

  const formatPrice = (price: number) => {
    const crore = price / 10000000;
    const lakh = price / 100000;
    
    if (crore >= 1) {
      return `₹${crore.toFixed(2)} Cr`;
    } else {
      return `₹${lakh.toFixed(2)} L`;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <main className="container mx-auto px-4 py-8 mt-20">
          <Skeleton className="h-8 w-32 mb-8" />
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <main className="container mx-auto px-4 py-8 mt-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Company not found</h1>
          <Button onClick={() => navigate("/companies")}>Back to Companies</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/companies")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Button>

        {/* Company Header */}
        <Card className="mb-8 bg-card/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-3xl">{company.name}</CardTitle>
                  <Badge className="capitalize">{getTypeLabel(company.type)}</Badge>
                </div>
                <CardDescription className="text-base mb-4">
                  {company.description}
                </CardDescription>
                <div className="flex gap-4">
                  <Button>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Company
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Enquiry
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Filter Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">Under ₹50L</SelectItem>
                    <SelectItem value="mid">₹50L - ₹1Cr</SelectItem>
                    <SelectItem value="high">Above ₹1Cr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Search location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="independent_house">Independent House</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Properties ({filteredProperties?.length || 0})
          </h2>
        </div>

        {propertiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-all duration-300 hover-scale">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary/40" />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">
                      {formatPrice(Number(property.predicted_price))}
                    </h3>
                    <Badge variant="secondary" className="capitalize">
                      {property.house_type?.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {property.location_area}, {property.location_city}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bhk} BHK</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathroom} Bath</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className="w-4 h-4 mr-1" />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => navigate(`/property/${property.id}`)}>View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                {properties?.length === 0 
                  ? "This company hasn't listed any properties yet"
                  : "Try adjusting your filters"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile;