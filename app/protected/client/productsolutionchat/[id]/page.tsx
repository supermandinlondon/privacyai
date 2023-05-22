import Chat from "all/components/Chat";
import ProductSolutionInput from "all/components/ProductSolutionInput";

type Props= {
    params: {
        id: string;
    }
}

function ProductSolution({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <Chat chatId ={id}/>
        <ProductSolutionInput chatId ={id}/>
    </div>
  );
}

export default ProductSolution;