/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { text } = data;

    if (!text) {
      return NextResponse.json({ error: '需要文字輸入' }, { status: 400 });
    }

    const response = await fetch('http://localhost:5000/generate_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '視頻生成失敗');
    }

    const videoBlob = await response.blob();
    
    return new NextResponse(videoBlob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="result.mp4"',
      },
    });

  } catch (error) {
    console.error('視頻生成錯誤:', error);
    return NextResponse.json(
      { error: '視頻生成過程中發生錯誤' },
      { status: 500 }
    );
  }
} 