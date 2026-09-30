const $=id=>document.getElementById(id),E=ChompEngine;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const label=(x,y)=>String.fromCharCode(65+x)+(y+1);
const pick=list=>list[Math.floor(Math.random()*list.length)];

let board,rows,cols,turn,over=false,timer=null,epoch=0,sound=true,hinted=null,cells=[],focusCell=null;
const score={you:0,truffle:0};

/* ------------------------------------------------------------------ solver */
let solverWorker,requestId=0,hintRequest=0;
const pending=new Map();
function cancelAnalysis(){solverWorker?.terminate();solverWorker=null;for(const request of pending.values())request.reject(new Error('cancelled'));pending.clear();}
function solveHere(shape){return new Promise(resolve=>setTimeout(()=>resolve(E.analyze(shape)),0));}
function analyzeAsync(shape){
 if(workerBroken)return solveHere([...shape]);
 if(!solverWorker){
  try{
   const url=URL.createObjectURL(new Blob([`const E=(${E.createEngine.toString()})();onmessage=({data})=>{try{postMessage({id:data.id,moves:E.analyze(data.board)})}catch(error){postMessage({id:data.id,error:error.message})}}`],{type:'text/javascript'}));
   try{solverWorker=new Worker(url);}finally{URL.revokeObjectURL(url);}
   solverWorker.onmessage=({data})=>{const request=pending.get(data.id);if(!request)return;pending.delete(data.id);if(data.error)request.reject(new Error(data.error));else request.resolve(data.moves);};
   // If the background worker breaks, keep the game going by solving on the main thread instead.
   solverWorker.onerror=()=>{const stuck=[...pending.values()];pending.clear();solverWorker?.terminate();solverWorker=null;workerBroken=true;for(const r of stuck)solveHere(r.shape).then(r.resolve,r.reject);};
  }catch{solverWorker=null;workerBroken=true;}
 }
 if(!solverWorker)return solveHere([...shape]);
 return new Promise((resolve,reject)=>{const id=++requestId;pending.set(id,{resolve,reject,shape:[...shape]});solverWorker.postMessage({id,board:[...shape]});});
}
let workerBroken=false;

/* ------------------------------------------------------------------- sound */
let ctx,master,noiseBuf;
function audio(){
 if(!sound)return null;
 try{
  if(!ctx){
   ctx=new (window.AudioContext||window.webkitAudioContext)();
   master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);
   noiseBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
   const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  }
  if(ctx.state==='suspended')ctx.resume();
  return ctx;
 }catch{return null;}
}
function blip(freq,{at=0,dur=.18,type='sine',vol=.12,to=null}={}){
 const c=audio();if(!c)return;const t=c.currentTime+at,o=c.createOscillator(),g=c.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);
}
function crunchSound(size){
 const c=audio();if(!c)return;const n=Math.min(9,3+Math.floor(size/3));
 for(let i=0;i<n;i++){
  const t=c.currentTime+i*.05+Math.random()*.025,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
  s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=900+Math.random()*2800;f.Q.value=1.2;
  g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);
  s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*.8,.09);
 }
 blip(150,{dur:.2,to:48,vol:.35});
}
const sfx={
 tick(){blip(1400+Math.random()*200,{dur:.04,vol:.025,type:'triangle'});},
 hint(){blip(880,{dur:.25,vol:.08});blip(1318,{at:.09,dur:.35,vol:.07});},
 start(){[392,494,587].forEach((f,i)=>blip(f,{at:i*.07,dur:.2,vol:.06,type:'triangle'}));},
 win(){[523,659,784,1047,1319].forEach((f,i)=>blip(f,{at:i*.11,dur:.5,vol:.11,type:'triangle'}));},
 lose(){[330,311,262,196].forEach((f,i)=>blip(f,{at:i*.2,dur:.5,vol:.12,type:'sawtooth',to:f*.9}));},
 poison(){blip(300,{dur:.9,to:60,vol:.15,type:'sawtooth'});for(let i=0;i<6;i++)blip(200+Math.random()*500,{at:.05*i+.1,dur:.12,to:900,vol:.05});}
};

