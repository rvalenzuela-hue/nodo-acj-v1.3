import React,{useEffect,useMemo,useState} from 'react';
import {collection,deleteDoc,doc,getDocs,setDoc} from 'firebase/firestore';
import {auth,db} from './firebase';
import {sendActaConformidadEmail} from './config/actaEmail';

const green='#31533a',bright='#3dad2d',border='#dfe5dc',muted='#667268';
const input={width:'100%',boxSizing:'border-box',padding:'9px 10px',border:`1px solid ${border}`,borderRadius:8,fontSize:12,background:'#fff'};
const btn=(kind='primary')=>({border:0,borderRadius:8,padding:'8px 10px',fontWeight:800,cursor:'pointer',background:kind==='primary'?bright:kind==='danger'?'#b93333':'#e9eee7',color:kind==='primary'||kind==='danger'?'#fff':green,fontSize:11});
const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const token=()=>`${uid()}-${Math.random().toString(36).slice(2,12)}`;
const today=()=>new Date().toISOString().slice(0,10);
const blankParticipant=()=>({id:uid(),nombre:'',cargo:'',correo:'',participacion:'Presencial',asistencia:'Presente',firmaEstado:'Pendiente',firmaToken:'',firmaMetodo:'',conformidadEn:'',emailEnviadoEn:''});
const blankActa=()=>({tipoDocumento:'Minuta',titulo:'',fecha:today(),hora:'',lugar:'',modalidad:'Híbrida',meetUrl:'',preside:'',secretaria:'',ordenDia:'',desarrollo:'',acuerdos:'',observaciones:'',estado:'Borrador',participantes:[blankParticipant()]});
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

