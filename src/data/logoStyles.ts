import { LogoStyleOption } from '../types';

export const LOGO_STYLES: LogoStyleOption[] = [
  {
    id: 'modern',
    label: 'Modern',
    labelAr: 'مودرن وعصري',
    desc: 'بسيط، نظيف، وعصري',
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    labelAr: 'مينيماليست',
    desc: 'بسيط جدًا ومركز',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    labelAr: 'فاخر وراقي',
    desc: 'فخم وراقي',
  },
  {
    id: 'vintage',
    label: 'Vintage / Retro',
    labelAr: 'فينتيج / ريترو',
    desc: 'كلاسيكي بطابع قديم',
  },
  {
    id: 'mascot',
    label: 'Mascot',
    labelAr: 'ماسكوت وشخصيات',
    desc: 'يعتمد على شخصية أو حيوان',
  },
  {
    id: 'typography',
    label: 'Typography / Lettermark',
    labelAr: 'تايبوجرافي / حروف',
    desc: 'يعتمد على الحروف أو اسم العلامة',
  },
  {
    id: 'geometric',
    label: 'Geometric',
    labelAr: 'هندسي',
    desc: 'أشكال هندسية وزوايا واضحة',
  },
  {
    id: 'esports',
    label: 'Esports / Gaming',
    labelAr: 'إسبورت وجيمنج',
    desc: 'حاد، قوي، وهجومي',
  },
];

export function getLogoStyleLabel(styleId?: string): string {
  if (!styleId) return 'غير محدد';
  const style = LOGO_STYLES.find((s) => s.id === styleId || s.label === styleId || s.labelAr === styleId);
  return style ? `${style.label} (${style.desc})` : styleId;
}
