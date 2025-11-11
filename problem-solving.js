(function(){
  const form = document.getElementById('bookingForm');
  const errors = document.getElementById('formErrors');
  const preview = document.getElementById('emailPreview');
  const message = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const copyBtn = document.getElementById('copyEmail');
  if(!form) return;

  /* Set min date to today */
  const date = document.getElementById('date');
  if(date){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const dd = String(today.getDate()).padStart(2,'0');
    date.min = `${yyyy}-${mm}-${dd}`;
  }

  /* Character counter */
  if(message && charCount){
    const updateCount = ()=> charCount.textContent = `${message.value.length} / ${message.maxLength}`;
    ['input','change'].forEach(e=> message.addEventListener(e, updateCount));
    updateCount();
  }

  /* Restore from localStorage */
  const KEY='noriember:last';
  try{
    const saved = JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved){ Object.keys(saved).forEach(k=>{ const el=form.elements[k]; if(el) el.value=saved[k]; }); updatePreview(); }
  }catch{}

  function validate(){
    errors.textContent='';
    const out=[];
    const name=form.elements.name.value.trim();
    const email=form.elements.email.value.trim();
    const d=form.elements.date.value;
    const t=form.elements.time.value;
    const size=Number(form.elements.size.value||0);

    if(!name) out.push('Name is required.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) out.push('Enter a valid email address.');
    if(!d) out.push('Date is required.');
    if(!t) out.push('Time is required.');
    if(!(size>=1)) out.push('Party size must be at least 1.');

    if(out.length){
      errors.innerHTML = out.map(s=>`• ${s}`).join('\n');
      errors.focus && errors.focus();
      return false;
    }
    return true;
  }

  function buildSubject(v){
    return encodeURIComponent(`[${v.type.toUpperCase()}] ${v.name} — ${v.date} ${v.time} (${v.size})`);
  }

  function buildBody(v){
    const lines=[
      `Name: ${v.name}`,
      `Email: ${v.email}`,
      v.phone?`Phone: ${v.phone}`:null,
      `Type: ${v.type}`,
      `Date: ${v.date}`,
      `Time: ${v.time}`,
      `Party size: ${v.size}`,
      '',
      v.message?`Message: ${v.message}`:'Message: (none)'
    ].filter(Boolean).join('\n');
    return encodeURIComponent(lines);
  }

  function getValues(){
    const v={};
    ['name','email','phone','type','date','time','size','message'].forEach(k=> v[k]=form.elements[k].value.trim());
    return v;
  }

  function updatePreview(){
    const v = getValues();
    const body = decodeURIComponent(buildBody(v));
    const subj = decodeURIComponent(buildSubject(v));
    preview.value = `Subject: ${subj}\n\n${body}`;
  }

  form.addEventListener('input', ()=>{ updatePreview(); try{ localStorage.setItem(KEY, JSON.stringify(getValues())); }catch{} });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!validate()) return;
    const v = getValues();
    const mail = `mailto:bookings@nori-ember.example?subject=${buildSubject(v)}&body=${buildBody(v)}`;
    updatePreview();
    window.location.href = mail;
  });

  if(copyBtn){
    copyBtn.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(preview.value); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy email text',1200); }catch{}
    });
  }
})();
