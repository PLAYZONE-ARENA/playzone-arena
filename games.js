// Jeux originaux PlayZone Arena. Commandes clavier et tactiles.
const Games = {
 snake(root){
  const canvas=document.createElement('canvas');canvas.width=400;canvas.height=300;canvas.className='snake-canvas';canvas.setAttribute('aria-label','Terrain Neon Snake');root.append(canvas);
  const ctx=canvas.getContext('2d');let snake,dir,next,food,score,over,timer;
  const scoreEl=document.createElement('div');scoreEl.className='scoreline';root.prepend(scoreEl);
  const controls=document.createElement('div');controls.className='dpad';controls.innerHTML='<button data-dir="up">▲</button><div><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div>';root.append(controls);
  const restart=document.createElement('button');restart.textContent='Rejouer';root.append(restart);
  function placeFood(){do{food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*15)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))}
  function draw(){ctx.fillStyle='#0b1720';ctx.fillRect(0,0,400,300);ctx.strokeStyle='#19303a';for(let x=0;x<=400;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,300);ctx.stroke()}for(let y=0;y<=300;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(400,y);ctx.stroke()}ctx.fillStyle='#ff5c9a';ctx.beginPath();ctx.arc(food.x*20+10,food.y*20+10,7,0,Math.PI*2);ctx.fill();snake.forEach((p,i)=>{ctx.fillStyle=i?'#4de4d2':'#c8ff4d';ctx.fillRect(p.x*20+2,p.y*20+2,16,16)});scoreEl.textContent='SCORE : '+score+(over?' — FIN DE PARTIE':'')}
  function setDir(d){if(d==='up'&&dir.y!==1)next={x:0,y:-1};if(d==='down'&&dir.y!==-1)next={x:0,y:1};if(d==='left'&&dir.x!==1)next={x:-1,y:0};if(d==='right'&&dir.x!==-1)next={x:1,y:0}}
  function key(e){const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};if(m[e.key]){e.preventDefault();setDir(m[e.key])}}
  function tick(){if(over)return;dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=20||h.y<0||h.y>=15||snake.some(p=>p.x===h.x&&p.y===h.y)){over=true;draw();return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score+=10;placeFood()}else snake.pop();draw()}
  function init(){snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}];dir={x:1,y:0};next={x:1,y:0};score=0;over=false;placeFood();draw();clearInterval(timer);timer=setInterval(tick,130)}
  window.addEventListener('keydown',key);controls.addEventListener('click',e=>{const b=e.target.closest('[data-dir]');if(b)setDir(b.dataset.dir)});restart.onclick=init;init();
  return()=>{clearInterval(timer);window.removeEventListener('keydown',key)}
 },
 merge(root){
  let board=Array(16).fill(0),score=0,ended=false;
  const scoreEl=document.createElement('div');scoreEl.className='scoreline';root.append(scoreEl);
  const grid=document.createElement('div');grid.className='merge-board';grid.setAttribute('aria-label','Plateau 2048');grid.tabIndex=0;root.append(grid);
  const help=document.createElement('small');help.className='merge-help';help.textContent='Glisse ton doigt ou utilise les flèches du clavier.';root.append(help);
  const restart=document.createElement('button');restart.textContent='Nouvelle partie';restart.style.marginTop='14px';root.append(restart);
  function spawn(){const empty=board.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(empty.length)board[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?2:4}
  function render(){scoreEl.textContent='SCORE : '+score;grid.innerHTML='';board.forEach(v=>{const c=document.createElement('div');c.className='merge-cell';c.textContent=v||'';if(v)c.style.background=({2:'#655b91',4:'#98704e',8:'#b65e4d',16:'#c48b42',32:'#b64d76',64:'#b83c55',128:'#8d9b43',256:'#688d50',512:'#478c83',1024:'#4776a4',2048:'#c8ff4d'})[v]||'#3b4c62';if(v===2048)c.style.color='#10150b';grid.append(c)})}
  function move(key){if(ended)return;const old=board.join(',');for(let line=0;line<4;line++){let ids=[];for(let j=0;j<4;j++)ids.push(key==='ArrowLeft'?line*4+j:key==='ArrowRight'?line*4+3-j:key==='ArrowUp'?j*4+line:(3-j)*4+line);const vals=ids.map(i=>board[i]).filter(Boolean),out=[];for(let j=0;j<vals.length;j++){if(vals[j]===vals[j+1]){out.push(vals[j]*2);score+=vals[j]*2;j++}else out.push(vals[j])}while(out.length<4)out.push(0);ids.forEach((id,j)=>board[id]=out[j])}if(old!==board.join(',')){spawn();render()}}
  function key(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key)}}
  let start=null;function touchStart(e){const t=e.changedTouches[0];start={x:t.clientX,y:t.clientY}}function touchEnd(e){if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.max(Math.abs(dx),Math.abs(dy))>25)move(Math.abs(dx)>Math.abs(dy)?(dx>0?'ArrowRight':'ArrowLeft'):(dy>0?'ArrowDown':'ArrowUp'));start=null}
  window.addEventListener('keydown',key);grid.addEventListener('touchstart',touchStart,{passive:true});grid.addEventListener('touchend',touchEnd,{passive:true});
  restart.onclick=()=>{board=Array(16).fill(0);score=0;ended=false;spawn();spawn();render()};spawn();spawn();render();
  return()=>{window.removeEventListener('keydown',key);grid.removeEventListener('touchstart',touchStart);grid.removeEventListener('touchend',touchEnd)}
 },
 reflex(root){
  let best=localStorage.getItem('pza-reflex-best')||'—',state='idle',start=0,timer=null;
  const score=document.createElement('div');score.className='scoreline';score.textContent='MEILLEUR TEMPS : '+best+(best==='—'?'':' ms');root.append(score);
  const pad=document.createElement('button');pad.className='reflex-pad';pad.textContent='TOUCHE POUR COMMENCER';root.append(pad);
  function reset(){state='wait';pad.className='reflex-pad wait';pad.textContent='ATTENDS LE VERT…';timer=setTimeout(()=>{state='ready';start=performance.now();pad.className='reflex-pad ready';pad.textContent='MAINTENANT ! TOUCHE !'},1200+Math.random()*2500)}
  pad.onclick=()=>{if(state==='idle'){reset()}else if(state==='wait'){clearTimeout(timer);state='idle';pad.className='reflex-pad';pad.textContent='TROP TÔT ! TOUCHE POUR RECOMMENCER'}else if(state==='ready'){const ms=Math.round(performance.now()-start);if(best==='—'||ms<Number(best)){best=String(ms);localStorage.setItem('pza-reflex-best',best)}score.textContent='TEMPS : '+ms+' ms · RECORD : '+best+' ms';state='idle';pad.className='reflex-pad';pad.textContent=ms+' ms — RECOMMENCER'}}
  return()=>clearTimeout(timer)
 },
 dash(root){
  const canvas=document.createElement('canvas');canvas.width=520;canvas.height=260;canvas.className='dash-canvas';canvas.setAttribute('aria-label','Terrain Neon Dash');root.append(canvas);
  const ctx=canvas.getContext('2d');const scoreEl=document.createElement('div');scoreEl.className='scoreline';root.prepend(scoreEl);
  const jump=document.createElement('button');jump.className='dash-jump';jump.textContent='TOUCHE POUR SAUTER';root.append(jump);
  const restart=document.createElement('button');restart.textContent='Recommencer';root.append(restart);
  let player,obstacles,coins,score,speed,frame,alive,raf;
  function reset(){player={y:190,vy:0,onGround:true};obstacles=[];coins=[];score=0;speed=4;frame=0;alive=true;cancelAnimationFrame(raf);loop()}
  function hop(){if(alive&&player.onGround){player.vy=-12;player.onGround=false}}
  function key(e){if(e.code==='Space'||e.key==='ArrowUp'){e.preventDefault();hop()}}
  function loop(){ctx.fillStyle='#09111d';ctx.fillRect(0,0,520,260);ctx.fillStyle='#162b3b';ctx.fillRect(0,218,520,42);ctx.strokeStyle='#c8ff4d55';ctx.beginPath();ctx.moveTo(0,218);ctx.lineTo(520,218);ctx.stroke();
   if(alive){frame++;score+=1;speed=Math.min(9,4+score/450);if(frame%75===0)obstacles.push({x:530,w:22+Math.random()*16,h:28+Math.random()*28});if(frame%105===0)coins.push({x:530,y:135+Math.random()*45});player.vy+=.55;player.y+=player.vy;if(player.y>=190){player.y=190;player.vy=0;player.onGround=true}
    obstacles.forEach(o=>o.x-=speed);coins.forEach(c=>c.x-=speed);obstacles=obstacles.filter(o=>o.x+o.w>0);coins=coins.filter(c=>c.x>0);
    for(const o of obstacles){if(42<o.x+o.w&&42+25>o.x&&player.y+28>218-o.h){alive=false}}
    for(let i=coins.length-1;i>=0;i--){const c=coins[i];if(Math.abs(c.x-54)<22&&Math.abs(c.y-(player.y+12))<28){score+=50;coins.splice(i,1)}}
   }
   ctx.fillStyle='#c8ff4d';ctx.fillRect(42,player.y,25,28);ctx.fillStyle='#4de4d2';for(const o of obstacles)ctx.fillRect(o.x,218-o.h,o.w,o.h);
   ctx.fillStyle='#ffd45e';for(const c of coins){ctx.beginPath();ctx.arc(c.x,c.y,8,0,Math.PI*2);ctx.fill()}
   ctx.fillStyle='#f4f7fb';ctx.font='bold 16px sans-serif';ctx.fillText('SCORE '+score,16,25);scoreEl.textContent='SCORE : '+score+(alive?'':' — PARTIE TERMINÉE');if(alive)raf=requestAnimationFrame(loop);else{ctx.font='bold 26px sans-serif';ctx.fillText('FIN DE PARTIE',170,115);ctx.font='14px sans-serif';ctx.fillText('Appuie sur Recommencer',177,143)}
  }
  jump.addEventListener('pointerdown',hop);window.addEventListener('keydown',key);restart.onclick=reset;reset();
  return()=>{cancelAnimationFrame(raf);jump.removeEventListener('pointerdown',hop);window.removeEventListener('keydown',key)}
 }
};