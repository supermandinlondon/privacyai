import { SessionProvider } from 'all/components/SessionProvider';
import {getServerSession} from "next-auth";
import { authOptions } from 'all/pages/api/auth/[...nextauth]';
import NewProduct from 'all/components/NewProduct';
import Footer from 'all/app/Footer';



export default async function  page() {
  const session = await getServerSession(authOptions);
  return (
    <div className=' bg-white'>
        <SessionProvider session={session}>
            <NewProduct/>
        </SessionProvider>   
        <Footer/>     
    </div>
  )
}

