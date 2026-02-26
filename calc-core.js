(function (globalScope) {
  const FATOR_ATIVIDADE = {
    leve: 1.3,
    moderada: 1.5,
    alta: 1.7,
  };

  function calcularTmbHarrisBenedict({ sexo, peso, altura, idade }) {
    if (sexo === "homem") {
      return 13.75 * peso + 5 * altura - 6.75 * idade + 66.5;
    }

    return 9.56 * peso + 1.85 * altura - 4.68 * idade + 65.71;
  }

  function calcularTmbMifflinStJeor({ sexo, peso, altura, idade }) {
    if (sexo === "homem") {
      return 10 * peso + 6.25 * altura - 5 * idade + 5;
    }

    return 10 * peso + 6.25 * altura - 5 * idade - 161;
  }

  function calcularTmb({ sexo, peso, altura, idade, formula }) {
    if (formula === "mifflin-st-jeor") {
      return calcularTmbMifflinStJeor({ sexo, peso, altura, idade });
    }

    return calcularTmbHarrisBenedict({ sexo, peso, altura, idade });
  }

  function calcularMetaCalorica(get, objetivo, ajusteKcal) {
    if (objetivo === "perder") return get - ajusteKcal;
    if (objetivo === "ganhar") return get + ajusteKcal;
    return get;
  }

  function calcularMacros(metaCalorica, peso, proteinaPorKg = 2) {
    const proteinaGramas = peso * proteinaPorKg;
    const gorduraGramas = peso * 1;

    const proteinaKcal = proteinaGramas * 4;
    const gorduraKcal = gorduraGramas * 9;
    const carboidratoKcal = metaCalorica - (proteinaKcal + gorduraKcal);
    const carboidratoGramas = carboidratoKcal / 4;

    return {
      proteinaGramas,
      gorduraGramas,
      carboidratoGramas,
      proteinaKcal,
      gorduraKcal,
      carboidratoKcal,
    };
  }

  function calcularPercentuais(kcalMacros, metaCalorica) {
    if (metaCalorica <= 0) {
      return {
        proteina: 0,
        gordura: 0,
        carboidrato: 0,
      };
    }

    return {
      proteina: (kcalMacros.proteinaKcal / metaCalorica) * 100,
      gordura: (kcalMacros.gorduraKcal / metaCalorica) * 100,
      carboidrato: (kcalMacros.carboidratoKcal / metaCalorica) * 100,
    };
  }

  function calcularFaixaAjuste(objetivo) {
    if (objetivo === "perder") {
      return "Sugestao de deficit: 200 a 500 kcal por dia.";
    }

    if (objetivo === "ganhar") {
      return "Sugestao de superavit: 200 a 500 kcal por dia.";
    }

    return "Para manutencao, ajuste calorico recomendado: 0 kcal.";
  }

  function calcularImc(peso, alturaCm) {
    const alturaMetro = alturaCm / 100;
    return peso / (alturaMetro * alturaMetro);
  }

  function classificarImc(imc) {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade grau I";
    if (imc < 40) return "Obesidade grau II";
    return "Obesidade grau III";
  }

  function calcularAguaDiariaLitros(peso) {
    return (peso * 35) / 1000;
  }

  function avaliarAgressividade(objetivo, ajusteKcal) {
    if (objetivo === "manter" || ajusteKcal <= 500) return null;

    if (objetivo === "perder") {
      return "Ajuste alto para perda de peso. Considere reduzir para 200-500 kcal/dia.";
    }

    if (objetivo === "ganhar") {
      return "Ajuste alto para ganho de peso. Considere reduzir para 200-500 kcal/dia.";
    }

    return null;
  }

  const api = {
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
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.CalculadoraMacros = api;
})(typeof window !== "undefined" ? window : globalThis);
