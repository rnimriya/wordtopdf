import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../utils/authOptions.js';
import { prisma } from '../../../../utils/db.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Gate AI endpoint behind active Pro plan subscription
    if (!session || !session.user || session.user.subscriptionStatus !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required to use AI tools' }, { status: 403 });
    }

    const { messages, documentText } = await req.json();

    if (documentText !== undefined && documentText !== null && typeof documentText !== 'string') {
      return NextResponse.json({ error: 'documentText must be a string' }, { status: 400 });
    }

    if (documentText && documentText.length > 150000) {
      return NextResponse.json({ error: 'documentText is too large' }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }

    if (messages.length > 100) {
      return NextResponse.json({ error: 'Too many messages in history' }, { status: 400 });
    }

    for (const msg of messages) {
      if (typeof msg !== 'object' || msg === null) {
        return NextResponse.json({ error: 'Invalid message structure' }, { status: 400 });
      }
      if (typeof msg.role !== 'string' || typeof msg.content !== 'string') {
        return NextResponse.json({ error: 'Message role and content must be strings' }, { status: 400 });
      }
      if (msg.role !== 'user' && msg.role !== 'assistant' && msg.role !== 'model') {
        return NextResponse.json({ error: 'Invalid message role' }, { status: 400 });
      }
      if (msg.content.length > 10000) {
        return NextResponse.json({ error: 'Message content too long' }, { status: 400 });
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // Developer Mock Fallback (when Gemini API Key is missing)
    if (!geminiKey) {
      console.warn("GEMINI_API_KEY is not configured. Mocking smart response...");
      const lastMessage = messages[messages.length - 1]?.content || "";
      
      let mockReply = `Based on your document analysis query: "${lastMessage}", the engine parsed the text layout and verified structure nodes. \n\n*Developer Notice: Set the \`GEMINI_API_KEY\` environment variable in your \`.env\` file to enable real Gemini AI completions here.*`;
      
      // Customize reply if documentText is present
      if (documentText) {
        mockReply = `I have analyzed the document (length: ${documentText.length} characters) and noticed references to standard client-side sandbox environments. How can I help you query specific sections?\n\n*Developer Notice: Set the \`GEMINI_API_KEY\` environment variable in your \`.env\` file to enable real Gemini AI completions here.*`;
      }

      return NextResponse.json({ 
        role: "assistant", 
        content: mockReply
      });
    }

    // Prepare system prompt with document context
    const docPrompt = documentText 
      ? `You are an intelligent PDF document assistant. You are given the following extracted text from the user's PDF document:\n\n=== EXTRACTED PDF TEXT ===\n${documentText.substring(0, 15000)}\n=== END PDF TEXT ===\n\nAnalyze the document text and answer queries strictly according to the context provided above.`
      : `You are an intelligent document assistant. Answer the user's queries concisely.`;

    // Map conversation logs to Gemini contents format
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${docPrompt}\n\nHi, I have uploaded my document.` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Hello! I have loaded your document. I am ready to answer your questions or summarize its contents.' }]
      }
    ];

    messages.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Invoke Gemini Pro Model via REST API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || 'Failed to contact Gemini API');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to analyze that section of the document.";

    return NextResponse.json({
      role: 'assistant',
      content: reply,
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during AI processing.' }, { status: 500 });
  }
}
