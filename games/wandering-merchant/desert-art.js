import * as THREE from './vendor/three.module.js';
const sceneryMotion=[];
export function animateDesert(time,reducedMotion=false){for(const update of sceneryMotion)update(reducedMotion?0:time);}

// Generated on the device: seamless grains and wind-combed ripples, no downloads.
export function sandMaterial(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d'),data=ctx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){const wave=Math.sin(y/512*Math.PI*32+Math.sin(x/512*Math.PI*4)*.7),fine=(Math.random()-.5)*23,v=wave*5+fine,i=(y*512+x)*4;data.data[i]=225+v;data.data[i+1]=187+v;data.data[i+2]=126+v;data.data[i+3]=255;}ctx.putImageData(data,0,0);
 const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(28,28);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;
 const bump=map.clone();bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;
 return new THREE.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.11,roughness:.96,color:'#fff2da'});
}
export function buildDesert(scene){
 const material=sandMaterial(),geo=new THREE.PlaneGeometry(100,100,260,260);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,colors=[];
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.sqrt((x/15.6)**2+(z/10.5)**2),fade=THREE.MathUtils.smoothstep(r,1,1.8);const ridge=Math.sin(x*.27+z*.19+Math.sin(z*.19)*1.2);const dunes=(ridge*.5+.5)**2*3.8+Math.sin(z*.32-x*.11)*.5;const oasisBlend=THREE.MathUtils.smoothstep(Math.hypot((x-14.3)/1.15,z-8.5),2.05,3.3);const mountain=3.6*Math.exp(-(((x+6)/3.9)**2+((z+12.4)/1.6)**2));p.setY(i,.55+(fade*dunes+mountain)*oasisBlend);const shade=1-fade*.035*(1+Math.sin(x*.11));colors.push(shade,shade,shade);}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();material.vertexColors=true;const terrain=new THREE.Mesh(geo,material);terrain.receiveShadow=true;scene.add(terrain);
 // Very shallow wind ridges in the playable basin preserve route legibility.
 const ridgeMat=new THREE.MeshStandardMaterial({color:'#f6d69c',transparent:true,opacity:.18,roughness:1,depthWrite:false});
 for(let j=0;j<35;j++){const z=-10+j*.59,pts=[];for(let k=0;k<70;k++){const x=-16+k*.47;pts.push(new THREE.Vector3(x,.568,z+Math.sin(x*.46+j*.43)*.16));}const o=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),70,.017,3,false),ridgeMat);scene.add(o);}
 buildBorderScenery(scene);
 return material;
}
function buildBorderScenery(scene){
 const oasis=new THREE.Group();oasis.position.set(14.3,.57,8.5);oasis.scale.set(1.1,1,1.1);scene.add(oasis);
 const green=new THREE.MeshStandardMaterial({color:'#7e965b',roughness:1}),wetSand=new THREE.MeshStandardMaterial({color:'#b9ae70',roughness:.85}),water=new THREE.MeshPhysicalMaterial({color:'#279eaa',metalness:.25,roughness:.18,clearcoat:1,clearcoatRoughness:.12});
 function pool(radius,material,y){const shape=new THREE.Shape();for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,r=radius*(1+.045*Math.sin(a*3)+.035*Math.cos(a*5));const x=Math.cos(a)*r*1.12,z=Math.sin(a)*r*.72;i?shape.lineTo(x,z):shape.moveTo(x,z);}const geo=new THREE.ShapeGeometry(shape,32);geo.rotateX(-Math.PI/2);const o=add(oasis,geo,material,0,y,0);o.castShadow=false;return o;}
 pool(1.7,green,.015);pool(1.49,wetSand,.023);pool(1.36,water,.033);
 const normalData=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4;normalData[i]=128+Math.sin(x/64*Math.PI*8+y/64*Math.PI*4)*24;normalData[i+1]=128+Math.cos(y/64*Math.PI*12+x/64*Math.PI*2)*22;normalData[i+2]=250;normalData[i+3]=255;}const normal=new THREE.DataTexture(normalData,64,64);normal.wrapS=normal.wrapT=THREE.RepeatWrapping;normal.magFilter=normal.minFilter=THREE.LinearFilter;normal.repeat.set(2,2);normal.needsUpdate=true;water.normalMap=normal;water.normalScale=new THREE.Vector2(.35,.35);sceneryMotion.push(t=>normal.offset.set(t*.018,t*.011));
 const rippleMat=new THREE.MeshBasicMaterial({color:'#b8f1d8',transparent:true,opacity:.24,depthWrite:false});
 for(let i=0;i<4;i++){const material=rippleMat.clone(),ring=add(oasis,new THREE.TorusGeometry(1,.01,4,60),material,0,.045,0);ring.rotation.x=-Math.PI/2;ring.castShadow=false;sceneryMotion.push(t=>{const f=(t*.09+i/4)%1;ring.scale.set((.25+f)*1.12,(.25+f)*.72,1);material.opacity=Math.sin(f*Math.PI)*.2;});}
 const glintMat=new THREE.MeshBasicMaterial({color:'#ecfff0',transparent:true,opacity:.7,depthWrite:false});
 for(let i=0;i<18;i++){const a=i*2.399,r=.15+Math.sqrt(i/18)*.94,glint=add(oasis,new THREE.PlaneGeometry(.08,.018),glintMat.clone(),Math.cos(a)*r*1.12,.05,Math.sin(a)*r*.72);glint.rotation.x=-Math.PI/2;glint.castShadow=false;sceneryMotion.push(t=>{glint.material.opacity=Math.max(0,Math.sin(t*1.5+i*2.4))**8*.7;glint.scale.x=1+Math.sin(t+i)*.5;});}
 const bark=new THREE.MeshStandardMaterial({color:'#876040',roughness:1}),frond=new THREE.MeshStandardMaterial({color:'#387f59',roughness:.9,side:THREE.DoubleSide}),coconut=new THREE.MeshStandardMaterial({color:'#775335',roughness:1});
 for(const [x,z,height] of [[-1.25,.55,1.8],[.85,.95,2.1],[1.65,-.1,1.5]]){
  const palm=new THREE.Group();palm.position.set(x,.03,z);oasis.add(palm);sceneryMotion.push(t=>{palm.rotation.z=Math.sin(t*.85+x)*.019;palm.rotation.x=Math.cos(t*.65+z)*.012;});const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(.09,height*.45,.03),new THREE.Vector3(.3,height,0)]);add(palm,new THREE.TubeGeometry(curve,12,.07,7,false),bark,0,0,0);
  for(let j=0;j<9;j++){const a=j/9*Math.PI*2,verts=[],indices=[];for(let k=0;k<=10;k++){const t=k/10,len=t*1.0,width=Math.sin(t*Math.PI)*.14;for(const side of [-1,1])verts.push(.3+Math.cos(a)*len-Math.sin(a)*width*side,height+Math.sin(t*Math.PI)*.26-t*t*.35,Math.sin(a)*len+Math.cos(a)*width*side);if(k<10){const v=k*2;indices.push(v,v+1,v+2,v+1,v+3,v+2);}}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();add(palm,geo,frond,0,0,0);}
  for(let j=0;j<3;j++)add(palm,new THREE.SphereGeometry(.08,8,6),coconut,.3+Math.cos(j*2)*.1,height-.08,Math.sin(j*2)*.1);
 }
 // Weathered sandstone outcrops frame the northern dunes, beyond all town positions.
 const stone=new THREE.MeshStandardMaterial({color:'#bf8d60',roughness:1});
 for(const [x,z,s] of [[-11.8,-8.6,.65],[-12.5,-9,.42],[14.8,-10.6,.6],[15.6,-10.9,.9],[16.3,-10.8,.38]]){const o=add(scene,new THREE.DodecahedronGeometry(s,0),stone,x,.65+s*.45,z);o.scale.set(1,.75,.7);o.rotation.y=x;}
 addAtmosphere(scene);
}
function addAtmosphere(scene){
 // Small sand motes follow the outer basin, never forming a veil over the puzzle.
 const positions=new Float32Array(140*3),seeds=[];for(let i=0;i<140;i++){const a=Math.random()*Math.PI*2,r=1.15+Math.random()*.3;seeds.push([Math.cos(a)*16*r,.9+Math.random()*2,Math.sin(a)*10.7*r,Math.random()*6]);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},vertexShader:'void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=2.2;}',fragmentShader:'void main(){float d=length(gl_PointCoord-vec2(.5));gl_FragColor=vec4(1.,.88,.63,(1.-smoothstep(.05,.5,d))*.30);}'});const dust=new THREE.Points(geometry,material);dust.frustumCulled=false;scene.add(dust);sceneryMotion.push(t=>{seeds.forEach(([x,y,z,phase],i)=>{positions[i*3]=x+Math.sin(t*.17+phase)*.6;positions[i*3+1]=y+Math.sin(t*.45+phase)*.13;positions[i*3+2]=z+Math.cos(t*.13+phase)*.3;});geometry.attributes.position.needsUpdate=true;});
 const birdMat=new THREE.MeshStandardMaterial({color:'#5a4636',roughness:1,side:THREE.DoubleSide});
 for(let i=0;i<3;i++){const bird=new THREE.Group();scene.add(bird);const wings=[];for(const side of [-1,1]){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,side*.36,.02,-.05,side*.12,0,.11],3));geo.computeVertexNormals();const wing=add(bird,geo,birdMat,0,0,0);wings.push([wing,side]);}add(bird,new THREE.SphereGeometry(.045,6,6),birdMat,0,0,.015).scale.z=2.3;sceneryMotion.push(t=>{const a=t*.095+i*.5;bird.position.set(-5+Math.cos(a)*(2.4+i*.4),4.4+i*.22,-10.8+Math.sin(a)*1.4);bird.rotation.y=-a;bird.rotation.z=Math.sin(a)*.13;for(const [wing,side] of wings)wing.rotation.z=side*(.12+Math.sin(t*2.1+i)*.16);});}
}
export function castleMaterials(sand){
 const stone=sand.clone();stone.map=sand.map.clone();stone.map.repeat.set(1.1,1.1);stone.bumpMap=sand.bumpMap.clone();stone.bumpMap.repeat.set(1.1,1.1);stone.bumpScale=.035;stone.color.set('#ffedcc');stone.vertexColors=false;
 return {stone,trim:new THREE.MeshStandardMaterial({color:'#e8c897',roughness:.9}),dark:new THREE.MeshStandardMaterial({color:'#5f4230',roughness:1}),blue:new THREE.MeshStandardMaterial({color:'#287c87',roughness:.8}),brass:new THREE.MeshStandardMaterial({color:'#d4a259',metalness:.45,roughness:.4})};
}
function add(parent,geo,material,x,y,z){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function arch(width,height){const r=width/2,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,height-r);s.absarc(0,height-r,r,0,Math.PI,false);s.lineTo(-r,0);return new THREE.ShapeGeometry(s,16);}
export function buildCastle(g,index,m){
 const root=new THREE.Group();root.scale.setScalar(.83);root.rotation.y=((index%3)-1)*.17;g.add(root);
 add(root,new THREE.CylinderGeometry(1.02,1.14,.12,40),m.trim,0,.035,0);
 // Curtain walls, recessed gate, towers, and individual parapet merlons.
 add(root,new THREE.BoxGeometry(1.3,.6,.85),m.stone,0,.36,0);
 add(root,new THREE.BoxGeometry(1.37,.085,.94),m.trim,0,.69,0);
 add(root,arch(.32,.44),m.dark,0,.1,.431);
 const gateFrame=add(root,new THREE.TorusGeometry(.205,.045,7,20,Math.PI),m.trim,0,.35,.45);gateFrame.rotation.z=0;
 for(const x of [-.205,.205])add(root,new THREE.BoxGeometry(.08,.26,.08),m.trim,x,.22,.45);
 for(let k=0;k<7;k++){for(const z of [-.44,.44])add(root,new THREE.BoxGeometry(.105,.14,.11),m.stone,-.6+k*.2,.79,z);}
 for(const x of [-.63,.63])for(const z of [-.43,.43]){
  const height=.83+(index%3)*.07;add(root,new THREE.CylinderGeometry(.19,.24,height,16),m.stone,x,height/2+.08,z);add(root,new THREE.CylinderGeometry(.225,.2,.10,16),m.trim,x,height+.09,z);
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2;const merlon=add(root,new THREE.BoxGeometry(.085,.14,.085),m.stone,x+Math.cos(a)*.18,height+.19,z+Math.sin(a)*.18);merlon.rotation.y=-a;}
  add(root,arch(.065,.19),m.dark,x,height*.65,z+.202);
 }
 const keepHeight=index===0?1.3:1.03+(index%2)*.13;
 add(root,new THREE.BoxGeometry(.58,keepHeight,.52),m.stone,0,keepHeight/2+.1,-.09);
 add(root,new THREE.BoxGeometry(.66,.085,.6),m.trim,0,keepHeight+.12,-.09);
 if(index%3===0){add(root,new THREE.SphereGeometry(.31,24,12,0,Math.PI*2,0,Math.PI/2),m.trim,0,keepHeight+.17,-.09);add(root,new THREE.SphereGeometry(.045,8,8),m.brass,0,keepHeight+.51,-.09);}else{for(let k=0;k<4;k++)for(const z of [-.36,.18])add(root,new THREE.BoxGeometry(.1,.14,.1),m.stone,-.27+k*.18,keepHeight+.23,z);}
 for(const x of [-.16,.16])add(root,arch(.10,.23),m.dark,x,keepHeight-.32,.176);
 // A small indigo market awning adds a restrained jewel-tone accent.
 const awning=add(root,new THREE.BoxGeometry(.42,.035,.42),m.blue,.37,.35,.7);awning.rotation.x=.15;
 for(const x of [.17,.57])add(root,new THREE.CylinderGeometry(.016,.016,.34,6),m.dark,x,.17,.9);
 for(let k=0;k<3;k++)add(root,new THREE.SphereGeometry(.065,8,6),m.trim,-.4+k*.14,.14,.67);
 add(root,new THREE.CylinderGeometry(.018,.018,.66,6),m.brass,-.4,1.22,-.15);
 const flag=add(root,new THREE.PlaneGeometry(.32,.19,8,2),m.blue,-.23,1.44,-.15);flag.material=m.blue;flag.material.side=THREE.DoubleSide;flag.userData.flag=true;
}
