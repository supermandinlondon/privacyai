"use client"
import TransitionEffect from "all/app/TransitionEffect";
import Dpia2 from "all/components/Dpia2";


type Props= {
  params: {
      id: string;
  }
}

function DpiaPage({params: {id}}: Props) {
return (
    <div className="flex bg-white flex-col min-h-screen overflow-hidden px-4 sm:px-8">
     <TransitionEffect />
     <Dpia2 dpiaId ={id}/>
  </div>
);
}

export default DpiaPage;