/* ---------------------------------------------------------------- particles */
const fx=$('fx'),g2=fx.getContext('2d');
let W=0,H=0,parts=[],motes=[],fxRunning=false,last=0;
function sizeFx(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;fx.width=W*d;fx.height=H*d;g2.setTransform(d,0,0,d,0,0);}
sizeFx();addEventListener('resize',sizeFx);
const CHOC=['#8a5233','#6a3820','#a4693e','#4e2616','#c08050'];
function burst(kind,x,y,n,opts={}){
 if(REDUCED)return;
 for(let i=0;i<n;i++){
  const a=Math.random()*Math.PI*2,sp=(opts.speed||260)*(.3+Math.random());
  const p={kind,x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(opts.up||160),life:0,max:(opts.life||1)*(.7+Math.random()*.6),rot:Math.random()*6,vr:(Math.random()-.5)*14,s:(opts.size||6)*(.5+Math.random()),col:pick(opts.colors||CHOC),grav:opts.grav??900};
  parts.push(p);
 }
 startFx();
}
for(let i=0;i<(REDUCED?0:38);i++)motes.push({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.8,sp:.004+Math.random()*.012,ph:Math.random()*6,dx:(Math.random()-.5)*.01});
function startFx(){if(!fxRunning){fxRunning=true;last=performance.now();requestAnimationFrame(frame);}}
function frame(ts){
 const dt=Math.min(.033,(ts-last)/1000);last=ts;g2.clearRect(0,0,W,H);
 g2.globalCompositeOperation='lighter';
 for(const m of motes){
  m.y-=m.sp*dt;m.x+=m.dx*dt;m.ph+=dt*1.5;if(m.y<-.02){m.y=1.02;m.x=Math.random();}
  const a=.25+.25*Math.sin(m.ph);g2.fillStyle=`rgba(255,205,120,${a})`;g2.beginPath();g2.arc(m.x*W,m.y*H,m.r,0,6.3);g2.fill();
 }
 for(let i=parts.length-1;i>=0;i--){
  const p=parts[i];p.life+=dt;if(p.life>p.max){parts.splice(i,1);continue;}
  p.vy+=p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.vx*=1-.6*dt;
  const k=1-p.life/p.max;
  if(p.kind==='crumb'){
   g2.globalCompositeOperation='source-over';g2.globalAlpha=Math.min(1,k*1.8);g2.fillStyle=p.col;
   g2.save();g2.translate(p.x,p.y);g2.rotate(p.rot);g2.beginPath();g2.moveTo(-p.s,-p.s*.6);g2.lineTo(p.s*.9,-p.s*.8);g2.lineTo(p.s*.6,p.s*.7);g2.lineTo(-p.s*.8,p.s*.9);g2.closePath();g2.fill();g2.restore();g2.globalAlpha=1;
  }else if(p.kind==='confetti'){
   g2.globalCompositeOperation='source-over';g2.globalAlpha=Math.min(1,k*2);g2.fillStyle=p.col;
   g2.save();g2.translate(p.x,p.y);g2.rotate(p.rot);g2.scale(1,Math.cos(p.life*9+p.rot));g2.fillRect(-p.s,-p.s/2,p.s*2,p.s);g2.restore();g2.globalAlpha=1;p.vy=Math.min(p.vy,220);
  }else{ // glowing spark / bubble
   g2.globalCompositeOperation='lighter';const r=p.s*(p.kind==='bubble'?1+p.life:k+.3);
   const gr=g2.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3);gr.addColorStop(0,p.col);gr.addColorStop(1,'transparent');
   g2.globalAlpha=k*.9;g2.fillStyle=gr;g2.beginPath();g2.arc(p.x,p.y,r*3,0,6.3);g2.fill();g2.globalAlpha=1;
  }
 }
 g2.globalCompositeOperation='source-over';
 requestAnimationFrame(frame);
}
if(!REDUCED)startFx();

