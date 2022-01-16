var oe=Object.defineProperty,re=Object.defineProperties;var ae=Object.getOwnPropertyDescriptors;var q=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var H=(t,e,r)=>e in t?oe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,w=(t,e)=>{for(var r in e||(e={}))le.call(e,r)&&H(t,r,e[r]);if(q)for(var r of q(e))se.call(e,r)&&H(t,r,e[r]);return t},P=(t,e)=>re(t,ae(e));import{g as ce,o as ie,w as N,u as s,r as m,c as _,d as W,t as $,a as F,b as K,e as J,f as X,n as Y,h as ue,p as de,i as pe,j as fe,k as g,l as L,m as Z,F as z,q as Q,s as ge,v as me,x as ve,y as ye,z as he,A as Oe,B as be,C as Se,D as De,E as _e,G as Ve,H as we,I as Te,J as xe,K as Ce,L as Me}from"./vendor.85a018a8.js";const je=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerpolicy&&(a.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?a.credentials="include":o.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}};je();const ke={actions:{argTypesRegex:"^on[A-Z].*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}};var Ee=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",parameters:ke});const ee=Symbol(),te=(t,e=0,r=1/0)=>Math.max(e,Math.min(t,r));function Be([t,e],[r,n]){return{left:Math.min(t,r),top:Math.min(e,n),width:Math.abs(t-r),height:Math.abs(e-n)}}const x=()=>{};function ne(t){return ce()?(ie(t),!0):!1}function A(t,e,r,n){let o=x;const a=N(()=>s(t),c=>{o(),!!c&&(c.addEventListener(e,r,n),o=()=>{c.removeEventListener(e,r,n)})},{immediate:!0,flush:"post"});let i=()=>{a(),o(),i=x};const f=()=>{i()};return ne(f),f}function Pe(t,e={}){var E;const r=(E=e.draggingElement)!=null?E:window,n=d=>d.isPrimary?e.pointerTypes?e.pointerTypes.includes(d.pointerType):!0:!1,o=d=>{s(e.preventDefault)&&d.preventDefault()},a=d=>{var y;!n(d)||s(e.exact)&&d.target!==s(t)||((y=e.onStart)==null?void 0:y.call(e,d))!==!1&&(c=d,p=A(r,"pointermove",i,!0),v=A(r,"pointerup",f,!0),C=A(r,"scroll",l,!0),o(d))},i=d=>{var y;c=d,!!n(d)&&((y=e.onMove)==null||y.call(e,d),o(d))},f=d=>{var y;!n(d)||((y=e.onEnd)==null||y.call(e,d),p(),v(),C(),o(d))};let c;const l=()=>{i(c)},u=A(t,"pointerdown",a);let p=x,v=x,C=x,M=()=>{u(),p(),v(),C(),M=x};const k=()=>{M()};return ne(k),k}function Le(t,e={}){const r=m("end"),n=m([0,0]),o=m([0,0]),a=m([0,0]),i=_(()=>[s(a)[0]-s(o)[0]+s(n)[0],s(a)[1]-s(o)[1]+s(n)[1]]),f=Pe(t,P(w({},e),{preventDefault:!0,onStart(c){var v;if(r.value!=="end")return!1;const l=s(t);if(!l)return!1;const u=l.getBoundingClientRect(),p=[c.clientX-u.left-l.clientLeft+l.scrollLeft,c.clientY-u.top-l.clientTop+l.scrollTop];if(((v=e.onStart)==null?void 0:v.call(e,c,p))===!1)return!1;n.value=p,o.value=p,a.value=p},onMove(c){var p;(p=e.onMove)==null||p.call(e,c),r.value="ing";const l=s(t);if(!l)return;const u=l.getBoundingClientRect();a.value=[c.clientX-u.left-l.clientLeft+l.scrollLeft,c.clientY-u.top-l.clientTop+l.scrollTop]},onEnd(c){var l;(l=e.onEnd)==null||l.call(e,c),r.value="end",n.value=[0,0],o.value=[0,0],a.value=[0,0]}}));return{fromPoint:n,toPoint:i,dragStatus:r,stop:f}}function Ae(t,e){const[r,[n,o]]=[s(t),s(e)];if(!r)return!1;const{clientLeft:a,scrollWidth:i,clientTop:f,scrollHeight:c}=r;return 0<n&&a+i>n&&0<o&&f+c>o}function Ie(t,e){const[r,[n,o]]=[s(t),s(e)];if(!r)return[0,0];const{scrollWidth:a,scrollHeight:i}=r;return[te(a,0,n),te(i,0,o)]}function Re(t,e={}){const{fromPoint:r,toPoint:n,dragStatus:o,stop:a}=Le(t,P(w({},e),{onStart(c,l){var u;if(!Ae(t,l)||((u=e.onStart)==null?void 0:u.call(e,c))===!1)return!1}})),i=_(()=>{if(o.value==="ing")return Be(s(r),Ie(t,n))}),f=_(()=>{if(o.value==="ing"&&i.value){const{left:c,top:l,width:u,height:p}=i.value;return{position:"absolute",boxSizing:"border-box",touchAction:"none",top:0,left:0,transform:`translate(${c}px, ${l}px)`,width:`${u}px`,height:`${p}px`}}else return{display:"none"}});return{fromPoint:r,toPoint:n,style:f,rect:i,dragStatus:o,stop:a}}function Ne(t,e){return t.left<=e.left+e.width&&e.left<=t.left+t.width&&t.top<=e.top+e.height&&e.top<=t.top+t.height}function $e({contentRef:t,options:e,onChange:r,draggableOnOption:n,consumePointerDownedOnOption:o}){const a=m(!1),{rect:i,style:f,stop:c}=Re(t,{onStart(){if(a.value=!1,!s(n)&&o())return!1},onMove(){a.value=!0}});return N(i,()=>{const l=new Set;if(!!i.value){for(const{dom:u,value:p,disabled:v}of e)(v||Ne(i.value,{left:u.offsetLeft,top:u.offsetTop,width:u.clientWidth,height:u.clientHeight}))&&l.add(p);r(l)}}),{dragged:a,areaStyle:f,stop:c}}function ze({onChange:t,isDisableClick:e}){return n=>{if(e())return;const o=new Set([n.value]);t(o)}}const Ge=(t,e)=>{if(t.size!==e.size)return!1;for(const r of t)if(!e.has(r))return!1;return!0},Ue={class:"drag-select__wrapper"},S=W({props:{modelValue:{default:void 0,validator(t){const e=s(t);return e===void 0||Array.isArray(e)||e instanceof Set}},disabled:{type:Boolean,default:!1},draggableOnOption:{type:Boolean,default:!0},dragAreaClass:{type:String,default:""},dragAreaStyle:{type:Object,default:()=>({})},background:{type:String,default:"rgba(66, 153, 225, 0.5)"},selectedOptionClass:{type:String,default:""},selectedOptionStyle:{type:Object,default:()=>({})}},emits:["update:modelValue","change"],setup(t,{emit:e}){const n=t;function o(O){const j=m(new Set([]));return{selectedOptions:_(()=>{const h=s(O)||j.value;return Array.isArray(h)?new Set(h):h}),emitModelValue:h=>{const B=Array.isArray(s(O))?Array.from(h):h;j.value=B,e("update:modelValue",B),e("change",B)}}}function a(O,j){const D=new Set,T=m(!1),h=m(!1);return de(ee,{selectedOptionClass:$(n,"selectedOptionClass"),has(b){return D.has(s(b))},isSelected(b){return s(O).has(s(b).value)},add(b){D.add(s(b))},delete(b){D.delete(s(b))},onClick(b){j(s(b)),T.value=!0},onPointerDown(){h.value=!0}}),{options:D,consumeClickedOnOption:()=>{try{return T.value}finally{T.value=!1}},consumePointerDownedOnOption:()=>{try{return h.value}finally{h.value=!1}}}}const{selectedOptions:i,emitModelValue:f}=o($(n,"modelValue")),c=O=>{Ge(O,s(i))||f(O)},l=()=>!!E.value,u=ze({onChange:c,isDisableClick:l}),{options:p,consumeClickedOnOption:v,consumePointerDownedOnOption:C}=a(i,u),M=m(),{areaStyle:k,dragged:E}=$e({contentRef:M,options:p,onChange:c,consumePointerDownedOnOption:C,draggableOnOption:$(n,"draggableOnOption")}),d=_(()=>w(w({background:n.background},n.dragAreaStyle),k.value)),y=()=>{v()||l()||c(new Set)};return(O,j)=>(F(),K("div",Ue,[J("div",{ref:(D,T)=>{T.contentRef=D,M.value=D},class:"drag-select",style:{position:"relative"},onClick:y},[X(O.$slots,"default"),J("div",{class:Y(["drag-select__area",s(n).dragAreaClass]),style:ue(s(d))},null,6)],512)]))}});S.__docgenInfo={displayName:"DragSelect",description:"",tags:{},slots:[{name:"default"}]};const V=W({props:{value:{required:!0,type:null},disabled:{type:Boolean,default:!1},selectedClass:{type:String,default:""}},setup(t){const e=t,r=m(),n=_(()=>({dom:r.value,value:e.value,disabled:e.disabled})),o=pe(ee),a=_(()=>!!(o==null?void 0:o.isSelected(n.value))),i=_(()=>P(w({"drag-select-option":!0,"drag-select-option--selected":a.value,"drag-select-option--disabled":e.disabled},o?{[s(o.selectedOptionClass)]:a.value}:{}),{[e.selectedClass]:a.value})),f=()=>{o==null||o.onClick(n.value)},c=()=>{o==null||o.onPointerDown()};return fe(()=>{const l=N(()=>e.disabled,u=>{u?o==null||o.delete(n):o==null||o.add(n)},{immediate:!0});return()=>{l(),o==null||o.delete(n)}}),(l,u)=>(F(),K("div",{ref:(p,v)=>{v.dragSelectOptionRef=p,r.value=p},class:Y(s(i)),onClick:f,onPointerdown:c},[X(l.$slots,"default")],34))}});V.__docgenInfo={displayName:"DragSelectOption",description:"",tags:{},slots:[{name:"default"}]};function I(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Z(t)}var qe={parameters:{storySource:{source:`import { ref, proxyRefs } from 'vue';
import DragSelect from '../src/DragSelect.vue';
import DragSelectOption from '../src/DragSelectOption.vue';
import './Base.css';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Base',
  component: DragSelect,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    modelValue: {},
    background: { control: 'color', defaultValue: 'rgba(66, 153, 225, 0.5)' },
    draggableOnOption: { control: 'boolean', defaultValue: true },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story \`template\` are defined in the \`components\` object
  components: { DragSelect, DragSelectOption },
  // The story's \`args\` need to be mapped into the template through the \`setup()\` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>selected: {args.modelValue.value.join(",")}</div>
        <DragSelect {...(args)}>
          {Array(20)
            .fill(0)
            .map((v, index) => (
              <DragSelectOption value={index}>{index}</DragSelectOption>
            ))}
        </DragSelect>
      </>);
  },
});

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Base.args = {
  modelValue: ref([]),
  'onUpdate:modelValue': (v) => {
    Base.args.modelValue.value = v;
  },
};

const DragTemplate = (args) => ({
  // Components used in your story \`template\` are defined in the \`components\` object
  components: { DragSelect, DragSelectOption },
  // The story's \`args\` need to be mapped into the template through the \`setup()\` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>drag only in client(mousedown event will not trigger on scrollbar or border)</div>
        <div>selected: {args.modelValue.value.join(",")}</div>
        <DragSelect {...(args)}>
          {Array(20)
            .fill(0)
            .map((v, index) => (
              <DragSelectOption value={index}>{index}</DragSelectOption>
            ))}
        </DragSelect>
      </>);
  },
});

export const Drag = DragTemplate.bind({});
Drag.storyName = "Drag Only In Rect";
Drag.args = {
  modelValue: ref([]),
  'onUpdate:modelValue': (v) => {
    Drag.args.modelValue.value = v;
  },
  style: { height: "300px", overflow: "auto", border: "20px solid #d83512" }
};
`,locationsMap:{base:{startLoc:{col:17,line:19},endLoc:{col:2,line:39},startBody:{col:17,line:19},endBody:{col:2,line:39}},drag:{startLoc:{col:21,line:50},endLoc:{col:2,line:71},startBody:{col:21,line:50},endBody:{col:2,line:71}}}}},title:"Base",component:S,argTypes:{modelValue:{},background:{control:"color",defaultValue:"rgba(66, 153, 225, 0.5)"},draggableOnOption:{control:"boolean",defaultValue:!0}}};const He=t=>({components:{DragSelect:S,DragSelectOption:V},setup(){return{args:t}},render(){let e;return g(z,null,[g("div",null,[L("selected: "),t.modelValue.value.join(",")]),g(S,t,I(e=Array(20).fill(0).map((r,n)=>g(V,{value:n},I(n)?n:{default:()=>[n]})))?e:{default:()=>[e]})])}}),G=He.bind({});G.args={modelValue:m([]),"onUpdate:modelValue":t=>{G.args.modelValue.value=t}};const We=t=>({components:{DragSelect:S,DragSelectOption:V},setup(){return{args:t}},render(){let e;return g(z,null,[g("div",null,[L("drag only in client(mousedown event will not trigger on scrollbar or border)")]),g("div",null,[L("selected: "),t.modelValue.value.join(",")]),g(S,t,I(e=Array(20).fill(0).map((r,n)=>g(V,{value:n},I(n)?n:{default:()=>[n]})))?e:{default:()=>[e]})])}}),R=We.bind({});R.storyName="Drag Only In Rect";R.args={modelValue:m([]),"onUpdate:modelValue":t=>{R.args.modelValue.value=t},style:{height:"300px",overflow:"auto",border:"20px solid #d83512"}};const Fe=["Base","Drag"];var Ke=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:qe,Base:G,Drag:R,__namedExportsOrder:Fe});function Je(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Z(t)}var Xe={parameters:{storySource:{source:`import { ref } from 'vue';
import DragSelect from '../src/DragSelect.vue';
import DragSelectOption from '../src/DragSelectOption.vue';
import './Base.css';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Advance',
  component: DragSelect,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    modelValue: {},
    background: { control: 'color', defaultValue: 'rgba(66, 153, 225, 0.5)' },
    draggableOnOption: { control: 'boolean', defaultValue: true },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story \`template\` are defined in the \`components\` object
  components: { DragSelect, DragSelectOption },
  // The story's \`args\` need to be mapped into the template through the \`setup()\` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>selected: {args.modelValue.value.join(",")}</div>
        <DragSelect {...(args)}>
          {Array(10)
            .fill(0)
            .map((v, index) => (
              <div style={{ border: "1px solid #000000", margin: "10px" }}>
                <DragSelectOption value={2 * index}>{2 * index}</DragSelectOption>
                <DragSelectOption value={2 * index + 1}>{2 * index + 1}</DragSelectOption>
              </div>
            ))}
        </DragSelect>
      </>);
  },
});

export const Group = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Group.args = {
  modelValue: ref([1, 2, 3]),
  'onUpdate:modelValue': (v) => {
    Group.args.modelValue.value = v;
  },
};
`,locationsMap:{group:{startLoc:{col:17,line:19},endLoc:{col:2,line:42},startBody:{col:17,line:19},endBody:{col:2,line:42}}}}},title:"Advance",component:S,argTypes:{modelValue:{},background:{control:"color",defaultValue:"rgba(66, 153, 225, 0.5)"},draggableOnOption:{control:"boolean",defaultValue:!0}}};const Ye=t=>({components:{DragSelect:S,DragSelectOption:V},setup(){return{args:t}},render(){let e;return g(z,null,[g("div",null,[L("selected: "),t.modelValue.value.join(",")]),g(S,t,Je(e=Array(10).fill(0).map((r,n)=>g("div",{style:{border:"1px solid #000000",margin:"10px"}},[g(V,{value:2*n},{default:()=>[2*n]}),g(V,{value:2*n+1},{default:()=>[2*n+1]})])))?e:{default:()=>[e]})])}}),U=Ye.bind({});U.args={modelValue:m([1,2,3]),"onUpdate:modelValue":t=>{U.args.modelValue.value=t}};const Ze=["Group"];var Qe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Xe,Group:U,__namedExportsOrder:Ze});const et=[be,Se,De,_e,Ve,we,Te,xe,Ce,Me,Ee];et.forEach(t=>{Object.keys(t).forEach(e=>{const r=t[e];switch(e){case"args":case"argTypes":return he.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(r));case"decorators":return r.forEach(n=>ye(n,!1));case"loaders":return r.forEach(n=>ve(n,!1));case"parameters":return Q(w({},r),!1);case"argTypesEnhancers":return r.forEach(n=>me(n));case"argsEnhancers":return r.forEach(n=>ge(n));case"globals":case"globalTypes":{const n={};return n[e]=r,Q(n,!1)}case"decorateStory":case"renderToDOM":return null;default:return console.log(e+" was not supported :( !")}})});Oe(()=>[Ke,Qe].filter(t=>t.default),{hot:!1},!1);
//# sourceMappingURL=iframe.8d5687ed.js.map
