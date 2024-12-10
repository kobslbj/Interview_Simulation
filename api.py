import sys

paths = ['TTS', 'AV_Sync']
for path in paths:
    sys.path.append(path)

from flask import Flask, request, jsonify, send_file
import os
import torch
from TTS.inference import generate_tts_audio
from AV_Sync.inference import main as av_sync_main

REFERENCE_SPEAKER = "./data/reference/elon_testing.mp3"
COLOR_EMBEDDING = "./TTS/color_embedding"
CKPT_BASE = "./TTS/checkpoints/base_speakers/EN"
CKPT_CONVERTER = "./TTS/checkpoints/converter"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

TTS_OUTPUT_DIR = "./data/target"
AV_SYNC_TEMP_DIR = "./AV_Sync/temp"
FINAL_OUTPUT_PATH = "./data/target/result.mp4"

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Flask API! Use /generate_video to generate a video."

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/generate_video', methods=['GET', 'POST'])
def generate_video():
    if request.method == 'GET':
        return jsonify({"message": "Use POST method with JSON payload to generate a video"}), 200
    try:
        data = request.json
        if 'text' not in data:
            return jsonify({"error": "Text input is required"}), 400
        
        text = data['text']
        
        reference_speaker = REFERENCE_SPEAKER
        tts_audio_path = os.path.join(TTS_OUTPUT_DIR, 'output.wav')
        
        print("Generating TTS audio...")
        generate_tts_audio(
            text=text,
            reference_speaker=reference_speaker,
            output_dir=TTS_OUTPUT_DIR,
            ckpt_base=CKPT_BASE,
            ckpt_converter=CKPT_CONVERTER,
            device=DEVICE,
        )
        print(f"TTS audio saved to: {tts_audio_path}")
        
        print("Synchronizing audio with video...")
        av_sync_main()
        print(f"AV Sync result saved to: {FINAL_OUTPUT_PATH}")
        
        # Return the MP4 file to the front end
        return send_file(FINAL_OUTPUT_PATH, as_attachment=True, mimetype='video/mp4')

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    os.makedirs(TTS_OUTPUT_DIR, exist_ok=True)
    os.makedirs(AV_SYNC_TEMP_DIR, exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
