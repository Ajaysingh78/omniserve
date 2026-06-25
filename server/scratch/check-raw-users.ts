import dns from 'dns';
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set DNS, using defaults:", e);
}

import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://futurestack07:nitishkumar07@teckstack.lqqhjs0.mongodb.net/FoodMesh-Test";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  const userAman = await usersCol.findOne({ email: 'aman@gmail.com' });
  console.log('aman@gmail.com Raw Doc:', JSON.stringify(userAman, null, 2));

  const userNitish = await usersCol.findOne({ email: 'kumarnitishbxr07@gmail.com' });
  console.log('kumarnitishbxr07@gmail.com Raw Doc:', JSON.stringify(userNitish, null, 2));

  await mongoose.disconnect();
}

main().catch(console.error);
