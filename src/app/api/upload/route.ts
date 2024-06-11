// import {Tap, Script, Address, Signer, Tx} from "@cmdcode/tapscript";
// import * as cryptoTools from "@cmdcode/crypto-tools";
// import { NextRequest, NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid";
// // import { dbConnect} from '@/app/lib/db';

// const PREFIX =160;


// function bytesToHex(bytes: Uint8Array): string {
//     return Array.prototype.map.call(bytes, (byte: number) => {
//       return ('0' + (byte & 0xff).toString(16)).slice(-2);
//     }).join('');
//   }

// export async function generatePrivateKey() {
//     let isValid = false;
//     let privkey;
//     while (!isValid) {
//       privkey = bytesToHex(cryptoTools.noble.secp.utils.randomPrivateKey());
      
//       let seckey = cryptoTools.keys.get_seckey(privkey);
//       let pubkey = cryptoTools.keys.get_pubkey(seckey);
//       const init_script = [pubkey, "OP_CHECKSIG"];
//       let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
//       let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {
//         target: init_leaf,
//       });
//       /**
//        * This is to test IF the tx COULD fail.
//        * This is most likely happening due to an incompatible key being generated.
//        */
//       const test_redeemtx = Tx.create({
//         vin: [
//           {
//             txid: "a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968",
//             vout: 0,
//             prevout: {
//               value: 10000,
//               scriptPubKey: ["OP_1", init_tapkey],
//             },
//           },
//         ],
//         vout: [
//           {
//             value: 8000,
//             scriptPubKey: ["OP_1", init_tapkey],
//           },
//         ],
//       });
//       const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {
//         extension: init_leaf,
//       });
//       test_redeemtx.vin[0].witness = [test_sig.hex, init_script, init_cblock];
//       isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });
//       if (!isValid) {
//         console.log("Invalid key generated, retrying...");
//       } else {
//         console.log({ privkey });
//       }
//     }
//     if (!privkey) {
//       throw Error("No privkey was generated");
//     }
//     return privkey;
//   }

//   export async function processInscriptions(
//     order_id: string,
//     file: any,
//     fee_rate: number
//   ) {
//     const ec = new TextEncoder();


    
//     const dataURL = file && file.dataURL ? file.dataURL : null;
//   if (!dataURL) {
//     throw new Error('File dataURL is missing');
//   }

//   // Generate pubkey and seckey from privkey
//   const privkey = await generatePrivateKey();
//   const seckey = cryptoTools.keys.get_seckey(privkey);
//   const pubkey = cryptoTools.keys.get_pubkey(seckey);

//   // generate mimetype, plain if not present
//   const mimetype = file && file.type ? file.type : "text/plain;charset=utf-8";

//   const base64_data = dataURL.split(",")[1];
//   if (!base64_data) {
//     throw new Error('Base64 data is missing');
//   }
// console.log('Base64 data:', base64_data);
// const data = Buffer.from(base64_data, "base64");

//         const script = [
//           pubkey,
//           "OP_CHECKSIG",
//           "OP_0",
//           "OP_IF",
//           ec.encode("ord"),
//           "01",
//           ec.encode(mimetype),
//           // "07",
//           // ec.encode(metaprotocol),
//           "OP_0",
//           data,
//           "OP_ENDIF",
//         ];
//         // create leaf and tapkey and cblock
//         const leaf = Tap.tree.getLeaf(Script.encode(script));
//         const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
//         // Generated our Inscription Address
//         //@ts-ignore
//         let inscriptionAddress = Address.p2tr.encode(tapkey, network);
//         console.debug("Inscription address: ", inscriptionAddress);
//         console.debug("Tapkey:", tapkey);
//         console.log(file.file_type);
//         let txsize = PREFIX + Math.floor(data.length / 4);
//         let inscription_fee = fee_rate * txsize;
        
//         const inscriptions= {
//           file_type: file.type,
//           data_uri: file.dataURL,
//           order_id,
//           leaf: leaf,
//           tapkey: tapkey,
//           cblock: cblock,
//           inscription_address: inscriptionAddress,
//           inscription_fee,
//           fee_rate: fee_rate,
//         };

//         console.log('inscriptions',inscriptions);
      
//     return inscriptions;
//   }
  

//   export async function POST(req: NextRequest) {
//     console.log(req);
//     try {

      
      
