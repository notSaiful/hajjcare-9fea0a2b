const a=document.getElementById('talbiya'),m=document.getElementById('mute'),intro=document.getElementById('intro'),V=.8;
let voice='f',on_=false;a.src=a.dataset[voice];a.volume=0;
function ramp(el,to,ms,done){const s=el.volume,t0=performance.now();(function f(t){const p=Math.min((t-t0)/ms,1);el.volume=Math.min(1,Math.max(0,s+(to-s)*p));if(p<1)requestAnimationFrame(f);else done&&done()})(t0)}
function mark(){document.querySelectorAll('.vtoggle button').forEach(b=>{b.classList.toggle('on',b.dataset.v===voice);b.setAttribute('aria-pressed',b.dataset.v===voice)});const sp=document.getElementById('spk');if(sp)sp.className='spk '+voice+(sp.classList.contains('talk')?' talk':'')}
function on(){if(window.__talbiyaDone)return;window.__userMuted=false;a.play().then(()=>{on_=true;ramp(a,V,2500);m.classList.add('playing');m.querySelector('b').textContent='आवाज़'}).catch(()=>{})}
function off(){window.__userMuted=true;on_=false;window.__zoyaStop&&window.__zoyaStop();ramp(a,0,1500,()=>a.pause());m.classList.remove('playing');m.querySelector('b').textContent='ख़ामोश'}
function setVoice(v){if(v===voice)return;voice=v;localStorage.setItem('hc-voice',v);mark();
 if(!on_){a.src=a.dataset[v];return}
 const b=new Audio(a.dataset[v]);b.volume=0;b.play().then(()=>{ramp(b,V,1800);ramp(a,0,1800,()=>{a.pause();a.src=b.src;a.currentTime=b.currentTime;a.volume=V;a.play().then(()=>{b.pause()}).catch(()=>{})})}).catch(()=>{a.src=a.dataset[v];a.play()})}
document.querySelectorAll('.vtoggle button').forEach(b=>b.onclick=()=>setVoice(b.dataset.v));mark();
document.getElementById('enter').onclick=()=>{intro.classList.add('gone');document.body.classList.remove('locked');on()};
m.onclick=()=>on_?off():on();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
addEventListener('scroll',()=>{const y=scrollY;document.querySelectorAll('.hero .clouds').forEach((c,i)=>c.style.translate=`0 ${y*(.15+i*.1)}px`)},{passive:true});

const hm=document.getElementById('hmean'),hb=document.querySelectorAll('.hmb');let ducked=false;
function hmUI(p){hb.forEach(b=>{b.classList.toggle('playing',p);b.textContent=p?'❚❚ रोकें':'▶ हिंदी मायने सुनें'})}
function hmEnd(){hmUI(false);if(ducked){ducked=false;if(on_){a.play().catch(()=>{});ramp(a,V,1500)}}}
hb.forEach(b=>b.onclick=e=>{e.stopPropagation();if(!hm.paused){hm.pause();hm.currentTime=0;hmEnd();return}
 if(on_&&!a.paused){ducked=true;ramp(a,0,700,()=>{if(ducked)a.pause()})}
 hm.volume=1;hm.play().then(()=>hmUI(true)).catch(hmEnd)});
hm.onended=hmEnd;

a.addEventListener('ended',()=>{a.currentTime=0;on_=false;m.classList.remove('playing');m.querySelector('b').textContent='ख़ामोश'});

