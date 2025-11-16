import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Home, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PredictionHistory {
  id: string;
  location_city: string;
  location_area: string;
  area: number;
  bhk: number;
  predicted_price: number;
  created_at: string;
}

const Analytics = () => {
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Price trend over time
  const priceTrendData = predictions
    .slice(0, 10)
    .reverse()
    .map((p, idx) => ({
      name: `P${idx + 1}`,
      price: Number(p.predicted_price) / 100000,
      date: new Date(p.created_at).toLocaleDateString(),
    }));

  // BHK distribution
  const bhkDistribution = predictions.reduce((acc, p) => {
    const bhkKey = `${p.bhk} BHK`;
    acc[bhkKey] = (acc[bhkKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bhkData = Object.entries(bhkDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // City-wise average prices
  const cityPrices = predictions.reduce((acc, p) => {
    if (!acc[p.location_city]) {
      acc[p.location_city] = { total: 0, count: 0 };
    }
    acc[p.location_city].total += Number(p.predicted_price);
    acc[p.location_city].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const cityData = Object.entries(cityPrices)
    .map(([city, data]) => ({
      city,
      avgPrice: data.total / data.count / 100000,
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .slice(0, 5);

  // Area vs Price scatter
  const areaVsPriceData = predictions.slice(0, 20).map((p) => ({
    area: Number(p.area),
    price: Number(p.predicted_price) / 100000,
    bhk: p.bhk,
  }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--chart-1))"];

  const chartConfig = {
    price: {
      label: "Price (Lac)",
      color: "hsl(var(--primary))",
    },
    area: {
      label: "Area (sq ft)",
      color: "hsl(var(--secondary))",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-6xl mx-auto text-center">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Predictions Yet</h2>
            <p className="text-muted-foreground">Make your first prediction to see analytics and insights!</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Market Analytics & Insights</h1>
            <p className="text-muted-foreground">
              Interactive visualizations of your prediction history and market trends
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{predictions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPrice(
                    predictions.reduce((sum, p) => sum + Number(p.predicted_price), 0) / predictions.length
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cities Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Set(predictions.map(p => p.location_city)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends">Price Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              {/* Price Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Price Trend Analysis
                  </CardTitle>
                  <CardDescription>Recent prediction prices over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                        <YAxis stroke="hsl(var(--foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* City-wise Average Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Top Cities by Average Price
                  </CardTitle>
                  <CardDescription>Average predicted prices across cities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--foreground))" />
                        <YAxis dataKey="city" type="category" stroke="hsl(var(--foreground))" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="avgPrice" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              {/* BHK Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Property Type Distribution
                  </CardTitle>
                  <CardDescription>Distribution of predictions by BHK configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bhkData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {bhkData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Area vs Price */}
              <Card>
                <CardHeader>
                  <CardTitle>Area vs Price Correlation</CardTitle>
                  <CardDescription>Relationship between property area and predicted price</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={areaVsPriceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="area" stroke="hsl(var(--foreground))" />
                        <YAxis stroke="hsl(var(--foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="price" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Prediction History
                  </CardTitle>
                  <CardDescription>Your recent property price predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictions.map((prediction) => (
                      <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{prediction.location_area}, {prediction.location_city}</span>
                            <Badge variant="outline">{prediction.bhk} BHK</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Number(prediction.area).toLocaleString()} sq ft • {new Date(prediction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(Number(prediction.predicted_price))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;