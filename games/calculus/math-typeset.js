(function(root,factory){
  const typeset=factory();
  if(typeof module==='object'&&module.exports)module.exports=typeset;
  root.CalculusMathTypeset=typeset;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const sub={
    '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'−',
    'ₐ':'a','ₑ':'e','ₕ':'h','ᵢ':'i','ⱼ':'j','ₖ':'k','ₗ':'l','ₘ':'m','ₙ':'n','ₒ':'o','ₚ':'p','ᵣ':'r','ₛ':'s','ₜ':'t','ᵤ':'u','ₓ':'x'
  };
  const sup={
    '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
    '⁺':'+','⁻':'−','⁼':'=','⁽':'(','⁾':')','ⁿ':'n','ᵃ':'a','ᵇ':'b','ᶜ':'c','ᵈ':'d','ᵉ':'e','ˣ':'x'
  };
  const decode=(value,map)=>[...value].map(char=>map[char]||char).join('');
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const identifier=value=>/^[-+−]?\d+(?:\.\d+)?$/.test(value)?'<mn>'+value+'</mn>':'<mi>'+value+'</mi>';
  function integral(lower,upper){
    const low=decode(lower,sub),up=decode(upper,sup);
    return '<math class="math-token integral-token" displaystyle="true" aria-label="integral from '+low+' to '+up+'"><msubsup><mo movablelimits="false">∫</mo>'+identifier(low)+identifier(up)+'</msubsup></math>';
  }
  function limit(variable,target){
    const from=decode(variable,sub),to=decode(target,sub);
    return '<math class="math-token limit-token" aria-label="limit as '+from+' approaches '+to+'"><munder><mo>lim</mo><mrow>'+identifier(from)+'<mo>→</mo>'+identifier(to)+'</mrow></munder></math>';
  }
  const pqDiscriminant='<math class="math-token pq-expression" aria-label="open parenthesis p over 2 close parenthesis squared minus q"><mrow><msup><mrow><mo>(</mo><mfrac><mi>p</mi><mn>2</mn></mfrac><mo>)</mo></mrow><mn>2</mn></msup><mo>−</mo><mi>q</mi></mrow></math>';
  const pqRadical='<math class="math-token pq-expression" aria-label="square root of open parenthesis p over 2 close parenthesis squared minus q"><msqrt><mrow><msup><mrow><mo>(</mo><mfrac><mi>p</mi><mn>2</mn></mfrac><mo>)</mo></mrow><mn>2</mn></msup><mo>−</mo><mi>q</mi></mrow></msqrt></math>';
  const pqFormula='<math class="math-token pq-expression" aria-label="x equals negative p over 2 plus or minus the square root of open parenthesis p over 2 close parenthesis squared minus q"><mrow><mi>x</mi><mo>=</mo><mo>−</mo><mfrac><mi>p</mi><mn>2</mn></mfrac><mo>±</mo><msqrt><mrow><msup><mrow><mo>(</mo><mfrac><mi>p</mi><mn>2</mn></mfrac><mo>)</mo></mrow><mn>2</mn></msup><mo>−</mo><mi>q</mi></mrow></msqrt></mrow></math>';
  // Answers that consist only of a formula are rendered as one MathML expression,
  // so that every option in an answer set gets the same typographic treatment.
  const SUB_CHARS=Object.keys(sub).join(''),SUP_CHARS=Object.keys(sup).join('');
  const FUNCTIONS=['sin','cos','tan','ln','log','exp','lim'],PRODUCTS=['ab','dx','dt','du','dy','kx','px'];
  function isFormula(value){
    if(!new RegExp('^[\\sA-Za-z0-9θπ∞∫√′″()|+\\-−=±·×<>≤≥≠→,.!/^'+SUB_CHARS+SUP_CHARS+']+$').test(value))return false;
    return (value.match(/[A-Za-z]+/g)||[]).every(word=>word.length===1||FUNCTIONS.includes(word)||PRODUCTS.includes(word));
  }
  function lex(value){
    const tokens=[];let i=0;
    const subRun=new RegExp('^['+SUB_CHARS+']+'),supRun=new RegExp('^['+SUP_CHARS+']+');
    const limit=new RegExp('^lim(['+SUB_CHARS+']+)→(['+SUB_CHARS+']+|[a-zA-Z∞+\\-]+)'),bounded=new RegExp('^∫(['+SUB_CHARS+']+)(?:(['+SUP_CHARS+']+)|\\^\\(([^()]+)\\))');
    while(i<value.length){
      const rest=value.slice(i);let m;
      if(/^\s/.test(rest)){i++;continue}
      if((m=limit.exec(rest))){tokens.push({t:'lim',from:decode(m[1],sub),to:decode(m[2],sub)});i+=m[0].length;continue}
      if((m=bounded.exec(rest))){tokens.push({t:'int',low:decode(m[1],sub),up:m[2]?decode(m[2],sup):m[3]});i+=m[0].length;continue}
      if((m=/^(sin|cos|tan|ln|log|exp|lim)(?![a-z])/.exec(rest))){tokens.push({t:'fn',v:m[1]});i+=m[0].length;continue}
      if((m=/^\d+(?:\.\d+)?/.exec(rest))){tokens.push({t:'num',v:m[0]});i+=m[0].length;continue}
      if((m=/^[A-Za-zθπ∞]/.exec(rest))){tokens.push({t:'id',v:m[0]});i++;continue}
      if((m=supRun.exec(rest))){tokens.push({t:'sup',v:decode(m[0],sup)});i+=m[0].length;continue}
      if((m=subRun.exec(rest))){tokens.push({t:'sub',v:decode(m[0],sub)});i+=m[0].length;continue}
      if((m=/^\^\(([^()]+)\)/.exec(rest))){tokens.push({t:'sup',v:m[1]});i+=m[0].length;continue}
      const char=rest[0];
      if(char==='∫'){tokens.push({t:'int'});i++;continue}
      if(char==='√'){tokens.push({t:'sqrt'});i++;continue}
      if('′″'.includes(char)){tokens.push({t:'prime',v:char});i++;continue}
      if('()|/!'.includes(char)){tokens.push({t:char});i++;continue}
      if('+-−=±·×<>≤≥≠→,'.includes(char)){tokens.push({t:'op',v:char==='-'?'−':char});i++;continue}
      throw new Error('Unsupported formula character');
    }
    return tokens;
  }
  function parseFormula(tokens){
    let pos=0;
    const peek=()=>tokens[pos],take=()=>tokens[pos++];
    const mrow=items=>items.length===1?items[0]:'<mrow>'+items.join('')+'</mrow>';
    const fenced=(open,inner,close)=>'<mrow><mo>'+open+'</mo>'+inner+'<mo>'+close+'</mo></mrow>';
    const sub=text=>mrow(parseFormula(lex(text)));
    function group(close){const items=row(close);if(!peek()||peek().t!==close)throw new Error('Unbalanced formula');take();return items}
    function postfix(base){
      for(;;){
        const next=peek();
        if(next&&next.t==='prime'){take();base='<mrow>'+base+'<mo lspace="0" rspace="0">'+next.v+'</mo></mrow>';continue}
        if(next&&next.t==='sup'){take();base='<msup>'+base+sub(next.v)+'</msup>';continue}
        if(next&&next.t==='sub'){take();base='<msub>'+base+sub(next.v)+'</msub>';continue}
        if(next&&next.t==='!'){take();base='<mrow>'+base+'<mo lspace="0">!</mo></mrow>';continue}
        return base;
      }
    }
    // One operand with its primes, powers, indices and call brackets. A bare
    // bracketed group keeps its contents so a fraction can drop the brackets.
    function atom(){
      const token=take();if(!token)throw new Error('Incomplete formula');
      let base,inner=null;
      if(token.t==='('){inner=group(')');base=fenced('(',inner.join(''),')')}
      else if(token.t==='|')base=fenced('|',group('|').join(''),'|');
      else if(token.t==='num')base='<mn>'+token.v+'</mn>';
      else if(token.t==='id'||token.t==='fn')base='<mi>'+token.v+'</mi>';
      else if(token.t==='lim')base='<munder><mo>lim</mo><mrow>'+parseFormula(lex(token.from)).join('')+'<mo>→</mo>'+parseFormula(lex(token.to)).join('')+'</mrow></munder>';
      else if(token.t==='int')base=token.low===undefined?'<mo>∫</mo>':'<msubsup><mo movablelimits="false">∫</mo>'+sub(token.low)+sub(token.up)+'</msubsup>';
      else if(token.t==='sqrt'){if(!peek()||take().t!=='(')throw new Error('Square root needs brackets');base='<msqrt>'+group(')').join('')+'</msqrt>'}
      else throw new Error('Unexpected formula token');
      const plain=base;base=postfix(base);if(base!==plain)inner=null;
      if((token.t==='id'||token.t==='fn')&&peek()&&peek().t==='('){take();base=postfix('<mrow>'+base+fenced('(',group(')').join(''),')')+'</mrow>')}
      else if((token.t==='fn'||token.t==='lim')&&peek()&&peek().t!=='op')base='<mrow>'+base+'<mspace width="0.3em"></mspace></mrow>';
      return {html:base,inner,named:token.t==='fn'||token.t==='lim'};
    }
    function row(close){
      const items=[];let chainStart=0;
      while(peek()&&peek().t!==close){
        const next=peek();
        if(next.t==='op'){take();items.push({html:'<mo>'+escape(next.v)+'</mo>',op:true});chainStart=items.length;continue}
        if(next.t==='/'){
          take();
          // The numerator is the product chain since the last operator: ab sin(C)/2.
          const chain=items.splice(chainStart),right=atom();
          if(!chain.length)throw new Error('Fraction without numerator');
          const top=chain.length===1&&chain[0].inner?chain[0].inner:chain.map(item=>item.html);
          items.push({html:'<mfrac>'+mrow(top)+mrow(right.inner||[right.html])+'</mfrac>'});
          continue;
        }
        const before=items.length&&!items[items.length-1].op&&(peek().t==='fn'||peek().t==='lim'),next2=atom();
        if(before)items.push({html:'<mspace width="0.17em"></mspace>'});
        items.push(next2);
      }
      return items.map(item=>item.html);
    }
    const result=row(undefined);
    if(pos<tokens.length)throw new Error('Unbalanced formula');
    return result;
  }
  function formula(value){
    try{return '<math class="math-token formula-token">'+parseFormula(lex(value)).join('')+'</math>'}catch(e){return null}
  }
  function typeset(value,language='en',answer=false){
    if(answer&&isFormula(value)){const rendered=formula(value);if(rendered)return rendered}
    let html=escape(value);
    html=html.replace(new RegExp('∫(['+Object.keys(sub).join('')+']+)\\^\\(([^()<>]+)\\)','g'),(_,lower,upper)=>integral(lower,upper));
    html=html.replace(/x=−p\/2 ± √\(\(p\/2\)²−q\)/g,pqFormula);
    html=html.replace(/√\(\(p\/2\)²−q\)/g,pqRadical);
    html=html.replace(/\(p\/2\)²−q/g,pqDiscriminant);
    html=html.replace(/∫([₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓ]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿᵃᵇᶜᵈᵉˣ]+)/g,(_,lower,upper)=>integral(lower,upper));
    html=html.replace(/lim([₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓ]+)→([₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓa-zA-Z∞+\-]+)/g,(_,variable,target)=>limit(variable,target));
    html=html.replace(/([₀₁₂₃₄₅₆₇₈₉₊₋ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤₓ]+)/g,value=>'<sub class="math-script">'+decode(value,sub)+'</sub>');
    html=html.replace(/\^\(([^()<>]+)\)/g,(_,exponent)=>'<sup class="math-script">'+exponent+'</sup>');
    html=html.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿᵃᵇᶜᵈᵉˣ]+)/g,value=>'<sup class="math-script">'+decode(value,sup)+'</sup>');
    html=html.replace(/∫(?!<\/mo>)/g,'<math class="math-token"><mo>∫</mo></math>');
    if(language==='sv')html=html.replace(/aria-label="([^"]*)"/g,(_,label)=>'aria-label="'+label.replace(/^integral from (.+) to (.+)$/,'integral från $1 till $2').replace(/^limit as (.+) approaches (.+)$/,'gränsvärde då $1 går mot $2').replaceAll('x equals negative','x är lika med minus').replaceAll('plus or minus the square root of','plus eller minus kvadratroten ur').replaceAll('square root of','kvadratroten ur').replaceAll('open parenthesis','vänsterparentes').replaceAll('close parenthesis','högerparentes').replaceAll('p over 2','p genom 2').replaceAll('squared minus q','i kvadrat minus q')+'"');
    if(language==='el')html=html.replace(/aria-label="([^"]*)"/g,(_,label)=>'aria-label="'+label.replace(/^integral from (.+) to (.+)$/,'ολοκλήρωμα από $1 έως $2').replace(/^limit as (.+) approaches (.+)$/,'όριο καθώς το $1 τείνει στο $2').replaceAll('x equals negative','x ισούται με μείον').replaceAll('plus or minus the square root of','συν ή πλην την τετραγωνική ρίζα του').replaceAll('square root of','τετραγωνική ρίζα του').replaceAll('open parenthesis','αριστερή παρένθεση').replaceAll('close parenthesis','δεξιά παρένθεση').replaceAll('p over 2','p διά 2').replaceAll('squared minus q','στο τετράγωνο μείον q')+'"');
    return html;
  }
  return typeset;
});
