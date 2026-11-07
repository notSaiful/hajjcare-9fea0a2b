/* Shared language supplement; ordinary UI drafts only; no generated devotional meanings. */
(() => {
const D=window.__I18N;
if(!D)return;
const extra=window.__HC_EXTRA||{},ROOT=new WeakMap(),ATTR=new WeakMap();
const protectedStrings=new Set((window.__HC_PROTECTED||[]).flat().filter(Boolean));
const trim=s=>String(s??'').replace(/\s+/g,' ').trim();
const en=hi=>Array.isArray(extra.en?.[hi])?extra.en[hi][0]:undefined;
const local=(hi,l)=>{const pair=extra[l]?.[hi];return Array.isArray(pair)?pair[1]:typeof pair==='string'?pair:undefined};
const nativeSource=(extra.en?Object.values(extra.en):[]).filter(x=>Array.isArray(x)).map(x=>x[0]).join('');
const English=new Map(),alias=new Map(),protectedSet=protectedStrings;
const canonicalIndices=new Map();
function addAlias(k,i){if(!trim(k))return;alias.set(trim(k),i)}
D.K.forEach((k,i)=>k.split('|').forEach(k=>addAlias(k,i)));
Object.entries(extra.en||{}).forEach(([hi,p])=>{if(accepted(hi))English.set(trim(p[0]),hi)});
function accepted(hi){return D.K.some(k=>k===hi||k.split('|').includes(hi))}
for(const [hi,p] of Object.entries(extra.en||{})){
 if(accepted(hi))continue;
 const index=D.K.length;D.K.push(hi);
 for(const l of Object.keys(D.T))D.T[l].push(l==='hi'?hi:l==='en'?p[0]:local(hi,l)||hi);
 addAlias(hi,index);English.set(trim(p[0]),hi);
}
D.K.forEach((k,i)=>{for(const part of k.split('|'))addAlias(part,i);canonicalIndices.set(trim(k),i);addAlias(D.T.en[i],i);addAlias(D.T.hi[i],i);English.set(trim(D.T.en[i]),D.T.hi[i])});
function isReligious(en,hi){return protectedSet.has(trim(en))||protectedSet.has(trim(hi))||/हाज़िर हूँ, ऐ अल्लाह|जिसने अल्लाह के लिए हज|हज्ज-ए-मबरूर का बदला|हमारे रब, हमें दुनिया|अल्लाह के सिवा कोई माबूद|और लोगों में हज का ऐलान|Whoever performs Hajj for Allah/.test(hi)}
window.__hcTranslate=(english,hindi,l)=>{
 if(l==='hi')return hindi;
 if(isReligious(english,hindi))return l==='en'?english:hindi;
 if(local(hindi,l)!==undefined)return local(hindi,l);
 if(l==='en')return en(hindi)??english;
 let key=hindi;if(!alias.has(trim(key))&&English.has(trim(key)))key=English.get(trim(key));
 let idx=alias.get(trim(key));if(idx!==undefined&&D.T[l])return D.T[l][idx]??hindi;
 return hindi;
};
window.__hcOldTranslate=(english,hindi,l)=>{
 if(l==='hi')return hindi;
 const fixed=isReligious(english,hindi);
 if(fixed)return english;
 if(l==='en')return en(hindi)??english;
 if(fixed)return hindi;
 const explicit=local(hindi,l);if(explicit!==undefined&&explicit!==null&&explicit!=='')return explicit;
 let key=hindi;
 if(!alias.has(trim(key))&&English.has(trim(key)))key=English.get(trim(key));
 const idx=alias.get(trim(key));
 if(idx!==undefined&&D.T[l])return D.T[l][idx]??hindi;
 if(local(hindi,l))return local(hindi,l);
 // Exact shared label, a small ordinary term not a meaning.
 if(trim(hindi)==='अपनी भाषा चुनें')return window.__hcTranslate('Choose your language','अपनी भाषा चुनें',l);
 return hindi;
};
window.__hcMark=l=>{
 document.documentElement.lang=l==='mni'?'mni-Mtei':l==='sat'?'sat-Olck':l;
 document.documentElement.dir=['ur','ks','sd'].includes(l)?'rtl':'ltr';
 document.documentElement.dataset.ui=l;
};
function restore(){
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const saved=ROOT.get(n);if(saved!==undefined)n.nodeValue=saved}
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{const saved=ATTR.get(el);if(saved)Object.entries(saved).forEach(([a,v])=>el.setAttribute(a,v))});
}
function applyText(l){if(l!=='hi')document.querySelectorAll('.zmsg').forEach(e=>{if(e.dataset.original===undefined)e.dataset.original=e.innerHTML;e.textContent=e.textContent});
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){
  const parent=n.parentElement;
  if(!parent||parent.closest('script,style,[lang=ar],.ar,.arb,.htb,.lc b,.lmenu,.lsel,.hcl,.hc-review-panel,.hc-fixed-meaning,.hc-draft-note,.hc-explore-meaning,.imean,.mean,.zc,.zm,.zmsg,[data-hc-protect],p.imean,p.mean'))continue;
  if(!ROOT.has(n))ROOT.set(n,n.nodeValue);
  let original=ROOT.get(n);if(!accepted(trim(original))){const canonical=trim(original),i=alias.get(canonical),source=i===undefined?English.get(canonical):D.T.hi[i];if(source&&source!==canonical)ROOT.set(n,source)}
  const raw=ROOT.get(n),key=trim(raw);if(!key)continue;
  const idx=alias.get(key),english=idx===undefined?English.get(key):D.T.en[idx];
  let explicit=local(key,l);let out=explicit!==undefined?explicit:english===undefined?undefined:window.__hcTranslate(english,key,l);
  if(l==='hi'&&key)out=key;
  if(!out&&l==='en'&&local(key,'en')!==undefined)out=en(key)??key;
  if(out!==undefined)n.nodeValue=key===raw?out:raw.replace(key,out);
 }
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
  for(const a of ['placeholder','aria-label','title']){
   if(!el.hasAttribute(a))continue;
   const saved=ATTR.get(el)||{};if(saved[a]===undefined)saved[a]=el.getAttribute(a);{const k=trim(saved[a]);if(!accepted(k)){const i=alias.get(k),source=i===undefined?English.get(k):D.T.hi[i];if(source&&source!==k)saved[a]=source}}ATTR.set(el,saved);
   if(el.closest('script,style,[lang=ar],.ar,.arb,.lmenu'))continue;
   const raw=saved[a],k=trim(raw);if(!k)continue;
   const idx=alias.get(k),english=idx===undefined?English.get(k):D.T.en[idx];
   if(l==='hi')el.setAttribute(a,raw);
   else if(local(k,l)!==undefined)el.setAttribute(a,local(k,l));
   else if(english!==undefined)el.setAttribute(a,window.__hcTranslate(english,k,l));
   else if(l==='en'&&extra.en?.[k])el.setAttribute(a,en(k));
  }
 });
}
const base=window.__i18nBase||window.__i18n;
if(base){
 window.__i18n=l=>{
  base('hi');restore();if(l!=='hi')base(l);applyText(l);window.__hcMark(l);review(l);
  
 };
 if(window.__hcApplyBase===undefined)window.__hcApplyBase=l=>{if(l!=='hi'){applyText(l);review(l)}};
}
function review(l){
 document.querySelectorAll('.hc-review-panel').forEach(e=>e.remove());
 for(const sel of ['p.imean','p.mean'])document.querySelectorAll(sel).forEach((p,i)=>{
  const id=sel+i,src=(window.__HC_SOURCE_HI||{})[id],srcEn=(window.__HC_SOURCE_EN||{})[id];
  if(src)p.innerHTML=l==='en'&&srcEn?srcEn:src;
  else if(p.dataset.hcOriginal!==undefined)p.innerHTML=p.dataset.hcOriginal;
  p.style.display='';if(['hi','en'].includes(l)||!src)return;
  const panel=document.createElement('div');panel.className='hc-review-panel';
  panel.append(notice(l));p.after(panel);
 });
}

