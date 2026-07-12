(() => {
  if (!('serviceWorker' in navigator)) return;

  const toast = document.getElementById('sw-update-toast');
  const updateButton = document.getElementById('sw-update-now');
  const laterButton = document.getElementById('sw-update-later');
  let registration = null;
  let applyingUpdate = false;
  let reloadTriggered = false;

  const showUpdate = () => { if (toast) toast.hidden = false; };
  const hideUpdate = () => { if (toast) toast.hidden = true; };

  const applyUpdate = () => {
    if (applyingUpdate) return;
    applyingUpdate = true;
    hideUpdate();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.setTimeout(() => { if (!reloadTriggered) window.location.reload(); }, 1500);
      return;
    }
    window.location.reload();
  };

  const checkVersion = async () => {
    try {
      const response = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      if (data.version && data.version !== window.APP_VERSION) {
        registration?.update().catch(() => {});
        showUpdate();
      }
    } catch (_) {}
  };

  updateButton?.addEventListener('click', applyUpdate);
  laterButton?.addEventListener('click', hideUpdate);

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!applyingUpdate || reloadTriggered) return;
    reloadTriggered = true;
    window.location.reload();
  });

  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    registration = reg;
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate();

    const watchWorker = worker => worker?.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
    });
    watchWorker(reg.installing);
    reg.addEventListener('updatefound', () => watchWorker(reg.installing));

    window.setTimeout(checkVersion, 5000);
    window.setInterval(() => reg.update().catch(() => {}), 180000);
  }).catch(() => {});

  ['focus', 'online', 'pageshow'].forEach(event => window.addEventListener(event, checkVersion));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkVersion(); });
})();