export default function ActasHibridas({focus,onChanged}){
  const [form,setForm]=useState(blankActa()),[editing,setEditing]=useState(null),[items,setItems]=useState([]),[firmas,setFirmas]=useState([]),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);
  async function load(){
    const [a,f]=await Promise.all([getDocs(collection(db,'minutasMesa')).catch(()=>({docs:[]})),getDocs(collection(db,'actaFirmas')).catch(()=>({docs:[]}))]);
    setItems(a.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>String(y.fecha||y.creadoEn||'').localeCompare(String(x.fecha||x.creadoEn||''))));
    setFirmas(f.docs.map(d=>({id:d.id,...d.data()})));
  }
  useEffect(()=>{load()},[]);
  const merged=useMemo(()=>items.map(x=>({...x,participantes:(x.participantes||[]).map(p=>{const f=firmas.find(s=>s.actaId===x.id&&s.participanteId===p.id);return f?{...p,firmaEstado:f.estado||p.firmaEstado,conformidadEn:f.conformidadEn||p.conformidadEn,firmaMetodo:f.metodo||p.firmaMetodo,emailEnviadoEn:f.emailEnviadoEn||p.emailEnviadoEn||''}:{...p};})})),[items,firmas]);
  function reset(){setEditing(null);setForm(blankActa());setMsg('');}
  function updateP(i,key,value){setForm(f=>({...f,participantes:f.participantes.map((p,n)=>n===i?{...p,[key]:value}:p)}));}
  function addP(){setForm(f=>({...f,participantes:[...f.participantes,blankParticipant()]}));}
  function removeP(i){setForm(f=>({...f,participantes:f.participantes.filter((_,n)=>n!==i)}));}
  function edit(x){setEditing(x.id);setForm({...blankActa(),...x,participantes:(x.participantes?.length?x.participantes:[blankParticipant()]).map(p=>({...blankParticipant(),...p}))});setMsg('Editando acta existente.');}
  async function save(close=false){
    if(busy)return;
    setBusy(true);
    setMsg(close?'Cerrando acta…':'Guardando…');
    try{
    if(!form.titulo.trim()){setMsg('Captura el título de la minuta o acta.');return;}
    const participantes=form.participantes.filter(p=>p.nombre.trim()).map(p=>({...p,firmaToken:p.participacion==='Google Meet'?(p.firmaToken||token()):p.firmaToken||'',firmaMetodo:p.participacion==='Presencial'?(p.firmaMetodo||'Firma autógrafa'):p.firmaMetodo||'Conformidad electrónica'}));
    if(!participantes.length){setMsg('Agrega al menos una persona asistente.');return;}
    const id=editing||uid(),now=new Date().toISOString();
    const estado=close?'Cerrada':(form.estado||'Borrador');
    const payload={...form,id,participantes,estado,programaId:focus?.programaId||form.programaId||'',actividadId:focus?.actividadId||form.actividadId||'',actualizadoEn:now,actualizadoPor:auth.currentUser?.email||'',creadoEn:form.creadoEn||now,creadoPor:form.creadoPor||auth.currentUser?.email||'',versionDocumento:Number(form.versionDocumento||0)+1};
    await setDoc(doc(db,'minutasMesa',id),payload,{merge:false});
    for(const p of participantes.filter(p=>p.participacion==='Google Meet'&&p.firmaToken)){
      const existing=firmas.find(s=>s.id===p.firmaToken);
      if(existing?.estado==='Conforme') continue;
      try{
        await setDoc(doc(db,'actaFirmas',p.firmaToken),{actaId:id,participanteId:p.id,nombre:p.nombre,cargo:p.cargo||'',correo:p.correo||'',titulo:payload.titulo,tipoDocumento:payload.tipoDocumento,fecha:payload.fecha,hora:payload.hora||'',lugar:payload.lugar||'',modalidad:payload.modalidad,ordenDia:payload.ordenDia||'',desarrollo:payload.desarrollo||'',acuerdos:payload.acuerdos||'',observaciones:payload.observaciones||'',versionDocumento:payload.versionDocumento,estado:'Pendiente',metodo:'Conformidad electrónica',creadoEn:now,conformidadEn:'',declaracion:'Declaro que participé de forma remota y manifiesto mi conformidad con el contenido y los acuerdos asentados en este documento.'},{merge:true});
      }catch(e){
        console.error('No se pudo sincronizar evidencia remota',e);
        if(!close) throw e;
      }
    }
    setMsg(close?'Acta cerrada correctamente. Se conserva la versión y la evidencia de conformidad.':'Minuta/acta guardada.');
    setEditing(id);setForm(payload);await load();onChanged?.();
    }catch(e){
      console.error(e);
      setMsg(close?`No fue posible cerrar el acta: ${e?.message||'error de guardado'}`:`No fue posible guardar: ${e?.message||'error de guardado'}`);
    }finally{setBusy(false)}
  }
  async function del(x){if(!confirm(`¿Eliminar “${x.titulo}”?`))return;for(const p of x.participantes||[]){if(p.firmaToken)await deleteDoc(doc(db,'actaFirmas',p.firmaToken)).catch(()=>{});}await deleteDoc(doc(db,'minutasMesa',x.id));if(editing===x.id)reset();await load();onChanged?.();}
  function linkFor(p){return `${window.location.origin}${window.location.pathname}?firmaActa=${encodeURIComponent(p.firmaToken)}`;}
  async function copyLink(p){await navigator.clipboard?.writeText(linkFor(p));setMsg(`Enlace de conformidad copiado para ${p.nombre}.`);}
  async function persistEmailSent(p,sentAt){
    if(!editing||!p?.firmaToken)return;
    const updated=form.participantes.map(x=>x.id===p.id?{...x,emailEnviadoEn:sentAt}:x);
    setForm(f=>({...f,participantes:f.participantes.map(x=>x.id===p.id?{...x,emailEnviadoEn:sentAt}:x)}));
    await Promise.all([
      setDoc(doc(db,'actaFirmas',p.firmaToken),{emailEnviadoEn:sentAt,correo:p.correo||''},{merge:true}),
      setDoc(doc(db,'minutasMesa',editing),{participantes:updated,actualizadoEn:new Date().toISOString(),actualizadoPor:auth.currentUser?.email||''},{merge:true})
    ]);
  }
  async function sendEmail(p,{silent=false}={}){
    if(busy)return false;
    if(!editing||!p?.firmaToken){if(!silent)setMsg('Guarda primero el acta para generar el enlace individual.');return false;}
    if(!String(p.correo||'').trim()){if(!silent)setMsg(`Captura el correo de ${p.nombre||'la persona participante'}.`);return false;}
    try{
      if(!silent){setBusy(true);setMsg(`Enviando solicitud a ${p.correo}…`);}
      const out=await sendActaConformidadEmail({to:p.correo,nombre:p.nombre,titulo:form.titulo,tipoDocumento:form.tipoDocumento,fecha:form.fecha,hora:form.hora,link:linkFor(p)});
      const sentAt=out?.sentAt||new Date().toISOString();
      await persistEmailSent(p,sentAt);
      if(!silent){setMsg(`Solicitud de conformidad enviada a ${p.correo}.`);await load();}
      return true;
    }catch(e){
      console.error(e);
      if(!silent)setMsg(`No fue posible enviar el correo: ${e?.message||'error del servicio'}`);
      return false;
    }finally{if(!silent)setBusy(false);}
  }
  async function sendAllPending(){
    if(busy)return;
    const pending=form.participantes.filter(p=>p.participacion==='Google Meet'&&p.firmaToken&&p.correo&&p.firmaEstado!=='Conforme');
    if(!pending.length){setMsg('No hay solicitudes remotas pendientes con correo capturado.');return;}
    setBusy(true);let ok=0,fail=0;const sent={};setMsg(`Enviando ${pending.length} solicitud(es)…`);
    for(const p of pending){
      try{
        const out=await sendActaConformidadEmail({to:p.correo,nombre:p.nombre,titulo:form.titulo,tipoDocumento:form.tipoDocumento,fecha:form.fecha,hora:form.hora,link:linkFor(p)});
        const sentAt=out?.sentAt||new Date().toISOString();sent[p.id]=sentAt;
        await setDoc(doc(db,'actaFirmas',p.firmaToken),{emailEnviadoEn:sentAt,correo:p.correo||''},{merge:true});ok++;
      }catch(e){console.error(e);fail++;}
    }
    if(editing&&Object.keys(sent).length){
      const updated=form.participantes.map(p=>sent[p.id]?{...p,emailEnviadoEn:sent[p.id]}:p);
      setForm(f=>({...f,participantes:f.participantes.map(p=>sent[p.id]?{...p,emailEnviadoEn:sent[p.id]}:p)}));
      await setDoc(doc(db,'minutasMesa',editing),{participantes:updated,actualizadoEn:new Date().toISOString(),actualizadoPor:auth.currentUser?.email||''},{merge:true});
    }
    await load();setBusy(false);setMsg(fail?`Envío terminado: ${ok} enviado(s), ${fail} con error.`:`${ok} solicitud(es) de conformidad enviadas correctamente.`);
  }
  function markAutograph(i){updateP(i,'firmaEstado','Firma autógrafa recabada');updateP(i,'conformidadEn',new Date().toISOString());}
  function printActa(x){
    const rows=(x.participantes||[]).map((p,i)=>`<tr><td>${i+1}</td><td>${esc(p.nombre)}</td><td>${esc(p.cargo||'')}</td><td>${esc(p.participacion)}</td><td>${esc(p.firmaEstado||'Pendiente')}</td><td>${p.conformidadEn?esc(new Date(p.conformidadEn).toLocaleString('es-MX')):''}</td></tr>`).join('');
    const clause='Las personas identificadas como participantes remotos asistieron mediante Google Meet, pudiendo escuchar, intervenir y manifestar su voluntad durante la reunión. Las firmas autógrafas y, en su caso, las manifestaciones de conformidad electrónica forman parte integral de este documento.';
    const w=window.open('','_blank');if(!w)return;
    w.document.write(`<!doctype html><html><head><title>${esc(x.titulo)}</title><style>body{font-family:Arial,sans-serif;color:#222;margin:34px;line-height:1.45}h1{font-size:20px;color:#31533a}h2{font-size:14px;color:#31533a;margin-top:22px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #bbb;padding:6px;text-align:left;vertical-align:top}.meta{font-size:12px}.box{white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:6px}.clause{font-size:11px;margin-top:24px}.sig{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:50px}.line{border-top:1px solid #333;padding-top:5px;text-align:center;font-size:11px}@media print{button{display:none}}</style></head><body><div style="text-align:center"><img src="/logo-asociacion-comercio-justo.png" style="max-width:150px;max-height:100px"><div style="font-size:12px;font-weight:bold">ASOCIACIÓN DE COMERCIO JUSTO CAMPOS BÓRQUEZ A.C.</div></div><h1>${esc(x.tipoDocumento||'Acta')}: ${esc(x.titulo)}</h1><div class="meta"><b>Fecha:</b> ${esc(x.fecha||'')} ${esc(x.hora||'')} &nbsp; <b>Modalidad:</b> ${esc(x.modalidad||'')}<br><b>Lugar:</b> ${esc(x.lugar||'')} ${x.meetUrl?`<br><b>Videoconferencia:</b> Google Meet`:''}<br><b>Preside:</b> ${esc(x.preside||'')} &nbsp; <b>Secretaría:</b> ${esc(x.secretaria||'')} &nbsp; <b>Estado:</b> ${esc(x.estado||'')}</div><h2>Asistencia</h2><table><thead><tr><th>#</th><th>Nombre</th><th>Cargo / carácter</th><th>Participación</th><th>Firma / conformidad</th><th>Fecha y hora</th></tr></thead><tbody>${rows}</tbody></table><h2>Orden del día</h2><div class="box">${esc(x.ordenDia||'—')}</div><h2>Desarrollo de la reunión</h2><div class="box">${esc(x.desarrollo||'—')}</div><h2>Acuerdos, responsables y fechas</h2><div class="box">${esc(x.acuerdos||'—')}</div>${x.observaciones?`<h2>Observaciones</h2><div class="box">${esc(x.observaciones)}</div>`:''}<div class="clause">${esc(clause)}</div><div class="sig"><div class="line">Quien preside</div><div class="line">Quien levanta el acta / Secretaría</div></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();
  }
  return <div>
    <div style={{fontSize:11,color:muted,marginBottom:8}}>Reunión presencial, remota o híbrida · firmas autógrafas y conformidad electrónica</div>
    <div style={{display:'grid',gap:7}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 110px',gap:6}}><select style={input} value={form.tipoDocumento} onChange={e=>setForm({...form,tipoDocumento:e.target.value})}><option>Minuta</option><option>Acta de reunión</option><option>Acta de Comité</option><option>Acta de Asamblea</option></select><select style={input} value={form.modalidad} onChange={e=>setForm({...form,modalidad:e.target.value})}><option>Híbrida</option><option>Presencial</option><option>Remota</option></select></div>
      <input style={input} placeholder="Título / asunto de la reunión" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}><input style={input} type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/><input style={input} type="time" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})}/></div>
      <input style={input} placeholder="Lugar físico" value={form.lugar} onChange={e=>setForm({...form,lugar:e.target.value})}/>
      {form.modalidad!=='Presencial'&&<input style={input} placeholder="Enlace de Google Meet" value={form.meetUrl} onChange={e=>setForm({...form,meetUrl:e.target.value})}/>} 
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}><input style={input} placeholder="Quien preside" value={form.preside} onChange={e=>setForm({...form,preside:e.target.value})}/><input style={input} placeholder="Secretaría / quien levanta el acta" value={form.secretaria} onChange={e=>setForm({...form,secretaria:e.target.value})}/></div>
      <details open><summary style={{cursor:'pointer',fontWeight:800,color:green,fontSize:12}}>Asistentes ({form.participantes.length})</summary><div style={{display:'grid',gap:7,marginTop:7}}>{form.participantes.map((p,i)=><div key={p.id} style={{border:`1px solid ${border}`,borderRadius:8,padding:7,background:'#f9faf8'}}><input style={{...input,marginBottom:5}} placeholder="Nombre completo" value={p.nombre} onChange={e=>updateP(i,'nombre',e.target.value)}/><input style={{...input,marginBottom:5}} placeholder="Cargo / carácter" value={p.cargo} onChange={e=>updateP(i,'cargo',e.target.value)}/><input style={{...input,marginBottom:5}} placeholder="Correo (para remoto)" value={p.correo} onChange={e=>updateP(i,'correo',e.target.value)}/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}><select style={input} value={p.participacion} onChange={e=>updateP(i,'participacion',e.target.value)}><option>Presencial</option><option>Google Meet</option></select><select style={input} value={p.asistencia} onChange={e=>updateP(i,'asistencia',e.target.value)}><option>Presente</option><option>Ausente</option><option>Invitado</option></select></div><div style={{display:'flex',gap:5,marginTop:6,flexWrap:'wrap'}}>{p.participacion==='Presencial'&&<button style={btn('secondary')} onClick={()=>markAutograph(i)}>Registrar firma autógrafa</button>}{p.participacion==='Google Meet'&&p.firmaToken&&<><button disabled={busy||!p.correo} style={{...btn(),opacity:(busy||!p.correo)?0.5:1}} onClick={()=>sendEmail(p)}>Enviar solicitud por correo</button><button style={btn('secondary')} onClick={()=>copyLink(p)}>Copiar enlace</button></>}<button style={btn('danger')} onClick={()=>removeP(i)}>Quitar</button></div><div style={{fontSize:10,color:muted,marginTop:4}}>Estado: {p.firmaEstado||'Pendiente'}{p.conformidadEn?` · conformidad ${new Date(p.conformidadEn).toLocaleString('es-MX')}`:''}{p.emailEnviadoEn?` · correo enviado ${new Date(p.emailEnviadoEn).toLocaleString('es-MX')}`:''}</div></div>)}</div><button style={{...btn('secondary'),marginTop:7}} onClick={addP}>+ Agregar asistente</button></details>
      <textarea style={{...input,minHeight:62}} placeholder="Orden del día" value={form.ordenDia} onChange={e=>setForm({...form,ordenDia:e.target.value})}/>
      <textarea style={{...input,minHeight:70}} placeholder="Desarrollo de la reunión" value={form.desarrollo} onChange={e=>setForm({...form,desarrollo:e.target.value})}/>
      <textarea style={{...input,minHeight:90}} placeholder="Acuerdos, responsables y fechas" value={form.acuerdos} onChange={e=>setForm({...form,acuerdos:e.target.value})}/>
      <textarea style={{...input,minHeight:55}} placeholder="Observaciones" value={form.observaciones} onChange={e=>setForm({...form,observaciones:e.target.value})}/>
      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}><button disabled={busy||form.estado==='Cerrada'} style={{...btn(),opacity:(busy||form.estado==='Cerrada')?0.55:1}} onClick={()=>save(false)}>{busy?'Guardando…':editing?'Guardar cambios':'Guardar borrador'}</button><button disabled={busy||form.estado==='Cerrada'} style={{...btn('secondary'),opacity:(busy||form.estado==='Cerrada')?0.55:1}} onClick={()=>save(true)}>{form.estado==='Cerrada'?'Acta cerrada':busy?'Procesando…':'Cerrar acta'}</button>{editing&&<button style={btn('secondary')} onClick={()=>printActa({...form,id:editing})}>Imprimir</button>}<button style={btn('secondary')} onClick={reset}>Nueva</button>{editing&&form.participantes.some(p=>p.participacion==='Google Meet'&&p.firmaToken&&p.correo&&p.firmaEstado!=='Conforme')&&<button disabled={busy} style={{...btn(),opacity:busy?0.55:1}} onClick={sendAllPending}>Enviar a todos los pendientes</button>}</div>{msg&&<div style={{fontSize:11,color:green,fontWeight:800}}>{msg}</div>}
    </div>
    <details style={{marginTop:12}}><summary style={{cursor:'pointer',fontWeight:800,color:green,fontSize:12}}>Actas y minutas guardadas ({merged.length})</summary><div style={{display:'grid',gap:7,marginTop:7,maxHeight:330,overflow:'auto'}}>{merged.slice(0,20).map(x=><div key={x.id} style={{border:`1px solid ${border}`,borderRadius:8,padding:8}}><div style={{display:'flex',justifyContent:'space-between',gap:7}}><div><b style={{fontSize:11}}>{x.titulo}</b><div style={{fontSize:10,color:muted}}>{x.fecha} · {x.modalidad||'—'} · {x.estado||'Borrador'}</div></div><span style={{fontSize:10,color:green,fontWeight:800}}>{(x.participantes||[]).filter(p=>p.firmaEstado&&p.firmaEstado!=='Pendiente').length}/{(x.participantes||[]).length} conformidades/firmas</span></div><div style={{display:'flex',gap:5,marginTop:6,flexWrap:'wrap'}}><button style={btn('secondary')} onClick={()=>edit(x)}>Editar</button><button style={btn('secondary')} onClick={()=>printActa(x)}>Imprimir</button><button style={btn('danger')} onClick={()=>del(x)}>Eliminar</button>{(x.participantes||[]).filter(p=>p.participacion==='Google Meet'&&p.firmaToken).map(p=><button key={p.id} style={btn('secondary')} onClick={()=>copyLink(p)}>Enlace · {p.nombre.split(' ')[0]}{p.emailEnviadoEn?' · enviado':''}</button>)}</div></div>)}{!merged.length&&<div style={{fontSize:11,color:muted}}>Aún no hay actas guardadas.</div>}</div></details>
  </div>;
}
