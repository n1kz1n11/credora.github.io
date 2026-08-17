import { cards } from './cards';
import { loans } from './loans';

const expectedLoanIds = [
  'bistrodengi', 'polizaym', 'ligamfo', 'bunnymoney', 'cashiro', 'dobrozaym', 'nova-credit',
  'smart-cash', 'likezaym', 'fin-navigator', 'max-credit', 'greenmoney', 'kapitalina',
  'zaymer', 'u-abramovicha', 'nebus', 'dozarplaty',
] as const;
const expectedCardIds = [
  'mts-debit', 'rshb-unionpay', 'fora-vse-vklucheno', 'tbank-black', 'tbank-black-premium',
  'alfa-orange', 'otp-120', 'uralsib-credit', 'tbank-credit', 'alfa-credit',
] as const;

function fail(message: string): never { throw new Error(`Catalog integrity error: ${message}`); }

function hasValidAbsoluteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && Boolean(parsed.hostname);
  } catch { return false; }
}

function assertExpectedIds(actual: readonly { id: string }[], expected: readonly string[], label: string) {
  const actualIds = actual.map((item) => item.id);
  if (actualIds.length !== expected.length || actualIds.some((id, index) => id !== expected[index])) fail(`${label} IDs do not match the expected catalog`);
}

export function validateCatalogData() {
  if (loans.length !== 17) fail(`expected 17 loans, got ${loans.length}`);
  if (cards.length !== 10) fail(`expected 10 cards, got ${cards.length}`);
  assertExpectedIds(loans, expectedLoanIds, 'loan');
  assertExpectedIds(cards, expectedCardIds, 'card');
  const debitCards = cards.filter((card) => card.cardType === 'debit');
  const creditCards = cards.filter((card) => card.cardType === 'credit');
  if (debitCards.length !== 6) fail(`expected 6 debit cards, got ${debitCards.length}`);
  if (creditCards.length !== 4) fail(`expected 4 credit cards, got ${creditCards.length}`);
  const products = [...loans, ...cards];
  const ids = new Set(products.map((product) => product.id));
  if (ids.size !== products.length) fail('product IDs must be unique across the catalog');
  if (loans.some((loan) => loan.category !== 'loans' || !['МФО', 'КПК'].includes(loan.type))) fail('loan category or organization type is invalid');
  if (cards.some((card) => card.category !== 'cards' || (card.cardType === 'debit' ? !card.type.toLocaleLowerCase('ru-RU').includes('дебетовая') : card.type !== 'Кредитная карта') || !card.age)) fail('card category, type, or age is invalid');
  const invalidImages = products.filter((product) => !hasValidAbsoluteUrl(product.imageUrl));
  if (invalidImages.length) fail(`imageUrl must be an absolute HTTP(S) URL (${invalidImages.map((product) => product.id).join(', ')})`);
  const missingPartners = products.filter((product) => product.partnerUrl === null);
  if (missingPartners.length) fail(`missing partnerUrl for ${missingPartners.map((product) => product.id).join(', ')}`);
  const invalidPartners = products.filter((product) => product.partnerUrl !== null && !hasValidAbsoluteUrl(product.partnerUrl));
  if (invalidPartners.length) fail(`partnerUrl must be an absolute HTTP(S) URL (${invalidPartners.map((product) => product.id).join(', ')})`);
  return {
    loans: loans.length, cards: cards.length, debitCards: debitCards.length, creditCards: creditCards.length,
    products: products.length, imageUrls: products.filter((product) => Boolean(product.imageUrl)).length,
    partnerUrls: products.filter((product) => Boolean(product.partnerUrl)).length,
  };
}

export const catalogSummary = validateCatalogData();
