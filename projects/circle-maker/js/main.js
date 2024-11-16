
let body = document.querySelector('body');
let height = window.innerHeight;
let width = window.innerWidth;
// key press Event Listeners
const circleMaker = () => {
    let r = Math.floor(Math.random() * 256); 
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256); 
    let first = Math.random() * height;
    let second = Math.random() * width;
    let newBall = document.createElement(`div`);
    body.appendChild(newBall);
    newBall.className = `ball`
    newBall.style.cssText = `top: ${first}px; left: ${second}px; background-color: rgb(${r}, ${g}, ${b});`


}

window.addEventListener('keydown', circleMaker);

