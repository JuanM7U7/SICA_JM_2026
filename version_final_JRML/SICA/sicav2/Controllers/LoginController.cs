using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using sicav2.Models;
using System.Data;
using System.Net.Mail;
using System.Net.Security;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Net.NetworkInformation;

namespace sicav2.Controllers
{
    
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            var user = HttpContext.User;
            if(user.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        private bool regresa_validación_SMTP(string correo)
        {
            /*Metodo para validación de corrreo SMtP por medio del servidor de origen de la CDHPUEBLA */
            bool estatus = true;
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(correo);
            mail.To.Add(correo);
            mail.Subject = "Prueba";
            mail.Body = "Verificacion";
            SmtpClient smtpServer = new SmtpClient("mail.cdhpuebla.org.mx ", 587);//Servidor de Correos de la CDHP 
            smtpServer.Port = 587;
            smtpServer.Credentials = new NetworkCredential("informatica@cdhpuebla.org.mx", "Cdhp2024*-+") as ICredentialsByHost;//Correo que verifica por default el servidor
            smtpServer.EnableSsl = true;
            smtpServer.UseDefaultCredentials = false;

            ServicePointManager.ServerCertificateValidationCallback = delegate (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
            {
                return true;

            };

            try
            {
                smtpServer.Send(mail);//Prueba de envio de email 

            }

            catch (SmtpException error)
            {
                Console.WriteLine(error.ToString());
                estatus = false;
            }

            return estatus;
        }

        private Usuario ValidarUsuario(string _nom_usuario, string _pass)
        {
            //if (regresa_validación_SMTP(_nom_usuario))
            //{

                //@usuario varchar(20),@contrasenia varchar(20),@existencia int output
                try
                {

                    SqlConnection conn = Conector.Connection();

                    if (conn != null)
                    {
                        SqlCommand cmd = conn.CreateCommand();
                        cmd.Connection = conn;

                        cmd.CommandText = "Verificacion_Login_YHZ";
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar, 200);
                        cmd.Parameters[0].Value = _nom_usuario;
                        cmd.Parameters.Add("@contrasenia", SqlDbType.VarChar, 15);
                        cmd.Parameters[1].Value = _pass;
                        cmd.Parameters.Add("@existencia", SqlDbType.Int, 32);
                        cmd.Parameters[2].Direction = ParameterDirection.Output;

                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int, 32);
                        cmd.Parameters[3].Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@nombre", SqlDbType.VarChar, 50);
                        cmd.Parameters[4].Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@ape_paterno", SqlDbType.VarChar, 50);
                        cmd.Parameters[5].Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@ape_materno", SqlDbType.VarChar, 50);
                        cmd.Parameters[6].Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@id_usuario_rol", SqlDbType.Int, 32);
                        cmd.Parameters[7].Direction = ParameterDirection.Output;
                     
                        cmd.Parameters.Add("@id_unidad_administrativa", SqlDbType.Int, 32);
                        cmd.Parameters[8].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@rol_nombre", SqlDbType.VarChar, 25);
                    cmd.Parameters[9].Direction = ParameterDirection.Output;
                    //cmd.Parameters.Add("@rol", SqlDbType.Int, 32);
                    //cmd.Parameters[9].Direction = ParameterDirection.Output;

                    cmd.ExecuteNonQuery();

                        int existe = (int)cmd.Parameters[2].Value;

                        if (existe == 1)
                        {
                            //HttpContext.Session.SetInt32("Id_Usuario", (int)cmd.Parameters[3].Value);
                            //HttpContext.Session.SetString("Nombre", (string)cmd.Parameters[4].Value);
                            //HttpContext.Session.SetString("Ape_Paterno", (string)cmd.Parameters[5].Value);
                            //HttpContext.Session.SetString("Ape_Materno", (string)cmd.Parameters[6].Value);
                            //HttpContext.Session.SetInt32("Id_Rol", (int)cmd.Parameters[7].Value);
                            //HttpContext.Session.SetInt32("Id_Unidad_Administrativa", (int)cmd.Parameters[8].Value);

                            Usuario usuario = new Usuario
                            {
                                Id_Usuario = (int)cmd.Parameters[3].Value,
                                Nombre = (string)cmd.Parameters[4].Value,
                                Ape_Paterno = (string)cmd.Parameters[5].Value,
                                Ape_Materno = (string)cmd.Parameters[6].Value,
                                Nom_Usuario = _nom_usuario,
                                Pass = _pass,
                                Id_Usuario_Rol = (int)cmd.Parameters[7].Value,
                                Id_Unidad_Administrativa = (int)cmd.Parameters[8].Value,
                                Rol_nombre = (string)cmd.Parameters[9].Value

                            };
                            conn.Close();
                            return usuario;

                        }
                        else if (existe == -1)
                        {
                            ComprobarError(existe);
                            conn.Close();
                            return null;

                        }
                        else if (existe == -2)
                        {
                            ComprobarError(existe);
                            conn.Close();
                            return null;

                        }
                        else
                        {
                            conn.Close();
                            return null;

                        }
                    }
                    else
                    {
                        Console.WriteLine("Error al conectar a la base de datos");
                        conn.Close();
                        return null;

                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message.ToString());
                    return null;
                }
            //} else
            //{
            //    return null;
            //}
        }

