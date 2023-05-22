"use client"

import { PlusIcon } from '@heroicons/react/24/solid';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { db } from 'all/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { motion } from 'framer-motion';
import { firestore } from 'firebase-admin';

async function Productpage() {
  const router = useRouter();
  const { data: session } = useSession();

  //const productDocRef = doc(db, 'users', session?.user?.email, 'products', 'r2PpD8OzQRq4SL0cJxUi');
  //const productSnapshot = await getDoc(productDocRef);
  //const product = productSnapshot.data();

  const createNewProduct = async () => {
    try {
      const newProduct = {
        requirements: ['req 11', 'req 21', 'req 31'],
        name: 'New Product123',
        userID: session?.user?.email,
        createdAt: serverTimestamp(),
      };
      //const docRef = await addDoc(collection(firestore, 'users', session?.user?.email, 'products'), newProduct);
     // console.log('New product added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding new product: ', error);
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
        <motion.div
          key="123"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6  bg-gray-100 rounded-md hover:bg-black hover:text-white shadow-lg cursor-pointer"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-lg hover:text-white font-semibold">
             Name: xxx
            </p>
            <div className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              <PlusIcon className="w-5 h-5 mr-2" />
              <p>Create DPIA</p>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <p className="mb-2 font-semibold">Requirements:</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Productpage;