function expandSourceMeanings(box,l){box.append(notice(l));}
function notice(l){const p=document.createElement('p');p.className='hc-review-notice';p.textContent=window.__hcTranslate('Pending ulama review: original Arabic and existing Hindi / English meaning unchanged.','उलूमा की समीक्षा लंबित: मूल अरबी और मौजूदा हिंदी/अंग्रेज़ी अर्थ अपरिवर्तित हैं।',l);p.style.cssText='border-inline-start:3px solid #b8954f;padding-inline-start:8px;color:#765b22';return p}
const ex=window.__exI18n;
if(ex)window.__exI18n=l=>ex(l);
window.__hcAfterRender=l=>{
 restore();applyText(l);window.__hcMark(l);
 document.querySelectorAll('.hc-review-panel-explore').forEach(e=>e.remove());
 const el=document.querySelector('.hc-explore-meaning');
 if(el){if(el.dataset.originalHi===undefined)el.dataset.originalHi=el.innerHTML;el.style.display='';el.innerHTML=l==='en'?el.dataset.originalEn:el.dataset.originalHi;if(l!=='hi'&&l!=='en'){const panel=document.createElement('div');panel.className='hc-review-panel hc-review-panel-explore';expandSourceMeanings(panel,l);el.after(panel)}}
 if(document.getElementById('zbox')&&l!=='hi'&&l!=='en'&&!document.querySelector('.zc > .hc-corpus-note')){const n=notice(l);n.classList.add('hc-corpus-note');document.getElementById('zbox').after(n)}
};
// Established layout order is explicit, while individual translated text respects RTL bidi.
const css=document.createElement('style');css.textContent='.lc,.lmenu,.lsel,.hcl,.path ol,.steps ol,#opne .lscroll,#opener .lscroll,.lgrid{direction:ltr!important}.lc,.lmenu button,.hcl button{dir:ltr}.path li,.steps li{unicode-bidi:plaintext}.hc-corpus-note{font-size:12px;text-align:center}.hc-draft-note{text-align:center;color:#765b22;font-size:13px;margin:8px}';document.head.append(css);
window.addEventListener('beforeprint',()=>{const b=document.querySelector('#main .cta button');if(b)b.textContent=window.__hcTranslate('Download (Print / PDF) →','डाउनलोड (प्रिंट / PDF) →',document.documentElement.lang)});
window.addEventListener('afterprint',()=>{const b=document.querySelector('#main .cta button');if(b)b.textContent='⬇️ '+window.__hcTranslate('Save as PDF / Print','PDF सेव करें / प्रिंट',document.documentElement.lang)});
if(document.getElementById('opener')){const l=localStorage.getItem('hc_lang')||'hi';if(['ur','ks','sd'].includes(l))window.__hcMark(l)}
const pageName=location.pathname.split('/').filter(Boolean).pop()||'index.html';
if(pageName==='library.html'||pageName==='library')initLibrary();
if(pageName==='explore.html'||pageName==='explore'){
 const l=document.documentElement.dataset.ui||localStorage.getItem('hc_lang')||'hi';window.__hcAfterRender(l);
}
function initLibrary(){
 const names={ur:'اردو',hi:'हिन्दी',bn:'বাংলা',ta:'தமிழ்',te:'తెలుగు',kn:'ಕನ್ನಡ',ml:'മലയാളം',ks:'کٲشُر',gu:'ગુજરાતી',mr:'मराठी',en:'English',as:'অসমীয়া',brx:'बर’',doi:'डोगरी',kok:'कोंकणी',mai:'मैथिली',mni:'ꯃꯤꯇꯩꯂꯣꯟ',ne:'नेपाली',or:'ଓଡ଼ିଆ',pa:'ਪੰਜਾਬੀ',sa:'संस्कृतम्',sat:'ᱥᱟᱱᱛᱟᱲᱤ',sd:'سنڌي'};
 const bar=document.createElement('div');bar.className='hcl';bar.style.cssText='position:relative;text-align:center;margin:8px auto;max-width:980px';
 const b=document.createElement('button');b.id='liblang';b.type='button';b.textContent='🌐 All languages';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','libmenu');b.style.cssText='padding:8px 15px;border:1px solid #b8954f;border-radius:8px;background:#fff';
 const m=document.createElement('div');m.className='lmenu';m.id='libmenu';m.hidden=true;m.style.cssText='position:absolute;top:42px;left:50%;transform:translateX(-50%);background:#fff;z-index:2000;max-height:65vh;overflow:auto;border:1px solid #b8954f;padding:10px;columns:3;min-width:450px;max-width:94vw';
 Object.entries(names).forEach(([l,n])=>{const q=document.createElement('button');q.type='button';q.setAttribute('role','menuitemradio');q.setAttribute('aria-checked','false');q.dataset.lang=l;q.dataset.l=l;q.textContent=n;q.style.cssText='display:block;background:#fff;padding:7px;border:0;width:140px;text-align:left;font-size:12px';q.onclick=()=>{m.hidden=true;b.setAttribute('aria-expanded','false');window.__hcUILang=l;localStorage.setItem('hc_lang',l);setLibrary(l);b.focus()};m.append(q)});
 const close=()=>{m.hidden=true;b.setAttribute('aria-expanded','false')};b.onclick=()=>{m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(!m.hidden))};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden){close();b.focus()}});document.addEventListener('click',e=>{if(!m.hidden&&!m.contains(e.target)&&e.target!==b)close()});bar.append(b,m);document.querySelector('header').after(bar);
 function setLibrary(l){restore();applyText(l);window.__hcMark(l);m.querySelectorAll('[data-lang]').forEach(q=>q.setAttribute('aria-checked',String(q.dataset.lang===l)));
  document.querySelector('.hc-draft-note')?.remove();if(!['hi','en'].includes(l)){const n=document.createElement('p');n.className='hc-draft-note';n.textContent=window.__hcTranslate('Machine-assisted translations — native review required.','ये मशीन-सहायित अनुवाद हैं — मातृभाषी समीक्षा आवश्यक है।',l);bar.after(n)}
 }
 setLibrary(localStorage.getItem('hc_lang')||'hi');
}
window.__hcDebug=k=>({local:local(k,"mr"),alias:alias.get(k),english:English.get(k),extra:extra.mr[k]});window.__hcReport=()=>({dictionaryKeys:D.K.length,locale:document.documentElement.lang,dir:document.documentElement.dir,reviewPanels:document.querySelectorAll('.hc-review-panel').length,privacy:'No network translation calls; fixed raw Arabic'});
})();
