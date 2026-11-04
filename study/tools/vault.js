#!/usr/bin/env node
/* =========================================================================
   Study · soluciones protegidas con contraseña
   -------------------------------------------------------------------------
   Cifra un JSON { clave: "markdown o html", … } en subjects/<id>.vault.js, que la web
   descifra en el navegador (WebCrypto) cuando alguien escribe la contraseña.

     node study/tools/vault.js lock   <id> <plano.json>    cifra → study/subjects/<id>.vault.js
     node study/tools/vault.js unlock <id> <plano.json>    descifra study/subjects/<id>.vault.js → plano.json
     node study/tools/vault.js keys   <id>                 lista las claves (pide la contraseña)

   La contraseña se pide por teclado; también se puede pasar en la variable STUDY_VAULT_PASS.
   Formato: PBKDF2-SHA256 (600 000 iteraciones) → clave AES-256-GCM; el texto cifrado lleva la
   etiqueta de 16 bytes al final, que es lo que espera crypto.subtle.decrypt.

   ¡El JSON en claro NO se sube al repositorio! Guárdalo fuera o en study/private/ (está en .gitignore).
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const ITERATIONS = 600000;
const SUBJECTS = path.join(__dirname, '..', 'subjects');

function ask(question) {
  if (process.env.STUDY_VAULT_PASS) return Promise.resolve(process.env.STUDY_VAULT_PASS);
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl.stdoutMuted = false;
    rl._writeToOutput = function (s) { if (!rl.stdoutMuted) rl.output.write(s); };
    rl.question(question, answer => { rl.close(); process.stdout.write('\n'); resolve(answer); });
    rl.stdoutMuted = true;
  });
}

const key = (pass, salt, it) => crypto.pbkdf2Sync(Buffer.from(pass.normalize('NFC'), 'utf8'), salt, it, 32, 'sha256');

function encrypt(obj, pass) {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(pass, salt, ITERATIONS), iv);
  const ct = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final(), c.getAuthTag()]);
  return { v: 1, it: ITERATIONS, salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };
}

function decrypt(v, pass) {
  const ct = Buffer.from(v.ct, 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', key(pass, Buffer.from(v.salt, 'base64'), v.it), Buffer.from(v.iv, 'base64'));
  d.setAuthTag(ct.subarray(ct.length - 16));
  try {
    return JSON.parse(Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]).toString('utf8'));
  } catch (e) {
    throw new Error('contraseña incorrecta (o archivo dañado)');
  }
}

function readVault(id) {
  const file = path.join(SUBJECTS, id + '.vault.js');
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/Cuaderno\.vault\(\s*'[^']+'\s*,\s*(\{[\s\S]*\})\s*\)\s*;?\s*$/);
  if (!m) throw new Error('no entiendo el formato de ' + file);
  return JSON.parse(m[1]);
}

async function main() {
  const [cmd, id, file] = process.argv.slice(2);
  if (!cmd || !id || !/^[\w-]+$/.test(id) || (cmd !== 'keys' && !file)) {
    console.log('Uso:\n  vault.js lock <id> <plano.json>\n  vault.js unlock <id> <plano.json>\n  vault.js keys <id>');
    process.exit(1);
  }
  if (cmd === 'lock') {
    const plain = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [k, v] of Object.entries(plain)) if (typeof v !== 'string') throw new Error('la clave ' + k + ' no es texto');
    const pass = await ask('Contraseña: ');
    if (!process.env.STUDY_VAULT_PASS && (await ask('Repite la contraseña: ')) !== pass) throw new Error('no coinciden');
    if (pass.length < 12) throw new Error('usa al menos 12 caracteres');
    const v = encrypt(plain, pass);
    const back = decrypt(v, pass);   // comprobación
    if (JSON.stringify(back) !== JSON.stringify(plain)) throw new Error('la comprobación ha fallado');
    const out = path.join(SUBJECTS, id + '.vault.js');
    fs.writeFileSync(out, '/* Soluciones cifradas de «' + id + '» (AES-256-GCM, PBKDF2-SHA256). Generado con study/tools/vault.js: no editar a mano. */\n' +
      "Cuaderno.vault('" + id + "', " + JSON.stringify(v) + ');\n');
    console.log('Cifrado: ' + Object.keys(plain).length + ' claves → ' + path.relative(process.cwd(), out));
  } else if (cmd === 'unlock' || cmd === 'keys') {
    const v = readVault(id);
    const plain = decrypt(v, await ask('Contraseña: '));
    if (cmd === 'keys') { console.log(Object.keys(plain).join('\n')); return; }
    fs.writeFileSync(file, JSON.stringify(plain, null, 1) + '\n');
    console.log('Descifrado en ' + file + ' (' + Object.keys(plain).length + ' claves). No lo subas al repositorio.');
  } else {
    throw new Error('orden desconocida: ' + cmd);
  }
}

main().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
