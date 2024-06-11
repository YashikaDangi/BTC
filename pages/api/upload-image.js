// import { MongoClient } from 'mongodb';

// const uri = "mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/myapp";

// export const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       await client.connect();
//       const db = client.db("myapp");
//       const imagesCollection = db.collection('images');
//       const { wallet,dataURL, orderId ,imageSize, cardinal_address, ordinal_address, cardinal_pubkey, status, 
//     } = req.body;
//       const result = await imagesCollection.insertOne({ wallet,dataURL,orderId, imageSize, cardinal_address, ordinal_address, cardinal_pubkey,status
//     });
//       res.status(200).json({ message: 'Image uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       res.status(500).json({ error: 'Failed to upload image' });
//     } finally {
//       await client.close();
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }


// pages/api/upload-image.ts

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/myapp";

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {

      await client.connect();
      const db = client.db("myapp");
      const imagesCollection = db.collection('images');
        const { wallet,dataURI, orderId ,file_type, cardinal_address, ordinal_address, cardinal_pubkey, status, leaf,tap_key, cblock, inscription_address, inscription_fee, fee_rate} = req.body;

      const result = await imagesCollection.insertOne({ wallet,dataURI,orderId, file_type, cardinal_address, ordinal_address, cardinal_pubkey,status,leaf, tap_key, cblock, inscription_address, inscription_fee, fee_rate
    });

      return res.status(200).json({ message: 'Image data saved successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'SERVER ERROR' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
