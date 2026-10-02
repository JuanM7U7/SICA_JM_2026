var arrayGeneral = [];
var arraySeries = [];
var arrayExps = [];
var arrayDoc = [];
var idDocumento = ""; 
var arreglosEliminados = []; 
var anio_busqueda = "";
var fechaexpglobal = "";
var codigo_documento_Global = "";
var estatuscheckinsti = 0;
var soporteDocumental = [
    { id_Status: 1, idDesc: "Físico(Papel)" },
    { id_Status: 2, idDesc: "CD(Medio)" },
    { id_Status: 3, idDesc: "USB" }
]

var modal = document.getElementById("ModalPrueba");
var modalD = document.getElementById("ModalDocumento");
var modalEditarAgregar = document.getElementById("ModalEditarAgregar");
//var modal = document.getElementById("ModalPrueba");
var span = document.getElementsByClassName("cerrar")[0];
var spanD = document.getElementsByClassName("cerrarDocumento")[0];
var spanEditarAgregar = document.getElementsByClassName("cerrarModalEdi")[0];

$(document).ready(function () {
    /*Mostrar documentos*/
    VistaDocumentos();
    altaDocumentoChris();

    /*Mostrar Documentos*/
    contenedorBuscadorGeneral();
    contenedorpapa();
    regresaSeriesDocumentales();

    /*DocEliminar();*/
    buscador();
    desactivarBuscadorGlobal(arraySeries);

    // Eventos para cerrar modales al hacer clic en el botón de cerrar (span)
    span.addEventListener("click", function () {
        $('#ModalPrueba').modal('hide');
    });

    spanD.addEventListener("click", function () {
        $('#ModalDocumento').modal('hide');
    });

    spanEditarAgregar.addEventListener("click", function () {
        $('#ModalEditarAgregar').modal('hide');
    });

    // Eliminar cierre del modal al hacer clic fuera de la ventana
    // Si prefieres deshabilitarlo completamente, elimina estos eventos
    /* 
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
    window.addEventListener("click", function (event) {
        if (event.target == modalD) {
            modalD.style.display = "none";
        }
    });
    */

    // Alternativamente, puedes ajustar el comportamiento para que haga algo diferente:
    window.addEventListener("click", function (event) {
        if (event.target == modal || event.target == modalD) {
            console.log("Clic fuera del modal detectado, pero no cerramos automáticamente.");
            // Puedes mostrar un mensaje o realizar otra acción aquí si es necesario.
        }
    });
});


function contenedorBuscadorGeneral() {
    var contenedor = $('#c-buscador-g');
    contenedor.html(pintarBuscadorGeneral(pintarRbtns(crearArregloRadioButtons())));
}

function crearArregloRadioButtons() {

    var arregloRbtns = [
        { idRbtn: "rbtn", value: "num_Exp", text: "Por Expediente" },
        { idRbtn: "rbtn", value: "asunto", text: "Por Título" },
        { idRbtn: "rbtn", value: "fecha_Inicio", text: "Por Fecha Inicio" },
        { idRbtn: "rbtn", value: "fecha_Cierre", text: "Por Fecha Cierre" },
        { idRbtn: "rbtn", value: "ubicacion", text: "Por Ubicación" },
        { idRbtn: "rbtn", value: "idExp", text: "Por Docs" },
        { idRbtn: "rbtn", value: "fojas", text: "Por Fojas" },
        { idRbtn: "rbtn", value: "id_Estatus_Expediente_des", text: "Por Tipo de Archivo" },
        //{ idRbtn: "rbtn", value: "cod_Serie", text: "Por Codigo Serie" },
        //{ idRbtn: "rbtn", value: "desc_Serie", text: "Por Descripción Serie" },
    ];

    return arregloRbtns;  
}

function pintarRbtns(arregloRbtns) {
    var htmld = '<fieldset>';

    for (var i = 0; i < arregloRbtns.length; i++) {
        if (i == 0) {
            htmld += `
                <label>
                    <input id="${arregloRbtns[i].idRbtn}" type="radio" name="nameColumn" value="${arregloRbtns[i].value}"> ${arregloRbtns[i].text}                </label>
            `;
        } else {
            htmld += `
            <label>
                <input id="${arregloRbtns[i].idRbtn}" type="radio" name="nameColumn" value="${arregloRbtns[i].value}"> ${arregloRbtns[i].text}
            </label>
        `;
        }
    }

    htmld += `</fieldset>`;

    return htmld;
}

function pintarBuscadorGeneral(contenido) {
    var elementos = `
        <input id="txtBuscadorG" class="txtBuscadorG" type="text" placeholder="Buscador Global" />
        ${contenido}
    `;
    
    return elementos;
}

function desactivarBuscadorGlobal(array) {

    var txtBG = document.querySelector("#txtBuscadorG");

    // 🔥 SI NO EXISTE, NO HAGAS NADA
    if (!txtBG) {
        return;
    }

    if (!array || array.length === 0) {
        txtBG.setAttribute('disabled', 'disabled');
    } else {
        txtBG.removeAttribute('disabled');
    }
}



function contenedorpapa() {
    //var arregloBlanco = [];
    var arreglo_vacio= ["1"]
    var rolu = $('#rolu').text();
    console.log("rol del usuario: "+rolu);
    var contenedor = $("#C-DropDown");
    var contenedor1 = $("#C-DropDownArea"); 
    if (rolu == "Administrador") { 
        contenedor1.html(CreaSelectLabelgenerico("cmbArea", arreglo_vacio));
    }

    contenedor.html(crearDesgloce(CreaSelectLabel("cmbAnio", arregloanios())));
}

function crearDesgloce(contenido) {
    var contenedor = `
    <div class="dropdown" style="position:relative;">

        <!-- LOADER SOLO PARA ESTA ÁREA -->
        <div id="loaderSeries" class="loader-series" style="display:none;">
            <div class="spinner"></div>
            <span>Cargando expedientes...</span>
        </div>

        <div class="c-header-select">
            ${contenido}
        </div>

        <input type="text" id="txtBuscador" placeholder="Buscar Serie...">

        <div class="dropdown-list" id="dropdown-list">
            <!-- Aquí se agregarán los elementos de la lista -->
        </div>

    </div>
    `;

    return contenedor;
}


function CreaSelectLabel(id, arreglo) {
    let htmld = '<select class="' + id + '" id="' + id + '" name="' + id + '" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#flush-collapseOne" aria-controls="flush-collapseOne"> <option value="" selected hidden>--Selecciona un año--</option> ';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option id="item-Anio" value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
        `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}

function CreaSelectLabelgenerico(id, arreglo) {

    let htmld = '<select style="width:100%;font-size:18px; " class="' + id + '" id="' + id + '" name="' + id + '" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#flush-collapseOne" aria-controls="flush-collapseOne"> <option value="" selected hidden>--Selecciona el Área--</option> ';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option Value="PRES">Presidencia</option>
                <option Value="DARP">Dirección de Agenda y Relaciones Públicas</option>
                <option Value="OIC">Órgano Interno de Control</option>
                <option Value="UT">Unidad de Transparencia</option>
                <option Value="STE">Secretaría Técnica Ejecutiva</option>
                <option Value="IIEDH">Instituto de Investigaciones y Estudios en Materia de Derechos Humanos</option>
                <option Value="PVG">Primera Visitaduría General</option>
                <option Value="SVG">Segunda Visitaduría General</option>
                <option Value="TVG">Tercera Visitaduría General</option>
                <option Value="CVG">Cuarta Visitaduría General</option>
                <option Value="DAR">Dirección de Archivo</option>
                <option Value="DSRCAJ">Dirección de Seguimiento de Recomendaciones, Conciliaciones y Asuntos Jurídicos</option>
                <option Value="DA">Dirección Administrativa</option>
                <option Value="DQO">Dirección de Quejas y Orientación</option>
                <option Value="DPIT">Dirección de Planeación e Innovación Tecnológica</option>
        `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}

//function arregloanios() {
//    var obj14 = new Object(); obj14.idSelect = "2026", obj14.descripcion = "2026";
//    var obj7 = new Object(); obj7.idSelect = "2025", obj7.descripcion = "2025";
//    var obj0 = new Object(); obj0.idSelect = "2024"; obj0.descripcion = "2024";
//    var obj = new Object(); obj.idSelect = "2023"; obj.descripcion = "2023";
//    var obj1 = new Object(); obj1.idSelect = "2022"; obj1.descripcion = "2022";
//    var obj2 = new Object(); obj2.idSelect = "2021"; obj2.descripcion = "2021";
//    var obj3 = new Object(); obj3.idSelect = "2020"; obj3.descripcion = "2020";
//    var obj4 = new Object(); obj4.idSelect = "2019"; obj4.descripcion = "2019";
//    var obj5 = new Object(); obj5.idSelect = "2018", obj5.descripcion = "2018";
//    var obj6 = new Object(); obj6.idSelect = "2017", obj6.descripcion = "2017";
//    var obj8 = new Object(); obj8.idSelect = "2016"; obj8.descripcion = "2016";
//    var obj9 = new Object(); obj9.idSelect = "2015"; obj9.descripcion = "2015";
//    var obj10 = new Object(); obj10.idSelect = "2014"; obj10.descripcion = "2014";
//    var obj11 = new Object(); obj11.idSelect = "2013"; obj11.descripcion = "2013";
//    var obj12 = new Object(); obj12.idSelect = "2012", obj12.descripcion = "2012";
//    var obj13 = new Object(); obj13.idSelect = "2011", obj13.descripcion = "2011";

//    var arreglo = [];

//    arreglo.push(obj14, obj7, obj0, obj, obj1, obj2, obj3, obj4, obj5, obj6, obj8, obj9, obj10, obj11, obj12, obj13);
//    return arreglo;
//}
function actualizarAnios(segunArea) {

    let anios;

    if (segunArea === "DA") {
        anios = arregloanios(1997);
    } else {
        anios = arregloanios(2011);
    }

    cargarSelectAnios(anios);
}
function arregloanios(anioInicio) {

    let anioActual = new Date().getFullYear();
    let arreglo = [];

    for (let i = anioActual; i >= anioInicio; i--) {
        arreglo.push({
            idSelect: i.toString(),
            descripcion: i.toString()
        });
    }

    return arreglo;
}
function cargarSelectAnios(arreglo) {
    // 1. Limpiamos los atributos de Bootstrap que provocan el despliegue del panel
    $("#cmbAnio")
        .removeAttr("data-bs-toggle")
        .removeAttr("data-bs-target")
        .removeAttr("aria-expanded")
        .removeAttr("aria-controls");

    // 2. Llenamos las opciones normalmente
    let html = '<option value="" selected hidden>--Selecciona el Año--</option>';

    arreglo.forEach(function (item) {
        html += `<option value="${item.idSelect}">${item.descripcion}</option>`;
    });

    $("#cmbAnio").html(html);
}

$(document).ready(function () {

    var rolu = $('#rolu').text();
    var area;

    if (rolu == "Administrador") {
        area = $('#cmbArea').val();
    } else {
        area = $('#SiglasUA').text();
    }

    actualizarAnios(area);
});
function regresaSeriesDocumentales() {
    txtBuscador.classList.add('hiddenBuscador');

    $('#cmbArea').on('change', function () {

        // 🔥 APAGAR LOADER SI EXISTÍA
        $('#loadingOverlay').hide();

        /* =========================
              🔵 NUEVA LÓGICA DE AÑOS jm
           ========================== */

        let areaSeleccionada = $(this).val();
        actualizarAnios(areaSeleccionada);

        /* =========================
           🔵fin new Lógica DE AÑOS jm
        ========================== */

            // ❌ NO PRENDER LOADER AQUÍ
            // $('#loadingOverlay').show();

            // 🧹 LIMPIAR TODO
            $('#cmbAnio').val('');
            $('#dropdown-list').html('');
            $('#c-buscador-g').html('');
            arrayGeneral.length = 0;
            arrayExps.length = 0;
            arraySeries.length = 0;

            // 🔒 OCULTAR BUSCADOR
            $('#txtBuscador').addClass('hiddenBuscador');

            // 🟡 MENSAJE
            Swal.fire({
                icon: 'info',
                title: 'Selecciona el año',
                text: 'Debes elegir nuevamente el año para continuar',
                timer: 2000,
                showConfirmButton: false
            });

            return; // 🔥 CLAVE: EVITA AJAX CON AÑO VACÍO
        
    });

    $('#cmbAnio').on('change', function () {

        // 🛑 SI NO HAY AÑO → NO AJAX → NO LOADER
        if ($(this).val() === "" || $(this).val() === null) {
            $('#loadingOverlay').hide();
            return;
        }

        $('#loadingOverlay').show(); // 🔥 AQUÍ SÍ

        arrayGeneral.length = 0;
        arrayExps.length = 0;
        arraySeries.length = 0;

        var rolu = $('#rolu').text();
        var siglasUA = "";
        if (rolu == "Administrador") {
            siglasUA = $('#cmbArea').val();
        } else {
            siglasUA = $('#SiglasUA').text();
        }

        anio_busqueda = $('#cmbAnio').val();

        $.ajax({
            type: "POST",
            url: "/Home/ObtenerSeries",
            data: { anio: anio_busqueda, siglas: siglasUA, rol: rolu },
            dataType: "JSON",

            success: function (response) {
                desactivarBuscadorGlobal(response);
                var dropdownList = document.querySelector("#dropdown-list");
                var txtBuscador = document.querySelector("#txtBuscador");
                var htmld = '';

                if (response.length == 0) {
                    Swal.fire({
                        title: 'Advertencia',
                        text: 'No existen Series en este año',
                        icon: 'warning',
                        confirmButtonText: 'ok'
                    });
                    txtBuscador.classList.add('hiddenBuscador');
                } else {
                    $(response).each(function (index) {
                        arraySeries.push(response[index]);

                        htmld += `
                        <div class="C-SerieExp accordion">
                             <div class="Opt heading" id="heading-${response[index].id_Serie}" style="background-color:${response[index].color}; color:${response[index].colorl}; ">
                                <div class="Opt-titulo">${response[index].cod_Serie} ${response[index].desc_Serie}</div>
                                <div class="lblContador">${response[index].cantExp}</div>
                            </div>
                            <div class="div-tbl-${response[index].id_Serie} C-Table contents" id="div-tbl-${response[index].id_Serie}">

                            <!-- 🔥 LOADER EXACTO EN EL ÁREA BLANCA -->
                        <div class="loader-serie-local">
                            <div class="spinner"></div>
                            <span>Cargando expedientes…</span>
                        </div>

                                <table id="tbl-${response[index].id_Serie}" class="display responsive" style="width:100%">
                                <img class="button_alta" id="button_alta-${response[index].id_Serie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>`;

                        var serie = response[index].cod_Serie + " " + response[index].desc_Serie;
                        AggTablaExpedientes(anio_busqueda, siglasUA, response[index].id_Serie, 1, serie);
                        AltaExpediente(response[index].id_Serie, response[index].cod_Serie, siglasUA, anio_busqueda);
                    });

                    txtBuscador.classList.remove('hiddenBuscador');
                }

                dropdownList.innerHTML = htmld;
                AggFunVerTabla();
            },

            error: function () {
                Swal.fire('Error', 'Ocurrió un error al cargar la información', 'error');
            },

            complete: function () {
                $('#loadingOverlay').hide(); // ✅ SIEMPRE SE APAGA
               
            }
        });
    });
}

