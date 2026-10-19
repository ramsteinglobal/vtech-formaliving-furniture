import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const { MONGODB_URI, PORT = 5000, ADMIN_API_KEY } = process.env;
if (!MONGODB_URI) { console.error('MONGODB_URI is not set (copy .env.example to .env)'); process.exit(1); }
if (!ADMIN_API_KEY) console.warn('ADMIN_API_KEY is not set — admin routes will reject every request.');

await connectDB(MONGODB_URI);
createApp().listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