//       const data = await req.json();
//       const { imageInfo, cardinal_address, ordinal_address, cardinal_pubkey, wallet } = data;
  
//       const order_id = uuidv4();
  
//       const processInscriptionsData = await processInscriptions(order_id, imageInfo, 12345);
  
//       const dataToSave = {
//         ...processInscriptionsData,
//         cardinal_address,
//         ordinal_address,
//         cardinal_pubkey,
//         wallet,
//       };


//       console.log(dataToSave);
//       // await dbConnect();

  
//       return NextResponse.json({ message: 'Image data saved successfully' });
//     } catch (err: any) {
//       console.error(err);
//       return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
//     }
//   }
// export const config = {
//   api: {
//     runtime: 'edge',
//   },
// };



import { Tap, Script, Address, Signer, Tx } from "@cmdcode/tapscript";
import * as cryptoTools from "@cmdcode/crypto-tools";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const PREFIX = 160;

function bytesToHex(bytes: Uint8Array): string {
  return Array.prototype.map.call(bytes, (byte: number) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

export async function generatePrivateKey(): Promise<string> {
  let isValid = false;
  let privkey;
  while (!isValid) {
    privkey = bytesToHex(cryptoTools.noble.secp.utils.randomPrivateKey());
    let seckey = cryptoTools.keys.get_seckey(privkey);
    let pubkey = cryptoTools.keys.get_pubkey(seckey);
    const init_script = [pubkey, "OP_CHECKSIG"];
    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {
      target: init_leaf,
    });

    const test_redeemtx = Tx.create({
      vin: [
        {
          txid: "a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968",
          vout: 0,
          prevout: {
            value: 10000,
            scriptPubKey: ["OP_1", init_tapkey],
          },
        },
      ],
      vout: [
        {
          value: 8000,
          scriptPubKey: ["OP_1", init_tapkey],
        },
      ],
    });
    const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {
      extension: init_leaf,
    });
    test_redeemtx.vin[0].witness = [test_sig.hex, init_script, init_cblock];
    isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });
    if (!isValid) {
      console.log("Invalid key generated, retrying...");
    } else {
      console.log({ privkey });
    }
  }
  if (!privkey) {
    throw Error("No privkey was generated");
  }
  return privkey;
}

export async function processInscriptions(order_id: string, file: any, fee_rate: number) {
  const ec = new TextEncoder();

  const dataURL = file && file.dataURL ? file.dataURL : null;
  if (!dataURL) {
    throw new Error('File dataURL is missing');
  }

  const privkey = await generatePrivateKey();
  const seckey = cryptoTools.keys.get_seckey(privkey);
  const pubkey = cryptoTools.keys.get_pubkey(seckey);
  
  const mimetype = file && file.type ? file.type : "text/plain;charset=utf-8";

  const script = [
    pubkey,
    "OP_CHECKSIG",
    "OP_0",
    "OP_IF",
    ec.encode("ord"),
    "01",
    ec.encode(mimetype),
    "OP_0",
    ec.encode(dataURL), // This line changed to use the dataURL directly
    "OP_ENDIF",
  ];
  
  const leaf = Tap.tree.getLeaf(Script.encode(script));
  const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
  
  let inscriptionAddress = Address.p2tr.encode(tapkey);
  console.debug("Inscription address: ", inscriptionAddress);
  console.debug("Tapkey:", tapkey);
  
  let txsize = PREFIX + Math.floor(dataURL.length / 4);
  let inscription_fee = fee_rate * txsize;

  const inscriptions = {
    file_type: file.type,
    data_uri: dataURL,
    order_id,
    leaf: leaf,
    tapkey: tapkey,
    cblock: cblock,
    inscription_address: inscriptionAddress,
    inscription_fee,
    fee_rate,
  };

  console.log('inscriptions', inscriptions);

  return inscriptions;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { imageInfo, cardinal_address, ordinal_address, cardinal_pubkey, wallet } = data;
    const order_id = uuidv4();
    const processInscriptionsData = await processInscriptions(order_id, imageInfo, 12345);
    const dataToSave = {
      ...processInscriptionsData,
      cardinal_address,
      ordinal_address,
      cardinal_pubkey,
      wallet,
    };
    console.log(dataToSave);
    return NextResponse.json({ message: 'Image data saved successfully' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
  }
}

export const config = {
  api: {
    runtime: 'edge',
  },
};
