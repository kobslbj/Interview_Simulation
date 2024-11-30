import os
import torch
from openvoice import se_extractor
from openvoice.api import BaseSpeakerTTS, ToneColorConverter

device="cuda:0" if torch.cuda.is_available() else "cpu"

reference_speaker = '../data/reference/testing.mp3'
output_dir = '../data/target'
os.makedirs(output_dir, exist_ok=True)
src_path = f'{output_dir}/tmp.wav'       # 暫存 (預設聲音)
save_path = f'{output_dir}/output.wav'   # VC 最後輸出
text = "Why is YuChi so handsome? Damn!!!"

ckpt_base = 'checkpoints/base_speakers/EN'
ckpt_converter = 'checkpoints/converter'
base_speaker_tts = BaseSpeakerTTS(f'{ckpt_base}/config.json', device=device)
base_speaker_tts.load_ckpt(f'{ckpt_base}/checkpoint.pth')
tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')
source_se = torch.load(f'{ckpt_base}/en_style_se.pth').to(device)
target_se, audio_name = se_extractor.get_se(reference_speaker, tone_color_converter, target_dir='color_embedding', vad=True)

base_speaker_tts.tts(text, src_path, speaker='default', language='English', speed=1.0)

encode_message = "@MyShell"
tone_color_converter.convert(
    audio_src_path=src_path, 
    src_se=source_se, 
    tgt_se=target_se, 
    output_path=save_path,
    message=encode_message)