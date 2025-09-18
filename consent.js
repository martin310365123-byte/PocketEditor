// CONSENT_OBSERVER_ACTIVE


checkbox.addEventListener('change', ()=>{ agreeBtn.disabled = !checkbox.checked; });
cancelBtn.addEventListener('click', ()=>{ pendingUrl=null; pendingNewTab=false; closeModal(); });
closeX.addEventListener('click', ()=>{ pendingUrl=null; pendingNewTab=false; closeModal(); });
modal.addEventListener('click', (e)=>{ if(e.target===modal){ pendingUrl=null; pendingNewTab=false; closeModal(); } });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ pendingUrl=null; pendingNewTab=false; closeModal(); } });


function needConsentFor(el){
const url = (el.getAttribute('data-href') || el.getAttribute('href') || '').trim();
if(!url) return null;
if(el.hasAttribute('data-need-consent')) return url;
if(NEED_CONSENT.test(url)) return url;
return null;
}


function bind(el){
if(!el || el.dataset.consentBound==='1') return;
const url = needConsentFor(el);
if(!url) return;


// 取消原生導向，統一用同意後才導向
el.setAttribute('data-href', url);
if(el.tagName.toLowerCase()==='a'){
el.removeAttribute('href');
el.setAttribute('role','button');
el.setAttribute('tabindex','0');
}


const handler = (openInNewTab)=>{
if(hasAccepted()){
if(openInNewTab) window.open(url, '_blank'); else window.location.assign(url);
return;
}
openModal(url, !!openInNewTab);
};


el.addEventListener('pointerdown', (e)=>{ e.preventDefault(); }, true);
el.addEventListener('click', (e)=>{ e.preventDefault(); handler(e.metaKey||e.ctrlKey||el.target==='_blank'); }, true);
el.addEventListener('auxclick', (e)=>{ if(e.button===1){ e.preventDefault(); handler(true); } }, true);
el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); handler(false); } }, true);


el.dataset.consentBound='1';
}


function scanAll(){
document.querySelectorAll('a,button').forEach(bind);
}


// 初始掃描 + 監聽 DOM 變更（防新增節點漏網）
scanAll();
const mo = new MutationObserver(()=>{ scanAll(); });
mo.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['href','data-href'] });


agreeBtn.addEventListener('click', ()=>{
if(checkbox.checked && pendingUrl){
const url = pendingUrl; const openNew = pendingNewTab;
pendingUrl=null; pendingNewTab=false; closeModal();
if(openNew) window.open(url, '_blank'); else window.location.assign(url);
}
});
})();
