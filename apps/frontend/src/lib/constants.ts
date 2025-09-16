export const MATERIAL_UNITS = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 't', label: 'Tonne (t)' },
  { value: 'm', label: 'Mètre (m)' },
  { value: 'm²', label: 'Mètre carré (m²)' },
  { value: 'm³', label: 'Mètre cube (m³)' },
  { value: 'cm', label: 'Centimètre (cm)' },
  { value: 'cm²', label: 'Centimètre carré (cm²)' },
  { value: 'cm³', label: 'Centimètre cube (cm³)' },
  { value: 'mm', label: 'Millimètre (mm)' },
  { value: 'mm²', label: 'Millimètre carré (mm²)' },
  { value: 'mm³', label: 'Millimètre cube (mm³)' },
  { value: 'l', label: 'Litre (l)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'cl', label: 'Centilitre (cl)' },
  { value: 'dl', label: 'Décilitre (dl)' },
  { value: 'unité', label: 'Unité' },
  { value: 'paquet', label: 'Paquet' },
  { value: 'carton', label: 'Carton' },
  { value: 'rouleau', label: 'Rouleau' },
  { value: 'mètre linéaire', label: 'Mètre linéaire' },
  { value: 'm²/rouleau', label: 'M² par rouleau' },
  { value: 'm²/paquet', label: 'M² par paquet' },
  { value: 'm²/carton', label: 'M² par carton' },
  { value: 'kg/m²', label: 'Kg par m²' },
  { value: 'kg/m³', label: 'Kg par m³' },
  { value: 'l/m²', label: 'Litre par m²' },
  { value: 'l/m³', label: 'Litre par m³' },
] as const;

export const MATERIAL_CATEGORIES = [
  'Matériaux de construction',
  'Isolation',
  'Menuiserie',
  'Électricité',
  'Plomberie',
  'Peinture et finitions',
  'Outillage',
  'Équipements',
  'Autres'
] as const;

export const CURRENCIES = {
  USD: { symbol: '$', name: 'Dollar US' },
  CDF: { symbol: 'FC', name: 'Franc Congolais' }
} as const;

export type Currency = keyof typeof CURRENCIES;
export type MaterialUnit = typeof MATERIAL_UNITS[number]['value'];
export type MaterialCategory = typeof MATERIAL_CATEGORIES[number];
