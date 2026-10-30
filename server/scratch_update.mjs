import fs from "fs";
import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const updatedHtml = fs.readFileSync("c:/Users/NoName/Desktop/testview.html", "utf8");

const templateSchema = new mongoose.Schema({
  name: String,
  slug: String,
  html: String,
  coverPhotoUrl: String,
  bannerPhotoUrl: String,
});

const Template = mongoose.model("Template", templateSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const templates = await Template.find({ slug: { $in: ["royal-gold-majesty", "gold-and-animatif", "test-animatif"] } });
  for (const t of templates) {
    t.html = updatedHtml;
    await t.save();
    console.log(`Updated template ${t.name} (${t.slug}) with new HTML length ${updatedHtml.length}`);
  }

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch(console.error);

