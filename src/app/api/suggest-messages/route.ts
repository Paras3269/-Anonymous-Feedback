import { GoogleGenAI } from "@google/genai";


   
export const runtime = "edge";

export async function POST(req: Request) {
    
     const apiKey = process.env.GEMINI_API_KEY;


     if (!apiKey) {
    return new Response("Missing GOOGLE_API_KEY", { status: 500 });
  }
    const ai = new GoogleGenAI({apiKey});
 try {
     const prompt= " Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by ''. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.and always change them when having a new request all of them "
   
     const stream = await ai.models.generateContentStream({
       model: "gemini-3-flash-preview",
       contents: [{ role: "user", parts: [{ text: prompt }] }],
     });
     console.log(stream)
   
     const encoder = new TextEncoder();
   
     const readable = new ReadableStream({
       async start(controller) {
         for await (const chunk of stream) {
           
            
           const text = chunk.text;
           if (text) {
             controller.enqueue(encoder.encode(text));
           }
         }
         controller.close();
       },
     });
   
     return new Response(readable, {
       headers: {
         "Content-Type": "text/plain; charset=utf-8",
       },
     });
 } catch (error) {
         console.error("An unexpected error occured",error)
            throw error
        
 }
}
