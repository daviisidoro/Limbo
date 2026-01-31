/* --- SISTEMA DE CHUVA --- */
const canvas = document.getElementById('storm-canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const drops = [];
for(let i=0; i<300; i++) {
    drops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        l: Math.random() * 25 + 10,
        s: Math.random() * 20 + 15
    });
}

function drawRain() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(180, 180, 180, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.l);
        ctx.stroke();
        d.y += d.s;
        if(d.y > canvas.height) { d.y = -30; d.x = Math.random() * canvas.width; }
    });
    
    requestAnimationFrame(drawRain);
}
drawRain();

/* --- VIEW MANAGER --- */
const View = {
    open: (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById('view-' + id).classList.add('active');
        
        // Mapeamento Desktop
        const btns = document.querySelectorAll('.menu-btn');
        const map = {'monitor':0, 'logs':1, 'about':2, 'bestiary':3, 'chat':4, 'terminal':5, 'map':6, 'decrypt':7};
        if(map[id] !== undefined) btns[map[id]].classList.add('active');

        // Mapeamento Mobile
        document.querySelectorAll('.mob-btn').forEach(b => b.classList.remove('active'));
        const mobBtns = document.querySelectorAll('.mob-btn');
        if(map[id] !== undefined) mobBtns[map[id]].classList.add('active');

        if(id === 'monitor') Heart.start();
        if(id === 'decrypt') Decrypt.start();
    }
};

/* --- HEARTBEAT --- */
const Heart = {
    start: () => {
        const c = document.getElementById('heart-canvas');
        if(!c) return;
        const x = c.getContext('2d');
        let pos = 0;
        function loop() {
            // Resize dinâmico para mobile
            if(c.clientWidth !== c.width) { c.width = c.clientWidth; c.height = c.clientHeight; }
            x.fillStyle = "#050000"; x.fillRect(0,0,c.width,c.height);
            x.strokeStyle = "#ff0000"; x.lineWidth = 2; x.beginPath();
            const y = c.height/2;
            for(let i=0; i<c.width; i+=2) {
                let offset = 0;
                let beat = (i + pos) % 150;
                if(beat > 100 && beat < 110) offset = (Math.random()-0.5)*c.height*0.8;
                else offset = (Math.random()-0.5)*4;
                x.lineTo(i, y + offset);
            }
            x.stroke(); pos -= 4;
            requestAnimationFrame(loop);
        }
        loop();
    }
};
Heart.start();

/* --- CHAT --- */
const chatFeed = document.getElementById('chat-feed');
const chatIn = document.getElementById('chat-in');
const Chat = {
    send: () => {
        const txt = chatIn.value;
        if(!txt) return;
        chatFeed.innerHTML += `<div class="msg me">VOCÊ: ${txt}</div>`;
        chatIn.value = '';
        setTimeout(() => {
            const replies = ["A chuva queima.", "Eles sabem seu nome.", "Não há saída.", "Abra a porta."];
            const r = replies[Math.floor(Math.random()*replies.length)];
            chatFeed.innerHTML += `<div class="msg other">LIMBO: ${r}</div>`;
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }, 1000);
    }
};
document.getElementById('chat-in').addEventListener('keypress', e => { if(e.key === 'Enter') Chat.send(); });

/* --- DECRYPT --- */
const Decrypt = {
    start: () => {
        const el = document.getElementById('scramble-text');
        const bar = document.getElementById('decode-fill');
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let prog = 0;
        setInterval(() => {
            if(document.getElementById('view-decrypt').classList.contains('active')) {
                let txt = "";
                for(let i=0; i<20; i++) txt += chars[Math.floor(Math.random()*chars.length)];
                el.innerText = txt + "... DECODING";
                prog += 0.5;
                if(prog > 100) prog = 0;
                bar.style.width = prog + "%";
            }
        }, 100);
    }
};

/* --- TERMINAL --- */
const termOut = document.getElementById('term-out');
const cmdIn = document.getElementById('cmd-in');
cmdIn.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
        const val = cmdIn.value;
        termOut.innerHTML += `<div>> ${val}</div>`;
        cmdIn.value = '';
        setTimeout(() => {
            termOut.innerHTML += `<div style="color:red">ERRO FATAL: NÚCLEO CORROMPIDO.</div>`;
            termOut.scrollTop = termOut.scrollHeight;
        }, 200);
        termOut.scrollTop = termOut.scrollHeight;
    }
});
