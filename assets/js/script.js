async function getConversor() {
  try {
    const endpoint = "https://mindicador.cl/api/";
    const res = await fetch(endpoint);
    const conversores = await res.json();
    console.log(conversores);
    return conversores;
  } catch (error) {
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Error al cargar los conversores.";
    console.log(error);
  }
}

function llenarSelect(conversores) {
  const select = document.getElementById("selectMoneda");
  select.innerHTML = `<option value="">Seleccione moneda</option>`;

  const monedasPermitidas = ["dolar", "euro", "uf"];

  monedasPermitidas.forEach((clave) => {
    const option = document.createElement("option");
    option.value = clave;
    option.textContent = conversores[clave].nombre;
    select.appendChild(option);
  });
}

async function getSerieHistorica(moneda) {
  try {
    const endpoint = `https://mindicador.cl/api/${moneda}`;
    const res = await fetch(endpoint);
    const data = await res.json();

    return data.serie.slice(0, 10);
  } catch (error) {
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Error al cargar el historial de la moneda.";
    console.log(error);
  }
}

function configuracionGrafica(serieHistorica) {
  const labels = serieHistorica.map((registro) => registro.fecha);
  const valores = serieHistorica.map((registro) => registro.valor);

  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Historial de últimos 10 días",
          data: valores,
          backgroundColor: "red",
          borderColor: "red",
          borderWidth: 2,
        },
      ],
    },
  };

  return config;
}

let grafico = null;

async function renderGrafica() {
  const select = document.getElementById("selectMoneda");
  const monedaSeleccionada = select.value;

  if (monedaSeleccionada === "") {
    return;
  }

  const serieHistorica = await getSerieHistorica(monedaSeleccionada);
  const config = configuracionGrafica(serieHistorica);
  const chartDOM = document.getElementById("graficoMoneda");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(chartDOM, config);
}

async function convertirMoneda() {
  try {
    const conversores = await getConversor();

    const select = document.getElementById("selectMoneda");
    const inputPesos = document.getElementById("inputPesos");
    const resultado = document.getElementById("resultado");

    const monedaSeleccionada = select.value;
    const montoPesos = parseFloat(inputPesos.value);

    if (monedaSeleccionada === "") {
      resultado.textContent = "Debe seleccionar una moneda.";
      return;
    }

    if (isNaN(montoPesos) || montoPesos <= 0) {
      resultado.textContent = "Debe ingresar un monto válido.";
      return;
    }

    const valorMoneda = conversores[monedaSeleccionada].valor;
    const montoConvertido = montoPesos / valorMoneda;

    resultado.textContent = `Resultado: ${montoConvertido.toFixed(2)}`;

    await renderGrafica();
  } catch (error) {
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Ocurrió un error en la conversión.";
    console.log(error);
  }
}

async function iniciarApp() {
  const conversores = await getConversor();
  llenarSelect(conversores);
}

iniciarApp();