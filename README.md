# GEN ZY 2027

Site oficial da GEN ZY 2027, liga de tênis entre amigos do Clube de Campo de São Paulo.

- **Calendário:** Liga A (17 atletas, turno único, 8 rodadas) e Liga B (Marley) (6 atletas, turno e returno, 5 rodadas), de 01/12/2026 a 15/10/2027. Cada atleta tem 2 jogos por rodada.
- **Classificação:** calculada no navegador a partir dos resultados lançados (vitórias, vitórias por WO, derrotas e saldo de games).
- **Lançar resultado:** os próprios atletas enviam o placar; o site grava na planilha e confirma relendo.
- **Ficha de inscrição:** fora do menu, abre pelo botão do rodapé.

O calendário fica embutido em `index.html` (constante `TEMPORADA`). Os ids dos jogos (ex.: `A-R3-07`) saem da posição na lista: não reordenar depois que houver resultados lançados.

Inscrições e resultados são gravados na planilha "GEN ZY 2027 — Inscrições" via Google Apps Script (`apps-script/Code.gs`): abas "Inscrições", "Resultados" (um resultado por jogo) e "Resultados (histórico)" (todos os envios).

## Proteções

- **No site:** campo-isca invisível para robôs, bloqueio de envio feito em menos de 4 s, bloqueio de clique duplo e no máximo 1 envio de inscrição por minuto por navegador.
- **Na planilha:** `apps-script/Code.gs` mantém uma linha por e-mail (reenvio atualiza em vez de duplicar), ignora envios inválidos e impede que um texto vire fórmula. Resultados são validados (id do jogo, vencedor e formato do placar). Para ativar, cole o código em Extensões > Apps Script da planilha e publique uma nova versão da implantação existente.
