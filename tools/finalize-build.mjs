import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
const root = resolve(import.meta.dirname, "../build/web");
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)],
  );
}
const files = walk(root).filter(
  (p) => !["sw.js", "_headers"].includes(relative(root, p)),
);
const hash = createHash("sha256");
for (const f of files) hash.update(readFileSync(f));
const version = hash.digest("hex").slice(0, 14);
const paths = [
  "./",
  ...files.map((f) => "./" + relative(root, f).replaceAll("\\", "/")),
];
writeFileSync(
  resolve(root, "sw.js"),
  `/* Generated from the complete deterministic build. No external runtime requests. */
const CACHE='elenita-${version}';
const FILES=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 for(let i=0;i<FILES.length;i+=6)await cache.addAll(FILES.slice(i,i+6));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('elenita-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try{return await fetch(event.request)}catch(error){if(event.request.mode==='navigate')return await cache.match('./index.html');throw error}
 })());
});
`,
);
writeFileSync(
  resolve(root, "_headers"),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
/sw.js
  Cache-Control: no-cache
`,
);
const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0);
const compressed = files.reduce(
  (sum, f) => sum + gzipSync(readFileSync(f)).length,
  0,
);
console.log(
  `Build ${version}: ${files.length} files; ${(bytes / 1048576).toFixed(2)} MB raw, ${(compressed / 1048576).toFixed(2)} MB gzip equivalent. Offline cache includes both languages and space.`,
);
