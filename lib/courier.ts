import { CourierCalculationResult, StoreSettings } from './types';

export function calculateCourierFee(
  subtotal: number,
  settings?: Partial<StoreSettings> | null
): CourierCalculationResult {
  const baseFee = settings?.baseCourierPrice ?? 600;
  const tier1Min = settings?.courierDiscountTier1Min ?? 25000;
  const tier1Rate = settings?.courierDiscountTier1Rate ?? 50; // 50% off
  const tier2Min = settings?.courierDiscountTier2Min ?? 50000;
  const tier2Rate = settings?.courierDiscountTier2Rate ?? 100; // 100% free

  if (subtotal <= 0) {
    return {
      baseFee,
      discountRate: 0,
      discountAmount: 0,
      finalCourierFee: baseFee,
      isDiscountTier1: false,
      isDiscountTier2: false,
      amountNeededForNextTier: tier1Min,
      nextTierDiscount: tier1Rate,
      message: `Add Rs. ${tier1Min.toLocaleString()} to get ${tier1Rate}% OFF courier!`,
    };
  }

  // Tier 2: >= 50,000 (100% Free Courier)
  if (subtotal >= tier2Min) {
    const discountAmount = (baseFee * tier2Rate) / 100;
    const finalCourierFee = Math.max(0, baseFee - discountAmount);
    return {
      baseFee,
      discountRate: tier2Rate,
      discountAmount,
      finalCourierFee,
      isDiscountTier1: false,
      isDiscountTier2: true,
      amountNeededForNextTier: 0,
      nextTierDiscount: 0,
      message: '🎉 Congratulations! You unlocked 100% FREE Courier Delivery nationwide!',
    };
  }

  // Tier 1: > 25,000 (50% OFF Courier)
  if (subtotal > tier1Min) {
    const discountAmount = (baseFee * tier1Rate) / 100;
    const finalCourierFee = Math.max(0, baseFee - discountAmount);
    const amountToFree = tier2Min - subtotal;
    return {
      baseFee,
      discountRate: tier1Rate,
      discountAmount,
      finalCourierFee,
      isDiscountTier1: true,
      isDiscountTier2: false,
      amountNeededForNextTier: amountToFree,
      nextTierDiscount: tier2Rate,
      message: `⚡ 50% OFF Courier applied! Add Rs. ${amountToFree.toLocaleString()} more to unlock 100% FREE Courier.`,
    };
  }

  // Base tier: <= 25,000
  const amountTo50 = tier1Min - subtotal + 1;
  return {
    baseFee,
    discountRate: 0,
    discountAmount: 0,
    finalCourierFee: baseFee,
    isDiscountTier1: false,
    isDiscountTier2: false,
    amountNeededForNextTier: amountTo50,
    nextTierDiscount: tier1Rate,
    message: `Standard Courier. Add Rs. ${amountTo50.toLocaleString()} more for 50% OFF delivery!`,
  };
}
