"use strict";
const KEY="conectaplay_demo_1";
let dados;try{dados=JSON.parse(localStorage.getItem(KEY))||{contato:"11921078702",clientes:[]}}catch{dados={contato:"11921078702",clientes:[]}}
function salvar(){localStorage.setItem(KEY,JSON.stringify(dados))}
function $(id){return document.getElementById(id)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function tela(id){document.querySelectorAll("main section").forEach(s=>s.hidden=s.id!==id);if(id==="admin")renderAdmin();if(id==="cadastro")renderMeu();scrollTo(0,0)}
const apps=[
{nome:"Bob Player",grupo:"smart",icone:"📺",obs:"Confirme a disponibilidade na loja de aplicativos do seu aparelho."},
{nome:"IBO Player",grupo:"smart",icone:"📺",obs:"Consulte a loja oficial da Smart TV."},
{nome:"IBO Revenda",grupo:"android",icone:"📱",obs:"Confirme se o aplicativo é destinado ao usuário final."},
{nome:"UniTV",grupo:"android",icone:"📱",obs:"Disponibilidade e licenciamento devem ser confirmados."},
{nome:"Facilita 24",grupo:"android",icone:"▶️",obs:"Nome informado; instruções oficiais pendentes."},
{nome:"Absoluto Player",grupo:"smart",icone:"▶️",obs:"Instruções e dispositivos compatíveis a confirmar."},
{nome:"Smarters Player Lite",grupo:"ios",icone:"📱",obs:"Verifique a disponibilidade na App Store."},
{nome:"Opera XC",grupo:"android",icone:"📺",codigo:"17546",obs:"Código ntDown informado; confirme com o fornecedor."},
{nome:"Opera Play",grupo:"android",icone:"📺",codigo:"47249",obs:"Código ntDown informado; confirme com o fornecedor."},
{nome:"Opera PRO V2",grupo:"android",icone:"📺",codigo:"13425",obs:"Código ntDown informado; confirme com o fornecedor."},
{nome:"Opera OTT",grupo:"android",icone:"📺",codigo:"15144",obs:"Código ntDown informado; confirme com o fornecedor."},
{nome:"Multiverse",grupo:"android",icone:"📺",codigo:"99537",obs:"Código ntDown informado; confirme com o fornecedor."}
];
function filtrar(grupo){$("catalogo").innerHTML=apps.filter(a=>grupo==="todos"||a.grupo===grupo).map(a=>`<article><div class="appIcon">${a.icone}</div><h3>${esc(a.nome)}</h3><p>${esc(a.obs)}</p>${a.codigo?`<p class="tag">ntDown: ${a.codigo}</p><button onclick="copiar('${a.codigo}')">Copiar código</button>`:""}<p><small>Tutorial em preparação</small></p></article>`).join("")}
async function copiar(s){try{await navigator.clipboard.writeText(s);alert("Copiado: "+s)}catch{prompt("Copie o código:",s)}}
function contato(){let num=(dados.contato||"").replace(/\D/g,"");$("suporte").href="https://wa.me/55"+num}
function codigo(){let c;do{c="CP"+Math.random().toString(36).slice(2,8).toUpperCase()}while(dados.clientes.some(x=>x.codigo===c));return c}
function normalWhats(v){let s=String(v).replace(/\D/g,"");if(s.startsWith("55")&&s.length>11)s=s.slice(2);return s}
function incluir(nome,whats,indicacao){nome=nome.trim();whats=normalWhats(whats);if(nome.length<3||whats.length<10||whats.length>11)throw Error("Informe nome e WhatsApp com DDD válidos.");if(dados.clientes.some(x=>x.whats===whats))throw Error("Este WhatsApp já está cadastrado nesta demonstração.");let indicador=dados.clientes.find(x=>x.codigo.toUpperCase()===(indicacao||"").trim().toUpperCase());if(indicacao&&!indicador)throw Error("Código de indicação não encontrado.");let novo={id:Date.now()+"-"+Math.random().toString(36).slice(2),nome,whats,codigo:codigo(),indicadoPor:indicador?.codigo||null,criadoEm:new Date().toISOString()};dados.clientes.push(novo);salvar();return novo}
function cadastrar(){try{let c=incluir($("nomeCliente").value,$("whatsCliente").value,$("indicador").value);localStorage.setItem("cp_meu_codigo",c.codigo);$("cadMsg").textContent="Cadastro registrado nesta demonstração!";renderMeu()}catch(e){$("cadMsg").textContent=e.message}}
function link(c){return location.origin+location.pathname+"?ref="+encodeURIComponent(c)}
function renderMeu(){let c=dados.clientes.find(x=>x.codigo===localStorage.getItem("cp_meu_codigo"));$("meuCadastro").hidden=!c;if(c)$("meuCadastro").innerHTML=`<h2>🎉 Bem-vindo, ${esc(c.nome)}!</h2><p>Seu código: <b>${esc(c.codigo)}</b></p><button onclick="copiar('${c.codigo}')">Copiar código</button><p>Seu link de indicação:</p><p style="overflow-wrap:anywhere">${esc(link(c.codigo))}</p><button onclick="compartilhar('${c.codigo}')">📲 Compartilhar no WhatsApp</button><p><small>O link identifica o indicador apenas nesta demonstração local. O cadastro entre aparelhos será ativado com Supabase.</small></p>`}
function compartilhar(c){let msg="Conheça o ConectaPlay! Cadastre-se pelo meu link: "+link(c);window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank","noopener")}
function renderAdminDemo(){$("atendimento").value=dados.contato;$("clientes").innerHTML=dados.clientes.length?dados.clientes.map(c=>`<div class="entry"><b>${esc(c.nome)}</b> · ${esc(c.whats)}<br><small>Código: ${esc(c.codigo)} | Indicado por: ${esc(c.indicadoPor||"—")}</small><br><button onclick="copiar('${c.codigo}')">Copiar código</button> <button onclick="compartilhar('${c.codigo}')">Compartilhar</button></div>`).join(""):"Nenhum cliente nesta demonstração."}
function cadastrarManual(){try{incluir($("manualNome").value,$("manualWhats").value,"");$("manualNome").value="";$("manualWhats").value="";renderAdmin()}catch(e){alert(e.message)}}
function salvarContato(){let n=normalWhats($("atendimento").value);if(n.length<10||n.length>11)return alert("Número inválido");dados.contato=n;salvar();contato();alert("Contato salvo neste navegador.")}
function exportar(){let b=new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="conectaplay-backup-demo.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
const ref=new URLSearchParams(location.search).get("ref");if(ref)$("indicador").value=ref;
filtrar("todos");contato();renderMeu();

// Etapa 3: autenticacao Supabase. Chave publishable publica, nunca chave secreta.
const CP_URL="https://wdqzldelfwdtdppyjnhh.supabase.co";
const CP_KEY="sb_publishable_VUvBiOlo7W_1rYWZBmGUPQ_SDXNyBr2";
let cpToken=sessionStorage.getItem("cp_master_token")||"";
let cpExpiry=Number(sessionStorage.getItem("cp_master_expiry")||0);
function cpMsg(msg){$("loginMsg").textContent=msg}
async function cpRequest(path,opts={}){
 const h={"apikey":CP_KEY,"Content-Type":"application/json",...(opts.headers||{})};
 if(cpToken)h.Authorization="Bearer "+cpToken;
 const r=await fetch(CP_URL+path,{...opts,headers:h});
 let body=await r.json().catch(()=>({}));
 if(!r.ok)throw Error(body.msg||body.message||body.error_description||body.error||"Erro de conexão ("+r.status+")");
 return body;
}
function cpLogout(){cpToken="";cpExpiry=0;sessionStorage.removeItem("cp_master_token");sessionStorage.removeItem("cp_master_expiry");renderAdmin()}
async function cpLogin(){
 const email=$("cpEmail").value.trim(),password=$("cpSenha").value;
 if(!email||!password)return cpMsg("Informe e-mail e senha.");
 cpMsg("Entrando...");
 try{
 const data=await cpRequest("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})});
 cpToken=data.access_token;cpExpiry=Date.now()+((data.expires_in||3600)-60)*1000;
 const adm=await cpRequest("/rest/v1/rpc/cp3_sou_admin",{method:"POST",body:"{}"});
 if(adm!==true){cpLogout();return cpMsg("Este usuário não possui autorização Master.")}
 sessionStorage.setItem("cp_master_token",cpToken);sessionStorage.setItem("cp_master_expiry",String(cpExpiry));
 $("cpSenha").value="";renderAdmin();
 }catch(e){cpToken="";cpMsg("Não foi possível entrar: "+e.message)}
}
async function renderAdmin(){
 const logged=cpToken&&cpExpiry>Date.now();
 $("cpLogin").hidden=!!logged;$("cpPainel").hidden=!logged;
 if(!logged){cpToken="";return}
 $("cpLista").textContent="Carregando clientes...";
 try{
 const adm=await cpRequest("/rest/v1/rpc/cp3_sou_admin",{method:"POST",body:"{}"});
 if(adm!==true){cpLogout();return}
 const rows=await cpRequest("/rest/v1/rpc/cp3_listar_clientes",{method:"POST",body:"{}"});
 $("cpLista").innerHTML=rows.length?rows.map(c=>`<div class="entry"><b>${esc(c.nome)}</b> · ${esc(c.whatsapp)}<br><small>Código: ${esc(c.codigo_indicacao)} · Status: ${esc(c.status)} · Indicado por: ${esc(c.indicado_por_codigo||"—")}</small><br><button onclick="copiar('${esc(c.codigo_indicacao)}')">Copiar código</button> <button onclick="compartilhar('${esc(c.codigo_indicacao)}')">Compartilhar</button> <button onclick="cpMudarStatus('${esc(c.id)}','ativo')" ${c.status==="ativo"?"disabled":""}>Aprovar / Ativar</button> <button onclick="cpMudarStatus('${esc(c.id)}','inativo')" ${c.status==="inativo"?"disabled":""}>Bloquear</button></div>`).join(""):"Nenhum cliente cadastrado na nuvem.";
 }catch(e){$("cpLista").textContent="Falha ao carregar: "+e.message}
}
async function cpCriarCliente(){
 const nome=$("cpNome").value.trim(),whatsapp=normalWhats($("cpWhats").value);
 $("cpAcaoMsg").textContent="Salvando...";
 try{
 const c=await cpRequest("/rest/v1/rpc/cp3_criar_cliente",{method:"POST",body:JSON.stringify({p_nome:nome,p_whatsapp:whatsapp})});
 $("cpNome").value="";$("cpWhats").value="";
 $("cpAcaoMsg").textContent="Cliente cadastrado! Código: "+c.codigo_indicacao;
 await renderAdmin();
 }catch(e){$("cpAcaoMsg").textContent="Erro: "+e.message}
}
renderAdmin();

async function cpMudarStatus(id,status){
 if(!["ativo","inativo"].includes(status))return;
 if(!confirm(status==="ativo"?"Ativar este cliente?":"Bloquear este cliente?"))return;
 try{await cpRequest("/rest/v1/rpc/cp4_alterar_status",{method:"POST",body:JSON.stringify({p_id:id,p_status:status})});await renderAdmin()}
 catch(e){alert("Não foi possível alterar o status: "+e.message)}
}

// Etapa 5: cadastro público na nuvem, com aprovação obrigatória.
async function cpCadastroPublico(){
 const btn=$("cpCadastroBtn"), nome=$("nomeCliente").value.trim(), whatsapp=normalWhats($("whatsCliente").value), indicacao=$("indicador").value.trim().toUpperCase();
 if(nome.length<2||nome.length>120||!/^[0-9]{10,11}$/.test(whatsapp)){ $("cadMsg").textContent="Confira o nome e o WhatsApp com DDD.";return; }
 if($("cpArmadilha").value)return;
 btn.disabled=true;$("cadMsg").textContent="Enviando solicitação...";
 try{
 const c=await cpRequest("/rest/v1/rpc/cp5_solicitar_cadastro",{method:"POST",body:JSON.stringify({p_nome:nome,p_whatsapp:whatsapp,p_indicacao:indicacao||null})});
 $("cadMsg").textContent="Solicitação recebida! Aguarde a aprovação. Seu código de indicação: "+c.codigo;
 $("nomeCliente").value="";$("whatsCliente").value="";
 }catch(e){$("cadMsg").textContent="Não foi possível solicitar: "+e.message}
 finally{btn.disabled=false}
}
