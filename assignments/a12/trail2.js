const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const output = document.querySelector('.output');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function submit() {
    alert(output.textContent);
}

function reset() {
    outputInt = "";
    output.textContent = outputInt;
}

const submitButton = document.querySelector('.submit-button').addEventListener('click', submit);
const resetButton = document.querySelector('.reset-button').addEventListener('click', reset);

document.onclick = (event) => {
    const {
      clientX,
      clientY
    } = event
    console.log(clientX, clientY)
    number = (clientX + clientY) % 10
    let text = number
    output.append(text)
}