document.addEventListener('DOMContentLoaded', function() {
    const translateButton = document.getElementById('translate-button');
    const voiceButton = document.getElementById('voice-button');
    const readButton = document.getElementById('read-button');
    const voiceIndicator = document.getElementById('voice-input-indicator'); // Loading indicator element

    // Function to start voice input
    function startVoiceInput() {
        voiceIndicator.style.display = 'inline-block'; // Display loading indicator
        voiceButton.disabled = true;

        fetch('/voice_input')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            const inputTextElement = document.getElementById('input-text');
            inputTextElement.value = data.text;
            translateText(); // Call the translation function after receiving voice input
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            voiceIndicator.style.display = 'none'; // Hide loading indicator after voice input
            voiceButton.disabled = false;
        });
    }

    // Function to translate text
    function translateText() {
        const inputText = document.getElementById('input-text').value;
        const sourceLanguage = document.getElementById('source-language').value;
        const targetLanguages = Array.from(document.getElementById('target-languages').selectedOptions).map(option => option.value);
        
        if (!inputText) {
            alert("Please enter text to translate.");
            return;
        }
        
        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputText,
                source_language: sourceLanguage,
                target_languages: targetLanguages
            })
        })
        .then(response => response.json())
        .then(data => {
            const outputElement = document.getElementById('output');
            outputElement.textContent = '';
            for (const [lang, text] of Object.entries(data)) {
                outputElement.textContent += `${lang}: ${text}\n`;
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to read output
    function readOutput() {
        const outputElement = document.getElementById('output').textContent;
        const utterance = new SpeechSynthesisUtterance(outputElement);
        window.speechSynthesis.speak(utterance);
    }

    // Event listeners
    translateButton.addEventListener('click', translateText);
    voiceButton.addEventListener('click', startVoiceInput);
    readButton.addEventListener('click', readOutput);
});
