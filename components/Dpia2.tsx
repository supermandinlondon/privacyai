"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "../firebase";
import { collection, query, doc, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";

type Props = {
  dpiaId: string;
};

type Domain = {
  domain: string;
  domainValues: string[];
  selectedValue: string | null;
};

function Dpia2({ dpiaId }: Props) {
  const { data: session } = useSession();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
   

      const Domains = [
        { domain: 'Transparency' , values: ["11", "21", "31"]},
        { domain: 'Fairness', values: ["11", "21", "31"] },
        { domain: 'Purpose Limitation' , values: ["11", "21", "31"]},
        { domain: 'Data Subject Rights' , values: ["11", "21", "31"]},
        { domain: 'Breach' , values: ["11", "21", "31"]},
        { domain: 'Deletion' , values: ["11", "21", "31"]},
        { domain: 'Privacy for Security' , values: ["11", "21", "31"]},
        { domain: 'Privacy By Design and Default', values: ["11", "21", "31"] },
      ];

      const updatedDomains = await Promise.all(
        Domains.map(async ({ domain, values }) => {
          const collectionRef = collection(
            db,
            "users",
            session?.user?.email!,
            "products",
            dpiaId,
            domain
          );
          const querySnapshot = await getDocs(collectionRef);
          const domainValues = querySnapshot.docs.map((doc) => doc.data().text);

          const latestValue =
            domainValues.length > 0 ? domainValues[domainValues.length - 1] : null;

          return { domain, domainValues, selectedValue: latestValue };
        })
      );

      setDomains(updatedDomains);
      setLoading(false);
    };

    if (session) {
      fetchDomains();
    }
  }, [session, dpiaId]);

  const handleDropdownChange = (value: string | null, domain: string) => {
    const updatedDomains = domains.map((d) => {
      if (d.domain === domain) {
        return { ...d, selectedValue: value };
      } else {
        return d;
      }
    });
    setDomains(updatedDomains);
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600 font-semibold">Loading...</div>
        </div>
      ) : (
        domains.map(({ domain, domainValues, selectedValue }, index) => (
          <motion.div
            key={`${domain}_${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 bg-white rounded-lg shadow-lg mb-4"
          >
            <h2 className="text-2xl font-bold mb-4">{domain}</h2>
            <div className="flex items-center space-x-4">
            <div className="text-gray-900 font-medium flex-grow">
    {selectedValue ? (
      <div dangerouslySetInnerHTML={{ __html: selectedValue }} />
    ) : (
      <span className="text-gray-400">No value selected</span>
    )}
  </div>
              <Listbox
                value={selectedValue}
                onChange={(value) => handleDropdownChange(value, domain)}
              >
                <div className="relative">
                  <Listbox.Button className="relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate">
                      {selectedValue ? "Versions" : "Latest Value"}
                    </span>
                   
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {domainValues.map((value, index) => (
                      <Listbox.Option
                        key={`${domain}_${index}`}
                        value={value}
                        className={({ active }) =>
                          `${
                            active ? "text-white bg-blue-500" : "text-gray-900"
                          } cursor-default select-none relative py-2 pl-10 pr-4`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {index + 1}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? "text-white" : "text-blue-500"
                                } absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                              
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

export default Dpia2;
