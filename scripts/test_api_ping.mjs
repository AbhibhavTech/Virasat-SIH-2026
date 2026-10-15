const baseUrl = process.env.VIRASAT_URL || 'http://localhost:3000';

const healthResponse = await fetch(baseUrl + '/api/ai/health');
if (!healthResponse.ok) {
  throw new Error('Local assistant health check returned HTTP ' + healthResponse.status);
}
const health = await healthResponse.json();
console.log('Assistant engine:', health.engine);

const chatResponse = await fetch(baseUrl + '/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What can you help me with?',
    currentRoute: '/ai',
  }),
});
if (!chatResponse.ok) {
  throw new Error('Local assistant chat returned HTTP ' + chatResponse.status + ': ' + await chatResponse.text());
}
const chat = await chatResponse.json();
if (!chat.success || !chat.reply || chat.engine !== 'Virasat AI Astra · Local Data Engine') {
  throw new Error('Local assistant returned an unexpected response.');
}
console.log('Chat reply:', chat.reply);
console.log('Latency:', chat.latency_ms, 'ms');
