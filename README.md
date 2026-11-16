# GEN ZY League

Site oficial da GEN ZY League (temporada 2027), liga de tênis entre amigos do Clube de Campo de São Paulo.

- **Calendário:** Liga A (17 atletas, turno único, 8 rodadas) e Liga B (6 atletas, turno e returno, 5 rodadas), de 01/01/2027 a 15/10/2027. Cada atleta tem 2 jogos por rodada.
- **Sigilo:** só a próxima rodada aparece antes de começar; as seguintes ficam ocultas na página até a rodada anterior iniciar (os confrontos continuam no código-fonte).
- **Classificação:** calculada no navegador a partir dos resultados lançados (3 pontos por vitória, inclusive por WO; ordem: pontos, confronto direto, saldo de games; WO conta como 6-3 6-3).
- **Lançar resultado:** os próprios atletas enviam o placar; o site grava na planilha e confirma relendo.
- **Ficha de inscrição:** fora do menu, abre pelo botão do rodapé.

O calendário fica embutido em `index.html` (constante `TEMPORADA`). Os ids dos jogos (ex.: `A-R3-07`) saem da posição na lista: não reordenar depois que houver resultados lançados.

Inscrições e resultados são gravados na planilha "GEN ZY 2027 — Inscrições" via Google Apps Script (`apps-script/Code.gs`): abas "Inscrições", "Resultados" (um resultado por jogo) e "Resultados (histórico)" (todos os envios).

## Proteções

- **No site:** campo-isca invisível para robôs, bloqueio de envio feito em menos de 4 s, bloqueio de clique duplo e no máximo 1 envio de inscrição por minuto por navegador.
- **Na planilha:** `apps-script/Code.gs` mantém uma linha por e-mail (reenvio atualiza em vez de duplicar), ignora envios inválidos e impede que um texto vire fórmula. Resultados são validados (id do jogo, vencedor e formato do placar). Para ativar, cole o código em Extensões > Apps Script da planilha e publique uma nova versão da implantação existente.
