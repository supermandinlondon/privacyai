import { SessionProvider } from 'all/components/SessionProvider';
import SideBar from 'all/components/SideBar';
import {getServerSession} from "next-auth";
import '../styles/globals.css';
import Login from 'all/components/Login';
import { authOptions } from 'all/pages/api/auth/[...nextauth]';
import ClientProvider from 'all/components/ClientProvider';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  console.log(session);
  return (
    <html>
      <head/>
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <div>
               <Login/>
            </div>
            

          ):(
            <div className='flex'>
            {/*sidebar*/}
            <div className='bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[20rem]'>
              <SideBar/>
            </div>
            {/*clientProvider - Notfication*/}
            <ClientProvider/>
            <div className="bg-[#343541] flex-1">{children}</div>
          </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}