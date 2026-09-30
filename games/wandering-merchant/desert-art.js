import * as THREE from './vendor/three.module.js';
const {smoothstep,lerp}=THREE.MathUtils;

// ---------------------------------------------------------------- moods ----
// Every new desert is lit at a different time of day. `night` (0..1) drives lanterns and glow.
export const MOODS={
 dawn:{name:'Rose Dawn',bg:'#efbfa6',sun:'#ffb4a0',sunI:3.1,sunPos:[-24,9,-8],sky:'#ffdde6',ground:'#a3806f',hemiI:1.3,sand:'#fff2ee',exposure:1.05,night:.05,cloud:.14,vig:'#7d3c50'},
 noon:{name:'High Noon',bg:'#efd7a6',sun:'#fff6e6',sunI:3.8,sunPos:[-9,30,-7],sky:'#d3e8ff',ground:'#b08a5c',hemiI:1.3,sand:'#fffaf0',exposure:1.02,night:0,cloud:.17,vig:'#8a5a2a'},
 golden:{name:'Golden Hour',bg:'#e8ab79',sun:'#ff9c55',sunI:4,sunPos:[-24,11,-9],sky:'#ffd4a8',ground:'#9a6a46',hemiI:1.2,sand:'#ffe4c6',exposure:1.05,night:.1,cloud:.16,vig:'#7a3418'},
 dusk:{name:'Violet Dusk',bg:'#a86a86',sun:'#ff8a78',sunI:2.5,sunPos:[-24,8,-8],sky:'#9a86dc',ground:'#6c4a5c',hemiI:1.05,sand:'#e4d2e6',exposure:1.08,night:.55,cloud:.14,vig:'#2d1a45'},
 night:{name:'Moonlit Night',bg:'#232c56',sun:'#b4c6ff',sunI:2.5,sunPos:[-18,20,-10],sky:'#6577c0',ground:'#2a2f60',hemiI:1.1,sand:'#98a4d6',exposure:1.1,night:1,cloud:0,vig:'#03061a'},
};
// Shared, mutable atmosphere state read by animated scenery.
export const env={night:0,cloud:.15};

// ------------------------------------------------------------- textures ----
let glowTex;
export function glowTexture(){
 if(glowTex)return glowTex;
 const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
 glowTex=new THREE.CanvasTexture(c);glowTex.colorSpace=THREE.SRGBColorSpace;return glowTex;
}
export function glowSprite(color,size,opacity=1){
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
 s.scale.setScalar(size);s.renderOrder=5;return s;
}
let beamTex;
function beamTexture(){
 if(beamTex)return beamTex;
 const c=document.createElement('canvas');c.width=8;c.height=128;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,128);
 g.addColorStop(0,'#000');g.addColorStop(.6,'#555');g.addColorStop(1,'#fff');x.fillStyle=g;x.fillRect(0,0,8,128);beamTex=new THREE.CanvasTexture(c);return beamTex;
}
export function createBeam(color){
 const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.62,3.4,20,1,true),new THREE.MeshBasicMaterial({color,alphaMap:beamTexture(),transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false}));
 m.position.y=1.75;m.renderOrder=4;return m;
}

function sandTexture(){
 const size=512,canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d'),data=ctx.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const wave=Math.sin(y/size*Math.PI*32+Math.sin(x/size*Math.PI*4)*.7),grain=(Math.random()-.5)*26,v=238+wave*6+grain,i=(y*size+x)*4;
  data.data[i]=v;data.data[i+1]=v*.985;data.data[i+2]=v*.95;data.data[i+3]=255;
 }
 ctx.putImageData(data,0,0);
 const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(28,28);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;
 return map;
}

