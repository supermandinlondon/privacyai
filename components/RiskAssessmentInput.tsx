"use client";

import toast  from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import axios from "axios";

type Props= {
        chatId: string;
    };


    
function RiskAssessmentInput({chatId}: Props) {
    const [prompt, setPrompt] = useState("");
    const {data: session} = useSession();

    const { data: model} = useSWR('model',{
        fallbackData:'gpt-3.5-turbo'
    })

    const queryEmbeddings = async (prompt: string) => {
        try {
        console.log('Sending prompt to Flask server:', prompt); // Log the prompt being sent
        const response = await axios.post('http://localhost:5001/api/query_embeddings', { prompt: prompt });
          const matches = response.data;
        console.log('Received response from Flask server:', matches);
          return matches;
        } catch (error) {
          console.error('Error fetching query embeddings:', error);
          return [];
        }
      };

      const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt) return;
        const input = prompt.trim();
      
        // Call the queryEmbeddings function to get the results from the Flask server
        const riskObservationsText = await queryEmbeddings(prompt);

        // Merge the response and develop the query to the OpenAI API
        const baseText = 'You are a Data Protection Officer with expertise in GDPR. Analyze the provided risk observation records to answer the following question: ';

        const riskQuestion = '. These are the risk observations that matched the question, which are numbered: ';
      
        // Rules for analyzing risk log
        const riskRules =
        ' When analyzing the risk observations, please follow these guidelines: ' +
        '1) You can choose which of te risk observations are most relevant to the question. ' +
        '2) Provdie a top level summary of the question, but also list specific, risks that are separated by a new line. ' +
        '3) Include the revelent risk observation number at the beginning of each new line in your response, if necessary. ' +
        '4) Keep your response under 200 words.'
        ;

        const combinedText = baseText + prompt + riskQuestion + riskObservationsText.join(' ') + riskRules;

        console.log('Full question:', combinedText);

        setPrompt("");
        
        const message: Message ={
            text: input,
            createdAt: serverTimestamp(),
            user:{
                _id:session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name="hello"`,
            }
        };
        
        
        await addDoc(collection(db,'users',session?.user?.email!,'chats', chatId, 'messages'), 
        message 
        );
        
        // Toast notification to say Loading
        const notification = toast.loading('ChatGPT is thinking...');

        await fetch("/api/askQuestion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: combinedText,
              chatId,
              model,
              session,
              messages: [{ role: "user", content: combinedText }],
            }),
        }).then(() => {
            //Toast notification to say successful
            console.log('prompt: hello world', prompt);
            console.log('session:', session);
            toast.success('ChatGPT has responded',{id:notification});
            console.log('after prompt*************');
        });
    };

    
  return (
    <div className="h-48" >
        <form onSubmit={sendMessage} 
            className="fixed-buttom-0   z-5 w-full flex px-20 py-20 
            
            space-y-2

            space-x-2  border-t border-gray-100 ">
            <input 
            className=" 
            flex items-center py-2   md:border-2 bg-transparent 
            rounded-lg
            shadow-md md:px-10
            
            flex-1  border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600
            focus:border-transparent px-5  disabled:opacity-50 disabled:cursor-not-allowed
            
            "
            disabled={!session}
            value ={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type = "text" 
            placeholder = "Type your message here..."/>

            <button 
                disabled={!prompt || !session} 
                type="submit"
                className="bg-[#11A37F] hover:opacity-50 text-white font-bold
                px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
                <PaperAirplaneIcon className="h-5 w-5 -rotate-45"/>
            </button>


        </form>
        <div className="md:hidden">
            <ModelSelection/>
        </div>
    </div>  
  );
}

export default RiskAssessmentInput;

