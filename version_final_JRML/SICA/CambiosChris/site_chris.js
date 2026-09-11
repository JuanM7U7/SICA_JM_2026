var arrayGeneral = [];
var arraySeries = [];
var arrayExps = [];
var arrayDoc = [];
var idDocumento = ""; 
var arreglosEliminados = []; 
var anio_busqueda = "";
var estatuscheckinsti = 0;
var soporteDocumental = [
    { id_Status: 0, idDesc: "Selecciona" },
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

  /*  DocEliminar();*/
    buscador();

    desactivarBuscadorGlobal(arraySeries);
    span.addEventListener("click", function () {
        $('#ModalPrueba').modal('hide');
    });

    spanD.addEventListener("click", function () {
        $('#ModalDocumento').modal('hide');
    });
    spanEditarAgregar.addEventListener("click", function () {
        $('#ModalEditarAgregar').modal('hide');
    });
    // Si el usuario hace click fuera de la ventana, se cierra.
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
        { idRbtn: "rbtn", value: "ubicacion", text: "Por Observaciones" },
        { idRbtn: "rbtn", value: "idExp", text: "Por Docs" },
        { idRbtn: "rbtn", value: "fojas", text: "Por Fojas" },
        { idRbtn: "rbtn", value: "id_Estatus_Expediente", text: "Por Tipo de Archivo" },
        { idRbtn: "rbtn", value: "cod_Serie", text: "Por Codigo Serie" },
        { idRbtn: "rbtn", value: "desc_Serie", text: "Por Descripción Serie" },
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

    if (array.length == 0) {
        $(txtBG).attr('disabled', 'disabled');
        
    } else {
        txtBG.removeAttribute('disabled');

    }
}

function contenedorpapa() {
    //var arregloBlanco = [];
    var contenedor = $("#C-DropDown");
    contenedor.html(crearDesgloce(CreaSelectLabel("cmbAnio", arregloanios())));
}

