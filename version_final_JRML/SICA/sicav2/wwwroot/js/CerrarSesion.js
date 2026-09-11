document.getElementById('logoutButton').addEventListener('click', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Aquí podrías realizar alguna llamada AJAX para cerrar sesión en el backend si es necesario

    $.ajax({
        type: 'POST',
        url: '/Login/Salir',
        content: 'application/json; charset=utf-8',
        dataType: 'json',
        //data: JSON.stringify(data),
        success: function () {
            Swal.fire({
                title: 'Se ha cerrado correctamente la sesi\u00F3n',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/'; // Redirige al formulario de inicio de sesión
            });
        }
    });    
});