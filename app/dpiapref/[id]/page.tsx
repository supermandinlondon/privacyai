"use client"
import React, { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Multiselect from 'multiselect-react-dropdown';

function DpiaPage() {
  const pathname = usePathname();
  if (!pathname) return null;

  const parts = pathname.split('/');
  const productId = parts[parts.length - 1];

  const Domains = [
    { domain: 'Transparency' },
    { domain: 'Fairness' },
    { domain: 'Purpose Limitation' },
    { domain: 'Data Subject Rights' },
    { domain: 'Breach' },
    { domain: 'Deletion' },
    { domain: 'Privacy for Security' },
    { domain: 'Privacy By Design and Default' }
  ];

  const router = useRouter();
  const { data: session } = useSession();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]); // <-- Add state for selected options

  const handleDomainSelection = (domain: string) => {
    setSelectedDomains((prevSelectedDomains: string[]) => {
      if (prevSelectedDomains.includes(domain)) {
        return prevSelectedDomains.filter((selectedDomain) => selectedDomain !== domain);
      } else {
        return [...prevSelectedDomains, domain];
      }
    });
  };

  const handlePromptChange = (index: number, value: string) => {
    setPrompts((prevPrompts: string[]) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts[index] = value;
      return updatedPrompts;
    });
  };

  const handleAddPrompt = () => {
    setPrompts((prevPrompts: string[]) => [...prevPrompts, '']);
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts((prevPrompts: string[]) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts.splice(index, 1);
      return updatedPrompts;
    });
  };

  const createNewDpia = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const validPrompts = prompts.filter((prompt) => prompt.trim() !== '');
      console.log('Domains:', selectedDomains);
      console.log('Prompts:', validPrompts);
      console.log('Checkbox 1:', checkbox1);
      console.log('Checkbox 2:', checkbox2);
      console.log('Checkbox 3:', checkbox3);
      console.log('Selected Options:', selectedOptions.map(option => option.key)); // <-- Print selected values
      console.log('New DPIA placeholder added');
      console.log('Passed product ID to function is: ' + productId);
      
      const model = 'text-davinci-003';

      for (const { domain } of Domains) {
        if (selectedDomains.includes(domain)) {
          const firstText = 'You are a data protection officer for Facebook. The company is launching a product which is similar to the Apple Watch. We are calling it TWatch. Can you create a data protection impact assessment (DPIA) to assess potential data protection risk associated with this product and suggest mitigation. Focus on assessing GDPR ';
          const secondText = ' requirements. First explain key ';
          const thirdText = ' requirements for this product then write top 10 data protection risks in numbered form and finally write 10 mitigations in bullet form. Make your answers to 2000 words and send your response in an HTML format so that I can copy that in an HTML code ';
          const combinedText = firstText + domain + secondText + domain + thirdText;
          const notification = toast.loading('ChatGPT is thinking about ...' + domain);

          await fetch('/api/createDpia', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: combinedText,
              productId,
              model,
              session,
              domain,
            }),
          })
            .then(() => {
              toast.success('ChatGPT has responded', { id: notification });
            })
            .catch((err) => {
              console.log('Error while calling API:', err);
            });
            // Reset selected options
      setSelectedOptions([]);
        }
      }

      router.push(`/dpia/${productId}`);
      console.log('After routing');
    } catch (error) {
      console.log('Errorrrrr');
      console.error(error);
    }
  };


  return (
    <div className="flex bg-white flex-col min-h-screen overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Confirm your DPIA preferences here</h1>
        <div className="p-8 flex-1 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {Domains?.map(({ domain }: { domain: string }) => (
            <motion.div
              key={domain}
              className={`flex items-center justify-center p-4 rounded-lg transition-colors duration-300 hover:bg-blue-500 ${
                selectedDomains.includes(domain) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
              }`}
              style={{ borderColor: selectedDomains.includes(domain) ? '#2563eb' : 'transparent', borderWidth: '2px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDomainSelection(domain)}
            >
              <p className={`text-lg font-semibold ${selectedDomains.includes(domain) ? 'text-white' : ''}`}>{domain}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <form onSubmit={createNewDpia} className="flex flex-col px-6 py-4 space-y-6 border-t border-gray-100">
        {/* Rest of the code... */}

        <Multiselect
          displayValue="key"
          onSelect={(selectedList: any[], selectedItem: any) => setSelectedOptions(selectedList)}
          onRemove={(selectedList: any[], removedItem: any) => setSelectedOptions(selectedList)}
          options={[
            { key: 'Option 1' },
            { key: 'Option 2' },
            { key: 'Option 3' },
            { key: 'Option 4' },
            { key: 'Option 5' },
          ]}
        />

<div className="flex flex-col space-y-4">
          {prompts.map((prompt, index) => (
            <motion.div
              key={index}
              className="relative flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <input
                className="items-center py-2 border-b-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed h-20 flex-1 p-2 rounded-md resize-none"
                disabled={!session}
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                type="text"
                placeholder="Type your additional assessment areas here"
              />

              {index > 0 && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => handleRemovePrompt(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              )}
            </motion.div>
          ))}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: prompts.length * 0.1 }}
          >
            <button
              type="button"
              className="flex items-center justify-center p-2 bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleAddPrompt}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <p className="text-sm text-gray-500">Add prompt</p>
          </motion.div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={checkbox1}
              onChange={(e) => setCheckbox1(e.target.checked)}
            />
            <label>Checkbox 1</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={checkbox2}
              onChange={(e) => setCheckbox2(e.target.checked)}
            />
            <label>Checkbox 2</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={checkbox3}
              onChange={(e) => setCheckbox3(e.target.checked)}
            />
            <label>Checkbox 3</label>
          </div>
        </div>


        <button
          disabled={!session}
          type="submit"
          className="bg-[#11A37F] hover:bg-[#0A845E] text-white font-bold py-3 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default DpiaPage;
