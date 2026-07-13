import { QUOTE_MATERIALS } from '@/lib/quote/materials';

function round2(value) {
  return Math.round(value * 100) / 100;
}

export function resolveTierIndex(weightG, breakpoints = [50, 100]) {
  if (weightG <= breakpoints[0]) return 0;
  return 1;
}

function getTierRate(tier, discountsEnabled, materialDiscountEnabled) {
  const discountApplied = Boolean(discountsEnabled && materialDiscountEnabled);
  return discountApplied ? tier.discountedPricePerGram : tier.regularPricePerGram;
}

export function mapApiMaterialToQuote(material) {
  return {
    id: material.quoteId,
    slug: material.slug,
    name: material.name.split(' ')[0] || material.name,
    fullName: material.name,
    tag: material.displayTag || '',
    density: material.density,
    tiers: material.tiers || [],
    discountEnabled: Boolean(material.discountEnabled),
    stockStatus: material.stockStatus,
  };
}

export function mapFallbackMaterials() {
  return QUOTE_MATERIALS.map((material) => ({
    ...material,
    fullName: material.name,
    tiers: [
      { maxWeightG: 50, regularPricePerGram: material.costPerGram, discountedPricePerGram: material.costPerGram },
      { maxWeightG: 100, regularPricePerGram: material.costPerGram, discountedPricePerGram: material.costPerGram },
    ],
    discountEnabled: false,
  }));
}

export function calculateQuote({
  volumeCm3,
  material,
  discountsEnabled = false,
  weightBreakpointsG = [50, 100],
}) {
  const weight = volumeCm3 * material.density;

  if (material.tiers?.length) {
    const tierIndex = resolveTierIndex(weight, weightBreakpointsG);
    const tier = material.tiers[tierIndex];
    const rate = getTierRate(tier, discountsEnabled, material.discountEnabled);
    const regularRate = tier.regularPricePerGram;
    const discountApplied = Boolean(discountsEnabled && material.discountEnabled);

    return {
      estimatedWeight: round2(weight),
      totalCost: round2(weight * rate),
      regularTotal: round2(weight * regularRate),
      pricePerGram: round2(rate),
      discountApplied,
      tierIndex,
    };
  }

  const totalCost = weight * (material.costPerGram || 0);
  return {
    estimatedWeight: round2(weight),
    totalCost: round2(totalCost),
    regularTotal: round2(totalCost),
    pricePerGram: round2(material.costPerGram || 0),
    discountApplied: false,
    tierIndex: 0,
  };
}

export function estimateWeightCost(weightG, material, discountsEnabled, weightBreakpointsG = [50, 100]) {
  const tierIndex = resolveTierIndex(weightG, weightBreakpointsG);
  const tier = material.tiers?.[tierIndex];
  if (!tier) return null;

  const rate = getTierRate(tier, discountsEnabled, material.discountEnabled);
  return round2(weightG * rate);
}

export function getDisplayRate(material, weightBreakpointsG = [50, 100], sampleWeight = 50) {
  const tier = material.tiers?.[resolveTierIndex(sampleWeight, weightBreakpointsG)];
  if (!tier) return material.costPerGram ?? 0;

  return tier.regularPricePerGram;
}

export function formatWeightEstimate(weightG, material, discountsEnabled, weightBreakpointsG = [50, 100]) {
  const tier = material.tiers?.[resolveTierIndex(weightG, weightBreakpointsG)];
  if (!tier) return null;

  const regular = round2(weightG * tier.regularPricePerGram);
  const discountActive = Boolean(discountsEnabled && material.discountEnabled);
  if (!discountActive) return String(regular);

  const discounted = round2(weightG * tier.discountedPricePerGram);
  if (discounted >= regular) return String(regular);

  return `${regular}(${discounted} Discounted)`;
}