// --------------------------------------------------------------- terrain ----
export function heightAt(x,z){
 const r=Math.hypot(x/15.6,z/10.5),fade=smoothstep(r,1,1.8);
 const ridge=Math.sin(x*.27+z*.19+Math.sin(z*.19)*1.2),dunes=(ridge*.5+.5)**2*3.8+Math.sin(z*.32-x*.11)*.5;
 const oasis=smoothstep(Math.hypot((x-14.3)/1.15,z-8.5),2.05,3.3),mountain=3.6*Math.exp(-(((x+6)/3.9)**2+((z+12.4)/1.6)**2));
 return .55+(fade*dunes+mountain)*oasis;
}
function add(parent,geo,material,x=0,y=0,z=0){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
// Deterministic pseudo-random so the border scenery is the same every game.
function rng(seed){return()=>((seed=Math.imul(seed^seed>>>15,1|seed)+0x6D2B79F5|0)>>>0)/4294967296;}

export function buildDesert(scene){
 const motion=[],sandMap=sandTexture(),
  material=new THREE.MeshStandardMaterial({map:sandMap,bumpMap:sandMap,bumpScale:.12,roughness:.95,color:'#ffffff',vertexColors:true});
 const geo=new THREE.PlaneGeometry(110,110,280,280);geo.rotateX(-Math.PI/2);
 const p=geo.attributes.position,colors=new Float32Array(p.count*3),crest=new THREE.Color('#f7e6bb'),mid=new THREE.Color('#e9cc94'),trough=new THREE.Color('#d1a56f'),c=new THREE.Color();
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x/15.6,z/10.5),fade=smoothstep(r,1,1.8);
  const h01=(Math.sin(x*.27+z*.19+Math.sin(z*.19)*1.2))*.5+.5,mottle=Math.sin(x*.21)*Math.sin(z*.17+1)*.5+.5;
  p.setY(i,heightAt(x,z));
  c.copy(trough).lerp(mid,smoothstep(h01,.1,.6)).lerp(crest,smoothstep(h01,.62,1)*.9);
  c.lerp(mid,1-fade);c.offsetHSL(0,mottle*.03,(mottle-.5)*.03*(1-fade*.4));
  colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
 }
 geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.computeVertexNormals();
 const terrain=new THREE.Mesh(geo,material);terrain.receiveShadow=true;scene.add(terrain);

 buildMesas(scene);buildOasis(scene,motion);buildBorder(scene,motion);buildCamp(scene,motion);
 buildAtmosphere(scene,motion);
 return {material,sandMap,update(t,reduced){for(const f of motion)f(reduced?0:t);}};
}

function buildMesas(scene){
 const bands=['#c98d5d','#b87549','#d8a06a','#a86a45'].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
 for(const [x,z,r,h] of [[7,-14.2,2.5,3.2],[11.4,-14.9,1.7,2.4],[-13.5,-13.6,2.1,2.7],[-2,-15.5,1.5,1.7]]){
  const g=new THREE.Group();g.position.set(x,heightAt(x,z)-.3,z);scene.add(g);let y=0;
  for(let i=0;y<h;i++){const bh=.55+(i*7%3)*.12,rad=r*(1-i*.045);add(g,new THREE.CylinderGeometry(rad*.94,rad,bh,9),bands[i%4],0,y+bh/2,0);y+=bh;}
  add(g,new THREE.CylinderGeometry(r*.7,r*.9,.18,9),bands[2],0,y+.05,0);
 }
}

