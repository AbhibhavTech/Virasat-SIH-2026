const { resolvePlaceEntity, loadPlacesRegistry } = require('../dist/server.cjs');

console.log('Testing place resolution...');
const { list } = loadPlacesRegistry ? loadPlacesRegistry() : { list: [] };
console.log('Registry list size:', list.length);
