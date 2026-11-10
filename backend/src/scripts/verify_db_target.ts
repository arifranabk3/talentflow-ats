import { config } from '../config/env';

const uri = config.mongodbUri;
const parsed = new URL(uri);

console.log('--- DATABASE TARGET INSPECTION ---');
console.log('Protocol:', parsed.protocol);
console.log('Host:', parsed.host);
console.log('Database Path:', parsed.pathname);
console.log('Target Database:', parsed.pathname.replace(/^\//, ''));
console.log('Isolation from other projects:', !uri.includes('sellzy') && !uri.includes('autoverse'));
