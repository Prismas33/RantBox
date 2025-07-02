import { CreditPackage } from '@/types';

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 5,
    price: 400, // $4.00
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 12,
    price: 800, // $8.00
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Pack', 
    credits: 25,
    price: 1500, // $15.00
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    credits: 50,
    price: 2500, // $25.00
  }
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getCreditValue(packageItem: CreditPackage): string {
  const pricePerCredit = packageItem.price / packageItem.credits;
  return `$${(pricePerCredit / 100).toFixed(2)} per post`;
}
