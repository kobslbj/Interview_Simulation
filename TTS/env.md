# CosyVoice

conda create -n cosyvoice python=3.8
conda activate cosyvoice
conda install -y -c conda-forge pynini==2.1.5 git
git clone --recursive https://github.com/FunAudioLLM/CosyVoice.git
cd Cosyvoice
conda install torchaudio
git submodule update --init --recursive
conda install -y -c conda-forge pynini==2.1.5
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host=mirrors.aliyun.com
pip install onnxruntime transformers
pip uninstall modelscope
pip install modelscope
(用 modelscope 下載模型)
$env:PYTHONPATH = "third_party\Matcha-TTS;" + $env:PYTHONPATH
python tts.py

# OpenAI Whisper - ffmpeg

pip install ffmpeg
\$env:Path += ";C:\Users\danny\ffmpeg\ffmpeg-7.1-essentials_build\bin\"

# Voice Cloning

pip install numpy torch torchaudio nltk whisper librosa pydub tqdm
pip install openai-whisper
sudo apt update && sudo apt install ffmpeg
brew install ffmpeg