function buildOasis(scene,motion){
 const oasis=new THREE.Group();oasis.position.set(14.3,.57,8.5);oasis.scale.set(1.1,1,1.1);scene.add(oasis);
 const green=new THREE.MeshStandardMaterial({color:'#6f9a55',roughness:1}),wet=new THREE.MeshStandardMaterial({color:'#b9ae70',roughness:.85}),water=new THREE.MeshPhysicalMaterial({color:'#1fa9b0',metalness:.2,roughness:.16,clearcoat:1,clearcoatRoughness:.1});
 function pool(radius,material,y){const shape=new THREE.Shape();for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,r=radius*(1+.045*Math.sin(a*3)+.035*Math.cos(a*5)),x=Math.cos(a)*r*1.12,z=Math.sin(a)*r*.72;i?shape.lineTo(x,z):shape.moveTo(x,z);}const g=new THREE.ShapeGeometry(shape,32);g.rotateX(-Math.PI/2);const o=add(oasis,g,material,0,y,0);o.castShadow=false;return o;}
 pool(1.7,green,.015);pool(1.49,wet,.023);pool(1.36,water,.033);
 const nd=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4;nd[i]=128+Math.sin(x/64*Math.PI*8+y/64*Math.PI*4)*24;nd[i+1]=128+Math.cos(y/64*Math.PI*12+x/64*Math.PI*2)*22;nd[i+2]=250;nd[i+3]=255;}
 const normal=new THREE.DataTexture(nd,64,64);normal.wrapS=normal.wrapT=THREE.RepeatWrapping;normal.magFilter=normal.minFilter=THREE.LinearFilter;normal.repeat.set(2,2);normal.needsUpdate=true;water.normalMap=normal;water.normalScale=new THREE.Vector2(.35,.35);
 motion.push(t=>normal.offset.set(t*.018,t*.011));
 for(let i=0;i<4;i++){const m=new THREE.MeshBasicMaterial({color:'#c8f7e4',transparent:true,opacity:.24,depthWrite:false}),ring=add(oasis,new THREE.TorusGeometry(1,.01,4,60),m,0,.045,0);ring.rotation.x=-Math.PI/2;ring.castShadow=false;motion.push(t=>{const f=(t*.09+i/4)%1;ring.scale.set((.25+f)*1.12,(.25+f)*.72,1);m.opacity=Math.sin(f*Math.PI)*.22;});}
 for(let i=0;i<22;i++){const a=i*2.399,r=.15+Math.sqrt(i/22)*.94,m=new THREE.MeshBasicMaterial({color:'#f2fff4',transparent:true,opacity:0,depthWrite:false}),glint=add(oasis,new THREE.PlaneGeometry(.08,.018),m,Math.cos(a)*r*1.12,.05,Math.sin(a)*r*.72);glint.rotation.x=-Math.PI/2;glint.castShadow=false;motion.push(t=>{m.opacity=Math.max(0,Math.sin(t*1.5+i*2.4))**8*.75;glint.scale.x=1+Math.sin(t+i)*.5;});}
 const bark=new THREE.MeshStandardMaterial({color:'#7d5a3c',roughness:1}),frond=new THREE.MeshStandardMaterial({color:'#2f8a5a',roughness:.9,side:THREE.DoubleSide}),nut=new THREE.MeshStandardMaterial({color:'#775335',roughness:1});
 for(const [x,z,height] of [[-1.25,.55,1.8],[.85,.95,2.1],[1.65,-.1,1.5],[-.2,-.9,1.35]]){
  const palm=new THREE.Group();palm.position.set(x,.03,z);oasis.add(palm);motion.push(t=>{palm.rotation.z=Math.sin(t*.85+x)*.02;palm.rotation.x=Math.cos(t*.65+z)*.013;});
  add(palm,new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(.09,height*.45,.03),new THREE.Vector3(.3,height,0)]),12,.07,7,false),bark);
  for(let j=0;j<9;j++){const a=j/9*Math.PI*2,verts=[],idx=[];for(let k=0;k<=10;k++){const t=k/10,len=t,width=Math.sin(t*Math.PI)*.14;for(const side of [-1,1])verts.push(.3+Math.cos(a)*len-Math.sin(a)*width*side,height+Math.sin(t*Math.PI)*.26-t*t*.35,Math.sin(a)*len+Math.cos(a)*width*side);if(k<10){const v=k*2;idx.push(v,v+1,v+2,v+1,v+3,v+2);}}const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));fg.setIndex(idx);fg.computeVertexNormals();add(palm,fg,frond);}
  for(let j=0;j<3;j++)add(palm,new THREE.SphereGeometry(.08,8,6),nut,.3+Math.cos(j*2)*.1,height-.08,Math.sin(j*2)*.1);
 }
 // reeds around the water
 const reed=new THREE.MeshStandardMaterial({color:'#8fae5a',roughness:1}),rnd=rng(11);
 for(let i=0;i<26;i++){const a=rnd()*Math.PI*2,r=1.38+rnd()*.22,h=.25+rnd()*.3;const o=add(oasis,new THREE.ConeGeometry(.025,h,4),reed,Math.cos(a)*r*1.12,h/2,Math.sin(a)*r*.72);o.rotation.z=(rnd()-.5)*.4;}
}

