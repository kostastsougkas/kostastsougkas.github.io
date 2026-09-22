const $=id=>document.getElementById(id),E=ChompEngine;
let board,rows,cols,turn,over=false,timer=null,epoch=0,sound=true,audioContext,hinted=null;
let solverWorker,requestId=0,hintRequest=0;
const pending=new Map();
function cancelAnalysis(){solverWorker?.terminate();solverWorker=null;for(const request of pending.values())request.reject(new Error('cancelled'));pending.clear();}
function analyzeAsync(shape){
 if(!solverWorker){
  const url=URL.createObjectURL(new Blob([`const E=(${E.createEngine.toString()})();onmessage=({data})=>{try{postMessage({id:data.id,moves:E.analyze(data.board)})}catch(error){postMessage({id:data.id,error:error.message})}}`],{type:'text/javascript'}));
  try{solverWorker=new Worker(url);}finally{URL.revokeObjectURL(url);}
  solverWorker.onmessage=({data})=>{const request=pending.get(data.id);if(!request)return;pending.delete(data.id);if(data.error)request.reject(new Error(data.error));else request.resolve(data.moves);};
  solverWorker.onerror=()=>cancelAnalysis();
 }
 return new Promise((resolve,reject)=>{const id=++requestId;pending.set(id,{resolve,reject});solverWorker.postMessage({id,board:[...shape]});});
}
function tone(lose=false){if(!sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.type='sine';o.frequency.setValueAtTime(lose?160:520,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(lose?55:240,audioContext.currentTime+.16);g.gain.setValueAtTime(.1,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.22);o.start();o.stop(audioContext.currentTime+.23);}catch{}}
function render(){
 $('board').style.setProperty('--cols',cols);$('board').innerHTML='';
 for(let y=rows-1;y>=0;y--)for(let x=0;x<cols;x++){
  const b=document.createElement('button'),exists=x<board[y];b.className='square'+(!exists?' removed':'')+(!x&&!y?' poison':'')+(hinted&&hinted.x===x&&hinted.y===y?' suggested':'');b.dataset.x=x;b.dataset.y=y;
  b.disabled=!exists||over||turn!=='human';b.tabIndex=exists&&!over&&turn==='human'?0:-1;
  b.innerHTML=!x&&!y?'<span class="poison-icon">☠</span>':'<span class="mark">✧</span>';
  b.setAttribute('aria-label',!x&&!y?'Poison, A1. Eating this loses the game.':`${String.fromCharCode(65+x)}${y+1}: bite this square and all squares above and to its right`);
  if(!exists)b.setAttribute('aria-hidden','true');
  b.addEventListener('pointerenter',()=>preview(x,y));b.addEventListener('focus',()=>preview(x,y));b.addEventListener('pointerleave',clearPreview);b.addEventListener('blur',clearPreview);
  b.addEventListener('click',()=>{if(turn==='human'&&!over)play(x,y);});
  b.addEventListener('keydown',event=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[event.key];if(!d)return;event.preventDefault();let nx=x+d[0],ny=y+d[1];if(nx>=0&&ny>=0&&ny<rows&&nx<board[ny])$('board').querySelector(`[data-x="${nx}"][data-y="${ny}"]`).focus();});
  $('board').append(b);
 }
 $('remaining').textContent=board.reduce((a,b)=>a+b,0);$('turn-label').textContent=over?(turn==='human'?'Truffle wins':'You win!'):(turn==='human'?'Your turn':'Truffle is thinking…');
 document.body.classList.toggle('thinking',!over&&turn==='monster');document.body.classList.toggle('game-over',over);
 $('hint').disabled=over||turn!=='human';clearPreview();
}
function preview(x,y){if(over||turn!=='human'||x>=board[y])return;let count=0;$('board').querySelectorAll('.square').forEach(b=>{const hit=+b.dataset.x>=x&&+b.dataset.y>=y&&!b.classList.contains('removed');b.classList.toggle('bite-preview',hit);if(hit)count++;});$('preview-label').textContent=!x&&!y?'Careful — this bite loses the game!':`Bite ${String.fromCharCode(65+x)}${y+1} · ${count} piece${count===1?'':'s'}`;}
function clearPreview(){$('board').querySelectorAll('.bite-preview').forEach(b=>b.classList.remove('bite-preview'));$('preview-label').textContent=over?'Another bar, another possibility.':'Hover or focus to preview a bite';}
function play(x,y){if(over||x<0||y<0||y>=rows||x>=board[y])return;hintRequest++;hinted=null;$('hint-text').textContent='';const actor=turn;board=E.bite(board,x,y);tone(!x&&!y);
 if(!x&&!y){over=true;$('status').textContent=actor==='human'?'You ate the poisoned square. Truffle wins this round.':'Truffle ate the poisoned square. You win!';render();showResult(actor==='monster');return;}
 turn=actor==='human'?'monster':'human';$('status').textContent=turn==='monster'?`You bit ${String.fromCharCode(65+x)}${y+1}. Truffle is choosing a reply…`:`Truffle bit ${String.fromCharCode(65+x)}${y+1}. Your move.`;render();if(turn==='monster')scheduleMonster();
}
function scheduleMonster(){const ticket=epoch;timer=setTimeout(async()=>{
 if(ticket!==epoch||over||turn!=='monster')return;
 try{
  const choices=await analyzeAsync(board);if(ticket!==epoch||over||turn!=='monster')return;
  const m=choices.find(move=>move.winning)||choices[0]||{x:0,y:0};
  const targets=[...$('board').querySelectorAll('.square')].filter(b=>+b.dataset.x>=m.x&&+b.dataset.y>=m.y&&!b.classList.contains('removed'));
  $('turn-label').textContent='Truffle takes a bite…';$('status').textContent=`Truffle chose ${String.fromCharCode(65+m.x)}${m.y+1}. Watch the highlighted chocolate.`;
  $('preview-label').textContent=`Truffle’s bite · ${targets.length} piece${targets.length===1?'':'s'}`;
  targets.forEach(b=>b.classList.add('monster-target'));
  timer=setTimeout(()=>{if(ticket!==epoch)return;targets.forEach(b=>b.classList.add('monster-crumble'));timer=setTimeout(()=>{if(ticket===epoch)play(m.x,m.y);},550);},950);
 }catch{if(ticket===epoch){$('status').textContent='Truffle could not calculate this move. Start a new chocolate bar to try again.';document.body.classList.remove('thinking');}}
 },1100);}
