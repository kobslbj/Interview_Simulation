export default async function sendToBackend(text: any) {
  try {
    const response = await fetch('http://localhost:5000/generate_video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      console.error('Failed to send data to backend API:', await response.text());
      throw new Error('Failed to generate video');
    }

    const videoBlob = await response.blob();
    return videoBlob;
  } catch (error) {
    console.error('Error sending data to backend API:', error);
    throw error;
  }
} 