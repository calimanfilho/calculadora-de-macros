# Spec - Calculadora de Macros (App Estático)

## Objetivo
Implementar e evoluir uma calculadora estática que:
1. Calcula a Taxa Metabólica Basal (TMB).
2. Calcula o Gasto Energético Total (GET) com fator de atividade.
3. Define meta calórica diária conforme objetivo (perder/manter/ganhar peso).
4. Calcula macronutrientes diários em gramas e percentual.
5. Oferece recursos de uso prático: limpar, histórico de sessão e exportação.
6. Entrega insights extras: IMC, hidratação diária, gráfico e alerta de agressividade.

## O que foi implementado
### 1) Cálculos nutricionais
- TMB com duas fórmulas:
  - Harris-Benedict (padrão)
  - Mifflin-St Jeor
- GET por fator de atividade:
  - leve: `1.3`
  - moderada: `1.5`
  - alta: `1.7`
- Meta calórica por objetivo:
  - perder: `GET - ajuste`
  - manter: `GET`
  - ganhar: `GET + ajuste`
- Macros:
  - proteínas: customizável em `g/kg` (padrão `2`)
  - gorduras: `1 g/kg`
  - carboidratos: calorias restantes dividido por `4`
- Percentual de macros com base nas calorias de cada macro.
- IMC com classificação:
  - abaixo do peso
  - peso normal
  - sobrepeso
  - obesidade graus I, II e III
- Água por dia (estimativa):
  - `35 ml por kg de peso`
  - exibido em litros por dia
- Alerta para ajuste calórico agressivo quando excede 500 kcal em perder/ganhar.

### 2) Arquitetura de código
- `calc-core.js` concentra funções puras de cálculo (reuso no browser e em testes).
- `script.js` concentra integração de UI, validação e recursos de interação.
- `tests/calculadora.test.js` valida o nucleo de calculo com Node.
- Painel com abas: `Resultado` e `Sobre as formulas` para explicacao das metodologias de TMB.

### 3) Funcionalidades novas (solicitadas)
- Botão `Limpar`:
  - reseta formulário e resultado atual.
- Histórico da sessão (sem persistência):
  - lista últimos cálculos da aba atual.
  - limite de 10 entradas.
  - botão `Limpar histórico`.
- Exportação:
  - `Exportar CSV`: gera arquivo com os dados do último cálculo.
  - `Exportar PDF`: usa a impressão do navegador (`window.print`) com estilo preparado para salvar em PDF.
- Reabertura de consulta:
  - clique em item do histórico recarrega o resultado e os campos do formulário.
- Visualização de distribuição:
  - gráfico em barras com percentual calórico de proteínas, gorduras e carboidratos.

### 4) Repaginação visual moderna
- Novo layout em duas colunas (formulário + painel de resultados/histórico).
- Identidade visual com gradientes, brilho de fundo e cartões com contraste forte.
- Tipografia com `Manrope` e `Space Grotesk`.
- Botões com hierarquia visual clara (`primário`, `secundário`, `ghost`).
- Responsivo para mobile e desktop.
- Animação sutil de entrada para reduzir sensação de tela estática.

## Validações
- Campos obrigatórios: fórmula, sexo, atividade e objetivo.
- Peso, altura e idade devem ser maiores que zero.
- Ajuste calórico deve ser maior ou igual a zero.
- Se carboidrato ficar negativo, exibe erro de meta muito baixa para a regra adotada.

## Decisões e porquê
- App 100% estático (HTML/CSS/JS):
  - simples para deploy em S3 e fácil manutenção.
- Histórico em memória (sem localStorage):
  - atende seu contexto de app estático sem persistência local.
- Exportação PDF via print nativo:
  - evita biblioteca pesada e mantém compatibilidade ampla.
- Núcleo de cálculo separado:
  - facilita evolução, revisão e testes automatizados.

## Estrutura final
- `index.html`
- `styles.css`
- `calc-core.js`
- `script.js`
- `tests/calculadora.test.js`
- `spec.md`
