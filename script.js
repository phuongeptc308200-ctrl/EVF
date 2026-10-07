

(()=>{
'use strict';
const story=document.getElementById('i1-evf-story');
const stage=document.getElementById('i1-stage');
const scene=document.getElementById('i1-number-scene');
const digits=document.getElementById('i1-digits');
const year=document.getElementById('i1-year');
const growth=document.getElementById('i1-growth');
const question=document.getElementById('i1-question-scene');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(p,a,b)=>clamp((p-a)/(b-a));
const smooth=x=>x*x*(3-2*x);
let scheduled=false;
function render(){
 scheduled=false;
 const travel=Math.max(1,story.offsetHeight-stage.offsetHeight);
 const p=clamp((Math.max(0,(window.innerHeight-stage.offsetHeight)/2)-story.getBoundingClientRect().top)/travel);
 // 210 là hình ảnh mở đầu. Một nhịp chuyển mờ đưa người đọc về mốc 114.
 const reset=p<.065?1-smooth(phase(p,.015,.065)):smooth(phase(p,.065,.115));
 const count=phase(p,.16,.59);
 const value=p<.065?210:(reduce.matches?(count<1?114:210):Math.round(114+96*smooth(count)));
 digits.textContent=String(value);
 year.textContent=count>=1?'NĂM 2025':'NĂM 2024';
 year.style.opacity=String(smooth(phase(p,.08,.14)));
 const growthIn=smooth(phase(p,.30,.59));
 growth.style.opacity=String(growthIn);
 growth.style.transform='translateY('+((1-growthIn)*20)+'px)';
 const exit=smooth(phase(p,.72,.86));
 scene.style.opacity=String(reset*(1-exit));
 scene.style.transform=reduce.matches?'none':'translateY('+(-45*exit)+'px)';
 const enter=smooth(phase(p,.81,.95));
 question.style.opacity=String(enter);
 question.style.transform=reduce.matches?'none':'translateY('+((1-enter)*50)+'px)';
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('pageshow',schedule);
reduce.addEventListener('change',schedule);
render();
})();


(()=>{
'use strict';
const $=id=>document.getElementById(id),story=$('i2-story'),stage=$('i2-stage');
const sections=[$('i2-assets'),$('i2-profit'),$('i2-budget')];
const assetValues=[49221,59598,83058];
const assetBars=assetValues.map((_,i)=>$('i2-asset-bar-'+i));
const assetLabels=assetValues.map((_,i)=>$('i2-asset-value-'+i));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>x*x*(3-2*x);
const ramp=(x,a,b)=>smooth(clamp((x-a)/(b-a)));
const number=n=>Math.round(n).toLocaleString('vi-VN');
let scheduled=false;
function show(el,opacity,shift){el.style.opacity=String(opacity);el.style.transform=reduced.matches?'none':'translateY('+shift+'px)'}
function render(){
 scheduled=false;
 const p=clamp((Math.max(0,(window.innerHeight-stage.offsetHeight)/2)-story.getBoundingClientRect().top)/Math.max(1,story.offsetHeight-stage.offsetHeight));
 // 5 khoảng cuộn bằng nhau; cuối mỗi khoảng giữ lại số liệu để người đọc xem.
 const x=p*5;
 for(let i=0;i<3;i++){
  const t=i===0?1:ramp(x,i+.06,i+.62);
  const a=reduced.matches?(t>0?1:0):t;
  assetBars[i].style.height=(assetValues[i]/90000*100*a)+'%';
  assetLabels[i].style.opacity=String(ramp(a,0,.15));
  assetLabels[i].textContent=number(assetValues[i]*a);
 }
 const aOut=ramp(x,3,3.28),pIn=ramp(x,3,3.28),pOut=ramp(x,4,4.28),bIn=ramp(x,4,4.28);
 show(sections[0],1-aOut,-30*aOut);
 show(sections[1],pIn*(1-pOut),30*(1-pIn)-30*pOut);
 show(sections[2],bIn,30*(1-bIn));
 $('i2-profit-number').textContent=number(1104*(reduced.matches?1:ramp(x,3.1,3.68)));
 const budgetT=ramp(x,4.25,4.75);
 $('i2-budget-bar-0').style.height=(114/230*100)+'%';
 $('i2-budget-value-0').style.opacity=String(bIn);
 $('i2-budget-bar-1').style.height=(210/230*100*(reduced.matches?(budgetT>0?1:0):budgetT))+'%';
 $('i2-budget-value-1').style.opacity=String(ramp(budgetT,0,.15));
 $('i2-budget-value-1').textContent=number(210*(reduced.matches?1:budgetT));
 $('i2-growth').style.opacity=String(ramp(x,4.65,4.92));
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);reduced.addEventListener('change',schedule);render();
})();


(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!('IntersectionObserver' in window)||reduced.matches)return;
  const targets=[...document.querySelectorAll('.sapo,.prose p,.chapter-image,main > figure,.triptych > figure,.diptych > figure,.article-credit')];
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:0,rootMargin:'0px 0px -5% 0px'});
  targets.forEach(el=>{
    // Content already above the viewport remains visible on reload or anchor navigation.
    if(el.getBoundingClientRect().bottom<=0)return;
    const parent=el.parentElement;
    if(parent.matches('.triptych,.diptych')){
      const index=[...parent.children].indexOf(el);
      el.style.setProperty('--reveal-delay',Math.min(index*100,200)+'ms');
    }
    el.classList.add('evf-reveal');
    observer.observe(el);
  });
  const showAll=()=>{
    if(!reduced.matches)return;
    targets.forEach(el=>el.classList.add('is-visible'));
    observer.disconnect();
  };
  reduced.addEventListener('change',showAll);
  window.addEventListener('beforeprint',()=>{
    targets.forEach(el=>el.classList.add('is-visible'));
  });
})();