function selectEstatus(){
    $(document).ready(function () {

        $.ajax({
            type: "POST",
            url: "/Home/SelectEstatus",

            dataType: "JSON",

            success: function (resp) {
                if (resp) {
                    
                }
                else {

                }
            }
        });
    });
}
function altaexpedientedirecto(id_serie, serie, siglas, anio) {
    $('#ModalPrueba').modal('show');
    var Inputs = [
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "serie_documental", labelText: "Serie documental", value: serie, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "asunto", labelText: "Asunto", value: "", Bloqueo: false, required: "required" },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "", id: "checkMultianual", labelText: "Multianual", Bloqueo: false, type: "checkbox" },
        { divClass: "col-6", divClass2: "col-6", ClassLabel: "mt-2", classInput: "form-control", id: "fecha_inicio", labelText: "Fecha de apertura", id: "fecha_cierre", labelText2: "Fecha de cierre", value: "", Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "estatus_expedientes", labelText: "Estatus de expedientes", value: "En trámite", Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "ubicacion_expediente", labelText: "Ubicación del expediente", value: "", Bloqueo: false, required: "required" },
    ];
    var Status = [
        { id_Status: 1, idDesc: "En trámite" },
        { id_Status: 2, idDesc: "En concentración(Sin transferencia)" },
        { id_Status: 3, idDesc: "Histórico(Sin transferencia)" },
        { id_Status: 4, idDesc: "Baja(Sin transferencia)" },
        { id_Status: 5, idDesc: "Otro(Sin transferencia)" }
    ];

    const Contenedor = document.getElementById('AltaExpediente');
    const BodyContainer = document.getElementById('contenidoModal');

    var contenidoNuevo = '';
    for (var i = 0; i < Inputs.length; i++) {
        if (Inputs[i].Bloqueo == true && Inputs[i].divClass == "col-3") {
            if (Inputs[i].labelText == "Estatus de expedientes") {
                contenidoNuevo += `
                <div class="row mt-3">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}">
                    <select id="${Inputs[i].id}" class="form-select" disabled>`;
                for (var e = 0; e < Status.length; e++) {
                    if (e == 0) {
                        contenidoNuevo += `<option value=${Status[e].id_Status} selected>${Status[e].idDesc}</option>`;
                    } else {
                        contenidoNuevo += `<option value=${Status[e].id_Status}>${Status[e].idDesc}</option>`;
                    }
                }
                contenidoNuevo += `</select></div>
                </div>
                `;
            } else {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" type="${Inputs[i].type}" value="${Inputs[i].value}" disabled/></div>
                </div>
                `;
            }
        } else {
            if (Inputs[i].divClass == "col-6") {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" max="hoy" class="${Inputs[i].classInput}" /></div>
                    <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="date" max="hoy" class="${Inputs[i].classInput}" disabled /></div>
                </div>
                `;
            } else if (Inputs[i].value != "") {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" type="${Inputs[i].type}" value="${Inputs[i].value}" ${Inputs[i].required}/></div>
                </div>
                `;
            } else {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" type="${Inputs[i].type}" class="${Inputs[i].classInput}" ${Inputs[i].required}/></div>
                </div>
                `;
            }
        }
    }

    var ElementosHtml = '';
    ElementosHtml += `
    <h5 class="modal-title">Alta de expedientes del año ${anio}</h5>
    ${tituloRequeridos()}`;

    contenidoNuevo += `
    <div class="row">
        <p>Observaciones del usuario</p>
        <div class="form-group">
            <textarea class="form-control" id="observaciones" rows="3"></textarea>
        </div>
    </div>
    <div class="row mx-auto">
        <div class="form-group mt-3">
            <button class="form-control button_registrar" id="Registrar" rows="3">Registrar</button>
        </div>
    </div>`;

    BodyContainer.innerHTML = contenidoNuevo;
    Contenedor.innerHTML = ElementosHtml;

    datosExpediente(id_serie, siglas);
    //multianaludad , adair, martin 06/03/2025
    document.querySelectorAll("input[type='date']")
        .forEach(elemento => {
            /* A cada elemento encontrado le asignamos el atributo "max" */
            elemento.min = anio + "-01-01";
            elemento.max = anio + "-12-31";
            elemento.value = anio + "-01-01";
        });

    $('#checkMultianual').on('change', function () {
        if ($(this).prop('checked') == true) {
            document.querySelectorAll("input[type='date']")
                .forEach(elemento => {
                    /* Eliminar restricciones de fecha */
                    elemento.removeAttribute("min");
                    elemento.removeAttribute("max");
                });
        } else {
            document.querySelectorAll("input[type='date']")
                .forEach(elemento => {
                    /* Reaplicar restricciones de fecha */
                    elemento.min = anio + "-01-01";
                    elemento.max = anio + "-12-31";
                });
        }
    });
}

