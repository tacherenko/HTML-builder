const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const input = readline.createInterface(stdin);
const output = fs.createWriteStream(filePath);

stdout.write('Hello! Enter your text here:\n');

const closeProcess = () => {
  stdout.write('\nBye! Have a nice day!\n');
  exit();
};

input.on('line', (message) => {
  if (message === 'exit') closeProcess();
  output.write(`${message}\n`);
});

process.on('SIGINT', closeProcess);