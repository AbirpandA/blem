import { NextResponse,NextRequest } from "next/server";
import {  generateChatResponse } from "@/lib/groq";

export async function  POST(request: NextRequest) {
    try{
        const {messages}=await request.json();
        const response= await generateChatResponse(messages)

         if(!response.ok){
            const errordata= await response.json();
            console.log("Groq Api error",errordata)
            throw new Error(`Groq Api failed with response ${response.status}`)
        }

        const completion = await response.json();



        return NextResponse.json( completion.choices[0]?.message ,{status:200})

    }catch(err){
        console.log(err)
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}