(function(){
  'use strict';
  // Ambient stage dust behind the game, plus a confetti cannon for big moments.
  const reduce=globalThis.matchMedia&&globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function layer(z){
    const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');
    c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:'+z;document.body.appendChild(c);return c;
  }
  const dust=layer(0),dustCtx=dust.getContext('2d'),front=layer(60),frontCtx=front.getContext('2d');
  let w=0,h=0,dpr=1;
  function resize(){
    dpr=Math.min(globalThis.devicePixelRatio||1,2);w=innerWidth;h=innerHeight;
    for(const c of [dust,front]){c.width=w*dpr;c.height=h*dpr}
    dustCtx.setTransform(dpr,0,0,dpr,0,0);frontCtx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();addEventListener('resize',resize);
  const motes=Array.from({length:46},()=>({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.9,s:.006+Math.random()*.02,p:Math.random()*6.28,a:.15+Math.random()*.5}));
  const pieces=[];let fxRunning=false,last=performance.now();
  function paintDust(t){
    dustCtx.clearRect(0,0,w,h);
    for(const m of motes){
      m.y-=m.s/60;if(m.y<-.02){m.y=1.02;m.x=Math.random()}
      const x=(m.x+Math.sin(t/2200+m.p)*.012)*w,y=m.y*h,tw=.55+.45*Math.sin(t/700+m.p);
      dustCtx.fillStyle='rgba(255,226,140,'+(m.a*tw)+')';dustCtx.shadowColor='#ffd76a';dustCtx.shadowBlur=8;
      dustCtx.beginPath();dustCtx.arc(x,y,m.r,0,6.283);dustCtx.fill();
    }
    dustCtx.shadowBlur=0;
  }
  const COLORS=['#f6d878','#ffe9a6','#7fa0ff','#ffffff','#ff8fb0','#5fe3b8'];
  function fxFrame(now){
    const dt=Math.min((now-last)/1000,.05);last=now;
    frontCtx.clearRect(0,0,w,h);
    for(let i=pieces.length-1;i>=0;i--){
      const p=pieces[i];p.vy+=520*dt;p.vx*=.992;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.life-=dt;
      if(p.life<=0||p.y>h+30){pieces.splice(i,1);continue}
      frontCtx.save();frontCtx.translate(p.x,p.y);frontCtx.rotate(p.rot);frontCtx.globalAlpha=Math.min(1,p.life*1.6);
      frontCtx.fillStyle=p.c;frontCtx.scale(1,Math.cos(p.rot*2.3)*.8+.2);frontCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);frontCtx.restore();
    }
    if(pieces.length)requestAnimationFrame(fxFrame);else{fxRunning=false;frontCtx.clearRect(0,0,w,h)}
  }
  function confetti(amount){
    if(reduce)return;
    const n=amount||90;
    for(let i=0;i<n;i++){
      const left=i%2===0,a=(45+Math.random()*35)*Math.PI/180,speed=560+Math.random()*640;
      pieces.push({x:left?-10:w+10,y:h*.8,vx:(left?1:-1)*Math.cos(a)*speed,vy:-Math.sin(a)*speed,w:6+Math.random()*7,h:9+Math.random()*9,rot:Math.random()*6,vr:(Math.random()-.5)*14,c:COLORS[i%COLORS.length],life:2.6+Math.random()*1.6});
    }
    if(!fxRunning){fxRunning=true;last=performance.now();requestAnimationFrame(fxFrame)}
  }
  if(!reduce){const loop=t=>{if(!document.hidden)paintDust(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
  globalThis.CalculusFx={confetti};
})();
