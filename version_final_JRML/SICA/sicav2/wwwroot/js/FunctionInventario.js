var arregloTR = [];
var arregloAR = [];
var arregloSD = [];

$(document).ready(function () {
    $('#Image1').css('display', 'none');
    $("#AR").prop('disabled', true).val("0");
    $("#SD").prop('disabled', 'disabled');

    // ?? Botón Generar Reporte deshabilitado al iniciar
    $("#GeneraExcel").prop('disabled', true).css('background-color', 'lightgray');

    console.log("ready!");
    llenaArreglos();
    Arreglos();

    $("#TR").change(function () {
        const tipoReporte = $("#TR option:selected").val();

        if (tipoReporte === "0") {
            // ?? Cuando no se ha elegido ningún tipo de reporte
            $("#AR").prop('disabled', true).val("0");
            $("#SD").prop('disabled', true).empty();
            $("#GeneraExcel").prop('disabled', true).css('background-color', 'lightgray');
        }
        else if (tipoReporte === 'General') {
            $("#AR").removeAttr("disabled").val("0"); // limpia ?rea tambi?n
            $("#SD").prop('disabled', true).empty();
            $("#AR").prop('disabled', 'disabled');
            $("#SD").prop('disabled', 'disabled');
            $("#GeneraExcel").removeAttr("disabled");
            $('#GeneraExcel').css('background-color', 'darkblue');
        } else if (tipoReporte === 'Por_Area') {
            $("#AR").removeAttr("disabled").val("")
            // ?? Bloquear y limpiar SD cuando solo es por área
            $("#SD").prop('disabled', true).empty();/*.append('<option value="0">Selecciona</option>');*/
            // ?? Deshabilitar GeneraExcel hasta que elijan un área
            $("#GeneraExcel").prop('disabled', true).css('background-color', 'lightgray');

            //$("#GeneraExcel").removeAttr("disabled");
            //$('#GeneraExcel').css('background-color', 'darkblue');
        } else if (tipoReporte === 'Por_Area_Serie_Documental') {
            $("#AR").removeAttr("disabled").val("0"); // limpia área también
            $("#SD").prop('disabled', true).empty();
            $("#SD").removeAttr("disabled");
            $("#GeneraExcel").prop('disabled', 'disabled');
            $('#GeneraExcel').css('background-color', 'lightgray');
        } else {
            $("#AR").prop('disabled', 'disabled');
            $("#SD").prop('disabled', 'disabled');
        }
    });

    $("#SD").change(function () {
        const serieDoc = $("#SD option:selected").val();
        if (serieDoc === '' || serieDoc === 'Selecciona') {
            $("#GeneraExcel").prop('disabled', 'disabled');
            $('#GeneraExcel').css('background-color', 'lightgray');
        } else {
            $("#GeneraExcel").removeAttr("disabled");
            $('#GeneraExcel').css('background-color', 'darkblue');
        }
    });

    $("#AR").change(function () {
        const areaSeleccionada = $("#AR option:selected").val();
        const selectSD = $("#SD");
        let opciones = '<option value="0">Selecciona</option>';
        console.log(areaSeleccionada);
        console.log(urlListadoSeries);
        $.ajax({
            type: "POST",
            url: urlListadoSeries,
            data: { area: areaSeleccionada },
            dataType: "json",
            success: function (data) {
                if (data.mensaje === 'ok') {
                    data.lista.forEach(function (item) {
                        opciones += `<option value="${item.split('-')[0]}">${item}</option>`;
                    });
                    selectSD.empty().append(opciones);

                    // Si es Por_Area ? habilitar GeneraExcel directo
                     if ($("#TR option:selected").val() === 'Por_Area') {
                    $("#GeneraExcel").removeAttr("disabled").css('background-color', 'darkblue');
                    }
                    // Si el tipo de reporte es Por_Area_Serie_Documental ? habilitar SD
                    else if ($("#TR option:selected").val() === 'Por_Area_Serie_Documental') {
                        selectSD.prop("disabled", false);
                    }
                    
                }
            },
            error: function (data) {
                alert("Error al cargar las series documentales: " + data.mensaje);
                $('#Image1').css('display', 'none');
            }
        });
    });

    $("#GeneraExcel").click(function () {
        $('#Image1').css('display', 'block');
        const tipoReporte = $("#TR option:selected").val();
        const areaSeleccionada = $("#AR option:selected").val();
        const serieDoc = $("#SD option:selected").val();
        const rutaFisicaPorArea = "/Formatos/Inventario_Archivo_Documental_SICA_MODIF.xlsm";
        const rutaFisicaPorAreaSerieDocumental = "/Formatos/Inventario_Individual_Archivo_Documental_SICA.xlsm";
        const rutaFisicaGeneral = "/Formatos/Inventario_General_Archivo_Documental_SICA_MODIF.xlsm";

       
        // 1. Bloqueamos con el cargando animado
        Swal.fire({
            title: 'Generando Reporte...',
            html: '<div style="color: #ffffff; font-weight: bold; margin-top: -20px; font-size: 1.3em;">Procesando los registros. Por favor, espere a que inicie la descarga.</div>',
            text: undefined, // Apagamos el texto plano para usar el HTML con margen
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'sweet-transparente-sica'
            },
            didOpen: () => {
                Swal.showLoading(); // Muestra el spinner animado de SweetAlert

                // Eliminamos por completo la caja blanca y sus sombras
                $('.sweet-transparente-sica').css({
                    'background': 'transparent',
                    'background-color': 'transparent',
                    'box-shadow': 'none',
                    'border': 'none'
                });

                // Subimos el título principal y lo pintamos de blanco
                $('.swal2-title').css({
                    'color': '#ffffff',
                    'margin-top': '-80px', // Lo avienta hacia arriba de las manchas naranjas
                    'font-size': '2.3em',
                    'font-weight': 'bold'
                });

                // Ajustamos el spinner para que no tape las letras
                $('.swal2-loader').css({
                    'margin-top': '20px'
                });
            }
        });

        // 2. Definimos la ruta base y armamos el objeto con los datos exactos que espera C#
        let urlDestino = '/Home/GeneraExcelIndividual';
        let parametros = {};

        if (tipoReporte == "General") {
            urlDestino = '/Home/DescargarExcel';
            parametros = { rutaArchivo: rutaFisicaGeneral };
        } else if (tipoReporte == "Por_Area") {
            parametros = {
                rutaFisicaDocumento: rutaFisicaPorArea,
                tipoReporte: tipoReporte,
                ValorTipoReporte: [areaSeleccionada]
            };
        } else if (tipoReporte == "Por_Area_Serie_Documental") {
            parametros = {
                rutaFisicaDocumento: rutaFisicaPorAreaSerieDocumental,
                tipoReporte: tipoReporte,
                ValorTipoReporte: [areaSeleccionada, serieDoc]
            };
        }

        // 3. Ejecutamos el AJAX limpio por POST
        $.ajax({
            type: "POST",
            url: urlDestino,
            data: parametros, // 🌟 Pasamos los datos ordenados aquí para que no saturen la URL
            xhrFields: {
                responseType: 'blob' // Mantiene la recepción binaria para archivos pesados
            },
            success: function (blob, status, xhr) {
                Swal.close();
                $('#Image1').css('display', 'none');

                let filename = "";
                let disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                if (!filename) filename = `Reporte_${tipoReporte}.xlsx`;

                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                setTimeout(function () {
                    URL.revokeObjectURL(downloadUrl);
                    $(a).remove();
                }, 100);
            },
            error: function (xhr, status, error) {
                Swal.close();
                $('#Image1').css('display', 'none');
                Swal.fire('Error', 'Hubo un problema al generar o descargar el reporte.', 'error');
            }
        });
    });
});



function Arreglos() {
    Select(arregloTR);
    Select(arregloAR);
    Select(arregloSD);
}

function llenaArreglos() {
    arregloTR.push('Selecciona', 'General', 'Área', 'SerieDocumental');
}

function Select(arreglo) {
    arreglo.forEach(function (item) {
        console.log("Elemento:", item);
    });
}
