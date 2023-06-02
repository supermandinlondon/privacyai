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
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
            <Chat chatId ={id}/>
        </div>
        <PrivacyRequirementInput chatId ={id}/>
    </div>
  );
}



export default PrivacyRequirementPage;