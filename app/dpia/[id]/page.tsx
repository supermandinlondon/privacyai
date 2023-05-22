import Dpia2 from "all/components/Dpia2";


type Props= {
  params: {
      id: string;
  }
}

function DpiaPage({params: {id}}: Props) {
return (
  <div className="flex bg-white flex-col h-screen overflow-hidden">
     <Dpia2 dpiaId ={id}/>
  </div>
);
}

export default DpiaPage;