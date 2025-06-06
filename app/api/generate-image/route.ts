import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'a9758cb3b1e7e3c8e6e8e7e3c8e6e8e7e3c8e6e8e7e3c8e6e8e7e3c8e6e8e7', // SDXL 1.0 version id
        input: {
          prompt,
          width: 1024,
          height: 1024,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }),
    });

    if (!replicateResponse.ok) {
      const error = await replicateResponse.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const prediction = await replicateResponse.json();
    // Wait for the prediction to complete
    let imageUrl = null;
    while (!imageUrl && prediction && prediction.id) {
      const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      const statusJson = await statusRes.json();
      if (statusJson.status === 'succeeded') {
        imageUrl = statusJson.output[0];
      } else if (statusJson.status === 'failed') {
        return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
