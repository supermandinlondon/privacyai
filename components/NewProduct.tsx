"use client"
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@heroicons/react/24/solid'
import { doc, getDoc,addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

import { db } from 'all/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, Key } from 'react';
import toast from 'react-hot-toast';
import queryGPT from 'all/lib/queryApi';



import { motion } from 'framer-motion';

function NewProduct() {
  const router = useRouter();
  const {data: session } = useSession();

  
 
  const [products, loading, error] = useCollection(
    session && query(collection (db, "users", session.user?.email!,"products"),
    orderBy('createdAt','asc')));
   
  const createNewProduct = async() => {
  try{
   
   
    
     const doc = await addDoc (
      collection(db,"users", session?.user?.email!, "products"),
      {
        requirements :['req 11', 'req 21','req 31'], 
        name:'New Product444',
        userID:session?.user?.email!,
        createdAt: serverTimestamp()
      }
    );
    console.log("new product added and the ID is ::"+doc.id);
    //router.push(`/product/${doc.id}`);
  
  }
  catch(error){
    console.log("errorrrrr")
     console.error(error);
  } 
  };

  const createNewDpia = async(productId: string) => {
    try{
      
      

     router.push(`/dpiapref/${productId}`);
      console.log("after routing");
    }
    catch(error){
      console.log("errorrrrr")
       console.error(error);
    } 
    };
  
    return (
      <div className="p-8">

       <div className="flex items-right justify-between mb-4">
            <p></p>
            <div
              onClick={createNewProduct}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Add New Product
            </div>     
        </div>  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {loading && (
            <div className="animate-pulse text-center text-white">
              <p>Loading Chats...</p>
            </div>
          )}
          {products?.docs.map((product) => (
            <motion.div
              key={product.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6  bg-gray-100 rounded-md hover:bg-black hover:text-white shadow-lg cursor-pointer"
              onClick={() => createNewDpia(product.id)}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-lg hover:text-white font-semibold">Name: {product.data().name}</p>
                <div className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  <p>Create DPIA</p>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-4 pt-4">
                <p className="mb-2 font-semibold">Requirements:</p>
                <ul>
                  {product.data().requirements.map((requirement: string, index: number) => (
                    <li key={index} className="mb-1">
                      {`${index + 1}. ${requirement}`}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  export default NewProduct;