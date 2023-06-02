import Chat from "all/components/Chat";
import RiskAssessmentInput from "all/components/RiskAssessmentInput";

type Props= {
    params: {
        id: string;
    }
}

function RiskAssessmentPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <div className="overflow-y-auto h-full">
            <Chat chatId ={id}/>
        </div>
        <div className="fixed bottom-20 w-full">
            <RiskAssessmentInput chatId ={id}/>
        </div>
    </div>
  );
}

export default RiskAssessmentPage;