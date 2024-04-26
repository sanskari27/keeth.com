import{aa as G,r as h,j as t,q as o,ab as m,o as B,G as E,v as R,ac as $,p as z}from"./index-c8a2b0d9.js";import{u as M}from"./chunk-7D6N5TE5-e13f872c.js";var[Y,W]=G({name:"CheckboxGroupContext",strict:!1});function X(s){const[n,a]=h.useState(s),[e,r]=h.useState(!1);return s!==n&&(r(!0),a(s)),e}function q(s){return t.jsx(o.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...s,children:t.jsx("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function L(s){return t.jsx(o.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...s,children:t.jsx("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function O(s){const{isIndeterminate:n,isChecked:a,...e}=s,r=n?L:q;return a||n?t.jsx(o.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:t.jsx(r,{...e})}):null}var T={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},F={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},H=m({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),J=m({from:{opacity:0},to:{opacity:1}}),K=m({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),Q=B(function(n,a){const e=W(),r={...e,...n},i=E("Checkbox",r),l=R(n),{spacing:v="0.5rem",className:y,children:u,iconColor:d,iconSize:p,icon:g=t.jsx(O,{}),isChecked:b,isDisabled:I=e==null?void 0:e.isDisabled,onChange:x,inputProps:j,...S}=l;let k=b;e!=null&&e.value&&l.value&&(k=e.value.includes(l.value));let f=x;e!=null&&e.onChange&&l.value&&(f=$(e.onChange,x));const{state:c,getInputProps:_,getCheckboxProps:P,getLabelProps:A,getRootProps:w}=M({...S,isDisabled:I,isChecked:k,onChange:f}),C=X(c.isChecked),N=h.useMemo(()=>({animation:C?c.isIndeterminate?`${J} 20ms linear, ${K} 200ms linear`:`${H} 200ms linear`:void 0,fontSize:p,color:d,...i.icon}),[d,p,C,c.isIndeterminate,i.icon]),D=h.cloneElement(g,{__css:N,isIndeterminate:c.isIndeterminate,isChecked:c.isChecked});return t.jsxs(o.label,{__css:{...F,...i.container},className:z("chakra-checkbox",y),...w(),children:[t.jsx("input",{className:"chakra-checkbox__input",..._(j,a)}),t.jsx(o.span,{__css:{...T,...i.control},className:"chakra-checkbox__control",...P(),children:D}),u&&t.jsx(o.span,{className:"chakra-checkbox__label",...A(),__css:{marginStart:v,...i.label},children:u})]})});Q.displayName="Checkbox";export{Q as C};