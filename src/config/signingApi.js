import {auth,firebaseConfig} from '../firebase';

const REGION='us-central1';
const functionName={
  '/api/manage-signer':'manageSigner',
  '/api/signing-pin':'signingPin',
  '/api/sign-acta':'signActa'
};

async function request(url,idToken,body){
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${idToken}`},body:JSON.stringify(body||{})});
  const text=await r.text();
  let out=null;
  try{out=JSON.parse(text)}catch{}
  return {r,text,out};
}

function directFunctionUrl(path){
  const fn=functionName[path];
  const project=String(firebaseConfig?.projectId||'').trim();
  return fn&&project?`https://${REGION}-${project}.cloudfunctions.net/${fn}`:'';
}

async function call(path,body){
  const user=auth.currentUser;
  if(!user) throw new Error('La sesión de NODO no está activa.');
  const idToken=await user.getIdToken();

  let first;
  try{first=await request(path,idToken,body)}catch(e){first={networkError:e};}
  if(first?.r&&first.out&&first.r.ok&&first.out?.ok!==false)return first.out;

  // Respaldo: si Hosting no publicó la rewrite /api, intentar la Function directamente.
  const direct=directFunctionUrl(path);
  if(direct){
    try{
      const second=await request(direct,idToken,body);
      if(second.out){
        if(!second.r.ok||second.out?.ok===false)throw new Error(second.out?.error||`Operación no disponible (HTTP ${second.r.status}).`);
        return second.out;
      }
      if(!second.r.ok)throw new Error(`El servicio de firma respondió HTTP ${second.r.status}.`);
    }catch(e){
      if(e?.message&& !String(e.message).includes('Failed to fetch')) throw e;
    }
  }

  if(first?.out)throw new Error(first.out?.error||`Operación no disponible (HTTP ${first.r.status}).`);
  if(first?.r)throw new Error(`El servicio de firma no está publicado correctamente (HTTP ${first.r.status}). Despliega Functions y Hosting.`);
  throw new Error('No fue posible conectar con el servicio de firma. Verifica que Firebase Functions esté desplegado.');
}
export const manageSignerAccount=(body)=>call('/api/manage-signer',body);
export const setSigningPin=(body)=>call('/api/signing-pin',body);
export const signActaWithPin=(body)=>call('/api/sign-acta',body);
