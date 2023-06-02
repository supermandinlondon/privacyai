import Chat from "all/components/Chat";
import PrivacyRequirementInput from "all/components/PrivacyRequirementInput";

type Props= {
    params: {
        id: string;
    }
}

function PrivacyRequirementPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <div className="overflow-y-auto h-full">
            <Chat chatId ={id}/>
        </div>
        <div className="fixed bottom-20 w-full">
            <PrivacyRequirementInput chatId ={id}/>
        </div>
    </div>
  );
}


export default PrivacyRequirementPage;