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
  function typeset(value,language='en'){
    let html=escape(value);
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
    return html;
  }
  return typeset;
});
