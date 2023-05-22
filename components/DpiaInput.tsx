"use client";

import toast  from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import useSWR from "swr";

type Props= {
        chatId: string;
    };

function DpiaInput({chatId}: Props) {
    const [prompt, setPrompt] = useState("");
    const {data: session} = useSession();
    const { data: model} = useSWR('model',{
        fallbackData:'text-davinci-003'
    })
    const Domains = [
        {"title":"Fairness"}
    ]   
    const sendMessage = async () =>{
     
        const message: Message ={
            text: 'Hey! Please generate a DPIA for this product',
            createdAt: serverTimestamp(),
            user:{
                _id:session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name="hello"`,
            }
        };       
        await addDoc(collection(db,'users',session?.user?.email!,'chats', chatId, 'messages'), message  );

        Domains?.map(
            async ({ title }: { title: string }) => {
                const firstText = 'You are a data protection officer for Facebook. The company is launching a product which is similar to the Apple Watch. We are calling it  TWatch. Can you create a data protection impact assessment (DPIA) to assess potential data protection risk associated with this product and suggest mitigation. Focus on assessing GDPR ';
                const secondText =  ' requirements. First explain key ' ;
                const thirdText = ' requirements for this product then write top 10 data protection risks in numbered form and finally write 10 mitigations in bullet form. Make your answers to 2000 words and send your response in an HTML format so that I can copy that in a HTML code ';
                const combinedText = firstText + title + secondText + title + thirdText;
              
                const notification = toast.loading('ChatGPT is thinking about ...'+title);
                await fetch("/api/askQuestion", {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        prompt: combinedText, 
                        chatId, 
                        model, 
                        session,
                    }),
                }).then(() => {
                    toast.success('ChatGPT has responded',{id:notification});
                }).catch((err) => {
                    console.log('Error while calling API:', err);
                });
               }
        );
    };

    
  return (
     
    <div onClick ={sendMessage} className='border-gray-700 border chatRow'>  
        <p> Create DPIA</p>
    </div>
  );
}
export default DpiaInput;