function buildBorder(scene,motion){
 const rnd=rng(7),stone=new THREE.MeshStandardMaterial({color:'#bf8d60',roughness:1}),cactus=new THREE.MeshStandardMaterial({color:'#5f8a54',roughness:1}),shrub=new THREE.MeshStandardMaterial({color:'#8a6a43',roughness:1});
 function ringPoint(min,max){for(let k=0;k<50;k++){const a=rnd()*Math.PI*2,rr=min+rnd()*(max-min),x=Math.cos(a)*15.6*rr,z=Math.sin(a)*10.5*rr;if(Math.hypot((x-14.3)/2.5,(z-8.5)/2.5)>1&&z>-11)return [x,z];}return [-20,0];}
 for(let i=0;i<34;i++){const [x,z]=ringPoint(1.06,1.5),s=.18+rnd()**2*.6,o=add(scene,new THREE.DodecahedronGeometry(s,0),stone,x,heightAt(x,z)+s*.25,z);o.scale.set(1,.7,.8);o.rotation.set(rnd(),rnd()*6,0);}
 for(let i=0;i<9;i++){
  const [x,z]=ringPoint(1.08,1.4),g=new THREE.Group(),h=.5+rnd()*.5;g.position.set(x,heightAt(x,z),z);g.rotation.y=rnd()*6;scene.add(g);
  add(g,new THREE.CapsuleGeometry(.09,h,4,8),cactus,0,h/2+.08,0);
  for(const side of [-1,1]){if(rnd()<.3)continue;const arm=add(g,new THREE.CapsuleGeometry(.06,.22,4,6),cactus,side*.17,h*.55,0);arm.rotation.z=side*-.6;add(g,new THREE.CapsuleGeometry(.06,.18,4,6),cactus,side*.27,h*.55+.16,0);}
  motion.push(t=>{g.rotation.z=Math.sin(t*.6+i)*.008;});
 }
 for(let i=0;i<24;i++){const [x,z]=ringPoint(1.02,1.4),g=new THREE.Group();g.position.set(x,heightAt(x,z),z);scene.add(g);for(let k=0;k<5;k++){const o=add(g,new THREE.ConeGeometry(.02,.35+rnd()*.2,4),shrub,(rnd()-.5)*.2,.15,(rnd()-.5)*.2);o.rotation.set((rnd()-.5)*.8,0,(rnd()-.5)*.8);}}
 // A weathered sandstone arch on the eastern horizon.
 const arch=new THREE.Group();arch.position.set(-16.6,heightAt(-16.6,-6),-6);arch.rotation.y=.6;scene.add(arch);
 add(arch,new THREE.BoxGeometry(.7,1.5,.7),stone,-.7,.75,0);add(arch,new THREE.BoxGeometry(.7,1.2,.7),stone,.7,.6,0);add(arch,new THREE.BoxGeometry(2.3,.5,.75),stone,0,1.55,0).rotation.z=.04;
}

function buildCamp(scene,motion){
 const camp=new THREE.Group();camp.position.set(17.4,0,-6.2);camp.position.y=heightAt(17.4,-6.2);scene.add(camp);
 const cloth=['#a4432f','#f0dfbb'].map(color=>new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide})),dark=new THREE.MeshStandardMaterial({color:'#3b271b',roughness:1});
 [[-.8,.3,.9,0],[.9,-.5,.75,1]].forEach(([x,z,s,k],i)=>{const t=add(camp,new THREE.ConeGeometry(.6*s,.95*s,4,1,true),cloth[k],x,.47*s,z);t.rotation.y=Math.PI/4+i;add(camp,new THREE.BoxGeometry(.2*s,.4*s,.04),dark,x+Math.sin(i)*.0,.2*s,z+.32*s).rotation.y=i*.3;});
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;add(camp,new THREE.DodecahedronGeometry(.07,0),new THREE.MeshStandardMaterial({color:'#7d6a5b',roughness:1}),.15+Math.cos(a)*.22,.05,.9+Math.sin(a)*.22);}
 const flame=add(camp,new THREE.ConeGeometry(.11,.34,6),new THREE.MeshBasicMaterial({color:'#ffb347',toneMapped:false}),.15,.24,.9);flame.castShadow=false;
 const glow=glowSprite('#ff9a3c',2.2,.4);glow.position.set(.15,.45,.9);camp.add(glow);
 motion.push(t=>{const f=1+Math.sin(t*11)*.12+Math.sin(t*17.3)*.08;flame.scale.set(1,f,1);glow.material.opacity=(.18+env.night*.55)*(.85+.15*f);});
}