        private IActionResult ComprobarError(int id_error)
        {
            if(id_error == -1)
            {
                TempData["swalMessage"] = "Verifica tu Usuario";
                TempData["swalTitle"] = "Datos de sesión incorrectos";
                TempData["swalIcon"] = "error"; //success, error, warning, info  
                TempData["swalButton"] = "OK";

                return View();

            } else if(id_error == -2)
            {
                TempData["swalMessage"] = "Verifica tu contraseña";
                TempData["swalTitle"] = "Datos de sesión incorrectos";
                TempData["swalIcon"] = "error"; //success, error, warning, info  
                TempData["swalButton"] = "OK";
                return View();

            } else
            {
                return View();
            }
        }

        private UnidadAdministrativa DatosUnidadAdministrativa(int id_ua)
        {
            try
            {
                int idClaim = id_ua;

                if (idClaim > 0)
                {
                    using SqlConnection conn = Conector.Connection();
                    if (conn != null)
                    {
                        SqlCommand cmd = conn.CreateCommand();
                        cmd.Connection = conn;

                        cmd.CommandText = "Datos_Unidad_Administrativa";
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@id_unidad_administrativa", id_ua).SqlDbType = SqlDbType.Int;
                        cmd.Parameters.Add("@Siglas", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@Nombre_Completo", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();

                        string siglas = cmd.Parameters["@Siglas"].Value?.ToString();
                        string nombreCompleto = cmd.Parameters["@Nombre_Completo"].Value?.ToString();

                        if (!string.IsNullOrEmpty(siglas) && !string.IsNullOrEmpty(nombreCompleto))
                        {
                            UnidadAdministrativa unidadAdministrativa = new UnidadAdministrativa
                            {
                                Id_Unidad_Administrativa = id_ua,
                                Siglas = siglas,
                                Nombre_completo = nombreCompleto
                            };

                            conn.Close();
                            return unidadAdministrativa;
                        }
                    }
                    else
                    {
                        conn.Close();
                        Console.WriteLine("Error al conectar a la base de datos");
                    }
                }
                else
                {
                    Console.WriteLine("El ID de la unidad administrativa no es válido");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return null;
        }

        [HttpPost]
        public async Task<IActionResult> Index(Usuario _usuario)
        {
            var usuario = ValidarUsuario(_usuario.Nom_Usuario, _usuario.Pass);
            
            if (usuario != null)
            {
                var _ua = DatosUnidadAdministrativa(usuario.Id_Unidad_Administrativa);

                var claims = new List<Claim> {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id_Usuario + ""),
                    new Claim(ClaimTypes.Name, usuario.Nombre + " " + usuario.Ape_Paterno + " " + usuario.Ape_Materno),
                    new Claim(ClaimTypes.Role, Convert.ToString(usuario.Id_Usuario_Rol)),
                    new Claim("Id_Administrativa", _ua.Id_Unidad_Administrativa + ""),
                    new Claim("Siglas", _ua.Siglas),
                    new Claim("Nombre_Completo", _ua.Nombre_completo),
                    new Claim("rol",usuario.Rol_nombre.ToString())
                    //new Claim("Correo", usuario.correo);
                    
                };

                //foreach(string rol in usuario.Id_Usuario_Rol)
                //{
                //    claims.Add(new Claim(ClaimTypes.Role, rol));
                //}

                var ClaimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(ClaimsIdentity));
                                
                TempData["swalTitle"] = "Bienvenido";
                TempData["swalIcon"] = "success"; //success, error, warning, info
                TempData["swalButton"] = "OK";

                return View();
            }
            else 
            {
                return View();
            }

        }

        public async Task<IActionResult> Salir()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Json(new { status = "" });
        }
    }
}