/* demos */
(()=>{const ov=document.getElementById('demo');let open=false;
const show=k=>{if(k==='training'){const i=document.getElementById('intro');if(i&&!i.classList.contains('gone'))document.getElementById('enter').click();setTimeout(()=>{const t=document.getElementById('training');scrollTo({top:t.getBoundingClientRect().top+scrollY-70,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const w=t.querySelector('.wk');if(w)w.open=true},i&&!i.classList.contains('gone')?300:0);return}
ov.querySelectorAll('.dp').forEach(p=>p.hidden=p.dataset.p!==k);ov.hidden=false;requestAnimationFrame(()=>ov.classList.add('on'));if(!open){history.pushState({demo:1},'');open=true}ov.querySelector('.dx').focus();if(k==='zoya')window.__zoyaOpen()};
const hide=(fromPop)=>{if(!open)return;open=false;ov.classList.remove('on');setTimeout(()=>ov.hidden=true,400);speechSynthesis&&speechSynthesis.cancel();window.__zoyaStop&&window.__zoyaStop();if(!fromPop)history.back()};
document.querySelectorAll('[data-demo]').forEach(e=>{const go=ev=>{ev.stopPropagation();show(e.dataset.demo)};e.addEventListener('click',go);e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go(ev)}})});
ov.querySelector('.dx').onclick=()=>hide();ov.addEventListener('click',e=>{if(e.target===ov)hide()});
addEventListener('keydown',e=>{if(e.key==='Escape')hide()});addEventListener('popstate',()=>hide(true));
const chat=document.getElementById('chat');let typing=null,fin=null;
const zv=document.getElementById('zv'),zav=document.getElementById('zav'),SEG=[[0,6.72],[7.32,18.6],[19.2,24.72],[25.32,32.28],[32.88,39.8]];let zEnd=0,zDuck=false,zGreeted=false;
const zStop=()=>{if(!zv.paused)zv.pause();zav.classList.remove('talk');if(zDuck){zDuck=false;if(on_){a.play().catch(()=>{});ramp(a,V,1200)}}};
const zSay=i=>{zStop();if(window.__userMuted)return;const s=SEG[i];if(on_&&!a.paused){zDuck=true;ramp(a,0,500,()=>{if(zDuck)a.pause()})}zv.currentTime=s[0];zEnd=s[1];zv.volume=1;zv.play().then(()=>zav.classList.add('talk')).catch(zStop)};
zv.addEventListener('timeupdate',()=>{if(zv.currentTime>=zEnd)zStop()});zv.addEventListener('ended',zStop);
const zAsk=(qt,t,seg)=>{clearInterval(typing);fin&&fin();const q=document.createElement('div');q.className='msg u';q.textContent=qt;chat.append(q);const a2=document.createElement('div');a2.className='msg z';chat.append(a2);let i=0;fin=()=>{a2.textContent=t;fin=null};if(seg!=null)zSay(seg);else zStop();typing=setInterval(()=>{a2.textContent=t.slice(0,++i);chat.scrollTop=chat.scrollHeight;if(i>=t.length){clearInterval(typing);fin=null}},18)};
const zBtns=[...ov.querySelectorAll('[data-a]')];zBtns.forEach(b=>b.onclick=()=>zAsk(b.textContent,b.dataset.a,+b.dataset.s));
const norm=x=>x.toLowerCase().replace(/[़\u093c]/g,'');
const zMatch=x=>{const n=norm(x);let best=null,sc=0;zBtns.forEach(b=>{const c=b.dataset.k.split(',').filter(k=>n.includes(norm(k))).length;if(c>sc){sc=c;best=b}});return best};
const zQ=document.getElementById('zq'),zin=document.getElementById('zin');
const zHandle=x=>{x=x.trim();if(!x)return;const b=zMatch(x);if(b)zAsk(x,b.dataset.a,+b.dataset.s);else{zAsk(x,'यह डेमो है — असली ऐप में ज़ोया हर सवाल का जवाब क़ुरआन और हदीस की रौशनी में देगी। अभी नीचे दिए नमूना सवालों में से कोई चुनें।',null);const qs=ov.querySelector('[data-p="zoya"] .qs');qs.classList.remove('nudge');void qs.offsetWidth;qs.classList.add('nudge')}};
zin.onsubmit=e=>{e.preventDefault();zHandle(zQ.value);zQ.value=''};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,zmic=document.getElementById('zmic');
const zErr=c=>c==='not-allowed'||c==='service-not-allowed'?'माइक की इजाज़त दें (ब्राउज़र सेटिंग में Microphone → Allow) / Please allow microphone access':c==='no-speech'?'आवाज़ नहीं सुनाई दी, फिर से बोलें / Didn\'t hear anything, try again':c==='network'?'इंटरनेट चेक करें / Check internet':'लिखकर पूछें / Please type your question';if(SR){zmic.hidden=false;let r=null;zmic.onclick=()=>{if(r){r.stop();return}const ph=zQ.placeholder;let it='',done=false;const go=t=>{if(done||!(t=t.trim()))return;done=true;zQ.value=t;zHandle(t);zQ.value=''};r=new SR();r.lang='hi-IN';r.interimResults=true;r.maxAlternatives=1;zmic.classList.add('rec');zQ.placeholder=ph;r.onresult=e=>{let f='',i='';for(let k=e.resultIndex||0;k<e.results.length;k++){const x=e.results[k];x.isFinal?f+=x[0].transcript:i+=x[0].transcript}if(f){it='';go(f)}else{it=i;zQ.value=i}};r.onerror=e=>{done=true;zQ.value='';zQ.placeholder=zErr(e&&e.error);setTimeout(()=>zQ.placeholder=ph,5000)};r.onend=()=>{go(it);zmic.classList.remove('rec');r=null};try{r.start()}catch(_){zmic.classList.remove('rec');r=null}}}
window.__zoyaOpen=()=>{if(!zGreeted){zGreeted=true;zSay(0)}};window.__zoyaStop=zStop;
const tx=document.getElementById('tx'),wave=ov.querySelector('.wave');let cur=null;
const say=()=>{if(!cur||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(cur.dataset.ar);u.lang='ar-SA';const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.startsWith('ar'));if(v)u.voice=v;u.rate=.85;wave.classList.add('play');u.onend=u.onerror=()=>wave.classList.remove('play');speechSynthesis.speak(u)};
ov.querySelectorAll('[data-ar]').forEach(b=>b.onclick=()=>{cur=b;tx.querySelector('.hi').textContent=b.textContent;tx.querySelector('.arb').textContent=b.dataset.ar;tx.querySelector('.trl').textContent=b.dataset.tr;wave.classList.add('play');setTimeout(()=>wave.classList.remove('play'),1600);tx.classList.remove('in');void tx.offsetWidth;tx.classList.add('in')});
tx.querySelector('.say').onclick=say;if(!('speechSynthesis'in window))tx.querySelector('.say').hidden=true;
window.__demo=show;})();

