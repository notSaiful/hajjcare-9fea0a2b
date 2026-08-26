import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{n as t,t as n}from"./jsx-runtime-BtyjnKZj.js";import{t as r}from"./button-CgSFT3OP.js";import{t as i}from"./MainLayout-BBXyqvjg.js";import{t as a}from"./building-2-CRCoJvcF.js";import{t as o}from"./calendar-BHVE2aEW.js";import{t as s}from"./download-BczFw11i.js";import{t as c}from"./file-down-D7sQbNvA.js";import{t as l}from"./file-text-DBjAHhs2.js";import{t as u}from"./filter-BtwwkY3N.js";import{t as d}from"./mail-BRLxhNCO.js";import{t as f}from"./receipt-BrjAn61w.js";import{n as p}from"./client-Bo3oUnRy.js";import{A as m,Kt as h,P as g,k as _,q as v,xn as y}from"./index-DJm8V58p.js";import{t as b}from"./separator-DcPnfcP5.js";import{t as x}from"./PageHeader-9iRGhKdN.js";import{a as S,i as C,n as w,r as T,t as E}from"./select-Drub0zeq.js";var D=e(t(),1),O=n(),k=e=>(e/100).toFixed(2),A=e=>new Date(e).toLocaleDateString(`en-IN`,{day:`2-digit`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}),j=e=>new Date(e).toLocaleDateString(`en-IN`,{day:`2-digit`,month:`2-digit`,year:`numeric`}),M=e=>String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`);function N(e){let t=`
<!DOCTYPE html>
<html><head>
<title>Invoice ${e.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #16a34a; }
  .logo-section h1 { font-size: 24px; color: #16a34a; font-weight: 800; letter-spacing: 1px; }
  .logo-section p { font-size: 11px; color: #666; margin-top: 2px; }
  .invoice-badge { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 12px 20px; text-align: right; }
  .invoice-badge h2 { font-size: 18px; color: #16a34a; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
  .invoice-badge .inv-num { font-size: 14px; font-weight: 700; color: #1a1a1a; font-family: monospace; margin-top: 4px; }
  .invoice-badge .inv-date { font-size: 11px; color: #666; margin-top: 2px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  .party-box { padding: 16px; background: #fafafa; border-radius: 8px; border: 1px solid #e5e5e5; }
  .party-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; font-weight: 600; margin-bottom: 8px; }
  .party-box p { font-size: 13px; line-height: 1.6; }
  .party-box .name { font-weight: 700; font-size: 14px; }
  .party-box .gstin { font-family: monospace; font-size: 12px; color: #16a34a; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #16a34a; color: white; padding: 10px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; }
  tbody td:last-child { text-align: right; font-family: monospace; font-weight: 600; }
  tbody td .sub { font-size: 11px; color: #888; margin-top: 2px; }
  .total-row td { border-top: 2px solid #16a34a; border-bottom: none; font-weight: 700; font-size: 16px; padding-top: 14px; }
  .total-row td:last-child { color: #16a34a; font-size: 18px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 11px; color: #888; line-height: 1.8; }
  .footer-right { text-align: right; }
  .seal { border: 2px solid #16a34a; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; color: #16a34a; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-align: center; line-height: 1.3; }
  .txn-info { background: #f8f8f8; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #555; }
  .txn-info span { font-weight: 600; color: #1a1a1a; }
  @media print { body { padding: 20px; } @page { margin: 1cm; } }
</style>
</head><body>

<div class="header">
  <div class="logo-section">
    <h1>HAJJ CARE</h1>
    <p>Digital Service Platform</p>
  </div>
  <div class="invoice-badge">
    <h2>Invoice</h2>
    <div class="inv-num">${M(e.invoice_number)}</div>
    <div class="inv-date">${M(A(e.invoice_date))}</div>
  </div>
</div>

<div class="parties">
  <div class="party-box">
    <h3>Billed By</h3>
    <p class="name">${M(e.org_name)}</p>
    <p>${M(e.org_address||`India`)}</p>
    ${e.org_gstin?`<p class="gstin">GSTIN: ${M(e.org_gstin)}</p>`:`<p style="color:#cc6600;font-size:11px;">GSTIN: Not configured</p>`}
  </div>
  <div class="party-box">
    <h3>Billed To</h3>
    <p class="name">${M(e.customer_name||`N/A`)}</p>
    ${e.customer_email?`<p>${M(e.customer_email)}</p>`:``}
    ${e.customer_phone?`<p>${M(e.customer_phone)}</p>`:``}
  </div>
</div>

<table>
  <thead>
    <tr><th>Description</th><th style="text-align:right">Amount (₹)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>
        ${M(e.service_name)}
        <div class="sub">Digital service fee (non-refundable)</div>
      </td>
      <td>₹${M(k(e.base_amount))}</td>
    </tr>
    <tr>
      <td>
        GST @${M(e.gst_rate)}%
        <div class="sub">Goods & Services Tax (India)</div>
      </td>
      <td>₹${M(k(e.gst_amount))}</td>
    </tr>
    <tr class="total-row">
      <td>Total Amount Paid</td>
      <td>₹${M(k(e.total_amount))}</td>
    </tr>
  </tbody>
</table>

${e.razorpay_payment_id?`
<div class="txn-info">
  Payment Transaction ID: <span>${M(e.razorpay_payment_id)}</span>
  ${e.razorpay_order_id?`<br/>Order ID: <span>${M(e.razorpay_order_id)}</span>`:``}
</div>`:``}

<div class="footer">
  <div class="footer-left">
    <p>This is a computer-generated invoice.</p>
    <p>For queries: info@hajjcare.in</p>
    <p>© ${new Date().getFullYear()} Sazo Management Pvt Ltd</p>
  </div>
  <div class="footer-right">
    <div class="seal">Digitally<br/>Verified</div>
  </div>
</div>

<script>window.onload = () => window.print();<\/script>
</body></html>`,n=window.open(``,`_blank`);n&&(n.document.write(t),n.document.close())}function P(e){let t=[`Invoice Number`,`Date`,`Service`,`Base Amount (₹)`,`GST Rate (%)`,`GST Amount (₹)`,`Total Amount (₹)`,`Status`,`Transaction ID`,`Organization`,`GSTIN`],n=e.map(e=>[e.invoice_number,j(e.invoice_date),e.service_name,k(e.base_amount),e.gst_rate,k(e.gst_amount),k(e.total_amount),e.payment_status,e.razorpay_payment_id||``,e.org_name,e.org_gstin||``]),r=[t.join(`,`),...n.map(e=>e.map(e=>`"${e}"`).join(`,`))].join(`
`),i=new Blob([r],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.href=a,o.download=`hajjcare-invoices-${new Date().toISOString().slice(0,10)}.csv`,o.click(),URL.revokeObjectURL(a)}var F=e=>{switch(e){case`paid`:return`default`;case`failed`:return`destructive`;default:return`secondary`}};function I(){let{user:e}=v(),{toast:t}=y(),[n,j]=(0,D.useState)([]),[M,I]=(0,D.useState)(!0),[L,R]=(0,D.useState)(`all`);(0,D.useEffect)(()=>{e&&(async()=>{let{data:t,error:n}=await p.from(`billing_invoices`).select(`*`).eq(`user_id`,e.id).order(`invoice_date`,{ascending:!1});n&&console.error(`Fetch invoices error:`,n),j(t||[]),I(!1)})()},[e]);let z=L===`all`?n:n.filter(e=>e.payment_status===L),B=n.filter(e=>e.payment_status===`paid`).reduce((e,t)=>e+t.total_amount,0),V=(0,D.useCallback)(()=>{if(z.length===0){t({title:`No data`,description:`No invoices to export.`,variant:`destructive`});return}P(z),t({title:`Exported!`,description:`CSV file downloaded successfully.`})},[z,t]);return(0,O.jsx)(i,{children:(0,O.jsxs)(`div`,{className:`container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5`,children:[(0,O.jsx)(x,{title:{en:`Billing History`,ar:`سجل الفواتير`,ur:`بلنگ ہسٹری`,hi:`बिलिंग इतिहास`},subtitle:{en:`Your invoices and payment records`,ar:`فواتيرك وسجلات الدفع`,ur:`آپ کی فیسیں اور ادائیگی کے ریکارڈ`,hi:`आपके चालान और भुगतान रिकॉर्ड`},icon:f,iconVariant:`primary`}),!M&&n.length>0&&(0,O.jsxs)(`div`,{className:`grid grid-cols-3 gap-3`,children:[(0,O.jsx)(_,{className:`border border-border/50`,children:(0,O.jsxs)(m,{className:`p-3 text-center`,children:[(0,O.jsx)(`p`,{className:`text-2xl font-bold text-foreground`,children:n.length}),(0,O.jsx)(`p`,{className:`text-[11px] text-muted-foreground font-medium`,children:`Total Invoices`})]})}),(0,O.jsx)(_,{className:`border border-border/50`,children:(0,O.jsxs)(m,{className:`p-3 text-center`,children:[(0,O.jsxs)(`p`,{className:`text-2xl font-bold text-primary`,children:[`₹`,k(B)]}),(0,O.jsx)(`p`,{className:`text-[11px] text-muted-foreground font-medium`,children:`Total Paid`})]})}),(0,O.jsx)(_,{className:`border border-border/50`,children:(0,O.jsxs)(m,{className:`p-3 text-center`,children:[(0,O.jsx)(`p`,{className:`text-2xl font-bold text-foreground`,children:n.filter(e=>e.payment_status===`paid`).length}),(0,O.jsx)(`p`,{className:`text-[11px] text-muted-foreground font-medium`,children:`Successful`})]})})]}),!M&&n.length>0&&(0,O.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,O.jsxs)(`div`,{className:`flex items-center gap-2 flex-1`,children:[(0,O.jsx)(u,{className:`h-4 w-4 text-muted-foreground`}),(0,O.jsxs)(E,{value:L,onValueChange:R,children:[(0,O.jsx)(C,{className:`w-[140px] h-9 text-sm`,children:(0,O.jsx)(S,{placeholder:`Filter`})}),(0,O.jsxs)(w,{children:[(0,O.jsx)(T,{value:`all`,children:`All`}),(0,O.jsx)(T,{value:`paid`,children:`Paid`}),(0,O.jsx)(T,{value:`failed`,children:`Failed`}),(0,O.jsx)(T,{value:`pending`,children:`Pending`})]})]})]}),(0,O.jsxs)(r,{variant:`outline`,size:`sm`,className:`gap-1.5 text-sm`,onClick:V,children:[(0,O.jsx)(c,{className:`h-3.5 w-3.5`}),`Export CSV`]})]}),M?(0,O.jsx)(`div`,{className:`text-center py-12 text-muted-foreground`,children:`Loading invoices...`}):z.length===0?(0,O.jsx)(_,{className:`border-2 border-dashed border-border/60`,children:(0,O.jsxs)(m,{className:`py-12 text-center text-muted-foreground`,children:[(0,O.jsx)(f,{className:`h-12 w-12 mx-auto mb-3 opacity-30`}),(0,O.jsx)(`p`,{children:n.length===0?`No invoices found. Make a payment to see your billing history.`:`No invoices match the selected filter.`})]})}):(0,O.jsx)(`div`,{className:`space-y-4`,children:z.map(e=>(0,O.jsx)(_,{className:`border-2 border-border/50 overflow-hidden`,children:(0,O.jsxs)(m,{className:`p-0`,children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/40`,children:[(0,O.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,O.jsx)(l,{className:`h-4 w-4 text-primary`}),(0,O.jsx)(`span`,{className:`font-mono text-sm font-bold`,children:e.invoice_number})]}),(0,O.jsx)(g,{variant:F(e.payment_status),children:e.payment_status.toUpperCase()})]}),(0,O.jsxs)(`div`,{className:`p-4 space-y-3`,children:[(0,O.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-muted-foreground`,children:[(0,O.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,O.jsx)(o,{className:`h-3 w-3`}),A(e.invoice_date)]}),(0,O.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,O.jsx)(a,{className:`h-3 w-3`}),e.org_name]})]}),(e.customer_name||e.customer_email)&&(0,O.jsxs)(`div`,{className:`flex items-center gap-3 text-xs`,children:[e.customer_name&&(0,O.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,O.jsx)(h,{className:`h-3 w-3 text-muted-foreground`}),(0,O.jsx)(`span`,{className:`text-foreground font-medium`,children:e.customer_name})]}),e.customer_email&&(0,O.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,O.jsx)(d,{className:`h-3 w-3 text-muted-foreground`}),(0,O.jsx)(`span`,{className:`text-muted-foreground`,children:e.customer_email})]})]}),(0,O.jsx)(b,{}),(0,O.jsxs)(`div`,{className:`space-y-1.5 text-sm`,children:[(0,O.jsxs)(`div`,{className:`flex justify-between`,children:[(0,O.jsx)(`span`,{className:`text-muted-foreground`,children:e.service_name}),(0,O.jsxs)(`span`,{className:`tabular-nums font-medium`,children:[`₹`,k(e.base_amount)]})]}),(0,O.jsxs)(`div`,{className:`flex justify-between`,children:[(0,O.jsxs)(`span`,{className:`text-muted-foreground`,children:[`GST @`,e.gst_rate,`%`]}),(0,O.jsxs)(`span`,{className:`tabular-nums font-medium`,children:[`₹`,k(e.gst_amount)]})]}),(0,O.jsx)(b,{}),(0,O.jsxs)(`div`,{className:`flex justify-between font-bold text-base`,children:[(0,O.jsx)(`span`,{className:`text-foreground`,children:`Total`}),(0,O.jsxs)(`span`,{className:`text-primary tabular-nums`,children:[`₹`,k(e.total_amount)]})]})]}),(0,O.jsxs)(`div`,{className:`text-[11px] text-muted-foreground space-y-0.5 pt-1`,children:[e.org_gstin?(0,O.jsxs)(`p`,{className:`font-mono`,children:[`GSTIN: `,e.org_gstin]}):(0,O.jsx)(`p`,{className:`text-destructive/70`,children:`GSTIN: Not configured`}),e.razorpay_payment_id&&(0,O.jsxs)(`p`,{className:`font-mono`,children:[`Txn: `,e.razorpay_payment_id]})]}),e.payment_status===`paid`&&(0,O.jsxs)(r,{variant:`outline`,size:`sm`,className:`w-full gap-2 mt-2`,onClick:()=>N(e),children:[(0,O.jsx)(s,{className:`h-3.5 w-3.5`}),`Download Invoice PDF`]})]})]})},e.id))})]})})}export{I as default};