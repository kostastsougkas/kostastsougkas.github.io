// Tiny synthesiser: plucked strings, bells and a soft desert wind. Nothing is downloaded.
export function createSound(){
 let ctx,master,enabled=true;
 const scale=[0,2,4,7,9];
 const note=(i,base=293.66)=>base*2**((scale[i%5]+12*Math.floor(i/5))/12);
 function ensure(){
  if(!enabled)return null;
  try{
   if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=1;master.connect(ctx.destination);wind();}
   if(ctx.state==='suspended')ctx.resume();
   return ctx;
  }catch{return null;}
 }
 function wind(){
  const len=ctx.sampleRate*4,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;const edge=Math.min(i,len-i)/(ctx.sampleRate*.25);d[i]=last*3.5*Math.min(1,edge);}
  const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
  const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=420;filter.Q.value=.6;
  const gain=ctx.createGain();gain.gain.value=.05;
  const lfo=ctx.createOscillator(),depth=ctx.createGain();lfo.frequency.value=.11;depth.gain.value=.03;lfo.connect(depth);depth.connect(gain.gain);lfo.start();
  src.connect(filter);filter.connect(gain);gain.connect(master);src.start();
 }
 function tone(freq,{type='triangle',gain=.08,decay=.9,delay=0,cutoff=2600,partials=[]}={}){
  const c=ensure();if(!c)return;const t=c.currentTime+delay;
  const g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(cutoff,t);f.frequency.exponentialRampToValueAtTime(400,t+decay);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+decay);
  f.connect(g);g.connect(master);
  for(const [ratio,level] of [[1,1],...partials]){const o=c.createOscillator(),og=c.createGain();o.type=type;o.frequency.value=freq*ratio;og.gain.value=level;o.connect(og);og.connect(f);o.start(t);o.stop(t+decay+.05);}
 }
 return {
  get enabled(){return enabled;},
  set enabled(v){enabled=v;if(ctx)master.gain.setTargetAtTime(v?1:0,ctx.currentTime,.05);if(v)ensure();},
  wake(){ensure();},
  pluck(i){tone(note(i),{gain:.09,decay:1,partials:[[2,.25],[3,.08]]});},
  undo(){tone(note(1),{type:'sine',gain:.05,decay:.35,partials:[[.5,.5]]});},
  arrive(i){tone(note(i+2,261.63),{type:'sine',gain:.07,decay:1.5,partials:[[2.76,.22],[5.4,.08]]});},
  depart(){[0,2,4].forEach((k,j)=>tone(note(k,196),{gain:.06,decay:.8,delay:j*.11}));},
  finish(perfect){const seq=perfect?[0,2,4,5,7,9,10]:[4,2,0];seq.forEach((k,j)=>tone(note(k,261.63),{type:perfect?'sine':'triangle',gain:.07,decay:perfect?1.8:1.1,delay:j*(perfect?.12:.16),partials:[[2.76,.18],[2,.2]]}));},
 };
}
