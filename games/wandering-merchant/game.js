import * as THREE from './vendor/three.module.js';
import {createCaravan} from './caravan.js';
import {buildDesert,castleMaterials,buildCastle,updateCastleMaterials,createBeam,glowSprite,glowTexture,MOODS,env} from './desert-art.js';
import {generateCities,routeDistance,solve} from './puzzle.js';
import {createSound} from './audio.js';

const $=id=>document.getElementById(id);
const names=['Start','Saffron','Sunwatch','Goldwell','Mirage','Dunestead','Qasr Bay','High Mesa','Copperwell','Sandstone','Windspire','Sunmarket','Dawnspire','Silkhaven'];
const KM=12,EMBER='#ff5a36',MINT='#2ee6c8';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sound=createSound();

let cities=[],route=[0],answer=null,phase='planning',labels=[],towns=[],showOptimal=true,toastTimer,hover=-1;
let travel={elapsed:0,total:0,distance:0,cum:[],arrived:0};
let segs=[],gw=800,gh=600,moodKey='';

// ------------------------------------------------------------ renderer ----
const scene=new THREE.Scene();scene.background=new THREE.Color('#e8ab79');scene.fog=new THREE.FogExp2('#e8ab79',.009);
const camera=new THREE.OrthographicCamera(-20,20,15,-15,.1,180);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;$('world').appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight('#ffd4a8','#9a6a46',1.2);scene.add(hemi);
const sun=new THREE.DirectionalLight('#ff9c55',4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,far:120});sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;sun.shadow.radius=3;scene.add(sun);
const settlements=new THREE.Group(),paths=new THREE.Group(),fx=new THREE.Group();scene.add(settlements,paths,fx);

const desert=buildDesert(scene),castleMats=castleMaterials({map:desert.sandMap});
const caravan=createCaravan(scene);

// ---------------------------------------------------------------- moods ----
const cur={bg:new THREE.Color(),sun:new THREE.Color(),sky:new THREE.Color(),ground:new THREE.Color(),sand:new THREE.Color(),sunPos:new THREE.Vector3(),sunI:1,hemiI:1,exposure:1,night:0,cloud:0};
let goal=null;
function setMood(key,instant=false){
 const m=MOODS[key];moodKey=key;
 goal={bg:new THREE.Color(m.bg),sun:new THREE.Color(m.sun),sky:new THREE.Color(m.sky),ground:new THREE.Color(m.ground),sand:new THREE.Color(m.sand),sunPos:new THREE.Vector3(...m.sunPos),sunI:m.sunI,hemiI:m.hemiI,exposure:m.exposure,night:m.night,cloud:m.cloud};
 $('mood-name').textContent=m.name;$('mood-dot').style.background=m.sun;$('mood-dot').style.boxShadow=`0 0 12px ${m.sun}`;
 document.documentElement.style.setProperty('--vig',m.vig);
 if(instant)stepMood(1,1);
}
function stepMood(dt,force){
 const k=force?1:1-Math.exp(-dt*2.4);
 for(const key of ['bg','sun','sky','ground','sand','sunPos'])cur[key].lerp(goal[key],k);
 for(const key of ['sunI','hemiI','exposure','night','cloud'])cur[key]+=(goal[key]-cur[key])*k;
 scene.background.copy(cur.bg);scene.fog.color.copy(cur.bg);sun.color.copy(cur.sun);sun.intensity=cur.sunI;sun.position.copy(cur.sunPos);
 hemi.color.copy(cur.sky);hemi.groundColor.copy(cur.ground);hemi.intensity=cur.hemiI;desert.material.color.copy(cur.sand);
 renderer.toneMappingExposure=cur.exposure;env.night=cur.night;env.cloud=cur.cloud;updateCastleMaterials(castleMats,cur.night);
}
function nextMood(){const keys=Object.keys(MOODS).filter(k=>k!==moodKey);setMood(keys[Math.floor(Math.random()*keys.length)]);}
$('mood').style.cursor='pointer';$('mood').title='Click to change the time of day';
$('mood').onclick=()=>{const keys=Object.keys(MOODS),i=keys.indexOf(moodKey);setMood(keys[(i+1)%keys.length]);};

