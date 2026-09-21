(function(){
 'use strict';
 const data=globalThis.CalculusMillionaireQuestions,swedish=globalThis.CalculusMillionaireSwedish,typeset=globalThis.CalculusMathTypeset,$=id=>document.getElementById(id),container=$('banks'),filter=$('level-filter'),search=$('search'),language=$('review-language');
 const banks=[data.highSchool,data.university];
 const copy={en:{title:'Calculus Millionaire question bank',eyebrow:'TEACHER REVIEW · LOCAL ONLY',description:'Every question, answer choice, and explanation used by the game.',open:'Open the game ↗',show:'Show',search:'Search',placeholder:'ID, wording, answer…',print:'Print / save as PDF',all:'Both levels',highSchool:'High school',university:'University',schoolDescription:'Swedish upper-secondary Matematik 3c',universityDescription:'Introductory applied single-variable calculus for engineering students',questions:'questions',prize:'PRIZE LEVEL',why:'Why:',correct:'Correct answer',empty:'No questions match that search.'},sv:{title:'Analysmiljonärens frågebank',eyebrow:'LÄRARGRANSKNING · ENDAST LOKALT',description:'Alla frågor, svarsalternativ och förklaringar som används i spelet.',open:'Öppna spelet ↗',show:'Visa',search:'Sök',placeholder:'ID, formulering, svar…',print:'Skriv ut / spara som PDF',all:'Båda nivåerna',highSchool:'Gymnasiet',university:'Högskola',schoolDescription:'Gymnasiets Matematik 3c',universityDescription:'Inledande tillämpad envariabelanalys för ingenjörsstudenter',questions:'frågor',prize:'PRISNIVÅ',why:'Förklaring:',correct:'Rätt svar',empty:'Inga frågor matchar sökningen.'}};
 function render(){
  const lang=language.value,t=copy[lang],term=search.value.trim().toLowerCase(),selected=filter.value;container.innerHTML='';let visible=0;
  document.documentElement.lang=lang;document.title=t.title;document.querySelector('header h1').textContent=t.title;document.querySelector('.eyebrow').textContent=t.eyebrow;document.querySelector('header p').textContent=t.description;document.querySelector('header a').textContent=t.open;
  $('show-label').textContent=t.show;$('search-label').textContent=t.search;search.placeholder=t.placeholder;$('print').textContent=t.print;[...filter.options].forEach(option=>option.textContent=t[option.value]);
  banks.forEach(bank=>{
   if(selected!=='all'&&selected!==bank.key)return;
   const section=document.createElement('section');section.className='bank';section.dataset.bank=bank.key;section.innerHTML='<div class="bank-header"><div><h2>'+t[bank.key]+'</h2><p>'+t[bank.key==='highSchool'?'schoolDescription':'universityDescription']+'</p></div><strong>'+bank.levels.flat().length+' '+t.questions+'</strong></div>';
   bank.levels.forEach((questions,level)=>{
    const translated=questions.map(q=>({...q,...(lang==='sv'?swedish[q.id]:{})}));
    const matches=translated.filter(q=>(q.id+' '+q.q+' '+q.a.join(' ')+' '+q.why+' '+q.topic).toLowerCase().includes(term));if(!matches.length)return;
    const group=document.createElement('section');group.className='level-group';group.innerHTML='<h3>'+t.prize+' '+(level+1)+' · '+matches.length+' '+t.questions.toUpperCase()+'</h3><div class="question-list"></div>';const list=group.querySelector('.question-list');
    matches.forEach(q=>{
     const card=document.createElement('article');card.className='question-item';card.innerHTML='<span class="topic">'+q.id+'</span><h4>'+typeset(q.q,lang)+'</h4><ol type="A">'+q.a.map((a,i)=>'<li'+(i===q.correct?' class="answer-line"':'')+'>'+typeset(a,lang)+(i===q.correct?' <strong>✓ '+t.correct+'</strong>':'')+'</li>').join('')+'</ol><p class="explanation"><strong>'+t.why+'</strong> '+typeset(q.why,lang)+'</p>';list.appendChild(card);visible++;
    });section.appendChild(group);
   });if(section.querySelector('.question-item'))container.appendChild(section);
  });if(!visible)container.innerHTML='<p class="empty">'+t.empty+'</p>';
 }
 filter.onchange=render;search.oninput=render;language.onchange=render;$('print').onclick=()=>print();render();
})();
