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


    
function PrivacyRequirementInput({chatId}: Props) {
    const [prompt, setPrompt] = useState("");
    const {data: session} = useSession();

    const { data: model} = useSWR('model',{
        fallbackData:'gpt-3.5-turbo'
    })


    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      };
    

    // Send query to the Flask server
    const queryEmbeddings = async (data: { prompt: string, index_name: string }) => {
      try {
          console.log('Sending data to Flask server:', data);
          const response = await axios.post('http://localhost:5001/api/query_embeddings', data);
          const matches = response.data;
          console.log('Received response from Flask server:', matches);
          return matches;
      } catch (error) {
          console.error('Error fetching query embeddings:', error);
          return [];
      }
  };  

        const sendMessage = async () => {
            if (!prompt) return;
            const input = prompt.trim();
        
        // Specify the database index to query
        const requestData = {
          prompt: input,
          index_name: "privacyrequirements"
      };
      
        // Call the queryEmbeddings function to get the results from the Flask server
        const privacyRequirementText = await queryEmbeddings(requestData);
        console.log('Records:', requestData);

        // Merge the response and develop the query to the OpenAI API
        const baseText = 'You are a Data Protection Officer with expertise in privacy law and also understands HTML coding. Analyze this question regarding privacy requirements for a product: ';

        const privacyRequirementQuestion = '. When responding, please format your response using HTML tags for better readability, such as <b> for bold text, <br><br> for line breaks, and <ul> and <li> for unordered lists. These are the existing privacy requirements related to the question: ';
      
        // Rules for analyzing privacy requirements
        const privacyRequirementRules =
        ' When analyzing these privacy requirements and question, please follow these guidelines: ' +
        '1) If the question is asking about if there existing privacy requirements that could help address a privacy risk, provide only the existing privacy requirements that are relevant. ' +
        '2) If the exising privacy requirements do not satisfy the risks raised by the question, provide suggested new privacy requirements that do. '
        ;

        const combinedText = baseText + prompt + privacyRequirementQuestion + privacyRequirementText.join(' ') + privacyRequirementRules;

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
        const notification = toast.loading('PrivacyAI is thinking...');

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
              saveToDatabase: true,
            }),
            
        })
            .then(response => response.json())
            .then(data => {
            
            //Toast notification to say successful
            console.log('prompt: hello world', prompt);
            console.log('session:', session);
            toast.success('PrivacyAI has responded',{id:notification});
            console.log('after prompt*************');
        });
    };

    return (
        <div className="h-48" >
          <form onSubmit={(e) => e.preventDefault()}
            className="fixed-buttom-0 z-5 w-full flex justify-center px-10 py-20 space-y-2 space-x-2 ">
            <div className="relative w-full max-w-2xl flex-grow"> {/* Set a maximum width here */}
              <textarea 
                className="flex items-center py-2 md:border-2 bg-white rounded-lg
                shadow-md md:px-10 w-full border-gray-100 focus:outline-gray-100 focus:ring-0
                focus:border-transparent px-5 pl-10 pr-10 pb-8 pt-2 disabled:opacity-50
                disabled:cursor-not-allowed resize-none"
                disabled={!session}
                value={prompt}
                onKeyDown={handleKeyDown}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here..."/>
              <button 
                disabled={!prompt || !session}
                onClick={sendMessage}
                type="button"
                className="absolute right-4 bottom-2 bg-[#11A37F] hover:opacity-50 text-white font-bold
                px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
                <PaperAirplaneIcon className="h-5 w-5 -rotate-45"/>
              </button>
            </div>
          </form>
          <div className="md:hidden">
            <ModelSelection/>
          </div>
        </div>  
      );
      
    }

export default PrivacyRequirementInput;