// ------------------------------------------------------------- helpers ----
function mesh(geo,material,parent,x=0,y=0,z=0){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function disposeGroup(group){
 while(group.children.length){const o=group.children.pop();o.parent=null;o.traverse(c=>{if(c.userData.ownGeometry)c.geometry.dispose();if(c.userData.ownMaterial)c.material.dispose();});}
}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400);}
const ringIdle=new THREE.MeshBasicMaterial({color:'#fff1d0',transparent:true,opacity:.4,depthWrite:false,toneMapped:false}),ringSel=new THREE.MeshBasicMaterial({color:'#ffd27a',transparent:true,opacity:1,depthWrite:false,toneMapped:false}),ringHome=new THREE.MeshBasicMaterial({color:'#ffb347',transparent:true,opacity:.9,depthWrite:false,toneMapped:false});
const ringGeo=new THREE.RingGeometry(.96,1.06,72);

// pulse rings (selection / arrival)
const pulses=Array.from({length:5},()=>{const m=new THREE.MeshBasicMaterial({color:'#ffe4a0',transparent:true,opacity:0,depthWrite:false,toneMapped:false}),r=new THREE.Mesh(new THREE.RingGeometry(.9,1,64),m);r.rotation.x=-Math.PI/2;r.visible=false;r.renderOrder=8;fx.add(r);return {r,m,start:-99,life:.8};});
let pulseIndex=0;
function pulse(id,color='#ffe4a0',life=.8){if(reduced)return;const p=pulses[pulseIndex++%pulses.length];p.start=performance.now()/1000;p.life=life;p.m.color.set(color);p.r.position.set(cities[id].x,.7,cities[id].z);p.r.visible=true;}

