import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,createUserWithEmailAndPassword,updateProfile,signOut} from 'firebase/auth';
import {doc,setDoc} from 'firebase/firestore';
import {auth,db,firebaseConfig} from '../firebase';

const normalize=v=>String(v||'').trim().toLowerCase().replace(/\s+/g,'');
const authEmail=username=>`${normalize(username)}@firmas.nodo.app`;

// Respaldo para instalaciones donde las Cloud Functions todavía no están desplegadas.
// Usa una instancia secundaria de Firebase Auth para no cerrar la sesión del administrador.
export async function bootstrapSignerLocally({username,nombre,cargo,temporaryPassword,activo=true}){
  const usuario=normalize(username);
  if(!/^[a-z0-9._-]{4,32}$/.test(usuario)) throw new Error('Nombre de usuario firmante no válido.');
  if(String(temporaryPassword||'').length<8) throw new Error('La contraseña temporal debe tener al menos 8 caracteres.');
  const email=authEmail(usuario);
  const appName=`signer-bootstrap-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const secondary=initializeApp(firebaseConfig,appName);
  const secondaryAuth=getAuth(secondary);
  try{
    const cred=await createUserWithEmailAndPassword(secondaryAuth,email,String(temporaryPassword));
    if(nombre) await updateProfile(cred.user,{displayName:nombre});
    const profile={email,usuario,nombre:nombre||'',cargo:cargo||'',alcance:'Firmas',rol:'Firmante',activo:activo!==false,uid:cred.user.uid,actualizadoEn:new Date().toISOString(),otorgadoPor:auth.currentUser?.email||auth.currentUser?.uid||'',origenAlta:'cliente-respaldo'};
    await setDoc(doc(db,'usuariosNodo',email),profile,{merge:true});
    await signOut(secondaryAuth).catch(()=>{});
    return {ok:true,created:true,uid:cred.user.uid,username:usuario,profileId:email,fallback:true};
  } finally {
    await deleteApp(secondary).catch(()=>{});
  }
}
