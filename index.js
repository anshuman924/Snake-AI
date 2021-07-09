const express = require('express');
const socket = require('socket.io');
const fs = require('fs');

const app = express();

const server = app.listen(3000, () => {
    console.log("Server up and running");
});

app.use(express.static('public'));

const io = socket(server);
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('data', (data) => {
        const jsonString = JSON.stringify(data);
        const fileName = './data/' + data.fileName + '.json';
        fs.writeFile(fileName, jsonString, {'flag': 'w'}, (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log('it worked');
            }
        });
    });

    // socket.on('fitness_data', (data) => {
    //     const jsonString = JSON.stringify(data);
    //     const fileName = './public/data/' + data.fileName + '.json';
    //     fs.writeFile(fileName, jsonString, {'flag': 'a'}, (err) => {
    //         if(err) {
    //             console.log(err);
    //         } else {
    //             console.log('it worked');
    //         }
    //     });
    // });

    // fs.readFile('./file.json', (err, jsonString) => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }

    //     try {
    //         const data = JSON.parse(jsonString);
    //         console.log(data);
    //         io.emit('data', data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // });
});