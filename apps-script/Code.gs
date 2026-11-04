/**
 * GEN ZY 2027 — gravação das inscrições na planilha "GEN ZY 2027 — Inscrições".
 *
 * Proteções no servidor:
 *  - Um e-mail = uma linha. Se o mesmo e-mail enviar de novo, a linha é atualizada
 *    em vez de duplicada.
 *  - Envios sem nome, e-mail válido ou WhatsApp válido são ignorados.
 *  - Textos são cortados no tamanho máximo do formulário.
 *  - Começos com = + - @ são neutralizados para não virarem fórmula na planilha.
 *
 * Como usar: na planilha, abra Extensões > Apps Script, substitua o doPost atual
 * por este código, salve e faça Implantar > Gerenciar implantações > editar a
 * implantação atual > Nova versão. A URL do Web App continua a mesma.
 */
const ABA = 'Inscrições';
const COL_EMAIL = 9; // coluna I
const CAMPOS = ['nome', 'apelido', 'favorito', 'joga2027', 'liga', 'camiseta', 'voluntario', 'email', 'whatsapp'];
const MAX = { nome: 80, apelido: 40, favorito: 60, email: 120, whatsapp: 16 };

function limpar_(v, k) {
  let s = String(v || '').trim().slice(0, MAX[k] || 20);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const v = {};
  CAMPOS.forEach(k => { v[k] = limpar_(p[k], k); });
  v.email = v.email.toLowerCase();

  const digitos = v.whatsapp.replace(/\D/g, '');
  const valido = v.nome.length >= 3
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)
    && digitos.length >= 10 && digitos.length <= 11
    && !p.site; // campo-isca preenchido = robô
  if (!valido) return ContentService.createTextOutput('ignorado');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(ABA);
    const linha = [new Date(), v.nome, v.apelido, v.favorito, v.joga2027, v.liga,
      v.camiseta, v.voluntario, v.email, v.whatsapp];
    const ultima = sh.getLastRow();
    let alvo = 0;
    if (ultima > 1) {
      const emails = sh.getRange(2, COL_EMAIL, ultima - 1, 1).getValues();
      const i = emails.findIndex(r => String(r[0]).trim().toLowerCase() === v.email);
      if (i >= 0) alvo = i + 2;
    }
    if (alvo) sh.getRange(alvo, 1, 1, linha.length).setValues([linha]);
    else sh.appendRow(linha);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
