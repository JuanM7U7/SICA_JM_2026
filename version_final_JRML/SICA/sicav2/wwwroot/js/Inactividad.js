var currSeconds = 0;
var inactivityTime = 300000; // 5 minutes in milliseconds
//var inactivityTime = 5000; // 5 segundos in milliseconds

var inactivityTimer = setInterval(timerIncrement, 1000);
var logoutTimer = setInterval(regresaLogin, inactivityTime);

$(document).on('mousemove keypress', resetTimer);

function resetTimer() {
    currSeconds = 0;
}

function timerIncrement() {
    currSeconds += 1000;
}

function regresaLogin() {
    if (currSeconds >= inactivityTime) {
        clearInterval(inactivityTimer);
        clearInterval(logoutTimer);

        $.ajax({
            type: 'POST',
            url: '/Login/Salir',
            content: 'application/json; charset=utf-8',
            dataType: 'json',
            //data: JSON.stringify(data),
            success: function () {
                Swal.fire({
                    icon: 'info',
                    title: 'Tiempo de Inactividad Superado',
                    text: 'Han pasado 5 minutos de inactividad y tu sesi\u00F3n ha expirado. Por favor, vuelve a iniciar sesi\u00F3n.'
                }).then(function () {
                    // Redirigir al usuario a la vista "Login" desde el controlador "LoinController"
                    window.location.href = "/";

                })
            }
        });
    }
}