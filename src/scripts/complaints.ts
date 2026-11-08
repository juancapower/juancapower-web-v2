const root = document.querySelector<HTMLElement>('#complaints-demo');

if (root) {
  const preview = root.dataset.preview === 'true';
  if (preview && !['localhost', '127.0.0.1'].includes(location.hostname)) {
    root.remove();
  } else {
    const form = root.querySelector<HTMLFormElement>('#complaints-form')!;
    const status = root.querySelector<HTMLElement>('#complaints-status')!;
    const receipt = root.querySelector<HTMLElement>('#complaints-receipt')!;
    const requestId = crypto.randomUUID();
    let copy = '';
    let widget: string | undefined;

    async function token(): Promise<string> {
      if (preview) return 'LOCAL_SYNTHETIC_ONLY';
      if (!window.turnstile) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          const timer = setTimeout(() => { script.remove(); reject(Error()); }, 15000);
          script.onload = () => { clearTimeout(timer); resolve(); };
          script.onerror = () => { clearTimeout(timer); script.remove(); reject(Error()); };
          document.head.append(script);
        });
      }
      return new Promise((resolve, reject) => {
        const turnstile = window.turnstile!;
        if (widget !== undefined) turnstile.remove(widget);
        const timer = setTimeout(() => reject(Error()), 120000);
        widget = turnstile.render(root!.querySelector<HTMLElement>('#complaints-bot')!, {
          sitekey: root!.dataset.sitekey,
          action: 'complaints',
          callback: (value: string) => { clearTimeout(timer); resolve(value); },
          'error-callback': () => { clearTimeout(timer); reject(Error()); },
        });
      });
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = Object.fromEntries(new FormData(form));
      const minor = (form.elements.namedItem('minor') as HTMLInputElement).checked;
      if (minor && !String(fields.guardian || '').trim()) {
        status.textContent = 'Indica los datos de tu representante.';
        (form.elements.namedItem('guardian') as HTMLInputElement).focus();
        return;
      }
      if (!minor) fields.guardian = '';
      const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
      button.disabled = true;
      status.textContent = 'Registrando…';
      try {
        const response = await fetch(root.dataset.api!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...fields, requestId, minor, website: '', botToken: await token() }),
          signal: AbortSignal.timeout(25000),
        });
        if (response.status === 409) {
          status.textContent = 'Ya existe una hoja con este intento. Restablece los datos del envío original para recuperar la constancia, o contacta al responsable.';
          return;
        }
        if (!response.ok) throw Error();
        const result = await response.json();
        if (!result.number || typeof result.receipt !== 'string' || !result.receipt) throw Error();
        copy = (preview ? 'SIMULACIÓN LOCAL · NO ES UN RECLAMO REAL\n' : '') + result.receipt;
        root.querySelector('#complaints-copy')!.textContent = copy;
        receipt.hidden = false;
        status.textContent = preview
          ? 'Registro sintético completado. No hubo envíos reales.'
          : result.state === 'notified'
            ? 'Hoja registrada. El servicio de correo aceptó el envío. Conserva tu constancia.'
            : 'Hoja registrada. Al menos un correo está pendiente de revisión. Descarga o imprime tu constancia.';
        form.reset();
        form.hidden = true;
        receipt.querySelector<HTMLElement>('#receipt-title')!.focus();
      } catch {
        status.textContent = 'No pudimos confirmar el registro. Conserva los mismos datos en esta pantalla y reintenta. Si el Libro sigue sin responder, solicita el Libro de respaldo al responsable.';
      } finally {
        button.disabled = false;
      }
    });

    root.querySelector('#complaints-print')!.addEventListener('click', () => print());
    root.querySelector('#complaints-download')!.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([copy], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hoja-reclamacion.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
}
export {};
