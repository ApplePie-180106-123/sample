import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory chat session map (userId -> chat object)
const chatSessions: Record<string, any> = {};

export async function generateTextResponse(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text response:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again.';
  }
}

export async function generateTextResponseWithChat(userId: string, message: string): Promise<string> {
  try {
    // Use or create a chat session for this user
    if (!chatSessions[userId]) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      chatSessions[userId] = model.startChat({ history: [] });
    }
    const chat = chatSessions[userId];
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again.';
  }
}

export async function generateImageResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const imagePrompt = `Create a detailed, vivid description for an image based on this prompt: ${prompt}. 
    Make it artistic and suitable for image generation. Include details about colors, composition, lighting, and style.`;

    const result = await model.generateContent(imagePrompt);
    const response = await result.response;

    return `🎨 Image Description: ${response.text()}`;
  } catch (error) {
    console.error('Error generating image response:', error);
    return 'I apologize, but I encountered an error while generating the image description. Please try again.';
  }
}

export async function generateImageWithHuggingFace(userPrompt: string): Promise<string> {
  // 1. Use Gemini to generate a creative image prompt
  let geminiPrompt = userPrompt;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(
      `Rewrite this as a vivid, creative prompt for an AI image generator: ${userPrompt}`
    );
    geminiPrompt = (await result.response).text();
  } catch (error) {
    console.error('Gemini prompt generation failed, using user prompt:', error);
  }

  // 2. Use Hugging Face Stable Diffusion to generate the image
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: geminiPrompt }),
    });
    if (!response.ok) {
      console.error('Hugging Face API error:', await response.text());
      throw new Error('Hugging Face API error');
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error generating image with Hugging Face:', error);
    return 'Image generation failed.';
  }
}