/* opener + speaker + languages */
(()=>{const op=document.getElementById('opener'),sp=document.getElementById('spk');if(!op)return;
const OFF={m:4.2,f:3.8};let first=true;
a.addEventListener('playing',()=>sp.classList.add('talk'));['pause','ended'].forEach(e=>a.addEventListener(e,()=>sp.classList.remove('talk')));
const go=()=>{if(intro.classList.contains('opened'))return;intro.classList.add('opened');document.getElementById('enter')?.click();
 if(first){first=false;const seek=()=>{try{a.currentTime=OFF[voice]||0}catch(_){}};if(a.readyState>0)seek();else a.addEventListener('loadedmetadata',seek,{once:true})}
 on()};
const AC=()=>{try{const C=window.AudioContext||window.webkitAudioContext;const x=window.__ac||(window.__ac=new C());if(x.state!=='running')x.resume();return x}catch(_){return null}};window.__AC=AC;
const chime=()=>{const x=AC();if(!x)return;try{const t=x.currentTime+.03,out=x.createGain();out.gain.value=.22;out.connect(x.destination);const dl=x.createDelay(1);dl.delayTime.value=.28;const fb=x.createGain();fb.gain.value=.4;dl.connect(fb);fb.connect(dl);dl.connect(out);
 [[523.25,1],[659.25,.7],[783.99,.6],[1046.5,.55],[1568,.3],[2093,.2]].forEach(([f,a2],i)=>{const d=t+i*.09,o=x.createOscillator(),v=x.createGain();o.type='sine';o.frequency.value=f;v.gain.setValueAtTime(0,d);v.gain.linearRampToValueAtTime(.32*a2,d+.015);v.gain.exponentialRampToValueAtTime(.0001,d+4);o.connect(v);v.connect(out);v.connect(dl);o.start(d);o.stop(d+4.1)});
 const n=x.sampleRate*2.6,buf=x.createBuffer(1,n,x.sampleRate),c=buf.getChannelData(0);for(let i=0;i<n;i++)c[i]=Math.random()*2-1;const s=x.createBufferSource();s.buffer=buf;const bp=x.createBiquadFilter();bp.type='bandpass';bp.Q.value=.8;bp.frequency.setValueAtTime(400,t);bp.frequency.exponentialRampToValueAtTime(3800,t+2.2);const w=x.createGain();w.gain.setValueAtTime(0,t);w.gain.linearRampToValueAtTime(0,t+.9);w.gain.linearRampToValueAtTime(0,t+1.8);w.gain.linearRampToValueAtTime(0,t+2.5);s.connect(bp);bp.connect(w);w.connect(out);s.start(t);s.stop(t+2.6);
 for(let k=0;k<8;k++){const d=t+.5+k*.2,o=x.createOscillator(),v=x.createGain();o.frequency.value=2093*(1+((k*7)%5)*.25);v.gain.setValueAtTime(0,d);v.gain.linearRampToValueAtTime(.07,d+.01);v.gain.exponentialRampToValueAtTime(.0001,d+1.2);o.connect(v);v.connect(out);v.connect(dl);o.start(d);o.stop(d+1.3)}}catch(_){}};

let dOpen=false;const tap=op.querySelector('.otap');
const showTap=()=>{if(document.getElementById('talbiya-tap')||window.__talbiyaDone)return;const b=document.createElement('button');b.type='button';b.id='talbiya-tap';b.textContent='आवाज़ सुनें';b.addEventListener('click',e=>{e.stopPropagation();const pr=a.play();pr&&pr.then(()=>{on_=true;b.remove()}).catch(()=>{})});document.body.appendChild(b)};
const openDoor=()=>{if(dOpen)return;dOpen=true;window.__bgmStart&&window.__bgmStart();chime();op.classList.add('dopen');
 const begin=()=>{if(window.__talbiyaDone)return;try{a.muted=false;a.volume=V}catch(_){}if(first){first=false;const seek=()=>{try{a.currentTime=OFF[voice]||0}catch(_){}};if(a.readyState>0)seek();else a.addEventListener('loadedmetadata',seek,{once:true})}const pr=a.play();if(pr&&pr.then)pr.then(()=>{on_=true;m&&m.classList.add('playing');const lb=m&&m.querySelector('b');if(lb)lb.textContent='आवाज़'}).catch(showTap);else on_=true};
 begin();
 setTimeout(()=>{const tx=tap&&tap.querySelector('.otxt');if(tx)tx.textContent='touch करें';else if(tap)tap.textContent='touch करें';op.setAttribute('aria-label','touch करें')},4600)};
window.__openDoor=openDoor;
const act=()=>dOpen?go():openDoor();
op.addEventListener('click',act);op.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}});
const t=document.getElementById('ltoast');let tt;
const selLang=l=>{document.querySelectorAll('.lc').forEach(x=>{const y=x.dataset.l===l;x.setAttribute('aria-pressed',y?'true':'false');x.classList.toggle('sel',y)});document.querySelectorAll('.lmenu [data-l]').forEach(x=>x.setAttribute('aria-checked',x.dataset.l===l?'true':'false'))};
window.__selLang=selLang;
const choose=(l,c)=>{selLang(l);window.__i18n&&window.__i18n(l);window.__langSay&&window.__langSay(l,c)};window.__choose=choose;
document.querySelectorAll('.lc').forEach(c=>c.addEventListener('click',e=>{e.stopPropagation();choose(c.dataset.l,c)}));
const nl=document.querySelector('nav .nl');if(nl){const mn=document.createElement('div');mn.className='lmenu';mn.id='lmenu';mn.setAttribute('role','menu');mn.hidden=true;
 document.querySelectorAll('#langs .lgrid .lc').forEach(c=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','menuitemradio');b.setAttribute('aria-checked','false');b.dataset.l=c.dataset.l;const n=c.querySelector('b');b.innerHTML='<b></b><small></small>';b.querySelector('b').textContent=n.textContent;b.querySelector('b').lang=n.lang;if(n.dir)b.querySelector('b').dir=n.dir;b.querySelector('small').textContent=(c.querySelector('small').textContent.split('· ')[1]||'');mn.appendChild(b);
  b.addEventListener('click',e=>{e.stopPropagation();const g=document.querySelector('#langs .lgrid .lc[data-l="'+c.dataset.l+'"]');choose(c.dataset.l,g);mn.hidden=true;nl.setAttribute('aria-expanded','false')})});
 nl.setAttribute('aria-haspopup','menu');nl.setAttribute('aria-expanded','false');nl.setAttribute('aria-controls','lmenu');document.body.appendChild(mn);
 nl.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const o=mn.hidden;mn.hidden=!o;nl.setAttribute('aria-expanded',o?'true':'false')});
 document.addEventListener('click',e=>{if(!mn.hidden&&!mn.contains(e.target)&&e.target!==nl){mn.hidden=true;nl.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mn.hidden){mn.hidden=true;nl.setAttribute('aria-expanded','false');nl.focus()}})}
})();
;(()=>{const m=document.getElementById('bgm'),t=document.getElementById('mtg');if(!m||!t)return;const BASE=.3,DUCK=.05;let on=localStorage.getItem('hc_music2')!=='off',tgt=BASE,started=false,done=false,raf;m.loop=false;m.removeAttribute('loop');window.__bgm=m;m.volume=0;
const fade=(to,ms)=>{cancelAnimationFrame(raf);const f=m.volume,s=performance.now();const st=n=>{const k=Math.min(1,(n-s)/ms);m.volume=Math.max(0,Math.min(1,f+(to-f)*k));if(k<1)raf=requestAnimationFrame(st)};raf=requestAnimationFrame(st)};
const voices=['talbiya','zv','hmean'].map(i=>document.getElementById(i)).filter(Boolean);
let ext=false;const anyV=()=>ext||voices.some(a=>!a.paused&&!a.ended);
const upd=()=>{tgt=anyV()?DUCK:BASE;if(started&&on&&!done&&!fo&&!m.paused)fade(tgt,anyV()?400:1200)};
window.__duck=b=>{ext=!!b;upd()};voices.forEach(a=>['playing','play','pause','ended'].forEach(e=>a.addEventListener(e,upd)));
const ui=()=>{t.classList.toggle('off',!on);t.setAttribute('aria-pressed',on)};ui();
const hint=document.createElement('div');hint.id='shint';hint.textContent='🔊 आवाज़ के लिए छुएँ';document.body.appendChild(hint);
const start=auto=>{if(!on||started||done)return;if(auto!==true)window.__AC&&window.__AC();m.muted=false;m.volume=.35;let p;try{p=m.play()}catch(e){p=Promise.reject(e)}Promise.resolve(p).then(()=>{if(started)return;started=true;hint.classList.remove('on');cancelAnimationFrame(raf);m.volume=anyV()?DUCK:.35;tgt=m.volume;}).catch(()=>{if(auto!==true)hint.classList.add('on')})};
window.__bgmStart=start;start(true);
let fo=false;m.addEventListener('timeupdate',()=>{if(!fo&&m.duration&&m.duration-m.currentTime<3.2&&!m.paused){fo=true;fade(0,3000)}});
m.addEventListener('ended',()=>{done=true;cancelAnimationFrame(raf);m.pause();window.__bgmDone=true});window.__bgmState=()=>({started,done,paused:m.paused,t:m.currentTime,loop:m.loop});
const first=e=>{if(e.target===t)return;start();if(started)['pointerdown','touchstart','touchend','keydown','click','wheel'].forEach(x=>document.removeEventListener(x,first,true))};
['pointerdown','touchstart','touchend','keydown','click','wheel'].forEach(x=>document.addEventListener(x,first,true));
t.addEventListener('click',e=>{e.stopPropagation();on=!on;localStorage.setItem('hc_music2',on?'on':'off');ui();if(on){if(done||m.ended){done=false;fo=false;try{m.currentTime=0}catch(_){}m.volume=0;started=true;Promise.resolve(m.play()).catch(()=>{});fade(tgt,800)}else if(started){m.play();fade(tgt,800)}else start()}else{fade(0,500);setTimeout(()=>{if(!on)m.pause()},550)}})})();
;(()=>{const S={"hi": "अस्सलामु अलैकुम। HajCare AI — आपका हज साथी, अब हिंदी में।", "ur": "السلام علیکم۔ HajCare AI — آپ کا حج ساتھی، اب اردو میں۔", "bn": "আসসালামু আলাইকুম। HajCare AI — আপনার হজের সাথী, এখন বাংলায়।", "ta": "அஸ்ஸலாமு அலைக்கும். HajCare AI — உங்கள் ஹஜ் துணை, இப்போது தமிழில்.", "te": "అస్సలాము అలైకుమ్. HajCare AI — మీ హజ్ సహచరుడు, ఇప్పుడు తెలుగులో.", "kn": "ಅಸ್ಸಲಾಮು ಅಲೈಕುಮ್. HajCare AI — ನಿಮ್ಮ ಹಜ್ ಸಂಗಾತಿ, ಈಗ ಕನ್ನಡದಲ್ಲಿ.", "ml": "അസ്സലാമു അലൈക്കും. HajCare AI — നിങ്ങളുടെ ഹജ്ജ് സഹയാത്രികൻ, ഇപ്പോൾ മലയാളത്തിൽ.", "mr": "अस्सलामु अलैकुम. HajCare AI — तुमचा हज सोबती, आता मराठीत.", "gu": "અસ્સલામુ અલૈકુમ. HajCare AI — તમારો હજ સાથી, હવે ગુજરાતીમાં.", "pa": "ਅੱਸਲਾਮੁ ਅਲੈਕੁਮ। HajCare AI — ਤੁਹਾਡਾ ਹੱਜ ਸਾਥੀ, ਹੁਣ ਪੰਜਾਬੀ ਵਿੱਚ।", "or": "ଅସ୍ସଲାମୁ ଅଲାଇକୁମ୍। HajCare AI — ଆପଣଙ୍କ ହଜ୍ ସାଥୀ, ବର୍ତ୍ତମାନ ଓଡ଼ିଆରେ।", "as": "আছছালামু আলাইকুম। HajCare AI — আপোনাৰ হজৰ সংগী, এতিয়া অসমীয়াত।", "ne": "अस्सलामु अलैकुम। HajCare AI — तपाईंको हज साथी, अब नेपालीमा।", "sd": "السلام عليڪم. HajCare AI — توهان جو حج ساٿي، هاڻي سنڌي ۾.", "en": "Assalamu alaikum. HajCare AI — your Hajj companion, now in English.", "ks": "अस्सलामु अलैकुम। HajCare AI — कश्मीरी में जल्द।", "kok": "अस्सलामु अलैकुम। HajCare AI — कोंकणी में जल्द।", "mai": "अस्सलामु अलैकुम। HajCare AI — मैथिली में जल्द।", "sa": "अस्सलामु अलैकुम। HajCare AI — संस्कृत में जल्द।", "doi": "अस्सलामु अलैकुम। HajCare AI — डोगरी में जल्द।", "brx": "अस्सलामु अलैकुम। HajCare AI — बोडो में जल्द।", "sat": "अस्सलामु अलैकुम। HajCare AI — संथाली में जल्द।", "mni": "अस्सलामु अलैकुम। HajCare AI — मणिपुरी में जल्द।"},TT={ks:1,kok:1,mai:1,sa:1,doi:1,brx:1,sat:1,mni:1},BCP={as:'as-IN',bn:'bn-IN',en:'en-IN',gu:'gu-IN',hi:'hi-IN',kn:'kn-IN',ml:'ml-IN',mr:'mr-IN',ne:'ne-NP',or:'or-IN',pa:'pa-IN',sd:'sd-IN',ta:'ta-IN',te:'te-IN',ur:'ur-IN'};
const tst=document.getElementById('ltoast');let tt;const toast=m=>{tst.textContent=m;tst.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>tst.classList.remove('on'),2600)};
const ss=window.speechSynthesis;const pick=l=>{if(!ss)return null;const vs=ss.getVoices();const b=BCP[l];return vs.find(v=>v.lang&&v.lang.replace('_','-').toLowerCase()===b.toLowerCase())||vs.find(v=>v.lang&&v.lang.toLowerCase().startsWith(l+'-'))||vs.find(v=>v.lang&&v.lang.toLowerCase()===l)||null};
if(ss&&ss.getVoices().length===0&&'onvoiceschanged' in ss)ss.addEventListener('voiceschanged',()=>{});
const caps=()=>document.querySelectorAll('.lcap');
const cap=(txt,l,c)=>{c=c||document.querySelector('#langs .lgrid .lc[data-l="'+l+'"]');const host=c.closest('.lgrid,.lscroll');let p=host&&host.nextElementSibling;if(!p||!p.classList.contains('lcap')){p=document.createElement('p');p.className='lcap';p.setAttribute('aria-live','polite');host.after(p)}caps().forEach(x=>{if(x!==p)x.classList.remove('on')});p.lang=l;p.dir=(l==='ur'||l==='sd'||l==='ks')?'rtl':'auto';p.textContent=txt;p.classList.add('on')};
const stopOthers=()=>['talbiya','zv','hmean','turdu'].forEach(i=>{const e=document.getElementById(i);if(e&&!e.paused)e.pause()});
const stop=()=>{if(ss)ss.cancel();window.__duck&&window.__duck(false);caps().forEach(x=>x.classList.remove('on'))};
window.__langStop=stop;
window.__langSay=(l,c)=>{stopOthers();if(ss)ss.cancel();cap(S[l]||'',l,c);const v=TT[l]?null:pick(l);
 if(!v||!ss){window.__duck&&window.__duck(false);return}
 const u=new SpeechSynthesisUtterance(S[l]);u.voice=v;u.lang=v.lang;u.rate=.92;u.onstart=()=>window.__duck&&window.__duck(true);u.onend=u.onerror=()=>{window.__duck&&window.__duck(false)};
 window.__duck&&window.__duck(true);try{ss.speak(u)}catch(_){window.__duck&&window.__duck(false)}};
})();

