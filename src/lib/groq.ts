import { getSystemPrompt } from "./prompts";
export async function generateTemplatePromt(prompt: string) {
     if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY environment variable is not set.");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
                },
                {
                    role: 'user',
                    content:prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.2,
        }),
    });

    return response;
}


export async function chat(messages:{ role: string, content: string }[]){
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY environment variable is not set.");
    }

    const messagesWithSystem = [
        {
        role:"system",
        content:getSystemPrompt(),},...messages]

    const response = await fetch(' "https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages:messagesWithSystem,
            max_tokens: 8000,
            
        }),
    });




    return response

}