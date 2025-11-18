import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, MapPin, Bed, Bath, Maximize, Shield, Dumbbell, Zap, Waves } from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: company } = useQuery({
    queryKey: ["property-company", property?.company_id],
    enabled: !!property?.company_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", property!.company_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const title = property
      ? `${Number(property.predicted_price).toLocaleString("en-IN")} | ${property.location_area}, ${property.location_city}`
      : "Property Details";
    document.title = title;

    const desc = property
      ? `View property details and price for ${property.location_area}, ${property.location_city}.`
      : "View property details";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
  }, [property]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Skeleton className="h-10 w-40 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate("/companies")}>Back to Companies</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button variant="ghost" className="mb-6" onClick={() => company ? navigate(`/company/${company.id}`) : navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {company ? `Back to ${company.name}` : "Back"}
        </Button>

        <Card className="shadow-large">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-1">
                  {formatPrice(Number(property.predicted_price))}
                </CardTitle>
                <p className="text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location_area}, {property.location_city}
                </p>
              </div>
              {property.house_type && (
                <Badge variant="secondary" className="capitalize h-8">{String(property.house_type).replace("_"," ")}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Area</div>
                    <div className="font-semibold flex items-center"><Maximize className="w-4 h-4 mr-2" /> {property.area} sqft</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Configuration</div>
                    <div className="font-semibold flex items-center"><Bed className="w-4 h-4 mr-2" /> {property.bhk} BHK</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="font-semibold flex items-center"><Bath className="w-4 h-4 mr-2" /> {property.bathroom}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Parking</div>
                    <div className="font-semibold">{property.parking ?? 0}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Floor</div>
                    <div className="font-semibold">{property.floor_num ?? "-"} / {property.total_floors ?? "-"}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground">Furnishing</div>
                    <div className="font-semibold capitalize">{String(property.furnishing || "-")}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card/60 border">
                  <div className="text-sm text-muted-foreground mb-2">Amenities</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Security: {property.security ? "Yes" : "No"}</div>
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Power Backup: {property.power_backup ? "Yes" : "No"}</div>
                    <div className="flex items-center gap-2"><Waves className="w-4 h-4" /> Water Supply: {property.water_supply ? "Yes" : "No"}</div>
                    <div className="flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Gym: {property.gym ? "Yes" : "No"}</div>
                  </div>
                </div>

                {company && (
                  <div className="p-4 rounded-lg bg-card/60 border">
                    <div className="text-sm text-muted-foreground mb-2">Company</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{company.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{company.type}</div>
                      </div>
                      <Button variant="outline" onClick={() => navigate(`/company/${company.id}`)}>View Company</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
