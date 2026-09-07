const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SM WatchStore database seed...');

  const defaultBankDetails = JSON.stringify([
    {
      type: 'Bank Transfer',
      title: 'Meezan Bank (Islamic Banking)',
      bankName: 'Meezan Bank Limited',
      accountName: 'SM WatchStore Official',
      accountNumber: '02840109428192',
      iban: 'PK64MEZN0002840109428192',
    },
    {
      type: 'Bank Transfer',
      title: 'Bank Alfalah Premier',
      bankName: 'Bank Alfalah Ltd',
      accountName: 'SM WatchStore Official',
      accountNumber: '55192039482109',
      iban: 'PK38ALFH00055192039482109',
    },
    {
      type: 'EasyPaisa',
      title: 'EasyPaisa Merchant Account',
      accountName: 'Sami Ullah Nawaz',
      accountNumber: '03008942942',
    },
    {
      type: 'JazzCash',
      title: 'JazzCash Direct Wallet',
      accountName: 'Sami Ullah Nawaz',
      accountNumber: '03008942942',
    },
    {
      type: 'Raast',
      title: 'State Bank Raast Instant ID',
      accountName: 'Sami Ullah Nawaz',
      accountNumber: '03008942942',
    },
  ]);

  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'SM WatchStore',
      brandTagline: 'Luxury Horology, Master Craftsmanship & Premium Timepieces',
      logoUrl: '',
      contactPhone: '+92 300 8942942',
      whatsappNumber: '+92 300 8942942',
      officialEmail: 'samiullahnawaz942@gmail.com',
      physicalAddress: 'Showroom #14, Royal Horology Pavilion, Main Boulevard, Gulberg III, Lahore, Pakistan',
      city: 'Lahore',
      googleMapsUrl: 'https://maps.google.com/?q=Gulberg+III+Lahore+Pakistan',
      isOpen: true,
      openingHoursText: 'Mon - Sat: 11:00 AM - 10:00 PM | Sun: 03:00 PM - 09:00 PM',
      gstTaxPercentage: 0,
      baseCourierPrice: 600,
      courierDiscountTier1Min: 25000,
      courierDiscountTier1Rate: 50,
      courierDiscountTier2Min: 50000,
      courierDiscountTier2Rate: 100,
      bankDetails: defaultBankDetails,
      strictReturnPolicy:
        'No material refundable. All timepieces undergo rigid 12-point authentication and timing precision tests prior to sealed dispatch.',
      noCodNotice:
        'Cash on Delivery (COD) is strictly unavailable. Select Full Payment or 50% Advance payment, transfer via Bank/EasyPaisa/JazzCash, and send screenshot via WhatsApp to confirm immediate courier dispatch.',
      announcementBanner:
        '✨ FREE Courier Delivery on orders of Rs. 50,000+ | 50% OFF Courier on orders above Rs. 25,000!',
    },
  });

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'samiullahnawaz942@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      fullName: 'Sami Ullah Nawaz (Store Director)',
      phone: '+92 300 8942942',
      address: 'Main Boulevard Gulberg III',
      city: 'Lahore',
      postalCode: '54000',
    },
  });

  const customerPasswordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { username: 'customer1' },
    update: {},
    create: {
      username: 'customer1',
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      fullName: 'Hamza Tariq',
      phone: '+92 321 9876543',
      address: 'House #42, Street 7, Phase 5 DHA',
      city: 'Lahore',
      postalCode: '54792',
    },
  });

  const watches = [
    {
      title: 'Rolex Submariner Date 41mm Oystersteel Cerachrom',
      brand: 'Rolex',
      model: '126610LN',
      sku: 'RLX-SUB-126610LN',
      price: 385000,
      discountPrice: 365000,
      stockCount: 4,
      isAvailable: true,
      category: 'Diver',
      movement: 'Automatic Calibre 3235 (70-hour Power Reserve)',
      caseDiameter: '41 mm',
      dialColor: 'Obsidian Black Gloss Dial with Chromalight Lume',
      strapMaterial: 'Oystersteel Solid-Link Bracelet with Glidelock Clasp',
      waterResistance: '300m / 1,000 ft Waterproof',
      description:
        'The benchmark among divers watches. Features a unidirectional rotatable bezel with Cerachrom insert in black ceramic and solid Oystersteel casing.',
      features: JSON.stringify([
        'Unidirectional 60-minute graduated Cerachrom ceramic bezel',
        'Scratch-resistant sapphire crystal with Cyclops lens over date',
        'Paramagnetic blue Parachrom hairspring with Paraflex shock absorbers',
        'Rolex Glidelock fine-adjustment extension system',
        'Includes original box, warranty card, and 5-year movement guarantee',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Rolex Submariner Date Front View',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Rolex Submariner Angle View',
          isPrimary: false,
        },
      ]),
      isFeatured: true,
    },
    {
      title: 'Patek Philippe Nautilus 5711 Sunburst Blue Dial',
      brand: 'Patek Philippe',
      model: '5711/1A-010',
      sku: 'PP-NAUT-5711',
      price: 495000,
      discountPrice: 475000,
      stockCount: 2,
      isAvailable: true,
      category: 'Luxury',
      movement: 'Self-Winding Mechanical Calibre 26-330 S C',
      caseDiameter: '40 mm',
      dialColor: 'Sunburst Electric Blue with Horizontally Embossed Ribs',
      strapMaterial: 'Hand-Polished Stainless Steel Integrated Bracelet',
      waterResistance: '120m Water Resistant',
      description:
        'The quintessential luxury sports watch with rounded octagonal bezel and ingenious porthole case construction.',
      features: JSON.stringify([
        'Iconic rounded octagonal bezel with satin and polished hand-finish',
        'Gold applied hour markers with luminescent coating',
        'Sapphire crystal case back revealing 21k gold rotor',
        'Fold-over Nautilus clasp with comfort release',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Patek Philippe Nautilus Dial',
          isPrimary: true,
        },
      ]),
      isFeatured: true,
    },
    {
      title: 'Audemars Piguet Royal Oak Chronograph 41mm',
      brand: 'Audemars Piguet',
      model: '26331ST.OO.1220ST.01',
      sku: 'AP-RO-26331ST',
      price: 420000,
      discountPrice: 395000,
      stockCount: 3,
      isAvailable: true,
      category: 'Chronograph',
      movement: 'Self-Winding Integrated Chronograph Calibre 2385',
      caseDiameter: '41 mm',
      dialColor: 'Blue Grande Tapisserie Pattern with Silver Subdials',
      strapMaterial: 'Stainless Steel Bracelet with AP Folding Clasp',
      waterResistance: '50m Water Resistant',
      description:
        'A masterpiece of modern horology featuring the signature "Grande Tapisserie" guilloché dial and 8 hexagonal white gold bezel screws.',
      features: JSON.stringify([
        'Iconic Grande Tapisserie dial motif',
        'Column-wheel chronograph mechanism with instant reset',
        'White gold applied Royal Oak hour-markers and hands',
        'Anti-reflective sapphire crystal front',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Audemars Piguet Royal Oak Chronograph',
          isPrimary: true,
        },
      ]),
      isFeatured: true,
    },
    {
      title: 'Omega Speedmaster Professional Moonwatch Co-Axial',
      brand: 'Omega',
      model: '310.30.42.50.01.002',
      sku: 'OMG-SP-MOON310',
      price: 245000,
      discountPrice: 228000,
      stockCount: 5,
      isAvailable: true,
      category: 'Chronograph',
      movement: 'Manual-Winding Omega Co-Axial Master Chronometer 3861',
      caseDiameter: '42 mm',
      dialColor: 'Matte Step Black Dial with White Super-LumiNova',
      strapMaterial: 'Brushed and Polished 5-Arch Link Bracelet',
      waterResistance: '50m / 167 ft',
      description:
        'The legendary Moonwatch tested on all six lunar missions. Equipped with the revolutionary Co-Axial Master Chronometer certified by METAS.',
      features: JSON.stringify([
        'Master Chronometer Certified resistant to 15,000 gauss magnetic fields',
        'Anodised aluminium bezel ring with famous "Dot over 90" (DON)',
        'Sapphire crystal front and exhibition case back',
        'Precision 3-register chronograph timing down to 1/6 second',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Omega Speedmaster Moonwatch',
          isPrimary: true,
        },
      ]),
      isFeatured: true,
    },
    {
      title: 'Cartier Santos de Cartier Two-Tone 18k Yellow Gold',
      brand: 'Cartier',
      model: 'W2SA0009',
      sku: 'CRT-SAN-W2SA0009',
      price: 185000,
      discountPrice: 172000,
      stockCount: 3,
      isAvailable: true,
      category: 'Dress',
      movement: 'Automatic 1847 MC In-House Movement',
      caseDiameter: '39.8 mm (Large Model)',
      dialColor: 'Silvered Opaline Dial with Roman Numerals & Blued Hands',
      strapMaterial: 'Two-Tone Steel & 18k Gold QuickSwitch Bracelet + Calfskin Strap',
      waterResistance: '100m Water Resistant',
      description:
        'Created in 1904 for aviation pioneer Alberto Santos-Dumont. Features visible bezel screws and the patented QuickSwitch interchangeable strap system.',
      features: JSON.stringify([
        '18K yellow gold bezel with polished steel case',
        'Sword-shaped hands in blued steel',
        'QuickSwitch strap interchangeability system with tool-free SmartLink sizing',
        'Heptagonal crown set with a faceted synthetic blue spinel',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Cartier Santos Two-Tone',
          isPrimary: true,
        },
      ]),
      isFeatured: true,
    },
    {
      title: 'TAG Heuer Monaco Calibre 11 Racing Blue Dial',
      brand: 'TAG Heuer',
      model: 'CAW211P.FC6356',
      sku: 'TAG-MON-CAW211P',
      price: 145000,
      discountPrice: 135000,
      stockCount: 4,
      isAvailable: true,
      category: 'Sports',
      movement: 'Automatic Calibre 11 Chronograph with Left Crown',
      caseDiameter: '39 mm Square',
      dialColor: 'Petroleum Blue Dial with Horizontal Steel Markers',
      strapMaterial: 'Perforated Black Racing Calfskin with Deployant Clasp',
      waterResistance: '100m Water Resistant',
      description:
        'The rebellious square chronograph immortalized by Steve McQueen in the 1971 film Le Mans. Left-side crown and dual square subdials.',
      features: JSON.stringify([
        'Historic left-positioned winding crown',
        'Dual silver opaline square registers at 3 and 9 oclock',
        'Domed, bevelled sapphire crystal with high anti-scratch resistance',
        'Red chronograph seconds hand with vintage Heuer shield logo',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'TAG Heuer Monaco Blue',
          isPrimary: true,
        },
      ]),
      isFeatured: false,
    },
    {
      title: 'Tissot PRX Powermatic 80 Blue Waffle Dial',
      brand: 'Tissot',
      model: 'T137.407.11.041.00',
      sku: 'TSS-PRX-POW80',
      price: 28500,
      discountPrice: 26500,
      stockCount: 8,
      isAvailable: true,
      category: 'Classic',
      movement: 'Powermatic 80.111 with Nivachron Balance Spring (80h reserve)',
      caseDiameter: '40 mm',
      dialColor: 'Deep Navy Blue Embossed Waffle Dial',
      strapMaterial: 'Integrated Brushed Stainless Steel Bracelet with Butterfly Clasp',
      waterResistance: '100m / 10 bar Water Resistant',
      description:
        'An icon from the late 70s reimagined with high-precision 80-hour Swiss automatic movement and integrated luxury bracelet.',
      features: JSON.stringify([
        '80-hour power reserve automatic movement',
        'Anti-magnetic Nivachron balance spring',
        'Quick-release integrated stainless steel bracelet',
        'Engraved transparent case back',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Tissot PRX Powermatic 80',
          isPrimary: true,
        },
      ]),
      isFeatured: false,
    },
    {
      title: 'Seiko 5 Sports Automatic Stealth Black',
      brand: 'Seiko',
      model: 'SRPD79K1',
      sku: 'SEI-5SP-SRPD79',
      price: 19500,
      discountPrice: 18200,
      stockCount: 12,
      isAvailable: true,
      category: 'Sports',
      movement: 'Automatic 4R36 Movement with Day-Date Display',
      caseDiameter: '42.5 mm',
      dialColor: 'Matte Charcoal Black Dial with Lumibrite Gunmetal Indices',
      strapMaterial: 'Black Heavy-Duty Nylon NATO Strap with Seiko Buckle',
      waterResistance: '100m Water Resistant',
      description:
        'Tactical stealth aesthetic combined with Seiko legendary reliability. 4R36 automatic caliber with manual winding and hacking seconds.',
      features: JSON.stringify([
        'Hardlex crystal with rotating countdown bezel',
        'Day and date bilingual display at 3 oclock',
        '41-hour power reserve with 24 jewels',
        'Ergonomic 4 oclock crown positioning',
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
          source: 'preset',
          alt: 'Seiko 5 Sports Stealth Black',
          isPrimary: true,
        },
      ]),
      isFeatured: false,
    },
  ];

  for (const watch of watches) {
    await prisma.watch.upsert({
      where: { sku: watch.sku },
      update: {},
      create: watch,
    });
  }

  console.log('✅ Database seeded successfully with SM WatchStore data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
