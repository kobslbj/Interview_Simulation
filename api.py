from flask import Flask, request, jsonify, send_file
import os
import torch
import sys
sys.path.append('./TTS')
from TTS.inference import generate_tts_audio

# 初始化 Flask
app = Flask(__name__)

# 設定模型檔案的路徑
CKPT_BASE = "./TTS/checkpoints/base_speakers/EN"
CKPT_CONVERTER = "./TTS/checkpoints/converter"
OUTPUT_DIR = "./data/target"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    try:
        # 接收前端發送的 JSON 資料
        data = request.json
        text = data.get("text")
        reference_speaker = data.get("reference_speaker")

        if not text or not reference_speaker:
            return jsonify({"error": "Missing 'text' or 'reference_speaker' in request"}), 400

        # 呼叫 inference 函數來生成音訊
        output_path = generate_tts_audio(
            text=text,
            reference_speaker=reference_speaker,
            output_dir=OUTPUT_DIR,
            ckpt_base=CKPT_BASE,
            ckpt_converter=CKPT_CONVERTER,
            device=DEVICE
        )

        # 返回生成的音訊檔案
        return send_file(output_path, as_attachment=True, attachment_filename="output.wav")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("123123")
    app.run(host='0.0.0.0', port=5000, debug=True)
