import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/myapp";

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


export default async function handler(req, res) {
  if (req.method === 'post') {
    try {
      await client.connect();
      const db = client.db("myapp");
      const imagesCollection = db.collection('images');
      const { wallet,dataURL, orderId ,imageSize, cardinal_address, ordinal_address, cardinal_pubkey, status, 
    } = req.body;
      const result = await imagesCollection.insertOne({ wallet,dataURL,orderId, imageSize, cardinal_address, ordinal_address, cardinal_pubkey,status
    });
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


// pages/api/db.ts

// import { MongoClient } from 'mongodb';

// let client: MongoClient;

// export async function connectToDatabase() {
//   const uri = 'mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/myapp'; // Your MongoDB connection URI
//   try {
//     client = new MongoClient(uri);
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error);
//     throw error;
//   }
// }

// export function getDatabase() {
//   return client.db('myapp');
// }

// export function getCollection(images: string) {
//   return getDatabase().collection(images);
// }

// export async function insertDocument(images: string, document: any) {
//   try {
//     const result = await getCollection(images).insertOne(document);
//     console.log('Document inserted:', result.insertedId);
//     return result.insertedId;
//   } catch (error) {
//     console.error('Failed to insert document:', error);
//     throw error;
//   }
// }




// import mongoose from 'mongoose';

// global.mongoose={
//   conn:null,
//   promise: null,
// };

// export async function dbConnect(){
//   if(global.mongoose && global.mongoose.conn){
//     console.log('connected from prev');
//     return global.mongoose.conn;
//   }
//   else {
//     const uri = 'mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/myapp';
    
//     const promise = mongoose.connect(uri, {
//       autoIndex: true,
//     });

//     global.mongoose={
//       conn: await promise,
//       promise,
//     };
//     console.log('Connected');

//     return await promise;
//   }
// }