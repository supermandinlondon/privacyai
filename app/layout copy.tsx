import { SessionProvider } from 'all/components/SessionProvider';
import {getServerSession} from "next-auth";
import '../styles/globals.css';
import Login from 'all/components/Login';
import { authOptions } from 'all/pages/api/auth/[...nextauth]';
import ClientProvider from 'all/components/ClientProvider';
import Header from './Header';
import Footer from './Footer';
import Head from './head';
import Banner from './Banner';
import MediumCard from './MediumCard';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  const cardsData = [{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/2io","title":"Outdoor getaways"},{"img":"https://links.papareact.com/q7j","title":"Unique stays"},{"img":"https://links.papareact.com/s03","title":"Entire homes"},{"img":"https://links.papareact.com/8ix","title":"Pet allowed"}]
  
  return (
    <html>
      <Head/>
      <body>
      <SessionProvider session={session}>
        {/* @ts-expect-error Server Component */}
        <Header/> 
        <Banner/>
        <div className='flex'>
          <ClientProvider/>
          <div className="bg-[#343541] flex-1">{children}</div>
        </div>   
      </SessionProvider>

      <main className="px-8 mx-auto max-w-7xl sm:px-16">
				

				<section>
					<h2 className="py-8 text-4xl font-semibold">Live Anywhere</h2>

					<div className="flex p-3 -ml-3 space-x-3 overflow-scroll scrollbar-hide">
						{cardsData?.map(
							({ img, title }: { img: string; title: string }) => (
								<MediumCard key={img} img={img} title={title} />
							)
						)}
					</div>
				</section>

				
			</main>

      <Footer/>
      </body>
    </html>
  );
}