function crearDesgloce(contenido) {
    var contenedor = `
    <div class="dropdown">
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

function arregloanios() {
    var obj = new Object(); obj.idSelect = "2023"; obj.descripcion = "2023";
    var obj1 = new Object(); obj1.idSelect = "2022"; obj1.descripcion = "2022";
    var obj2 = new Object(); obj2.idSelect = "2021"; obj2.descripcion = "2021";
    var obj3 = new Object(); obj3.idSelect = "2020"; obj3.descripcion = "2020";
    var obj4 = new Object(); obj4.idSelect = "2019"; obj4.descripcion = "2019";


    var arreglo = [];

    arreglo.push(obj, obj1, obj2, obj3, obj4);
    return arreglo;
}


function regresaSeriesDocumentales() {
    txtBuscador.classList.add('hiddenBuscador');

    $('#cmbAnio').on('change', function () {
        //console.clear();
        arrayGeneral.length = 0;
        arrayExps.length = 0;
        arraySeries.length = 0;

        var siglasUA = $('#SiglasUA').text();
        anio_busqueda = $('#cmbAnio').val();

        $.ajax({
            type: "POST",
            url: "/Home/ObtenerSeries",
            data: { anio: anio_busqueda, siglas: siglasUA },
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
                            <div class="Opt heading">
                                <div class="Opt-titulo">${response[index].cod_Serie} ${response[index].desc_Serie}</div>
                                <div class="lblContador">${response[index].cantExp}</div>
                            </div>
                            <div class="div-tbl-${response[index].id_Serie} C-Table contents" id="div-tbl-${response[index].id_Serie}">
                                <table id="tbl-${response[index].id_Serie}" class="display responsive" style="width:100%">
                                <img class="button_alta" id="button_alta-${response[index].id_Serie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png"></button>
                                    <thead>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>`;

                        var serie = response[index].cod_Serie + " " + response[index].desc_Serie;
                        AggTablaExpedientes(anio_busqueda, siglasUA, response[index].id_Serie, 1, serie);

                       // var expserie = response[index].cod_Serie + " " + response[index].desc_Serie;
                        AltaExpediente(response[index].id_Serie, response[index].cod_Serie, siglasUA, anio_busqueda);
                    });
                    txtBuscador.classList.remove('hiddenBuscador');
                }

                dropdownList.innerHTML = htmld;

                dropdownList.classList.remove('show');
                void dropdownList.offsetWidth; // Forzar reflow para reiniciar la animación
                dropdownList.classList.add('show');

                AggFunVerTabla();

                var propiedades = ['cod_Serie', 'desc_Serie'];
                AggFunBuscarInput('#txtBuscador', anio_busqueda, siglasUA, response, propiedades);
            }
        });
    });
    //VistaDocumentos();
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
function AltaExpediente(id_serie, serie, siglas,anio) {
    var Inputs = [
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "serie_documental", labelText: "Serie documental", value: serie, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "asunto", labelText: "Asunto", value: "", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "", id: "checkMultianual", labelText: "Mualtianual", Bloqueo: false, type:"checkbox" },
        { divClass: "col-6", divClass2: "col-6", ClassLabel: "mt-2", classInput: "form-control", id: "fecha_inicio", labelText: "Fecha de inicio", id: "fecha_cierre", labelText2: "Fecha de cierre", value: "", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "estatus_expedientes", labelText: "Estatus de expedientes", value: "En trámite", Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "ubicacion_expediente", labelText: "Ubicación del expediente", value: "", Bloqueo: false },
    ];
    var Status = [
        { id_Status: 1, idDesc: "En trámite" },
        { id_Status: 2, idDesc: "En concentración(Sin transferencia)" },
        { id_Status: 3, idDesc: "Histórico(Sin transferencia)" },
        { id_Status: 4, idDesc: "Baja(Sin transferencia)" },
        { id_Status: 5, idDesc: "Otro(Sin transferencia)" }
    ]
    $("#button_alta-" + id_serie).on("click", function () {
        $('#ModalPrueba').modal('show');

        const Contenedor = document.getElementById('AltaExpediente');
        const BodyContainer = document.getElementById('contenidoModal');

        var contenidoNuevo = '';
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
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="date" max="hoy" class="${Inputs[i].classInput}" /></div>
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
        Contenedor.innerHTML = ElementosHtml;

        datosExpediente(id_serie, siglas);
        //BodyContainer.innerHTML = BodyHtml;
        document.querySelectorAll("input[type='date']")
            .forEach(elemento => {
                /* A cada elemento encontrado le asignamos el atributo "max" */
                elemento.min = anio+"-01-01";
                elemento.max = anio+"-12-31";
                elemento.value = anio + "-01-01";
            });

        $('#checkMultianual').on('change', function () {

            if ($(this).prop('checked') == true) {

                document.querySelectorAll("input[type='date']")
                    .forEach(elemento => {
                        /* A cada elemento encontrado le asignamos el atributo "max" */
                        elemento.removeAttribute("min");
                        elemento.removeAttribute("max");

                        $("#checkMultianual").removeAttr("min");
                        $("#checkMultianual").removeAttr("max");

                    });
            } else
            {
                document.querySelectorAll("input[type='date']")
                    .forEach(elemento => {
                        /* A cada elemento encontrado le asignamos el atributo "max" */
                        elemento.min = anio + "-01-01";
                        elemento.max = anio + "-12-31";

                    });
            }

        });

     
    });


}
function formularioSelect(data, anio, idexp, expediente) {
    console.log(data);                                                                      
    var fecha = data[0].fecha_Inicio;
    var partesFecha = fecha.split(' ')[0].split('/'); // Dividir la fecha y tomar solo la parte de la fecha (sin la hora)
    var fechaFormateada = "" + partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0] + ""; // Formatear como "dd/mm/yyyy"

    var fechaFin = data[0].fecha_Cierre;
    var partesFecha2 = fechaFin.split(' ')[0].split('/'); // Dividir la fecha y tomar solo la parte de la fecha (sin la hora)
    var fechaFormateada2 = "" + partesFecha2[2] + '-' + partesFecha2[1] + '-' + partesFecha2[0] + ""; // Formatear como "dd/mm/yyyy"

    /** */
    var Inputs = [
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "serie_documental", labelText: "Serie documental", value: data[0].serieD, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "numexpediente", labelText: "Número expediente", value: expediente, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "idExpediente", labelText: "ID del expediente", value: idexp, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "asunto", labelText: "Asunto", value: data[0].asunto, Bloqueo: false },
        { divClass: "col-6", divClass2: "col-6", ClassLabel: "mt-2", classInput: "form-control date", id: "fecha_inicio", labelText: "Fecha de inicio", id: "fecha_cierre", labelText2: "Fecha de cierre", value: "", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "estatus_expedientes", labelText: "Estatus de expedientes", value: "En trámite", Bloqueo: true },
        { divClass: "col-3", divClass2: "col-9", ClassLabel: "mt-2", classInput: "form-control", id: "ubicacion_expediente", labelText: "Ubicación del expediente", value: data[0].ubicacion, Bloqueo: false },
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
                contenidoNuevo += `
                    <div class="row mt-3">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p>
                        </div>
                        <div class="${Inputs[i].divClass2}">
                        <select id="${Inputs[i].id}" class="form-select" disabled>`;
                for (var e = 0; e < Status.length; e++) {
                    if (data[0].id_Estatus_Expediente == Status[e].id_Status) {
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

                contenidoNuevo += `
                <div class="row">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada}" min="1970-01-01" max="2050-12-31" disabled/></div>
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada2}"min="1970-01-01" max="2050-12-31" disabled/></div>
                    </div>
                `;
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
        <h5 class="modal-title">Edición de expediente "${data[0].num_Exp}" del año ${anio}</h5>`;

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
function formularioSelectDocs(data, UnidadAdmin,idDocumento,documento) {
    console.log(data);
    var fecha = data[0].fecha_Doc_Registrado;
    var partesFecha = fecha.split(' ')[0].split('/'); // Dividir la fecha y tomar solo la parte de la fecha (sin la hora)
    var fechaFormateada = "" + partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0] + ""; // Formatear como "dd/mm/yyyy"
    $("input:checkbox").on('click', function () {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
    /** */
    var idExpedienteF = $("#Expediente").text().split("-");
    var idexp = idExpedienteF[0];
    console.log(idexp);
    var numexp = idExpedienteF[1];
   
    var Inputs = [
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "num_exp", labelText: "Número de expediente", value: numexp, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "codigo_documento", labelText: "Código del documento", value: documento, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "id_documento", labelText: "ID del documento", value: idDocumento, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "referencia", labelText: "Referencia", value: data[0].referencias, Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "nombre_emisor", labelText: "Nombre del emisor", value: data[0].nombre_Cargo_Emisor, Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "cargo_emisor", labelText: "Cargo del emisor", value: data[0].cargo_Emisor, Bloqueo: false },
        //PRUEBAS PARA INPUT CHEKBOX Y SELECT
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-check-input", id: "idInt_Ext", labelText: " ", Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-select", id: "institución_emisor", labelText: "Instución emisora", value: data[0].institución_emisor, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "instText", labelText: "", value: data[0].institución_emisor, Bloqueo: false },

        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "desc_documento", labelText: "Descripción del documento", value: data[0].desc_documento, Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control",type:"date", id: "fecha_emision", labelText: "Fecha de emision", value: fechaFormateada, Bloqueo: false },
        //{ divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-1", classInput: "form-control", id: "id_tipo_documento", labelText: "Tipo de documento", value: data[0].id_tipo_documento, Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-1", classInput: "form-control", id: "fojas", labelText: "Fojas", value: data[0].fojas, Bloqueo: true },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "observaciones", labelText: "Observaciones", value: data[0].observaciones, Bloqueo: false },
        { divClass: "col-3", divClass2: "col-12", ClassLabel: "mt-2", classInput: "form-control", id: "soporte", labelText: "soporte", value: data[0].observaciones, Bloqueo: true },
    ];
    var Status = [
        { id_Status: 1, idDesc: "En trámite" },
        { id_Status: 2, idDesc: "En concentración(Sin transferencia)" },
        { id_Status: 3, idDesc: "Histórico(Sin transferencia)" },
        { id_Status: 4, idDesc: "Baja(Sin transferencia)" },
        { id_Status: 5, idDesc: "Otro(Sin transferencia)" }
    ]


    const Contenedor = document.getElementById('AltaExpediente');
    const BodyContainer = document.getElementById('contenidoModalDoc');
    /**
    const Contenedor = document.getElementById('VistaEditarAgregar');
    const BodyContainer = document.getElementById('contenidoModalEditarAgregar');
     */
   
    var contenidoNuevo = '';
    for (var i = 0; i < Inputs.length; i++) {
        if (Inputs[i].Bloqueo == true && Inputs[i].divClass == "col-3") {
            if (Inputs[i].labelText == "Estatus de expedientes") {
                contenidoNuevo += `
                    <div class="row mt-3">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p>
                        </div>
                        <div class="${Inputs[i].divClass2}">
                        <select id="${Inputs[i].id}" class="form-select" disabled>`;
                for (var e = 0; e < Status.length; e++) {
                    if (data[0].id_Estatus_Expediente == Status[e].id_Status) {
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
            }
            else if (Inputs[i].labelText == "Fojas") {
                contenidoNuevo += `
                <div class="${Inputs[i].divClass}">
                    <label for="${Inputs[i].id}">${Inputs[i].labelText}</label>
                    <input type="number" min ="0" class="form-control" id="${Inputs[i].id}">
                </div>          
                `;

            }
            //PRUEBAS INPUT
            else if (Inputs[i].labelText == "Instución emisora") {
                contenidoNuevo += `
                     <div class="${Inputs[i].divClass}">
                        <label for="${Inputs[i].id}">${Inputs[i].labelText}</label>
                        <select id="${Inputs[i].id}" class="form-select">`;
                contenidoNuevo += `<option>Selecciona</option>`;
                for (var e = 0; e < UnidadAdmin.length; e++) {

                    contenidoNuevo += `<option>${UnidadAdmin[e].nombre_completo}</option>`;

                }
                contenidoNuevo += `</select>
                    </div>
                    <inpi`;
            } else if (Inputs[i].labelText == "soporte") {
                contenidoNuevo += `
                     <div class="${Inputs[i].divClass}">
                        <label for="${Inputs[i].id}">${Inputs[i].labelText}</label>
                        <select id="${Inputs[i].id}" class="form-select">`;
                contenidoNuevo += `<option>Selecciona</option>`;
                for (var e = 0; e < soporteDocumental.length; e++) {

                    contenidoNuevo += `<option>${soporteDocumental[e].idDesc}</option>`;

                }
                contenidoNuevo += `</select>
                    </div>
                    <inpi`;
            } else if (Inputs[i].labelText ==  " ") {
                $('input[type="checkbox"]').on('change', function () {
                    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
                });
                contenidoNuevo += `
            <div class="${Inputs[i].divClass}">
                <p>${Inputs[i].labelText}</>
         <div class="form-group">
           <label><input type="checkbox" class="radio" value="1" id="externo" name="fooby[1][]" />Externo</label>
        </div>
      

    </div>`;
            
            }
            else {
                contenidoNuevo += `
                <div class="row">
                    <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p></div>
                    <div class="${Inputs[i].divClass2}"><input id="${Inputs[i].id}" class="${Inputs[i].classInput}" value="${Inputs[i].value}" disabled/></div>
                </div>
                `;
            }

        } else {
            if (Inputs[i].divClass == "col-6") {

                contenidoNuevo += `
                <div class="row">
                        <div class="${Inputs[i].divClass}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText}</p><input id="fecha_inicio" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada}" min="1970-01-01" max="2050-12-31"/></div>
                        <div class="${Inputs[i].divClass2}"><p class="${Inputs[i].ClassLabel}">${Inputs[i].labelText2}</p><input id="fecha_cierre" type="date" class="${Inputs[i].classInput}" value="${fechaFormateada2}"min="1970-01-01" max="2050-12-31"/></div>
                    </div>
                `;
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
        <h5 class="modal-title">Edición de documentos</h5>`;

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
            <button class="form-control button_registrar" id="EditarD" rows="3">Editar</button>
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
            <button class="form-control button_registrar" id="EditarD">Editar</button>
        </div>
    </div>`;
    }


    BodyContainer.innerHTML = contenidoNuevo;
    Contenedor.innerHTML = ElementosHtml;

    updateDocumento();


}

function SelectExpediente(data,anio) {
    var num_exp = data.idExp;
    var expediente = data.num_Exp
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
                    if (resp) {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Actualizado',
                            icon: 'success',
                            confirmButtonText: 'cerrar'
                        }).then(function () {

                            var siglasUA = $('#SiglasUA').text();
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
    });

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


function updateDocumento() {
    $(document).ready(function () {
        $("#EditarD").on("click", function () {

            var num_exp = $("#num_exp").val();
            var codigo_documento = $("#codigo_documento").val();
            var referencia = $("#referencia").val();
            var nombre_emisor = $("#nombre_emisor").val();
            var cargo_emisor = $("#cargo_emisor").val();
            var institución_emisor = $("#institución_emisor").val();
            var desc_documento = $("#desc_documento").val();
            var id_tipo_documento = 99;
             id_tipo_documento = $("#id_tipo_documento").val();
            var fojas = $("#fojas").val();
            var observaciones = $("#observaciones").val();
            var idDocumento = $("#id_documento").val(); 

            var idExpedienteF = $("#Expediente").text().split("-");
            var idexp = idExpedienteF[0];
            console.log(idexp);
            var numexp = idExpedienteF[1];
            var documentoSelecciona = 1;

            var Horas1 = new Date()
            var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
            console.log(completo);
            var fecha_emision = $("#fecha_emision").val() + " " + completo;


            switch (id_tipo_documento) {
                case "Físico(Papel)":
                    documentoSelecciona = 1;
                    break;
                case "CD(Medio)":
                    documentoSelecciona = 2;
                    break;
                case "USB":
                    documentoSelecciona = 3;

                    break;

                default: 99
            }

/*
 * 
                { id: "num_exp", labelText: "Número de expediente", value: data[0].expediente, Bloqueo: true },
                { id: "codigo_documento", labelText: "codigo del documento", value: data[0].codigo_documento, Bloqueo: true },
                { id: "referencia", labelText: "referencia", value: data[0].referencias, Bloqueo: false },
                { id: "nombre_emisor", labelText: "Nombre emisor", value: data[0].nombre_Cargo_Emisor, Bloqueo: false },
                { id: "cargo_emisor", labelText: "cargo emisor", value: data[0].cargo_Emisor, Bloqueo: false },
                { id: "institución_emisor", labelText: "institución emisor", value: data[0].institución_emisor, Bloqueo: false },
                { id: "desc_documento", labelText: "desc documento", value: data[0].desc_documento, Bloqueo: false },
                { id: "fecha_emision", labelText: "fecha emision", value: fechaFormateada, Bloqueo: false },
                { id: "id_tipo_documento", labelText: "Tipo de documento", value: data[0].id_tipo_documento, Bloqueo: false },
                { id: "fojas", labelText: "fojas", value: data[0].fojas, Bloqueo: false },
                { id: "observaciones", labelText: "observaciones", value: data[0].observaciones, Bloqueo: false },*/


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
                    id_tipo_documento_: documentoSelecciona,
                    fojas_: fojas,
                    observaciones_: observaciones,
                    num_exp_: numexp,
                    id_documento :idDocumento
                },
                dataType: "JSON",

                success: function (resp) {
                    if (resp) {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Actualizado',
                            icon: 'success',
                            confirmButtonText: 'cerrar'
                        }).then(function () {
                            $("#ModalPrueba").modal('hide');
                            recargatablaDocumento();
                            recargaTablaExpedientes();
                            
                        });

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
//Función para guardar expedientes
function datosExpediente(id_serie, siglas) {
    $(document).ready(function () {
        $("#Registrar").on("click", function () {
            var serie_documental = $("#serie_documental").val();
            var asunto = $("#asunto").val();

            var Estatus = $("#estatus_expedientes").val();
            var ubicacion_expediente = $("#ubicacion_expediente").val();
            var observaciones = $("#observaciones").val();



            var Horas1 = new Date()
            var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
            console.log(completo);

            var fecha_inicio = $("#fecha_inicio").val() + " "+completo;
            var fecha_cierre = $("#fecha_cierre").val() + " " + completo;

            var data = {
                serieDocumental: serie_documental,
                asunto: asunto,
                fechaInicio: fecha_inicio,
                fechaCierre: fecha_cierre,
                estatus: Estatus,
                ubicacionExpediente: ubicacion_expediente,
                observacionesUsuario: observaciones,
                id_Serie: id_serie,
                siglas_UA: siglas
            }
            console.log(Estatus);
            console.log(id_serie);
            console.log("UA" + siglas);
            $.ajax({
                type: "POST",
                url: "/Home/AltaExpedientes",
                data: {
                    serieDocumental: serie_documental,
                    asunto: asunto,
                    fechaInicio: fecha_inicio,
                    fechaCierre: fecha_cierre,
                    Estatus: Estatus,
                    ubicacionExpediente: ubicacion_expediente,
                    observacionesUsuario: observaciones,
                    idSerie: id_serie,
                    UA: siglas

                },
                dataType: "JSON",

                success: function (resp) {
                    if (resp) {
                        Swal.fire({
                            title: 'Correcto',
                            text: 'Registro Correcto',
                            icon: 'success',
                            confirmButtonText: 'cerrar'
                        }).then(function () {
                            // Redirigir al usuario a la vista "Login" desde el controlador "LoinController"
                            //location.reload();      
                            //$("#tbl-201_wrapper").load(" #tbl-201_wrapper");
                            console.log("Hizo el cambio");

                            $("#ModalPrueba").modal('hide');
                            var siglasUA = $('#SiglasUA').text();
                            anio_busqueda = $('#cmbAnio').val();


                            $("div[class^='div-tbl-']").each(function (index) {

                                if ($(this).css("display") == 'block')
                                {
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
                                    addressContainer.innerHTML = addressContainer.innerHTML+complemento;
                                    $(HermanoDiv).children()[1].innerHTML = "";
                                    $(HermanoDiv).children()[1].innerHTML = parseInt(contadroExpedientes, 10)+ 1;
                                    //AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie);
                                   $("#" + id_elemento).load(  AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie));
                                }
                            });
                                    /*
                                    console.log($('#div-tbl-201').children('div')[0].innerHTML);
                                    var serie = $('#div-tbl-201').children('div')[0].innerHTML + " " + $('#div-tbl-201').children('div')[1].innerHTML;
                                    AggTablaExpedientes(anio_busqueda, siglasUA, $('#div-tbl-201').children('div')[0].innerHTML, 1, serie);*/

                        });
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
/**Funcion para eliminar expedientes*/
function DeleteExpedientes(data) {

    //data.fojas data.legajos
    console.log(data.legajos + " " + data.fojas);
    console.log(data);
    if (data.fojas == 0 && data.legajos == 0) {
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
                    },
                    dataType: "JSON",

                    success: function (resp) {
                        console.log(resp);
                        ; if (resp) {
                            Swal.fire({
                                title: 'Correcto',
                                text: 'El Expediente ha sido eliminado',
                                icon: 'success',
                                confirmButtonText: 'cerrar'
                            }).then(function () {

                                var siglasUA = $('#SiglasUA').text();
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
                                        $(HermanoDiv).children()[1].innerHTML = "";
                                        $(HermanoDiv).children()[1].innerHTML = parseInt(contadroExpedientes, 10) - 1;
                                        //AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie);
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
                        data: { id: value },
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
    $(document).on('click', '#button_documento', function () {
        console.log($(this));
        var exp = $(this).find("#linkExpediente").val();
        console.log(exp);
        var arreglo = exp.split('<br>');
        var exp2 = arreglo[0];
        var exp3 = exp2.split('-')[0];
        console.log(exp3);
        $('#ModalDocumento').modal('show');
        AggTablaDocumentos(exp3, 1);
        const Contenedor = document.getElementById('VistaDocumentos');
        /**Correccón en el expediente para homologar ${exp}*/
        var BodyHtml1 = `
                  
                        <div class="C-Table">
                        <h3 class="TitleListadoDocumentos">Documentos correspondientes al expediente: <label class="TitleExp" id= "Expediente">${exp}</label></h3> </br>
                        <img class="button_alta" id="button_alta" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoDoc.png"></button>
                            <img class="buttonSelDoc" id="buttonSelDoc" onclick="ejecutaBoton" src="img/EliminaDoc.png"></button>
                     
                            <table id="tbl-Doc" class="display" style="font-size: .85rem">
                                <thead>
                                </thead>
                                <tbody>
                                </tbody>
                            </table >
                        </div>
                    `;

        Contenedor.innerHTML = BodyHtml1;

        botonFuego = document.getElementById('buttonSelDoc');

        // Agregar evento a los botones
        botonFuego.addEventListener('click', ejecutaBoton);
        botonFuego = document.getElementById('BtnSeleccionar');

        console.log(exp);
        //Metodo para dar de alta un documento
        AltaDocumento("nombreTabla");
        /*DocEliminar();*/
        //botonFuego.addEventListener('click', DocEliminar);
        //botonFuego = document.getElementById('Eliminar_Doc');

    });

    $('#tbl-Doc tr').on('click', function (event) {
        event.preventDefault();
        var idtr = $(this).html();
        var arreglo = [];
        var arreglo1 = [];

        arreglo = idtr.split("<td>");
        console.log(arreglo);
        arreglo1 = arreglo[1].split("</td>");
        console.log(arreglo1);

        idDocumento = arreglo1[0];

        const table = new DataTable('#tbl-Doc');

        table.on('click', 'tbody tr', function (e) {
            e.currentTarget.classList.toggle('selected');
        });


    });
}


function SelectDocumentos(data,documento) {

    var numdocs = data;
    $(document).ready(function () {

        $.ajax({
            type: "POST",
            url: "/Home/SelectDocumentos",
            data: {
                numdoc: numdocs,
            },
            dataType: "JSON",

            success: function (resp) {
                if (resp) {
                    var documentoSelecciona = '';
                    /**Debe ser el id De documentos*/
                    $('#ModalPrueba').modal('show');
                    formularioSelectDocs(resp.doc, resp.ua, numdocs, documento);
                    //$('#institución_emisor option[value="' + resp.doc.institución_emisor +'"]').attr("selected", "selected");
                    //$('#soporte option[value="' + resp.doc.id_tipo_documento + '"]').attr("selected", "selected");
                    console.log(resp);
                    console.log("Institucion Responsable: " + resp.doc[0].institución_emisor);
                    console.log("Soporte: " + resp.doc[0].id_tipo_documento);
                    $('#institución_emisor').val(resp.doc[0].institución_emisor);
                    switch (resp.doc[0].id_tipo_documento) {
                        case 1:
                            documentoSelecciona = "Físico(Papel)";
                            break;
                        case 2:
                            documentoSelecciona = "CD(Medio)";
                            break;
                        case 3:
                            documentoSelecciona = "USB";
                            
                            break;

                        default:"Selecciona"
                    }
                    $('#soporte').val(documentoSelecciona);
                 
                }
                else {

                }
            }
        });
    });
}

//aqui comienza la tabla de documentos
function AggTablaDocumentos(expedientet, tipobusqueda) {

    tB = tipobusqueda;
    seleccionables = '<div>Seleccionar todo:<input type="checkbox"  class="BtnSeleccionar" id="BtnSeleccionar" onclick="SeleccionaTodoCheck()" value=""> </div>';


    var titulos = [
        { "title": seleccionables, "targets": 0 },
        { "title": "Acciones", "targets": 1 },
        { "title": "Área", "targets": 2},
        { "title": "ID del documento", "targets": 3 },
        { "title": "Código del documento", "targets": 4 },
        { "title": "Descripción del documento", "targets": 5 },
        { "title": "Fecha del documento registrado", "targets": 6 },
        { "title": "Nombre y cargo del emisor", "targets": 7 },
        { "title": "Referencias", "targets": 8 },
        { "title": "Fojas", "targets": 9 },
        { "title": "Legajos", "targets": 10 },
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
             
                iDisplayLength: 10,
                retrieve: true,
                data: documentos,
                orderCellsTop: true,
                fixedHeader: true,
                responsive: true,
                columnDefs: titulos,
                columns: [
                    {
                       'mRender': function (data, type, full) {
                            {
                                let iconaddEscrito = '';
                                  if (full != null) {
                                      iconaddEscrito = `<input type="checkbox" id="cbox2" class="selected" value="${full.expediente}" />`;
                                    return iconaddEscrito;
                                }
                            }
                        },
                        className: 'row-edit dt-center',
                        orderable: false

                    },
                    {
                        'mRender': function (data, type, full) {
                            {
                                let iconaddEscrito = '';
                                if (full != null) {
                                    iconaddEscrito = `<div class="action-buttons">
                                        <a class="edit" onclick="SelectDocumentos(${full.expediente},'${full.desc_documento}')"><i class="fa fa-pencil"></i></a>
                                        <a class="Eliminar_Doc" id="Eliminar_Doc"  onclick="DocEliminar(${full.expediente})"><i class="fa fa-trash" ></i></a>
                                        </div>`;
                                    return iconaddEscrito;
                             
                                }
                            }
                        },
                        className: 'row-edit dt-center',
                        orderable: false
                    },
                    { data: 'area' },
                    { data: 'expediente' },
                    { data: 'desc_documento' },
                    { data: 'codigo_documento'},
                    { data: 'fecha_Doc_Registrado' },                    
                    { data: 'nombre_Cargo_Emisor' },
                    { data: 'referencias' },
                    { data: 'fojas' },
                    { data: 'legajos' },
                ],
                order: [1, 'desc'],
                initComplete: function () {
                    var trTabla = nombreTabla + ' thead tr';
                    var theadTabla = nombreTabla + ' thead';

                    $(trTabla).clone(true).addClass('filters').appendTo(theadTabla);

                    $(trTabla + ':eq(1) th').each(function (i) {
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
                        $(this).removeClass('sorting_desc');
                        $(this).off('click');
                    });

                },
            });
        }
    });
}

/** Alta de documentos */
function AltaDocumento(id_expediente) {
    //console.log("expediente:"+id_expediente);
    $("#button_alta").on("click", function () {
        $('#ModalEditarAgregar').modal('show');
        
    });

    $.ajax({
        type: "POST",
        url: "/Home/SelectUA",
        dataType: "JSON",
        success: function (data) {
            var fecha = anio_busqueda + "-01-01";
            console.log(data);
            ModalAltaEditarDocumentos(fecha, data);
          
            $("#instText").hide();
            checkExterno();
        },
        error: function (xhr, status, error) {

        }
    })

    /*AQUI*/
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



function altaDocumentoChris()
{
    $(document).on('click', '#AltaDoc', function () {
        var idExpediente = $("#Expedientem").html();
        var idExpedienteF = $("#Expediente").text().split("-");
        var idexp = idExpedienteF[0];
        console.log(idexp);
        console.log(idExpedienteF[1]);
        var referencia = $("#idReferencia").val();
        var emisor = $("#idEmisor").val();
        var cargoEmisor = $("#idCargoEmisor").val();
        var institucion = "";

        if ($("#idInstitucion").text() != "Selecciona") {
            institucion = $("#idInstitucion").val();
        } else
        {
            institucion = $("#instText").val();

        }
        var descripcionDocumento = $("#idDescDoc").val();
     
        var estatus = estatuscheckinsti;
        var fojas = $("#idFojas").val();
        var soporte = $("#idSoporte").val();
        var observacione = $("#idObservaciones").val();


        var Horas1 = new Date()
        var completo = Horas1.getHours() + ":" + Horas1.getMinutes() + ":" + Horas1.getSeconds();
        console.log(completo);
        var fechaEmision = $("#idFechaEmision").val() + " " + completo;


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
                if (resp) {
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
}

      

function ModalAltaEditarDocumentos(anio, UnidadAdmin) {

    $("input:checkbox").on('click', function () {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
    
    let inputs = [
        { class: "col-12", id: "idReferencia", text: "Referencia"},
        { class: "col-12", id: "idEmisor", text: "Nombre del emisor"},
        { class: "col-12", id: "idCargoEmisor", text: "Cargo del emisor" },
        { class: "col-12 ", id: "idInt_Ext", text: " " },
        { class: "col-12", id: "idInstitucion", text: "Emisor Interno" },
        { class: "col-12", id: "instText", text: "" },
        { class: "col-12", id: "idDescDoc", text: "Descripción del documento" },
        { class: "col-12", id: "idFechaEmision", text: "Fecha de emisión" },
        //{ class: "col-6", id: "idEstatus", text: "Estatus" },
        { class: "col-6 numeric", id: "idFojas", text: "Fojas" }, 
        { class: "col-12", id: "idSoporte", text: "Soporte" },
        { class: "col-12", id: "idObservaciones", text: "Observaciones" }
    ]
    const Contenedor = document.getElementById('contenidoModalEditarAgregar');
    const ContenedorHeader = document.getElementById('VistaEditarAgregar');
    var BodyHtml1 = `<div class="row StyleDocument">`;
    for (var i = 0; i < inputs.length; i++) {

        if (inputs[i].text == "Fecha de emisión") {
            var Status = [
                { id_Status: 1, idDesc: "En trámite" },
                { id_Status: 2, idDesc: "Resuelto" },
                { id_Status: 3, idDesc: "No aplica" }
            ]

            BodyHtml1 += `
                <div class="${inputs[i].class}">
                    <label for="${inputs[i].id}">${inputs[i].text}</label>
                    <input type = "date" id="${inputs[i].id}" class="form-control date" min = "${anio}" value="${anio}" max = "2024-12-31" />
                </div>          
                `;
        } else if (inputs[i].text == "Fojas")
        {
            BodyHtml1 += `
                <div class="${inputs[i].class}">
                    <label for="${inputs[i].id}">${inputs[i].text}</label>
                    <input type="number" min ="0" class="form-control" id="${inputs[i].id}">
                </div>          
                `;

        }
        else if (inputs[i].text == "Emisor Interno")
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
        } else if (inputs[i].text == "Soporte") {
            BodyHtml1 += `
                     <div class="${inputs[i].class}">
                        <label for="${inputs[i].id}">${inputs[i].text}</label>
                        <select id="${inputs[i].id}" class="form-select">`;
            for (var e = 0; e < soporteDocumental.length; e++) {

                BodyHtml1 += `<option>${soporteDocumental[e].idDesc}</option>`;

            }
            BodyHtml1 += `</select>
                    </div>
                    `;
        } else if (inputs[i].text == "Emisor Interno") {
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

    Contenedor.innerHTML = BodyHtml1;
    var ElementosHtml = '';
    ElementosHtml += ` 
        <h5 class="modal-title">Alta de documentos</h5>`;
    ContenedorHeader.innerHTML = ElementosHtml;
    //cargarDocumento();
}
function CargarDocumento() {
   
}
/** Editar un documento */
function EditarDocumento(data) {
    AltaDocumento();
    var inputNombre = document.getElementById("idReferencia");
    inputNombre.value = "datos";

}
//elimina un documento
function DocEliminar(idDocumento) {
    $(".Eliminar_Doc").click(function () {
        var id_ = idDocumento;
        Swal.fire({
            title: "¿Realmente quieres eliminar el documento: " + id_ + "? ",
            text: "¿Eliminar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
            .then(resultado => {
                if (resultado.isConfirmed) {
                    $(".Eliminar_Doc").each(function () {
                        let value = id_;
                        $.ajax({
                            type: "POST",
                            url: "/Home/DeleteDoct",
                            data: { id: value },
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
                    console.log("Operación Cancelada");
                }
           });
    

    });
}

function AggTablaExpedientes(anio_busqueda, siglasUA, id_Serie, tipobusqueda,serie) {

    tB = tipobusqueda;

    var titulos = [
        { "title": "Acciones", "targets": 0 },
        { "title": "Área", "targets": 1 },
        { "title": "Expediente", "targets": 2 },
        { "title": "Título", "targets": 3 },
        { "title": "Fecha de Inicio", "targets": 4 },
        { "title": "Fecha de Cierre", "targets": 5 },
        { "title": "Observaciones", "targets": 6 },
        { "title": "Docs", "targets": 7 },
        { "title": "Fojas", "targets": 8 },
        { "title": "Tipo de Archivo", "targets": 9 }

    ];


    $.ajax({
        type: "POST",
        url: "/Home/ObtenerExpedientes",
        data: { anio: anio_busqueda, ua: siglasUA, id_serie: id_Serie },
        dataType: "JSON",
        success: function (expedientes) {

            if (tB == 1) {
                $(expedientes).each(function (index) {
                    arrayExps.push(expedientes[index]);
                });
            }

            console.log(arrayExps);

            const nombreTabla = '#tbl-' + id_Serie;
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
                iDisplayLength: 10,
                retrieve: true,
                data: expedientes,
                orderCellsTop: true,
                fixedHeader: true,
                responsive: true,
                columnDefs: titulos,
                columns: [

                    {
                        data: null,
                        defaultContent:
                            '<div class="action-buttons">' +
                            '<a class="pdf" href="#"><img src="img/pdf_acrobat.png" width="30px"/></a> ' +
                            '<a class="edit"><i class="fa fa-pencil"></i></a> ' +
                            '<a class="remove" ><i class="fa fa-trash"></i></a> ' +
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
                    { data: 'fecha_Inicio' },
                    { data: 'fecha_Cierre' },
                    { data: 'ubicacion' },
                    { data: 'legajos' },
                    { data: 'fojas' },
                    { data: 'id_Estatus_Expediente', }
                ],
                order: [1, 'desc'],
                initComplete: function () {
                    var trTabla = nombreTabla + ' thead tr';
                    var theadTabla = nombreTabla + ' thead';

                    $(trTabla).clone(true).addClass('filters').appendTo(theadTabla);
                    /** Evento update para cada tr*/
                    $(nombreTabla + ' tbody').on('click', 'a.edit', function () {
                        var data = table.row($(this).parents('tr')).data();
                        /**el id serie_sirve para traer el cadido y darlo de alta*/
                        //console.log("tabla" + id_Serie);
                        //console.log(data);
                        console.log(anio_busqueda);
                        SelectExpediente(data, anio_busqueda);
                    });

                    /**DELETE PARA EXPEDIENTE*/
                    $(nombreTabla + ' tbody').on('click', 'a.remove', function () {
                        var data = table.row($(this).parents('tr')).data();

                        //alert("hola");
                        DeleteExpedientes(data);
                    });
                    $(trTabla + ':eq(1) th').each(function (i) {
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
                        $(this).removeClass('sorting_desc');
                        $(this).off('click');
                    });

                },
            });

            AltaExpediente(id_Serie, serie, siglasUA, anio_busqueda);
           
  

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
        $(nombreBuscador).on('keyup', function () {

            var dropdownList = document.querySelector("#dropdown-list");
            const text = $(nombreBuscador).val();
            var htmld = '';

            const palabraInput = text;
            const palabraClave = palabraInput.trim();

            // Especificar en qué propiedades buscar la palabra clave
            const propiedadesABuscar = propiedades;
            // Obtener los objetos que coinciden con la palabra clave en las propiedades especificadas
            const resultado = filtrarPorPalabraClaveEnPropiedades(response, palabraClave, propiedadesABuscar);

            if (resultado != "No se encontraron coincidencias.") {
                $(resultado).each(function (index) {
                    var id_Serie = resultado[index].id_Serie;

                    htmld += `
                        <div class="C-SerieExp accordion">
                            <div class="Opt heading">
                                <div class="Opt-titulo">${resultado[index].cod_Serie} ${resultado[index].desc_Serie}</div>
                                <div class="lblContador">${resultado[index].cantExp}</div>
                            </div>
                            <div class="div-tbl-${id_Serie} C-Table contents" id="div-tbl-${id_Serie}">
                                <table id="tbl-${id_Serie}" class="display responsive" style="width:100%">
                                   <img class="button_alta" id="button_alta-${response[index].id_Serie}" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoArchivo.png"></button>
                                    <thead>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;

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
          //  VistaDocumentos();
        });
    } else {
        var dropdownList = document.querySelector("#dropdown-list");
        const text = $(nombreBuscador).val();
        var htmld = '';

        const palabraInput = text;
        const palabraClave = palabraInput.trim();

        // Especificar en qué propiedades buscar la palabra clave
        const propiedadesABuscar = propiedades
        // Obtener los objetos que coinciden con la palabra clave en las propiedades especificadas
        const resultado = filtrarPorPalabraClaveEnPropiedades(response, palabraClave, propiedadesABuscar);
        
        if (resultado != "No se encontraron coincidencias.") {
            $(resultado).each(function (index) {
                var id_Serie = resultado[index].id_Serie;

                htmld += `
                <div class="C-SerieExp accordion">
                    <div class="Opt heading">
                        <div class="Opt-titulo">${resultado[index].cod_Serie} ${resultado[index].desc_Serie}</div>
                        <div class="lblContador">${resultado[index].cantExp}</div>
                    </div>
                    <div class="div-tbl-${id_Serie} C-Table contents" id="div-tbl-${id_Serie}">
                        <table id="tbl-${id_Serie}" class="display">
                            <thead>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
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
       // VistaDocumentos();
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

function buscador() {
    $("#txtBuscadorG").on("keyup", function () {
        var dropdownList = document.querySelector("#dropdown-list");
        const text = $('#txtBuscadorG').val();
        var siglasUA = $('#SiglasUA').text();
        anio_busqueda = $('#cmbAnio').val();

        const palabraInput = text;
        const palabraClave = palabraInput.trim();

        var radioBtnSeleccionado = document.querySelector('input[name="nameColumn"]:checked');
        var valorSeleccionado;

        if (radioBtnSeleccionado != null) {
            valorSeleccionado = radioBtnSeleccionado.value;

        } else {
            valorSeleccionado = "cTodos";
        }

        var propiedades;
        

        switch (valorSeleccionado) {
            case "cod_Serie":
                propiedades = [valorSeleccionado];
                AggFunBuscarInput('#txtBuscadorG', anio_busqueda, siglasUA, arraySeries, propiedades);

                break;
            case "desc_Serie":
                propiedades = [valorSeleccionado];
                AggFunBuscarInput('#txtBuscadorG', anio_busqueda, siglasUA, arraySeries, propiedades);

                break;
            case "cTodos":
                propiedades = ["num_Exp", "asunto", "fecha_Inicio", "fecha_Cierre", "ubicacion", "ua", "legajos", "fojas", "id_Estatus_Expediente"];

                var htmld = `
                    <div class="C-Table">    
                        <table id="tbl-Resultados" class="display" style="font-size:.85rem">
                            <thead>
                            </thead>
                            <tbody>
                            </tbody>
                        </table >
                    </div>
                `;

                dropdownList.innerHTML = htmld;

                dropdownList.classList.remove('show');
                dropdownList.classList.add('show');

                AggTablaBuscadorG(palabraClave, propiedades);
                break;
            default:
                propiedades = [valorSeleccionado];

                var htmld = `
                    <div class="C-Table">    
                        <table id="tbl-Resultados" class="display" style="font-size: .85rem">
                            <thead>
                            </thead>
                            <tbody>
                            </tbody>
                        </table >
                    </div>
                `;

                dropdownList.innerHTML = htmld;

                dropdownList.classList.remove('show');
                dropdownList.classList.add('show');

                AggTablaBuscadorG(palabraClave, propiedades);
                break;

        }
    });
}

function filtrarPorPalabra_Exps(palabra, propiedades) {

    var objetosCoincidentes = arrayExps.filter(expedientes =>
        propiedades.some(propiedad =>
            expedientes[propiedad].toString().toLowerCase().includes(palabra.toLowerCase())
        )
    );

    return objetosCoincidentes;
}
function AggTablaBuscadorG(palabra, propiedades) {
    var arrayExpsCoincidentes = filtrarPorPalabra_Exps(palabra, propiedades);

    var titulos = [
        { "title": "Tareas", "targets": 0 },
        { "title": "Area", "targets": 1 },
        { "title": "Expediente", "targets": 2 },
        { "title": "Titulo", "targets": 3 },
        { "title": "Fecha de Inicio", "targets": 4 },
        { "title": "Fecha de Cierre", "targets": 5 },
        { "title": "Observaciones", "targets": 6 },
        { "title": "Docs", "targets": 7 },
        { "title": "Fojas", "targets": 8 },
        { "title": "Tipo de Archivo", "targets": 9 }
    ];

    var nombreTabla = '#tbl-Resultados';

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
        iDisplayLength: 10,
        data: arrayExpsCoincidentes,
        orderCellsTop: true,
        responsive: true,
        fixedHeader: true,
        retrieve: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        columnDefs: titulos,
        columns: [
            {
                data: null,
                defaultContent:
                    '<div class="action-buttons">' +
                    '<a class="pdf" href="#"><i class="fa-regular fa-file-pdf"></i></a> ' +
                    '<a class="edit"><i class="fa fa-pencil"></i></a> ' +
                    '<a class="remove"><i class="fa fa-trash"></i></a> ' +
                    '</div>',
                className: 'row-edit dt-center',
                orderable: false
            },
            { data: 'ua' },
            {
                data: 'num_Exp',
                defaultContent:
                    '<a class="action-buttons">' +   
                    '</a>',
                className: 'row-edit dt-center',
                orderable: false

            },
            { data: 'asunto' },
            { data: 'fecha_Inicio' },
            { data: 'fecha_Cierre' },
            { data: 'ubicacion' },
            { data: 'legajos' },
            { data: 'fojas' },
            { data: 'id_Estatus_Expediente' }
        ],
        order: [1, 'desc'],
        bDestroy: true,
        orderCellsTop: true,
        fixedHeader: true,
        initComplete: function () {
            var trTabla = nombreTabla + ' thead tr';
            var theadTabla = nombreTabla + 'thead';

            $(trTabla).clone(true).addClass('filters').appendTo(theadTabla);

            $(trTabla + ':eq(1) th').each(function (i) {
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
                $(this).removeClass('sorting_desc');
                $(this).off('click');
            });

        },
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



function recargaTablaExpedientes()
{
    var siglasUA = $('#SiglasUA').text();
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
            $("#" + id_elemento).load( AggTablaExpedientes(anio_busqueda, siglasUA, idSerie, 1, serie));
        }
    });
}

function recargatablaDocumento()
{
    
    console.log($("#button_documento"));
    // var exp = $("#button_documento").find("#Expediente").val();
    var exp = $("#Expediente").html();
    console.log(exp);
    var arreglo = exp.split('<br>');
    var exp2 = arreglo[0];
    var exp3 = exp2.split('-')[0];
    console.log(exp3);
   // $("#VistaDocumentos").load(AggTablaDocumentos(exp3, 1));

    AggTablaDocumentos(exp3, 1);

    const Contenedor = document.getElementById('VistaDocumentos');
    /**Correccón en el expediente para homologar ${exp}*/
    var BodyHtml1 = `
                  
                        <div class="C-Table">
                        <h3 class="TitleListadoDocumentos">Documentos correspondientes al expediente: <label class="TitleExp" id= "Expediente">${exp}</label></h3> </br>
                        <img class="button_alta" id="button_alta" data-toggle="modal" data-target="ModalPrueba" src="img/NuevoDoc.png"></button>
                            <img class="buttonSelDoc" id="buttonSelDoc" onclick="ejecutaBoton" src="img/EliminaDoc.png"></button>
                     
                            <table id="tbl-Doc" class="display" style="font-size: .85rem">
                                <thead>
                                </thead>
                                <tbody>
                                </tbody>
                            </table >
                        </div>
                    `;

    $("#VistaDocumentos").empty();

    Contenedor.innerHTML = BodyHtml1;
    
    $('#ModalEditarAgregar').modal('hide');

  
}
