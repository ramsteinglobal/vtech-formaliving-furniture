// npm run seed — replaces the products collection with data/seed.json
import 'dotenv/config';
import fs from 'node:fs';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

await mongoose.connect(process.env.MONGODB_URI);
const items = JSON.parse(fs.readFileSync(new URL('../data/seed.json', import.meta.url)));
await Product.deleteMany({});
await Product.insertMany(items);
console.log(`Seeded ${items.length} products`);
await mongoose.disconnect();
