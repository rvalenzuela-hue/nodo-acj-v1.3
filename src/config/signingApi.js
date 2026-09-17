import {auth} from '../firebase';

async function call(path,body){
  const user=auth.currentUser;
  if(!user) throw new Error('La sesión de NODO no está activa.');
  const idToken=await user.getIdToken();
  const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${idToken}`},body:JSON.stringify(body||{})});
  const text=await r.text();let out;try{out=JSON.parse(text)}catch{throw new Error(`El servicio respondió en un formato no válido (HTTP ${r.status}).`)}
  if(!r.ok||out?.ok===false)throw new Error(out?.error||`Operación no disponible (HTTP ${r.status}).`);
  return out;
}
export const manageSignerAccount=(body)=>call('/api/manage-signer',body);
export const setSigningPin=(body)=>call('/api/signing-pin',body);
export const signActaWithPin=(body)=>call('/api/sign-acta',body);
