import crypto from "crypto";import {read,remove} from "../../../../lib/store";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(_,{params}){const b=await read(params.id);if(!b)return new Response("Not found",{status:404});
 return new Response(b,{headers:{"content-type":"image/jpeg","cache-control":"public, max-age=31536000, immutable"}})}
export async function DELETE(req,{params}){const t=process.env.ADMIN_TOKEN||"";const g=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
 const ok=t&&g.length===t.length&&crypto.timingSafeEqual(Buffer.from(g),Buffer.from(t));
 if(!ok)return Response.json({error:"Unauthorized"},{status:401});
 return (await remove(params.id))?Response.json({deleted:params.id}):Response.json({error:"Not found"},{status:404})}