// celebratory particles
let burst=null;
function celebrate(x,z){
 if(reduced)return;const n=140,pos=new Float32Array(n*3),col=new Float32Array(n*3),vel=[];const a=new THREE.Color('#ffd76a'),b=new THREE.Color('#5dffe0'),c=new THREE.Color('#ffffff');
 for(let i=0;i<n;i++){pos.set([x,1.2,z],i*3);const ang=Math.random()*6.283,sp=1.5+Math.random()*4.5;vel.push([Math.cos(ang)*sp,3+Math.random()*4.5,Math.sin(ang)*sp]);const cc=[a,b,c][i%3];col.set([cc.r,cc.g,cc.b],i*3);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 const m=new THREE.PointsMaterial({size:11,sizeAttenuation:false,map:glowTexture(),vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
 if(burst){fx.remove(burst.pts);burst.pts.geometry.dispose();burst.pts.material.dispose();}
 const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=9;fx.add(pts);burst={pts,vel,age:0};
}

// -------------------------------------------------------------- islands ----
function newIsland(){
 caravan.reset();travel={elapsed:0,total:0,distance:0,cum:[],arrived:0};phase='planning';route=[0];answer=null;showOptimal=true;hover=-1;
 $('result').hidden=true;$('planning').hidden=false;$('optimal-legend').hidden=true;
 disposeGroup(settlements);disposeGroup(paths);segs=[];$('labels').replaceChildren();labels=[];towns=[];
 const n=Number(document.querySelector('#difficulty [aria-checked=true]').dataset.n);cities=generateCities(n);
 cities.forEach((c,i)=>{
  const g=new THREE.Group();g.position.set(c.x,.58,c.z);settlements.add(g);towns.push(g);buildCastle(g,i,castleMats);
  g.userData.flag.userData.ownGeometry=true;
  const ring=new THREE.Mesh(ringGeo,ringIdle);ring.rotation.x=-Math.PI/2;ring.position.y=.09;ring.renderOrder=2;g.add(ring);g.userData.ring=ring;
  const beam=createBeam(i===0?'#ffc45c':'#ffd88a');beam.userData.ownGeometry=beam.userData.ownMaterial=true;g.add(beam);g.userData.beam=beam;g.userData.beamK=0;
  const glow=glowSprite('#ffb84d',3.6,0);glow.position.y=1.1;glow.userData.ownMaterial=true;g.add(glow);g.userData.glow=glow;g.userData.lift=0;
  const label=document.createElement('button');label.className='town-label'+(i===0?' start':'');
  label.innerHTML=`<b>${i===0?'⌂':i}</b><span class="town-name">${names[i]}</span><i class="order"></i>`;
  label.setAttribute('aria-label',`${i===0?'Starting town':`Town ${i}`}: ${names[i]}`);
  label.onclick=()=>select(i);label.onmouseenter=()=>{hover=i;};label.onmouseleave=()=>{if(hover===i)hover=-1;};
  $('labels').appendChild(label);labels.push(label);
 });
 $('instruction').textContent=`Start at ⌂ and visit all ${n-1} other towns exactly once, travelling as few kilometres as you can. Click the towns in order — you don’t need to return home.`;
 update();
}

// --------------------------------------------------------------- routes ----
const ribbonVS='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const ribbonFS=`uniform float uTime,uLen,uProgress,uDone,uPending;uniform vec3 uColor;varying vec2 vUv;
void main(){
 float t=vUv.x/uLen;if(t>uProgress)discard;
 float av=abs(vUv.y),body=smoothstep(1.,.8,av),core=smoothstep(.66,.34,av);
 float ph=fract(vUv.x*.85-uTime*.75+av*.55),chev=smoothstep(0.,.1,ph)*smoothstep(.44,.3,ph);
 vec3 col=mix(uColor*.4,uColor,core);col=mix(col,vec3(1.),chev*core*.4);
 float ends=smoothstep(0.,.015,t)*smoothstep(1.,.985,t),live=mix(uPending,1.,step(t,uDone));
 gl_FragColor=vec4(col,body*ends*live);
 #include <colorspace_fragment>
}`;
const ribbonTime={value:0};
function ribbon(a,b,color,order,y){
 const N=44,len=Math.hypot(b.x-a.x,b.z-a.z),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len,w=.17,pos=[],uv=[],idx=[];
 for(let s=0;s<=N;s++){const t=s/N,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,yy=y+Math.sin(t*Math.PI)*.22;
  pos.push(x-dz*w,yy,z+dx*w,x+dz*w,yy,z-dx*w);uv.push(t*len,-1,t*len,1);if(s<N){const v=s*2;idx.push(v,v+1,v+2,v+1,v+3,v+2);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);
 const m=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,side:THREE.DoubleSide,vertexShader:ribbonVS,fragmentShader:ribbonFS,
  uniforms:{uTime:ribbonTime,uLen:{value:len},uProgress:{value:1},uDone:{value:1},uPending:{value:1},uColor:{value:new THREE.Color(color)}}});
 const o=new THREE.Mesh(g,m);o.renderOrder=order;o.frustumCulled=false;o.userData.ownGeometry=o.userData.ownMaterial=true;paths.add(o);
 return {mat:m,len};
}
function drawRoute(ids,color,order,y){return ids.slice(1).map((id,i)=>ribbon(cities[ids[i]],cities[id],color,order,y));}
function rebuildPaths(){
 disposeGroup(paths);segs=drawRoute(route,EMBER,11,.74);
 if(answer&&phase==='results'&&showOptimal)drawRoute(answer.route,MINT,12,.9);
}

// ------------------------------------------------------------------- UI ----
function updateStats(){
 const n=cities.length,visited=phase==='travel'?travel.arrived:route.length-1;
 $('stops').innerHTML=`${visited} <small>/ ${n-1}</small>`;$('meter').style.width=`${visited/(n-1)*100}%`;
 $('distance').innerHTML=`${Math.round(routeDistance(cities,route)*KM)} <small>km</small>`;
}
function update(){
 const n=cities.length;updateStats();
 $('status').textContent=phase==='planning'?'PLANNING':phase==='travel'?'ON THE ROAD':'COMPLETE';
 const ready=phase==='planning'&&route.length===n;
 $('submit').disabled=!ready;$('submit').classList.toggle('ready',ready);
 $('submit').innerHTML=phase==='travel'?'Journey in progress…':phase==='results'?'Journey complete ✓':ready?'Begin the journey <span>→</span>':`Choose ${n-route.length} more town${n-route.length===1?'':'s'} <span>→</span>`;
 $('undo').disabled=route.length<2||phase!=='planning';$('clear').disabled=route.length<2||phase!=='planning';
 $('undo').hidden=$('clear').hidden=phase==='travel';
 $('itinerary').replaceChildren();
 const order=[...route,...cities.map((_,i)=>i).filter(i=>!route.includes(i))];
 for(const id of order){
  const b=document.createElement('button'),chosen=route.includes(id),canUndo=route.length>1&&id===route.at(-1);
  b.className=`stop${chosen?' selected':''}${id===0?' home':''}`;b.textContent=id===0?'⌂':id;
  b.title=`${names[id]}${chosen?` · Stop ${route.indexOf(id)}`:''}${canUndo?' · Click to undo':''}`;b.setAttribute('aria-label',b.title);
  b.disabled=phase!=='planning'||(chosen&&!canUndo);b.onclick=()=>select(id);$('itinerary').appendChild(b);
 }
 labels.forEach((l,i)=>{const chosen=route.includes(i);l.classList.toggle('selected',chosen);l.setAttribute('aria-pressed',String(chosen));l.querySelector('.order').textContent=route.indexOf(i);});
 towns.forEach((t,i)=>{t.userData.ring.material=i===0?ringHome:route.includes(i)?ringSel:ringIdle;});
 rebuildPaths();
}

function select(id){
 if(phase!=='planning')return;
 sound.wake();
 if(route.length>1&&id===route.at(-1)){route.pop();sound.undo();update();return;}
 if(route.includes(id)){toast(id===0?'Your journey starts here.':`${names[id]} is already on your route.`);return;}
 route.push(id);sound.pluck(route.length-1);update();
 pulse(id);towns[id].userData.selectedAt=performance.now()/1000;
 const seg=segs.at(-1);if(seg&&!reduced){seg.drawStart=performance.now()/1000;seg.mat.uniforms.uProgress.value=0;}
}

// --------------------------------------------------------------- journey ----
function depart(){
 if(phase!=='planning'||route.length!==cities.length)return;
 answer=solve(cities);phase='travel';caravan.reset();sound.depart();
 const total=routeDistance(cities,route);
 travel={elapsed:0,total,distance:0,cum:[0],arrived:0};
 for(let i=1;i<route.length;i++)travel.cum.push(travel.cum[i-1]+Math.hypot(cities[route[i]].x-cities[route[i-1]].x,cities[route[i]].z-cities[route[i-1]].z));
 $('instruction').textContent='Your merchant is on the road. Let’s see how far a little planning takes you.';
 update();
}
function bestKey(){return `merchant-best-${cities.length}`;}
function finish(){
 phase='results';
 const yours=routeDistance(cities,route),score=Math.min(100,answer.length/yours*100),perfect=Math.abs(yours-answer.length)<=1e-7*Math.max(1,answer.length),
  shown=!perfect&&score>=99.95?99.9:score,extra=Math.max(0,Math.round((yours-answer.length)*KM));
 sound.finish(perfect);
 if(perfect){const t=cities[route.at(-1)];celebrate(t.x,t.z);}
 let best=0,record=false;try{best=Number(localStorage.getItem(bestKey()))||0;if(shown>best+1e-9){localStorage.setItem(bestKey(),String(shown));record=best>0;best=shown;}}catch{}
 const head=perfect?'Congratulations!':score>=95?'So close!':score>=80?'A good start!':'Try a shorter route!';
 $('planning').hidden=true;$('result').hidden=false;$('result').classList.toggle('perfect',perfect);
 $('result').innerHTML=`<div class="eyebrow">${perfect?'THE PERFECT JOURNEY':'JOURNEY COMPLETE'}</div>
  <div class="result-head"><div class="ring"><svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="42"/><circle class="fill" cx="50" cy="50" r="42"/></svg><b><span>${shown.toFixed(1)}%<small>EFFICIENT</small></span></b></div><h2>${head}</h2></div>
  <p class="result-note">${perfect?'You found a shortest route. Beautifully planned.':'There’s a shorter way. Compare the two routes and try again.'}</p>
  <div class="result-grid"><div><span>YOURS</span><b>${Math.round(yours*KM)} <small>km</small></b></div><div><span>SHORTEST</span><b>${Math.round(answer.length*KM)} <small>km</small></b></div><div><span>EXTRA</span><b>${extra===0&&!perfect?'&lt;1':extra} <small>km</small></b></div></div>
  ${best?`<p class="best">${record?'★ New personal best! ':'Best on this size: '}${best.toFixed(1)}%</p>`:''}
  <div class="result-actions"><button id="retry" class="primary">Try again ↻</button><button id="compare">Hide shortest route</button></div>`;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const f=$('result').querySelector('.fill');if(f)f.style.strokeDashoffset=String(264*(1-shown/100));}));
 $('compare').onclick=()=>{showOptimal=!showOptimal;$('compare').textContent=showOptimal?'Hide shortest route':'Show shortest route';$('optimal-legend').hidden=!showOptimal;rebuildPaths();};
 $('retry').onclick=()=>{newIsland();nextMood();};
 $('optimal-legend').hidden=false;$('instruction').textContent='Your journey is complete. Compare the ember route with the turquoise shortest path.';update();
}

// ----------------------------------------------------------- controls ----
const camTarget=new THREE.Vector3();
function resize(){
 gw=$('game').clientWidth;gh=$('game').clientHeight;renderer.setSize(gw,gh);
 const g=$('game').getBoundingClientRect(),hd=$('top').getBoundingClientRect(),p=$('panel').getBoundingClientRect(),d=$('expedition-dock').firstElementChild.getBoundingClientRect(),d2=$('expedition-dock').lastElementChild.getBoundingClientRect(),mobile=gw<=720;
 const dockTop=Math.min(d.height?d.top:1e9,d2.top)-g.top;
 let left=16,right=gw-16,top=hd.bottom-g.top+30,bottom=dockTop-10;
 if(mobile){bottom=Math.min(bottom,p.top-g.top-6);top=hd.bottom-g.top+34;}else left=p.right-g.left+18;
 const aw=Math.max(200,right-left),ah=Math.max(160,bottom-top),scale=Math.min(aw/31.5,ah/19.5),cx=(left+right)/2,cy=(top+bottom)/2+(mobile?8:14);
 camera.left=-gw/(2*scale);camera.right=gw/(2*scale);camera.top=gh/(2*scale);camera.bottom=-gh/(2*scale);
 camera.position.set(0,36,22);camera.lookAt(0,0,0);camera.setViewOffset(gw,gh,gw/2-cx,gh/2-cy,gw,gh);camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);
new ResizeObserver(resize).observe($('panel'));
$('undo').onclick=()=>{if(phase==='planning'&&route.length>1){route.pop();sound.undo();update();}};
$('clear').onclick=()=>{if(phase==='planning'){route=[0];sound.undo();update();}};
$('submit').onclick=depart;$('new').onclick=()=>{newIsland();nextMood();};
$('difficulty').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.getAttribute('aria-checked')==='true')return;for(const o of $('difficulty').children)o.setAttribute('aria-checked',String(o===b));newIsland();nextMood();});
$('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=()=>$('help-dialog').close();
$('sound').onclick=()=>{sound.enabled=!sound.enabled;$('sound').setAttribute('aria-pressed',String(sound.enabled));$('sound').setAttribute('aria-label',sound.enabled?'Sound on':'Sound off');toast(sound.enabled?'Sound on':'Sound off');if(sound.enabled)sound.pluck(2);};
window.addEventListener('pointerdown',()=>sound.wake(),{once:true});

let keyBuffer='',keyTimer;
function commitKey(){clearTimeout(keyTimer);const v=Number(keyBuffer);keyBuffer='';if(v>=1&&v<cities.length)select(v);}
window.addEventListener('keydown',e=>{
 if($('help-dialog').open||['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key==='Backspace'){e.preventDefault();$('undo').click();}
 else if(e.key==='Enter'){if(document.activeElement?.tagName!=='BUTTON')depart();}
 else if(/^[0-9]$/.test(e.key)&&phase==='planning'){
  keyBuffer+=e.key;clearTimeout(keyTimer);
  if(keyBuffer.length>=2||Number(keyBuffer)*10>=cities.length)commitKey();else keyTimer=setTimeout(commitKey,650);
 }
});

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function pickTown(event){
 const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(settlements.children,true)[0];if(!hit)return -1;
 let o=hit.object;while(o.parent&&o.parent!==settlements)o=o.parent;return towns.indexOf(o);
}
renderer.domElement.addEventListener('pointerdown',e=>{if(phase!=='planning')return;const id=pickTown(e);if(id>=0)select(id);});
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;hover=phase==='planning'?pickTown(e):-1;renderer.domElement.style.cursor=hover>=0?'pointer':'';});
renderer.domElement.addEventListener('pointerleave',()=>{hover=-1;});

// ------------------------------------------------------------ main loop ----
const projection=new THREE.Vector3();let last=0;
// Steady start, then the caravan speeds up twice so long routes don't drag (14 s of 'walking' is covered in ~6.4 s).
const walked=e=>Math.min(e,2.5)+Math.max(0,Math.min(e-2.5,2))*2+Math.max(0,e-4.5)*4;
function animate(time){
 requestAnimationFrame(animate);
 const rawDt=Math.min((time-last)/1000,.25),dt=Math.min(rawDt,.05);last=time;const t=time*.001;
 stepMood(rawDt);desert.update(t,reduced);ribbonTime.value=reduced?0:t;

 // towns: flags, hover lift, beams, glow
 for(let i=0;i<towns.length;i++){
  const tw=towns[i],u=tw.userData,chosen=route.includes(i),flag=u.flag;
  if(!reduced){const pos=flag.geometry.attributes.position;for(let v=0;v<pos.count;v++){const x=pos.getX(v);pos.setZ(v,Math.sin(x*14+t*3.2)*.035*(x/.34));}pos.needsUpdate=true;}
  const age=t-(u.selectedAt??-99);flag.position.y=u.flagBase+(age>=0&&age<.7&&!reduced?Math.sin(age/.7*Math.PI)*.18:0);
  u.lift+=((hover===i?1:0)-u.lift)*Math.min(1,dt*10);tw.scale.setScalar(1+u.lift*.06);
  u.beamK+=(((chosen||i===0)?1:0)-u.beamK)*Math.min(1,dt*6);
  u.beam.visible=u.beamK>.01;u.beam.scale.set(1,u.beamK*(i===0?.75:1),1);u.beam.position.y=1.75*u.beamK*(i===0?.75:1)-.05;u.beam.material.opacity=(chosen&&i>0?.5:.42)*(.85+.15*Math.sin(t*2+i));
  u.glow.material.opacity=.06+env.night*.8*(1+.08*Math.sin(t*3+i))+(chosen?.12:0)+u.lift*.15;
  if(labels[i])labels[i].classList.toggle('hover',hover===i);
 }

 // pulses and confetti
 const now=performance.now()/1000;
 for(const p of pulses){if(!p.r.visible)continue;const k=(now-p.start)/p.life;if(k>=1){p.r.visible=false;continue;}p.r.scale.setScalar(.8+k*1.4);p.m.opacity=(1-k)**1.5*.9;}
 if(burst){burst.age+=dt;const pos=burst.pts.geometry.attributes.position;for(let i=0;i<burst.vel.length;i++){const v=burst.vel[i];v[1]-=9*dt;pos.setXYZ(i,pos.getX(i)+v[0]*dt,Math.max(.6,pos.getY(i)+v[1]*dt),pos.getZ(i)+v[2]*dt);}pos.needsUpdate=true;burst.pts.material.opacity=Math.max(0,1-burst.age/2.6);if(burst.age>2.6){fx.remove(burst.pts);burst.pts.geometry.dispose();burst.pts.material.dispose();burst=null;}}

 // route draw-in
 for(const s of segs){if(s.drawStart!==undefined){const k=Math.min(1,(now-s.drawStart)/.5);s.mat.uniforms.uProgress.value=1-(1-k)**3;if(k>=1)delete s.drawStart;}}

 // journey
 if(phase==='travel'){
  travel.elapsed+=rawDt;const progress=Math.min(1,walked(travel.elapsed)/14);travel.distance=travel.total*progress;
  while(travel.arrived<route.length-1&&travel.distance>=travel.cum[travel.arrived+1]-1e-6){travel.arrived++;const id=route[travel.arrived];pulse(id,'#7ff0da',1);sound.arrive(travel.arrived);towns[id].userData.selectedAt=now;updateStats();}
  segs.forEach((s,i)=>{s.mat.uniforms.uDone.value=THREE.MathUtils.clamp((travel.distance-travel.cum[i])/s.len,0,1);s.mat.uniforms.uPending.value=.42;});
  if(progress>=1&&travel.arrived>=route.length-1){segs.forEach(s=>{s.mat.uniforms.uDone.value=1;s.mat.uniforms.uPending.value=1;});finish();}
 }
 caravan.update(cities,phase==='planning'?[0]:route,phase==='planning'?0:travel.distance,t,dt,phase==='travel',reduced);

 // labels follow their towns
 for(let i=0;i<labels.length;i++){
  projection.set(cities[i].x,2.5,cities[i].z).project(camera);
  labels[i].style.transform=`translate(${((projection.x*.5+.5)*gw).toFixed(1)}px,${((-projection.y*.5+.5)*gh).toFixed(1)}px) translate(-50%,-100%)`;
  labels[i].style.zIndex=String(Math.round(100-projection.z*50)+(hover===i?200:0));
 }
 renderer.render(scene,camera);
}
setMood(Object.keys(MOODS)[Math.floor(Math.random()*5)],true);
newIsland();resize();requestAnimationFrame(animate);

// Optional agent hook (WebMCP-style): plan a full route without departing.
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'plan_merchant_route',description:'Select a complete route through the island towns, starting from town zero. Does not depart.',inputSchema:{type:'object',properties:{towns:{type:'array',items:{type:'integer'}}},required:['towns'],additionalProperties:false},execute(input){if(phase!=='planning')throw Error('Start a new attempt before planning.');const ids=input?.towns;if(!Array.isArray(ids)||ids.length!==cities.length-1||new Set(ids).size!==ids.length||ids.some(i=>!Number.isInteger(i)||i<1||i>=cities.length))throw Error('Include every town except zero exactly once.');route=[0,...ids];update();return {route,distanceKm:Math.round(routeDistance(cities,route)*KM)};}})).catch(()=>{});}catch{}}
