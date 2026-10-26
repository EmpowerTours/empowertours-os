import fs from "fs/promises";import {existsSync} from "fs";import path from "path";import crypto from "crypto";
const DIR=path.join(process.env.DATA_DIR||(existsSync("/data")?"/data":path.join(process.cwd(),".data")),"photos");
const IDX=path.join(DIR,"index.json");
let lock=Promise.resolve();
async function ensure(){await fs.mkdir(DIR,{recursive:true})}
export async function list(){await ensure();try{return JSON.parse(await fs.readFile(IDX,"utf8"))}catch{return []}}
function withLock(fn){const p=lock.then(fn,fn);lock=p.catch(()=>{});return p}
export function add(buf,meta){return withLock(async()=>{await ensure();const id=crypto.randomBytes(9).toString("base64url");
 await fs.writeFile(path.join(DIR,id+".jpg"),buf);const items=await list();const item={id,...meta,at:Date.now()};
 items.unshift(item);await fs.writeFile(IDX+".tmp",JSON.stringify(items));await fs.rename(IDX+".tmp",IDX);return item})}
export function remove(id){return withLock(async()=>{const items=await list();const n=items.filter(i=>i.id!==id);if(n.length===items.length)return false;
 await fs.writeFile(IDX+".tmp",JSON.stringify(n));await fs.rename(IDX+".tmp",IDX);await fs.rm(path.join(DIR,id+".jpg"),{force:true});return true})}
export async function read(id){if(!/^[\w-]+$/.test(id))return null;try{return await fs.readFile(path.join(DIR,id+".jpg"))}catch{return null}}
