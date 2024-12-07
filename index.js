const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const settingsButton = document.querySelector('.settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
const closeSettingsButton = document.getElementById('close-settings');
const instructionField = document.querySelector('.instructionField');
const setInstructionButton = document.getElementById('set-instruction');
const deleteInstructionsButton = document.getElementById('deleteInstructions');
const defaultInstruction = "You are a helpful assistant, you will write things in an easy to understand way that can be complex if needed to.";
const savedInstruction = localStorage.getItem('instruction') || defaultInstruction;
instructionField.value = savedInstruction;
const messages = [{ role: "system", content: savedInstruction }];

settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = 'block';
});

closeSettingsButton.addEventListener('click', () => {
    settingsMenu.style.display = 'none';
});

setInstructionButton.addEventListener('click', () => {
    const newInstruction = instructionField.value.trim();
    if (newInstruction) {
        messages[0].content = newInstruction;
        localStorage.setItem('instruction', newInstruction);
        instructionField.value = '';
        alert('Instruction set updated!');
    }
});

deleteInstructionsButton.addEventListener('click', () => {
    messages[0].content = defaultInstruction;
    localStorage.setItem('instruction', defaultInstruction);
    instructionField.value = defaultInstruction;
    alert('Instructions reset to default!');
});

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    userInput.value = '';

    messages.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch('http://localhost:11434/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-key'
            },
            body: JSON.stringify({
                model: 'llama3.2',
                messages: messages
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        addMessage(botMessage, 'bot');

        messages.push({ role: 'assistant', content: botMessage });
    } catch (error) {
        addMessage('Error: Unable to fetch response from AI.', 'bot');
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = marked.parse(content);
    messageDiv.className = `message ${sender}`;
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});