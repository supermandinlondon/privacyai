// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from 'all/firebaseAdmin';
import query from '../../lib/queryApi';
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "firebase-admin";

type Data = {
  answer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("inside ask question api");
    const {prompt, productId, model, session, domain} = req.body;

   
    console.log("prompt :: "+ prompt);
    console.log("chatId :: "+ productId);
    console.log("model  :: "+ model);
    console.log("domain  :: "+ domain);

    if(!prompt){
        res.status(400).json({answer: "Please provide a prompt!"});
        return;
    }

    if(!model){
        res.status(400).json({answer: "Please provide a valid model!"});
        return;
    }

    // ChatGPT Query 

    const response = await query(prompt, productId, model);
    
    //const response= domain + "_hello_ "+productId;

    const message: Message = {
        text: response || "ChatGPT was unable to find the answer of that!",
        createdAt: admin.firestore.Timestamp.now(),
        user:{
            _id:"ChatGPT",
            name: "ChatGPT",
            avatar: "https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png"
        },
    };

/* 
    await adminDb
        .collection('users')
        .doc(session?.user?.email)
        .collection("products")'message
        .doc(productId)
        .collection("dpias")
        .add(message)

     */

        await adminDb
        .collection('users')
        .doc(session?.user?.email)
        .collection("products")
        .doc(productId)
        .collection(domain)
        .add(message)
        .then(() => {
          console.log("DPIA version created successfully");
        })
        .catch((error) => {
          console.error("Error adding DPIA version: ", error);
        });
      
      


    console.log("inside ask question api. resoonse" + message.text );
    res.status(200).json({ answer: message.text })
    
    }


    