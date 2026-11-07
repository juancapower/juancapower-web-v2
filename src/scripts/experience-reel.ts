const root=document.querySelector<HTMLElement>('[data-experience-reel]');
if(root){
 const track=root.querySelector<HTMLElement>('#experience-reel')!;
 const slides=[...root.querySelectorAll<HTMLElement>('[data-reel-slide]')];
 const thumbs=[...root.querySelectorAll<HTMLButtonElement>('[data-reel-thumb]')];
 const previous=root.querySelector<HTMLButtonElement>('[data-reel-prev]')!;
 const next=root.querySelector<HTMLButtonElement>('[data-reel-next]')!;
 const counter=root.querySelector<HTMLElement>('[data-reel-index]')!;
 const strip=root.querySelector<HTMLElement>('.reel-thumbnails')!;
 let active=-1,pending=false;
 function update(){pending=false;let nearest=0,distance=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft-track.scrollLeft);if(d<distance){distance=d;nearest=i}});if(nearest===active)return;active=nearest;slides.forEach((slide,i)=>slide.dataset.active=String(i===active));root!.dataset.active=String(active);counter.textContent=String(active+1).padStart(2,'0');previous.disabled=active===0;next.disabled=active===slides.length-1;thumbs.forEach((thumb,i)=>thumb.setAttribute('aria-pressed',String(i===active)));const thumb=thumbs[active];strip.scrollTo({left:thumb.offsetLeft-strip.clientWidth/2+thumb.clientWidth/2,behavior:'instant'});}
 function move(index:number,animate=true){const target=Math.max(0,Math.min(slides.length-1,index));const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;track.scrollTo({left:slides[target].offsetLeft,behavior:animate&&!reduced?'smooth':'instant'});}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
 root.dataset.enhanced='true';
 root.querySelectorAll<HTMLElement>('[data-reel-controls]').forEach(el=>el.hidden=false);
 previous.addEventListener('click',()=>move(active-1));next.addEventListener('click',()=>move(active+1));
 thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>move(i)));
 track.addEventListener('scroll',schedule,{passive:true});
 track.addEventListener('keydown',event=>{const delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;if(delta){event.preventDefault();move(active+delta)}else if(event.key==='Home'||event.key==='End'){event.preventDefault();move(event.key==='Home'?0:slides.length-1)}});
 window.addEventListener('resize',()=>{move(Math.max(0,active),false);schedule()},{passive:true});update();
}
export {};
