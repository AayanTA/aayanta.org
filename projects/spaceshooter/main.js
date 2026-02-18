import { Game } from "./game.js";

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

let state="menu";
let game=null;

window.addEventListener("keydown",e=>{
    if(state==="menu" && e.code==="Space"){
        game=new Game(canvas,ctx);
        state="playing";
    }

    if(state==="end" && e.code==="Space"){
        state="menu";
    }
});

function loop(){

    requestAnimationFrame(loop);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(state==="menu"){
        ctx.fillStyle="white";
        ctx.font="40px Arial";
        ctx.fillText("SPACE RACERS",260,220);
        ctx.font="20px Arial";
        ctx.fillText("Press SPACE to Start",300,260);
    }

    if(state==="playing"){
        game.update();
        game.draw();

        if(game.winner){
            state="end";
        }
    }

    if(state==="end"){
        ctx.fillStyle="white";
        ctx.font="40px Arial";
        ctx.fillText(`${game.winner.color.toUpperCase()} WINS`,260,220);
        ctx.font="20px Arial";
        ctx.fillText("Press SPACE for Menu",280,260);
    }
}

loop();