/* ------------------------------------------------------------- monster talk */
const portrait=$('portrait');
const QUIPS={
 startYou:['Your move, little nibbler.','Go on, pick a square. I’m not hungry. (I am.)','Fresh chocolate! Take the first bite.'],
 startMe:['May I go first? Thank you!','Ooh, a whole bar. I’ll start.'],
 hint:['Psst… no fair asking for help!','A hint? Oh, alright…'],
 mineWinning:['Mmm. Exactly as planned.','Crunchy! I see the path now.','I’d think carefully, if I were you.','Delicious… and inevitable.'],
 mineLosing:['Hmm. Hmm. Uh-oh.','Nothing good here. I’ll just chew and hope.','Well played… I think.','You’re cleverer than you look!'],
 winMe:['Nom nom nom. Better luck next bar!','I do love a bitter finish.','Want another go? I’ll go easy. (I won’t.)'],
 loseMe:['Blech! The poison! You beat me!','Bleeeh… that one tasted like defeat.','I demand a rematch!'],
 thinking:['Hmm, let me see…','Calculating… every… crumb…','Ooh, ooh, what to bite?']
};
const MOOD={idle:'Hungry',think:'Scheming',chomp:'Chomping',win:'Delighted',lose:'Grumpy',worry:'Worried'};
function say(text,{dots=false}={}){
 const s=$('speech');s.classList.remove('pop');void s.offsetWidth;
 if(dots)s.innerHTML='<span class="dots"><i></i><i></i><i></i></span>';else s.textContent=text;
 s.classList.add('pop');
}
function mood(state,moodKey=state){portrait.dataset.state=state;$('mood').textContent=MOOD[moodKey]||MOOD.idle;}

