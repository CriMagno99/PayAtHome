{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 /**************************************************\
 * SMART FINANCE v3 \'96 Budget, Risparmi, Previsioni\
 **************************************************/\
\
let spese = JSON.parse(localStorage.getItem("speseCasa")) || [];\
let redditi = JSON.parse(localStorage.getItem("redditiCasa")) || [];\
let obiettivi = JSON.parse(localStorage.getItem("obiettiviCasa")) || \{\};\
\
// === Elementi principali ===\
const speseLista = document.getElementById("spese-lista");\
const totaliContainer = document.getElementById("totali-container");\
const btnNuovaSpesa = document.getElementById("btn-nuova-spesa");\
const modalSpesa = document.getElementById("modal-spesa");\
const spanClose = document.querySelector(".close");\
const formSpesa = document.getElementById("form-spesa");\
\
// === Redditi ===\
const redditiLista = document.getElementById("redditi-lista");\
const btnNuovoReddito = document.getElementById("btn-nuovo-reddito");\
\
// === Analisi ===\
const riepilogoBilancio = document.getElementById("riepilogo-bilancio");\
const mediaMensile = document.getElementById("media-mensile");\
\
// === Budget e Risparmi ===\
const obiettiviContainer = document.getElementById("obiettivi-container");\
const btnImpostaObiettivi = document.getElementById("btn-imposta-obiettivi");\
const dashboardRisparmi = document.getElementById("dashboard-risparmi");\
const previsioniAI = document.getElementById("previsioni-ai");\
\
// === Toast ===\
const toast = document.createElement("div");\
toast.id = "toast";\
toast.style.cssText = "position:fixed;bottom:20px;right:20px;background:#1e88e5;color:#fff;padding:10px 18px;border-radius:5px;box-shadow:0 2px 6px rgba(0,0,0,0.2);opacity:0;transition:opacity .3s";\
document.body.appendChild(toast);\
function mostraToast(msg) \{\
  toast.textContent = msg;\
  toast.style.opacity = "1";\
  setTimeout(() => toast.style.opacity = "0", 2000);\
\}\
\
// === SALVATAGGIO ===\
function salvaTutti() \{\
  localStorage.setItem("speseCasa", JSON.stringify(spese));\
  localStorage.setItem("redditiCasa", JSON.stringify(redditi));\
  localStorage.setItem("obiettiviCasa", JSON.stringify(obiettivi));\
\}\
function autoSave() \{\
  salvaTutti();\
  mostraToast("\uc0\u55357 \u56510  Salvato automaticamente");\
\}\
\
/**************************************************\
 * SPESE\
 **************************************************/\
function salvaSpesa(e) \{\
  e.preventDefault();\
  const nuova = \{\
    categoria: categoria.value,\
    descrizione: descrizione.value.trim(),\
    importo: parseFloat(importo.value),\
    data: data.value,\
    frequenza: frequenza.value,\
    note: note.value.trim(),\
    id: Date.now()\
  \};\
  spese.push(nuova);\
  autoSave();\
  aggiornaListaSpese();\
  chiudiModal();\
\}\
\
function rimuoviSpesa(id) \{\
  if (!confirm("Eliminare questa spesa?")) return;\
  spese = spese.filter(s => s.id !== id);\
  autoSave();\
  aggiornaListaSpese();\
\}\
\
function aggiornaListaSpese() \{\
  speseLista.innerHTML = "";\
  if (spese.length === 0) \{\
    speseLista.innerHTML = "<p>Nessuna spesa registrata.</p>";\
    totaliContainer.innerHTML = "";\
    aggiornaAnalisi();\
    aggiornaObiettivi();\
    return;\
  \}\
\
  spese.forEach(s => \{\
    const card = document.createElement("div");\
    card.className = "spesa-card";\
    card.innerHTML = `\
      <h3>$\{s.descrizione\}</h3>\
      <p>$\{s.categoria\} - $\{s.frequenza\}</p>\
      <p><strong>$\{s.importo.toFixed(2)\} \'80</strong> | $\{s.data\}</p>\
      $\{s.note ? `<small>Note: $\{s.note\}</small><br>` : ""\}\
      <button onclick="rimuoviSpesa($\{s.id\})">Elimina</button>`;\
    speseLista.appendChild(card);\
  \});\
\
  const totaleSpese = spese.reduce((sum, s) => sum + s.importo, 0);\
  totaliContainer.innerHTML = `<h3>Totale spese:</h3><p>$\{totaleSpese.toFixed(2)\} \'80</p>`;\
  aggiornaAnalisi();\
  aggiornaObiettivi();\
\}\
\
/**************************************************\
 * REDDITI\
 **************************************************/\
function aggiungiReddito() \{\
  const mese = prompt("Inserisci il mese (es. 2025-11):");\
  if (!mese) return;\
  const fonti = [];\
  for (let i = 0; i < 3; i++) \{\
    const nome = prompt(`Fonte reddito $\{i+1\} (lascia vuoto per saltare):`);\
    if (!nome) break;\
    const importo = parseFloat(prompt(`Importo per $\{nome\}:`)) || 0;\
    fonti.push(\{ nome, importo \});\
  \}\
  redditi.push(\{ mese, fonti \});\
  autoSave();\
  aggiornaListaRedditi();\
\}\
\
function aggiornaListaRedditi() \{\
  redditiLista.innerHTML = "";\
  if (redditi.length === 0) \{\
    redditiLista.innerHTML = "<p>Nessun reddito registrato.</p>";\
    aggiornaAnalisi();\
    return;\
  \}\
\
  redditi.forEach(r => \{\
    const card = document.createElement("div");\
    card.className = "reddito-card";\
    const tot = r.fonti.reduce((s,f)=>s+f.importo,0);\
    card.innerHTML = `<h4>$\{r.mese\}</h4>\
      $\{r.fonti.map(f => `<p>$\{f.nome\}: $\{f.importo.toFixed(2)\} \'80</p>`).join("")\}\
      <strong>Totale: $\{tot.toFixed(2)\} \'80</strong>`;\
    redditiLista.appendChild(card);\
  \});\
  aggiornaAnalisi();\
\}\
\
/**************************************************\
 * OBIETTIVI DI BUDGET\
 **************************************************/\
function impostaObiettivi() \{\
  const mese = prompt("Per quale mese vuoi impostare i budget? (es. 2025-11)");\
  if (!mese) return;\
  const categorie = ["Trasporti", "Alloggi", "Mangiare", "Attivit\'e0", "Varie"];\
  obiettivi[mese] = \{\};\
  categorie.forEach(cat => \{\
    const val = parseFloat(prompt(`Budget per $\{cat\} (\'80):`)) || 0;\
    obiettivi[mese][cat] = val;\
  \});\
  autoSave();\
  aggiornaObiettivi();\
\}\
\
function aggiornaObiettivi() \{\
  obiettiviContainer.innerHTML = "";\
  if (Object.keys(obiettivi).length === 0) \{\
    obiettiviContainer.innerHTML = "<p>Nessun obiettivo impostato.</p>";\
    return;\
  \}\
\
  const meseCorrente = new Date().toISOString().slice(0,7);\
  const budget = obiettivi[meseCorrente];\
  if (!budget) \{\
    obiettiviContainer.innerHTML = `<p>Nessun obiettivo per $\{meseCorrente\}.</p>`;\
    return;\
  \}\
\
  const speseMese = spese.filter(s => s.data.startsWith(meseCorrente));\
  const totaliCat = \{\};\
  speseMese.forEach(s => \{\
    totaliCat[s.categoria] = (totaliCat[s.categoria] || 0) + s.importo;\
  \});\
\
  for (let cat in budget) \{\
    const speso = totaliCat[cat] || 0;\
    const limite = budget[cat];\
    const diff = limite - speso;\
    const stato = diff >= 0 ? "OK" : "Superato";\
    const classe = diff >= 0 ? "budget-ok" : "budget-over";\
    obiettiviContainer.innerHTML += `\
      <div class="budget-card">\
        <strong>$\{cat\}</strong>: $\{speso.toFixed(2)\}\'80 / $\{limite.toFixed(2)\}\'80 \
        <span class="$\{classe\}">($\{stato\})</span>\
      </div>`;\
  \}\
\}\
\
/**************************************************\
 * DASHBOARD RISPARMI + PREVISIONI AI\
 **************************************************/\
function aggiornaAnalisi() \{\
  const spesePerMese = \{\};\
  spese.forEach(s => \{\
    const m = s.data.slice(0,7);\
    spesePerMese[m] = (spesePerMese[m] || 0) + s.importo;\
  \});\
\
  const redditiPerMese = \{\};\
  redditi.forEach(r => \{\
    redditiPerMese[r.mese] = r.fonti.reduce((sum,f)=>sum+f.importo,0);\
  \});\
\
  const mesi = new Set([...Object.keys(spesePerMese), ...Object.keys(redditiPerMese)]);\
  const riepilogo = [];\
  let totaleEntrate = 0, totaleSpese = 0;\
\
  mesi.forEach(m => \{\
    const sp = spesePerMese[m] || 0;\
    const rd = redditiPerMese[m] || 0;\
    totaleEntrate += rd;\
    totaleSpese += sp;\
    const saldo = rd - sp;\
    riepilogo.push(\{ mese: m, entrate: rd, spese: sp, saldo \});\
  \});\
\
  // Mostra tabella riepilogo\
  riepilogoBilancio.innerHTML = `\
    <h3>Bilancio Mensile</h3>\
    <table style="width:100%;border-collapse:collapse">\
      <tr><th>Mese</th><th>Entrate</th><th>Spese</th><th>Saldo</th></tr>\
      $\{riepilogo.map(r=>`\
        <tr>\
          <td>$\{r.mese\}</td>\
          <td>$\{r.entrate.toFixed(2)\}\'80</td>\
          <td>$\{r.spese.toFixed(2)\}\'80</td>\
          <td style="color:$\{r.saldo>=0?'green':'red'\}">$\{r.saldo.toFixed(2)\}\'80</td>\
        </tr>`).join("")\}\
    </table>`;\
\
  // Dashboard risparmi\
  if (dashboardRisparmi) \{\
    const saldiPositivi = riepilogo.filter(r => r.saldo > 0);\
    const mediaRisparmio = saldiPositivi.length > 0 ?\
      saldiPositivi.reduce((a,b)=>a+b.saldo,0) / saldiPositivi.length : 0;\
\
    dashboardRisparmi.innerHTML = `\
      <p><strong>Totale risparmi cumulati:</strong> $\{(totaleEntrate - totaleSpese).toFixed(2)\} \'80</p>\
      <p><strong>Media mensile risparmiata:</strong> $\{mediaRisparmio.toFixed(2)\} \'80</p>`;\
  \}\
\
  // Previsioni AI: trend lineare basato sugli ultimi 3 mesi\
  if (previsioniAI && riepilogo.length >= 3) \{\
    const ultimi3 = riepilogo.slice(-3);\
    const trend = ultimi3.reduce((a,b)=>a+b.saldo,0)/3;\
    const previsione = trend + (trend*0.1);\
    previsioniAI.innerHTML = `\
      <p>Basandoci sugli ultimi mesi, la spesa media netta prevista per il prossimo mese \'e8 di \
      <strong>$\{previsione.toFixed(2)\} \'80</strong>.</p>\
      <p>Se mantieni il trend attuale, a fine anno il tuo risparmio stimato sar\'e0 di \
      <strong>$\{(previsione * 12).toFixed(2)\} \'80</strong>.</p>`;\
  \}\
\
  const mediaMensileSaldo = (totaleEntrate - totaleSpese) / (mesi.size || 1);\
  mediaMensile.innerHTML = `<h4>\uc0\u55357 \u56481  Media mensile:</h4>\
    <p style="color:$\{mediaMensileSaldo>=0?'green':'red'\}">$\{mediaMensileSaldo.toFixed(2)\} \'80 / mese</p>`;\
\}\
\
/**************************************************\
 * EVENTI\
 **************************************************/\
btnNuovoReddito.addEventListener("click", aggiungiReddito);\
btnNuovaSpesa.addEventListener("click", () => modalSpesa.style.display = "block");\
spanClose.addEventListener("click", () => modalSpesa.style.display = "none");\
formSpesa.addEventListener("submit", salvaSpesa);\
btnImpostaObiettivi.addEventListener("click", impostaObiettivi);\
window.addEventListener("beforeunload", autoSave);\
\
// Avvio\
aggiornaListaSpese();\
aggiornaListaRedditi();\
aggiornaObiettivi();\
// Elementi per filtro\
const filtroMese = document.getElementById("filtro-mese");\
const filtroAnno = document.getElementById("filtro-anno");\
const btnApplicaFiltro = document.getElementById("btn-applica-filtro");\
const btnResetFiltro = document.getElementById("btn-reset-filtro");\
const confrontoMese = document.getElementById("confronto-mese");\
const riassuntoAnnuale = document.getElementById("riassunto-annuale");\
\
// Elementi esportazione\
const btnEsportaJSON = document.getElementById("btn-esporta-json");\
const btnEsportaPDF = document.getElementById("btn-esporta-pdf");\
\
/********************************************\
 * FILTRI\
 ********************************************/\
function applicaFiltro() \{\
  const mese = filtroMese.value; // formato YYYY-MM\
  const anno = filtroAnno.value; // formato YYYY\
\
  let speseFiltrate = spese;\
  let redditiFiltrati = redditi;\
\
  if (mese) \{\
    speseFiltrate = spese.filter(s => s.data.startsWith(mese));\
    redditiFiltrati = redditi.filter(r => r.mese === mese);\
  \}\
\
  if (anno) \{\
    speseFiltrate = speseFiltrate.filter(s => s.data.startsWith(anno));\
    redditiFiltrati = redditiFiltrati.filter(r => r.mese.startsWith(anno));\
  \}\
\
  mostraConfrontoMese(speseFiltrate, redditiFiltrati);\
  mostraRiassuntoAnnuale(speseFiltrate, redditiFiltrati);\
\}\
\
function resetFiltro() \{\
  filtroMese.value = "";\
  filtroAnno.value = "";\
  mostraConfrontoMese(spese, redditi);\
  mostraRiassuntoAnnuale(spese, redditi);\
\}\
\
/********************************************\
 * CONFRONTO MESE SU MESE\
 ********************************************/\
function mostraConfrontoMese(speseFiltrate, redditiFiltrati) \{\
  // Mappa mese -> spese/redditi\
  const mesiSet = new Set([\
    ...speseFiltrate.map(s => s.data.slice(0,7)),\
    ...redditiFiltrati.map(r => r.mese)\
  ]);\
  const mesi = Array.from(mesiSet).sort();\
\
  confrontoMese.innerHTML = "<h3>Confronto Mese su Mese</h3>";\
  let html = "<table style='width:100%;border-collapse:collapse'><tr><th>Mese</th><th>Entrate</th><th>Spese</th><th>Saldo</th></tr>";\
\
  mesi.forEach(mese => \{\
    const totSpese = speseFiltrate.filter(s=>s.data.startsWith(mese))\
                     .reduce((sum,s)=>sum+s.importo,0);\
    const totRedditi = redditiFiltrati.filter(r=>r.mese===mese)\
                     .reduce((sum,r)=>sum+r.fonti.reduce((a,b)=>a+b.importo,0),0);\
    const saldo = totRedditi - totSpese;\
    html += `<tr>\
      <td>$\{mese\}</td>\
      <td>$\{totRedditi.toFixed(2)\}\'80</td>\
      <td>$\{totSpese.toFixed(2)\}\'80</td>\
      <td style="color:$\{saldo>=0?'green':'red'\}">$\{saldo.toFixed(2)\}\'80</td>\
    </tr>`;\
  \});\
  html += "</table>";\
  confrontoMese.innerHTML += html;\
\}\
\
/********************************************\
 * RIASSUNTO ANNUALE\
 ********************************************/\
function mostraRiassuntoAnnuale(speseFiltrate, redditiFiltrati) \{\
  const anniSet = new Set([\
    ...speseFiltrate.map(s=>s.data.slice(0,4)),\
    ...redditiFiltrati.map(r=>r.mese.slice(0,4))\
  ]);\
  const anni = Array.from(anniSet).sort();\
\
  riassuntoAnnuale.innerHTML = "<h3>Riassunto Annuale</h3>";\
  anni.forEach(anno => \{\
    const speseAnno = speseFiltrate.filter(s=>s.data.startsWith(anno))\
                         .reduce((sum,s)=>sum+s.importo,0);\
    const redditiAnno = redditiFiltrati.filter(r=>r.mese.startsWith(anno))\
                          .reduce((sum,r)=>sum+r.fonti.reduce((a,b)=>a+b.importo,0),0);\
    const saldo = redditiAnno - speseAnno;\
    riassuntoAnnuale.innerHTML += `<p><strong>$\{anno\}</strong>: Entrate $\{redditiAnno.toFixed(2)\}\'80, Spese $\{speseAnno.toFixed(2)\}\'80, Saldo <span style="color:$\{saldo>=0?'green':'red'\}">$\{saldo.toFixed(2)\}\'80</span></p>`;\
  \});\
\}\
\
/********************************************\
 * ESPORTAZIONE DATI\
 ********************************************/\
btnEsportaJSON.addEventListener("click", ()=>\{\
  const dati = \{ spese, redditi, obiettivi \};\
  const blob = new Blob([JSON.stringify(dati, null, 2)], \{type: "application/json"\});\
  const url = URL.createObjectURL(blob);\
  const a = document.createElement("a");\
  a.href = url;\
  a.download = `dati_casa_$\{new Date().toISOString().slice(0,10)\}.json`;\
  a.click();\
  URL.revokeObjectURL(url);\
\});\
\
btnEsportaPDF.addEventListener("click", ()=>\{\
  // generiamo PDF semplice con jsPDF\
  if (!window.jsPDF) \{\
    alert("jsPDF non caricato!");\
    return;\
  \}\
  const doc = new jsPDF();\
  doc.setFontSize(12);\
  doc.text("\uc0\u55357 \u56522  Dati Casa", 10, 10);\
\
  let y = 20;\
  spese.forEach(s=>\{\
    if(y>280)\{ doc.addPage(); y=20;\}\
    doc.text(`Spesa: $\{s.descrizione\}, $\{s.categoria\}, $\{s.importo\}\'80, $\{s.data\}`, 10, y);\
    y+=8;\
  \});\
  redditi.forEach(r=>\{\
    if(y>280)\{ doc.addPage(); y=20;\}\
    doc.text(`Reddito: $\{r.mese\}, Totale: $\{r.fonti.reduce((a,b)=>a+b.importo,0)\}\'80`, 10, y);\
    y+=8;\
  \});\
  doc.save(`dati_casa_$\{new Date().toISOString().slice(0,10)\}.pdf`);\
\});\
\
/********************************************\
 * EVENTI FILTRI\
 ********************************************/\
btnApplicaFiltro.addEventListener("click", applicaFiltro);\
btnResetFiltro.addEventListener("click", resetFiltro);\
\
// Avvio filtri\
resetFiltro();\
}