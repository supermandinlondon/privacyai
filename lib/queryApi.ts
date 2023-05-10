import openai  from "./chatgpt";

const query = async (prompt: string, chatId: string, model: string) =>{
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

console.log("inside queryAPI function . after query");

export default query;