(function(root){
 function createEngine(){
  const memo = new Map();
  function bite(board,x,y){return board.map((n,r)=>r>=y?Math.min(n,x):n);}
  function moves(board){const list=[]; board.forEach((n,y)=>{for(let x=0;x<n;x++)if(x||y)list.push({x,y,board:bite(board,x,y)});});return list;}
  function winning(board){const key=board.join(',');if(memo.has(key))return memo.get(key);const result=moves(board).some(m=>!winning(m.board));memo.set(key,result);return result;}
  function analyze(board){return moves(board).map(m=>({...m,winning:!winning(m.board)}));}
  return {bite,moves,winning,analyze};
 }
  const api={...createEngine(),createEngine};root.ChompEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