function buildAtmosphere(scene,motion){
 // Cloud shadows: huge soft blotches sliding over the basin.
 const cc=document.createElement('canvas');cc.width=cc.height=256;const cx=cc.getContext('2d'),rnd=rng(3);
 for(let i=0;i<26;i++){const x=rnd()*256,y=rnd()*256,r=22+rnd()*46;for(const ox of [-256,0,256])for(const oy of [-256,0,256]){const g=cx.createRadialGradient(x+ox,y+oy,0,x+ox,y+oy,r);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(0,0,256,256);}}
 const cmap=new THREE.CanvasTexture(cc);cmap.wrapS=cmap.wrapT=THREE.RepeatWrapping;cmap.repeat.set(1.3,1.3);
 const cmat=new THREE.MeshBasicMaterial({map:cmap,color:'#3a2a52',transparent:true,opacity:.15,depthWrite:false}),clouds=new THREE.Mesh(new THREE.PlaneGeometry(130,130),cmat);
 clouds.rotation.x=-Math.PI/2;clouds.position.y=6.5;clouds.renderOrder=1;scene.add(clouds);motion.push(t=>{cmap.offset.set(t*.0035,t*.0016);cmat.opacity=env.cloud;});

 // Wind-blown sand and, after dark, drifting embers — both animated on the GPU.
 function drift(count,{color,size,alpha,speed,height}){
  const seeds=new Float32Array(count*4),pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){seeds[i*4]=(Math.random()-.5)*46;seeds[i*4+1]=(Math.random()-.5)*30;seeds[i*4+2]=height[0]+Math.random()*(height[1]-height[0]);seeds[i*4+3]=speed*(.6+Math.random()*.8);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aSeed',new THREE.BufferAttribute(seeds,4));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uTime:{value:0},uAlpha:{value:alpha},uColor:{value:new THREE.Color(color)},uSize:{value:size*Math.min(devicePixelRatio,2)}},
   vertexShader:'attribute vec4 aSeed;uniform float uTime,uSize;varying float vTw;void main(){vec3 p;p.x=mod(aSeed.x+uTime*aSeed.w+23.,46.)-23.;p.z=aSeed.y+sin(uTime*.3+aSeed.x)*.7;p.y=aSeed.z+sin(uTime*.7+aSeed.x*2.)*.18;vTw=.6+.4*sin(uTime*2.+aSeed.x*5.);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=uSize*(.7+aSeed.w*.15);}',
   fragmentShader:`uniform vec3 uColor;uniform float uAlpha;varying float vTw;
void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(uColor,(1.-smoothstep(.05,.5,d))*uAlpha*vTw);
#include <colorspace_fragment>
}`});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=6;scene.add(pts);return m;
 }
 const sand=drift(170,{color:'#ffe3ad',size:2.6,alpha:.32,speed:.55,height:[.7,2.4]});
 const embers=drift(70,{color:'#ffc266',size:5,alpha:0,speed:.12,height:[.8,3]});
 motion.push(t=>{sand.uniforms.uTime.value=t;embers.uniforms.uTime.value=t;embers.uniforms.uAlpha.value=env.night*.9;});

 // Sparkling sand glints inside the playable basin.
 const n=320,gp=new Float32Array(n*3),phase=new Float32Array(n);
 for(let i=0;i<n;i++){const a=Math.random()*6.283,r=Math.sqrt(Math.random());gp[i*3]=Math.cos(a)*r*15;gp[i*3+1]=.6;gp[i*3+2]=Math.sin(a)*r*10;phase[i]=Math.random()*100;}
 const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(gp,3));gg.setAttribute('aPhase',new THREE.BufferAttribute(phase,1));
 const gm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0},uSize:{value:5*Math.min(devicePixelRatio,2)},uStrength:{value:.9}},
  vertexShader:'attribute float aPhase;uniform float uTime,uSize;varying float vA;void main(){float s=max(0.,sin(uTime*(.6+fract(aPhase)*.9)+aPhase));vA=pow(s,14.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=uSize*(.4+vA);}',
  fragmentShader:'uniform float uStrength;varying float vA;void main(){vec2 q=abs(gl_PointCoord-.5);float star=max(0.,1.-min(q.x,q.y)*10.)*max(0.,1.-length(q)*2.);gl_FragColor=vec4(1.,.95,.8,star*vA*uStrength);}'});
 const glints=new THREE.Points(gg,gm);glints.frustumCulled=false;glints.renderOrder=6;scene.add(glints);motion.push(t=>{gm.uniforms.uTime.value=t;gm.uniforms.uStrength.value=.9-env.night*.35;});

 const birdMat=new THREE.MeshStandardMaterial({color:'#4a3a2e',roughness:1,side:THREE.DoubleSide});
 for(let i=0;i<3;i++){const bird=new THREE.Group();scene.add(bird);const wings=[];for(const side of [-1,1]){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,side*.36,.02,-.05,side*.12,0,.11],3));g.computeVertexNormals();wings.push([add(bird,g,birdMat),side]);}add(bird,new THREE.SphereGeometry(.045,6,6),birdMat,0,0,.015).scale.z=2.3;
  motion.push(t=>{const a=t*.095+i*.5;bird.visible=env.night<.7;bird.position.set(-5+Math.cos(a)*(2.4+i*.4),4.4+i*.22,-10.8+Math.sin(a)*1.4);bird.rotation.y=-a;bird.rotation.z=Math.sin(a)*.13;for(const [w,side] of wings)w.rotation.z=side*(.12+Math.sin(t*2.1+i)*.16);});}
}