function AltaExpediente(id_serie, serie, siglas,anio) {
    var Inputs = [
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "serie_documental", labelText: "Serie documental", value: serie, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "asunto", labelText: Requeridos() + "Asunto", value: "", Bloqueo: false },
        //{ divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "", id: "checkMultianual", labelText: "Multianual", Bloqueo: false, type:"checkbox" },
        { divClass: "col-6", divClass2: "col-6", ClassLabel: "mt-2", classInput: "form-control", id: "fecha_inicio", labelText: Requeridos() + "Fecha de apertura", id: "fecha_cierre", labelText2: "", value: "", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "estatus_expedientes", labelText:"Estatus de expedientes", value: "En trámite", Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "ubicacion_expediente", labelText: Requeridos() + "Ubicación del expediente", value: "", Bloqueo: false },
    ];
    var Status = [
        { id_Status: 1, idDesc: "En trámite" },
        { id_Status: 2, idDesc: "En concentración(Sin transferencia)" },
        { id_Status: 3, idDesc: "Histórico(Sin transferencia)" },
        { id_Status: 4, idDesc: "Baja(Sin transferencia)" },
        { id_Status: 5, idDesc: "Otro(Sin transferencia)" }
    ]
    $("#button_alta-" + id_serie).off("click").on("click", function () {
        $('#ModalPrueba').modal('show');

        const Contenedor = document.getElementById('AltaExpediente');
        const BodyContainer = document.getElementById('contenidoModal');

        var contenidoNuevo=`${tituloRequeridos()}`;
        for (var i = 0; i < Inputs.length; i++) {
            if (Inputs[i].Bloqueo == true && Inputs[i].divClass == "col-3") {
                if (Inputs[i].labelText == "Estatus de expedientes") {
                    contenidoNuevo += `
                    <div class="row mt-3">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p>
                        </div>
                        <div class="${Inputs[i].divClass2}">
                        <select id="${Inputs[i].id}" class="form-select" disabled>`;
                    //selectEstatus();
                    for (var e = 0; e < Status.length; e++) {
                        if (e == 0) {
                            contenidoNuevo += `<option value=${Status[e].id_Status} selected>${Status[e].idDesc}</option>`;
                        } else {
                            contenidoNuevo += `<option value=${Status[e].id_Status}>${Status[e].idDesc}</option>`;
                        }
                    }
                    contenidoNuevo += `</select></div>
                    </div>
                    `;
                } else {
                    contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" type="${Inputs[i].type}" value="${Inputs[i].value}" disabled/></div>
                </div>
                `;
                }

            } else {
                if (Inputs[i].divClass == "col-6") {

                    contenidoNuevo += `
                <div class="row">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" max="hoy" class="${Inputs[i].classInput}" /></div>
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="hidden" max="hoy" class="${Inputs[i].classInput}" /></div>
                    </div>
                `;
                }

                else if (Inputs[i].value != "") {
                    contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" type="${Inputs[i].type}" value="${Inputs[i].value}"/></div>
                </div>
                `;
                } else {
                    contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" type="${Inputs[i].type}" class="${Inputs[i].classInput}"/></div>
                </div>
                `;
                }
            }
        }

        var ElementosHtml = '';
        ElementosHtml += ` 
        <h5 class="modal-title">Alta de expedientes del año ${anio}</h5>`;

        contenidoNuevo += `
    <div class="row">
        <p>Observaciones del usuario</>
         <div class="form-group">
            <textarea class="form-control" id="observaciones" rows="3"></textarea>
        </div>
    </div>
    <div class="row mx-auto">
         <div class="form-group mt-3">
            <button class="form-control button_registrar" id="Registrar" rows="3">Registrar</button>
        </div>
    </div>`
        BodyContainer.innerHTML = contenidoNuevo;
        // limpiar y volver a asignar el click de Registrar
        $("#Registrar").off("click").on("click", function () {
            // Aquí va la lógica de guardar el expediente
            console.log("Expediente registrado");
            // --- ACTUALIZACIÓN DEL COLOR ---       
        });
        Contenedor.innerHTML = ElementosHtml;

        datosExpediente(id_serie, siglas);
       // AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie)
        //BodyContainer.innerHTML = BodyHtml;
        document.querySelectorAll("input[type='date']")
            .forEach(elemento => {
                /* A cada elemento encontrado le asignamos el atributo "max" */
                elemento.min = anio+"-01-01";
                elemento.max = "2025-12-31";
                elemento.value = anio + "-01-01";
            });

       /* $('#checkMultianual').on('change', function () {

            if ($(this).prop('checked') == true) {

                document.querySelectorAll("input[type='date']")
                    .forEach(elemento => {
                        /* A cada elemento encontrado le asignamos el atributo "max" *
                        elemento.removeAttribute("min");
                        elemento.removeAttribute("max");

                        $("#checkMultianual").removeAttr("min");
                        $("#checkMultianual").removeAttr("max");

                    });
            } else
            {
                document.querySelectorAll("input[type='date']")
                    .forEach(elemento => {
                        /* A cada elemento encontrado le asignamos el atributo "max" *
                        elemento.min = anio + "-01-01";
                        elemento.max = anio + "-12-31";

                    });
            }

        });*/

     
    });


}
function formularioSelect(data, anio, idexp, expediente) {
    console.log(data);
    if (data[0].fecha_Inicio.toString().includes('/')) {
        var fecha = data[0].fecha_Inicio;
        var partesFecha = fecha.split(' ')[0].split('/'); // Dividir la fecha y tomar solo la parte de la fecha (sin la hora)
        var fechaFormateada = "" + partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0] + ""; // Formatear como "dd/mm/yyyy"

        var fechaFin = data[0].fecha_Cierre;
        var partesFecha2 = fechaFin.split(' ')[0].split('/'); // Dividir la fecha y tomar solo la parte de la fecha (sin la hora)
        var fechaFormateada2 = "" + partesFecha2[2] + '-' + partesFecha2[1] + '-' + partesFecha2[0] + "";
    } else
    {
        var fechaFormateada = data[0].fecha_Inicio.toString().split(' ')[0];
        var fechaFormateada2 = data[0].fecha_Cierre.toString().split(' ')[0];;
    }// Formatear como "dd/mm/yyyy"

    /** */
    var Inputs = [
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "serie_documental", labelText: "Serie documental", value: data[0].serieD, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "numexpediente", labelText: "Número expediente", value: expediente, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "idExpediente", labelText: "ID del expediente", value: idexp, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "asunto", labelText: Requeridos() + "Asunto ", value: data[0].asunto, Bloqueo: false },
        { divClass: "col-6", divClass2: "col-6", ClassLabel: "mt-2", classInput: "form-control date", id: "fecha_inicio", labelText: "Fecha de apertura", id: "fecha_cierre", labelText2: "Fecha de cierre", value: "", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "estatus_expedientes", labelText: "Estatus de expedientes", value: data[0].id_Estatus_Expediente, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "ubicacion_expediente", labelText: Requeridos() + "Ubicación del expediente", value: data[0].ubicacion, Bloqueo: false },
    ];
    var Status = [
        { id_Status: 1, idDesc: "En trámite" },
        { id_Status: 2, idDesc: "En concentración(Sin transferencia)" },
        { id_Status: 3, idDesc: "Histórico(Sin transferencia)" },
        { id_Status: 4, idDesc: "Baja(Sin transferencia)" },
        { id_Status: 5, idDesc: "Otro(Sin transferencia)" }
    ]
    const Contenedor = document.getElementById('AltaExpediente');
    const BodyContainer = document.getElementById('contenidoModal');

    var contenidoNuevo = '';
    for (var i = 0; i < Inputs.length; i++) {
        if (Inputs[i].Bloqueo == true && Inputs[i].divClass == "col-3") {
            if (Inputs[i].labelText == "Estatus de expedientes") {
                let estatusActual = parseInt(data[0].id_Estatus_Expediente) || 0; 
                contenidoNuevo += `
                    <div class="row mt-3">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p>
                        </div>
                        <div class="${Inputs[i].divClass2}">
                        <select id="${Inputs[i].id}" class="form-select" disabled>`;
                for (var e = 0; e < Status.length; e++) {
                    if (estatusActual == Status[e].id_Status) {
                        contenidoNuevo += `<option value=${Status[e].id_Status} selected>${Status[e].idDesc}</option>`;
                    } else {
                        contenidoNuevo += `<option value=${Status[e].id_Status}>${Status[e].idDesc}</option>`;
                    }
                }
                contenidoNuevo += `</select></div>
                    </div>
                    `;
            } else if (Inputs[i].labelText == "Ubicación del Expediente") {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" value="${Inputs[i].value}"/></div>
                </div>
                `;
            } else {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" value="${Inputs[i].value}" disabled/></div>
                </div>
                `;
            }

        } else {
            if (Inputs[i].divClass == "col-6") {


                if (fechaFormateada2 =="1999-01-01") {

                    contenidoNuevo += `
                <div class="row">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada}" min="1970-01-01" max="2050-12-31" disabled/></div>
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="text" class="${Inputs[i].classInput}" value="${fechaFormateada2}" disabled/></div>
                    </div>
                `;

                } else {
                    contenidoNuevo += `
                <div class="row">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada}" min="1970-01-01" max="2050-12-31" disabled/></div>
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada2}"min="1970-01-01" max="2050-12-31" disabled/></div>
                    </div>
                `;
                }
            }
            else if (Inputs[i].value != "") {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" value="${Inputs[i].value}"/></div>
                </div>
                `;
            } else {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}"/></div>
                </div>
                `;
            }
        }
    }

    var ElementosHtml = '';
    ElementosHtml += ` 
        <h5 class="modal-title">Edición de expediente"${expediente}" del año ${anio}</h5>`;
    contenidoNuevo += `
    <div class="row">`;
    if (data[0].observaciones) {
        contenidoNuevo += `
        <p>Observaciones del usuario</>
         <div class="form-group">
            <textarea class="form-control" id="observaciones" rows="3">${data[0].observaciones}</textarea>
        </div>
    </div>
    <div class="row">
         <div class="form-group mt-3">
            <button class="form-control button_registrar" id="Editar" rows="3">Editar</button>
        </div>
    </div>`;


    } else {
        contenidoNuevo += `
        <p>Observaciones del usuario</>
         <div class="form-group">
            <textarea class="form-control" id="observaciones" rows="3"></textarea>
        </div>
    </div>
    <div class="row">
         <div class="form-group mt-3 col-12 mx-auto">
            <button class="form-control button_registrar" id="Editar">Editar</button>
        </div>
    </div>`;
    }


    BodyContainer.innerHTML = contenidoNuevo;
    Contenedor.innerHTML = ElementosHtml;

    updateExpediente();
}
function formularioSelectDocs(data, UnidadAdmin, idDocumento, codigo_documento) {
    if (!data || !data[0]) return;

    var fechaCompleta = data[0].fecha_Doc_Registrado || "";
    var fecha = fechaCompleta.split(" ")[0];
    let partes1 = fecha.split("/");
    let fechaFormateada1 = partes1.length === 3 ? `${partes1[2]}-${partes1[1]}-${partes1[0]}` : fecha;

    var idExpedienteF = $("#Expediente").text().split("-");
    var numexp = idExpedienteF[1] || "";

    // OBTENER CÓDIGO DEL DOCUMENTO CORRECTO (del objeto data o parámetro)
    var codDoc = data[0].codigo_documento || data[0].cod_documento || documento || "";

    var Inputs = [
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "num_exp", labelText: "Número de expediente", value: numexp, Bloqueo: true },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "codigo_documento", labelText: "Código del documento", value: codigo_documento, Bloqueo: true },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "id_documento", labelText: "ID del documento", value: idDocumento, Bloqueo: true },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "referencia", labelText: "Referencia", value: data[0].referencias || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "nombre_emisor", labelText: "Nombre del emisor", value: data[0].nombre_Cargo_Emisor || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "cargo_emisor", labelText: "Cargo del emisor", value: data[0].cargo_Emisor || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-select", id: "institución_emisor", labelText: "Institución emisora", value: data[0].institución_emisor || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "desc_documento", labelText: "Descripción del documento", value: data[0].desc_documento || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", type: "date", id: "fecha_emision", labelText: "Fecha de emision", value: fechaFormateada1, Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "fojas", labelText: "Fojas", value: data[0].fojas || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-control", id: "observaciones", labelText: "Observaciones", value: data[0].observaciones || "", Bloqueo: false },
        { divClass: "col-12 mb-2", ClassLabel: "form-label fw-bold", classInput: "form-select", id: "soporte", labelText: "soporte", value: "", Bloqueo: false }
    ];

    var contenidoNuevo = '';

    for (var i = 0; i < Inputs.length; i++) {

        // ESTRUCTURA CON CONTENEDOR DINÁMICO
        if (Inputs[i].id === "institución_emisor" || Inputs[i].labelText === "Institución emisora") {
            contenidoNuevo += `
            <div class="${Inputs[i].divClass}">
                <label for="${Inputs[i].id}" class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</label>
                <label style="float:right;">
                    <input type="checkbox" class="chk-externo" value="1" /> Emisor Externo
                </label>
                <div id="contenedor_institucion">
                    <select id="${Inputs[i].id}" class="form-select">
                        <option value="">Selecciona</option>`;

            if (UnidadAdmin && UnidadAdmin.length > 0) {
                for (var e = 0; e < UnidadAdmin.length; e++) {
                    contenidoNuevo += `<option value="${UnidadAdmin[e].nombre_completo}">${UnidadAdmin[e].nombre_completo}</option>`;
                }
            }

            contenidoNuevo += `
                    </select>
                </div>
            </div>`;
            continue;
        }

        // SOPORTE DOCUMENTAL
        if (Inputs[i].id === "soporte") {
            contenidoNuevo += `
            <div class="${Inputs[i].divClass}">
                <label for="${Inputs[i].id}" class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</label>
                <select id="${Inputs[i].id}" class="form-select" multiple>
                    <option value="">Selecciona</option>`;

            if (typeof soporteDocumental !== 'undefined' && soporteDocumental.length > 0) {
                for (var s = 0; s < soporteDocumental.length; s++) {
                    contenidoNuevo += `<option value="${soporteDocumental[s].idDesc}">${soporteDocumental[s].idDesc}</option>`;
                }
            }

            contenidoNuevo += `
                </select>
            </div>`;
            continue;
        }

        // DESCRIPCIÓN
        if (Inputs[i].id === "desc_documento") {
            contenidoNuevo += `
            <div class="${Inputs[i].divClass}">
                <label class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</label>
                <textarea class="form-control" id="desc_documento" rows="3">${Inputs[i].value}</textarea>
            </div>`;
            continue;
        }

        // INPUTS NORMALES
        var isDisabled = Inputs[i].Bloqueo ? "disabled" : "";
        var inputType = Inputs[i].type || "text";

        contenidoNuevo += `
        <div class="${Inputs[i].divClass}">
            <label for="${Inputs[i].id}" class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</label>
            <input type="${inputType}" id="${Inputs[i].id}" class="${Inputs[i].classInput}" value="${Inputs[i].value}" ${isDisabled}/>
        </div>`;
    }

    contenidoNuevo += `
    <div class="row">
        <div class="form-group mt-3 col-12 mx-auto">
            <button class="form-control button_registrar" id="EditarD">Editar</button>
        </div>
    </div>`;

    // Inserción en el DOM
    $("#contenidoModal").html(contenidoNuevo);
    $("#AltaExpediente").html('<h5 class="modal-title">Edición de documentos</h5>');

    // DELEGACIÓN DE EVENTO EN #contenidoModal
    $("#contenidoModal").off("change", ".chk-externo").on("change", ".chk-externo", function () {
        var $contenedor = $("#contenedor_institucion");

        if ($(this).is(":checked")) {
            // Cambia a campo de texto
            $contenedor.html('<input type="text" id="institución_emisor" class="form-control" placeholder="Escribe la institución emisora..." />');
            $("#institución_emisor").focus();
        } else {
            // Regresa a desplegable
            var selectHtml = '<select id="institución_emisor" class="form-select"><option value="">Selecciona</option>';
            if (UnidadAdmin && UnidadAdmin.length > 0) {
                for (var e = 0; e < UnidadAdmin.length; e++) {
                    selectHtml += `<option value="${UnidadAdmin[e].nombre_completo}">${UnidadAdmin[e].nombre_completo}</option>`;
                }
            }
            selectHtml += '</select>';
            $contenedor.html(selectHtml);
        }
    });

    if (typeof UpdateDocumentos === 'function') {
        UpdateDocumentos();
    }
}

function SelectExpediente(data,anio) {
    var num_exp = data.idExp;
    var expediente = data.num_Exp;
    var rolu = $('#rolu').text();
    console.log(num_exp);
    console.log(data);


    $(document).ready(function () {

        $.ajax({
            type: "POST",
            url: "/Home/SelectExpediente",
            data: {
                serieDocumental: num_exp,
            },
            dataType: "JSON",

            success: function (resp) {
                if (resp) {
                    $('#ModalPrueba').modal('show');
                    formularioSelect(resp, anio, num_exp, expediente);

                    obtenerEstatusDesdeBD(num_exp, function (idStatusBD) {
                        if (idStatusBD !== null) {
                            $("#estatus_expedientes").val(idStatusBD);
                        }
                    });
                }
                else {

                }
            }
        });
    });
}

function updateExpediente() {
    $(document).ready(function () {
        $("#Editar").on("click", function () {
            var serie_documental = $("#numexpediente").val();//num_exp
            var asunto = $("#asunto").val();//asunto
            var Estatus = $("#estatus_expedientes").val();
            var ubicacion_expediente = $("#ubicacion_expediente").val();//ubicacion
            var idExp = $("#idExpediente").val(); 

            var observaciones = $("#observaciones").val();

            var Horas1 = new Date()
            var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
            console.log(completo);

            var fecha_inicio = $("#fecha_inicio").val() + " " + completo;
            var fecha_cierre = $("#fecha_cierre").val() + " " + completo;

            $.ajax({
                type: "POST",
                url: "/Home/UpdateExpedientes",
                data: {
                    num_exp: serie_documental,
                    asunto: asunto,
                    fechaInicio: fecha_inicio,
                    fechaCierre: fecha_cierre,
                    estatus: Estatus,
                    ubicacionExpediente: ubicacion_expediente,
                    Observaciones: observaciones,
                    idExpediente: idExp

                },
                dataType: "JSON",

                success: function (resp) {
                    if (resp.success=="OK") {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Actualizado',
                            icon: 'success',
                            confirmButtonText: 'cerrar'
                        }).then(function () {

                            var rolu = $('#rolu').text();
                            if (rolu == "Administrador") {
                                var siglasUA = $('#cmbArea option:selected').val();
                            }
                            else
                            {
                                var siglasUA = $('#SiglasUA').text();
                            }
                            // siglasUA = $('#SiglasUA').text();
                            anio_busqueda = $('#cmbAnio').val();


                            $("div[class^='div-tbl-']").each(function (index) {

                                if ($(this).css("display") == 'block') {
                                    //console.log(index + ": " + $(this).text());
                                    var id_elemento = $(this).attr('id');
                                    console.log("Este es el ID del elemento:" + id_elemento);
                                    console.log($(this).attr('id'));
                                    var dividir = $(this).attr('id').split('-');
                                    var idSerie = dividir[2].toString();
                                    console.log(idSerie);
                                    var HermanoDiv = $(this).siblings()[0];
                                    console.log(HermanoDiv.id);
                                    console.log($(HermanoDiv).children());
                                    console.log($(HermanoDiv).children()[0].innerHTML);
                                    console.log($(HermanoDiv).children()[1].innerHTML);
                                    var serie_v = $(HermanoDiv).children()[0].innerHTML;
                                    var contadroExpedientes = $(HermanoDiv).children()[1].innerHTML;
                                    var serie = idSerie + " " + serie_v;
                                    $("#" + id_elemento).empty();
                                    var complemento = `<table id="tbl-${idSerie}" class="display responsive" style="width:100%">
                                                           <img class="button_alta" id="button_alta-${idSerie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png"></button>
                                                            <thead>
                                                            </thead>
                                                            <tbody>
                                                            </tbody>
                                                        </table>`;
                                    console.log(complemento);
                                    var addressContainer = document.getElementById(id_elemento);
                                    console.log(addressContainer);
                                    addressContainer.innerHTML = addressContainer.innerHTML + complemento;
                                    //$(HermanoDiv).children()[1].innerHTML = "";
                                    //$(HermanoDiv).children()[1].innerHTML = parseInt(contadroExpedientes, 10) - 1;
                                    //AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie);
                                    $("#" + id_elemento).load(AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie));
                                }
                            });

                        });
                        $("#ModalPrueba").modal('hide'); //ocultamos el modal

                    }
                    else {
                        Swal.fire({
                            title: 'Advertencia',
                            text: 'Error de Registro ',
                            icon: 'error',
                            confirmButtonText: 'cerrar'
                        });
                    }
                }
            })


        });
    })

}


function UpdateDocumentos() {
    var aniosDisponibles = arregloanios().map(obj => obj.idSelect);

    var anioMin = Math.min(...aniosDisponibles);
    var anioMax = Math.max(...aniosDisponibles);

    var fechaexpglobalF = fechaexpglobal.substring(0, 10);
    let partes = fechaexpglobalF.split("/");
    let fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    $("#fecha_emision").attr("min", `${fechaFormateada}`);
    $("#fecha_emision").attr("max", `${anioMax}-12-31`);

    // Usamos .off('click') antes de .on('click') para evitar peticiones duplicadas
    $("#EditarD").off("click").on("click", function (e) {
        e.preventDefault();

        // CAPTURA DIRECTA DE DATOS (Guarda al primer clic)
        var num_exp = $("#num_exp").val();
        var codigo_documento = $("#codigo_documento").val();
        var referencia = $("#referencia").val();
        var nombre_emisor = $("#nombre_emisor").val();
        var cargo_emisor = $("#cargo_emisor").val();

        // Toma el valor de #institución_emisor dinámicamente (sea select o input)
        var institución_emisor = $("#institución_emisor").val() || "";
        var desc_documento = $("#desc_documento").val();

        var fojas = $("#fojas").val();
        var observaciones = $("#observaciones").val();
        var id_Documento = $("#id_documento").val();

        var idExpedienteF = $("#Expediente").text().split("-");
        var idexp = idExpedienteF[0];
        var numexp = idExpedienteF[1];

        var Horas1 = new Date();
        var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
        var fecha_emision = $("#fecha_emision").val() + " " + completo;

        var id_tipo_documento = $("#soporte").val();

        if (Array.isArray(id_tipo_documento)) {
            id_tipo_documento = id_tipo_documento.join(",").trim();
        } else {
            id_tipo_documento = id_tipo_documento ? id_tipo_documento.trim() : "";
        }

        var fechaEmisionSHora = $("#fecha_emision").val();

        let partes11 = fechaEmisionSHora.split("-");
        let fechaEmisionDate = new Date(partes11[0], partes11[1] - 1, partes11[2]);

        let partes00 = fechaexpglobalF.split("/");
        let fechaAperturaDate = new Date(partes00[2], partes00[1] - 1, partes00[0]);

        if (fechaEmisionDate >= fechaAperturaDate) {
            $.ajax({
                type: "POST",
                url: "/Home/UpdateDocumentos",
                data: {
                    num_exp_: num_exp,
                    codigo_documento_: codigo_documento,
                    referencia_: referencia,
                    nombre_emisor_: nombre_emisor,
                    cargo_emisor_: cargo_emisor,
                    institución_emisor_: institución_emisor,
                    desc_documento_: desc_documento,
                    fecha_emision_: fecha_emision,
                    id_tipo_documento_: id_tipo_documento,
                    fojas_: fojas,
                    observaciones_: observaciones,
                    num_exp_: numexp,
                    id_documento: id_Documento
                },
                dataType: "JSON",
                success: function (resp) {
                    if (resp.success == "OK") {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Actualizado',
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        }).then(function (result) {
                            if (result.isConfirmed || result.dismiss === Swal.dismissReason.close) {
                                $("#myModal").modal('hide');
                                $("#ModalPrueba").modal('hide');
                                if (typeof recargatablaDocumento === 'function') recargatablaDocumento();
                                if (typeof recargaTablaExpedientes === 'function') recargaTablaExpedientes();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Advertencia',
                            text: 'Error de Registro',
                            icon: 'error',
                            confirmButtonText: 'Cerrar'
                        });
                    }
                }
            });
        } else {
            Swal.fire({
                title: 'Fecha inválida',
                text: 'La fecha de emisión no puede ser anterior a la fecha de apertura del expediente.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
        }
    });
}
//Función para guardar expedientes
function datosExpediente(id_serie, siglasUA) {
    $(document).ready(function () {

        // ✅ Se ejecuta CADA VEZ que el usuario ABRE el modal
        $('#ModalPrueba').off('shown.bs.modal').on('shown.bs.modal', function () {
            var anioSeleccionado = $('#cmbAnio').val() || new Date().getFullYear();

            // Asigna dinámicamente el min y max del año activo en el combo al input de fecha
            $("#fecha_inicio").attr("min", `${anioSeleccionado}-01-01`);
            $("#fecha_inicio").attr("max", `${anioSeleccionado}-12-31`);
        });

        // Evento de registro de datos
        $("#Registrar").off("click").on("click", function () {
            // Obtener valores de los campos
            var serie_documental = $("#serie_documental").val() || "";
            var asunto = $("#asunto").val() || "";
            var Estatus = $("#estatus_expedientes").val() || "";
            var ubicacion_expediente = $("#ubicacion_expediente").val() || "";
            var observaciones = $("#observaciones").val() || "";

            // Obtener la hora actual en formato HH:mm:ss
            var Horas1 = new Date();
            var completo = `${Horas1.getHours()}:${Horas1.getMinutes()}:${Horas1.getSeconds()}`;

            // Validar y asignar fecha de inicio
            var fecha_inicio = $("#fecha_inicio").val()
                ? $("#fecha_inicio").val() + " " + completo
                : "";

            var fecha_cierre = $("#fecha_cierre").val()
                ? $("#fecha_cierre").val() + " " + completo
                : "1999-01-01 " + completo;

            var rol = $('#rolu').text();
            var anio_busqueda = $('#cmbAnio').val();

            $.ajax({
                type: "POST",
                url: "/Home/AltaExpedientes",
                data: {
                    serieDocumental: serie_documental,
                    asunto: asunto,
                    fechaInicio: fecha_inicio,
                    fechaCierre: fecha_cierre,
                    estatus: Estatus,
                    ubicacionExpediente: ubicacion_expediente,
                    observacionesUsuario: observaciones,
                    idSerie: id_serie,
                    UA: siglasUA
                },
                dataType: "JSON",
                success: function (resp) {
                    if (resp.success == 'OK') {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Correcto',
                            icon: 'success',
                            confirmButtonText: 'cerrar'
                        }).then(function () {
                            $("#ModalPrueba").modal('hide');
                            recargaTablaExpedientes('alta', siglasUA);
                            if (typeof callback === "function") {
                                callback();
                            }
                        });
                    }
                    else if (resp.success == 'DUPLICADO') {
                        Swal.fire({
                            title: 'Asunto Duplicado',
                            text: 'El asunto ingresado ya existe registrado en esta serie documental.',
                            icon: 'warning',
                            confirmButtonText: 'cerrar'
                        });
                    }
                    else {
                        Swal.fire({
                            title: 'Advertencia',
                            text: 'No se pudo completar el registro. Verifique los campos obligatorios (*).',
                            icon: 'error',
                            confirmButtonText: 'cerrar'
                        });
                    }
                }
            });
        });
    });
}

/**Funcion para eliminar expedientes*/
function DeleteExpedientes(data, tr) {

    //data.fojas data.legajos
    //console.log(data.legajos + " " + data.fojas);
    console.log(data);
    if (data.fojas == 0 ) {
        Swal.fire({
            title: "¿Realmente quieres eliminar el expediente " + data.num_Exp + " " + data.asunto + "?",
            text: "¿Eliminar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(resultado => {
            if (resultado.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/Home/DeleteExpedientes",
                    data: {
                        id_exp: data.idExp,
                        numex: data.num_Exp,
                    },
                    dataType: "JSON",

                    success: function (resp) {
                        console.log(resp);
                        ; if (resp) {
                        //    table.row(tr).remove().draw(false);
                            Swal.fire({
                                title: 'Correcto',
                                text: 'El Expediente ha sido eliminado',
                                icon: 'success',
                                confirmButtonText: 'cerrar'
                            }).then(function () {


                                var siglasUA = data.ua; //$('#SiglasUA').text();
                           var anio_busqueda = $('#cmbAnio').val();


                                $("div[class^='div-tbl-']").each(function (index) {

                                    if ($(this).css("display") == 'block') {
                                        //console.log(index + ": " + $(this).text());
                                        var id_elemento = $(this).attr('id');
                                        console.log("Este es el ID del elemento:" + id_elemento);
                                        console.log($(this).attr('id'));
                                        var dividir = $(this).attr('id').split('-');
                                        var idSerie = dividir[2].toString();
                                        console.log(idSerie);
                                        var HermanoDiv = $(this).siblings()[0];
                                        console.log(HermanoDiv.id);
                                        console.log($(HermanoDiv).children());
                                        console.log($(HermanoDiv).children()[0].innerHTML);
                                        console.log($(HermanoDiv).children()[1].innerHTML);
                                        var serie_v = $(HermanoDiv).children()[0].innerHTML;
                                        var contadroExpedientes = $(HermanoDiv).children()[1].innerHTML;
                                        var serie = idSerie + " " + serie_v;
                                        $("#" + id_elemento).empty();
                                        var complemento = `<table id="tbl-${idSerie}" class="display responsive" style="width:100%">
                                                           <img class="button_alta" id="button_alta-${idSerie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png"></button>
                                                            <thead>
                                                            </thead>
                                                            <tbody>
                                                            </tbody>
                                                        </table>`;
                                        console.log(complemento);
                                        var addressContainer = document.getElementById(id_elemento);
                                        console.log(addressContainer);
                                        addressContainer.innerHTML = addressContainer.innerHTML + complemento;
                                        $(HermanoDiv).children()[1].innerHTML = "";
                                        $(HermanoDiv).children()[1].innerHTML = parseInt(contadroExpedientes, 10) - 1;
                                       // AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie);
                                        console.log("entreeeeeeeeeeeee");
                                        if (parseInt($(HermanoDiv).children().eq(1).text()) === 0) {
                                            $(`#heading-${idSerie}`).css({
                                                "background-color": "lightgray",
                                                "color": "black"
                                            });
                                        }
                                        $("#" + id_elemento).load(AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie));
                                       
                                    }
                                });
                            });

                        }
                        else {
                            Swal.fire({
                                title: 'Advertencia',
                                text: 'Error al intentar Eliminar un Registro',
                                icon: 'error',
                                confirmButtonText: 'cerrar'
                            });
                        }
                    }
                })

            } else {
                Swal.fire({
                    title: 'Operacion Cancelada',
                    text: 'El Expediente no se eliminó',
                    confirmButtonText: 'cerrar'
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Advertencia',
            text: 'No puedes Eliminar un Expediente con Documentos',
            icon: 'error',
            confirmButtonText: 'cerrar'
        });
    }
   
}
function SeleccionaTodoCheck()
{

    $('#BtnSeleccionar').on('change', function (e) {
        if (this.checked) {
            $("input:checkbox[class=selected]").each(function () {
                $(this).prop("checked", true);
            });
        } else {
            $("input:checkbox[class=selected]").each(function () {
                $(this).prop("checked", false);
            });
        }
    });


}
function DeseleccionarTodoCheck() {
    $("input:checkbox[class=selected]").each(function () {
        $(this).prop("checked", false);
    });
}
function ejecutaBoton() {
    var contador = $("input:checkbox[class=selected]:checked").length;

    if (contador > 0) {
        Swal.fire({
            title: "¿Realmente quieres eliminar los " + contador + " documentos?",
            text: "¿Eliminar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(resultado => {
            if (resultado.isConfirmed) {
                $("input:checkbox[class=selected]:checked").each(function () {
                    let value = $(this).val();
                    $.ajax({
                        type: "POST",
                        url: "/Home/DeleteDoct",
                        data: {
                            id: value,
                        },
                        dataType: "JSON",
                        success: function (id) {
                            console.log("Datos Eliminados Correctamente");
                            recargatablaDocumento();
                            recargaTablaExpedientes();
                        },
                        error: function (xhr, status, error) {

                        }
                    })

                });

            } else {
                //console.log("Operación Cancelada");
                //$("#ModalDocumento").modal('hide');
                //$('body').removeClass('modal-open');
                //$('.modal-backdrop').remove();
            }
        });
    } else {
        // Si no hay checkbox activos, puedes mostrar un mensaje o realizar alguna otra acción
        console.log("Debes seleccionar al menos un documento para eliminar.");
        Swal.fire({
            title: "Debes seleccionar al menos un documento para eliminar.",
            icon: 'warning',

        });
    }
}
function VistaDocumentos() {
      // Evento para abrir el modal de documentos ----------JM
    $(document).on('click', '#button_documento', function () {
        console.log($(this));
        var exp = $(this).find("#linkExpediente").val();
        fechaexpglobal = $(this).find("#fechaexpediente").val(); 
        console.log("fecha del expediente:" + fechaexpglobal);

        var arreglo = exp.split('<br>');
        var exp2 = arreglo[0];
        var exp3 = exp2.split('-')[0];

        console.log(exp3);

         // Mostrar modal primero
        $('#ModalDocumento').modal('show');

        const Contenedor = document.getElementById('VistaDocumentos');
        /**Correccón en el expediente para homologar ${exp}*/
        var BodyHtml1 = `
                  
                        <div class="C-Table">
                        <h3 class="TitleListadoDocumentos">Documentos correspondientes al expediente: <label class="TitleExp" id= "Expediente">${exp}</label></h3> </br>
                        <img class="button_alta" id="button_alta" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoDoc.png"></button>
                            <img class="buttonSelDoc" id="buttonSelDoc" onclick="ejecutaBoton()" src="img/EliminaDoc.png"></button>
                     
                            <table id="tbl-Doc" class="display" style="font-size: .85rem; width: 1100px;">
                                <thead>
                                </thead>
                                <tbody>
                                </tbody>
                            </table >
                        </div>
                    `;
        $('#tbl-Doc').css('width', '100%');
        
        // 1️ PRIMERO insertar el HTML
        Contenedor.innerHTML = BodyHtml1;

        // 2️ DESPUÉS agregar los eventos (limpiando antes)
        $('#buttonSelDoc').off('click').on('click', ejecutaBoton);

        // 3️ Ahora sí cargar la tabla
        AggTablaDocumentos(exp3, 1, fechaexpglobal);

        // 4️ Inicializar alta de documentos
        AltaDocumento("nombreTabla");

        console.log("Modal cargado para expediente:", exp);

    });

    //$(document).on('click', '#tbl-Doc tbody tr', function (event) {                   jm comentado 15/12/2025

    //    event.preventDefault();

    //    var idtr = $(this).html();
    //    var array = idtr.split("<td>");
    //    var array2 = array[1].split("</td>");

    //    idDocumento = array2[0]; // ID del documento capturado

    //    // Inicializar DataTable solo para selección
    //    const table = new DataTable('#tbl-Doc');

    //    table.on('click', 'tbody tr', function (e) {
    //        e.currentTarget.classList.toggle('selected');
    //    });


    //});
}
function SelectDocumentos(numdocs, documento, codigo_documento) {

    // Limpiar solo contenido interno
    $("#contenidoModal").html("");

    $.ajax({
        type: "POST",
        url: "/Home/SelectDocumentos",
        data: { numdoc: numdocs },
        dataType: "JSON",

        success: function (resp) {
            if (!resp) return;

            // MOSTRAR modal SIN parpadear
            $('#ModalPrueba').modal('show');

            // Renderizar el formulario dentro del modal
            formularioSelectDocs(resp.doc, resp.ua, numdocs, codigo_documento);

            // Inicializar Select2 correctamente SIN reiniciar modal
            $("#soporte").select2({
                dropdownParent: $('#ModalPrueba'),
                width: '100%',
                language: 'es'
            });

            // Cargar valores del select múltiple
            var arregloSoporte = resp.doc[0].id_tipo_documento.split(',');
            $('#soporte')
                .val(arregloSoporte)
                .trigger('change');

            // Asignar institución emisora
            // Reemplaza la línea $('#institución_emisor').val(resp.doc[0].institución_emisor); por esto:
            var instEmisoraGuardada = resp.doc[0].institución_emisor || "";

            // Comprobamos si el valor existe en las opciones del <select>
            var existeEnSelect = $("#institución_emisor option[value='" + instEmisoraGuardada + "']").length > 0;

            if (!existeEnSelect && instEmisoraGuardada !== "") {
                // Si no existe, es un emisor externo: marcamos el checkbox y reemplazamos por el input
                $(".chk-externo").prop("checked", true).trigger("change");
                $("#institución_emisor").val(instEmisoraGuardada);
            } else {
                // Si existe, se asigna directamente al select
                $("#institución_emisor").val(instEmisoraGuardada);
            }
        }
    });
}

