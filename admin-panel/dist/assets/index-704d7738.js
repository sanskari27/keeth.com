import{u as p,B as f,r as i,H as g,J as y,j as r,F as N,N as c}from"./index-c8a2b0d9.js";import{d as T}from"./index.esm-ffa98c48.js";import{u as b}from"./useFilteredList-06053df3.js";import{C as w}from"./cart.service-fe95de91.js";import{L as E}from"./index-82be7f2d.js";import{a as S}from"./index-af3e4ce2.js";import{E as C}from"./Each-bea6588f.js";import{B as O}from"./chunk-PULVB27S-5c8c41c1.js";import{T as v}from"./chunk-2OOHT3W5-e661ad39.js";import{T as L,a as k,b as A,c as l,d as e,e as R,f as s}from"./chunk-MGVPL3OH-a6133c63.js";import{H as B}from"./chunk-3ASUQ6PA-a2d24c74.js";import"./iconBase-bb05031b.js";import"./chunk-2ZHRCML3-aa9a930f.js";import"./chunk-ZHMYA64R-dc276fff.js";import"./chunk-6CVSDS6C-2aa348d8.js";import"./chunk-56K2BSAJ-c484cfc7.js";import"./index-2842c37b.js";const X=()=>{const d=p(),o=f(),[m,a]=i.useState(!0),[n,h]=i.useState([]);i.useEffect(()=>{a(!0),w.getOrders().then(h).finally(()=>a(!1))},[]);const u=t=>{d(`${c.ORDERS}/${t.id}`)};i.useEffect(()=>(g({title:"Orders",icon:T,link:c.ORDERS,actions:r.jsx(B,{children:r.jsx(S,{})})}),()=>{y()}),[]);const x=b(n,{name:1,email:1,phone:1,status:1});return o||r.jsxs(N,{direction:"column",padding:"1rem",justifyContent:"start",children:[r.jsx(E,{isLoaded:!m}),r.jsxs(O,{width:"98%",pb:"5rem",children:[r.jsxs(v,{textAlign:"right",color:"black",children:[n.length," records found."]}),r.jsx(L,{pt:"0.5rem",textColor:"black",children:r.jsxs(k,{children:[r.jsx(A,{children:r.jsxs(l,{children:[r.jsx(e,{color:"gray",width:"5%",children:"Sl no"}),r.jsx(e,{color:"gray",width:"15%",children:"Date"}),r.jsx(e,{color:"gray",width:"20%",children:"Name"}),r.jsx(e,{color:"gray",width:"20%",children:"Phone"}),r.jsx(e,{color:"gray",width:"10%",children:"Status"}),r.jsx(e,{color:"gray",width:"10%",children:"Coupon"}),r.jsx(e,{color:"gray",width:"10%",isNumeric:!0,children:"Quantity"}),r.jsx(e,{color:"gray",width:"10%",isNumeric:!0,children:"Amount"})]})}),r.jsx(R,{children:r.jsx(C,{items:x,render:(t,j)=>r.jsxs(l,{verticalAlign:"middle",cursor:"pointer",onClick:()=>u(t),children:[r.jsxs(s,{children:[j+1,"."]}),r.jsx(s,{children:t.transaction_date}),r.jsx(s,{children:t.name}),r.jsx(s,{children:t.phone}),r.jsx(s,{children:t.status}),r.jsx(s,{children:t.couponCode}),r.jsx(s,{isNumeric:!0,children:t.quantity}),r.jsx(s,{isNumeric:!0,children:t.amount})]})})})]})})]})]})};export{X as default};