import "./styles.css";

type Note = { id: string; title: string; body: string; updatedAt: number };
const KEY = "krakennotes.notes.v1";
const load = (): Note[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Note[]; } catch { return []; } };
let notes = load(), activeId: string | null = notes[0]?.id ?? null, query = "";
const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing app root");
root.innerHTML = `<main class="layout"><aside class="sidebar"><div class="brand"><b>k.</b><strong>kraken<span>notes</span></strong></div><button id="new" class="new">＋ Nouvelle note</button><p class="label">ESPACE PERSONNEL</p><div class="nav active">▤ Toutes les notes <b id="count">0</b></div><div class="bottom"><i></i> Stockage local <small>LOCAL</small></div></aside><section class="main"><header><div>Mes notes <span>/</span> <b id="crumb">Nouvelle note</b></div><button id="delete" title="Supprimer">⌫</button></header><div class="workspace"><section class="list-panel"><div class="list-title"><h2>Notes</h2><button id="add">＋</button></div><input id="search" placeholder="⌕  Rechercher..." /><div id="list"></div></section><article class="editor"><div class="meta"><span>NOTE PERSONNELLE</span><time id="updated"></time></div><input id="title" class="title" placeholder="Titre de la note" maxlength="120"/><textarea id="body" placeholder="Commence à écrire ici…&#10;&#10;Tes idées, tes listes, tes pensées. Tout reste sur cet appareil."></textarea><footer><span>Stockage local · privé sur cet appareil</span><span id="words">0 mots</span></footer></article></div><div class="bottom-bar"><b>KrakenNotes <small>v0.1.0</small></b><span>FAIT POUR CAPTURER LES IDÉES.</span></div></section></main>`;
const $ = <T extends HTMLElement>(s: string): T => { const e = document.querySelector<T>(s); if (!e) throw new Error("Missing "+s); return e; };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
function persist(){localStorage.setItem(KEY,JSON.stringify(notes));}
function current(){return notes.find(n=>n.id===activeId)??null;}
function create(){const n:Note={id:crypto.randomUUID(),title:"",body:"",updatedAt:Date.now()};notes.unshift(n);activeId=n.id;persist();renderList();renderEditor();$("input#title").focus();}
function renderList(){const list=$("div#list");const filtered=notes.filter(n=>(n.title+" "+n.body).toLowerCase().includes(query.toLowerCase()));$("b#count").textContent=String(notes.length);list.innerHTML=filtered.length?filtered.map(n=>`<button class="note ${n.id===activeId?"selected":""}" data-id="${n.id}"><strong>${escapeHtml(n.title||"Sans titre")}</strong><span>${escapeHtml(n.body.slice(0,64)||"Aucun contenu")}</span><small>${new Date(n.updatedAt).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})}</small></button>`).join(""):`<p class="empty">Aucune note trouvée</p>`;list.querySelectorAll<HTMLButtonElement>("[data-id]").forEach(b=>b.addEventListener("click",()=>{activeId=b.dataset.id??null;renderList();renderEditor();}));}
function renderEditor(){const n=current();$("input#title").value=n?.title??"";$("textarea#body").value=n?.body??"";$("b#crumb").textContent=n?.title||"Nouvelle note";$("time#updated").textContent=n?new Date(n.updatedAt).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"";$("button#delete").toggleAttribute("disabled",!n);wordCount();}
function wordCount(){const s=$("textarea#body").value.trim();$("span#words").textContent=(s?s.split(/\s+/).length:0)+" mots";}
function change(field:"title"|"body",value:string){let n=current();if(!n){create();n=current();if(!n)return;}n[field]=value;n.updatedAt=Date.now();persist();renderList();$("b#crumb").textContent=n.title||"Nouvelle note";$("time#updated").textContent=new Date(n.updatedAt).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"});wordCount();}
$("button#new").addEventListener("click",create);$("button#add").addEventListener("click",create);
$("button#delete").addEventListener("click",()=>{if(!activeId)return;notes=notes.filter(n=>n.id!==activeId);activeId=notes[0]?.id??null;persist();renderList();renderEditor();});
$("input#search").addEventListener("input",e=>{query=(e.target as HTMLInputElement).value;renderList();});
$("input#title").addEventListener("input",e=>change("title",(e.target as HTMLInputElement).value));
$("textarea#body").addEventListener("input",e=>change("body",(e.target as HTMLTextAreaElement).value));
window.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="n"){e.preventDefault();create();}});
if(!notes.length){const n:Note={id:crypto.randomUUID(),title:"Bienvenue dans KrakenNotes",body:"Capture tes idées ici.\n\n• Crée une note avec le bouton +\n• Recherche dans tes notes\n• Tes notes restent stockées localement sur cet appareil.",updatedAt:Date.now()};notes=[n];activeId=n.id;persist();}
renderList();renderEditor();