// --------------------------------------------------------------- castles ----
export const accents=['#c8452f','#1f8792','#7a4bb0','#d08a1f','#2f8a5a','#b83a72','#2c6bb5','#c96a1a','#3d9c9c','#8a3fc0','#d0553d','#4a8f3a','#b8892f','#5a5fc9'];
export function castleMaterials(sand){
 const stone=new THREE.MeshStandardMaterial({color:'#f6e5c2',roughness:.95,bumpScale:.03});stone.map=sand.map.clone();stone.map.repeat.set(1.1,1.1);stone.map.needsUpdate=true;stone.bumpMap=stone.map;
 const cloth=accents.map(color=>new THREE.MeshStandardMaterial({color,roughness:.7,side:THREE.DoubleSide}));
 return {stone,trim:new THREE.MeshStandardMaterial({color:'#ebd2a4',roughness:.9}),dark:new THREE.MeshStandardMaterial({color:'#4a3325',roughness:1}),
  base:new THREE.MeshStandardMaterial({color:'#cfae7c',roughness:1}),blue:new THREE.MeshStandardMaterial({color:'#1f8792',roughness:.6}),gold:new THREE.MeshStandardMaterial({color:'#e8b04c',roughness:.4,metalness:.2,emissive:'#4a2a00',emissiveIntensity:.35}),
  lit:new THREE.MeshBasicMaterial({color:'#5a3d28',toneMapped:false}),cloth,_dayLit:new THREE.Color('#5a3d28'),_nightLit:new THREE.Color('#ffd27a')};
}
export function updateCastleMaterials(m,night){m.lit.color.copy(m._dayLit).lerp(m._nightLit,Math.min(1,night*1.25));m.gold.emissiveIntensity=.35+night*.5;}
const geoCache=new Map();
function cached(key,make){if(!geoCache.has(key))geoCache.set(key,make());return geoCache.get(key);}
function onion(r,h){return cached(`on${r}_${h}`,()=>{const pts=[];for(let i=0;i<=18;i++){const t=i/18;pts.push(new THREE.Vector2(r*(.72+.5*Math.sin(Math.min(1,t*1.12)*Math.PI*.92))*(1-t)**.55,h*t));}return new THREE.LatheGeometry(pts,20);});}
function cyl(a,b,h,s=16){return cached(`cy${a}_${b}_${h}_${s}`,()=>new THREE.CylinderGeometry(a,b,h,s));}
function box(w,h,d){return cached(`bx${w}_${h}_${d}`,()=>new THREE.BoxGeometry(w,h,d));}
function sph(r,s=8){return cached(`sp${r}_${s}`,()=>new THREE.SphereGeometry(r,s,Math.max(4,s-2)));}
function arch(width,height){return cached(`ar${width}_${height}`,()=>{const r=width/2,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,height-r);s.absarc(0,height-r,r,0,Math.PI,false);s.lineTo(-r,0);return new THREE.ShapeGeometry(s,16);});}

