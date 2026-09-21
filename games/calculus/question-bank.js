(function(){
  'use strict';
  const data=globalThis.CalculusMillionaireQuestions,typeset=globalThis.CalculusMathTypeset,container=document.getElementById('banks'),filter=document.getElementById('level-filter'),search=document.getElementById('search');
  const banks=[data.highSchool,data.university];
  function render(){
    const term=search.value.trim().toLowerCase(),selected=filter.value;container.innerHTML='';let visible=0;
    banks.forEach(bank=>{
      if(selected!=='all'&&selected!==bank.key)return;
      const section=document.createElement('section');section.className='bank';section.dataset.bank=bank.key;section.innerHTML='<div class="bank-header"><div><h2>'+bank.label+'</h2><p>'+bank.description+'</p></div><strong>'+bank.levels.flat().length+' questions</strong></div>';
      bank.levels.forEach((questions,level)=>{
        const matches=questions.filter(q=>(q.q+' '+q.a.join(' ')+' '+q.why+' '+q.topic).toLowerCase().includes(term));if(!matches.length)return;
        const group=document.createElement('section');group.className='level-group';group.innerHTML='<h3>PRIZE LEVEL '+(level+1)+' · '+matches.length+' QUESTIONS</h3><div class="question-list"></div>';const list=group.querySelector('.question-list');
        matches.forEach(q=>{const card=document.createElement('article');card.className='question-item';card.innerHTML='<h4>'+typeset(q.q)+'</h4><p class="answer-line"><strong>Correct answer:</strong> '+typeset(q.a[q.correct])+'</p><p class="explanation"><strong>Why:</strong> '+typeset(q.why)+'</p><span class="topic">'+q.topic.replaceAll('-',' ')+'</span>';list.appendChild(card);visible++});section.appendChild(group);
      });
      if(section.querySelector('.question-item'))container.appendChild(section);
    });
    if(!visible)container.innerHTML='<p class="empty">No questions match that search.</p>';
  }
  filter.onchange=render;search.oninput=render;document.getElementById('print').onclick=()=>print();render();
})();
