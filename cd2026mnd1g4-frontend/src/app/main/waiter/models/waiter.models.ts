/** Define los contratos tipados del flujo de atención del camarero. */
export interface Waiter {
  id: string;
  name: string;
  storeId: string;
}

export interface Store {
  id: string;
  posAvailable: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  keyTagCode: string | null;
  points: number;
  favoriteProductNames: string[];
}

export interface CustomerRegistration {
  fullName: string;
  phone: string;
  email: string | null;
  keyTagCode: string | null;
  acceptsDataProtection: boolean;
}

export type ProductCategory = 'coffee' | 'drink' | 'pastry' | 'food';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unitPriceCents: number;
}

export type Promotion =
  | {
      id: string;
      name: string;
      description: string;
      kind: 'twoForOne';
      productId: string;
    }
  | {
      id: string;
      name: string;
      description: string;
      kind: 'percentage';
      productId: string;
      discountPercent: number;
    }
  | {
      id: string;
      name: string;
      description: string;
      kind: 'orderPercentage';
      discountPercent: number;
    };

export interface Reward {
  id: string;
  name: string;
  productId: string;
  pointsCost: number;
}

export interface OrderLineInput {
  productId: string;
  quantity: number;
}

export interface OrderDiscountLine {
  name: string;
  amountCents: number;
  kind: 'promotion' | 'reward';
  pointsCost: number | null;
}

export interface OrderQuoteLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  discounts: OrderDiscountLine[];
  totalCents: number;
}

export interface OrderQuote {
  lines: OrderQuoteLine[];
  subtotalCents: number;
  orderDiscountCents: number;
  orderDiscountName: string | null;
  promotionDiscountCents: number;
  rewardDiscountCents: number;
  totalDiscountCents: number;
  totalCents: number;
  pointsEarned: number;
  customerPointsAfterOrder: number | null;
}

export interface OrderSubmission {
  waiterId: string;
  customerId: string | null;
  items: OrderLineInput[];
  promotionId: string | null;
  rewardId: string | null;
}

export interface OrderReceipt {
  id: string;
  waiterId: string;
  quote: OrderQuote;
  totalCents: number;
  pointsEarned: number;
  customerPointsAfterOrder: number | null;
  status: 'sent' | 'posUnavailable';
}
