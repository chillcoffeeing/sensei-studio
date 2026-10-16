import type { SiteAdvice } from '@/core/site';
import { toSerial, type Serial } from '../dialog/dialog-data';

export type AdviceData = Serial<SiteAdvice>;

export function toAdviceData(advice: SiteAdvice): AdviceData {
  return toSerial(advice);
}
