export interface PresetWatchImage {
  id: string;
  name: string;
  brand: string;
  url: string;
  category: string;
}

export const PRESET_WATCH_IMAGES: PresetWatchImage[] = [
  {
    id: 'rolex-sub-black',
    name: 'Rolex Submariner Date 41mm Black Dial Oystersteel',
    brand: 'Rolex',
    category: 'Diver',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'patek-nautilus-blue',
    name: 'Patek Philippe Nautilus 5711 Sunburst Blue Dial',
    brand: 'Patek Philippe',
    category: 'Luxury',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ap-royal-oak-chrono',
    name: 'Audemars Piguet Royal Oak Chronograph 41mm',
    brand: 'Audemars Piguet',
    category: 'Chronograph',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'omega-speedmaster-moon',
    name: 'Omega Speedmaster Professional Moonwatch Co-Axial Master',
    brand: 'Omega',
    category: 'Chronograph',
    url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cartier-santos-gold',
    name: 'Cartier Santos de Cartier Two-Tone 18k Gold & Steel',
    brand: 'Cartier',
    category: 'Dress',
    url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tag-monaco-gulf',
    name: 'TAG Heuer Monaco Calibre 11 Automatic Chronograph',
    brand: 'TAG Heuer',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hublot-big-bang-carbon',
    name: 'Hublot Big Bang Unico Ceramic Magic Gold',
    brand: 'Hublot',
    category: 'Skeleton',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tissot-prx-powermatic',
    name: 'Tissot PRX Powermatic 80 Deep Blue Waffle Dial',
    brand: 'Tissot',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'breitling-navitimer-gold',
    name: 'Breitling Navitimer B01 Chronograph 43mm',
    brand: 'Breitling',
    category: 'Aviation',
    url: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'richard-mille-skeleton',
    name: 'Richard Mille RM 011 Flyback Chronograph Titanium',
    brand: 'Richard Mille',
    category: 'Skeleton',
    url: 'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&w=1200&q=80',
  },
];

export const FALLBACK_WATCH_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';
