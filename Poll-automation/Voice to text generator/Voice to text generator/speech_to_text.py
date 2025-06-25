from vosk import Model, KaldiRecognizer
import wave
import json

# Load the model
model_path = "vosk-model-small-en-us-0.15"
model = Model(model_path)

# Open your WAV file
wf = wave.open("sample.wav", "rb")

# Recognizer must match sample rate of WAV file (16000 Hz)
rec = KaldiRecognizer(model, wf.getframerate())

results = []
print("🎧 Transcribing sample.wav...\n")

while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        result = json.loads(rec.Result())
        results.append(result.get("text", ""))

# Final result
final_result = json.loads(rec.FinalResult())
results.append(final_result.get("text", ""))

# Combine all text
full_transcript = " ".join(results)
print("\n📝 Final Transcription:\n")
print(full_transcript)