function newGame(){$('result').close();epoch++;hintRequest++;clearTimeout(timer);cancelAnalysis();[rows,cols]=$('size').value.split(',').map(Number);board=Array(rows).fill(cols);turn=$('first').value;over=false;hinted=null;$('hint-text').textContent='';$('status').textContent=turn==='human'?'Choose a square. Everything above and to its right goes too.':'Truffle gets the first bite. Watch the shape it leaves.';render();if(turn==='monster')scheduleMonster();}
function showResult(won){$('info').close();$('result').classList.toggle('result-win',won);$('result-symbol').textContent=won?'✧':'☠';$('result-title').textContent=won?'Sweet victory!':'Truffle wins this round';$('result-message').textContent=won?'Truffle took the poisoned bite. You win!':'You took the poisoned bite. A fresh chocolate bar awaits.';$('result').showModal();}
$('play-again').onclick=newGame;
$('close-result').onclick=()=>{$('result').close();$('new-game').focus();};
$('new-game').onclick=newGame;$('size').onchange=newGame;$('first').onchange=newGame;
$('hint').onclick=async()=>{const ticket=epoch,request=++hintRequest;$('hint').disabled=true;$('hint-text').textContent='Looking for a winning bite…';try{const a=await analyzeAsync(board);if(ticket!==epoch||request!==hintRequest||turn!=='human'||over)return;const win=a.find(m=>m.winning);if(win){hinted=win;render();$('hint-text').textContent=`Try ${String.fromCharCode(65+win.x)}${win.y+1}, highlighted in mint. It leaves your opponent a losing position against perfect play. Can you work out why?`;}else $('hint-text').textContent=a.length?'There is no forced win here against perfect play. Truffle can win from this position if it keeps choosing winning moves.':'Only the poison remains. Every move loses; try a new game and look for an earlier turning point.';}catch{if(ticket===epoch&&request===hintRequest)$('hint-text').textContent='The hint could not be calculated. Please try again.';}finally{if(ticket===epoch&&request===hintRequest)$('hint').disabled=over||turn!=='human';}};
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫  Sound on':'♫  Sound off';$('sound').setAttribute('aria-pressed',sound);if(sound)tone();};
function showInfo(content){$('info-content').innerHTML=content;$('info').showModal();}
$('learn').onclick=()=>showInfo(`<p class="eyebrow">THE RULES OF CHOMP</p><h2>Think before you bite.</h2><ol><li>You and Truffle take turns choosing a chocolate square.</li><li>A bite removes that square and every remaining square <strong>above and to its right</strong>, including squares directly above it or directly to its right.</li><li>The green square at the <strong>bottom left is poisoned</strong>. Whoever takes it loses.</li></ol><p>Hover over a square to see the whole bite. On a touch screen, tap a square to bite. With a keyboard, Tab to a square, use the arrow keys to explore, and press Enter or Space to bite.</p><p>Coordinates start at A1 in the bottom left. Letters increase to the right; numbers increase upward.</p>`);
$('classroom').onclick=()=>showInfo(`<h2>A win we know exists.</h2><p>On every rectangular bar with more than one square, the first player has a winning strategy. But the famous proof doesn’t give you a recipe for finding the moves.</p><details><summary>Start with an experiment</summary><p>Try the small 3 × 4 bar. Then try a square. What shape can you leave so that every move your opponent makes has a matching reply? Swap who goes first and compare.</p></details><details><summary>A nudge toward the proof</summary><p>Imagine removing only the top-right square. Either this is a winning move… or the next player has a winning response. Could you have made that response as your very first bite?</p></details><details><summary>Reveal the strategy-stealing argument</summary><p>This is a finite game with no draws, so every position is winning or losing for the player whose turn it is, assuming perfect play.</p><p>Start with a rectangle of more than one square. Remove only its top-right square. If that leaves a losing position for the opponent, you have found a winning first move.</p><p>Otherwise, the opponent has a winning response: a bite that leaves a losing position for you. That response cannot eat poison. Make that same bite directly on the original rectangle instead. Every bite on a rectangle includes its top-right square, so the resulting shape is exactly the same. Now it is the opponent facing that losing position.</p><p>Either way, a winning first move exists. The argument does not identify the response in the second case: it proves existence without providing the move.</p></details><details><summary>How does Truffle find moves?</summary><p>The game checks every possible safe bite recursively and remembers results. A position is winning if at least one move leaves the opponent a losing position. A board with only the poison is losing.</p><p>Truffle always chooses a winning move when one exists. Even a perfect opponent cannot force a win from a losing position if you play perfectly.</p></details><p>For more information, read <a href="https://en.wikipedia.org/wiki/Chomp" target="_blank" rel="noopener noreferrer">more about Chomp (opens in a new tab)</a>.</p>`);
$('close-info').onclick=()=>$('info').close();$('info').addEventListener('click',e=>{if(e.target===$('info')){const r=$('info').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info').close();}});
newGame();
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 const snapshot=()=>({rows,columns:cols,rowWidthsBottomUp:[...board],turn,gameOver:over});
 const definitions=[{name:'read_chomp_game',description:'Read the current Chomp board, from the bottom row upward, and whose turn it is.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:snapshot},{name:'take_chomp_bite',description:'Take the human player’s bite using zero-based x from the left and y from the bottom. The monster replies automatically after a short pause.',inputSchema:{type:'object',properties:{x:{type:'integer',minimum:0},y:{type:'integer',minimum:0}},required:['x','y'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!Number.isInteger(input.x)||!Number.isInteger(input.y)||input.x<0||input.y<0||input.y>=rows||input.x>=board[input.y]||over||turn!=='human')throw new Error('That bite is unavailable. Read the board and wait for the human turn.');play(input.x,input.y);return snapshot();}}];
 for(const definition of definitions){try{Promise.resolve(document.modelContext.registerTool(definition,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

