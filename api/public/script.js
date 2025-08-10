(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];

  // Mobile Menü
  const burger = $('#burger');
  const menu = $('#navMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    $$('#navMenu a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    }));
  }

  // Footer-Jahr
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Kontaktformular + Schutz
  const form = $('#contactForm');
  const msgEl = $('#formMsg');
  const tsField = $('#ts');
  if (tsField) tsField.value = String(Date.now());

  const setMsg = (text, ok=false) => {
    if (!msgEl) return;
    msgEl.textContent = text || '';
    msgEl.className = 'form-msg ' + (ok ? 'ok' : 'err');
  };

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setMsg('', false);

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        msg: form.message.value.trim(),
        hp: form.hp ? form.hp.value.trim() : '',
        ts: tsField ? Number(tsField.value) : 0
      };

      if (!data.name || !data.email || !data.msg) return setMsg('Bitte füllen Sie alle Felder aus.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return setMsg('Bitte gültige E-Mail eingeben.');

      submitBtn && (submitBtn.disabled = true);
      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.ok) {
          form.reset();
          if (tsField) tsField.value = String(Date.now());
          setMsg('Danke! Ihre Nachricht wurde gesendet.', true);
        } else {
          setMsg(json.message || 'Senden fehlgeschlagen – bitte später erneut.');
        }
      } catch {
        setMsg('Keine Verbindung zum Server.');
      } finally {
        submitBtn && (submitBtn.disabled = false);
      }
    });
  }
})();
