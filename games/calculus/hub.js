'use strict';
(()=>{
 // Drifting function curves (and their slopes) behind the menu.
 const canvas=document.getElementById('curves'),ctx=canvas.getContext('2d');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let w=0,h=0,dpr=1;
 const curves=[
  {f:x=>Math.sin(x),d:x=>Math.cos(x),y:.22,amp:70,speed:.10,c:'#7b6cff'},
  {f:x=>.08*x*x*x-.5*x,d:x=>.24*x*x-.5,y:.62,amp:60,speed:-.06,c:'#ff6fa5'},
  {f:x=>Math.exp(-.5*x*x)*2-1,d:x=>-2*x*Math.exp(-.5*x*x),y:.86,amp:55,speed:.05,c:'#3ee6c4'}
 ];
 function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 function grid(){ctx.strokeStyle='#ffffff08';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<w;x+=56){ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,h)}for(let y=0;y<h;y+=56){ctx.moveTo(0,y+.5);ctx.lineTo(w,y+.5)}ctx.stroke()}
 function draw(t){
  ctx.clearRect(0,0,w,h);grid();
  for(const c of curves){
   const base=c.y*h,shift=t*c.speed;
   for(const [fn,alpha,dash] of [[c.f,.42,[]],[c.d,.2,[6,8]]]){
    ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=c.c;ctx.globalAlpha=alpha;ctx.lineWidth=dash.length?1.5:2.5;ctx.shadowColor=c.c;ctx.shadowBlur=dash.length?0:14;
    for(let px=-10;px<=w+10;px+=8){const x=(px/w)*12-6+shift,y=base-fn(x)*c.amp*(dash.length?.7:1);px===-10?ctx.moveTo(px,y):ctx.lineTo(px,y)}
    ctx.stroke();
   }
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);
 }
 resize();addEventListener('resize',()=>{resize();if(reduce)draw(0)});
 if(reduce)draw(0);else{const loop=ms=>{draw(ms/1000);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
 // Spotlight + tilt on the cards.
 document.querySelectorAll('.game-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
   const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
   card.style.setProperty('--mx',px*100+'%');card.style.setProperty('--my',py*100+'%');
   if(!reduce&&e.pointerType==='mouse')card.style.transform=`rotateY(${(px-.5)*7}deg) rotateX(${(.5-py)*7}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.transform=''});
 });
})();
