"use client"

import Image from 'next/image';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';


const Banner = () => {
	return (
		<div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
			<Image
				src="https://cdn.dribbble.com/users/982548/screenshots/4773913/media/320ca65ebec4117331aa435aa4917b13.gif"
				fill
				className="object-cover"
				alt="Banner Image"
			/>

			<div className="absolute grid text-lg w-full text-white top-1/4  ">

					<div className='text-3xl text-center'><span className='text-blue-500'>AI-assisted1</span> privacy advice and risk assessment</div>
					
				
			</div>

			<div className="absolute w-full text-center top-1/2">
			
				<Link
					href ="/privacygpt"
					className="px-10 py-4 my-3 font-bold text-blue-500 transition duration-150 bg-white rounded-full shadow-md hover:shadow-xl active:scale-90">
						Try J.A.R.V.I.S.2.3
        		</Link>
				
			</div>

			<div className='absolute grid text-xl w-full text-white top-3/4  text-center'>
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

		</div>
	);
};

export default Banner;