"use client"

"use client"

import Image from 'next/image';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import homePic from "../public/image.png"
import TransitionEffect from './TransitionEffect';


const Banner = () => {
	return (
		<div>
			
			<TransitionEffect />
			
      <main className='flex items-center text-dark w-full min-h-screen dark:text-light sm:items-start'>
        <div className='pt-0 md:pt-16 sm:pt-16'>
           <div className="flex items-center justify-between w-full lg:flex-col">
               <div className='w-1/2 md:w-full'>
                <Image src={homePic} alt="CodeBucks" className='w-full h-auto  md:inline-block md:w-full'
                priority
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              50vw"
                 />
               </div>
            
           </div>
        </div>

		<div className="absolute grid text-lg w-full text-black top-1/4  ">

<div className='text-3xl text-center'><span className='text-primary'>AI-assisted</span> privacy advice and risk assessment</div>


</div>

<div className="absolute w-full text-center top-1/2">

<Link
href ="/privacygpt"
className="px-10 py-4 my-3 font-bold text-white transition duration-150 bg-primary rounded-full shadow-md hover:shadow-xl active:scale-90">
	Ask AI
</Link>

</div>

<div className='absolute grid text-xl w-full text-primary top-3/4  text-center'>
	<TypeAnimation
		sequence={[
			// Same String at the start will only be typed once, initially
			' Privacy Advice',
			1000,
			' Risk Assessment',
			1000,
			' Data Protection Impact Assessment',
			1000,
		]}
		speed={50}
		repeat={Infinity}
	/>
</div>
        
      </main>
			
			
			
			

		</div>
	);
};

export default Banner;