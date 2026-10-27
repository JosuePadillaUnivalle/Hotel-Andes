import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Solo se permiten pruebas locales.');
await mkdir('evidence/selenium', { recursive: true });
const options = new chrome.Options().addArguments('--headless=new', '--window-size=1440,1000');
const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
const startedAt = new Date().toISOString();
const results = [];
async function run(id, title, task) {
  const start = Date.now();
  try {
    await driver.get(base);
    await driver.wait(until.elementLocated(By.css('.room-card')), 20000);
    await task(); results.push({id, title, status:'passed', durationMs:Date.now()-start}); console.log(`PASS ${id}: ${title}`);
  }
  catch (err) { results.push({id, title, status:'failed', error:err.message, durationMs:Date.now()-start}); console.error(`FAIL ${id}: ${err.message}`); }
  await writeFile(`evidence/selenium/${id}.png`, await driver.takeScreenshot(), 'base64');
}
try {
  await driver.manage().setTimeouts({ implicit:0, pageLoad:30000, script:10000 });
  await driver.get(base);
  await driver.wait(until.elementLocated(By.css('.room-card')), 20000);
  await run('SE01', 'Catálogo presenta tres habitaciones y precios', async () => {
    assert.equal((await driver.findElements(By.css('.room-card'))).length,3);
    const text=await driver.findElement(By.css('.room-grid')).getText();
    for (const name of ['Habitación Andina','Suite Panorámica','Refugio Familiar','520','680','840']) assert(text.includes(name));
  });
  await run('SE02', 'Detalle accesible y cierre con tecla Escape', async () => {
    await driver.findElement(By.css('[aria-label="Ver detalles de Suite Panorámica"]')).click();
    const dialog=await driver.wait(until.elementLocated(By.css('dialog[open]')),10000);
    await driver.wait(until.elementTextContains(dialog, 'Suite Panorámica'),10000);
    await driver.actions().sendKeys(Key.ESCAPE).perform();
    await driver.wait(async()=> (await driver.findElements(By.css('dialog[open]'))).length===0,10000);
  });
  await run('SE03', 'Filtro En familia muestra solo habitación familiar', async () => {
    await driver.findElement(By.xpath('//button[normalize-space()="En familia"]')).click();
    await driver.wait(async()=> (await driver.findElements(By.css('.room-card'))).length===1,10000);
    assert((await driver.findElement(By.css('.room-card')).getText()).includes('Refugio Familiar'));
  });
  await run('SE04', 'Vista móvil sin desborde y menú operable', async () => {
    await driver.sendDevToolsCommand('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
    const dims=await driver.executeScript('return {viewport:innerWidth, content:document.documentElement.scrollWidth}');
    assert.equal(dims.viewport,390); assert(dims.content<=dims.viewport,JSON.stringify(dims));
    const button=await driver.findElement(By.css('[aria-label="Abrir menú"]'));
    await button.click(); assert.equal(await button.getAttribute('aria-expanded'),'true');
    await driver.findElement(By.css('.navigation a[href="#habitaciones"]')).click();
    await driver.wait(async()=>await button.getAttribute('aria-expanded')==='false',10000);
  });
} finally {
  const caps=await driver.getCapabilities();
  await writeFile('evidence/selenium/results.json',JSON.stringify({startedAt,finishedAt:new Date().toISOString(),browser:caps.get('browserName'),version:caps.get('browserVersion'),results},null,2));
  await driver.quit();
}
if(results.some(r=>r.status!=='passed')) process.exitCode=1;
