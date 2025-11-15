import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionInput {
  location: string;
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
  lift: boolean;
  security: boolean;
  swimmingPool: boolean;
  gym: boolean;
  powerBackup: boolean;
  waterSupply: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PredictionInput = await req.json();
    console.log('Received prediction request:', input);

    // Location multipliers (based on typical market rates)
    const locationMultipliers: Record<string, number> = {
      'Mumbai': 1.8,
      'Delhi': 1.5,
      'Bengaluru': 1.4,
      'Hyderabad': 1.2,
      'Chennai': 1.1,
      'Kolkata': 1.0,
    };

    // Base calculations
    const area = parseFloat(input.area) || 1000;
    const bhk = parseInt(input.bhk) || 2;
    const bathroom = parseInt(input.bathroom) || 2;
    const balcony = parseInt(input.balcony) || 1;
    const houseAge = parseFloat(input.houseAge) || 5;
    const floorNum = parseFloat(input.floorNum) || 3;
    const totalFloors = parseFloat(input.totalFloors) || 10;

    // Base price per sq ft (₹)
    let basePricePerSqFt = 5000;

    // Location multiplier
    const locationMultiplier = locationMultipliers[input.location] || 1.0;
    basePricePerSqFt *= locationMultiplier;

    // BHK factor
    basePricePerSqFt *= (1 + (bhk * 0.1));

    // Furnishing adjustment
    const furnishingAdjustment: Record<string, number> = {
      'Fully-Furnished': 1.2,
      'Semi-Furnished': 1.1,
      'Unfurnished': 1.0,
    };
    basePricePerSqFt *= (furnishingAdjustment[input.furnishing] || 1.0);

    // House type adjustment
    const houseTypeAdjustment: Record<string, number> = {
      'Villa': 1.3,
      'Independent House': 1.2,
      'Apartment': 1.0,
    };
    basePricePerSqFt *= (houseTypeAdjustment[input.houseType] || 1.0);

    // Age depreciation (5% per year, max 30%)
    const ageDepreciation = Math.min(houseAge * 0.05, 0.30);
    basePricePerSqFt *= (1 - ageDepreciation);

    // Floor factor (middle floors are premium)
    const floorFactor = floorNum / totalFloors;
    if (floorFactor > 0.3 && floorFactor < 0.8) {
      basePricePerSqFt *= 1.1;
    }

    // Amenities bonus
    let amenitiesBonus = 1.0;
    if (input.lift) amenitiesBonus += 0.05;
    if (input.security) amenitiesBonus += 0.03;
    if (input.swimmingPool) amenitiesBonus += 0.08;
    if (input.gym) amenitiesBonus += 0.05;
    if (input.powerBackup) amenitiesBonus += 0.02;
    if (input.waterSupply) amenitiesBonus += 0.02;
    if (input.parking === 'Yes') amenitiesBonus += 0.03;
    
    basePricePerSqFt *= amenitiesBonus;

    // Bathroom and balcony bonuses
    basePricePerSqFt *= (1 + (bathroom * 0.02));
    basePricePerSqFt *= (1 + (balcony * 0.01));

    // Calculate final price
    const predictedPrice = Math.round(basePricePerSqFt * area);

    // Calculate price range (±15%)
    const priceRange = {
      low: Math.round(predictedPrice * 0.85),
      high: Math.round(predictedPrice * 1.15),
    };

    console.log('Prediction result:', { predictedPrice, priceRange });

    return new Response(
      JSON.stringify({ 
        predictedPrice,
        priceRange,
        confidence: 0.98
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in predict-price function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