export function buildCastle(g,index,m){
 const root=new THREE.Group();root.scale.setScalar(.98);root.rotation.y=((index%3)-1)*.17;g.add(root);
 const accent=m.cloth[index%m.cloth.length],start=index===0;
 add(root,cyl(1.02,1.12,.12,44),m.base,0,.03,0);
 // Curtain wall, gate and parapet
 add(root,box(1.3,.6,.85),m.stone,0,.36,0);add(root,box(1.37,.085,.94),m.trim,0,.69,0);
 add(root,arch(.32,.44),m.dark,0,.1,.431);
 for(const x of [-.205,.205])add(root,box(.08,.26,.08),m.trim,x,.22,.45);
 add(root,new THREE.TorusGeometry(.205,.04,7,20,Math.PI),m.trim,0,.35,.45);
 for(let k=0;k<7;k++)for(const z of [-.44,.44])add(root,box(.105,.14,.11),m.stone,-.6+k*.2,.79,z);
 // Corner towers: the front pair wears jewel-coloured onion domes.
 for(const x of [-.63,.63])for(const z of [-.43,.43]){
  const h=.83+(index%3)*.07,front=z>0;
  add(root,cyl(.19,.24,h),m.stone,x,h/2+.08,z);add(root,cyl(.225,.2,.1),m.trim,x,h+.09,z);
  if(front){add(root,onion(.19,.42),accent,x,h+.13,z);add(root,sph(.03),m.gold,x,h+.58,z);}
  else{add(root,cyl(.19,.21,.16,12),m.stone,x,h+.2,z);add(root,cyl(.22,.22,.05,12),m.trim,x,h+.3,z);}
  add(root,arch(.065,.19),m.lit,x,h*.65,z+(front?.202:-.202)).rotation.y=front?0:Math.PI;
 }
 // Keep with golden dome
 const kh=start?1.3:1.03+(index%2)*.13;
 add(root,box(.58,kh,.52),m.stone,0,kh/2+.1,-.09);add(root,box(.66,.085,.6),m.trim,0,kh+.12,-.09);
 add(root,cyl(.22,.26,.16,20),m.trim,0,kh+.2,-.09);
 add(root,onion(.3,.62),index%2?m.gold:accent,0,kh+.26,-.09);add(root,cyl(.012,.012,.3,6),m.gold,0,kh+1,-.09);add(root,sph(.035),m.gold,0,kh+1.16,-.09);
 for(const x of [-.16,.16])add(root,arch(.1,.23),m.lit,x,kh-.32,.176);
 add(root,arch(.1,.23),m.lit,0,kh-.05,.176);
 // Minaret
 const mh=kh+.55,mx=.62,mz=-.05;
 add(root,cyl(.075,.09,mh,10),m.stone,mx+.02,mh/2+.1,mz);add(root,cyl(.13,.13,.05,12),m.trim,mx+.02,mh*.82+.1,mz);add(root,cyl(.09,.09,.16,10),m.trim,mx+.02,mh*.82+.19,mz);
 add(root,onion(.1,.24),m.gold,mx+.02,mh*.82+.27,mz);add(root,box(.03,.06,.03),m.lit,mx+.02,mh*.6,mz+.085);
 // Market awning, crates and lanterns
 const aw=add(root,box(.42,.035,.42),accent,.37,.36,.72);aw.rotation.x=.15;
 add(root,box(.42,.037,.09),m.trim,.37,.365,.6).rotation.x=.15;add(root,box(.42,.037,.09),m.trim,.37,.35,.84).rotation.x=.15;
 for(const x of [.17,.57])add(root,cyl(.016,.016,.34,6),m.dark,x,.17,.9);
 for(let k=0;k<3;k++)add(root,sph(.065),k===1?accent:m.trim,-.42+k*.14,.14,.72);
 for(const x of [-.3,.3]){add(root,cyl(.014,.014,.42,6),m.dark,x,.25,.62);add(root,sph(.04),m.lit,x,.5,.62);}
 // Banner
 const pole=start?.86:.66,fy=kh+.68;
 add(root,cyl(.018,.018,pole,6),m.gold,-.23,kh+.1+pole/2,-.15);
 const fg=cached('flag',()=>{const q=new THREE.PlaneGeometry(.34,.2,10,2);q.translate(.17,0,0);return q;}).clone();
 const flag=add(root,fg,start?m.gold:accent,-.23,kh+.1+pole-.12,-.15);flag.castShadow=false;
 g.userData.flag=flag;g.userData.flagBase=flag.position.y;
 return root;
}
