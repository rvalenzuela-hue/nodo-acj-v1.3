const {onRequest}=require("firebase-functions/v2/https");
const {defineSecret}=require("firebase-functions/params");
const logger=require("firebase-functions/logger");
const admin=require("firebase-admin");
const nodemailer=require("nodemailer");

admin.initializeApp();

const SMTP_USER=defineSecret("SMTP_USER");
const SMTP_PASS=defineSecret("SMTP_PASS");
const SMTP_HOST=defineSecret("SMTP_HOST");
const SMTP_PORT=defineSecret("SMTP_PORT");
const EXPENSE_EMAIL_TO=defineSecret("EXPENSE_EMAIL_TO");

function clean(value,max=4000){
  return String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max);
}
async function verifyBearer(req){
  const authHeader=String(req.headers.authorization||"");
  const match=authHeader.match(/^Bearer\s+(.+)$/i);
  if(!match)throw Object.assign(new Error("Missing bearer token"),{status:401});
  return admin.auth().verifyIdToken(match[1]);
}
function escapeHtml(v){
  return clean(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

exports.sendExpenseEmail=onRequest({
  region:"us-central1",
  cors:false,
  secrets:[SMTP_USER,SMTP_PASS,SMTP_HOST,SMTP_PORT,EXPENSE_EMAIL_TO],
  timeoutSeconds:30,
  memory:"256MiB"
},async(req,res)=>{
  if(req.method!=="POST"){res.set("Allow","POST");return res.status(405).json({ok:false,error:"Método no permitido."});}
  try{
    const decoded=await verifyBearer(req);
    const body=req.body&&typeof req.body==="object"?req.body:{};
    const data={
      solicitante:clean(body.solicitante,250),
      asociacion:clean(body.asociacion,250),
      centro_costo:clean(body.centro_costo,250),
      proveedor:clean(body.proveedor,250),
      descripcion:clean(body.descripcion,1500),
      finalidad:clean(body.finalidad,1500),
      monto_mxn:clean(body.monto_mxn,100),
      fecha:clean(body.fecha,100)
    };
    const required=["solicitante","descripcion","monto_mxn"];
    if(required.some(k=>!data[k]))return res.status(400).json({ok:false,error:"Faltan datos obligatorios del gasto."});

    const port=Number(SMTP_PORT.value()||587);
    const transporter=nodemailer.createTransport({
      host:SMTP_HOST.value(),
      port:Number.isFinite(port)?port:587,
      secure:port===465,
      auth:{user:SMTP_USER.value(),pass:SMTP_PASS.value()}
    });
    const to=EXPENSE_EMAIL_TO.value();
    if(!to)throw new Error("EXPENSE_EMAIL_TO no configurado.");

    const rows=Object.entries({
      "Solicitante":data.solicitante,
      "Asociación":data.asociacion,
      "Centro de costo":data.centro_costo,
      "Proveedor":data.proveedor,
      "Descripción":data.descripcion,
      "Finalidad":data.finalidad,
      "Monto":data.monto_mxn,
      "Fecha":data.fecha
    }).map(([k,v])=>`<tr><td style="padding:7px 10px;border:1px solid #ddd;font-weight:700">${escapeHtml(k)}</td><td style="padding:7px 10px;border:1px solid #ddd">${escapeHtml(v||"—")}</td></tr>`).join("");

    await transporter.sendMail({
      from:`NODO <${SMTP_USER.value()}>`,
      to,
      subject:`Solicitud de gasto · ${data.solicitante||"NODO"} · ${data.monto_mxn||""}`,
      text:[
        "Nueva solicitud de gasto desde NODO",
        `Solicitante: ${data.solicitante||"—"}`,
        `Asociación: ${data.asociacion||"—"}`,
        `Centro de costo: ${data.centro_costo||"—"}`,
        `Proveedor: ${data.proveedor||"—"}`,
        `Descripción: ${data.descripcion||"—"}`,
        `Finalidad: ${data.finalidad||"—"}`,
        `Monto: ${data.monto_mxn||"—"}`,
        `Fecha: ${data.fecha||"—"}`
      ].join("\n"),
      html:`<div style="font-family:Arial,sans-serif;color:#263329"><h2 style="color:#31533a">Nueva solicitud de gasto</h2><p>Registrada desde NODO.</p><table style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table><p style="font-size:12px;color:#667268">Usuario autenticado: ${escapeHtml(decoded.email||decoded.uid)}</p></div>`
    });

    return res.status(200).json({ok:true});
  }catch(error){
    logger.error("sendExpenseEmail failed",{message:error?.message,code:error?.code});
    const status=error?.status||((String(error?.code||"").startsWith("auth/"))?401:500);
    return res.status(status).json({ok:false,error:status===401?"Sesión no autorizada.":"No fue posible enviar el correo."});
  }
});
