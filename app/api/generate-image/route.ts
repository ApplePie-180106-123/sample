import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      width: 768,
      height: 768,
      prompt,
      refine: 'expert_ensemble_refiner',
      apply_watermark: false,
      num_inference_steps: 25,
    };

    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      { input }
    );

    // output is an array of image URLs
    const imageUrl = Array.isArray(output) ? output[0] : null;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Replicate API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
