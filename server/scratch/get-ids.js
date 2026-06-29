import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Unable to set custom DNS servers:', e);
}

const MONGO_URIS = [
  process.env.MONGO_URI,
  "mongodb://127.0.0.1:27017/FoodMesh-Test",
  "mongodb://127.0.0.1:27017/FoodMesh"
].filter(Boolean);

async function main() {
  let connected = false;
  for (const uri of MONGO_URIS) {
    try {
      console.log(`Connecting to: ${uri}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`Connected successfully to ${uri}`);
      connected = true;
      break;
    } catch (e) {
      console.log(`Failed to connect to ${uri}`);
    }
  }

  if (!connected) {
    console.log("Could not connect to MongoDB.");
    process.exit(1);
  }

  // Define simple schemas
  const Tenant = mongoose.model('Tenant', new mongoose.Schema({ name: String }), 'tenants');
  const User = mongoose.model('User', new mongoose.Schema({ email: String, tenantId: mongoose.Schema.Types.ObjectId, role: String }), 'users');
  const Outlet = mongoose.model('Outlet', new mongoose.Schema({ name: String, code: String, isDeleted: Boolean }), 'outlets');
  const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({ name: String, price: Number, isDeleted: Boolean }), 'menuitems');
  const Variant = mongoose.model('Variant', new mongoose.Schema({ name: String, price: Number, isDeleted: Boolean, menuItemId: mongoose.Schema.Types.ObjectId }), 'variants');
  const Addon = mongoose.model('Addon', new mongoose.Schema({ name: String, price: Number, isDeleted: Boolean, menuItemId: mongoose.Schema.Types.ObjectId }), 'addons');
  
  const ChannelOutletMapping = mongoose.model('ChannelOutletMapping', new mongoose.Schema({
    outletId: mongoose.Schema.Types.ObjectId,
    provider: String,
    externalOutletId: String
  }), 'channeloutletmappings');

  const ChannelMenuItemMapping = mongoose.model('ChannelMenuItemMapping', new mongoose.Schema({
    menuItemId: mongoose.Schema.Types.ObjectId,
    provider: String,
    externalItemId: String
  }), 'channelmenuitemmappings');

  const ChannelVariantMapping = mongoose.model('ChannelVariantMapping', new mongoose.Schema({
    variantId: mongoose.Schema.Types.ObjectId,
    provider: String,
    externalVariantId: String
  }), 'channelvariantmappings');

  const ChannelAddonMapping = mongoose.model('ChannelAddonMapping', new mongoose.Schema({
    addonId: mongoose.Schema.Types.ObjectId,
    provider: String,
    externalAddonId: String
  }), 'channeladdonmappings');

  // Query Tenants
  const tenants = await Tenant.find({});
  console.log("\n=== TENANTS ===");
  if (tenants.length === 0) console.log("No tenants found.");
  tenants.forEach(t => console.log(`Name: "${t.name}" | tenantId: "${t._id}"`));

  // Query Users
  const users = await User.find({});
  console.log("\n=== USERS ===");
  if (users.length === 0) console.log("No users found.");
  users.forEach(u => console.log(`Email: "${u.email}" | tenantId: "${u.tenantId}" | Role: "${u.role}"`));

  // Query Outlets
  const outlets = await Outlet.find({ isDeleted: { $ne: true } });
  console.log("\n=== OUTLETS ===");
  if (outlets.length === 0) console.log("No active outlets found.");
  outlets.forEach(o => console.log(`Name: "${o.name}" | outletId: "${o._id}" | Code: "${o.code}"`));

  // Query Outlet Mappings
  const outletMappings = await ChannelOutletMapping.find({});
  console.log("\n=== OUTLET MAPPINGS (for Swiggy/Zomato webhooks) ===");
  if (outletMappings.length === 0) console.log("No outlet mappings found.");
  outletMappings.forEach(m => console.log(`Provider: "${m.provider}" | FoodMesh outletId: "${m.outletId}" | External/Mock outlet_id: "${m.externalOutletId}"`));

  // Query Menu Items
  const items = await MenuItem.find({ isDeleted: { $ne: true } }).limit(5);
  console.log("\n=== MENU ITEMS (First 5) ===");
  if (items.length === 0) console.log("No menu items found.");
  items.forEach(i => console.log(`Name: "${i.name}" | menuItemId: "${i._id}" | Price: ${i.price}`));

  // Query Menu Item Mappings
  const itemMappings = await ChannelMenuItemMapping.find({}).limit(5);
  console.log("\n=== MENU ITEM MAPPINGS (First 5) ===");
  if (itemMappings.length === 0) console.log("No item mappings found.");
  itemMappings.forEach(m => console.log(`Provider: "${m.provider}" | FoodMesh menuItemId: "${m.menuItemId}" | External item_id: "${m.externalItemId}"`));

  // Query Variants & Addons
  const variants = await Variant.find({ isDeleted: { $ne: true } }).limit(3);
  console.log("\n=== VARIANTS (First 3) ===");
  variants.forEach(v => console.log(`Name: "${v.name}" | variantId: "${v._id}" | Price: ${v.price} | Item: "${v.menuItemId}"`));

  const variantMappings = await ChannelVariantMapping.find({}).limit(3);
  console.log("\n=== VARIANT MAPPINGS ===");
  variantMappings.forEach(m => console.log(`Provider: "${m.provider}" | FoodMesh variantId: "${m.variantId}" | External variant_id: "${m.externalVariantId}"`));

  const addons = await Addon.find({ isDeleted: { $ne: true } }).limit(3);
  console.log("\n=== ADDONS (First 3) ===");
  addons.forEach(a => console.log(`Name: "${a.name}" | addonId: "${a._id}" | Price: ${a.price} | Item: "${a.menuItemId}"`));

  const addonMappings = await ChannelAddonMapping.find({}).limit(3);
  console.log("\n=== ADDON MAPPINGS ===");
  addonMappings.forEach(m => console.log(`Provider: "${m.provider}" | FoodMesh addonId: "${m.addonId}" | External addon_id: "${m.externalAddonId}"`));

  await mongoose.disconnect();
  console.log("\nDone!");
}

main().catch(console.error);
