// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from 'all/firebaseAdmin';
import queryGPT from '../../lib/queryApi';
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "firebase-admin";

type Data = {
  answer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("inside ask question api112");
    const {prompt, chatId, model, session} = req.body;
   
    console.log("prompt :: "+ prompt);
    console.log("chatId :: "+ chatId);
    console.log("model  :: "+ model);
    if(!prompt){
        res.status(400).json({answer: "Please provide a prompt!"});
        return;
    }

    if(!chatId){
        res.status(400).json({answer: "Please provide a valid chatId!"});
        return;
    }

    // ChatGPT Query 

    const response = await queryGPT(prompt, chatId, model);
    

    const message: Message = {
        text: response || "ChatGPT was unable to find the answer of that!",
        createdAt: admin.firestore.Timestamp.now(),
        user:{
            _id:"ChatGPT",
            name: "ChatGPT",
            avatar: "https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png"
        },
    };

    console.log("inside ask question api. resoonse" + message.text );

    await adminDb
        .collection('users')
        .doc(session?.user?.email)
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add(message)


    res.status(200).json({ answer: message.text })
    
    }


    