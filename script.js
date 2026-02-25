const form = document.querySelector("#calculator-form");
const resultadoEl = document.querySelector("#resultado");
const historicoEl = document.querySelector("#historico");

const sexoEl = document.querySelector("#sexo");
const formulaEl = document.querySelector("#formula");
const pesoEl = document.querySelector("#peso");
const alturaEl = document.querySelector("#altura");
const idadeEl = document.querySelector("#idade");
const atividadeEl = document.querySelector("#atividade");
const objetivoEl = document.querySelector("#objetivo");
const ajusteKcalEl = document.querySelector("#ajuste-kcal");
const ajusteLabelEl = document.querySelector("#ajuste-label");
const ajusteHintEl = document.querySelector("#ajuste-hint");

const btnLimpar = document.querySelector("#btn-limpar");
const btnExportCsv = document.querySelector("#btn-export-csv");
const btnExportPdf = document.querySelector("#btn-export-pdf");
const btnLimparHistorico = document.querySelector("#btn-limpar-historico");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

const estado = {
  historico: [],
  ultimoResultado: null,
};

function formatarNumero(valor, casas = 2) {
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

function formatarDataHora(data = new Date()) {
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function normalizarFormula(formula) {
  return formula === "mifflin-st-jeor" ? "Mifflin-St Jeor" : "Harris-Benedict";
}

function setExportButtonsState(disabled) {
  btnExportCsv.disabled = disabled;
  btnExportPdf.disabled = disabled;
}

function renderErro(mensagem) {
  resultadoEl.innerHTML = `<p class="erro">${mensagem}</p>`;
  setExportButtonsState(true);
}

function renderHistorico() {
  if (estado.historico.length === 0) {
    historicoEl.innerHTML = '<p class="historico-vazio">Sem cálculos nesta sessão.</p>';
    return;
  }

  historicoEl.innerHTML = estado.historico
    .map(
      (item, index) => `
      <li class="historico-item" data-index="${index}" role="button" tabindex="0">
        <strong>${item.objetivoLabel} · ${formatarNumero(item.metaCalorica)} kcal</strong>
        <small>${item.dataHora} · ${item.formulaLabel}</small>
      </li>
    `
    )
    .join("");
}

function renderResultado(resultado) {
  const alertaHtml = resultado.alertaAgressividade
    ? `<p class="alerta-meta">${resultado.alertaAgressividade}</p>`
    : "";

  resultadoEl.innerHTML = `
    <h2>Resultado diário</h2>
    ${alertaHtml}
    <div class="metrics">
      <div class="metric-row">
        <span class="metric-label">Fórmula de TMB</span>
        <span class="metric-value">${resultado.formulaLabel}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">TMB</span>
        <span class="metric-value">${formatarNumero(resultado.tmb)} kcal</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">GET</span>
        <span class="metric-value">${formatarNumero(resultado.get)} kcal</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Meta calórica</span>
        <span class="metric-value">${formatarNumero(resultado.metaCalorica)} kcal</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">IMC</span>
        <span class="metric-value">${formatarNumero(resultado.imc)} (${resultado.classificacaoImc})</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Água por dia</span>
        <span class="metric-value">${formatarNumero(resultado.aguaDiariaLitros)} L</span>
      </div>
    </div>

    <div class="macro-grid">
      <article class="macro-card">
        <strong>Proteínas</strong>
        <span>${formatarNumero(resultado.proteinaGramas)} g</span>
        <span>${formatarNumero(resultado.percentuais.proteina)}%</span>
      </article>
      <article class="macro-card">
        <strong>Gorduras</strong>
        <span>${formatarNumero(resultado.gorduraGramas)} g</span>
        <span>${formatarNumero(resultado.percentuais.gordura)}%</span>
      </article>
      <article class="macro-card">
        <strong>Carboidratos</strong>
        <span>${formatarNumero(resultado.carboidratoGramas)} g</span>
        <span>${formatarNumero(resultado.percentuais.carboidrato)}%</span>
      </article>
    </div>

    <h3 class="section-title">Macros em kcal (%)</h3>
    <div class="macro-bars">
      <div class="macro-bar-row">
        <span class="macro-bar-label">Proteínas</span>
        <div class="macro-bar-track"><span class="macro-bar-fill macro-proteina" style="width: ${Math.max(
          0,
          Math.min(100, resultado.percentuais.proteina)
        )}%"></span></div>
        <span class="macro-bar-value">${formatarNumero(resultado.percentuais.proteina)}%</span>
      </div>
      <div class="macro-bar-row">
        <span class="macro-bar-label">Gorduras</span>
        <div class="macro-bar-track"><span class="macro-bar-fill macro-gordura" style="width: ${Math.max(
          0,
          Math.min(100, resultado.percentuais.gordura)
        )}%"></span></div>
        <span class="macro-bar-value">${formatarNumero(resultado.percentuais.gordura)}%</span>
      </div>
      <div class="macro-bar-row">
        <span class="macro-bar-label">Carboidratos</span>
        <div class="macro-bar-track"><span class="macro-bar-fill macro-carbo" style="width: ${Math.max(
          0,
          Math.min(100, resultado.percentuais.carboidrato)
        )}%"></span></div>
        <span class="macro-bar-value">${formatarNumero(resultado.percentuais.carboidrato)}%</span>
      </div>
    </div>

    <p class="disclaimer">Uso educacional. Não substitui avaliação de nutricionista ou médico.</p>
  `;

  setExportButtonsState(false);
}

function objetivoLabel(objetivo) {
  if (objetivo === "perder") return "Perder peso";
  if (objetivo === "ganhar") return "Ganhar peso";
  return "Manter peso";
}

function registrarNoHistorico(resultado) {
  estado.historico.unshift({
    objetivoLabel: objetivoLabel(resultado.objetivo),
    metaCalorica: resultado.metaCalorica,
    formulaLabel: resultado.formulaLabel,
    dataHora: resultado.dataHora,
    snapshot: { ...resultado },
  });

  estado.historico = estado.historico.slice(0, 10);
  renderHistorico();
}

function exportarCsv(resultado) {
  const linhas = [
    ["Campo", "Valor"],
    ["Data", resultado.dataHora],
    ["Formula", resultado.formulaLabel],
    ["Objetivo", objetivoLabel(resultado.objetivo)],
    ["TMB (kcal)", resultado.tmb.toFixed(2)],
    ["GET (kcal)", resultado.get.toFixed(2)],
    ["Meta calorica (kcal)", resultado.metaCalorica.toFixed(2)],
    ["IMC", resultado.imc.toFixed(2)],
    ["Classificacao IMC", resultado.classificacaoImc],
    ["Agua por dia (L)", resultado.aguaDiariaLitros.toFixed(2)],
    ["Proteinas (g)", resultado.proteinaGramas.toFixed(2)],
    ["Gorduras (g)", resultado.gorduraGramas.toFixed(2)],
    ["Carboidratos (g)", resultado.carboidratoGramas.toFixed(2)],
    ["Proteinas (%)", resultado.percentuais.proteina.toFixed(2)],
    ["Gorduras (%)", resultado.percentuais.gordura.toFixed(2)],
    ["Carboidratos (%)", resultado.percentuais.carboidrato.toFixed(2)],
  ];

  const csv = linhas.map((linha) => linha.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `macros-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

function exportarPdf() {
  window.print();
}

function limparTelaResultado() {
  resultadoEl.innerHTML =
    '<p class="placeholder">Preencha os dados e clique em calcular.</p>';
  setExportButtonsState(true);
  estado.ultimoResultado = null;
}

function recarregarConsultaHistorico(index) {
  const item = estado.historico[index];
  if (!item || !item.snapshot) return;

  const consulta = item.snapshot;

  sexoEl.value = consulta.sexo;
  formulaEl.value = consulta.formula;
  pesoEl.value = consulta.peso;
  alturaEl.value = consulta.altura;
  idadeEl.value = consulta.idade;
  atividadeEl.value = consulta.atividade;
  objetivoEl.value = consulta.objetivo;
  ajusteKcalEl.value = consulta.ajusteKcal;

  atualizarContextoAjuste();

  estado.ultimoResultado = consulta;
  renderResultado(consulta);
  ativarAba("resultado-tab");
}

function ativarAba(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabId);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabId);
  });
}

function validarEntradas({
  sexo,
  formula,
  peso,
  altura,
  idade,
  atividade,
  objetivo,
  ajusteKcal,
}) {
  if (!sexo || !atividade || !objetivo || !formula) {
    return "Selecione sexo, fórmula de TMB, atividade e objetivo.";
  }

  if (
    Number.isNaN(peso) ||
    Number.isNaN(altura) ||
    Number.isNaN(idade) ||
    peso <= 0 ||
    altura <= 0 ||
    idade <= 0
  ) {
    return "Preencha peso, altura e idade com valores válidos.";
  }

  if (Number.isNaN(ajusteKcal) || ajusteKcal < 0) {
    return "Informe um ajuste calórico válido (0 ou maior).";
  }

  return null;
}

function atualizarContextoAjuste() {
  if (!objetivoEl.value) {
    ajusteLabelEl.textContent = "Ajuste calórico (kcal)";
    ajusteHintEl.textContent = "Escolha o objetivo.";
    ajusteKcalEl.disabled = false;
    ajusteKcalEl.value = "400";
    return;
  }

  if (objetivoEl.value === "ganhar") {
    ajusteLabelEl.textContent = "Ajuste calórico para ganhar peso (kcal)";
    ajusteHintEl.textContent = "Sugestão de superávit: 200 a 500 kcal.";
    ajusteKcalEl.disabled = false;
    if (Number(ajusteKcalEl.value) === 0) {
      ajusteKcalEl.value = "400";
    }
    return;
  }

  if (objetivoEl.value === "manter") {
    ajusteLabelEl.textContent = "Ajuste calórico para manutenção (kcal)";
    ajusteHintEl.textContent = "Manutenção usa ajuste 0 kcal.";
    ajusteKcalEl.value = "0";
    ajusteKcalEl.disabled = true;
    return;
  }

  ajusteLabelEl.textContent = "Ajuste calórico para perder peso (kcal)";
  ajusteHintEl.textContent = "Sugestão de déficit: 200 a 500 kcal.";
  ajusteKcalEl.disabled = false;
  if (Number(ajusteKcalEl.value) === 0) {
    ajusteKcalEl.value = "400";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!window.CalculadoraMacros) {
    renderErro("Erro ao carregar o motor de cálculo. Recarregue a página.");
    return;
  }

  const sexo = sexoEl.value;
  const formula = formulaEl.value;
  const peso = Number(pesoEl.value);
  const altura = Number(alturaEl.value);
  const idade = Number(idadeEl.value);
  const atividade = atividadeEl.value;
  const objetivo = objetivoEl.value;
  const ajusteKcal = Number(ajusteKcalEl.value);

  const erroValidacao = validarEntradas({
    sexo,
    formula,
    peso,
    altura,
    idade,
    atividade,
    objetivo,
    ajusteKcal,
  });

  if (erroValidacao) {
    renderErro(erroValidacao);
    return;
  }

  const tmb = window.CalculadoraMacros.calcularTmb({
    sexo,
    peso,
    altura,
    idade,
    formula,
  });

  const get = tmb * window.CalculadoraMacros.FATOR_ATIVIDADE[atividade];
  const metaCalorica = window.CalculadoraMacros.calcularMetaCalorica(
    get,
    objetivo,
    ajusteKcal
  );

  const macros = window.CalculadoraMacros.calcularMacros(metaCalorica, peso);

  if (macros.carboidratoGramas < 0) {
    renderErro(
      "A meta calórica ficou baixa demais para esta regra de macros. Aumente as calorias."
    );
    return;
  }

  const percentuais = window.CalculadoraMacros.calcularPercentuais(
    macros,
    metaCalorica
  );
  const imc = window.CalculadoraMacros.calcularImc(peso, altura);
  const classificacaoImc = window.CalculadoraMacros.classificarImc(imc);
  const aguaDiariaLitros = window.CalculadoraMacros.calcularAguaDiariaLitros(peso);
  const alertaAgressividade = window.CalculadoraMacros.avaliarAgressividade(
    objetivo,
    ajusteKcal
  );

  const resultado = {
    dataHora: formatarDataHora(),
    sexo,
    formula,
    formulaLabel: normalizarFormula(formula),
    peso,
    altura,
    idade,
    atividade,
    objetivo,
    ajusteKcal,
    faixaAjuste: window.CalculadoraMacros.calcularFaixaAjuste(objetivo),
    tmb,
    get,
    metaCalorica,
    imc,
    classificacaoImc,
    aguaDiariaLitros,
    proteinaGramas: macros.proteinaGramas,
    gorduraGramas: macros.gorduraGramas,
    carboidratoGramas: macros.carboidratoGramas,
    percentuais,
    alertaAgressividade,
  };

  estado.ultimoResultado = resultado;
  renderResultado(resultado);
  registrarNoHistorico(resultado);
  ativarAba("resultado-tab");
});

btnLimpar.addEventListener("click", () => {
  form.reset();
  formulaEl.value = "harris-benedict";
  ajusteKcalEl.value = "400";
  atualizarContextoAjuste();
  limparTelaResultado();
});

btnLimparHistorico.addEventListener("click", () => {
  estado.historico = [];
  renderHistorico();
});

btnExportCsv.addEventListener("click", () => {
  if (estado.ultimoResultado) {
    exportarCsv(estado.ultimoResultado);
  }
});

btnExportPdf.addEventListener("click", () => {
  if (estado.ultimoResultado) {
    exportarPdf();
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ativarAba(button.dataset.tab);
  });
});

historicoEl.addEventListener("click", (event) => {
  const item = event.target.closest(".historico-item");
  if (!item) return;

  recarregarConsultaHistorico(Number(item.dataset.index));
});

historicoEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const item = event.target.closest(".historico-item");
  if (!item) return;

  event.preventDefault();
  recarregarConsultaHistorico(Number(item.dataset.index));
});

objetivoEl.addEventListener("change", atualizarContextoAjuste);

limparTelaResultado();
renderHistorico();
atualizarContextoAjuste();