/* -------------------------------------------------------------------- board */
function buildBoard(){
 const el=$('board');el.style.setProperty('--cols',cols);$('frame').style.setProperty('--ar',(cols/rows).toFixed(3));el.innerHTML='';cells=[];
 for(let y=rows-1;y>=0;y--)for(let x=0;x<cols;x++){
  const b=document.createElement('button'),poison=!x&&!y;
  b.type='button';b.className='square enter'+(poison?' poison':'');b.dataset.x=x;b.dataset.y=y;
  b.style.setProperty('--v',(Math.random()).toFixed(2));b.style.setProperty('--d',(((rows-1-y)*cols+x)*(REDUCED?0:14))+'ms');
  b.innerHTML=poison?'<span class="poison-icon">☠</span>':'<span class="mark">✧</span>';
  b.setAttribute('aria-label',poison?'Poison, A1. Eating this loses the game.':`${label(x,y)}: bite this square and all squares above and to its right`);
  (cells[y]??=[])[x]=b;el.append(b);
  b.addEventListener('animationend',ev=>{if(ev.animationName==='enter')b.classList.remove('enter');});
 }
}
function chooseFocusCell(){
 if(focusCell&&focusCell.x<board[focusCell.y])return focusCell;
 for(let y=rows-1;y>=0;y--)if(board[y]>0)return{x:board[y]-1,y};
 return{x:0,y:0};
}
function sync(){
 const total=board.reduce((a,b)=>a+b,0),human=turn==='human'&&!over;
 const prev=+$('remaining').textContent;$('remaining').textContent=total;
 if(prev!==total){const c=$('remaining');c.classList.remove('tick');void c.offsetWidth;c.classList.add('tick');}
 const f=chooseFocusCell();
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const b=cells[y][x],exists=x<board[y];
  b.classList.toggle('can',exists&&human);
  b.classList.toggle('suggested',!!(hinted&&hinted.x===x&&hinted.y===y));
  b.setAttribute('aria-disabled',exists&&human?'false':'true');
  b.tabIndex=exists&&f.x===x&&f.y===y?0:-1;
  if(!exists){b.setAttribute('aria-hidden','true');}
 }
 $('turn-label').textContent=over?(turn==='human'?'Truffle wins':'You win!'):(turn==='human'?'Your turn':'Truffle is thinking…');
 document.body.classList.toggle('thinking',!over&&turn==='monster');document.body.classList.toggle('game-over',over);
 $('hint').disabled=over||turn!=='human';clearPreview();
}
function biteCount(x,y){let n=0;for(let r=y;r<rows;r++)n+=Math.max(0,board[r]-x);return n;}
function preview(x,y){
 if(over||turn!=='human'||x>=board[y])return;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const hit=r>=y&&c>=x&&c<board[r],b=cells[r][c];
  b.classList.toggle('bite-preview',hit);
 }
 const count=biteCount(x,y);
 $('preview-label').textContent=!x&&!y?'Careful — this bite loses the game!':`Bite ${label(x,y)} · ${count} piece${count===1?'':'s'}`;
}
function clearPreview(){
 $('board').querySelectorAll('.bite-preview').forEach(b=>b.classList.remove('bite-preview'));
 $('preview-label').textContent=over?'Another bar, another possibility.':(turn==='human'?'Hover or focus to preview a bite':'Truffle is choosing…');
}
function cellFrom(target){const b=target.closest?.('.square');return b?{x:+b.dataset.x,y:+b.dataset.y,b}:null;}
let lastHover=null;
$('board').addEventListener('pointerover',e=>{const c=cellFrom(e.target);if(!c||c.x>=board[c.y])return;preview(c.x,c.y);if(lastHover!==c.b&&turn==='human'&&!over){lastHover=c.b;sfx.tick();}});
$('board').addEventListener('pointerleave',()=>{lastHover=null;clearPreview();});
$('board').addEventListener('focusin',e=>{const c=cellFrom(e.target);if(c){focusCell={x:c.x,y:c.y};preview(c.x,c.y);}});
$('board').addEventListener('focusout',clearPreview);
// A hovered square lifts slightly, so press and release can land on different elements and the browser
// then reports the click on the board itself. Fall back to the square where the press started.
let downCell=null;
$('board').addEventListener('pointerdown',e=>{downCell=cellFrom(e.target);});
$('board').addEventListener('click',e=>{
 const c=cellFrom(e.target)||downCell;downCell=null;if(!c)return;
 if(over){$('status').textContent='This round is over. Press “New chocolate” to play again.';const n=$('new-game');n.classList.remove('nudge');void n.offsetWidth;n.classList.add('nudge');return;}
 if(turn==='human'&&c.x<board[c.y])play(c.x,c.y);
});
$('board').addEventListener('keydown',e=>{
 const c=cellFrom(e.target);const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!c||!d)return;
 e.preventDefault();const nx=c.x+d[0],ny=c.y+d[1];
 if(nx>=0&&ny>=0&&ny<rows&&nx<board[ny])cells[ny][nx].focus();
});

