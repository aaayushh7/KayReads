import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { requireAdmin } from '@/middleware/auth';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

async function generateReview(bulletPoints: string[], bookTitle: string, author: string): Promise<string> {
  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error('HuggingFace API token not configured');
  }

  try {
    // Construct prompt for the AI with specific formatting instructions
    const prompt = `You are a passionate book reviewer with an elegant, literary writing style. Write a detailed book review for "${bookTitle}" by ${author}.

Key thoughts from the reviewer:
${bulletPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n')}

Write a comprehensive, well-structured review following this format:

Opening paragraph: Set the scene and introduce the book with warmth and context. Mention the genre, themes, or what drew you to it.

Second paragraph: Dive into the plot, setting, or premise without spoilers. Discuss what makes this book stand out - the writing style, atmosphere, characters, or unique elements.

Third paragraph: Explore character development, relationships, or emotional impact. Discuss what worked well and what resonated with you personally.

Fourth paragraph: Offer thoughtful critique (if any). What could have been better? Any pacing issues or elements that didn't quite land? Be honest but kind.

Closing paragraph: Wrap up with your overall impression. Who would enjoy this book? What did you take away from it? End with a warm recommendation.

Use a conversational yet literary tone - like a smart friend recommending a book over coffee. Be genuine, specific, and passionate. Include vivid descriptions and personal reflections. Make it feel intimate and honest.

Write 4-5 substantial paragraphs (600-800 words). Use elegant transitions. Don't use a title or rating - just the review text.`;

    // Using a free model from HuggingFace
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.75,
          top_p: 0.92,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 45000, // 45 second timeout for longer response
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text.trim();
    }

    // Fallback: create a detailed review from bullet points
    return createFallbackReview(bulletPoints, bookTitle, author);
  } catch (error: any) {
    console.error('AI generation error:', error);
    
    // If API fails, return a well-formatted version of bullet points
    return createFallbackReview(bulletPoints, bookTitle, author);
  }
}

function createFallbackReview(bulletPoints: string[], bookTitle: string, author: string): string {
  // Create a nicely formatted review even without AI
  const intro = `There's something special about "${bookTitle}" by ${author} that stayed with me long after I turned the final page.`;
  
  const bodyParagraphs = bulletPoints.map((point, idx) => {
    if (idx === 0) {
      return `${point} From the very first chapter, I found myself drawn into the story, eager to see where it would take me.`;
    } else if (idx === bulletPoints.length - 1) {
      return `${point} It's these kinds of thoughtful touches that elevate this book beyond the ordinary.`;
    } else {
      return `${point} This aspect of the book particularly resonated with me and added depth to my reading experience.`;
    }
  }).join('\n\n');
  
  const conclusion = `Overall, I found "${bookTitle}" to be a compelling read that balanced emotional depth with engaging storytelling. ${author}'s writing style drew me in and kept me invested throughout. While no book is perfect, this one certainly left an impression. I'd recommend it to anyone looking for a thoughtful, well-crafted story that lingers in your mind long after you've finished.`;
  
  return `${intro}\n\n${bodyParagraphs}\n\n${conclusion}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    requireAdmin(request);

    const { bulletPoints, bookTitle, author } = await request.json();

    if (!bulletPoints || !Array.isArray(bulletPoints) || bulletPoints.length === 0) {
      return NextResponse.json(
        { error: 'Bullet points are required' },
        { status: 400 }
      );
    }

    if (!bookTitle || !author) {
      return NextResponse.json(
        { error: 'Book title and author are required' },
        { status: 400 }
      );
    }

    const generatedReview = await generateReview(bulletPoints, bookTitle, author);

    return NextResponse.json({
      success: true,
      review: generatedReview,
    });
  } catch (error: any) {
    if (error.message === 'Forbidden - Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.error('Generate review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

