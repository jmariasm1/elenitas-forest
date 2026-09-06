async (page) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.setViewportSize({width:844,height:390});
  await page.waitForFunction(()=>window.__elenita?.state().ready);
  if(!(await page.evaluate(()=>window.__elenita.state().started)))await page.getByRole('button',{name:'Entrar al bosque',exact:true}).click();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const installed=await page.evaluate(async()=>{const keys=(await caches.keys()).filter(k=>k.startsWith('elenita-'));const cache=await caches.open(keys.at(-1));return (await cache.keys()).length});
  if(installed<230)throw new Error('Incomplete offline cache: '+installed);
  // Actual OS background/resume is a manual device check: CLI focus emulation
  // keeps document.visibilityState visible even when a different tab is brought forward.
  await page.context().setOffline(true);
  try {
    await page.reload();await page.waitForFunction(()=>window.__elenita?.state().ready);
    await page.getByRole('button',{name:'Entrar al bosque',exact:true}).click();
    const tap=async id=>{const target=await page.evaluate(id=>window.__elenita.targets().find(t=>t.id===id),id);if(!target)throw new Error('Missing '+id);await page.mouse.click(target.x,target.y);await page.waitForTimeout(350)};
    await tap('rabbit');await page.waitForTimeout(900);
    await page.getByRole('button',{name:'El Observatorio',exact:true}).click();await page.waitForTimeout(4500);
    await tap('telescope');await page.waitForFunction(()=>window.__elenita.state().space);
    await page.waitForTimeout(1300);await tap('space_saturn');
    await page.screenshot({path:'output/playwright/offline-space.png'});
    if(errors.length)throw new Error(errors.join('; '));
    await page.evaluate(installed=>window.__offlineResults={installed,reload:true,animal:true,space:true},installed);
  } finally { await page.context().setOffline(false); }
}
