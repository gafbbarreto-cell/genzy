// GEN ZY 2027 — recebe do site as inscrições e os resultados dos jogos e grava na planilha.
// Cole este código em Extensões > Apps Script da planilha "GEN ZY 2027 — Inscrições"
// e publique uma NOVA VERSÃO da implantação existente (Implantar > Gerenciar implantações > Editar > Nova versão),
// para o endereço do Web App continuar o mesmo.
//
// Inscrições: aba "Inscrições". Se o mesmo e-mail se inscrever de novo, a linha existente é atualizada.
// Resultados: aba "Resultados" guarda um resultado por jogo (o último enviado vale);
//             aba "Resultados (histórico)" guarda todos os envios, para auditoria.

const ABA = 'Inscrições';
const CAMPOS = ['nome', 'apelido', 'favorito', 'joga2027', 'liga', 'camiseta', 'voluntario', 'email', 'whatsapp'];
const CABECALHO = ['Data', 'Nome', 'Apelido', 'Atleta favorito', 'Joga em 2027', 'Liga', 'Camiseta', 'Voluntário 2027', 'E-mail', 'WhatsApp'];
const I_EMAIL = CAMPOS.indexOf('email');

const ABA_RES = 'Resultados';
const ABA_RES_LOG = 'Resultados (histórico)';
const CAMPOS_RES = ['id', 'liga', 'rodada', 'j1', 'j2', 'tipo', 'vencedor', 'placar', 'por'];
const CABECALHO_RES = ['Data', 'Jogo', 'Liga', 'Rodada', 'Atleta 1', 'Atleta 2', 'Tipo', 'Vencedor', 'Placar', 'Lançado por'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.acao === 'resultado') return gravarResultado(p);
    return gravarInscricao(p);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.acao === 'resultados') return resposta({ ok: true, resultados: lerResultados() });
  return resposta({ ok: true, servico: 'GEN ZY 2027' });
}

// ---------- Inscrições ----------
function gravarInscricao(p) {
  // Proteções: envios sem nome, e-mail válido ou WhatsApp válido são ignorados; campo-isca preenchido = robô;
  // textos cortados no tamanho máximo do formulário.
  const MAX = { nome: 80, apelido: 40, favorito: 60, email: 120, whatsapp: 16 };
  const valores = CAMPOS.map(k => String(p[k] || '').trim().slice(0, MAX[k] || 20));
  valores[I_EMAIL] = valores[I_EMAIL].toLowerCase();
  const digitos = valores[CAMPOS.indexOf('whatsapp')].replace(/\D/g, '');
  const valido = valores[0].length >= 3
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valores[I_EMAIL])
    && digitos.length >= 10 && digitos.length <= 11
    && !p.site;
  if (!valido) return resposta({ ok: false });
  const sh = aba(ABA, CABECALHO);
  const linha = [new Date()].concat(valores.map(seguro));

  const emailCol = I_EMAIL + 2; // coluna I
  const n = sh.getLastRow() - 1;
  let alvo = 0;
  if (n > 0) {
    const emails = sh.getRange(2, emailCol, n, 1).getValues();
    for (let i = 0; i < emails.length; i++) {
      if (String(emails[i][0]).toLowerCase() === valores[I_EMAIL]) { alvo = i + 2; break; }
    }
  }
  if (alvo) sh.getRange(alvo, 1, 1, linha.length).setValues([linha]);
  else sh.appendRow(linha);
  return resposta({ ok: true });
}

// ---------- Resultados ----------
function gravarResultado(p) {
  const v = {};
  CAMPOS_RES.forEach(k => { v[k] = String(p[k] || '').trim().slice(0, 60); });
  // Validações básicas: id do calendário, tipo, vencedor entre os dois atletas e placar no formato "6-4 3-6 10-8"
  if (!/^[AB]-R\d{1,2}-\d{2}$/.test(v.id)) return resposta({ ok: false, erro: 'id' });
  if (v.tipo !== 'normal' && v.tipo !== 'wo') return resposta({ ok: false, erro: 'tipo' });
  if (!v.j1 || !v.j2 || (v.vencedor !== v.j1 && v.vencedor !== v.j2)) return resposta({ ok: false, erro: 'vencedor' });
  if (v.tipo === 'wo') v.placar = '';
  else if (!/^\d{1,2}-\d{1,2}( \d{1,2}-\d{1,2}){1,2}$/.test(v.placar)) return resposta({ ok: false, erro: 'placar' });

  const linha = [new Date()].concat(CAMPOS_RES.map(k => seguro(v[k])));
  const sh = aba(ABA_RES, CABECALHO_RES);
  sh.getRange('B:J').setNumberFormat('@'); // texto puro: evita o Sheets ler "6-4" como data
  const n = sh.getLastRow() - 1;
  let alvo = 0;
  if (n > 0) {
    const ids = sh.getRange(2, 2, n, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === v.id) { alvo = i + 2; break; }
    }
  }
  if (alvo) sh.getRange(alvo, 1, 1, linha.length).setValues([linha]);
  else sh.appendRow(linha);

  const log = aba(ABA_RES_LOG, CABECALHO_RES);
  log.getRange('B:J').setNumberFormat('@');
  log.appendRow(linha);
  return resposta({ ok: true });
}

function lerResultados() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_RES);
  if (!sh || sh.getLastRow() < 2) return [];
  const linhas = sh.getRange(2, 1, sh.getLastRow() - 1, CABECALHO_RES.length).getDisplayValues();
  return linhas.filter(l => l[1]).map(l => ({
    data: l[0], id: l[1], liga: l[2], rodada: l[3], j1: l[4], j2: l[5],
    tipo: l[6], vencedor: l[7], placar: l[8], por: l[9]
  }));
}

// ---------- Utilidades ----------
function aba(nome, cabecalho) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) sh = ss.insertSheet(nome);
  if (sh.getLastRow() === 0) {
    sh.appendRow(cabecalho);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Evita que o texto vire fórmula no Sheets
function seguro(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
