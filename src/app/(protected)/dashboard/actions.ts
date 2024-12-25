"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { db } from "@/server/db";
import { generateEmbedding } from "@/lib/gemini";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
  SELECT "fileName","sourceCode","summary",
  1- ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
  FROM "SourceCodeEmbedding"
  WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
  AND "projectId" = ${projectId}
  ORDER BY similarity DESC
  LIMIY 10
  `) as { fileName: string; sourceCode: string; summary: string }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
        You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
        
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        
        If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions, including code snippets.
        START CONTEXT BLOCK
        ${context}
        END CONTEXT BLOCK
        
        START QUESTION BLOCK
        ${question}
        END OF QUESTION
        
        Ai assistant will take into account any CONTEXT BLOCK that is provided in a conversation
        If the context does not provide the answer to question, the Ai assistant will say, "I'm sorry i dont know the answer".
        Ai assistant will not apologize for previous responeds, but instead will indicated new information was gained,
        Ai assistant will not invent anything that is not drawn dirently from the contex,
        Answer is markdown syntax,with code snippentss if needed. Be as detailed as possible when answering, make sure there is no mistake while answering
        `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream, fileRefrences: result };
}
