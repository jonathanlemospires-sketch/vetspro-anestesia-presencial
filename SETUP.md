# Setup do form de inscrição

Fluxo: visitante preenche **Nome + DDD + WhatsApp** → JS faz POST para um Apps Script Web App que escreve na planilha **"Leads Curso Presencial 27 e 28 de junho"** → visitante é redirecionado pra `https://gruposvip.com/redirect/627/curso-presencial-vetspro-27-e-28-de-junho`.

## 1. Planilha (já criada)

- **Nome:** Leads Curso Presencial 27 e 28 de junho
- **ID:** `1FtuaDtu0KO1JVsSQnUR2Vh_Ds3BfJoy_dSLCDlGMNH4`
- **Link:** https://docs.google.com/spreadsheets/d/1FtuaDtu0KO1JVsSQnUR2Vh_Ds3BfJoy_dSLCDlGMNH4/edit

## 2. Deploy do Apps Script (1× só, ~2 min)

1. Abre a planilha no link acima.
2. Menu **Extensões → Apps Script**.
3. Apaga o código padrão e cola o conteúdo de [`apps-script/Code.gs`](apps-script/Code.gs).
4. **Ctrl+S** (salvar). Nome do projeto: "Leads VetsPRO" (ou o que preferir).
5. Botão azul **Implantar → Nova implantação**.
6. Engrenagem ⚙️ (canto superior esquerdo do diálogo) → seleciona **"Aplicativo da Web"**.
7. Configurações:
   - **Descrição:** "Captura leads landing presencial junho 2026"
   - **Executar como:** _Eu (seu e-mail)_
   - **Quem tem acesso:** **Qualquer pessoa** (precisa ser esse — anonymous)
8. **Implantar** → autorize as permissões (Google vai pedir 2 vezes; clica em "Avançado → Acessar Leads VetsPRO (não seguro)" — é normal, é o seu próprio script).
9. Copia a **"URL do aplicativo da Web"** (algo tipo `https://script.google.com/macros/s/AKfycbx.../exec`).
10. Me envia essa URL e eu coloco em [`app.js`](app.js) na constante `WEB_APP_URL`.

> Pra atualizar o código depois sem mudar a URL: **Implantar → Gerenciar implantações → editar (lápis) → Versão "Nova versão" → Implantar.**

## 3. Teste rápido

Depois que eu trocar a URL e fizer o redeploy:
1. Abre https://vetspro-anestesia-presencial.vercel.app
2. Vai até o form, preenche e envia.
3. Confere que aparece uma linha nova na planilha.
4. Confere que foi redirecionado pro link do Grupos VIP.

## Estrutura da planilha

| Data | Hora | Nome | DDD | WhatsApp | WhatsApp Completo | Origem |
|------|------|------|-----|----------|-------------------|--------|
| 04/05/2026 | 14:32:11 | Maria Silva | 11 | 999990000 | +5511999990000 | landing-vetspro-presencial |

A coluna "Origem" permite, no futuro, ter outra landing escrevendo na mesma planilha com outro identificador.
