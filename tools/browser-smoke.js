async (page) => {
  await page.setViewportSize({width:1280,height:800});
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const state = () => page.evaluate(() => window.__elenita.state());
  const tap = async (id) => {
    const target = await page.evaluate(id => window.__elenita.targets().find(t => t.id === id), id);
    if (!target) { failures.push(`Target not found: ${id}`); return; }
    check(target.x >= 0 && target.x <= page.viewportSize().width && target.y >= 0 && target.y <= page.viewportSize().height, `Offscreen target: ${id}`);
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(330);
    const after = await page.evaluate(id => window.__elenita.targets().find(t => t.id === id), id);
    if (after) check(after.taps > target.taps, `Tap did not reach ${id}`);
  };
  if(!(await state()).started)await page.getByRole('button', {name:'Entrar al bosque', exact:true}).click();
  await page.waitForTimeout(900);
  for (const id of ['rabbit','frog','duck','butterfly','owl']) await tap(id);
  check((await state()).audio.context === 'running', 'Audio did not unlock');
  await tap('cloud');check((await state()).raining,'Cloud did not cause rain');
  await page.screenshot({path:'output/playwright/forest-playing.png'});
  await page.getByRole('button',{name:'El Jardín de las Figuras',exact:true}).click();await page.waitForTimeout(4500);
  for(const id of ['circle','triangle','square','rectangle','pentagon','hexagon','trapezoid','star']){await tap('shape_'+id);await tap('shape_'+id);}
  await page.screenshot({path:'output/playwright/shapes.png'});
  await page.getByRole('button',{name:'El Rincón de los Números',exact:true}).click();await page.waitForTimeout(4500);
  for(let n=0;n<=5;n++){await tap('number_'+n);const s=await state();check(s.quantity===n&&s.butterflies===n,`Quantity mismatch for ${n}`)}
  await page.screenshot({path:'output/playwright/numbers.png'});
  await page.getByRole('button',{name:'El Sendero de las Letras',exact:true}).click();await page.waitForTimeout(4500);
  for(const l of ['a','e','l','m','s'])await tap('letter_'+l);
  await page.screenshot({path:'output/playwright/letters.png'});
  await page.getByRole('button',{name:'El Claro Musical',exact:true}).click();await page.waitForTimeout(4500);
  for(let n=0;n<6;n++)await tap('bar_'+n);await tap('drum');await tap('bell');
  await page.screenshot({path:'output/playwright/music.png'});
  await page.getByRole('button',{name:'El Observatorio',exact:true}).click();await page.waitForTimeout(4500);
  await tap('telescope');await page.waitForFunction(()=>window.__elenita.state().space,{timeout:20000});await page.waitForTimeout(1800);
  for(const id of ['sun','earth','moon','mars','jupiter','saturn'])await tap('space_'+id);
  await page.screenshot({path:'output/playwright/space.png'});
  await page.getByRole('button',{name:'Volver al bosque',exact:true}).click();await page.waitForTimeout(2500);
  check(!(await state()).space,'Could not return to forest');
  check((await state()).audio.queued<=1,'Narration queue is unbounded');
  console.log(JSON.stringify({failures,state:await state()}));
  if(failures.length)throw new Error(failures.join('; '));
}
