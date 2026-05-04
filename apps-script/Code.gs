/**
 * Apps Script — captura de leads da landing "Anestesia Descomplicada Presencial".
 *
 * Como deployar (uma única vez):
 *   1. Abra a planilha "Leads Curso Presencial 27 e 28 de junho":
 *      https://docs.google.com/spreadsheets/d/1FtuaDtu0KO1JVsSQnUR2Vh_Ds3BfJoy_dSLCDlGMNH4/edit
 *   2. Menu → Extensões → Apps Script.
 *   3. Apague o código padrão e cole TODO este arquivo.
 *   4. Salve (Ctrl+S). Dê um nome qualquer ao projeto, ex: "Leads VetsPRO".
 *   5. Botão "Implantar" (Deploy) → "Nova implantação".
 *      - Tipo: "Aplicativo da Web" (Web app)
 *      - Executar como: "Eu" (você mesmo)
 *      - Quem tem acesso: "Qualquer pessoa" (anonymous)
 *      - Implantar → autorize as permissões.
 *   6. Copie a "URL do aplicativo da Web" e me envie — eu coloco em app.js.
 *
 * Pra atualizar o código depois: Implantar → Gerenciar implantações → editar (lápis) →
 * Versão "Nova versão" → Implantar. A URL não muda.
 */

// ID da planilha "Leads Curso Presencial 27 e 28 de junho"
const SHEET_ID = '1FtuaDtu0KO1JVsSQnUR2Vh_Ds3BfJoy_dSLCDlGMNH4';
// Fuso horário pra registrar a hora local
const TZ = 'America/Sao_Paulo';
// Nome da aba (criada automaticamente se não existir)
const TAB_NAME = 'Leads';

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};

    const nome = String(params.nome || '').trim();
    const ddd = String(params.ddd || '').replace(/\D/g, '').trim();
    const wpp = String(params.whatsapp || '').replace(/\D/g, '').trim();
    const source = String(params.source || '').trim();

    if (!nome || !ddd || !wpp) {
      return _json({ ok: false, error: 'Campos obrigatórios faltando.' });
    }

    const now = new Date();
    const data = Utilities.formatDate(now, TZ, 'dd/MM/yyyy');
    const hora = Utilities.formatDate(now, TZ, 'HH:mm:ss');
    const completo = '+55' + ddd + wpp;

    const sheet = _getOrCreateSheet();
    sheet.appendRow([data, hora, nome, ddd, wpp, completo, source]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  // Endpoint "ping" pra você confirmar que tá no ar.
  return ContentService
    .createTextOutput('Web App OK — use POST com nome, ddd, whatsapp.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function _getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) {
    // Renomeia a primeira aba se ainda for o padrão "Página1"/"Sheet1", senão cria nova
    const first = ss.getSheets()[0];
    if (first && /^(P[áa]gina ?1|Sheet ?1|Folha ?1|Página1)$/i.test(first.getName())) {
      first.setName(TAB_NAME);
      sheet = first;
    } else {
      sheet = ss.insertSheet(TAB_NAME);
    }
  }
  // Cabeçalho (só escreve se a 1ª linha estiver vazia)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Hora', 'Nome', 'DDD', 'WhatsApp', 'WhatsApp Completo', 'Origem']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0E2A1F').setFontColor('#F5F0E4');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 7, 140);
    sheet.setColumnWidth(3, 240); // Nome
    sheet.setColumnWidth(6, 180); // WhatsApp Completo
  }
  return sheet;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
