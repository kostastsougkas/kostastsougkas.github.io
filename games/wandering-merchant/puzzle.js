export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function routeDistance(cities,route){return route.slice(1).reduce((s,id,i)=>s+distance(cities[route[i]],cities[id]),0);}
export function solve(cities){
 const n=cities.length,m=1<<(n-1),dp=new Float64Array(m*n).fill(Infinity),prev=new Int16Array(m*n).fill(-1);dp[0]=0;
 for(let mask=0;mask<m;mask++)for(let last=0;last<n;last++){const val=dp[mask*n+last];if(!Number.isFinite(val))continue;for(let next=1;next<n;next++){const bit=1<<(next-1);if(mask&bit)continue;const index=(mask|bit)*n+next,cost=val+distance(cities[last],cities[next]);if(cost<dp[index]){dp[index]=cost;prev[index]=last;}}}
 let mask=m-1,last=1;for(let j=2;j<n;j++)if(dp[mask*n+j]<dp[mask*n+last])last=j;const length=dp[mask*n+last],route=[];while(last>0){route.push(last);const p=prev[mask*n+last];mask^=1<<(last-1);last=p;}route.push(0);return {route:route.reverse(),length};
}
export function generateCities(n,random=Math.random){const cities=[{x:-9,z:6}];let attempts=0;while(cities.length<n&&attempts++<10000){const p={x:(random()-.5)*27,z:(random()-.5)*17};if((p.x/14)**2+(p.z/9)**2<1&&cities.every(c=>distance(c,p)>4.1))cities.push(p);}if(cities.length<n)throw Error('Could not generate island');return cities;}
