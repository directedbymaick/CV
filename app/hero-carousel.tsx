'use client';
/* eslint-disable @next/next/no-img-element */
import {useRef,useState} from 'react';
import './hero-carousel.css';

const slides=[
 {name:'Frieren',label:'Beyond Journey’s End',image:'/media/frieren.webp',href:'#projets',project:1},
 {name:'Riot MMO',label:'Cinematic Web Experience',image:'/media/riot.webp',href:'#projets',project:2},
 {name:'Mad Makers',label:'Mon univers créatif',image:'/media/mad-makers.webp',href:'https://www.mad-makers.fr',project:null},
];
export default function HeroCarousel({quiet,onProject}:{quiet:boolean;onProject:(index:number)=>void}){
 const [active,setActive]=useState(0);
 const [dragging,setDragging]=useState(false);
 const stage=useRef<HTMLDivElement>(null);
 const pointer=useRef<{x:number;scroll:number;id:number}|null>(null);
 const swiped=useRef(false);
 function select(index:number){
  const el=stage.current;if(!el)return;
  const card=el.querySelectorAll<HTMLElement>('.carousel-card')[Math.max(0,Math.min(slides.length-1,index))];
  el.scrollTo({left:card.offsetLeft-(el.clientWidth-card.offsetWidth)/2,behavior:quiet||window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function finish(){
  const start=pointer.current;pointer.current=null;setDragging(false);
  if(start&&stage.current?.hasPointerCapture(start.id))stage.current.releasePointerCapture(start.id);
 }
 return <div className="hero-carousel" role="region" aria-roledescription="carrousel" aria-label="Mes créations web — glisser pour faire défiler" onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(active+(e.key==='ArrowLeft'?-1:1))}}}>
  <div ref={stage} className={`carousel-stage${dragging?' dragging':''}`} onPointerDown={e=>{
   swiped.current=false;if(e.pointerType!=='mouse'||e.button!==0)return;
   pointer.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,id:e.pointerId};
  }} onPointerMove={e=>{
   const start=pointer.current;if(!start)return;
   const dx=e.clientX-start.x;
   if(Math.abs(dx)>5){swiped.current=true;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}
   if(swiped.current){e.preventDefault();e.currentTarget.scrollLeft=start.scroll-dx}
  }} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onScroll={e=>{
   const el=e.currentTarget;const center=el.scrollLeft+el.clientWidth/2;
   const cards=Array.from(el.querySelectorAll<HTMLElement>('.carousel-card'));
   let nearest=0;cards.forEach((card,i)=>{if(Math.abs(card.offsetLeft+card.offsetWidth/2-center)<Math.abs(cards[nearest].offsetLeft+cards[nearest].offsetWidth/2-center))nearest=i});setActive(nearest);
  }} onClickCapture={e=>{if(swiped.current){e.preventDefault();e.stopPropagation()}}}>
   {slides.map((slide,index)=><div key={slide.name} className={`carousel-card ${active===index?'current':''}`} role="group" aria-roledescription="diapositive" aria-label={`${index+1} sur ${slides.length} : ${slide.name}`}>
    <a href={slide.href} target={slide.project===null?'_blank':undefined} rel={slide.project===null?'noreferrer':undefined} draggable={false} onClick={()=>{if(slide.project!==null)onProject(slide.project)}} aria-label={`Découvrir ${slide.name}`}>
     <span className="carousel-window"><span aria-hidden="true">● ● ●</span><span>{slide.name} · {slide.label}</span><span aria-hidden="true">↗</span></span><img src={slide.image} alt={`Aperçu du site ${slide.name}`} width="1280" height="661" draggable={false} fetchPriority={index===0?'high':'auto'}/>
    </a>
   </div>)}
  </div>
  <p className="carousel-caption" aria-live="polite" aria-atomic="true"><span>{String(active+1).padStart(2,'0')} / 03</span> {slides[active].name} <span>·</span> {slides[active].label}</p>
 </div>;
}
