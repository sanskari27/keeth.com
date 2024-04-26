import{aa as k,o as q,G as B,v as $,p as H,j as y,q as _,r as u,ag as c,aA as P,ah as I}from"./index-c8a2b0d9.js";import{m as T}from"./index-2842c37b.js";var[w,E]=k({name:"FormControlStylesContext",errorMessage:`useFormControlStyles returned is 'undefined'. Seems you forgot to wrap the components in "<FormControl />" `}),[M,S]=k({strict:!1,name:"FormControlContext"});function G(i){const{id:o,isRequired:t,isInvalid:l,isDisabled:e,isReadOnly:s,...m}=i,v=u.useId(),r=o||`field-${v}`,b=`${r}-label`,f=`${r}-feedback`,F=`${r}-helptext`,[C,x]=u.useState(!1),[p,h]=u.useState(!1),[n,g]=u.useState(!1),O=u.useCallback((a={},d=null)=>({id:F,...a,ref:T(d,R=>{R&&h(!0)})}),[F]),j=u.useCallback((a={},d=null)=>({...a,ref:d,"data-focus":c(n),"data-disabled":c(e),"data-invalid":c(l),"data-readonly":c(s),id:a.id!==void 0?a.id:b,htmlFor:a.htmlFor!==void 0?a.htmlFor:r}),[r,e,n,l,s,b]),D=u.useCallback((a={},d=null)=>({id:f,...a,ref:T(d,R=>{R&&x(!0)}),"aria-live":"polite"}),[f]),N=u.useCallback((a={},d=null)=>({...a,...m,ref:d,role:"group","data-focus":c(n),"data-disabled":c(e),"data-invalid":c(l),"data-readonly":c(s)}),[m,e,n,l,s]),A=u.useCallback((a={},d=null)=>({...a,ref:d,role:"presentation","aria-hidden":!0,children:a.children||"*"}),[]);return{isRequired:!!t,isInvalid:!!l,isReadOnly:!!s,isDisabled:!!e,isFocused:!!n,onFocus:()=>g(!0),onBlur:()=>g(!1),hasFeedbackText:C,setHasFeedbackText:x,hasHelpText:p,setHasHelpText:h,id:r,labelId:b,feedbackId:f,helpTextId:F,htmlProps:m,getHelpTextProps:O,getErrorMessageProps:D,getRootProps:N,getLabelProps:j,getRequiredIndicatorProps:A}}var L=q(function(o,t){const l=B("Form",o),e=$(o),{getRootProps:s,htmlProps:m,...v}=G(e),r=H("chakra-form-control",o.className);return y.jsx(M,{value:v,children:y.jsx(w,{value:l,children:y.jsx(_.div,{...s({},t),className:r,__css:l.container})})})});L.displayName="FormControl";var z=q(function(o,t){const l=S(),e=E(),s=H("chakra-form__helper-text",o.className);return y.jsx(_.div,{...l==null?void 0:l.getHelpTextProps(o,t),__css:e.helperText,className:s})});z.displayName="FormHelperText";function U(i){const{isDisabled:o,isInvalid:t,isReadOnly:l,isRequired:e,...s}=J(i);return{...s,disabled:o,readOnly:l,required:e,"aria-invalid":P(t),"aria-required":P(e),"aria-readonly":P(l)}}function J(i){var o,t,l;const e=S(),{id:s,disabled:m,readOnly:v,required:r,isRequired:b,isInvalid:f,isReadOnly:F,isDisabled:C,onFocus:x,onBlur:p,...h}=i,n=i["aria-describedby"]?[i["aria-describedby"]]:[];return e!=null&&e.hasFeedbackText&&(e!=null&&e.isInvalid)&&n.push(e.feedbackId),e!=null&&e.hasHelpText&&n.push(e.helpTextId),{...h,"aria-describedby":n.join(" ")||void 0,id:s??(e==null?void 0:e.id),isDisabled:(o=m??C)!=null?o:e==null?void 0:e.isDisabled,isReadOnly:(t=v??F)!=null?t:e==null?void 0:e.isReadOnly,isRequired:(l=r??b)!=null?l:e==null?void 0:e.isRequired,isInvalid:f??(e==null?void 0:e.isInvalid),onFocus:I(e==null?void 0:e.onFocus,x),onBlur:I(e==null?void 0:e.onBlur,p)}}export{L as F,J as a,S as b,E as c,U as u};