//aqui comienza la tabla de documentos
function AggTablaDocumentos(expedientet, tipobusqueda, fechaaltaexp) {

    tB = tipobusqueda;
    var seleccionables = `<div>Seleccionar todo:<input type="checkbox" class="BtnSeleccionar" id="BtnSeleccionar" onclick="SeleccionaTodoCheck()" value=""></div>`;

    var titulos = [
        { "title": seleccionables, "targets": 0 },
        { "title": "Acciones", "targets": 1 },
        { "title": "Área", "targets": 2 },
        { "title": "Código del documento", "targets": 3 },
        { "title": "Descripción del documento", "targets": 4 },
        { "title": "Fecha del documento registrado", "targets": 5 },
        { "title": "Nombre y cargo del emisor", "targets": 6 },
        { "title": "Referencias", "targets": 7 },
        { "title": "Fojas", "targets": 8 },
    ];

    $.ajax({
        type: "POST",
        url: "/Home/ObtenerDocumentosPorExpediente",
        data: { expediente: expedientet },
        dataType: "JSON",
        success: function (documentos) {

            if (tB == 1) {
                $(documentos).each(function (index) {
                    arrayDoc.push(documentos[index]);
                });
            }

            console.log(arrayDoc);

            const nombreTabla = '#tbl-Doc';

            if ($.fn.DataTable.isDataTable(nombreTabla)) {
                $(nombreTabla).DataTable().destroy();
                $(nombreTabla).empty();
            }

            var table = $(nombreTabla).DataTable({

                language: {
                    sProcessing: "Procesando...",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ningún dato disponible",
                    sInfo: "Mostrando _START_ a _END_ de _TOTAL_",
                    sInfoEmpty: "Mostrando 0 a 0",
                    sInfoFiltered: "(filtrado de _MAX_ registros)",
                    sSearch: "Buscar",
                    oPaginate: {
                        sFirst: "Primero",
                        sLast: "Último",
                        sNext: "Siguiente",
                        sPrevious: "Anterior"
                    }
                },

                iDisplayLength: 10,
                data: documentos,
                orderCellsTop: true,
                fixedHeader: false,
                responsive: true,
                columnDefs: titulos,

                columns: [
                    {
                        mRender: function (data, type, full) {
                            return `<input type="checkbox" class="selected" value="${full.expediente}" />`;
                        },
                        className: 'dt-center',
                        orderable: false
                    },
                    {
                        // ⚡ [CORREGIDO]: Atributos data-* y clases para evitar SyntaxError por saltos de línea/comillas
                        mRender: function (data, type, full) {
                            var descLimpia = full.desc_documento
                                ? full.desc_documento.replace(/[\r\n]+/g, ' ').replace(/'/g, "\\'")
                                : '';

                            return `
                                <div class="action-buttons">
                                    <a class="edit btn-editar-doc" data-expediente="${full.expediente}" data-desc="${descLimpia}" style="cursor:pointer;">
                                        <i class="fa fa-pencil"></i>
                                    </a>
                                    <a class="Eliminar_Doc btn-eliminar-doc" data-expediente="${full.expediente}" data-desc="${descLimpia}" style="cursor:pointer;">
                                        <i class="fa fa-trash"></i>
                                    </a>
                                </div>`;
                        },
                        className: 'dt-center',
                        orderable: false
                    },

                    { data: 'area' },
                    { data: 'codigo_documento' },
                    { data: 'desc_documento' },
                    { data: 'fecha_Doc_Registrado' },
                    { data: 'nombre_Cargo_Emisor' },
                    { data: 'referencias' },
                    { data: 'fojas' },
                ],

                order: [[1, 'desc']],

                initComplete: function () {

                    // ⚡ [AGREGADO]: Asignación limpia de eventos a los botones sin onclick directo
                    $('#tbl-Doc tbody').off('click', '.btn-editar-doc').on('click', '.btn-editar-doc', function (e) {
                        e.preventDefault();

                        // 1. Imprime en la consola de F12 TODO lo que trae esa fila
                        var tr = $(this).closest('tr');
                        var rowData = $('#tbl-Doc').DataTable().row(tr).data();
                        console.log("DATOS DE LA FILA:", rowData);

                        if (rowData) {
                            // 1. Mandamos 'desc_documento' para que la consulta AJAX responda bien y no truene
                            SelectDocumentos(rowData.expediente, rowData.desc_documento, rowData.codigo_documento);
                        }
                    });

                    $('#tbl-Doc tbody').off('click', '.btn-eliminar-doc').on('click', '.btn-eliminar-doc', function (e) {
                        e.preventDefault();
                        var exp = $(this).data('expediente');
                        var desc = $(this).data('desc');
                        DocEliminar(exp, desc);
                    });

                    //===============================
                    // AGREGAR SOLO 1 FILA DE FILTROS
                    //===============================

                    var thead = $('#tbl-Doc thead');
                    var trOriginal = $('#tbl-Doc thead tr').first();

                    var filterRow = trOriginal.clone().addClass('filters');
                    thead.append(filterRow);

                    $('#tbl-Doc thead .filters th').each(function (i) {

                        var title = $(trOriginal.find('th')[i]).text();

                        $(this).html('<input type="text" placeholder="' + title + '" />');

                        $('input', this).on('click', function (e) {
                            e.stopPropagation();
                        })
                            .on('keyup change', function () {

                                if (table.column(i).search() !== this.value) {
                                    table
                                        .column(i)
                                        .search(this.value)
                                        .draw();
                                }
                            });

                        // evitar iconos de ordenamiento en filtros
                        $(this).removeClass('sorting sorting_desc sorting_asc').off('click');
                    });
                }
            });
        }
    });
}
/** Alta de documentos */
function AltaDocumento() { //manda a llamar a la funcion ModalAltaeditar para abrir el modal de docuemntos 

    $('#button_alta').on('click', function () {
        $('#ModalEditarAgregar').modal('show');
    
    });
    var fechaexpglobalF = fechaexpglobal.substring(0, 10);
    let partes = fechaexpglobalF.split("/");
    let fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    $.ajax({
        type: "POST",
        url: "/Home/SelectUA",
        dataType: "JSON",
        success: function (data) {
            //var fecha = anio_busqueda + "-03-03";
            console.log(data, "dataaaaaaaaaJJMMM");
            ModalAltaEditarDocumentos(fechaFormateada, data);
                $("#instText").hide();
                checkExterno();
            $("#idSoporte").select2({
                dropdownParent: $('#ModalEditarAgregar'),
                width: '100%',
                language: 'es'
            });
          
        },
        error: function (xhr, status, error) {
            console.error("Error en AJAX:", status, error);
            console.error("Respuesta completa:", xhr.responseText);
        }
           
    })
    /*AQUI*/
}


function compararFechaConHoy(fechaStr) {
    let fechaBD = new Date(fechaStr);
    let hoy = new Date();

    // Eliminar las horas
    fechaBD.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (fechaBD.getTime() === hoy.getTime()) {
        console.log("La fecha es HOY");
    } else if (fechaBD < hoy) {
        console.log("La fecha es ANTERIOR");
    } else {
        console.log("La fecha es POSTERIOR");
    }
}
function checkExterno()
{
    $('#externo').on('change', function () {

        if ($(this).prop('checked') == true) {
            estatuscheckinsti = 1;
            $("#idInstitucion").hide();
            $("#instText").show();

        } else {
            $("#idInstitucion").show();
            $("#instText").hide();
            estatuscheckinsti = 0;
        }
    });
}
function altaDocumentoChris() {

    var aniosDisponibles = arregloanios().map(obj => obj.idSelect);

    // Encontrar el menor y el mayor año disponible
    var anioMin = Math.min(...aniosDisponibles);
    var anioMax = Math.max(...aniosDisponibles);

    // Establecer los límites en el input de fecha
    $("#fecha_emision").attr("min", `${anioMin}-01-01`);
    $("#fecha_emision").attr("max", `${anioMax}-12-31`);
    $(document).on('click', '#AltaDoc', function () {


        var fecha_inicio = $("#fecha_inicio").val() + " " + completo;
        var idExpediente = $("#Expedientem").html();
        var idExpedienteF = $("#Expediente").text().split("-");
        var idexp = idExpedienteF[0];
        var idexpF = idExpedienteF[1];
        console.log(idexp);
        console.log(idexpF);
        var referencia = $("#idReferencia").val();
        var emisor = $("#idEmisor").val();
        var cargoEmisor = $("#idCargoEmisor").val();
        var institucion = "";

        if ($("#idInstitucion").val() == "Selecciona")
        {
            institucion = $("#instText").val();
        }
        else
        {
            institucion = $("#idInstitucion").val();
        }
        var descripcionDocumento = $("#idDescDoc").val();

        var estatus = estatuscheckinsti;
        var fojas = $("#idFojas").val();
        var soporte = $("#idSoporte").val();
        var observacione = $("#idObservaciones").val();
        console.log(soporte);

        var Horas1 = new Date();
        var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
        console.log(completo);
        var fechaEmision = $("#idFechaEmision").val() + " " + completo;
        var fechaEmisionSHora = $("#idFechaEmision").val();

        // Convertir fecha de emisión (dd/MM/yyyy) a objeto Date
        let partes1 = fechaEmisionSHora.split("-");
        let fechaEmisionDate = new Date(partes1[0], partes1[1] - 1, partes1[2]);

        // Convertir fecha de apertura del expediente (dd/MM/yyyy) a objeto Date
        var fechaexpglobalF = fechaexpglobal.substring(0, 10);
        let partes = fechaexpglobalF.split("/");
        let fechaAperturaDate = new Date(partes[2], partes[1] - 1, partes[0]);

        // Comparar como fechas reales
        if (fechaEmisionDate >= fechaAperturaDate) {
                $.ajax({
                    type: "POST",
                    url: "/Home/AltaDocumento",
                    data: {
                        exp: idexp,
                        refs: referencia,
                        emi: emisor,
                        cargoE: cargoEmisor,
                        inst: institucion,
                        descD: descripcionDocumento,
                        fechaE: fechaEmision,
                        est: estatus,
                        foj: fojas,
                        sop: soporte,
                        observaciones: observacione,
                        num_exp: idExpedienteF[1]
                    },
                    dataType: "JSON",

                    success: function (resp) {

                        if (resp.success == "OK") {
                            Swal.fire({
                                title: 'Correcto',
                                text: 'Registro Correcto',
                                icon: 'success',
                                confirmButtonText: 'cerrar'
                            }).then(function () {
                                // Redirigir al usuario a la vista "Login" desde el controlador "LoinController"  


                                recargatablaDocumento();
                                recargaTablaExpedientes();

                            });
                        }
                        else {
                            let mensajeError = resp.mensaje || 'Completar los campos requeridos marcados con un *.';
                            Swal.fire({
                                title: 'Advertencia',
                                text: mensajeError,
                                icon: 'error',
                                confirmButtonText: 'cerrar'
                            });
                        }

                    }
                })
            }
        else
        {
            Swal.fire({
                title: 'Fecha inválida',
                text: 'La fecha de emisión no puede ser anterior a la fecha de apertura del expediente. Por favor, verifique que su fecha sea válida.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
        }
     });
}
function ModalAltaEditarDocumentos(anio, UnidadAdmin) {

    $("input:checkbox").on('click', function () {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            //var group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
           // $(group).prop("checked", false);
            //$box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
    
    let inputs = [
        { class: "col-12", id: "idReferencia", text: Requeridos()+"Referencia"},
        { class: "col-12", id: "idEmisor", text: Requeridos() + "Nombre del emisor"},
        { class: "col-12", id: "idCargoEmisor", text: Requeridos() + "Cargo del emisor" },
        { class: "col-12 ", id: "idInt_Ext", text: " " },
        { class: "col-12", id: "idInstitucion", text: Requeridos() + "Emisor Interno" },
        { class: "col-12", id: "instText", text: "" },
        { class: "col-12", id: "idDescDoc", text: Requeridos() + "Descripción del documento" },
        { class: "col-12", id: "idFechaEmision", text: Requeridos() + "Fecha de emisión" },
        //{ class: "col-6", id: "idEstatus", text: "Estatus" },
        { class: "col-6 numeric", id: "idFojas", text: Requeridos() + "Fojas" }, 
        { class: "col-12", id: "idSoporte", text: Requeridos() + "Soporte" },
        { class: "col-12", id: "idObservaciones", text: "Observaciones" }
    ]
    const Contenedor = document.getElementById('contenidoModalEditarAgregar');
    const ContenedorHeader = document.getElementById('VistaEditarAgregar');
    var BodyHtml1 = `<div class="row StyleDocument">`;
    for (var i = 0; i < inputs.length; i++) {

        if (inputs[i].text == Requeridos() + "Descripción del documento") {
            BodyHtml1 += `
                <div class="col-12">
                    <label>${inputs[i].text}</label>
                     <textarea class="form-control" id="idDescDoc" rows="1"> </textarea>
                </div>          
                `;

        } else if (inputs[i].text == Requeridos() + "Fecha de emisión") {
            var Status = [
                { id_Status: 1, idDesc: "En trámite" },
                { id_Status: 2, idDesc: "Resuelto" },
                { id_Status: 3, idDesc: "No aplica" }
            ]

            BodyHtml1 += `
                <div class="${inputs[i].class}">
                    <label for="${inputs[i].id}">${inputs[i].text}</label>
                    <input type = "date" id="${inputs[i].id}" class="form-control date" min = "${anio}" value="${anio}" max = "2025-12-31" />
                </div>          
                `;
        } else if (inputs[i].text == Requeridos() + "Fojas")
        {
            BodyHtml1 += `
                <div class="${inputs[i].class}">
                    <label for="${inputs[i].id}">${inputs[i].text}</label>
                    <input type="number" min ="0" class="form-control" id="${inputs[i].id}">
                </div>          
                `;

        }
        else if (inputs[i].text == Requeridos() + "Emisor Interno")
        {
            BodyHtml1 += `
                     <div class="${inputs[i].class}">
                        <label for="${inputs[i].id}">${inputs[i].text}</label>
                       <label style="float:right;"><input type="checkbox" class="radio" value="1" id="externo" name="fooby[1][]" /> Emisor Externo</label>
                        <select id="${inputs[i].id}" class="form-select"><option>Selecciona</option>`;

            for (var e = 0; e < UnidadAdmin.length; e++) {

                BodyHtml1 += `<option>${UnidadAdmin[e].nombre_completo}</option>`;

            }
            BodyHtml1 += `</select>
                    </div>
                    <inpi`;
        }
        else if (inputs[i].text == "Estatus") {
            BodyHtml1 += `
                     <div class="${inputs[i].class}">
                        <label for="${inputs[i].id}">${inputs[i].text}</label>
                        <select id="${inputs[i].id}" class="form-select">`;
            for (var e = 0; e < Status.length; e++) {

                BodyHtml1 += `<option>${Status[e].idDesc}</option>`;

            }
            BodyHtml1 += `</select>
                    </div>
                    `;
        } else if (inputs[i].text == Requeridos() + "Soporte") {
            BodyHtml1 += `
                     <div class="${inputs[i].class}">
                        <label for="${inputs[i].id}">${inputs[i].text}</label>
                        <select id="${inputs[i].id}" class="form-select" name="suport[]" multiple="multiple">`;
            for (var e = 0; e < soporteDocumental.length; e++) {

                BodyHtml1 += `<option>${soporteDocumental[e].idDesc}</option>`;

            }
            BodyHtml1 += `</select>
                    </div>
                    `;
        } else if (inputs[i].text == Requeridos() + "Emisor Interno") {
            $('input[type="checkbox"]').on('change', function () {
                $('input[name="' + this.name + '"]').not(this).prop('checked', false);
            });
           /* var UnidadAdmin = [
                { id_Inst: 0, idDescUA: "Selecciona" },
                { id_Inst: 1, idDescUA: "Primera Visita´duría General" },
                { id_Inst: 2, idDescUA: "Segunda Visita´duría General" },
                { id_Inst: 3, idDescUA: "Tercera Visita´duría General" }
            ]*/
            BodyHtml1 += `
                     <div class="${inputs[i].class}">
                        <label for="${inputs[i].id}">${inputs[i].text}</label>
                        <select id="${inputs[i].id}" class="form-select">`;
            BodyHtml1 += `<option>Selecciona</option>`;
            for (var e = 0; e < UnidadAdmin.length; e++) {

                BodyHtml1 += `<option>${UnidadAdmin[e].nombre_completo}</option>`;

            }
             BodyHtml1 += `</select>
                    </div>
                    <inpi`;
        } else if (inputs[i].text == " ") {
            /*
            BodyHtml1 += `
            <div class="${inputs[i].class}">
                <p>${inputs[i].text}</>
         <div class="form-group">
           <label><input type="checkbox" class="radio" value="1" id="externo" name="fooby[1][]" /> Emisor Externo</label>
        </div>
      

    </div>`;*/
        
        } else if (inputs[i].text =="Observaciones") {
            BodyHtml1 += `
            <div class="${inputs[i].class}">
                <p>${inputs[i].text}</>
         <div class="form-group">
            <textarea class="form-control" id="${inputs[i].id}" rows="3"></textarea>
        </div>
    </div>`;
        } else {
            BodyHtml1 += `
                <div class="${inputs[i].class}">
                    <label for="${inputs[i].id}">${inputs[i].text}</label>
                    <input class="form-control" id="${inputs[i].id}">
                </div>          
                `;
        }
        
    }
    BodyHtml1 += `</div>
    <div class="row">
         <div class="form-group mt-3">
            <button class="form-control button_registrar RegistrarDoc" id="AltaDoc" rows="3">Registrar</button>
        </div>
    </div>`;

    Contenedor.innerHTML = tituloRequeridos()+BodyHtml1;
    var ElementosHtml = ``;
    ElementosHtml += ` 
        <h5 class="modal-title">Alta de documentos</h5>`;
    ContenedorHeader.innerHTML = ElementosHtml;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////JJJJJJJJJMMMMMMM

    $("#AltaDoc").off("click").on("click", RegistrarDocumento);

    //document.getElementById("AltaDoc").addEventListener("click", function (event) {
    //    event.preventDefault(); // Evita el envío del formulario por defecto

    //    // Verificar cada campo
    //    let allValid = true;
    //    inputs.forEach(input => {
    //        const field = document.getElementById(input.id);
    //        if (field && field.value.trim() === "") {
    //            console.log("Campo vacío: " + input.id);
    //            allValid = false;
    //        }
    //    });

    //    if (allValid) {
    //        Swal.fire({
    //            title: 'Éxito',
    //            text: 'Documento registrado correctamente.',
    //            icon: 'success',
    //            confirmButtonText: 'Cerrar'
    //        });
    //        console.log("Todos los campos están llenos. Procediendo con el registro.");
    //        // Aquí puedes continuar con el registro
    //    } else {
    //        Swal.fire({
    //            title: 'Advertencia',
    //            text: 'Por favor, llene todos los campos requeridos.',
    //            icon: 'warning',
    //            confirmButtonText: 'Cerrar'
    //        });
    //    }
    //});
    //cargarDocumento();
   

}
function RegistrarDocumento(event) {
    event.preventDefault();

    let campos = [
        "#idReferencia",
        "#idEmisor",
        "#idCargoEmisor",
        "#idInstitucion",
        "#idDescDoc",
        "#idFechaEmision",
        "#idFojas",
        "#idSoporte"
    ];

    let valid = true;

    campos.forEach(campo => {
        let valor = $(campo).val();

        if (!valor || valor.trim() === "" || (Array.isArray(valor) && valor.length == 0)) {
            console.log("Campo vacío:", campo);
            valid = false;
        }
    });

    if (!valid) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Por favor, llene todos los campos requeridos.',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'Éxito',
        text: 'Documento registrado correctamente.',
        icon: 'success'
    });

    console.log("Todo lleno → proceder a guardar");
}


function CargarDocumento() {
   
}
/** Editar un documento */
function EditarDocumento() {
    AltaDocumento();
    var inputNombre = document.getElementById("idReferencia");
    inputNombre.value = "datos";
    //$("#idSoporte").select2();

}
//elimina un documento
function DocEliminar(idDocumento, codig) {

    console.log("Codigo:", codig);

    Swal.fire({
        title: "¿Realmente quieres eliminar el documento: " + codig + "?",
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then(resultado => {

        if (!resultado.isConfirmed) {
            console.log("Operación cancelada");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/Home/DeleteDoct",
            data: {
                id: idDocumento,
                codigo_documento_: codig
            },
            dataType: "JSON",

            success: function () {
                console.log("Datos Eliminados Correctamente");

                // ❗ SOLO RECARGA LA TABLA UNA VEZ
                recargatablaDocumento();
                recargaTablaExpedientes();
            },
            error: function (xhr, status, error) {
                console.log("Error al eliminar:", error);
            }
        });

    });
}



function AggTablaExpedientes(anio_busqueda, siglasUA, id_Serie, tipobusqueda, serie) {
    tB = tipobusqueda;


    var rol = $('#rolu').text();
    console.log('rol de usuario: ' + rol);
    var titulos = [
        { "title": "Acciones", "targets": 0 },
        { "title": "Área", "targets": 1 },
        { "title": "Expediente", "targets": 2 },
        { "title": "Título", "targets": 3 },
        { "title": "Fecha de apertura", "targets": 4 },
        { "title": "Fecha de Cierre", "targets": 5 },
        { "title": "Ubicación", "targets": 6 },
        { "title": "Docs", "targets": 7 },
        { "title": "Fojas", "targets": 8 },
        { "title": "Tipo de Archivo", "targets": 9 }

    ];

    $.ajax({
        type: "POST",
        url: "/Home/ObtenerExpedientes",
        data: { anio: anio_busqueda, ua: siglasUA, id_serie: id_Serie, idrol: rol },
        dataType: "JSON",
        success: function (expedientes) {

            if (tB == 1) {
                $(expedientes).each(function (index) {
                    arrayExps.push(expedientes[index]);
                });
            }

            //  console.log(arrayExps);

            const nombreTabla = '#tbl-' + id_Serie;

            // 🔥 SI YA EXISTE, SE DESTRUYE COMPLETA
            if ($.fn.DataTable.isDataTable(nombreTabla)) {
                $(nombreTabla).DataTable().clear().destroy();
                $(nombreTabla + ' thead tr.filters').remove(); // elimina headers clonados
            }

            //$.fn.dataTable.moment('DD/MM/YYYY');
            var table = $(nombreTabla).DataTable({
                language: {
                    sProcessing: "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar",
                    "sUrl": "",
                    "sInfoThousands": "",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                iDisplayLength: 50,
               /* retrieve: true,*/
                data: expedientes,
                orderCellsTop: true,
                fixedHeader: false,
                responsive: true,
                columnDefs: titulos,
                columns: [

                    {
                        data: null,
                        defaultContent:
                            '<div class="action-buttons">' +
                            '<a class="pdf"><img src="img/pdf_acrobat.png" width="30px"/></a> ' +
                            '<a class="edit"><i class="fa fa-pencil"></i></a> ' +
                           /* '<a class="remove" ><i class="fa fa-trash"></i></a> ' +*/
                            '</div>',
                        className: 'row-edit dt-center',
                        orderable: false
                    },
                    { data: 'ua' },
                    {
                        /*data: 'num_Exp',*/
                        'mRender': function (data, type, full) {
                            {
                                let iconaddEscrito = '';
                                if (full != null) {
                                    //elemento por defecto antes de modificación
                                    //iconaddEscrito = `<a class="link" data-toggle="modal" id="button_documento" data-target="ModalDocumento" onclick="VistaDocumentos">${full.num_Exp}</a>`;
                                    iconaddEscrito = `<a class="link ModalDocumentos" data-toggle="modal" id="button_documento" 
                                                       data-target="ModalDocumento" >${full.num_Exp}
                                                       <input type="hidden" id ="linkExpediente" value="${full.idExp}-<br>${full.num_Exp}"></input>
                                                       <input type="hidden" id ="fechaexpediente" value="${full.fecha_Inicio}"></input>
                                                       </a>
                                                       `;
                                    return iconaddEscrito;
                                }
                            }
                        },
                        className: 'row-edit dt-center',
                        orderable: false

                    },
                    { data: 'asunto' },
                    {
                        data: 'fecha_Inicio'
                        //render: DataTable.render.datetime('dd-MM-YYYY')
                    },
                    {
                        'mRender': function (data, type, full) {
                            // Verificar si hay legajos
                            let fechaCierre = '01/01/1999 12:00:00 AM';

                            if (full.legajos >= 1) {
                                //$(row).addClass('redClass'); // Opcional: asignar estilos si es necesario

                                if (full && full.fecha_Cierre !== '01/01/1999 12:00:00 AM') {
                                    fechaCierre = full.fecha_Cierre;
                                }
                            }

                            // Asignar la fecha de cierre

                            //let fechaCierre = full && full.fecha_Cierre !== '01/01/1999 12:00:00 AM'
                            //    ? full.fecha_Cierre
                            //    : '01/01/1999 12:00:00 AM'; // Establecer por defecto 01/01/1999

                            // Retornar la fecha asignada
                            return fechaCierre;
                        }
                    },
                    { data: 'ubicacion' },
                    {
                        'mRender': function (data, type, full) {
                            {

                                if (full.legajos == `0`) {
                                    //$(row).addClass('redClass');
                                }
                                let iconaddEscrito = '';
                                if (full != null) {
                                    //elemento por defecto antes de modificación
                                    //iconaddEscrito = `<a class="link" data-toggle="modal" id="button_documento" data-target="ModalDocumento" onclick="VistaDocumentos">${full.num_Exp}</a>`;
                                    iconaddEscrito = `${full.legajos}`;
                                    return iconaddEscrito;
                                }
                            }
                        }

                    },
                    { data: 'fojas' },

                    {
                        data: 'id_Estatus_Expediente_des',
                        render: function (data, type, full) {
                            let cellId = `tipo-archivo-${full.idExp}`;
                            if (type === 'filter' || type === 'sort') {
                                return full.id_Estatus_Expediente_des || '';
                            }
                            return `<span id="${cellId}">${full.id_Estatus_Expediente_des || "Cargando..."}</span>`;
                        },
                        className: 'tipo-archivo-col'
                    }
                ],
                order: [1, 'desc'],
                initComplete: function () {

                    // 🔥 AQUÍ SE QUITA EL "CARGANDO EXPEDIENTES..."
                    $('#div-tbl-' + id_Serie + ' .loader-serie-local').fadeOut(200, function () {
                        $(this).remove();
                    });

                    var table = $(nombreTabla).DataTable();
                    var table_length = table.data().count()
                    var trTabla = nombreTabla + ' thead tr';
                    var theadTabla = nombreTabla + ' thead';

                    console.log("longitud de filas:" + table_length);
                    //pintar de rojo el renglon si no tiene Documentos
                    for (var i = 0; i < table_length; i++) {
                        var row = table.row(i);
                        var documentos = row.data().legajos;
                        console.log(documentos);
                        if (documentos == "0") {
                            $(row.node()).css("background-color", "#f29f9c");
                        }
                    }

                    $(trTabla).clone(true).addClass('filters').appendTo(theadTabla);
                    //  Cargar tipos de archivo asíncronos después de renderizar ------JM --------BUSCA EL TIPO ARCHIVO
                    // Cargar tipos de archivo asíncronos después de renderizar
                    table.rows().every(function () {
                        var row = this;
                        var data = row.data();

                        if (data._tipoDocLoaded) return;
                        data._tipoDocLoaded = true;

                        let idExp = data.IdExp || data.idExp;

                        if (typeof obtenerEstatusExpediente === "function" && idExp) {
                            obtenerEstatusExpediente(idExp, function (tipoDoc) {
                                // 1. Actualizamos el objeto de datos en memoria sin disparar el redibujo
                                data.Id_Estatus_Expediente_des = tipoDoc;
                                data.id_Estatus_Expediente_des = tipoDoc;

                                // 2. Actualizamos ÚNICAMENTE el texto en el DOM (esto evita que el navegador se trabe)
                                $(`#tipo-archivo-${idExp}`).text(tipoDoc);

                                // ❌ ELIMINAMOS table.draw(false); para que la paginación fluya suavemente
                            });
                        }
                    });

                    /** Evento update para cada tr*/
                    $(nombreTabla + ' tbody').on('click', 'a.edit', function (e) {
                        e.preventDefault();

                        let tr = $(this).closest('tr');

                        // 🔥 SOPORTE PARA DATATABLE RESPONSIVE
                        if (tr.hasClass('child')) {
                            tr = tr.prev();
                        }

                        let data = table.row(tr).data();

                        if (!data) {
                            console.error("No se pudo obtener la data para editar");
                            return;
                        }

                        let rolu = $('#rolu').text().trim();
                        let tipoArchivo = data.tipoDoc;
                        let fechaIci = data.fecha_inicio;

                        console.log("Rol:", rolu);
                        console.log("TipoDoc:", tipoArchivo);
                        console.log("Fecha Inicio:", fechaIci);

                        // 🚫 Bloqueo
                        if (rolu === "Capturista" && tipoArchivo === "En concentración") {
                            Swal.fire({
                                title: 'Acceso denegado',
                                text: 'No se pueden editar expedientes en concentración.',
                                icon: 'error',
                                confirmButtonText: 'Cerrar'
                            });
                            return;
                        }

                        // ✅ Editar
                        SelectExpediente(data, anio_busqueda, tr);
                    });

                    // Evento para generar PDF
                    $(nombreTabla + ' tbody').on('click', 'a.pdf', function (e) {
                        e.preventDefault();

                        let tr = $(this).closest('tr');

                        // 🔥 SOPORTE PARA DATATABLE RESPONSIVE
                        if (tr.hasClass('child')) {
                            tr = tr.prev();
                        }

                        let data = table.row(tr).data();

                        if (!data) {
                            console.error("No se pudo obtener la data para generar PDF");
                            return;
                        }

                        if (!data.idExp || !data.num_Exp) {
                            console.error("Data incompleta para PDF:", data);
                            return;
                        }

                        let url = `${ExportaDocumento}?idexp=${data.idExp}&expediente=${data.num_Exp}`;
                        window.open(url, '_blank');

                        console.log("PDF URL:", url);
                    });

                    /**DELETE PARA EXPEDIENTE*/
                    $(nombreTabla + ' tbody').on('click', 'a.remove', function (e) {
                        e.preventDefault();

                        let tr = $(this).closest('tr');
                        if (tr.hasClass('child')) tr = tr.prev();

                        let data = table.row(tr).data();
                        if (!data) return;

                        DeleteExpedientes(data, tr);
                    });

                    console.log($(trTabla + ':eq(1) th').each(function (i) {
                        var title = $(this).text(); //Obtenemos el nombre de la columna
                        // Reemplazamos el contenido de la celda con un control de búsqueda (input) con el título

                        //de la columna como marcador de posición (placeholder)
                        $(this).html('<input type="text" placeholder="' + title + '" />');
                        // Agregamos un evento a los controles de búsqueda para que se dispare cuando el usuario escriba o cambie el valor
                        $('input', this).on('click', function (e) {
                            // Prevenimos la propagación del evento click para evitar que active el ordenamiento
                            e.stopPropagation();
                        }).off('keyup change')
                            .on('change', function () {

                                // Si el valor del control de búsqueda es diferente al valor de búsqueda actual de la columna
                                if (table.column(i).search() !== this.value) {
                                    table
                                        .column(i)
                                        .search(this.value)
                                        .draw();

                                    console.log("Filtro aplicado en columna:", i);
                                    console.log("value: ", this.value);
                                }
                            }).on('keyup', function (e) {
                                e.stopPropagation();

                                var cursorPosition = this.selectionStart

                                $(this).trigger('change');
                                $(this)
                                    .focus()[0]
                                    .setSelectionRange(cursorPosition, cursorPosition);
                            });

                        $(this).removeClass('sorting');
                        $(this).removeClass('sorting sorting_desc sorting_asc');
                        $(this).off('click');
                    }));

                },
            });



            AltaExpediente(id_Serie, serie, siglasUA, anio_busqueda);



        }

    });

}


function obtenerEstatusExpediente(idExp, callback) {
    $.ajax({
        type: "POST",
        url: "/Home/EstatusExpediente",
        data: { IdExp: idExp },
        dataType: "JSON",
        success: function (response) {
            if (response.status === "OK") {
                console.log(`Expediente ${idExp}: Tipo de archivo obtenido ->`, response.tipoDoc);
                callback(response.tipoDoc);
            } else {
                console.warn(`Error al obtener el tipo de archivo para expediente ${idExp}`);
                callback("No disponible");
            }
        },
        error: function (xhr, status, error) {
            console.error(`Error en la solicitud AJAX para expediente ${idExp}:`, error);
            callback("Error al obtener");
        }
    });
}

function minimoMaximoFecha(minimo, maximo) { 
    /* Buscamos solo las etiquetas que tengan el atributo "max" en "hoy" */
    var min=""; 
    var max = "";
    console.log(minimo);

}
function AggFunBuscarInput(nombreBuscador, anio_busqueda, siglasUA, response, propiedades) {

    if (nombreBuscador != '#txtBuscadorG') {
        // 🔥 FIX: quitar eventos duplicados antes de volver a asignar
        $(nombreBuscador).off('keyup').on('keyup', function () {

            var dropdownList = document.querySelector("#dropdown-list");
            const text = $(nombreBuscador).val();
            var htmld = '';

            const palabraInput = text;
            const palabraClave = palabraInput.trim();

            const propiedadesABuscar = propiedades;
            const resultado = filtrarPorPalabraClaveEnPropiedades(response, palabraClave, propiedadesABuscar);
            var id_Serie = 0;
            var serie = '';

            // 💥 limpiar antes de volver a pintar
            dropdownList.innerHTML = "";

            if (resultado != "No se encontraron coincidencias.") {
                $(resultado).each(function (index) {
                    id_Serie = resultado[index].id_Serie;
                    serie = resultado[index].cod_Serie + ' ' + resultado[index].desc_Serie;

                    htmld += `
                         <div class="C-SerieExp accordion">
                          <div class="Opt heading" id="heading-${response[index].id_Serie}" style="background-color:${response[index].color}; color:${response[index].colorl};">
                              <div class="Opt-titulo">${resultado[index].cod_Serie} ${resultado[index].desc_Serie}</div>
                              <div class="lblContador">${resultado[index].cantExp}</div>
                          </div>
                          <div class="div-tbl-${id_Serie} C-Table contents" id="div-tbl-${id_Serie}">
                              <table id="tbl-${id_Serie}" class="display responsive" style="width:100%">
                                 <img class="button_alta" id="button_alta-${response[index].id_Serie}" onclick="altaexpedientedirecto(${id_Serie}, '${serie}', '${siglasUA}',${anio_busqueda})" src="img/NuevoArchivo.png">
                                  <thead></thead>
                                  <tbody></tbody>
                              </table>
                          </div>
                      </div>
                    `;

                    // 💥 destruir DataTable previo si existe
                    const nombreTabla = "#tbl-" + id_Serie;
                    if ($.fn.DataTable.isDataTable(nombreTabla)) {
                        $(nombreTabla).DataTable().clear().destroy();
                    }

                    AggTablaExpedientes(anio_busqueda, siglasUA, id_Serie, 0);
                });
            } else {
                htmld += `
                    <div class="Opt Vacio">
                        ${resultado}
                    </div>
                `;
            }

            dropdownList.innerHTML = htmld;
            AggFunVerTabla();
        });
    } else {
        // 🔥 FIX también en el buscador global
        $(nombreBuscador).off('keyup').on('keyup', function () {
            var dropdownList = document.querySelector("#dropdown-list");
            const text = $(nombreBuscador).val();
            var htmld = '';

            const palabraInput = text;
            const palabraClave = palabraInput.trim();

            const propiedadesABuscar = propiedades;
            const resultado = filtrarPorPalabraClaveEnPropiedades(response, palabraClave, propiedadesABuscar);

            // 💥 limpiar antes de volver a pintar
            dropdownList.innerHTML = "";

            if (resultado != "No se encontraron coincidencias.") {
                $(resultado).each(function (index) {
                    var id_Serie = resultado[index].id_Serie;

                    htmld += `
                    <div class="C-SerieExp accordion">
                      <div class="Opt heading" id="heading-${response[index].id_Serie}" style="background-color:${response[index].color}; color:${response[index].colorl};">
                            <div class="Opt-titulo">${resultado[index].cod_Serie} ${resultado[index].desc_Serie}</div>
                            <div class="lblContador">${resultado[index].cantExp}</div>
                        </div>
                        <div class="div-tbl-${id_Serie} C-Table contents" id="div-tbl-${id_Serie}">
                            <table id="tbl-${id_Serie}" class="display">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                `;

                    // 💥 destruir DataTable previo si existe
                    const nombreTabla = "#tbl-" + id_Serie;
                    if ($.fn.DataTable.isDataTable(nombreTabla)) {
                        $(nombreTabla).DataTable().clear().destroy();
                    }

                    AggTablaExpedientes(anio_busqueda, siglasUA, id_Serie, 0);
                });
            } else {
                htmld += `
                    <div class="Opt Vacio">
                        ${resultado}
                    </div>
                `;
            }

            dropdownList.innerHTML = htmld;
            AggFunVerTabla();
        });
    }
}

function filtrarPorPalabraClaveEnPropiedades(array, palabra, propiedades) {
    var objetosCoincidentes = array.filter(objeto =>
        propiedades.some(propiedad =>
            objeto[propiedad].toString().toLowerCase().includes(palabra.toLowerCase())
        )
    );

    return objetosCoincidentes.length > 0 ? objetosCoincidentes : 'No se encontraron coincidencias.';
}
function AggFunVerTabla() {
    $(".accordion").on("click", ".heading", function () {

        $(this).toggleClass("active").next().slideToggle();

        $(".contents").not($(this).next()).slideUp(300);

        $(this).siblings().removeClass("active");
    });
}
// se activa cuando el usuario escribe en el campo de búsqueda (#txtBuscadorG). 06/03/25 Adair
//Dentro de ella, se obtienen varios valores como el texto de búsqueda (text), siglas (siglasUA), y año de búsqueda (anio_busqueda). Dependiendo del valor seleccionado en los botones de radio
function buscador() {
    $("#txtBuscadorG").on("keyup", function () {
        var dropdownList = document.querySelector("#dropdown-list");
        const text = $('#txtBuscadorG').val();
        var siglasUA = $('#SiglasUA').text();
        var anio_busqueda = $('#cmbAnio').val();

        const palabraInput = text;
        const palabraClave = palabraInput.trim();

        var propiedades;

        // Función para actualizar el valor seleccionado
        function actualizarValorSeleccionado() {
            var radioBtnSeleccionado = document.querySelector('input[name="nameColumn"]:checked');
            var valorSeleccionado;

            if (radioBtnSeleccionado != null) {
                valorSeleccionado = radioBtnSeleccionado.value;
            } else {
                valorSeleccionado = "cTodos"; // Valor por defecto
            }
            return valorSeleccionado;
        }

        var valorSeleccionado = actualizarValorSeleccionado();

        switch (valorSeleccionado) {
            case "cod_Serie":
            case "desc_Serie":
                propiedades = [valorSeleccionado];
                AggFunBuscarInput('#txtBuscadorG', anio_busqueda, siglasUA, arraySeries, propiedades);
                actualizarDropdownList(dropdownList);
                break;

            case "cTodos":
                propiedades = ["num_Exp", "asunto", "fecha_Inicio", "fecha_Cierre", "ubicacion", "ua", "fojas", "id_Estatus_Expediente", "idExp", ""];
                var htmld =
                    `<div class="C-Table">    
                        <table id="tbl-Resultados" class="display" style="font-size:.85rem; width: 1100px;">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>`;
                dropdownList.innerHTML = htmld;
                dropdownList.classList.remove('show');
                dropdownList.classList.add('show');
                AggTablaBuscadorG(palabraClave, propiedades);
                break;

            case "idExp": // Filtro por "Por Docs"
                propiedades = ["legajos"]; // Usamos 'legajos' (o el campo que corresponda para contar los documentos)
                var htmld =
                    `<div class="C-Table">    
                        <table id="tbl-Resultados" class="display" style="font-size: .85rem; width: 1100px;">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>`;
                dropdownList.innerHTML = htmld;
                dropdownList.classList.remove('show');
                dropdownList.classList.add('show');
                // Filtrar por la cantidad de documentos, buscando aquellos con el número de documentos que contiene el expediente
                AggTablaBuscadorG(palabraClave, propiedades, "legajos"); // Pasamos el campo 'legajos' para filtrar
                break;

            default:
                propiedades = [valorSeleccionado];
                var htmld =
                    `<div class="C-Table">    
                        <table id="tbl-Resultados" class="display" style="font-size: .85rem; width: 1100px;">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>`;
                dropdownList.innerHTML = htmld;
                dropdownList.classList.remove('show');
                dropdownList.classList.add('show');
                AggTablaBuscadorG(palabraClave, propiedades);
                break;
        }
    });

    // Evento para actualizar el valor seleccionado cuando cambie la opción del radio button
    $('input[name="nameColumn"]').on("change", function () {
        $("#txtBuscadorG").keyup();
        $("#txtBuscadorG").val("").keyup(); // Ejecutar la búsqueda con el nuevo criterio

    });
}



//filtrarPorPalabra_Exps realiza el filtrado real de los datos. Adair 06/03/25
function filtrarPorPalabra_Exps(palabra, propiedades) {
    if (!arrayExps || !Array.isArray(arrayExps)) {
        return []; // Retorna un arreglo vacío si arrayExps no es válido
    }
    if (!propiedades || !Array.isArray(propiedades)) {
        return []; // Retorna un arreglo vacío si propiedades no es válido
    }
    if (!palabra || typeof palabra !== 'string') {
        return []; // Retorna un arreglo vacío si palabra no es válida
    }

    var objetosCoincidentes = arrayExps.filter(expedientes =>
        propiedades.some(propiedad =>
            expedientes[propiedad].toString().toLowerCase().includes(palabra.toLowerCase())
        )
    );

    return objetosCoincidentes;
}



//AggTablaBuscadorG muestra los resultados en una tabla con capacidades de búsqueda y filtrado adicionales. Adair 06/03/25
function AggTablaBuscadorG(palabra, propiedades) {
    var arrayExpsCoincidentes = filtrarPorPalabra_Exps(palabra, propiedades);

    var titulos = [
        { "title": "Tareas", "targets": 0 },
        { "title": "Area", "targets": 1 },
        { "title": "Expediente", "targets": 2 },
        { "title": "Titulo", "targets": 3 },
        { "title": "Fecha de apertura", "targets": 4 },
        { "title": "Fecha de cierre", "targets": 5 },
        { "title": "Ubicacion", "targets": 6 },
        { "title": "Docs", "targets": 7 },
        { "title": "Fojas", "targets": 8 },
        { "title": "Tipo de Archivo", "targets": 9 }
    ];

    var nombreTabla = '#tbl-Resultados';

    var table = $(nombreTabla).DataTable({
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar",
            sUrl: "",
            sInfoThousands: "",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        iDisplayLength: 10,
        data: arrayExpsCoincidentes,
        responsive: true,
        fixedHeader: false,
        retrieve: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        columnDefs: titulos,
        columns: [
            {
                data: null,
                defaultContent: '<div class="action-buttons">' +
                    '<a class="pdf"><i class="fa-regular fa-file-pdf"></i></a> ' +
                    '<a class="edit"><i class="fa fa-pencil"></i></a> ' +
                   /* '<a class="remove"><i class="fa fa-trash"></i></a> ' +*/
                    '</div>',
                className: 'row-edit dt-center',
                orderable: false
            },
            { data: 'ua' },
            {
                'mRender': function (data, type, full) {
                    if (full != null) {
                        return `<a class="link ModalDocumentos" data-toggle="modal" id="button_documento" 
                                data-target="ModalDocumento" >${full.num_Exp}
                                <input type="hidden" id="linkExpediente" value="${full.idExp}-<br>${full.num_Exp}"></input>
                                </a>`;
                    }
                }
            },
            { data: 'asunto' },
            { data: 'fecha_Inicio' },
            { data: 'fecha_Cierre' },
            { data: 'ubicacion' },
            {
                'mRender': function (data, type, full) {
                    return full ? `${full.legajos}` : '';
                }
            },
            { data: 'fojas' },
            { data: 'id_Estatus_Expediente_des' }
        ],
        order: [1, 'desc'],
        bDestroy: true,
        initComplete: function () {
            var trTabla = nombreTabla + ' thead tr';
            var theadTabla = nombreTabla + ' thead';

            // Evento para editar expediente
            $(nombreTabla + ' tbody').on('click', 'a.edit', function () {
                var data = table.row($(this).parents('tr')).data();
                SelectExpediente(data, anio_busqueda);
            });

            // Evento para generar PDF
            $(nombreTabla + ' tbody').on('click', 'a.pdf', function () {
                var data = table.row($(this).parents('tr')).data();
                window.open(ExportaDocumento + "?idexp=" + data.idExp + "&expediente=" + data.num_Exp, '_blank');
            });

            // Evento para eliminar expediente
            $(nombreTabla + ' tbody').on('click', 'a.remove', function (e) {
                e.preventDefault();

                let tr = $(this).closest('tr');
                if (tr.hasClass('child')) tr = tr.prev();

                let data = table.row(tr).data();
                if (!data) return;

                DeleteExpedientes(data, tr);
            });


            // Eliminar filtros previos si existen
            $(nombreTabla + ' thead tr.filters').remove();

            // Clonamos las filas del encabezado para agregar los filtros
            $(trTabla).clone(true).addClass('filters').appendTo(theadTabla);

            // Implementación de filtros en los encabezados
            $(trTabla + ':eq(1) th').each(function (i) {
                var title = $(this).text();
                $(this).html('<input type="text" placeholder="' + title + '" />');
                $('input', this).on('click', function (e) {
                    e.stopPropagation();
                }).off('keyup change')
                    .on('change', function () {
                        if (table.column(i).search() !== this.value) {
                            table.column(i).search(this.value).draw();
                        }
                    }).on('keyup', function (e) {
                        e.stopPropagation();
                        var cursorPosition = this.selectionStart;
                        $(this).trigger('change');
                        $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                    });

                $(this).removeClass('sorting');
                $(this).removeClass('sorting_desc');
                $(this).off('click');
            });
        }
    });
}

function mostrarModal(titulo, tema, autor, no_Ejemplares, categorias, fechaPublicacion, editorial, pagina, isbn) {
    modal.style.display = "block";
    document.getElementById("titulo").value = titulo;
    document.getElementById("Autor").value = autor;
    if (no_Ejemplares == "" || no_Ejemplares == null) {
        document.getElementById("No_Ejemplares").value = 0;
    } else {
        document.getElementById("No_Ejemplares").value = no_Ejemplares;
    }
    document.getElementById("Editorial").value = editorial;
    document.getElementById("tema").value = tema;
    document.getElementById("categorias").value = categorias;
    document.getElementById("fecha_de_publicacion").value = fechaPublicacion;
    document.getElementById("pagina").value = pagina;
    document.getElementById("isbn").value = isbn;

    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes //agrega cero si el menor de 10
    document.getElementById('fechaActual').value = ano + "-" + mes + "-" + dia;
}
function recargaTablaExpedientes(paso) {
    if ($('#cmbArea option:selected').val()) {
        var siglasUA = $('#cmbArea option:selected').val();
    }
    else
    {
        var siglasUA = $('#SiglasUA').text();
    }
     var anio_busqueda = $('#cmbAnio').val();

    $("div[class^='div-tbl-']").each(function (index) {
        if ($(this).css("display") == 'block') {
            var id_elemento = $(this).attr('id');
            console.log("ID del elemento:", id_elemento);

            var dividir = id_elemento.split('-');
            var idSerie = dividir[2];
            console.log("ID de serie:", idSerie);

            var HermanoDiv = $(this).siblings()[0];
            var serie_v = $(HermanoDiv).children()[0].innerHTML;
            var contadorExpedientes = parseInt($(HermanoDiv).children()[1].innerHTML, 10);
            console.log(contadorExpedientes, "jmNew");
            var rolu = $('#rolu').text();

            if (isNaN(contadorExpedientes)) {
                console.error("El contador no es un número válido.");
                return; // Salir si el contador es inválido
            }

            var serie = idSerie + " " + serie_v;

            // Limpiar el contenido del elemento
            $("#" + id_elemento).empty();

            // Generar la nueva tabla dinámica
            var complemento = `
                <table id="tbl-${idSerie}" class="display responsive" style="width:100%">
                    <img class="button_alta" id="button_alta-${idSerie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png"></button>
                    <thead></thead>
                    <tbody></tbody>
                </table>
            `;
            $("#" + id_elemento).html(complemento);

            // Actualizar el contador si el paso es "alta"
            if (paso === 'alta') {
                $(HermanoDiv).children()[1].innerHTML = contadorExpedientes + 1;

                if (parseInt($(HermanoDiv).children().eq(1).text()) >= 1) {
                    $(`#heading-${idSerie}`).css({
                        "background-color": "#20B1AE",
                        "color": "#fff"
                    });
                }
            }

            // Cargar datos en la tabla
            regresaSeriesDocumentales();
            AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie);
            
        }
    });
}

function recargatablaDocumento() {

    var exp = $("#Expediente").html();
    var arreglo = exp.split('<br>');
    var exp2 = arreglo[0];
    var exp3 = exp2.split('-')[0];

    AggTablaDocumentos(exp3, 1);

    const Contenedor = document.getElementById('VistaDocumentos');

    // 1) RECONSTRUIR HTML
    var BodyHtml1 = `
        <div class="C-Table">
            <h3 class="TitleListadoDocumentos">
                Documentos correspondientes al expediente:
                <label class="TitleExp" id="Expediente">${exp}</label>
            </h3><br>

            <img class="button_alta" id="button_alta" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoDoc.png">
            <img class="buttonSelDoc" id="buttonSelDoc" onclick="ejecutaBoton()" src="img/EliminaDoc.png">

            <table id="tbl-Doc" class="display" style="font-size:.85rem; width:1100px;">
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
    `;

    $("#VistaDocumentos").empty();


// SI NO EXISTE LA TABLA → ENTONCES LA CREAS (SOLO UNA VEZ)
Contenedor.innerHTML = BodyHtml1;

    // 4) MODALES
    $('#ModalEditarAgregar').modal('hide');
    AltaDocumento();
}




function Requeridos() {
    return '<span style="color: red;">*</span>';
}

function tituloRequeridos()
{
    return `<h6 style="font-size: small; font-style: italic; color: black; font-weight: bold; text-align: right;padding"><span style="color: red;">*</span> Campos Requeridos</h6>`;
}

function obtenerEstatusDesdeBD(idExp, callback) {
    $.ajax({
        type: "POST",
        url: "/Home/ObtenerEstatusExpediente", // Asegúrate que esta ruta exista
        data: { idExp: idExp },
        success: function (data) {
            if (callback) {
                callback(data.idStatus); // Devuelve el ID del estatus
                console.log(` Tipo de archivo ->`, data.idStatus);
            }
        },
        error: function () {
            console.error("Error al obtener el estatus del expediente.");
            if (callback) {
                callback(null); // En caso de error, puedes manejarlo
            }
        }
    });
}
