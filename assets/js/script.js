async function getConversor() {
  try {
    const endpoint = "https://mindicador.cl/api/";
    const res = await fetch(endpoint);
    const conversores = await res.json();
    console.log(conversores);
    return conversores;
  } catch (error) {
    console.log(error);
  }
}
getConversor();

function llenarSelect(conversores) {
    const select = document.getElementById("selectMoneda");
    select.innerHTML = ` <option value = ""> Seleccione moneda </option>;`
    const monedasPermitidas = ["dolar", "euro", "uf"];
    monedasPermitidas.forEach((clave) => {
        const option = document.createElement("option");
        option.value = clave;
        option.textContent = conversores[clave].nombre;
        select.append(option);
        
    });
}

async function iniciarApp() {
    const conversores = await getConversor();
    llenarSelect(conversores)
    
}iniciarApp();

async function convertirMoneda() {
    const conversores = await getConversor();
    const select = document.getElementById("selectMoneda");
    const monedaSeleccionada = select.value;
    const valorMoneda = conversores[monedaSeleccionada].valor;
    const inputPesos = document.getElementById("inputPesos");
    const resultado = document.getElementById("resultado");
    const montoPesos = parseFloat(inputPesos.value);
    const montoConvertido = montoPesos / valorMoneda;

    resultado.textContent = montoConvertido.toFixed(2);
}
convertirMoneda();
