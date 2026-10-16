import type { SiteQuote } from '@/core/site';
import { toSerial, type Serial } from '../dialog/dialog-data';

export type QuoteData = Serial<SiteQuote>;

export function toQuoteData(quote: SiteQuote): QuoteData {
  return toSerial(quote);
}
