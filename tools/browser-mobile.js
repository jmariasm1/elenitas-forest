async (page) => {
  const results=[];
  const state=()=>page.evaluate(()=>window.__elenita.state());
  await page.waitForFunction(()=>window.__elenita?.state().ready);
  if(!(await state()).started)await page.getByRole('button',{name:'Entrar al bosque',exact:true}).click();
  await page.getByRole('button',{name:'El Claro',exact:true}).click();
  const dimensions=[[360,800],[390,844],[412,915],[768,1024],[820,1180]];
  for(const [w,h] of dimensions)for(const landscape of [false,true]){
    const width=landscape?h:w,height=landscape?w:h;
    await page.setViewportSize({width,height});await page.waitForTimeout(2200);
    const bounds=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,targets:window.__elenita.targets()}));
    if(bounds.scrollWidth>bounds.width)throw new Error(`Horizontal overflow at ${width}x${height}`);
    for(const id of ['rabbit','frog','duck','butterfly','owl','sun','cloud']){
      const target=bounds.targets.find(t=>t.id===id);if(!target)throw new Error('Missing '+id);
      if(target.x<12||target.x>width-12||target.y<12||target.y>height-70)throw new Error(`Offscreen ${id} at ${width}x${height}: ${target.x},${target.y}`);
    }
    const rabbit=bounds.targets.find(t=>t.id==='rabbit');await page.mouse.click(rabbit.x,rabbit.y);
    await page.waitForTimeout(60);
    const after=await page.evaluate(()=>window.__elenita.targets().find(t=>t.id==='rabbit').taps);
    if(after<=rabbit.taps)throw new Error(`Rabbit untappable at ${width}x${height}`);
    await page.locator('#debug').evaluate(el=>el.hidden=true);
    await page.screenshot({path:`output/playwright/mobile-${width}x${height}.png`});
    results.push({width,height,fps:(await state()).fps});
  }
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(2500);
  const target=await page.evaluate(()=>window.__elenita.targets().find(t=>t.id==='rabbit'));
  for(let i=0;i<35;i++)await page.mouse.click(target.x,target.y);
  const client=await page.context().newCDPSession(page);
  await client.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const touches=await page.evaluate(()=>window.__elenita.targets().filter(t=>['rabbit','duck','frog'].includes(t.id)));
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches.map((t,i)=>({x:t.x,y:t.y,id:i+1,radiusX:12,radiusY:12}))});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:touches.map((t,i)=>({x:t.x+4,y:t.y+5,id:i+1,radiusX:12,radiusY:12}))});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await client.send('Emulation.setTouchEmulationEnabled',{enabled:false});
  await page.waitForTimeout(2000);
  const final=await state();if(final.audio.queued>1||final.particles>48)throw new Error('Unbounded input effects');
  await page.evaluate(results=>window.__mobileResults=results,results);
}
