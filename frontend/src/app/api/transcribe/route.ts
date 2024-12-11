import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: '沒有收到音頻文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'zh'  // 指定中文
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Whisper API 錯誤:', error);
    return new Response(JSON.stringify({ error: '轉錄失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 