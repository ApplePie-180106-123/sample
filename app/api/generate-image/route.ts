import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // Stable Horde API endpoint
    const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '0000000000', // anonymous free access
      },
      body: JSON.stringify({
        prompt,
        params: {
          n: 1,
          width: 512,
          height: 512,
          steps: 20,
          sampler_name: 'k_euler',
          cfg_scale: 7,
        },
        nsfw: false,
        censor_nsfw: true,
        models: ["stable_diffusion"]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const { id } = await response.json();
    // Poll for the result
    let imageUrl = null;
    for (let i = 0; i < 30; i++) { // up to 60 seconds
      await new Promise(r => setTimeout(r, 2000));
      const checkRes = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`);
      const checkJson = await checkRes.json();
      if (checkJson.generations && checkJson.generations.length > 0) {
        imageUrl = checkJson.generations[0].img;
        break;
      }
      if (checkJson.done) break;
    }
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image generation failed or timed out.' }, { status: 500 });
    }
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Stable Horde API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
