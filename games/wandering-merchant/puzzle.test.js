import {test} from 'node:test';
import assert from 'node:assert/strict';
import {solve,routeDistance,generateCities} from './puzzle.js';
function brute(c){let best=Infinity;function visit(route,left){if(!left.length){best=Math.min(best,routeDistance(c,route));return;}for(const id of left)visit([...route,id],left.filter(x=>x!==id));}visit([0],c.map((_,i)=>i).slice(1));return best;}
test('exact solver matches exhaustive search on varied small islands',()=>{for(let i=0;i<8;i++){const c=generateCities(6),s=solve(c);assert.ok(Math.abs(s.length-brute(c))<1e-8);assert.equal(s.route[0],0);assert.equal(new Set(s.route).size,c.length);assert.ok(Math.abs(routeDistance(c,s.route)-s.length)<1e-8);}});
test('open path does not add return journey',()=>{const c=[{x:0,z:0},{x:1,z:0},{x:2,z:0}];assert.deepEqual(solve(c),{route:[0,1,2],length:2});});
test('all difficulty levels generate complete separated islands',()=>{for(const n of [6,10,14])for(let j=0;j<30;j++){const c=generateCities(n);assert.equal(c.length,n);for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)assert.ok(Math.hypot(c[a].x-c[b].x,c[a].z-c[b].z)>4.1);const s=solve(c);assert.equal(new Set(s.route).size,n);assert.ok(Number.isFinite(s.length));}});
test('crowded 14-town maps never fail to generate',()=>{for(let j=0;j<300;j++)assert.equal(generateCities(14).length,14);});
