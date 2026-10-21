export const ticker = [
  'FREE DELIVERY ACROSS INDIA ON ORDERS ABOVE ₹25,000',
  '✦ 10-YEAR FRAME WARRANTY',
  '✦ HANDCRAFTED IN SOLID SHEESHAM',
  '✦ 30-DAY EASY RETURNS',
  '✦ FLAT 15% OFF THE AUTUMN EDIT',
];

export const categories = [
  { slug: 'living', label: 'Living Room', blurb: 'Sofas, tables, shelving', img: 'liv', pos: 'center 70%', from: 18900 },
  { slug: 'bedroom', label: 'Bedroom', blurb: 'Beds, wardrobes, nightstands', img: 'bed', pos: '50% 55%', from: 32500 },
  { slug: 'dining', label: 'Dining', blurb: 'Tables, chairs, sideboards', img: 'din', pos: '50% 65%', from: 24900 },
  { slug: 'office', label: 'Office', blurb: 'Desks, chairs, storage', img: 'off', pos: '30% 70%', from: 9900 },
];
export const catLabel = Object.fromEntries(categories.map((c) => [c.slug, c.label]));

export const gallery = [
  { img: 'liv', title: 'Sunlit living room', pos: 'center 65%' },
  { img: 'bed', title: 'Quiet bedroom', pos: '50% 50%' },
  { img: 'din', title: 'Family dining', pos: '50% 60%' },
  { img: 'off', title: 'Home office', pos: '40% 60%' },
  { img: 'sofa', title: 'Formal lounge', pos: '50% 60%' },
];

export const trust = [
  ['Free delivery', 'Orders above ₹25,000'],
  ['10-year warranty', 'On every solid-wood frame'],
  ['30-day returns', 'Hassle-free, no questions'],
  ['Secure payments', 'UPI, cards & EMI'],
];

export const reviews = [
  { stars: 5, text: 'The sofa arrived perfectly packed and the finish is even better than the photos. Our living room finally feels complete.', name: 'Ananya Sharma', city: 'Noida' },
  { stars: 5, text: 'Our dining table is heavy, solid and beautiful. The team assembled it in under an hour and left nothing behind.', name: 'Rohit Mehra', city: 'Gurugram' },
  { stars: 4, text: 'Great quality and honest pricing. The design visit helped us pick the right sizes for a small apartment.', name: 'Priya Kapoor', city: 'Delhi' },
];

export const pageMeta = {
  all: ['All products', 'All products', 'Every piece in the Forma Living collection.'],
  cart: ['Cart', 'Your cart', 'Review your pieces and tell us where to deliver.'],
  orders: ['Orders', 'Track your order', 'See where your furniture is, from confirmation to delivery.'],
  shop: ['Shop', 'Shop the collection', 'Browse every room, crafted in solid wood and natural fabrics.'],
  featured: ['Featured', 'Featured product', 'Our bestselling sofa, in detail.'],
  reviews: ['Reviews', 'Customer reviews', 'What 12,000+ happy homes say about Forma Living.'],
  contact: ['Contact', 'Contact us', 'Tell us about your space and we’ll reply within one working day.'],
  living: ['Living Room', 'Living Room furniture', 'Sofas, lounge chairs and tables for every home.'],
  bedroom: ['Bedroom', 'Bedroom furniture', 'Beds and bedside pieces built for better sleep.'],
  dining: ['Dining', 'Dining furniture', 'Tables and chairs for long, happy meals.'],
  office: ['Office', 'Office furniture', 'Desks and workstations made for focus.'],
};

export const fmt = (n) => '₹' + n.toLocaleString('en-IN');
export const contact = { email: 'vaibhav.isti@gmail.com', phone: '9555882573', hours: 'Mon–Sat, 10am–7pm' };
