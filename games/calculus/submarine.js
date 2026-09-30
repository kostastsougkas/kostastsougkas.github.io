 'use strict';
(()=>{
const $=id=>document.getElementById(id),M=DeepMath,L=globalThis.SubmarineI18n,t=(key,values)=>L.t(key,values);
let index=0,mission,shots=[],phase='ready',won=false,firstShotWins=0,frame=0,timer=0,aim=null,level='high-school',missionSet=M.missionsFor(level);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let motion=!reduced.matches;
const GRID_LIMIT=8,STEP=22.5,px=x=>300+STEP*x,py=y=>240-STEP*y;
let audioContext;
function sound(name){const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;try{audioContext=audioContext||new AudioEngine();if(audioContext.state==='suspended')audioContext.resume();const sounds={aim:[[540,690,.08,.025,'sine',0]],launch:[[150,520,.45,.045,'sawtooth',0],[90,210,.5,.035,'sine',.04]],hit:[[170,65,.55,.09,'sawtooth',0],[420,880,.38,.05,'sine',.08],[660,990,.3,.035,'sine',.16]],miss:[[260,105,.5,.045,'triangle',0],[190,80,.42,.03,'sine',.12]]};const now=audioContext.currentTime;for(const [from,to,duration,volume,type,delay] of sounds[name]||[]){const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),start=now+delay,end=start+duration;oscillator.type=type;oscillator.frequency.setValueAtTime(from,start);oscillator.frequency.exponentialRampToValueAtTime(to,end);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,end);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(start);oscillator.stop(end+.02);}}catch{}}
reduced.addEventListener('change',e=>{motion=!e.matches});
function gridFromEvent(e){
 const svg=$('chart').querySelector('svg'),matrix=svg&&svg.getScreenCTM();if(!matrix)return null;
 const cursor=svg.createSVGPoint();cursor.x=e.clientX;cursor.y=e.clientY;
 const local=cursor.matrixTransform(matrix.inverse()),x=(local.x-300)/STEP,y=(240-local.y)/STEP;
 if(x < -GRID_LIMIT-.5 || x > GRID_LIMIT+.5 || y < -GRID_LIMIT-.5 || y > GRID_LIMIT+.5)return null;
 return {x:Math.max(-GRID_LIMIT,Math.min(GRID_LIMIT,Math.round(x))),y:Math.max(-GRID_LIMIT,Math.min(GRID_LIMIT,Math.round(y)))};
}
function setAim(next){aim=next;sound('aim');validate();$('feedback').textContent=t('aimSet',{x:aim.x,y:aim.y});}
$('chart').addEventListener('click',e=>{
 if(phase!=='ready')return;
 const cell=gridFromEvent(e);if(!cell)return;
 setAim(cell);
});
// Hover preview: a ghost crosshair shows which grid point a click will lock onto.
function showHover(cell){
 const pin=$('aim-hover');if(!pin)return;
 if(!cell||phase!=='ready'){pin.hidden=true;return}
 const p=point(cell.x,cell.y);pin.hidden=false;pin.style.left=p.x+'px';pin.style.top=p.y+'px';pin.dataset.label='('+cell.x+', '+cell.y+')';
}
$('chart').addEventListener('pointermove',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;showHover(phase==='ready'?gridFromEvent(e):null)});
$('chart').addEventListener('pointerleave',()=>showHover(null));
// Keyboard aiming: arrows move the crosshair, Enter or Space fires.
$('chart').addEventListener('keydown',e=>{
 if(phase!=='ready')return;
 const step={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];
 if(step){e.preventDefault();const from=aim||{x:0,y:0},clamp=v=>Math.max(-GRID_LIMIT,Math.min(GRID_LIMIT,v));setAim({x:clamp(from.x+step[0]*(e.shiftKey?2:1)),y:clamp(from.y+step[1]*(e.shiftKey?2:1))});}
 else if((e.key==='Enter'||e.key===' ')&&aim){e.preventDefault();launch();}
});
$('marine-life').innerHTML=Array.from({length:7},(_,i)=>`<img class="fish ${i%2?'reverse':''}" src="fish.png" alt="" style="--top:${12+i*10}%;--duration:${22+i*4}s;--delay:-${i*9+8}s;width:${45+(i%3)*17}px;opacity:${.35+(i%3)*.18}">`).join('');
$('bubbles').innerHTML=Array.from({length:26},(_,i)=>`<i class="bubble" style="--left:${(i*37)%100}%;--size:${3+i%6}px;--duration:${7+i%7}s;--delay:-${i*.9}s"></i>`).join('');
function point(x,y){const r=$('porthole'),w=r.clientWidth,h=r.clientHeight,narrow=window.innerWidth<=760,vw=narrow?450:600,left=narrow?75:0,s=Math.min(w/vw,h/480);return{x:(w-vw*s)/2+(px(x)-left)*s,y:(h-480*s)/2+py(y)*s};}
function positionSub(){if($('target-sub').hidden)return;const p=point(mission.clues[0].answer,mission.clues[1].answer);$('target-sub').style.left=p.x+'px';$('target-sub').style.top=p.y+'px';}
window.addEventListener('resize',()=>{chart();positionSub()});
function chart(){let svg='<svg viewBox="'+(window.innerWidth<=760?'75 0 450 480':'0 0 600 480')+'" role="img" aria-labelledby="grid-title"><title id="grid-title">'+t('gridTitle')+'</title><rect x="112" y="52" width="376" height="376" rx="9" fill="#021c2b" opacity=".34"/>';
for(let i=-GRID_LIMIT;i<=GRID_LIMIT;i++){svg+=`<path d="M ${px(i)} 60 V 420 M 120 ${py(i)} H 480" stroke="${i===0?'#c1fbe9':'#b2ebdf'}" stroke-opacity="${i===0?.8:.23}" stroke-width="${i===0?1.4:.6}"/>`;if(i!==0)svg+=`<text x="${px(i)}" y="${py(0)+16}" text-anchor="middle" fill="#e1fff7" font-size="12" paint-order="stroke" stroke="#083447" stroke-width="3">${i}</text><text x="${px(0)-8}" y="${py(i)+4}" text-anchor="end" fill="#e1fff7" font-size="12" paint-order="stroke" stroke="#083447" stroke-width="3">${i}</text>`;}
svg+='<text x="493" y="244" fill="#b1fce1" font-size="15">x</text><text x="296" y="45" fill="#b1fce1" font-size="15">y</text>';
for(const s of shots){if(!s.resolved)continue;svg+=s.hit?`<circle cx="${px(s.x)}" cy="${py(s.y)}" r="13" fill="none" stroke="#ffe1a0" stroke-width="2"/>`:`<path d="M ${px(s.x)-5} ${py(s.y)-5} l10 10 m-10 0 l10 -10" stroke="#ffb69c" stroke-width="2.5"/>`;}
if(phase==='ready'&&aim)svg+=`<circle class="aim-ping" cx="${px(aim.x)}" cy="${py(aim.y)}" r="10" fill="none" stroke="#ffda86" stroke-width="1.5"/><circle cx="${px(aim.x)}" cy="${py(aim.y)}" r="10" fill="#ffda8622" stroke="#ffda86" stroke-width="1.8"/><path d="M ${px(aim.x)-16} ${py(aim.y)} h32 M ${px(aim.x)} ${py(aim.y)-16} v32" stroke="#ffda86"/>`;
if(phase==='finished')svg+=`<circle cx="${px(mission.clues[0].answer)}" cy="${py(mission.clues[1].answer)}" r="19" fill="none" stroke="#83f3cf" stroke-width="2" stroke-dasharray="4 4"/>`;
$('chart').innerHTML=svg+'</svg>';
let summary=phase==='finished'?t('targetStatus',{x:mission.clues[0].answer,y:mission.clues[1].answer,state:won?t('sunk'):t('revealed')}):aim?'':t('clickGrid');
if(shots.some(s=>s.resolved))summary+=' · '+shots.filter(s=>s.resolved).map(s=>`(${s.x}, ${s.y}) ${s.hit?t('hit'):t('miss')}`).join(' / ');$('chart-description').textContent=summary;
}
function validate(){$('launch').disabled=phase!=='ready'||!aim;chart();return phase==='ready'&&!!aim;}
function loadMission(focus=false){cancelAnimationFrame(frame);clearTimeout(timer);$('result').close();phase='ready';shots=[];won=false;mission=M.mission(index,Math.random,level);$('target-sub').hidden=true;$('target-sub').classList.remove('sinking');$('effects').getContext('2d').clearRect(0,0,$('effects').width,$('effects').height);
$('mission-counter').textContent=t('missionCounter',{n:String(index+1).padStart(2,'0'),total:String(missionSet.length).padStart(2,'0')});$('mission-name').textContent=L.missionName(mission.name);$('zone').textContent=L.zone(mission.zone);$('depth').textContent=mission.depth;$('briefing').textContent=L.briefing(mission.message);$('progress').innerHTML=missionSet.map((m,i)=>`<li class="${i<index?'done':i===index?'current':''}" aria-label="${t('progressItem',{n:i+1,state:i<index?t('complete'):i===index?t('current'):t('upcoming')})}"></li>`).join('');
$('clues').innerHTML=mission.clues.map((c,i)=>`<article class="clue"><div class="clue-top"><span class="clue-axis">${t('coordinate',{axis:i?'Y':'X'})}</span></div><p>${L.prompt(c)}</p>${c.html}</article>`).join('');aim=null;$('shots').textContent=t('twoReady');$('ammo-icons').textContent='▰ ▰';$('launch').innerHTML=t('launch')+' <span>↗</span>';$('feedback').textContent=index===0?t('decode'):t('fresh');validate();if(focus)$('chart').focus({preventScroll:true});}
function animateShot(shot,done){
 const canvas=$('effects'),box=$('porthole'),w=box.clientWidth,h=box.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
 const dest=point(shot.x,shot.y),start={x:w*.5,y:h+20},t0=performance.now(),TRAVEL=1050,TOTAL=1700;
 const angle=Math.atan2(dest.y-start.y,dest.x-start.x),nx=-Math.sin(angle),ny=Math.cos(angle);
 const bubbles=[],sparks=[];let exploded=false,last=t0;
 function explode(){
  exploded=true;
  const count=shot.hit?46:14;
  for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=(shot.hit?60+Math.random()*190:30+Math.random()*80);sparks.push({x:dest.x,y:dest.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(shot.hit?0:40),life:1,decay:.9+Math.random()*.9,r:1.5+Math.random()*(shot.hit?3.2:2),hue:shot.hit?(30+Math.random()*30):(180+Math.random()*30)});}
  if(shot.hit&&box.animate){
   box.animate([{transform:'translate(0,0)'},{transform:'translate(-7px,4px)'},{transform:'translate(6px,-5px)'},{transform:'translate(-4px,-3px)'},{transform:'translate(3px,3px)'},{transform:'translate(0,0)'}],{duration:480,easing:'ease-out'});
  }
  const flash=$('flash');if(flash&&flash.animate)flash.animate([{opacity:shot.hit?.6:.2},{opacity:0}],{duration:shot.hit?650:420,easing:'ease-out'});
 }
 function tick(now){
  const elapsed=now-t0;
  if(elapsed>=TOTAL){ctx.clearRect(0,0,w,h);done();return}
  const dt=Math.min((now-last)/1000,.05);last=now;
  ctx.clearRect(0,0,w,h);
  if(elapsed<TRAVEL){
   const p=elapsed/TRAVEL,e=p*p*(3-2*p)*.4+p*.6,wobble=Math.sin(p*18)*(1-p)*7;
   const x=start.x+(dest.x-start.x)*e+nx*wobble,y=start.y+(dest.y-start.y)*e+ny*wobble;
   for(let i=0;i<2;i++)bubbles.push({x:x-Math.cos(angle)*14+(Math.random()-.5)*7,y:y-Math.sin(angle)*14+(Math.random()-.5)*7,r:1.2+Math.random()*2.6,life:1});
   // sonar ring shrinking onto the target
   ctx.strokeStyle='rgba(255,218,134,'+(.18+.25*p)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(dest.x,dest.y,26*(1-p)+10,0,Math.PI*2);ctx.stroke();
   for(const b of bubbles){ctx.fillStyle='rgba(215,255,248,'+Math.max(0,b.life*.55)+')';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();}
   ctx.save();ctx.translate(x,y);ctx.rotate(angle);
   const glow=ctx.createRadialGradient(-16,0,1,-16,0,22);glow.addColorStop(0,'rgba(255,220,150,.9)');glow.addColorStop(1,'rgba(255,180,90,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(-16,0,22,0,Math.PI*2);ctx.fill();
   const body=ctx.createLinearGradient(0,-5,0,5);body.addColorStop(0,'#f4fbff');body.addColorStop(.5,'#9fb6c2');body.addColorStop(1,'#4c6572');ctx.fillStyle=body;
   ctx.beginPath();ctx.moveTo(-14,-4.5);ctx.lineTo(9,-4.5);ctx.quadraticCurveTo(17,0,9,4.5);ctx.lineTo(-14,4.5);ctx.closePath();ctx.fill();
   ctx.fillStyle='#ff9d5c';ctx.fillRect(-14,-6,5,2.4);ctx.fillRect(-14,3.6,5,2.4);
   ctx.restore();
  }else{
   if(!exploded)explode();
   const impact=(elapsed-TRAVEL)/(TOTAL-TRAVEL);
   if(shot.hit&&impact<.5){const core=ctx.createRadialGradient(dest.x,dest.y,0,dest.x,dest.y,70*(.3+impact*2));core.addColorStop(0,'rgba(255,245,200,'+(.95*(1-impact*2))+')');core.addColorStop(.5,'rgba(255,170,70,'+(.6*(1-impact*2))+')');core.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=core;ctx.beginPath();ctx.arc(dest.x,dest.y,70*(.3+impact*2),0,Math.PI*2);ctx.fill();}
   for(let i=0;i<3;i++){ctx.strokeStyle=shot.hit?'rgba(255,219,139,'+Math.max(0,1-impact)+')':'rgba(160,234,246,'+Math.max(0,1-impact)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(dest.x,dest.y,3+impact*(30+i*15),0,Math.PI*2);ctx.stroke();}
   for(const s of sparks){s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=.96;s.vy=s.vy*.96+(shot.hit?30:90)*dt;s.life-=s.decay*dt;if(s.life<=0)continue;ctx.fillStyle='hsla('+s.hue+',100%,'+(shot.hit?65:80)+'%,'+s.life+')';ctx.beginPath();ctx.arc(s.x,s.y,s.r*s.life+.3,0,Math.PI*2);ctx.fill();}
  }
  for(const b of bubbles){b.life-=dt*1.4;b.y-=dt*14}
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
}
function launch(){if(phase!=='ready'||!validate())return;sound('launch');const shot={...aim,hit:aim.x===mission.clues[0].answer&&aim.y===mission.clues[1].answer,resolved:false};shots.push(shot);phase='firing';showHover(null);$('porthole').scrollIntoView({behavior:motion?'smooth':'instant',block:'center'});$('launch').textContent=t('torpedoAway');$('feedback').textContent=t('holding');$('shots').textContent=t('remaining',{n:2-shots.length});$('ammo-icons').textContent=shots.length===1?'▰ ▱':'▱ ▱';validate();animateShot(shot,()=>resolveShot(shot));}
function resolveShot(shot){shot.resolved=true;won=shot.hit;sound(won?'hit':'miss');if(won||shots.length===2){phase='finished';if(won&&shots.length===1)firstShotWins++;$('feedback').textContent=won?t('directHit'):t('targetEscaped');$('target-sub').hidden=false;positionSub();if(won&&motion)$('target-sub').classList.add('sinking');$('launch').textContent=won?t('neutralized'):t('missionEnded');validate();timer=setTimeout(showResult,won?1900:250);}else{phase='ready';aim=null;$('feedback').textContent=t('oneLeft');$('launch').innerHTML=t('launch')+' <span>↗</span>';validate();}}
function showResult(){if(phase!=='finished'||$('result').open)return;const final=won&&index===missionSet.length-1,total=missionSet.length;$('result-tag').textContent=final?t('operationComplete'):won?t('neutralizedUpper'):t('missionResult');$('result-title').textContent=final?t('allClear'):won?t('calculatedHit'):t('smallLeak');$('result-copy').textContent=final?t('finalCopy',{total,firstShotWins}):won?t('missionComplete',{n:index+1,next:index<total-1?t('nextIs',{name:L.missionName(missionSet[index+1].name)}):''}):t('twoMisses');$('success-art').hidden=!won;$('solutions').hidden=won;if(!won)$('solutions').innerHTML=mission.clues.map((c,i)=>`<h3>${t('coordinateAnswer',{axis:i?'Y':'X',answer:c.answer})}</h3><p>${L.solution(c)}</p>`).join('')+`<p>${t('targetCoordinates')} <strong>(${mission.clues[0].answer}, ${mission.clues[1].answer})</strong>.</p>`;$('continue').textContent=final?t('newExpedition'):won?t('nextMission'):index===0?t('retryPilot'):t('retryClues');$('result').showModal();}
function chooseLevel(next){$('level-dialog').close();if(next===level)return;level=next;missionSet=M.missionsFor(level);index=0;firstShotWins=0;$('level-name').textContent=level==='university'?t('university'):t('highSchool');$('level-high-school').setAttribute('aria-pressed',String(level==='high-school'));$('level-university').setAttribute('aria-pressed',String(level==='university'));loadMission(true);}
$('settings').onclick=()=>$('level-dialog').showModal();$('cancel-settings').onclick=()=>$('level-dialog').close();$('level-dialog').addEventListener('cancel',e=>{e.preventDefault();$('level-dialog').close()});$('level-high-school').onclick=()=>chooseLevel('high-school');$('level-university').onclick=()=>chooseLevel('university');
$('launch').addEventListener('click',launch);$('continue').onclick=()=>{if(phase!=='finished')return;if(won){index++;if(index===missionSet.length){index=0;firstShotWins=0;}}loadMission(true);};L.onChange(()=>{$('level-name').textContent=level==='university'?t('university'):t('highSchool');$('mission-counter').textContent=t('missionCounter',{n:String(index+1).padStart(2,'0'),total:String(missionSet.length).padStart(2,'0')});$('mission-name').textContent=L.missionName(mission.name);$('zone').textContent=L.zone(mission.zone);$('briefing').textContent=L.briefing(mission.message);$('clues').innerHTML=mission.clues.map((c,i)=>`<article class="clue"><div class="clue-top"><span class="clue-axis">${t('coordinate',{axis:i?'Y':'X'})}</span></div><p>${L.prompt(c)}</p>${c.html}</article>`).join('');$('progress').innerHTML=missionSet.map((m,i)=>`<li class="${i<index?'done':i===index?'current':''}" aria-label="${t('progressItem',{n:i+1,state:i<index?t('complete'):i===index?t('current'):t('upcoming')})}"></li>`).join('');$('shots').textContent=shots.length?t('remaining',{n:2-shots.length}):t('twoReady');$('launch').innerHTML=phase==='ready'?t('launch')+' <span>↗</span>':phase==='firing'?t('torpedoAway'):won?t('neutralized'):t('missionEnded');chart();$('feedback').textContent=phase==='ready'?(shots.length?t('oneLeft'):aim?t('aimSet',{x:aim.x,y:aim.y}):index===0?t('decode'):t('fresh')):phase==='firing'?t('holding'):won?t('directHit'):t('targetEscaped');if($('result').open){$('result').close();showResult()}});loadMission();
})();
