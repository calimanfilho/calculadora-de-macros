const test = require("node:test");
const assert = require("node:assert/strict");

const {
  FATOR_ATIVIDADE,
  calcularTmb,
  calcularMetaCalorica,
  calcularMacros,
  calcularPercentuais,
  calcularFaixaAjuste,
  calcularImc,
  classificarImc,
  calcularAguaDiariaLitros,
  avaliarAgressividade,
} = require("../calc-core");

test("fatores de atividade mapeados corretamente", () => {
  assert.equal(FATOR_ATIVIDADE.leve, 1.3);
  assert.equal(FATOR_ATIVIDADE.moderada, 1.5);
  assert.equal(FATOR_ATIVIDADE.alta, 1.7);
});

test("calcula TMB com Harris-Benedict para homem", () => {
  const valor = calcularTmb({
    sexo: "homem",
    peso: 70,
    altura: 175,
    idade: 30,
    formula: "harris-benedict",
  });

  assert.equal(Number(valor.toFixed(2)), 1701.5);
});

test("calcula TMB com Mifflin-St Jeor para mulher", () => {
  const valor = calcularTmb({
    sexo: "mulher",
    peso: 60,
    altura: 165,
    idade: 28,
    formula: "mifflin-st-jeor",
  });

  assert.equal(Number(valor.toFixed(2)), 1330.25);
});

test("calcula meta calorica para perder, manter e ganhar", () => {
  assert.equal(calcularMetaCalorica(2200, "perder", 400), 1800);
  assert.equal(calcularMetaCalorica(2200, "manter", 400), 2200);
  assert.equal(calcularMetaCalorica(2200, "ganhar", 400), 2600);
});

test("calcula macros em gramas e kcal", () => {
  const macros = calcularMacros(2000, 70);

  assert.equal(macros.proteinaGramas, 140);
  assert.equal(macros.gorduraGramas, 70);
  assert.equal(macros.proteinaKcal, 560);
  assert.equal(macros.gorduraKcal, 630);
  assert.equal(macros.carboidratoKcal, 810);
  assert.equal(macros.carboidratoGramas, 202.5);
});

test("calcula percentual de macros", () => {
  const macros = {
    proteinaKcal: 560,
    gorduraKcal: 630,
    carboidratoKcal: 810,
  };

  const percentuais = calcularPercentuais(macros, 2000);

  assert.equal(Number(percentuais.proteina.toFixed(2)), 28);
  assert.equal(Number(percentuais.gordura.toFixed(2)), 31.5);
  assert.equal(Number(percentuais.carboidrato.toFixed(2)), 40.5);
});

test("retorna faixa de ajuste por objetivo", () => {
  assert.match(calcularFaixaAjuste("perder"), /deficit/i);
  assert.match(calcularFaixaAjuste("ganhar"), /superavit/i);
  assert.match(calcularFaixaAjuste("manter"), /0 kcal/i);
});

test("calcula IMC e classificacao", () => {
  const imc = calcularImc(80, 180);
  assert.equal(Number(imc.toFixed(2)), 24.69);
  assert.equal(classificarImc(imc), "Peso normal");
});

test("calcula agua diaria em litros", () => {
  const agua = calcularAguaDiariaLitros(80);
  assert.equal(Number(agua.toFixed(2)), 2.8);
});

test("avalia agressividade da meta", () => {
  assert.equal(avaliarAgressividade("perder", 400), null);
  assert.match(avaliarAgressividade("perder", 700), /Ajuste alto/);
  assert.match(avaliarAgressividade("ganhar", 700), /Ajuste alto/);
  assert.equal(avaliarAgressividade("manter", 0), null);
});
