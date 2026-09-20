(function(){
  'use strict';
  const Q=globalThis.CalculusMillionaireQuestions,typeset=globalThis.CalculusMathTypeset,letters=['A','B','C','D'];
  const $=id=>document.getElementById(id),intro=$('intro'),game=$('game'),answers=$('answers'),ladder=$('ladder'),result=$('result');
  let bank=Q.highSchool,level=0,question=null,sourceQuestion=null,selected=null,locked=false,soundOn=true,used={fifty:false,audience:false,swap:false},chosen=[],usedTopics=new Set();
  const euro=n=>'€'+n.toLocaleString('en-US');
  function sound(kind){
    if(!soundOn||!globalThis.AudioContext)return;
    const ctx=new globalThis.AudioContext(),osc=ctx.createOscillator(),gain=ctx.createGain(),notes=kind==='right'?[523,659,784]:kind==='wrong'?[220,174]:[392];
    gain.connect(ctx.destination);gain.gain.setValueAtTime(.055,ctx.currentTime);
    notes.forEach((note,i)=>osc.frequency.setValueAtTime(note,ctx.currentTime+i*.12));osc.connect(gain);osc.start();gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+notes.length*.12+.16);osc.stop(ctx.currentTime+notes.length*.12+.17);
  }
  function buildLadder(){
    ladder.innerHTML='';
    bank.prizes.forEach((prize,i)=>{const li=document.createElement('li');li.dataset.level=i;li.className=bank.checkpoints.includes(i)?'checkpoint':'';li.innerHTML='<span>'+(i+1)+'</span><span>'+euro(prize)+'</span>';ladder.appendChild(li)});
  }
  function updateLadder(){[...ladder.children].forEach((li,i)=>{li.classList.toggle('current',i===level);li.classList.toggle('passed',i<level)})}
  function pickQuestion(exclude){
    let pool=bank.levels[level].filter(q=>q!==exclude),fresh=pool.filter(q=>!usedTopics.has(q.topic));if(fresh.length)pool=fresh;
    const pick=pool[Math.floor(Math.random()*pool.length)];chosen[level]=pick;usedTopics.add(pick.topic);return pick;
  }
  function renderQuestion(q){
    sourceQuestion=q;const shuffled=q.a.map((answer,i)=>({answer:answer,correct:i===q.correct})).sort(()=>Math.random()-.5);question={q:q.q,a:shuffled.map(x=>x.answer),correct:shuffled.findIndex(x=>x.correct),why:q.why};selected=null;locked=false;$('question-number').textContent='QUESTION '+(level+1)+' OF '+bank.levels.length;$('current-prize').textContent='FOR '+euro(bank.prizes[level]);$('question').innerHTML=typeset(question.q);$('prompt').textContent='';$('final-answer').disabled=true;answers.innerHTML='';$('audience-panel').hidden=true;
    question.a.forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.className='answer';b.dataset.letter=letters[i];b.dataset.index=i;b.innerHTML=typeset(answer);b.onclick=()=>select(i);answers.appendChild(b)});updateLadder();
  }
  function select(index){if(locked)return;selected=index;[...answers.children].forEach((b,i)=>b.classList.toggle('selected',i===index));$('prompt').textContent='Is '+letters[index]+' your final answer?';$('final-answer').disabled=false;sound('select')}
  function finalAnswer(){
    if(selected===null||locked)return;locked=true;$('final-answer').disabled=true;[...answers.children].forEach(b=>b.disabled=true);
    const correct=selected===question.correct;answers.children[question.correct].classList.add('correct');if(!correct)answers.children[selected].classList.add('wrong');sound(correct?'right':'wrong');setTimeout(()=>showResult(correct),450);
  }
  function showResult(correct){
    const won=correct&&level===bank.levels.length-1;$('result-icon').textContent=correct?'✓':'×';$('result-icon').classList.toggle('wrong',!correct);$('result-kicker').textContent=won?'€1,000,000 WON':correct?'CORRECT':'THAT WAS NOT IT';$('result-title').textContent=correct?(won?'You are the Calculus Millionaire!':euro(bank.prizes[level])+' secured'):'You leave with '+euro(safeWinnings());$('result-explanation').innerHTML=typeset(question.why);$('replay-note').hidden=!won;$('continue').textContent=correct?(won?'Play again with new questions →':'Next question →'):'Try a new run';$('continue').onclick=correct&&level<bank.levels.length-1?nextQuestion:restart;saveBest(correct?bank.prizes[level]:safeWinnings());result.showModal();
  }
  function safeWinnings(){let value=0;bank.checkpoints.forEach(i=>{if(level>i)value=bank.prizes[i]});return value}
  function nextQuestion(){result.close();level++;renderQuestion(pickQuestion())}
  function restart(){result.close();level=0;used={fifty:false,audience:false,swap:false};chosen=[];usedTopics=new Set();['fifty','audience','swap'].forEach(id=>$(id).disabled=false);renderQuestion(pickQuestion())}
  function useFifty(){if(used.fifty||locked)return;used.fifty=true;$('fifty').disabled=true;const wrong=[0,1,2,3].filter(i=>i!==question.correct);wrong.sort(()=>Math.random()-.5).slice(0,2).forEach(i=>answers.children[i].classList.add('removed'));sound('select')}
  function useAudience(){
    if(used.audience||locked)return;used.audience=true;$('audience').disabled=true;const confidence=Math.max(46,82-level*2),remaining=100-confidence,cuts=[Math.random(),Math.random()].sort(),wrongShares=[Math.round(cuts[0]*remaining),Math.round((cuts[1]-cuts[0])*remaining),0];wrongShares[2]=remaining-wrongShares[0]-wrongShares[1];let wi=0;$('audience-bars').innerHTML='';
    [0,1,2,3].forEach(i=>{const pct=i===question.correct?confidence:wrongShares[wi++],col=document.createElement('div');col.className='poll-column';col.innerHTML='<span>'+pct+'%</span><i style="height:'+pct+'%"></i><b>'+letters[i]+'</b>';$('audience-bars').appendChild(col)});$('audience-panel').hidden=false;sound('select');
  }
  function useSwap(){if(used.swap||locked)return;used.swap=true;$('swap').disabled=true;renderQuestion(pickQuestion(sourceQuestion));sound('select')}
  function storageKey(){return 'calculus-millionaire-best-'+bank.key}
  function saveBest(value){try{const old=Number(localStorage.getItem(storageKey())||0),best=Math.max(old,value);localStorage.setItem(storageKey(),best);$('best-score').textContent=euro(best)}catch(e){$('best-score').textContent=euro(value)}}
  function loadBest(){try{$('best-score').textContent=euro(Number(localStorage.getItem(storageKey())||0))}catch(e){}}
  function chooseLevel(key){
    bank=Q[key];level=0;used={fifty:false,audience:false,swap:false};chosen=[];usedTopics=new Set();['fifty','audience','swap'].forEach(id=>$(id).disabled=false);$('level-name').textContent=bank.label;$('level-high-school').classList.toggle('active',key==='highSchool');$('level-university').classList.toggle('active',key==='university');game.hidden=true;intro.hidden=false;if(result.open)result.close();$('level-dialog').close();buildLadder();loadBest();
  }
  $('start').onclick=()=>{intro.hidden=true;game.hidden=false;renderQuestion(pickQuestion())};$('final-answer').onclick=finalAnswer;$('fifty').onclick=useFifty;$('audience').onclick=useAudience;$('swap').onclick=useSwap;
  $('sound').onclick=()=>{soundOn=!soundOn;$('sound').textContent=soundOn?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(soundOn));$('sound').setAttribute('aria-label',soundOn?'Turn sound off':'Turn sound on')};
  $('level-settings').onclick=()=>$('level-dialog').showModal();$('cancel-level').onclick=()=>$('level-dialog').close();$('level-high-school').onclick=()=>chooseLevel('highSchool');$('level-university').onclick=()=>chooseLevel('university');
  buildLadder();loadBest();globalThis.CalculusMillionaireGame={restart:restart,safeWinnings:safeWinnings};
})();
