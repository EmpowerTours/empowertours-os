import sharp from "sharp";import {list,add} from "../../../lib/store";
export const runtime="nodejs";export const dynamic="force-dynamic";
const MAX=8*1024*1024;const hits=new Map();
function limited(ip){const now=Date.now(),win=10*60*1000;const a=(hits.get(ip)||[]).filter(t=>now-t<win);if(a.length>=10){hits.set(ip,a);return true}a.push(now);hits.set(ip,a);return false}
const clean=(s,n)=>String(s||"").replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,n);
export async function GET(){return Response.json(await list(),{headers:{"cache-control":"no-store"}})}
export async function POST(req){
 const ip=(req.headers.get("x-forwarded-for")||"").split(",")[0].trim()||req.headers.get("x-real-ip")||"anon";
 if(Number(req.headers.get("content-length")||0)>MAX+64*1024)return Response.json({error:"Image too large (max 8MB)"},{status:413});
 if(limited(ip))return Response.json({error:"Too many uploads — try again in a few minutes"},{status:429});
 let fd;try{fd=await req.formData()}catch{return Response.json({error:"Bad form data"},{status:400})}
 const f=fd.get("photo");if(!f||typeof f==="string")return Response.json({error:"No photo"},{status:400});
 if(!/^image\//.test(f.type||""))return Response.json({error:"Images only"},{status:415});
 if(f.size>MAX)return Response.json({error:"Image too large (max 8MB)"},{status:413});
 let out;try{out=await sharp(Buffer.from(await f.arrayBuffer()),{limitInputPixels:60e6}).rotate().resize({width:1600,height:1600,fit:"inside",withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toBuffer({resolveWithObject:true})}
 catch{return Response.json({error:"Not a valid image"},{status:415})}
 const item=await add(out.data,{name:clean(fd.get("name"),40)||"Anonymous",caption:clean(fd.get("caption"),140),w:out.info.width,h:out.info.height});
 return Response.json(item,{status:201})}
