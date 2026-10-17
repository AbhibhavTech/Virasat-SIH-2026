import '../server/src/config/environment';
import { environmentFiles } from '../server/src/config/environment';
import { getModelConfiguration, explainModelFailure, verifySelectedModelAvailability } from '../ai/engine/modelGateway';
import { ProviderFailure } from '../ai/engine/providerErrors';

async function main() {
  const config = getModelConfiguration();
  const { provider, configured, model, safeModel, issues, baseUrl } = config;
  console.log(JSON.stringify({ environment_files: environmentFiles, provider, model: safeModel, configured, issues }, null, 2));
  if (!configured) {
    console.error('BLOCKED: hosted model/key configuration is missing or invalid. No provider request was sent.');
    process.exitCode = 2;
    return;
  }
  console.log(JSON.stringify({ provider, provider_host: new URL(baseUrl).host, endpoint_path: `${new URL(baseUrl).pathname}/chat/completions`.replace(/\/\//g, '/') }));
  if (provider === 'groq') {
    try { await verifySelectedModelAvailability(config); }
    catch (error) {
      if (error instanceof ProviderFailure) console.log(JSON.stringify({ provider_error: error.diagnostic, provider_request_sent: true }, null, 2));
      throw new Error(error instanceof ProviderFailure ? error.diagnostic.explanation
        : explainModelFailure(error instanceof Error ? error.message : 'MODEL_NOT_AVAILABLE'));
    }
    console.log(JSON.stringify({ account_model_listing: 'verified', selected_model_available: true }));
  }
  const server = process.env.VIRASAT_TEST_SERVER || 'http://127.0.0.1:3000';
  const health = await fetch(`${server}/api/ai/health`, { signal: AbortSignal.timeout(5000) }).then(response => response.json());
  if (!health.generation?.configured || health.generation.model !== model || health.generation.provider !== provider) throw new Error('Running server configuration differs from this process. Restart from the repository root.');
  // One harmless generation through the actual app route proves that routing
  // reaches the selected model rather than the local engine. No credentials
  // or provider response bodies are written to disk or logs.
  const response = await fetch(`${server}/api/ai/chat`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'Reply with exactly VIRASAT_CONNECTION_OK. This is a connection test.', conversation_id: `connection-${Date.now()}` }),
    signal: AbortSignal.timeout(70000),
  });
  const result = await response.json();
  if (!response.ok) {
    if (result.provider_error) console.log(JSON.stringify({ provider_error: result.provider_error, provider_request_sent: result.provider_request_sent }, null, 2));
    throw new Error(result.provider_error?.explanation || explainModelFailure(result.error || 'MODEL_UNAVAILABLE'));
  }
  const expectedMode = provider === 'local' ? 'local_generative' : 'hosted_generative';
  if (result.generation_mode !== expectedMode || result.model_used !== model || !result.reply?.trim()) throw new Error('Configured model generation was not confirmed.');
  console.log(JSON.stringify({ connection: 'verified', provider, selected_model: model, application_route: '/api/ai/chat', generation_mode: result.generation_mode, nonempty_response: true, sentinel_matched: result.reply.trim() === 'VIRASAT_CONNECTION_OK' }, null, 2));
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Connection check failed'); process.exitCode = 1; });
