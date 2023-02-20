// app.js
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {cors: {origin: "*"}});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', async (msg) => {
        console.log('message: ' + msg);

        // Use ChatGPT to generate a response to the message

        const OpenAI = require('openai-api');


        const openai = new OpenAI('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');
        const prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
    
    Human: ${msg}
    AI:`;
        try {
            const completion = await openai.complete({
                engine: 'text-davinci-003',
                prompt: "",
                maxTokens: 1,
                temperature: 0.9,
                topP: 1,
                presencePenalty: 0,
                frequencyPenalty: 0,
                bestOf: 1,
                n: 1,
                stream: false,
                stop: ['\n', "testing"]
            });


            const response =completion.data.choices[0].text.trim();

            // Send the generated response to the client
            io.emit('chat message', response);
        } catch (e) {
            io.emit('chat message', e.message);

        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
