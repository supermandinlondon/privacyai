import Link from 'next/link'
import SignInButton from './SignInButton';
import Image from 'next/image';
import NewDpia from './NewDpia';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 p-5 bg-white shadow-md md:px-10">
			{/* Left */}
			<div className="relative flex items-center h-10 my-auto cursor-pointer">
				<Link href="/">
					<Image
					src="https://links.papareact.com/2i6"          
					fill
					className="object-contain object-left"
					alt="PrivacyGPT Logo"
					/>
				</Link>
			</div>

			{/* Mid - Links */}
			
			

      <div className="flex justify-center">
        <Link href='/protected/client'>Privacy J.A.R.V.I.S</Link>
		
			</div>

			{/* Right */}
			<div className="flex  justify-end space-x-4">			
				<SignInButton />
			</div>	
		</header>
  )
}

export default Header