;(()=>{const D=window.__I18N;if(!D)return;const K=D.K,T=D.T,RTL={ur:1,ks:1,sd:1};
const nz=x=>x.replace(/\s+/g,' ').trim();const strip=x=>x.replace(/^[“"]+|[”"]+$/g,'');
const idx=new Map();K.forEach((k,i)=>k.split('|').forEach(v=>{if(!v.startsWith('<'))idx.set(nz(v),i)}));
const X={'🔊 आवाज़ के लिए छुएँ':5};
Object.entries(X).forEach(([k,i])=>idx.set(k,i));const nodes=[],els=[],attrs=[];
const scan=()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('script,style,[lang=ar],.lc b,.lmenu,.htb,#shint,.otap')||!n.nodeValue.trim())return 2;return 1}});let n;
 while(n=w.nextNode()){if(n.__o!==undefined)continue;const raw=n.nodeValue,t=nz(raw),core=strip(t);const i=idx.get(core);if(i!==undefined){n.__o=raw;n.__k=i;n.__q=t!==core?[t.slice(0,t.indexOf(core)),t.slice(t.indexOf(core)+core.length)]:['',''];nodes.push(n)}}
 [[/^यह सैर नहीं,/,'@H2'],[/^ताकि आप सिर्फ़ इबादत/,'@H3']].forEach(([re,_],j)=>document.querySelectorAll('h2,h3').forEach(e=>{if(!e.__o&&re.test(e.textContent.trim())){e.__o=e.innerHTML;e.__k=j?16:10;els.push(e)}}));
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{if(e.id==='opener'||e.closest('.otap'))return;['placeholder','aria-label','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&!e['__a'+a]){const i=idx.get(nz(v));if(i!==undefined){e['__a'+a]=v;attrs.push([e,a,i])}}})})};
let cur='hi';
const apply=l=>{if(!T[l])l='hi';cur=l;scan();const L=T[l];
 els.forEach(e=>{e.innerHTML=l==='hi'?e.__o:L[e.__k]});
 nodes.forEach(n=>{if(!n.isConnected)return;if(l==='hi'){n.nodeValue=n.__o;return}const lead=n.__o.match(/^\s*/)[0],tr=n.__o.match(/\s*$/)[0];n.nodeValue=lead+n.__q[0]+L[n.__k]+n.__q[1]+tr});
 attrs.forEach(([e,a,i])=>e.setAttribute(a,l==='hi'?e['__a'+a]:L[i]));
 document.querySelectorAll('.lc small').forEach(s=>{if(s.__o===undefined)s.__o=s.textContent;s.textContent=l==='hi'?s.__o:(s.__o.split('· ')[1]||s.__o)});
 const h=document.documentElement;h.lang=l==='mni'?'mni-Mtei':l==='sat'?'sat-Olck':l;h.dir=RTL[l]?'rtl':'ltr';h.dataset.ui=l;const M=window.__HC_SOURCE_HI||{},E=window.__HC_SOURCE_EN||{};if(M['p.imean0']){const p=document.querySelector('p.imean');if(p)p.innerHTML=l==='en'?E['p.imean0']:M['p.imean0']}document.querySelectorAll('p.mean').forEach((e,i)=>{const key='p.mean'+i;if(M[key])e.innerHTML=l==='en'&&E[key]?E[key]:M[key]});
 try{localStorage.setItem('hc_lang',l)}catch(_){}};
window.__i18n=apply;window.__i18nCur=()=>cur;window.__i18nBase=apply;
const mo=new MutationObserver(()=>{if(cur==='hi')return;mo.disconnect();const before=nodes.length;scan();if(nodes.length>before){apply(cur);window.__hcApplyBase&&window.__hcApplyBase(cur)};mo.observe(document.body,{subtree:true,childList:true,characterData:true})});
let saved=null;try{saved=localStorage.getItem('hc_lang')}catch(_){}
if(saved&&T[saved]&&saved!=='hi'){apply(saved);window.__selLang&&window.__selLang(saved)}else{scan();window.__selLang&&saved&&window.__selLang(saved)}
mo.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
/* v19: Hindi meaning — phrase-synced captions (timings from silence detection of talbiya-hindi-meaning.mp3) */
(()=>{const au=document.getElementById('hmean');if(!au)return;
const P=[['हाज़िर हूँ,',1.0],['ऐ अल्लाह,',2.3],['मैं हाज़िर हूँ।',3.5],['हाज़िर हूँ,',5.5],['तेरा कोई शरीक नहीं,',6.7],['मैं हाज़िर हूँ।',8.7],['बेशक सारी तारीफ़,',10.3],['सारी नेमतें और सारी बादशाहत',12.3],['तेरी ही है,',15.6],['तेरा कोई शरीक नहीं।',16.8]];
const hosts=[...document.querySelectorAll('.imean,#talbiya-sec .mean,.mean')].filter((e,i,a)=>a.indexOf(e)===i&&e.textContent.includes('हाज़िर हूँ, ऐ अल्लाह'));
hosts.forEach(h=>{const q=h.textContent.trim().startsWith('“');h.textContent='';if(q)h.append('“');P.forEach((p,i)=>{const s=document.createElement('span');s.className='hph';s.textContent=p[0];h.append(s);if(i<P.length-1)h.append(' ')});if(q)h.append('”')});
const caps=[...document.querySelectorAll('.hmb')].map(b=>{const c=document.createElement('p');c.className='hcap';c.lang='hi';c.setAttribute('aria-live','polite');b.after(c);return c});
let last=-1;const upd=()=>{const t=au.currentTime;let k=-1;if(!au.paused&&!au.ended)for(let i=0;i<P.length;i++)if(t>=P[i][1]-.1)k=i;if(k===last)return;last=k;
hosts.forEach(h=>h.querySelectorAll('.hph').forEach((s,i)=>{s.classList.toggle('on',i===k);s.classList.toggle('done',i<k)}));
caps.forEach(c=>{c.textContent=k>=0?P[k][0]:'';c.classList.toggle('on',k>=0)})};
['timeupdate','play','pause','ended','seeked'].forEach(e=>au.addEventListener(e,upd));
let raf;au.addEventListener('play',()=>{const f=()=>{upd();if(!au.paused)raf=requestAnimationFrame(f)};f()});
window.__hmPhrases=P})();

/* v20: Talbiya-alone flow + clean Enter */
(()=>{const intro=document.getElementById('intro'),a=document.getElementById('talbiya'),en=document.getElementById('enter');if(!intro||!a||!en)return;
let t0=0,iv;const done=()=>{if(intro.classList.contains('tdone'))return;intro.classList.add('tdone');clearInterval(iv)};
const watch=()=>{if(t0)return;t0=Date.now();iv=setInterval(()=>{const el=(Date.now()-t0)/1000;const hm2=document.getElementById('hmean');if(el>20&&a.paused&&(!hm2||hm2.paused))done();if(el>240)done()},1000)};
new MutationObserver(()=>{if(intro.classList.contains('opened'))watch()}).observe(intro,{attributes:true,attributeFilter:['class']});if(intro.classList.contains('opened'))watch();
/* Door sequence plays the girl Arabic file only. The Hindi meaning file is a different narrator, so it is not started here. */
let seq=false;a.addEventListener('ended',()=>{if(seq||window.__talbiyaDone)return;seq=true;window.__talbiyaDone=true;done()});a.addEventListener('error',done);
const clean=()=>{document.querySelectorAll('details[open]').forEach(d=>d.open=false);const ov=document.getElementById('demo');if(ov&&!ov.hidden&&ov.classList.contains('on')){const x=ov.querySelector('.dx');x&&x.click()}};
en.addEventListener('click',()=>{window.__talbiyaDone=true;try{a.pause();const h=document.getElementById('hmean');h&&h.pause()}catch(_){}done();clean();document.body.classList.add('entered');if('scrollRestoration'in history)history.scrollRestoration='manual';scrollTo(0,0);requestAnimationFrame(()=>scrollTo(0,0))},true);
})();
/* v20: minimal reading — long text folded behind 'और देखें' (text stays in DOM, so i18n still applies) */
(()=>{const M='और देखें',L='कम दिखाएँ';const mk=(onT)=>{const b=document.createElement('button');b.type='button';b.className='morep';const s=document.createElement('span');s.textContent=M;const s2=document.createElement('span');s2.textContent=L;s2.hidden=true;b.append(s,s2);b.onclick=e=>{e.stopPropagation();const o=onT();s.hidden=o;s2.hidden=!o};return b};
document.querySelectorAll('main p').forEach(p=>{if(p.closest('.hero,.card,.day,.mx,.lg,#langs,.zbox,.tag,.dh')||p.classList.contains('eyebrow')||p.classList.contains('hcap'))return;if(p.textContent.trim().length<130)return;p.classList.add('clampp');p.after(mk(()=>!p.classList.toggle('clampp')))});
document.querySelectorAll('.weeks').forEach(w=>{if(w.children.length<5)return;w.classList.add('fold');w.after(mk(()=>!w.classList.toggle('fold')))});
})();
