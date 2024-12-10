import os
import torch
from openvoice import se_extractor
from openvoice.api import BaseSpeakerTTS, ToneColorConverter

# 這是從最外層的資料夾執行程式時的相對路徑
CKPT_BASE = "./TTS/checkpoints/base_speakers/EN"
CKPT_CONVERTER = "./TTS/checkpoints/converter"
REFERENCE_SPEAKER = "./data/reference/yuchi.mp3"
COLOR_EMBEDDING = "./TTS/color_embedding"
OUTPUT_DIR = "./data/target"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

text = "This is a string for API testing, if the output audio could speak this sentence, it means it works. Congradulations!"

def generate_tts_audio(text, reference_speaker, output_dir, ckpt_base, ckpt_converter, device="cpu"):
    os.makedirs(output_dir, exist_ok=True)
    src_path = os.path.join(output_dir, 'tmp.wav')       # 暫存 (預設聲音)
    save_path = os.path.join(output_dir, 'output.wav')   # VC 最後輸出

    base_speaker_tts = BaseSpeakerTTS(f'{ckpt_base}/config.json', device=device)
    base_speaker_tts.load_ckpt(f'{ckpt_base}/checkpoint.pth')

    tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
    tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

    # speaker embedding
    source_se = torch.load(f'{ckpt_base}/en_style_se.pth').to(device)
    target_se, _ = se_extractor.get_se(reference_speaker, tone_color_converter, target_dir=COLOR_EMBEDDING, vad=True)

    base_speaker_tts.tts(text, src_path, speaker='default', language='English', speed=1.0)

    # 調整音色
    encode_message = "@MyShell"
    tone_color_converter.convert(
        audio_src_path=src_path, 
        src_se=source_se, 
        tgt_se=target_se, 
        output_path=save_path,
        message=encode_message)

    return save_path

if __name__ == '__main__':
    generate_tts_audio(
        text=text,
        reference_speaker=REFERENCE_SPEAKER,
        output_dir=OUTPUT_DIR,
        ckpt_base=CKPT_BASE,
        ckpt_converter=CKPT_CONVERTER,
        device=DEVICE
    )