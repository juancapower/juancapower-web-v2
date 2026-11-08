import { readFile, writeFile } from 'node:fs/promises';
import { complaintReceipt } from './complaint-receipt.mjs';

async function recover() {
  const [file, output, providerFile] = process.argv.slice(2);
  if (!file || !output || !providerFile) throw Error();
  const row = JSON.parse(await readFile(file, 'utf8'));
  const provider = JSON.parse(await readFile(providerFile, 'utf8'));
  if (!Number.isSafeInteger(row.id) || row.id < 1 || !Number.isFinite(Date.parse(row.created)) ||
      typeof row.payload !== 'string' || !/^[0-9a-f]{56,}$/i.test(row.payload) || row.payload.length % 2 ||
      !provider.name || !/^\d{11}$/.test(provider.ruc || '') || !provider.address) throw Error();

  // Pipe the key from a private prompt. Never pass it as a command-line argument.
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const keyHex = Buffer.concat(chunks).toString('utf8').trim();
  if (!/^[0-9a-f]{64}$/i.test(keyHex)) throw Error();
  const key = await crypto.subtle.importKey('raw', Buffer.from(keyHex, 'hex'), 'AES-GCM', false, ['decrypt']);
  const encrypted = Buffer.from(row.payload, 'hex');
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: encrypted.subarray(0, 12) }, key, encrypted.subarray(12));
  const payload = JSON.parse(new TextDecoder().decode(plaintext));
  const receipt = complaintReceipt(String(row.id).padStart(8, '0'), row.created, provider, payload);
  await writeFile(output, receipt, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
}

recover().catch(() => {
  console.error('No se pudo recuperar la constancia. Verifica los archivos, la clave y que la salida no exista.');
  process.exitCode = 1;
});
