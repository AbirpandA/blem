import { NextRequest,NextResponse } from "next/server";
import { basePrompt as nodeBaseprompt } from "@/lib/defaults/node";
import { basePrompt as reactBasePrompt } from "@/lib/defaults/react";
import { generateTemplatePromt } from "@/lib/groq";  
import { BASE_PROMPT } from "@/lib/prompts";

export async function POST(request: NextRequest) {
    try{
        const {prompt}=await request.json();

        const response= await generateTemplatePromt(prompt);

        if(!response.ok){
            const errordata= await response.json();
            console.log("Groq Api error",errordata)
            throw new Error(`Groq Api failed with response ${response.status}`)
        }

        const completion = await response.json();
        const content = completion.choices?.[0]?.message?.content.trim();

        if(content=='react' ){
           return  NextResponse.json({
                prompt:[BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts:[reactBasePrompt]
            },{status:200} )
        }
        if(content=='node'){
           return  NextResponse.json({
                prompt:[`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts:[nodeBaseprompt]
            },{status:200} )
            
        }

        
        return  NextResponse.json({error:"Could not determine project type"}, {status:400});
        
    }catch(err){

        console.log(err)
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
        

    }
}

 