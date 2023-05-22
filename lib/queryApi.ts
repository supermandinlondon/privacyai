import openai  from "./chatgpt";

const queryGPT = async (prompt: string, chatId: string, model: string) =>{
    
    console.log("inside queryGPT function. passvalues are");
    console.log("prompt :: "+ prompt);
    console.log("chatId :: "+ chatId);
    console.log("model  :: "+ model);

    const res = await openai
        .createCompletion({
            model,
            prompt,
            temperature:0.9,
            top_p:1, 
            max_tokens:1000,
            frequency_penalty:0,
            presence_penalty:0,
    })
    .then((res)=> res.data.choices[0].text)
    .catch(
        (err) => 
        `error:  chatGPT was unable to find an answer for thatnn! (Error: ${err.message} and prompt was ${prompt} and openAPI object was ${openai} and openAPI model was ${model})`
        );
    return res;
};

export default queryGPT;