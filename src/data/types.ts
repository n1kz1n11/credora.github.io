export type OfferCategory = 'loans' | 'cards';

export interface BaseOffer {
  id: string;
  name: string;
  category: OfferCategory;
  type: string;
  logo: string;
  imageUrl: string;
  shortDescription: string;
  primaryConditions: string[];
  advantages: string[];
  requirements: string[];
  partnerUrl: string | null;
  tags: string[];
}

export interface LoanOffer extends BaseOffer {
  category: 'loans';
  amount: string;
  term: string;
  rate: string;
  psk: string | null;
  age: string;
  citizenship: string;
  receiving: string[];
  repayment: string[];
}

export interface BankCardOffer extends BaseOffer {
  category: 'cards';
  cardType: 'debit' | 'credit';
  cashback: string | null;
  serviceCost: string;
  creditLimit: string | null;
  gracePeriod: string | null;
  psk: string | null;
  age: string | null;
  keyFeatures: string[];
}
