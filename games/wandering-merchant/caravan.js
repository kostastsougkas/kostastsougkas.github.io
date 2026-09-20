import * as THREE from './vendor/three.module.js';
export function createCaravan(scene){
 // Unlit, matte colours stay consistent as the caravan turns in the sunlight.
 const tan=new THREE.MeshBasicMaterial({color:'#c18d58',toneMapped:false}),dark=new THREE.MeshBasicMaterial({color:'#493022',toneMapped:false}),teal=new THREE.MeshBasicMaterial({color:'#267b86',toneMapped:false}),red=teal,cream=teal;

 function part(g,geometry,material,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m;}
 const animals=[];
 for(let i=0;i<1;i++){const root=new THREE.Group(),body=new THREE.Group();root.add(body);scene.add(root);root.scale.setScalar(.85);const legs=[];const sphere=new THREE.SphereGeometry(1,12,8);
 part(body,sphere,tan,0,.72,0,.23,.26,.43);part(body,sphere,tan,0,.98,-.06,.18,.24,.23);
 const neck=part(body,new THREE.CapsuleGeometry(.09,.43,4,8),tan,0,1,.38);neck.rotation.x=.35;
 part(body,sphere,tan,0,1.32,.52,.115,.13,.22);part(body,sphere,tan,0,1.29,.68,.095,.065,.14);
 for(const side of [-1,1]){part(body,sphere,tan,side*.1,1.43,.43,.04,.09,.04);part(body,sphere,dark,side*.108,1.36,.59,.015,.02,.022);}
 for(const x of [-.16,.16])for(const z of [-.27,.28]){const pivot=new THREE.Group();pivot.position.set(x,.66,z);root.add(pivot);part(pivot,new THREE.CapsuleGeometry(.038,.43,3,6),tan,0,-.25,0);part(pivot,sphere,dark,0,-.53,.015,.058,.04,.09);legs.push(pivot);}
 part(body,new THREE.BoxGeometry(.5,.07,.44),i?red:teal,0,.95,-.08);
 for(const side of [-1,1]){part(body,new THREE.BoxGeometry(.17,.26,.28),i?teal:red,side*.28,.78,-.08);part(body,new THREE.BoxGeometry(.18,.035,.29),cream,side*.28,.84,-.08);}
 const roll=part(body,new THREE.CylinderGeometry(.08,.08,.4,10),cream,0,1.16,-.16);roll.rotation.z=Math.PI/2;
 animals.push({root,body,legs});}
 const merchant=new THREE.Group();scene.add(merchant);const torso=new THREE.Group();merchant.add(torso);const humanLegs=[];
 part(torso,new THREE.ConeGeometry(.17,.43,10),teal,0,.5,0);
 part(torso,new THREE.SphereGeometry(.105,12,8),tan,0,.83,0);
 part(torso,new THREE.SphereGeometry(.125,12,8),cream,0,.91,-.015,1,.75,1);
 part(torso,new THREE.BoxGeometry(.13,.29,.05),cream,0,.69,-.12);
 part(torso,new THREE.BoxGeometry(.12,.18,.12),red,-.19,.5,-.02);
 for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.075,.35,0);merchant.add(leg);part(leg,new THREE.CapsuleGeometry(.035,.22,3,6),dark,0,-.12,0);part(leg,new THREE.SphereGeometry(.055,8,6),dark,0,-.28,.04,1,.6,1.5);humanLegs.push(leg);}
 const arm=part(torso,new THREE.CapsuleGeometry(.034,.23,3,6),tan,.18,.57,-.1);arm.rotation.x=-.65;
 const hand=new THREE.Vector3(.18,.46,-.19),nose=new THREE.Vector3(0,1.29,.79);
 const ropeGeo=new THREE.BufferGeometry();ropeGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(17*3),3));const rope=new THREE.Line(ropeGeo,new THREE.LineBasicMaterial({color:'#67442b'}));rope.frustumCulled=false;scene.add(rope);
 const marks=[];const footprintGeo=new THREE.CircleGeometry(.045,8),dustGeo=new THREE.SphereGeometry(.1,6,4);
 for(let i=0;i<80;i++){const footprint=new THREE.Mesh(footprintGeo,new THREE.MeshBasicMaterial({color:'#855d39',transparent:true,opacity:0,depthWrite:false}));footprint.rotation.x=-Math.PI/2;footprint.scale.y=1.5;scene.add(footprint);marks.push({mesh:footprint,age:99,dust:false});}
 for(let i=0;i<24;i++){const dust=new THREE.Mesh(dustGeo,new THREE.MeshBasicMaterial({color:'#edd3a6',transparent:true,opacity:0,depthWrite:false}));scene.add(dust);marks.push({mesh:dust,age:99,dust:true});}
 let elapsed=0,markIndex=0,dustIndex=80;
 function sample(cities,route,d){let remaining=Math.max(0,d);for(let i=1;i<route.length;i++){const a=cities[route[i-1]],b=cities[route[i]],length=Math.hypot(b.x-a.x,b.z-a.z);if(remaining<=length||i===route.length-1){const f=Math.min(1,remaining/length);return {x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f,angle:Math.atan2(b.x-a.x,b.z-a.z)};}remaining-=length;}return {...cities[route[0]],angle:0};}
 return {reset(){for(const m of marks){m.age=99;m.mesh.material.opacity=0;}elapsed=0;},update(cities,route,d,t,dt,moving,reduced){
 animals.forEach((a,i)=>{const p=sample(cities,route,d-(i+1)*1.25);if(d<(i+1)*1.25){p.x-=Math.sin(p.angle)*((i+1)*1.25-d);p.z-=Math.cos(p.angle)*((i+1)*1.25-d);}a.root.position.set(p.x,.61,p.z);a.root.rotation.y=p.angle;const gait=moving&&!reduced?t*9:0;a.body.position.y=gait?Math.sin(gait*2)*.018:0;a.legs.forEach((leg,j)=>leg.rotation.x=gait?Math.sin(gait+(j===0||j===3?0:Math.PI)+i)*.32:0);});
 const leader=sample(cities,route,d);merchant.position.set(leader.x,.61,leader.z);merchant.rotation.y=leader.angle;const walk=moving&&!reduced?Math.sin(t*9):0;humanLegs.forEach((leg,i)=>leg.rotation.x=walk*(i?-.4:.4));torso.position.y=Math.abs(walk)*.015;
 merchant.updateMatrixWorld(true);animals[0].root.updateMatrixWorld(true);const start=merchant.localToWorld(hand.clone()),end=animals[0].root.localToWorld(nose.clone()),rp=ropeGeo.attributes.position;for(let i=0;i<=16;i++){const f=i/16;rp.setXYZ(i,start.x+(end.x-start.x)*f,start.y+(end.y-start.y)*f-Math.sin(f*Math.PI)*.12,start.z+(end.z-start.z)*f);}rp.needsUpdate=true;
 elapsed+=dt;if(moving&&!reduced&&elapsed>.12){elapsed=0;const a=animals[0].root;for(const side of [-1,1]){const m=marks[markIndex++%80];m.age=0;m.mesh.position.set(a.position.x+Math.cos(a.rotation.y)*side*.14,.568,a.position.z-Math.sin(a.rotation.y)*side*.14);m.mesh.rotation.z=-a.rotation.y;}const puff=marks[dustIndex++];if(dustIndex>=104)dustIndex=80;puff.age=0;puff.mesh.position.copy(a.position);puff.mesh.position.y=.7;}
 for(const m of marks){m.age+=dt;const duration=m.dust?1.4:7;m.mesh.material.opacity=Math.max(0,1-m.age/duration)*(m.dust?.15:.25);if(m.dust&&m.age<duration){m.mesh.position.y+=dt*.16;m.mesh.position.x+=dt*.1;m.mesh.scale.setScalar(1+m.age*2);}}
 }};
}
