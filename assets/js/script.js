const cantidadInput = document.getElementById("cantidad");
const monedaSelect = document.getElementById("moneda");
const resultadoElement = document.getElementById("resultado");
const myChart = document.getElementById("myChart");

document.getElementById("buscar").addEventListener("click", convertirMoneda);
cantidadInput.addEventListener("input", validarCantidad);

function validarCantidad() {
  let cantidad = parseFloat(cantidadInput.value);
  if (isNaN(cantidad) || cantidad < 0) {
    cantidadInput.value = "";
  }
}

async function convertirMoneda() {
  const cantidad = parseFloat(cantidadInput.value);
  const moneda = monedaSelect.value;

  if (isNaN(cantidad) || cantidad <= 0 || !moneda) {
    alert("Por favor, ingresa una cantidad válida y selecciona una moneda.");
    return;
  }

  try {
    const response = await fetch("https://mindicador.cl/api");
    const data = await response.json();

    let resultado;
    if (moneda === "usd") {
      resultado = cantidad / data.dolar.valor;
    } else if (moneda === "euro") {
      resultado = cantidad / data.euro.valor;
    }

    resultadoElement.innerHTML = `Resultado: $${resultado.toFixed(
      2
    )} ${moneda.toUpperCase()}`;
    myChart.style.display = "block";

    await mostrarGrafica(moneda);
  } catch (error) {
    console.error("Error al obtener los datos de la API:", error);
    resultadoElement.innerHTML = "Error al obtener los datos de la API.";
  }
}

async function mostrarGrafica(moneda) {
  const variable = moneda === "usd" ? "dolar" : "euro";
  const res = await fetch(`https://mindicador.cl/api/${variable}`);
  const data = await res.json();

  let series = data.serie.slice(0, 9).reverse();
  let fechas = series.map((item) =>
    new Date(item.fecha).toLocaleDateString("en-GB")
  );
  let valores = series.map((item) => item.valor);

  new Chart("myChart", {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: moneda.toUpperCase(),
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0, 255, 66, 1)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          data: valores,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: true, labels: { fontColor: "white" } },
      },
      scales: {
        yAxes: [
          {
            ticks: { fontColor: "white" },
            gridLines: { color: "rgba(255, 255, 255, 0.2)" },
          },
        ],
        xAxes: [
          {
            ticks: { fontColor: "white" },
            gridLines: { color: "rgba(255, 255, 255, 0.2)" },
          },
        ],
      },
    },
  });
}
