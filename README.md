# GEN ZY 2027

Site de inscrição da GEN ZY 2027, liga de tênis entre amigos do Clube de Campo.

As inscrições são gravadas na planilha "GEN ZY 2027 — Inscrições" via Google Apps Script.

## Proteções

- **No site:** campo-isca invisível para robôs, bloqueio de envio feito em menos de 4 s, bloqueio de clique duplo e no máximo 1 envio por minuto por navegador.
- **Na planilha:** `apps-script/Code.gs` mantém uma linha por e-mail (reenvio atualiza em vez de duplicar), ignora envios inválidos e impede que um texto vire fórmula. Para ativar, cole o código em Extensões > Apps Script da planilha e publique uma nova versão da implantação existente.
