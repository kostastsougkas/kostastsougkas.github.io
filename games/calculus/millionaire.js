(function(){
  'use strict';
  const Q=globalThis.CalculusMillionaireQuestions,SV=globalThis.CalculusMillionaireSwedish,EL=globalThis.CalculusMillionaireGreek,I18n=globalThis.CalculusMillionaireI18n,typeset=globalThis.CalculusMathTypeset,letters=['A','B','C','D'];
  const $=id=>document.getElementById(id),intro=$('intro'),game=$('game'),answers=$('answers'),ladder=$('ladder'),result=$('result');
  let bank=Q.highSchool,lang='en',level=0,question=null,sourceQuestion=null,answerOrder=[],selected=null,locked=false,soundOn=true,used={fifty:false,audience:false,swap:false},chosen=[],usedTopics=new Set(),removed=[],lastResult=null,resultTimer=null,revealTimer=null,revealed=false;
  try{const saved=localStorage.getItem('calculus-language')||localStorage.getItem('calculus-millionaire-language');if(['en','sv','el'].includes(saved))lang=saved}catch(e){}
  const t=(key,values)=>I18n.t(lang,key,values);
  const euro=n=>new Intl.NumberFormat({sv:'sv-SE',el:'el-GR',en:'en-IE'}[lang],{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  function shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function localized(q){return lang==='sv'?SV[q.id]:lang==='el'?EL[q.id]:q}
  let audio=null;
  function sound(kind){
    const Engine=globalThis.AudioContext||globalThis.webkitAudioContext;if(!soundOn||!Engine)return;
    try{
      audio=audio||new Engine();if(audio.state==='suspended')audio.resume();
      const now=audio.currentTime,master=audio.createGain();master.gain.value=.9;master.connect(audio.destination);
      // [frequency, start, length, volume, wave]
      const voices={
        select:[[440,0,.09,.05,'triangle']],
        lock:[[110,0,1.5,.07,'sawtooth'],[165,0,1.5,.04,'triangle'],[220,.55,.35,.04,'sine'],[220,1.05,.35,.04,'sine']],
        right:[[523,0,.16,.06,'triangle'],[659,.11,.16,.06,'triangle'],[784,.22,.16,.06,'triangle'],[1047,.34,.6,.07,'triangle'],[523,.34,.6,.04,'sine']],
        wrong:[[196,0,.28,.07,'sawtooth'],[147,.2,.32,.07,'sawtooth'],[98,.45,.7,.07,'sawtooth']],
        lifeline:[[880,0,.1,.05,'sine'],[1175,.08,.1,.05,'sine'],[1568,.16,.25,.05,'sine']],
        win:[[523,0,.2,.07,'triangle'],[659,.15,.2,.07,'triangle'],[784,.3,.2,.07,'triangle'],[1047,.45,.3,.08,'triangle'],[784,.75,.16,.07,'triangle'],[1047,.9,.16,.07,'triangle'],[1319,1.05,.9,.09,'triangle'],[659,1.05,.9,.05,'sine']]
      }[kind]||[];
      for(const [freq,start,len,vol,type] of voices){
        const osc=audio.createOscillator(),gain=audio.createGain(),t0=now+start;osc.type=type;osc.frequency.setValueAtTime(freq,t0);
        gain.gain.setValueAtTime(.0001,t0);gain.gain.exponentialRampToValueAtTime(vol,t0+.02);gain.gain.exponentialRampToValueAtTime(.0001,t0+len);
        osc.connect(gain);gain.connect(master);osc.start(t0);osc.stop(t0+len+.05);
      }
    }catch(e){}
  }
  function buildLadder(){ladder.innerHTML='';bank.prizes.forEach((prize,i)=>{const li=document.createElement('li');li.dataset.level=i;li.className=bank.checkpoints.includes(i)?'checkpoint':'';li.innerHTML='<span>'+(i+1)+'</span><span>'+euro(prize)+'</span>';ladder.appendChild(li)});updateLadder()}
  function updateLadder(){[...ladder.children].forEach((li,i)=>{li.classList.toggle('current',i===level);li.classList.toggle('passed',i<level)})}
  function pickQuestion(exclude){
    let pool=bank.levels[level].filter(q=>q!==exclude),fresh=pool.filter(q=>!usedTopics.has(q.topic));if(fresh.length)pool=fresh;
    if(!pool.length)pool=bank.levels[level];const pick=pool[Math.floor(Math.random()*pool.length)];chosen[level]=pick;usedTopics.add(pick.topic);return pick;
  }
  function renderQuestion(q){sourceQuestion=q;answerOrder=shuffle([0,1,2,3]);selected=null;locked=false;revealed=false;removed=[];lastResult=null;$('audience-panel').hidden=true;paintQuestion()}
  function paintQuestion(){
    if(!sourceQuestion)return;
    const translated=localized(sourceQuestion);
    question={q:translated.q,a:answerOrder.map(i=>translated.a[i]),correct:answerOrder.indexOf(sourceQuestion.correct),why:translated.why};
    $('question-number').textContent=t('question',{n:level+1,total:bank.levels.length});$('current-prize').textContent=t('forPrize',{prize:euro(bank.prizes[level])});$('question').innerHTML=typeset(question.q,lang);
    $('prompt').textContent=selected===null?'':t('confirm',{letter:letters[selected]});$('final-answer').disabled=selected===null||locked;answers.innerHTML='';
    question.a.forEach((answer,i)=>{
      const b=document.createElement('button');b.type='button';b.className='answer';b.dataset.letter=letters[i];b.dataset.index=i;b.innerHTML=typeset(answer,lang);b.onclick=()=>select(i);b.disabled=locked||removed.includes(i);
      b.classList.toggle('selected',i===selected);b.setAttribute('aria-pressed',String(i===selected));b.classList.toggle('removed',removed.includes(i));
      if(locked&&!revealed)b.classList.toggle('locked',i===selected);
      if(revealed){b.classList.toggle('correct',i===question.correct);b.classList.toggle('wrong',i===selected&&i!==question.correct)}answers.appendChild(b);
    });updateLadder();
  }
  function select(index){if(locked||removed.includes(index))return;selected=index;[...answers.children].forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-pressed',String(i===index))});$('prompt').textContent=t('confirm',{letter:letters[index]});$('final-answer').disabled=false;sound('select')}
  function clearTimers(){if(resultTimer!==null){clearTimeout(resultTimer);resultTimer=null}if(revealTimer!==null){clearTimeout(revealTimer);revealTimer=null}}
  function finalAnswer(){
    if(selected===null||locked||removed.includes(selected))return;locked=true;$('final-answer').disabled=true;[...answers.children].forEach(b=>b.disabled=true);
    answers.children[selected].classList.add('locked');document.body.classList.add('suspense');sound('lock');
    revealTimer=setTimeout(reveal,1700);
  }
  function reveal(){
    revealTimer=null;document.body.classList.remove('suspense');revealed=true;
    const correct=selected===question.correct;[...answers.children].forEach(b=>b.classList.remove('locked'));
    answers.children[question.correct].classList.add('correct');if(!correct)answers.children[selected].classList.add('wrong');
    sound(correct?'right':'wrong');if(correct&&level>=5&&globalThis.CalculusFx)CalculusFx.confetti(level===bank.levels.length-1?220:40);
    resultTimer=setTimeout(()=>{resultTimer=null;showResult(correct)},correct?1100:1400);
  }
  function paintResult(){
    if(lastResult===null)return;const correct=lastResult,won=correct&&level===bank.levels.length-1;
    $('result-icon').textContent=correct?'✓':'×';$('result-icon').classList.toggle('wrong',!correct);$('result-kicker').textContent=t(won?'won':correct?'correct':'incorrect');
    $('result-title').textContent=correct?(won?t('winner'):t('secured',{prize:euro(bank.prizes[level])})):t('leave',{prize:euro(safeWinnings())});
    $('result-explanation').innerHTML=typeset(question.why,lang);$('replay-note').hidden=!won;$('continue').textContent=t(correct?(won?'replay':'next'):'retry');$('continue').onclick=correct&&level<bank.levels.length-1?nextQuestion:restart;
  }
  function showResult(correct){lastResult=correct;paintResult();if(correct&&level===bank.levels.length-1)sound('win');saveBest(correct?bank.prizes[level]:safeWinnings());result.showModal()}
  function safeWinnings(){let value=0;bank.checkpoints.forEach(i=>{if(level>i)value=bank.prizes[i]});return value}
  function nextQuestion(){result.close();level++;renderQuestion(pickQuestion())}
  function resetRun(){clearTimers();document.body.classList.remove('suspense');revealed=false;level=0;used={fifty:false,audience:false,swap:false};chosen=[];usedTopics=new Set();sourceQuestion=null;question=null;lastResult=null;selected=null;locked=false;removed=[];['fifty','audience','swap'].forEach(id=>$(id).disabled=false)}
  function restart(){result.close();resetRun();renderQuestion(pickQuestion())}
  function useFifty(){
    if(used.fifty||locked)return;used.fifty=true;$('fifty').disabled=true;removed=shuffle([0,1,2,3].filter(i=>i!==question.correct)).slice(0,2);
    if(removed.includes(selected))selected=null;paintQuestion();sound('lifeline');
  }
  function useAudience(){
    if(used.audience||locked)return;used.audience=true;$('audience').disabled=true;
    const confidence=Math.max(46,82-level*2),remaining=100-confidence,wrong=[0,1,2,3].filter(i=>i!==question.correct&&!removed.includes(i));
    const shares=[0,0,0,0];shares[question.correct]=confidence;let left=remaining;
    wrong.forEach((index,i)=>{shares[index]=i===wrong.length-1?left:Math.floor(Math.random()*(left+1));left-=shares[index]});
    $('audience-bars').innerHTML='';shares.forEach((pct,i)=>{const col=document.createElement('div');col.className='poll-column';col.innerHTML='<span>'+pct+'%</span><i style="height:'+pct+'%"></i><b>'+letters[i]+'</b>';$('audience-bars').appendChild(col)});$('audience-panel').hidden=false;sound('lifeline');
  }
  function useSwap(){if(used.swap||locked)return;used.swap=true;$('swap').disabled=true;renderQuestion(pickQuestion(sourceQuestion));sound('lifeline')}
  function storageKey(){return 'calculus-millionaire-best-'+bank.key}
  function saveBest(value){try{const old=Number(localStorage.getItem(storageKey())||0),best=Math.max(old,value);localStorage.setItem(storageKey(),best);$('best-score').textContent=euro(best)}catch(e){$('best-score').textContent=euro(value)}}
  function loadBest(){let best=0;try{best=Number(localStorage.getItem(storageKey())||0)}catch(e){}$('best-score').textContent=euro(best)}
  function paintSound(){$('sound').textContent=t(soundOn?'soundOn':'soundOff');$('sound').setAttribute('aria-pressed',String(soundOn));$('sound').setAttribute('aria-label',t(soundOn?'turnSoundOff':'turnSoundOn'))}
  function setLanguage(value){
    if(!['en','sv','el'].includes(value))return;lang=value;try{localStorage.setItem('calculus-millionaire-language',lang);localStorage.setItem('calculus-language',lang)}catch(e){}
    I18n.apply(lang);$('level-name').textContent=t(bank.key);paintSound();buildLadder();loadBest();paintQuestion();paintResult();
  }
  function chooseLevel(key){
    bank=Q[key];resetRun();$('level-name').textContent=t(bank.key);$('level-high-school').classList.toggle('active',key==='highSchool');$('level-university').classList.toggle('active',key==='university');game.hidden=true;intro.hidden=false;if(result.open)result.close();$('level-dialog').close();buildLadder();loadBest();
  }
  $('start').onclick=()=>{intro.hidden=true;game.hidden=false;renderQuestion(pickQuestion())};$('final-answer').onclick=finalAnswer;$('fifty').onclick=useFifty;$('audience').onclick=useAudience;$('swap').onclick=useSwap;
  $('sound').onclick=()=>{soundOn=!soundOn;paintSound()};$('language').onchange=e=>setLanguage(e.target.value);
  $('level-settings').onclick=()=>$('level-dialog').showModal();$('cancel-level').onclick=()=>$('level-dialog').close();$('level-high-school').onclick=()=>chooseLevel('highSchool');$('level-university').onclick=()=>chooseLevel('university');
  // Acknowledging the result is required to continue; Escape must not strand a locked game.
  result.addEventListener('cancel',event=>event.preventDefault());
  // Keyboard play: A-D (or 1-4) picks an answer, Enter locks it in.
  document.addEventListener('keydown',e=>{
    if(game.hidden||e.ctrlKey||e.metaKey||e.altKey||result.open||$('level-dialog').open)return;
    const tag=e.target&&e.target.tagName;if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA')return;
    const key=e.key.length===1?e.key.toUpperCase():'',index=key?('ABCD'.indexOf(key)>=0?'ABCD'.indexOf(key):'1234'.indexOf(key)):-1;
    if(index>=0){e.preventDefault();select(index);if(document.activeElement&&document.activeElement.blur)document.activeElement.blur()}
    else if(e.key==='Enter'&&selected!==null&&(tag!=='BUTTON'||e.target.classList.contains('answer'))){e.preventDefault();finalAnswer()}
  });
  setLanguage(lang);globalThis.CalculusMillionaireGame={restart,safeWinnings,setLanguage};
})();
