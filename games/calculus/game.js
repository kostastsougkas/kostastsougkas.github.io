'use strict';
const $=id=>document.getElementById(id);
const state={round:0,functions:[],derivatives:[],selected:null,matches:new Map(),mistakes:0,failed:false};
const rand=(a,b)=>a+Math.random()*(b-a), sign=()=>Math.random()<.5?-1:1;
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const clip=y=>Math.max(-4,Math.min(4,y));
function curveDistance(a,b,key){let sum=0;for(let i=0;i<=80;i++){const x=-4+i/10;sum+=(clip(a[key](x))-clip(b[key](x)))**2;}return Math.sqrt(sum/81);}
// Compare what students actually see after the curves are clipped by the plot.
function derivativeDistance(a,b){return curveDistance(a,b,'d')}
function functionDistance(a,b){return curveDistance(a,b,'f')}
function chebyshevT(degree,x){if(degree===0)return 1;if(degree===1)return x;let a=1,b=x;for(let n=2;n<=degree;n++){const next=2*x*b-a;a=b;b=next}return b}
function chebyshevU(degree,x){if(degree===0)return 1;if(degree===1)return 2*x;let a=1,b=2*x;for(let n=2;n<=degree;n++){const next=2*x*b-a;a=b;b=next}return b}
function featurePolynomial(type,degree,hint){
 // A scaled Chebyshev polynomial puts every stationary point at a strong,
 // alternating high/low value instead of letting the inner wiggles disappear.
 const center=rand(-.12,.12),width=rand(3.5,3.75),amplitude=sign()*rand(2.15,2.75),offset=rand(-.18,.18);
 const turningPoints=Array.from({length:degree-1},(_,i)=>center+width*Math.cos((i+1)*Math.PI/degree)).sort((a,b)=>a-b);
 return {type,turningPoints,f:x=>amplitude*chebyshevT(degree,(x-center)/width)+offset,d:x=>amplitude*degree/width*chebyshevU(degree-1,(x-center)/width),hint};
}
// Each factory creates fresh coefficients. There are deliberately many more
// families than cards, so reshuffling changes both the curves and their types.
const functionFactories=[
 ()=>{const a=sign()*rand(.45,.95),h=rand(-1.2,1.2),k=rand(-1,1);return {type:'quadratic',f:x=>a*(x-h)**2+k,d:x=>2*a*(x-h),hint:'A parabola has a straight-line derivative. Its turning point lines up with the derivative’s zero.'}},
 ()=>featurePolynomial('cubic',3,'A cubic has a parabolic derivative. Check where the cubic changes from increasing to decreasing.'),
 ()=>featurePolynomial('quartic',4,'A quartic has a cubic derivative. Its derivative crosses zero at every flat point.'),
 ()=>featurePolynomial('quintic',5,'This fifth-degree polynomial has four visible stationary points. Each one becomes a zero of its fourth-degree derivative.'),
 ()=>featurePolynomial('sextic',6,'This sixth-degree polynomial has five visible stationary points. Its derivative is a fifth-degree curve.'),
 ()=>{const m=sign()*rand(.45,1.25),k=rand(-1,1);return {type:'line',f:x=>m*x+k,d:()=>m,hint:'A straight line has a constant slope, so its derivative is horizontal.'}},
 ()=>{const a=sign()*rand(.8,1.5),p=rand(-1,1);return {type:'sine',f:x=>a*Math.sin(x+p),d:x=>a*Math.cos(x+p),hint:'At every peak and trough of the wave, its derivative crosses zero. Check the sign between them.'}},
 ()=>{const a=sign()*rand(.7,1.2),w=rand(1.6,1.9),p=rand(-1,1);return {type:'cosine',f:x=>a*Math.cos(w*x+p),d:x=>-a*w*Math.sin(w*x+p),hint:'The derivative has the same period as the function. Its zeros line up with the function’s peaks and troughs.'}},
 ()=>{const a=sign()*rand(.25,.55),r=rand(.48,.72),k=rand(-.8,.3);return {type:'growing-exponential',f:x=>a*Math.exp(r*x)+k,d:x=>a*r*Math.exp(r*x),hint:'This exponential and its derivative grow in magnitude toward the right and always have the same sign.'}},
 ()=>{const a=sign()*rand(.25,.55),r=rand(.48,.72),k=rand(-.3,.8);return {type:'decaying-exponential',f:x=>a*Math.exp(-r*x)+k,d:x=>-a*r*Math.exp(-r*x),hint:'This exponential changes most rapidly on the left. Its derivative has the opposite sign and fades toward zero on the right.'}},
 // Keep log and root boundaries just outside the display, so f and f' exist
 // at every visible x-value.
 ()=>{const a=sign()*rand(.9,1.5),s=rand(4.25,4.65);return {type:'logarithm',f:x=>a*(Math.log(x+s)-Math.log(s)),d:x=>a/(x+s),hint:'The logarithm is steepest on the left and flattens toward the right. Its derivative keeps one sign and approaches zero.'}},
 ()=>{const a=sign()*rand(1.5,2.2),s=rand(4.25,4.65);return {type:'square-root',f:x=>a*(Math.sqrt(x+s)-Math.sqrt(s)),d:x=>a/(2*Math.sqrt(x+s)),hint:'This square-root curve flattens toward the right. Compare slope sizes as well as their signs, especially near the left edge.'}},
 ()=>{const a=sign()*rand(1.2,1.9),r=rand(.8,1.3),h=rand(-.8,.8);return {type:'arctangent',f:x=>a*Math.atan(r*(x-h)),d:x=>a*r/(1+(r*(x-h))**2),hint:'This S-shaped curve is steepest near its middle. Its derivative is one central bump or dip and never changes sign.'}},
 ()=>{const a=sign()*rand(1.5,2.4),r=rand(.55,.9),h=rand(-.8,.8);return {type:'sigmoid',f:x=>a*Math.tanh(r*(x-h)),d:x=>a*r/(Math.cosh(r*(x-h))**2),hint:'This smooth S-curve levels off at both ends. Its derivative is largest in magnitude at the steep middle.'}},
 ()=>{const a=sign()*rand(1.6,2.5),r=rand(.22,.38),h=rand(-.8,.8),k=rand(-.5,.5);return {type:'bell',f:x=>a*Math.exp(-r*(x-h)**2)+k,d:x=>-2*r*a*(x-h)*Math.exp(-r*(x-h)**2),hint:'A bell curve rises, becomes flat at its top, then falls. Its derivative changes sign exactly at that top.'}},
 ()=>{const a=sign()*rand(.55,.95),w=rand(1.15,1.7),m=sign()*rand(.18,.38),p=rand(-1,1);return {type:'wave-with-trend',f:x=>a*Math.sin(w*x+p)+m*x,d:x=>a*w*Math.cos(w*x+p)+m,hint:'Separate the steady tilt from the wave. The derivative is an oscillation shifted above or below the x-axis.'}},
 ()=>{const a=sign()*rand(.13,.24),r=rand(.35,.55),b=sign()*rand(.07,.14),h=rand(-.7,.7),k=rand(-.5,.5);return {type:'exponential-plus-quadratic',f:x=>a*Math.exp(r*x)+b*(x-h)**2+k,d:x=>a*r*Math.exp(r*x)+2*b*(x-h),hint:'This curve combines exponential growth with a parabola. Its derivative combines an exponential with a straight line.'}},
 ()=>{const a=sign()*rand(.65,1.05),w=rand(1.1,1.55),b=sign()*rand(.055,.1),p=rand(-1,1);return {type:'wave-plus-cubic',f:x=>a*Math.sin(w*x+p)+b*x**3,d:x=>a*w*Math.cos(w*x+p)+3*b*x**2,hint:'This is a smooth sum of a wave and a cubic trend. Look for a wavy derivative riding on a parabola.'}},
 ()=>{const a=rand(.28,.48),r=rand(.38,.58),s=rand(.4,1.25),k=rand(-.4,.4),q=sign()*rand(.07,.14),c=sign()*rand(.012,.028);const left=x=>a*Math.exp(-r*(x-s))+k,leftD=x=>-r*a*Math.exp(-r*(x-s));return {type:'exponential-to-polynomial',join:s,f:x=>{if(x<=s)return left(x);const t=x-s;return a+k-r*a*t+q*t*t+c*t*t*t},d:x=>{if(x<=s)return leftD(x);const t=x-s;return-r*a+2*q*t+3*c*t*t},hint:'The left side is a decreasing exponential and the right side is a polynomial. They meet with exactly the same height and slope, so the derivative has no jump.'}},
 ()=>{const s=rand(-1.1,-.2),a=sign()*rand(.08,.16),m=sign()*rand(.35,.7),k=rand(-.5,.5),r=rand(.35,.6);const atJoin=a*s*s+m*s+k,slope=2*a*s+m;return {type:'polynomial-to-exponential',join:s,f:x=>x<=s?a*x*x+m*x+k:atJoin+(slope/r)*(Math.exp(r*(x-s))-1),d:x=>x<=s?2*a*x+m:slope*Math.exp(r*(x-s)),hint:'A polynomial hands off to an exponential without a corner. Match the derivative by following the slope through the join.'}},
 ()=>{const s=rand(-.2,.8),a=sign()*rand(1,1.6),l=rand(4.4,4.9),k=rand(-.5,.5),q=sign()*rand(.055,.11),c=sign()*rand(.008,.018),slope=a/(s+l);return {type:'logarithm-to-polynomial',join:s,f:x=>{if(x<=s)return a*Math.log((x+l)/(s+l))+k;const t=x-s;return k+slope*t+q*t*t+c*t*t*t},d:x=>{if(x<=s)return a/(x+l);const t=x-s;return slope+2*q*t+3*c*t*t},hint:'A logarithm becomes a polynomial. The two formulas share the same height and slope at the handoff, so there is no corner.'}},
 ()=>{const s=rand(-.8,.15),a=sign()*rand(.08,.15),m=sign()*rand(.35,.7),h=rand(-.5,.5),k=rand(-.4,.4),l=rand(2.2,3.8);const atJoin=a*(s-h)**2+m*s+k,slope=2*a*(s-h)+m;return {type:'polynomial-to-logarithm',join:s,f:x=>{if(x<=s)return a*(x-h)**2+m*x+k;const t=x-s;return atJoin+slope*l*Math.log(1+t/l)},d:x=>x<=s?2*a*(x-h)+m:slope/(1+(x-s)/l),hint:'A polynomial settles into a logarithm. Follow how its derivative changes from a line into a reciprocal curve without jumping.'}},
 ()=>{const s=rand(-.9,.1),a=sign()*rand(.65,1.05),w=rand(1.05,1.5),p=rand(-.6,.6),k=rand(-.35,.35),r=rand(.3,.5);const atJoin=a*Math.sin(p)+k,slope=a*w*Math.cos(p);return {type:'wave-to-exponential',join:s,f:x=>x<=s?a*Math.sin(w*(x-s)+p)+k:atJoin+(slope/r)*(Math.exp(r*(x-s))-1),d:x=>x<=s?a*w*Math.cos(w*(x-s)+p):slope*Math.exp(r*(x-s)),hint:'A wave turns into an exponential. At the handoff, both curves are moving in exactly the same direction at the same rate.'}},
 ()=>{const s=rand(.15,1),a=sign()*rand(.3,.55),r=rand(.35,.55),k=rand(-.35,.35),w=rand(1.05,1.45),b=sign()*rand(.25,.5);const atJoin=a+k,slope=a*r;return {type:'exponential-to-wave',join:s,f:x=>{if(x<=s)return a*Math.exp(r*(x-s))+k;const t=x-s;return atJoin+(slope/w)*Math.sin(w*t)+b*(1-Math.cos(w*t))},d:x=>{if(x<=s)return a*r*Math.exp(r*(x-s));const t=x-s;return slope*Math.cos(w*t)+b*w*Math.sin(w*t)},hint:'An exponential flows into a wave with no corner. Its derivative changes smoothly from exponential growth into an oscillation.'}},
 ()=>{const s=rand(-.1,.9),a=sign()*rand(1.3,2),l=rand(4.35,4.8),k=rand(-.4,.4),q=sign()*rand(.055,.11),c=sign()*rand(.008,.018),slope=a/(2*Math.sqrt(s+l));return {type:'root-to-polynomial',join:s,f:x=>{if(x<=s)return a*(Math.sqrt(x+l)-Math.sqrt(s+l))+k;const t=x-s;return k+slope*t+q*t*t+c*t*t*t},d:x=>{if(x<=s)return a/(2*Math.sqrt(x+l));const t=x-s;return slope+2*q*t+3*c*t*t},hint:'A square-root curve becomes a polynomial. Their derivatives meet at the join before the polynomial bends away.'}},
 ()=>{const s=rand(-.1,.8),a=sign()*rand(1.1,1.7),r=rand(.65,1.05),h=rand(-.7,.2),q=sign()*rand(.06,.12),c=sign()*rand(.009,.02);const atJoin=a*Math.atan(r*(s-h)),slope=a*r/(1+(r*(s-h))**2);return {type:'arctangent-to-polynomial',join:s,f:x=>{if(x<=s)return a*Math.atan(r*(x-h));const t=x-s;return atJoin+slope*t+q*t*t+c*t*t*t},d:x=>{if(x<=s)return a*r/(1+(r*(x-h))**2);const t=x-s;return slope+2*q*t+3*c*t*t},hint:'An arctangent S-curve hands off to a polynomial. The derivative stays connected while changing from a rounded bump into a parabola.'}}
];
const turningTypes=new Set(['cubic','quartic','quintic','sextic','bell']);
const waveTypes=new Set(['sine','cosine','wave-with-trend','wave-plus-cubic']);
const monotoneTypes=new Set(['line','growing-exponential','decaying-exponential','logarithm','square-root','arctangent','sigmoid']);
function candidateQuality(candidate){
 const values=[],derivatives=[];
 for(let i=0;i<=160;i++){const x=-4+i/20,y=candidate.f(x),dy=candidate.d(x);if(!Number.isFinite(y)||!Number.isFinite(dy))return false;values.push(y);derivatives.push(dy);}
 const visibleValues=values.map(clip),visibleDerivatives=derivatives.map(clip);
 const span=Math.max(...visibleValues)-Math.min(...visibleValues);
 const derivativeSpan=Math.max(...visibleDerivatives)-Math.min(...visibleDerivatives);
 const functionClipping=values.filter(y=>Math.abs(y)>4).length/values.length;
 if(span<1||functionClipping>.38)return false;
 if(candidate.type!=='line'&&derivativeSpan<.18)return false;
 if(candidate.turningPoints){
  for(const point of candidate.turningPoints){
   const y=candidate.f(point),left=candidate.f(point-.38),right=candidate.f(point+.38);
   if(Math.abs(y)>3.75||Math.max(Math.abs(y-left),Math.abs(y-right))<.055)return false;
  }
 }
 if(Number.isFinite(candidate.join)){
  const s=candidate.join,h=.42;
  if(s<-1.3||s>1.3||Math.abs(candidate.f(s))>3.4)return false;
  const leftCurvature=(candidate.d(s)-candidate.d(s-h))/h,rightCurvature=(candidate.d(s+h)-candidate.d(s))/h;
  const curvatureContrast=Math.abs(leftCurvature-rightCurvature);
  const visibleMotion=Math.abs(candidate.f(s-h)-candidate.f(s))+Math.abs(candidate.f(s+h)-candidate.f(s));
  if(curvatureContrast<.22||visibleMotion<.22)return false;
 }
 return true;
}
function addDistinct(chosen,candidates){
 for(const candidate of shuffle(candidates)){
  if(chosen.includes(candidate))continue;
  if(chosen.every(other=>derivativeDistance(candidate,other)>.3&&functionDistance(candidate,other)>.24)){chosen.push(candidate);return true;}
 }
 return false;
}
function makeFunctions(){
 // Every deal uses the same selection rules, regardless of round: one
 // multi-turn curve, one piecewise curve, one wave, one monotone curve, and
 // one wildcard. Families and coefficients remain random inside those slots.
 for(let attempt=0;attempt<30;attempt++){
  const pool=functionFactories.map(factory=>factory()).filter(candidateQuality),chosen=[];
  const groups=[
   pool.filter(candidate=>Number.isFinite(candidate.join)),
   pool.filter(candidate=>turningTypes.has(candidate.type)),
   pool.filter(candidate=>waveTypes.has(candidate.type)),
   pool.filter(candidate=>monotoneTypes.has(candidate.type))
  ];
  if(groups.every(group=>addDistinct(chosen,group))&&addDistinct(chosen,pool))return shuffle(chosen).map((f,i)=>({...f,id:i}));
 }
 throw new Error('Unable to create five clear and distinct graph pairs.');
}
function graph(fn,color,id){const size=200,p=18,span=164,at=v=>p+(v+4)/8*span,ay=v=>200-at(v);let lines='';for(let i=-4;i<=4;i++){lines+=`<path d="M ${at(i)} ${p} V ${200-p} M ${p} ${ay(i)} H ${200-p}" stroke="${i===0?'#acacba':'#e9e8ed'}" stroke-width="${i===0?1.2:.7}"/>`;}let d='';for(let n=0;n<=400;n++){const x=-4+n/50,y=fn(x);d+=`${n?'L':'M'}${at(x).toFixed(2)},${ay(y).toFixed(2)} `}return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><clipPath id="clip-${id}"><rect x="18" y="18" width="164" height="164"/></clipPath></defs>${lines}<text x="15" y="113">−4</text><text x="174" y="113">4</text><text x="105" y="23">4</text><text x="105" y="183">−4</text><text x="184" y="96">x</text><text x="105" y="11">y</text><path d="${d}" clip-path="url(#clip-${id})" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
const I18n=globalThis.SpeedDatingI18n, t=(key,values)=>I18n.t(key,values);
function render(){for(const [kind,items] of [['functions',state.functions],['derivatives',state.derivatives]]){$(kind).innerHTML=items.map((item,i)=>{const isF=kind==='functions',done=state.matches.has(item.id),selected=isF&&state.selected===item.id,label=isF?String.fromCharCode(65+i):String(i+1),partner=isF?state.derivatives.findIndex(d=>d.id===item.id)+1:String.fromCharCode(65+state.functions.findIndex(f=>f.id===item.id));return `<button class="graph-card ${done?'matched':''} ${selected?'selected':''}" data-kind="${kind}" data-id="${item.id}" ${done?'disabled':''} ${isF?`aria-pressed="${selected}"`:''} aria-label="${isF?t('function'):t('derivative')} ${label}${done?t('matchedWith',{partner}):''}"><span class="card-label"><span>${isF?t('function'):t('derivative')} ${label}</span><span class="pair-label">${done?'♥ '+partner:selected?t('selected'):''}</span></span>${graph(isF?item.f:item.d,isF?'#4a47ce':'#ce5282',kind+i)}</button>`}).join('');} $('completion-title').textContent=state.round===3?t('mastered'):t('perfect');$('completion-copy').textContent=state.round===3?t('allRounds'):state.round===1?t('roundTwoIntro'):t('roundThreeIntro');$('again').textContent=state.round===3?t('playAgain'):t('nextRound');if(state.matches.size===5&&!$('completion').open)$('completion').showModal();}
function mistakeLimit(){return state.round===1?Infinity:state.round===2?2:0;}
function updateBudget(){const limit=mistakeLimit();$('mistake-budget').textContent=limit===Infinity?t('unlimited'):limit===0?t('noMistakes'):t('mistakesRemaining',{count:Math.max(0,limit-state.mistakes)});}
function dealRound(){if($('completion').open)$('completion').close();state.failed=false;state.functions=makeFunctions();state.derivatives=shuffle(state.functions);state.selected=null;state.matches.clear();state.mistakes=0;$('round').textContent=t('round',{round:state.round,practice:state.round===1?t('practice'):''});$('status').textContent='';render();updateBudget();}
function newRound(){if(state.failed||state.round>=3||(state.round>0&&state.matches.size!==5))return;state.round++;dealRound();}
const matchmakingJokes=[
 t('joke1'),
 t('joke2'),
 t('joke3'),
 t('joke4')
];
function failedRound(){state.failed=true;$('loss-copy').textContent=t(matchmakingJokes[Math.floor(Math.random()*matchmakingJokes.length)]);$('retry-copy').textContent=t('retryCopy',{round:state.round});$('loss-dialog').showModal();}
function retryRound(){if(!state.failed)return;$('loss-dialog').close();dealRound();$('new-round').focus();}
function advance(){if(state.failed||state.matches.size!==5)return;$('completion').close();if(state.round===3){state.round=0;}newRound();window.scrollTo(0,0);}
function start(){if(!state.round)newRound();window.scrollTo(0,0);}
function choose(kind,id){if(state.failed||state.matches.has(id))return;if(kind==='functions'){state.selected=id;render();$('status').textContent=t('chooseDerivative',{letter:String.fromCharCode(65+id)});}else{if(state.selected===null){$('status').textContent=t('pickFunction');return;}if(id===state.selected){state.matches.set(id,true);state.selected=null;render();$('status').textContent=state.matches.size===5?t('allMatched'):t('aMatch');}else{state.mistakes++;updateBudget();if(state.mistakes>mistakeLimit()){failedRound();return;}$('status').textContent=t('wrongMatch');const btn=document.querySelector(`[data-kind="derivatives"][data-id="${id}"]`);btn.classList.remove('wrong');void btn.offsetWidth;btn.classList.add('wrong');}}}
$('new-round').onclick=()=>{if(!state.failed)dealRound()};$('again').onclick=advance;$('retry').onclick=retryRound;$('loss-dialog').addEventListener('cancel',e=>e.preventDefault());$('completion').addEventListener('cancel',e=>e.preventDefault());document.querySelectorAll('.graph-grid').forEach(el=>el.onclick=e=>{const b=e.target.closest('button[data-id]');if(b)choose(b.dataset.kind,Number(b.dataset.id));});
I18n.onChange(()=>{render();updateBudget();$('round').textContent=t('round',{round:state.round,practice:state.round===1?t('practice'):''});$('status').textContent=state.selected!==null?t('chooseDerivative',{letter:String.fromCharCode(65+state.selected)}):state.matches.size===5?t('allMatched'):state.matches.size?t('aMatch'):'';if(state.failed){$('loss-copy').textContent=t('joke1');$('retry-copy').textContent=t('retryCopy',{round:state.round})}});
start();
if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'start_function_game',description:'Open Function Speed-Dating and prepare a round.',inputSchema:{type:'object',properties:{},additionalProperties:false},execute:()=>{start();return {round:state.round,matched:state.matches.size}}});}catch(e){console.warn('Optional browser integration unavailable.',e);}}
