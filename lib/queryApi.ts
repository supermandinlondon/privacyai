import openai  from "./chatgpt";

const queryGPT = async (prompt: string, Id: string, model: string) =>{
    
    console.log("inside queryAPI function. passed values are");
    console.log("prompt :: "+ prompt);
    console.log("Id :: "+ Id);
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
        `error:  chatGPT was unable to find an answer for that! (Error: ${err.message} )`
        );
    return res;
};

export default queryGPT;