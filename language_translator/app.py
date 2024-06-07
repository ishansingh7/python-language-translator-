from flask import Flask, request, jsonify, render_template
from googletrans import Translator
import pyttsx3
import speech_recognition as sr

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    input_text = data.get('text', '')
    source_language = data.get('source_language', 'en')
    target_languages = data.get('target_languages', [])
    
    translator = Translator()
    translated_texts = {}
    
    for lang in target_languages:
        translated_text = translator.translate(input_text, src=source_language, dest=lang).text
        translated_texts[lang] = translated_text

    return jsonify(translated_texts)

@app.route('/voice_input', methods=['GET'])
def voice_input():
    try:
        recognizer = sr.Recognizer()
        microphone = sr.Microphone()

        with microphone as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        input_text = recognizer.recognize_google(audio)
        return jsonify({'text': input_text})
    except sr.RequestError as e:
        return jsonify({'error': 'API unavailable'}), 503
    except sr.UnknownValueError as e:
        return jsonify({'error': 'Unable to recognize speech'}), 400

if __name__ == '__main__':
    app.run(debug=True)
