import{z as y,r,a as b,o as a,c as n,b as x,d as t,e as k,F as h,k as $,t as s,i as S}from"./index-6d500333.js";import{u as V,a as p}from"./toastMessage-b1d96b7b.js";const L={class:"my-5 row justify-content-center"},M=["onSubmit"],w={class:"table align-middle"},B=t("thead",null,[t("th",null,"品名"),t("th",null,"數量"),t("th",null,"單價")],-1),C={class:"text-end"},N=t("td",{colspan:"2",class:"text-end"},"總計",-1),z={class:"text-end"},E={class:"table"},F=t("th",{width:"100"},"Email",-1),I=t("th",null,"姓名",-1),O=t("th",null,"收件人電話",-1),j=t("th",null,"收件人地址",-1),q=t("th",null,"付款狀態",-1),D={key:0},R={key:1,class:"text-success"},T={key:0,class:"text-end"},U=t("button",{type:"submit",class:"btn btn-danger"},"確認付款去",-1),A=[U],K={__name:"UserCheckout",setup(G){const v=V(),{pushMessage:d}=v,m=y(),i=r(m.params.orderId),e=r({user:{}}),l=r(!1),_=()=>{const c=`https://vue3-course-api.hexschool.io/v2//api/hexschoolvue/order/${i.value}`;l.value=!0,p.get(c).then(o=>{e.value=o.data.order,l.value=!1}).catch(o=>{l.value=!1,d({style:"danger",title:"錯誤訊息",content:o.response.data.message})})},f=()=>{const c=`https://vue3-course-api.hexschool.io/v2//api/hexschoolvue/pay/${i.value}`;l.value=!0,p.post(c).then(()=>{l.value=!1,_()}).catch(o=>{l.value=!1,d({style:"danger",title:"錯誤訊息",content:o.response.data.message})})};return _(),(c,o)=>{const g=b("VueLoading");return a(),n(h,null,[x(g,{active:l.value,"z-index":1060},null,8,["active"]),t("div",L,[t("form",{class:"col-md-6",onSubmit:k(f,["prevent"])},[t("table",w,[B,t("tbody",null,[(a(!0),n(h,null,$(e.value.products,u=>(a(),n("tr",{key:u.id},[t("td",null,s(u.product.title),1),t("td",null,s(u.qty)+"/"+s(u.product.unit),1),t("td",C,s(u.final_total),1)]))),128))]),t("tfoot",null,[t("tr",null,[N,t("td",z,s(e.value.total),1)])])]),t("table",E,[t("tbody",null,[t("tr",null,[F,t("td",null,s(e.value.user.email),1)]),t("tr",null,[I,t("td",null,s(e.value.user.name),1)]),t("tr",null,[O,t("td",null,s(e.value.user.tel),1)]),t("tr",null,[j,t("td",null,s(e.value.user.address),1)]),t("tr",null,[q,t("td",null,[e.value.is_paid?(a(),n("span",R,"付款完成")):(a(),n("span",D,"尚未付款"))])])])]),e.value.is_paid===!1?(a(),n("div",T,A)):S("",!0)],40,M)])],64)}}};export{K as default};