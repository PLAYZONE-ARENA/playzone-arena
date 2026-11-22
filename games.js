// Mini-jeux originaux PlayZone Arena — aucune bibliothèque externe nécessaire.
const Games = {
 snake(root){
  let canvas=document.createElement('canvas');canvas.width=400;canvas.height=300;canvas.className='snake-canvas';root.append(canvas);
  let ctx=canvas.getContext('2d'), cell=20, snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}], dir={x:1,y:0}, next={x:1,y:0}, food={x:14,y:7}, score=0, over=false;
  let scoreEl=document.createElement('div');scoreEl.className='scoreline';root.prepend(scoreEl);
  let restart=document.createElement('button');restart.textContent='Restart / Rejouer';root.append(restart);
  function placeFood(){food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*15)}}
  function draw(){ctx.fillStyle='#0b1720';ctx.fillRect(0,0,400,300);ctx.strokeStyle='#152b35';for(let x=0;x<400;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,300);ctx.stroke()}for(let y=0;y<300;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(400,y);ctx.stroke()}ctx.fillStyle='#ff5c9a';ctx.fillRect(food.x*20+4,food.y*20+4,12,12);snake.forEach((p,i)=>{ctx.fillStyle=i?'#4de4d2':'#c8ff4d';ctx.fillRect(p.x*20+2,p.y*20+2,16,16)});scoreEl.textContent='SCORE / SCORE : '+score+(over?' — GAME OVER':'')}
  function tick(){if(over)return;dir=next;let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=20||h.y<0||h.y>=15||snake.some(p=>p.x===h.x&&p.y===h.y)){over=true;draw();return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score+=10;placeFood()}else snake.pop();draw()}
  function key(e){let k=e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault();if(k==='ArrowUp'&&dir.y!==1)next={x:0,y:-1};if(k==='ArrowDown'&&dir.y!==-1)next={x:0,y:1};if(k==='ArrowLeft'&&dir.x!==1)next={x:-1,y:0};if(k==='ArrowRight'&&dir.x!==-1)next={x:1,y:0}}
  window.addEventListener('keydown',key);let timer=setInterval(tick,130);
  restart.onclick=()=>{snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}];dir=next={x:1,y:0};score=0;over=false;placeFood();draw();if(timer)clearInterval(timer);timer=setInterval(tick,130)};
  draw();return()=>{clearInterval(timer);window.removeEventListener('keydown',key)}
 },
 merge(root){
  let board=Array(16).fill(0),score=0,ended=false;
  let scoreEl=document.createElement('div');scoreEl.className='scoreline';root.append(scoreEl);
  let grid=document.createElement('div');grid.className='merge-board';root.append(grid);
  let restart=document.createElement('button');restart.textContent='New game / Nouvelle partie';restart.style.marginTop='14px';root.append(restart);
  function spawn(){let empty=board.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(empty.length)board[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?2:4}
  function render(){scoreEl.textContent='SCORE : '+score;grid.innerHTML='';board.forEach(v=>{let c=document.createElement('div');c.className='merge-cell';c.textContent=v||'';if(v)c.style.background=({2:'#655b91',4:'#98704e',8:'#b65e4d',16:'#c48b42',32:'#b64d76',64:'#b83c55',128:'#8d9b43',256:'#688d50',512:'#478c83',1024:'#4776a4',2048:'#c8ff4d'})[v]||'#3b4c62';if(v===2048)c.style.color='#10150b';grid.append(c)})}
  function move(key){if(ended)return;let old=board.join(',');for(let line=0;line<4;line++){let ids=[];for(let j=0;j<4;j++)ids.push(key==='ArrowLeft'?line*4+j:key==='ArrowRight'?line*4+3-j:key==='ArrowUp'?j*4+line:(3-j)*4+line);let vals=ids.map(i=>board[i]).filter(Boolean),out=[];for(let j=0;j<vals.length;j++){if(vals[j]===vals[j+1]){out.push(vals[j]*2);score+=vals[j]*2;j++}else out.push(vals[j])}while(out.length<4)out.push(0);ids.forEach((id,j)=>board[id]=out[j])}if(old!==board.join(',')){spawn();render()}}
  function key(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key)}}window.addEventListener('keydown',key);restart.onclick=()=>{board=Array(16).fill(0);score=0;ended=false;spawn();spawn();render()};spawn();spawn();render();return()=>window.removeEventListener('keydown',key)
 },
 reflex(root){
  let best=localStorage.getItem('pza-best')||'—',state='idle',start=0,timer=null;
  let score=document.createElement('div');score.className='scoreline';score.textContent='BEST / RECORD : '+best+' ms';root.append(score);
  let pad=document.createElement('button');pad.className='reflex-pad';pad.textContent='TAP TO START / TOUCHE POUR COMMENCER';root.append(pad);
  function reset(){state='wait';pad.className='reflex-pad wait';pad.textContent='WAIT FOR GREEN… / ATTENDS LE VERT…';timer=setTimeout(()=>{state='ready';start=performance.now();pad.className='reflex-pad ready';pad.textContent='TAP NOW! / MAINTENANT !'},1200+Math.random()*2500)}
  pad.onclick=()=>{if(state==='idle'){reset()}else if(state==='wait'){clearTimeout(timer);state='idle';pad.className='reflex-pad';pad.textContent='TOO SOON! / TROP TÔT — TAP TO TRY AGAIN';}else if(state==='ready'){let ms=Math.round(performance.now()-start);if(best==='—'||ms<Number(best)){best=String(ms);localStorage.setItem('pza-best',best)}score.textContent='REACTION : '+ms+' ms · BEST : '+best+' ms';state='idle';pad.className='reflex-pad';pad.textContent=''+ms+' ms — TAP TO RETRY / RECOMMENCER'}}
  return()=>clearTimeout(timer)
 }
};