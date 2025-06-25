from gtts import gTTS
import subprocess

# 10-minute text
text = ("Hello, this is a generated speech for testing the transcription accuracy of Vosk. "
        "This sentence is repeated multiple times for longer duration. ") * 60

# Save as MP3
tts = gTTS(text=text, lang='en')
tts.save("sample.mp3")

# Convert to WAV using exact ffmpeg path
ffmpeg_path = r"C:/ffmpeg\bin/ffmpeg.exe"
subprocess.run([ffmpeg_path, "-y", "-i", "sample.mp3", "-ar", "16000", "-ac", "1", "sample.wav"])

print("✅ Audio generated and saved as sample.wav")
