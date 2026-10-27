const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Solo localhost');
for(let attempt=0;attempt<90;attempt++) {
  try {
    const response=await fetch(base+'/api/reservations',{signal:AbortSignal.timeout(2000)});
    if(response.ok){console.log('Servidor y base local preparados');process.exit(0);}
  } catch {}
  await new Promise(resolve=>setTimeout(resolve,1000));
}
throw new Error('El servidor o la base local no están preparados tras 90 segundos.');