/* --------------------------------------------------------------- game flow */
function addHistory(who,x,y){
 const li=document.createElement('li'),poison=!x&&!y;
 li.className=poison?'poison-hit':(who==='human'?'you':'tr');
 li.textContent=`${who==='human'?'You':'Truffle'} · ${poison?'☠ A1':label(x,y)}`;$('history').append(li);
}
function shakeAndWord(count){
 if(REDUCED)return;
 const w=$('chomp-word');w.textContent=count>=10?pick(['CRUNCH!','CHOMP!','MUNCH!']):pick(['CHOMP!','NOM!','MUNCH!','CRUNCH!']);
 w.classList.remove('go');void w.offsetWidth;w.classList.add('go');
 if(count>=6){document.body.classList.remove('shake');void document.body.offsetWidth;document.body.classList.add('shake');}
}
function eatAnimation(x,y){
 const removed=[];
 for(let r=y;r<rows;r++)for(let c=x;c<board[r];c++)removed.push(cells[r][c]);
 let px=0,py=0;
 removed.forEach(b=>{
  const dist=Math.abs(+b.dataset.x-x)+Math.abs(+b.dataset.y-y);
  b.style.setProperty('--d',(REDUCED?0:dist*28)+'ms');
  b.classList.add('removed','eaten');b.classList.remove('bite-preview','monster-target','suggested','enter');
  setTimeout(()=>b.classList.remove('eaten'),900+dist*28);
  if(!REDUCED){
   const rc=b.getBoundingClientRect(),cx=rc.left+rc.width/2,cy=rc.top+rc.height/2;
   px+=cx;py+=cy;
   setTimeout(()=>{burst('crumb',cx,cy,removed.length>40?2:4,{speed:280,up:220,size:5+rc.width/12});burst('spark',cx,cy,1,{colors:['#ffd08a','#ffb35a'],speed:120,size:5,life:.6,grav:-60});},dist*28);
  }
 });
 return removed.length;
}
function play(x,y){
 if(over||x<0||y<0||y>=rows||x>=board[y])return;
 hintRequest++;hinted=null;$('hint-text').textContent='';
 const actor=turn,poison=!x&&!y;
 // Eat first (uses the old board for geometry), then update the model.
 const count=eatAnimation(x,y);board=E.bite(board,x,y);
 addHistory(actor,x,y);shakeAndWord(count);
 if(actor==='monster'){mood('chomp');}
 if(poison){
  crunchSound(count);sfx.poison();over=true;
  $('status').textContent=actor==='human'?'You ate the poisoned square. Truffle wins this round.':'Truffle ate the poisoned square. You win!';
  sync();showResult(actor==='monster');return;
 }
 crunchSound(count);
 turn=actor==='human'?'monster':'human';
 $('status').textContent=turn==='monster'?`You bit ${label(x,y)}. Truffle is choosing a reply…`:`Truffle bit ${label(x,y)}. Your move.`;
 // Keep keyboard focus somewhere sensible if the focused square was eaten.
 if(actor==='human'&&document.activeElement?.classList?.contains('square'))focusCell=x>0?{x:x-1,y}:{x:0,y:Math.max(0,y-1)};
 sync();
 if(turn==='monster'){scheduleMonster();}
 else{setTimeout(()=>{if(!over&&turn==='human'&&portrait.dataset.state==='chomp')mood('idle');},800);const f=chooseFocusCell();if(document.activeElement===document.body||document.activeElement?.classList?.contains('square'))cells[f.y][f.x].focus({preventScroll:true});}
}
function scheduleMonster(){
 const ticket=epoch;mood('think');say('',{dots:true});
 timer=setTimeout(async()=>{
  if(ticket!==epoch||over||turn!=='monster')return;
  try{
   const choices=await analyzeAsync(board);if(ticket!==epoch||over||turn!=='monster')return;
   const win=choices.find(move=>move.winning),m=win||choices[0]||{x:0,y:0};
   const count=biteCount(m.x,m.y);
   $('turn-label').textContent='Truffle takes a bite…';$('status').textContent=`Truffle chose ${label(m.x,m.y)}. Watch the highlighted chocolate.`;
   $('preview-label').textContent=`Truffle’s bite · ${count} piece${count===1?'':'s'}`;
   for(let r=m.y;r<rows;r++)for(let c=m.x;c<board[r];c++)cells[r][c].classList.add('monster-target');
   say(!m.x&&!m.y?'…only the poison is left. Oh dear.':pick(win?QUIPS.mineWinning:QUIPS.mineLosing));
   mood('think',win?'think':'worry');
   timer=setTimeout(()=>{if(ticket===epoch)play(m.x,m.y);},850);
  }catch{if(ticket===epoch){$('status').textContent='Truffle could not calculate this move. Start a new chocolate bar to try again.';document.body.classList.remove('thinking');}}
 },REDUCED?400:900);
}
function newGame(){
 $('result').close();epoch++;hintRequest++;clearTimeout(timer);cancelAnalysis();
 [rows,cols]=$('size').value.split(',').map(Number);board=Array(rows).fill(cols);turn=$('first').value;over=false;hinted=null;focusCell=null;
 $('hint-text').textContent='';$('history').innerHTML='';buildBoard();
 $('status').textContent=turn==='human'?'Choose a square. Everything above and to its right goes too.':'Truffle gets the first bite. Watch the shape it leaves.';
 $('remaining').textContent=rows*cols;sync();mood('idle');sfx.start();
 if(turn==='monster'){say(pick(QUIPS.startMe));scheduleMonster();}else say(pick(QUIPS.startYou));
}
function bump(id){const e=$(id);e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump');}
function renderScore(){$('score-you').textContent=score.you;$('score-truffle').textContent=score.truffle;}
function showResult(won){
 $('info').close();
 won?score.you++:score.truffle++;renderScore();bump(won?'score-you':'score-truffle');
 mood(won?'lose':'win',won?'lose':'win');say(pick(won?QUIPS.loseMe:QUIPS.winMe));
 const ticket=epoch;
 if(won){
  sfx.win();
  const palette=['#f2c47a','#b4ecc0','#ffffff','#ff8a6a','#7ad9ff','#d9a3ff'];
  for(let i=0;i<4;i++)setTimeout(()=>burst('confetti',innerWidth*(.2+Math.random()*.6),innerHeight*.35,40,{colors:palette,speed:520,up:520,size:6,life:3,grav:600}),i*220);
 }else{
  sfx.lose();
  for(let i=0;i<3;i++)setTimeout(()=>{const b=cells[0][0].getBoundingClientRect();burst('bubble',b.left+b.width/2,b.top+b.height/2,14,{colors:['#a6f04a','#7ad04a'],speed:160,up:280,size:9,life:1.6,grav:-140});},i*300);
 }
 $('result').classList.toggle('result-win',won);$('result-symbol').textContent=won?'✧':'☠';
 $('result-title').textContent=won?'Sweet victory!':'Truffle wins this round';
 $('result-message').textContent=won?'Truffle took the poisoned bite. You win!':'You took the poisoned bite. A fresh chocolate bar awaits.';
 setTimeout(()=>{if(ticket===epoch&&over)$('result').showModal();},REDUCED?0:650);
}
$('play-again').onclick=newGame;
$('close-result').onclick=()=>{$('result').close();$('new-game').focus();};
$('new-game').onclick=newGame;$('size').onchange=newGame;$('first').onchange=newGame;
$('hint').onclick=async()=>{
 const ticket=epoch,request=++hintRequest;$('hint').disabled=true;$('hint-text').textContent='Looking for a winning bite…';
 try{
  const a=await analyzeAsync(board);if(ticket!==epoch||request!==hintRequest||turn!=='human'||over)return;
  const win=a.find(m=>m.winning);sfx.hint();say(pick(QUIPS.hint));
  if(win){hinted=win;sync();$('hint-text').textContent=`Try ${label(win.x,win.y)}, glowing in mint. It leaves your opponent a losing position against perfect play. Can you work out why?`;}
  else $('hint-text').textContent=a.length?'There is no forced win here against perfect play. Truffle can win from this position if it keeps choosing winning moves.':'Only the poison remains. Every move loses; try a new game and look for an earlier turning point.';
 }catch{if(ticket===epoch&&request===hintRequest)$('hint-text').textContent='The hint could not be calculated. Please try again.';}
 finally{if(ticket===epoch&&request===hintRequest)$('hint').disabled=over||turn!=='human';}
};
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫  Sound on':'♫  Sound off';$('sound').setAttribute('aria-pressed',sound);if(sound)sfx.start();};

/* ------------------------------------------------------------------ dialogs */
function showInfo(content){$('info-content').innerHTML=content;$('info').showModal();}
$('learn').onclick=()=>showInfo(`<p class="eyebrow">THE RULES OF CHOMP</p><h2>Think before you bite.</h2><ol><li>You and Truffle take turns choosing a chocolate square.</li><li>A bite removes that square and every remaining square <strong>above and to its right</strong>, including squares directly above it or directly to its right.</li><li>The green square at the <strong>bottom left is poisoned</strong>. Whoever takes it loses.</li></ol><p>Hover over a square to see the whole bite. On a touch screen, tap a square to bite. With a keyboard, Tab to the board, use the arrow keys to explore, and press Enter or Space to bite.</p><p>Coordinates start at A1 in the bottom left. Letters increase to the right; numbers increase upward.</p>`);
$('classroom').onclick=()=>showInfo(`<h2>A win we know exists.</h2><p>On every rectangular bar with more than one square, the first player has a winning strategy. But the famous proof doesn’t give you a recipe for finding the moves.</p><details><summary>Start with an experiment</summary><p>Try the small 3 × 4 bar. Then try a square. What shape can you leave so that every move your opponent makes has a matching reply? Swap who goes first and compare.</p></details><details><summary>A nudge toward the proof</summary><p>Imagine removing only the top-right square. Either this is a winning move… or the next player has a winning response. Could you have made that response as your very first bite?</p></details><details><summary>Reveal the strategy-stealing argument</summary><p>This is a finite game with no draws, so every position is winning or losing for the player whose turn it is, assuming perfect play.</p><p>Start with a rectangle of more than one square. Remove only its top-right square. If that leaves a losing position for the opponent, you have found a winning first move.</p><p>Otherwise, the opponent has a winning response: a bite that leaves a losing position for you. That response cannot eat poison. Make that same bite directly on the original rectangle instead. Every bite on a rectangle includes its top-right square, so the resulting shape is exactly the same. Now it is the opponent facing that losing position.</p><p>Either way, a winning first move exists. The argument does not identify the response in the second case: it proves existence without providing the move.</p></details><details><summary>How does Truffle find moves?</summary><p>The game checks every possible safe bite recursively and remembers results. A position is winning if at least one move leaves the opponent a losing position. A board with only the poison is losing.</p><p>Truffle always chooses a winning move when one exists. Even a perfect opponent cannot force a win from a losing position if you play perfectly.</p></details><p>For more information, read <a href="https://en.wikipedia.org/wiki/Chomp" target="_blank" rel="noopener noreferrer">more about Chomp (opens in a new tab)</a>.</p>`);
$('close-info').onclick=()=>$('info').close();
$('info').addEventListener('click',e=>{if(e.target===$('info')){const r=$('info').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info').close();}});

renderScore();
newGame();

/* ------------------------------------------------------ WebMCP tool hooks */
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 const snapshot=()=>({rows,columns:cols,rowWidthsBottomUp:[...board],turn,gameOver:over});
 const definitions=[{name:'read_chomp_game',description:'Read the current Chomp board, from the bottom row upward, and whose turn it is.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:snapshot},{name:'take_chomp_bite',description:'Take the human player’s bite using zero-based x from the left and y from the bottom. The monster replies automatically after a short pause.',inputSchema:{type:'object',properties:{x:{type:'integer',minimum:0},y:{type:'integer',minimum:0}},required:['x','y'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!Number.isInteger(input.x)||!Number.isInteger(input.y)||input.x<0||input.y<0||input.y>=rows||input.x>=board[input.y]||over||turn!=='human')throw new Error('That bite is unavailable. Read the board and wait for the human turn.');play(input.x,input.y);return snapshot();}}];
 for(const definition of definitions){try{Promise.resolve(document.modelContext.registerTool(definition,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
