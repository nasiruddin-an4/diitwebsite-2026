const { MongoClient } = require('mongodb');
async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient("mongodb+srv://diit:f2eT23X6vEvjI1lY@cluster0.pldsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  await client.connect();
  const db = client.db("diit_admin");
  const blogs = await db.collection("news_events").find({ category: "BLOG" }).toArray();
  console.log(JSON.stringify(blogs.map(b => ({id: b._id, title: b.title})), null, 2));
  process.exit(0);
}
run();
