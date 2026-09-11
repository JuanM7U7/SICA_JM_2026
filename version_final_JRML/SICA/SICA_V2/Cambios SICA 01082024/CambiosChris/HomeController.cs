
using Microsoft.AspNetCore.Mvc;
using sicav2.Models;
using sicav2.Models.ModelsViews;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using Spire.Xls;
using System.Collections;
using System.IO;
using Rotativa.AspNetCore;

namespace sicav2.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private ListCounters s_a = new ListCounters();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult reporteInventario()
        {
            return View();
        }
        public ActionResult CaratulaPDF()

        {
            //return View();
            //return new CaratulaPDF("VerPDF");

            //var rpt = new ViewAsPdf();
            //rpt.ViewName = "CaratulaPDF";
            //rpt.PageSize = Rotativa.AspNetCore.Options.Size.Letter;
            //rpt.PageMargins.Left = 20;
            //rpt.PageMargins.Right = 20;
            //return rpt;

            return new ViewAsPdf("CaratulaPDF")
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 0 },

            };
        }


        [Authorize(Roles = "1")]
        public IActionResult Privacy()
        {
            return View();
        }

        public ActionResult DeleteDoct(int id)
        {
            Boolean Eliminado = false;
            using SqlConnection conn = Conector.Connection();
            if (conn != null)
            {
                SqlCommand cmd = conn.CreateCommand();
                cmd.Connection = conn;

                cmd.CommandText = "Delete_Documentos";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@id_documento", id).SqlDbType = SqlDbType.VarChar;

                cmd.ExecuteNonQuery();
                // Fill the DataSet.
                Eliminado = true;



            }
                return Json(new { Success = Eliminado });
        }

        //metodo abby
        //public async Task<IActionResult> Delete(int? @id)
        //{
        //    try
        //    {
        //        string s1 = "";
        //        string s2 = "";



        //        using SqlConnection conn = Conector.Connection();
        //        if (conn != null)
        //        {
        //            SqlCommand cmd = conn.CreateCommand();
        //            cmd.Connection = conn;

        //            cmd.CommandText = "Delete_Documentos";
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;

        //            cmd.Parameters.AddWithValue("@id_documento", id).SqlDbType = SqlDbType.VarChar;

        //            SqlDataAdapter adapter = new SqlDataAdapter();
        //            adapter.TableMappings.Add("Table", "DocumentosPorExp");

        //            adapter.SelectCommand = cmd;

        //            // Fill the DataSet.
        //            DataSet dataSet = new DataSet("Delete_Documentos");
        //            adapter.Fill(dataSet);
        //            List<Documentos> DocPorExp = new List<Documentos>();

        //            if (id == null)
        //            {
        //                return NotFound();
        //            }

        //            var user = await db.documentos
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //            if (user == null)
        //            {
        //                return NotFound();
        //            }



        //        }

        //            return View(user);

        //    }
        //} 


   

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        //Obtener Series
        public ActionResult ObtenerSeries(string siglas, string anio)
        {
            try
            {
                string s1 = "";
                string s2 = "";

                if (siglas.IsNullOrEmpty() && anio.IsNullOrEmpty())
                {
                    siglas = "";
                    anio = "";
                }
                else
                {
                    s1 = siglas;
                    s2 = anio;
                }

                using SqlConnection conn = Conector.Connection();

                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "LstSeries";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@ua", s1).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@anio_busqueda", s2).SqlDbType = SqlDbType.VarChar;


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "Series");

                    adapter.SelectCommand = cmd;

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("Series");
                    adapter.Fill(dataSet);
                    List<LstSerie> lstSeries = new List<LstSerie>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        lstSeries.Add(new LstSerie()
                        {
                            CantExp = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["cantidad"].ToString()),
                            Id_Serie = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["id_serie"].ToString()),
                            Cod_Serie = dataSet.Tables["Series"].Rows[r]["cod_serie"].ToString(),
                            Desc_Serie = dataSet.Tables["Series"].Rows[r]["desc_serie"].ToString(),
                            Siglas_UA = dataSet.Tables["Series"].Rows[r]["siglas_ua"].ToString()
                        });
                    }

                    return Json(lstSeries);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return null;
        }

        public ActionResult ObtenerSeriesPersonal (string siglas, string anio,string serie)
        {
            try
            {
                string s1 = "";
                string s2 = "";
                string se = "";

                if (siglas.IsNullOrEmpty() && anio.IsNullOrEmpty() && serie.IsNullOrEmpty())
                {
                    siglas = "";
                    anio = "";
                    serie = "";
                }
                else
                {
                    se = serie;
                    s1 = siglas;
                    s2 = anio;
                }

                using SqlConnection conn = Conector.Connection();

                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "LstSeries";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@ua", s1).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@anio_busqueda", s2).SqlDbType = SqlDbType.VarChar;


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "Series");

                    adapter.SelectCommand = cmd;

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("Series");
                    adapter.Fill(dataSet);
                    List<LstSerie> lstSeries = new List<LstSerie>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        lstSeries.Add(new LstSerie()
                        {
                            CantExp = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["cantidad"].ToString()),
                            Id_Serie = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["id_serie"].ToString()),
                            Cod_Serie = dataSet.Tables["Series"].Rows[r]["cod_serie"].ToString(),
                            Desc_Serie = dataSet.Tables["Series"].Rows[r]["desc_serie"].ToString(),
                            Siglas_UA = dataSet.Tables["Series"].Rows[r]["siglas_ua"].ToString()
                        });
                    }

                    return Json(lstSeries);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return null;
        }

        public ActionResult ObtenerExpedientes(string anio, string ua, int id_serie)
        {
            try
            {
                string s1 = "";
                string s2 = "";

                if (anio.IsNullOrEmpty() && ua.IsNullOrEmpty())
                {
                    anio = "";
                    ua = "";
                }
                else
                {
                    s1 = anio;
                    s2 = ua;
                }

                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "ExpPorSerieAnio";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@anio_busqueda", s1).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@ua", s2).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@id_serie", id_serie).SqlDbType = SqlDbType.Int;

                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "ExpPorCodSerie");

                    adapter.SelectCommand = cmd;

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("ExpPorCodSerie");
                    adapter.Fill(dataSet);
                    List<Expediente> ExpPorCodSerie = new List<Expediente>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        ExpPorCodSerie.Add(new Expediente()
                        {
                            IdExp = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["id_exp"].ToString()),
                            Num_Consec = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["num_consec"].ToString()),
                            Num_Exp = dataSet.Tables["ExpPorCodSerie"].Rows[r]["num_exp2"].ToString(),
                            Asunto = dataSet.Tables["ExpPorCodSerie"].Rows[r]["asunto"].ToString(),
                            Fecha_Inicio = dataSet.Tables["ExpPorCodSerie"].Rows[r]["fecha_inicio"].ToString(),
                            Fecha_Cierre = dataSet.Tables["ExpPorCodSerie"].Rows[r]["fecha_cierre"].ToString(),
                            Fojas = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["fojas"].ToString()),
                            Legajos = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["documentos"].ToString()),
                            Metros_Lineales = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["metros_lineales"].ToString()),
                            Ubicacion = dataSet.Tables["ExpPorCodSerie"].Rows[r]["ubicacion"].ToString(),
                            Revisado = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["revisado"].ToString()),
                            Eliminar = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["eliminar"].ToString()),
                            Firma = dataSet.Tables["ExpPorCodSerie"].Rows[r]["firma"].ToString(),
                            UA = dataSet.Tables["ExpPorCodSerie"].Rows[r]["siglas"].ToString(),
                            Id_Estatus_Expediente = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["id_estatus_expediente"].ToString()),
                            Id_Cadido = Convert.ToInt32(dataSet.Tables["ExpPorCodSerie"].Rows[r]["id_cadido"].ToString())
                        });
                    }

                    return Json(ExpPorCodSerie);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
        }


        public ActionResult ObtenerDocumentosPorExpediente(string expediente)
        {
            try
            {
                string s1 = "";
                string s2 = "";



                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "DocumentosPorExp";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@expediente", expediente).SqlDbType = SqlDbType.VarChar;

                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "DocPorExp");

                    adapter.SelectCommand = cmd;

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("DocPorExp");
                    adapter.Fill(dataSet);
                    List<Documentos> DocPorExp = new List<Documentos>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        DocPorExp.Add(new Documentos()
                        {
                            area = dataSet.Tables["DocPorExp"].Rows[r]["siglas"].ToString(),
                            Expediente = dataSet.Tables["DocPorExp"].Rows[r]["num_exp"].ToString(),
                            Desc_documento = dataSet.Tables["DocPorExp"].Rows[r]["codigo_documento2"].ToString(),
                            codigo_documento = dataSet.Tables["DocPorExp"].Rows[r]["desc_documento"].ToString(),
                            //Descripcion = dataSet.Tables["DocPorExp"].Rows[r]["desc_documento"].ToString(),
                            Fecha_Doc_Registrado = dataSet.Tables["DocPorExp"].Rows[r]["fecha_emision"].ToString(),
                            nombre_Cargo_Emisor = dataSet.Tables["DocPorExp"].Rows[r]["nombre_emisor"].ToString(),
                            Referencias = dataSet.Tables["DocPorExp"].Rows[r]["referencia"].ToString(),
                            Fojas = dataSet.Tables["DocPorExp"].Rows[r]["fojas"].ToString(),
                            Legajos = dataSet.Tables["DocPorExp"].Rows[r]["legajos"].ToString(),
                            //fecha_emision = dataSet.Tables["DocPorExp"].Rows[r]["fecha_emision"].ToString()
                        });
                    }

                    return Json(DocPorExp);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
             
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
        }
        // Función para guardar los expedientes...!
        public ActionResult AltaExpedientes(string serieDocumental, string asunto, DateTime fechaInicio, DateTime fechaCierre, int Estatus, string ubicacionExpediente, string observacionesUsuario, int idSerie, string UA)
        {
           string [] codigoSerie=new string[5];
            try
            {
                codigoSerie = serieDocumental.Split(' ');

                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Alta_Expedientes";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@serie_documental", codigoSerie[0].ToString()).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@asunto", asunto).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fecha_inicio", fechaInicio).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@fecha_cierre", fechaCierre).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@estatus", Estatus).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@ubicacion_expediente", ubicacionExpediente).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@observaciones_expediente", observacionesUsuario).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@siglas", UA).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@serieParaCadido", idSerie).SqlDbType = SqlDbType.Int;
                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = true });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { error = "Error" });
        }
        //funcion para actualizar Expediente, se debe buscar en base al campo id_exp de la tabla  expediente
        public ActionResult UpdateExpedientes(string num_exp, string asunto, DateTime fechaInicio, DateTime fechaCierre, int estatus, string ubicacionExpediente, string Observaciones,string idExpediente)
        {
            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Update_Expedientes";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@num_exp", num_exp).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@asunto", asunto).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fecha_inicio", fechaInicio).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@fecha_cierre", fechaCierre).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@estatus", estatus).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@ubicacion_expediente", ubicacionExpediente).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@observaciones", Observaciones).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@idExp", idExpediente).SqlDbType = SqlDbType.Int;
                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = true });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { error = "error" });
        }

        //funcion para actualizar Expediente, se debe buscar en base al campo id_exp de la tabla  expediente
        public ActionResult UpdateDocumentos(string num_exp_,string codigo_documento_,string referencia_,string nombre_emisor_,string cargo_emisor_,
            string institución_emisor_,string desc_documento_,string fecha_emision_,string id_tipo_documento_,int fojas_,string observaciones_,string num_exp,int id_documento)
        {
            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Update_Documentos";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@num_exp", num_exp_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@codigo_documento_", id_documento).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@referencia_", referencia_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@nombre_emisor_", nombre_emisor_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@cargo_emisor_", cargo_emisor_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@institución_emisor_", institución_emisor_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@desc_documento_", desc_documento_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fecha_emision_", fecha_emision_).SqlDbType = SqlDbType.Date;
                    cmd.Parameters.AddWithValue("@id_tipo_documento_", id_tipo_documento_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fojas_", fojas_).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@observaciones_", observaciones_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@num_Exp_", "otro").SqlDbType = SqlDbType.VarChar;

                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = true });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { error = "error" });
        }
        //seleccionar estatus
        public ActionResult EstatusExpediente()
        {
            try
            {
                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "Estatus";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "ResultEstatus");

                    adapter.SelectCommand = cmd;
                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("ResultEstatus");
                    adapter.Fill(dataSet);
                    List<Estatus> ResultEstatus = new List<Estatus>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        ResultEstatus.Add(new Estatus()
                        {

                            Id_Estatus = Convert.ToInt32(dataSet.Tables["ResultEstatus"].Rows[r]["id_estatus_expediente"].ToString()),
                            Estatus_Descripcion = dataSet.Tables["ResultEstatus"].Rows[r]["estatus"].ToString(),
                        });
                    }


                    return Json(ResultEstatus);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
            
        }
        //seleccionar expedientes
        public ActionResult SelectExpediente(string serieDocumental)
        {
            try
            {
                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "Select_Expedientes";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@num_exp", serieDocumental).SqlDbType = SqlDbType.VarChar;


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "ResultExpediente");

                    adapter.SelectCommand = cmd;
                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("ResultExpediente");
                    adapter.Fill(dataSet);
                    List<Expediente> ResultExpediente = new List<Expediente>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        ResultExpediente.Add(new Expediente()
                        {
                            Num_Exp = dataSet.Tables["ResultExpediente"].Rows[r]["num_exp"].ToString(),
                            Asunto = dataSet.Tables["ResultExpediente"].Rows[r]["asunto"].ToString(),
                            Fecha_Inicio = dataSet.Tables["ResultExpediente"].Rows[r]["fecha_inicio"].ToString(),
                            Fecha_Cierre = dataSet.Tables["ResultExpediente"].Rows[r]["fecha_cierre"].ToString(),
                            Ubicacion = dataSet.Tables["ResultExpediente"].Rows[r]["ubicacion"].ToString(),
                            Observaciones = dataSet.Tables["ResultExpediente"].Rows[r]["observaciones"].ToString(),
                            Id_Estatus_Expediente = Convert.ToInt32(dataSet.Tables["ResultExpediente"].Rows[r]["id_estatus_expediente"].ToString()),
                            serieD = dataSet.Tables["ResultExpediente"].Rows[r]["serieD"].ToString()
                        });
                    }


                    return Json(ResultExpediente);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
        }

        public ActionResult SelectDocumentos(string numdoc)
        {
            try
            {
                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "Select_Documentos";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@num_documento", numdoc).SqlDbType = SqlDbType.VarChar;


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "ResultExpediente");

                    adapter.SelectCommand = cmd;
                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("ResultExpediente");
                    adapter.Fill(dataSet);
                    List<Documentos> ResultExpediente = new List<Documentos>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        ResultExpediente.Add(new Documentos()
                        {
                            Expediente = dataSet.Tables["ResultExpediente"].Rows[r]["num_exp"].ToString(),
                            codigo_documento = dataSet.Tables["ResultExpediente"].Rows[r]["codigo_documento"].ToString(),
                            Referencias = dataSet.Tables["ResultExpediente"].Rows[r]["referencia"].ToString(),
                            nombre_Cargo_Emisor = dataSet.Tables["ResultExpediente"].Rows[r]["nombre_emisor"].ToString(),
                            Cargo_Emisor = dataSet.Tables["ResultExpediente"].Rows[r]["cargo_emisor"].ToString(),
                            institución_emisor = dataSet.Tables["ResultExpediente"].Rows[r]["institución_emisor"].ToString(),
                            Desc_documento = dataSet.Tables["ResultExpediente"].Rows[r]["desc_documento"].ToString(),
                            Fecha_Doc_Registrado = dataSet.Tables["ResultExpediente"].Rows[r]["fecha_emision"].ToString(),
                            id_tipo_documento =int.Parse( dataSet.Tables["ResultExpediente"].Rows[r]["id_tipo_documento"].ToString()),
                            Fojas = dataSet.Tables["ResultExpediente"].Rows[r]["fojas"].ToString(),
                            observaciones = dataSet.Tables["ResultExpediente"].Rows[r]["observaciones"].ToString(),

                        });
                    }

                    /*Select UA*/
                    SqlCommand cmd1 = conn.CreateCommand();
                    cmd1.Connection = conn;
                    cmd1.CommandText = "Selecciona_Unidad_Administrativa";
                    cmd1.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlDataAdapter adapter1= new SqlDataAdapter();
                    adapter1.TableMappings.Add("Table", "ResultExpediente1");
                    DataSet dataSet1 = new DataSet("ResultExpediente1");
                    adapter1.SelectCommand = cmd1;
                    adapter1.Fill(dataSet1);
                    List<UnidadAdministrativa> ResultExpediente1 = new List<UnidadAdministrativa>();

                    for (int r = 0; r < dataSet1.Tables[0].Rows.Count; r++)
                    {
                        ResultExpediente1.Add(new UnidadAdministrativa()
                        {
                            Id_Unidad_Administrativa = int.Parse(dataSet1.Tables["ResultExpediente1"].Rows[r]["id_ua"].ToString()),
                            Nombre_completo = dataSet1.Tables["ResultExpediente1"].Rows[r]["uad"].ToString(),

                        });
                    }
                    /*Select UA*/
                    return Json(new{doc=ResultExpediente,ua=ResultExpediente1 });

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
        }

        public ActionResult DeleteExpedientes(int id_exp)
        {
            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Delete_Expedientes";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_exp", id_exp).SqlDbType = SqlDbType.Int;
                   
                    cmd.ExecuteNonQuery();
                    return Json(new { success = true }); ;
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                    return Json(new { success = false });
                }
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { error = "error" });
        }

        public ActionResult SelectUA()
        {
            try
            {
                using SqlConnection conn = Conector.Connection();
                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "Selecciona_Unidad_Administrativa";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "ResultExpediente");

                    adapter.SelectCommand = cmd;
                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("ResultExpediente");
                    adapter.Fill(dataSet);
                    List<UnidadAdministrativa> ResultExpediente = new List<UnidadAdministrativa>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        ResultExpediente.Add(new UnidadAdministrativa()
                        {
                            Id_Unidad_Administrativa = int.Parse(dataSet.Tables["ResultExpediente"].Rows[r]["id_ua"].ToString()),
                            Nombre_completo = dataSet.Tables["ResultExpediente"].Rows[r]["uad"].ToString(),

                        });
                    }


                    return Json(ResultExpediente);

                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }

            return Json(new { status = "error" });
        }

        public ActionResult AltaDocumento(string exp, string refs,string emi,string cargoE,string inst,string descD,string fechaE,string est,string foj,string sop,string observaciones,string num_exp)
        {

            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Alta_Documentos";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@exp", exp).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@refs", refs).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@emi", emi).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@cargoE", cargoE).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@inst", inst).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@descD", descD).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fechaE", fechaE).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@est", est).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@foj", foj).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@sop", sop).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@observaciones", observaciones).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@num_Exp", num_exp).SqlDbType = SqlDbType.VarChar;

                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = true });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { error = "Error" });
        }

        //FUNCIONES DE REPORTE DE INVENTARIO DOCUMENTAL
        static MemoryStream stream = new MemoryStream();
        public ActionResult GeneraExcel(IFormCollection form)
        {
            try
            {
                string T = ""; string A = ""; string S = "";

                T = form["TR"].ToString();
                string[] parametros = new string[2]; string mensajet = "";

                if (T == "General")
                {
                    mensajet = GeneraExcelGeneral("/Formatos/Inventario_General_Archivo_Documental_SICA.xlsm");
                }
                else if (T == "Por_Area")
                {
                    A = form["AR"].ToString(); parametros[0] = A;

                    mensajet = GeneraExcelIndividual("/Formatos/Inventario_Individual_Archivo_Documental_SICA.xlsm", "Por_Area", parametros);

                }
                else if (T == "Por_Area_Serie_Documental")
                {
                    A = form["AR"].ToString(); S = form["SD"].ToString();
                    parametros[0] = A; parametros[1] = S;

                    mensajet = GeneraExcelIndividual("/Formatos/Inventario_Individual_Archivo_Documental_SICA.xlsm", "Por_Area_Serie_Documental", parametros);
                }

                return Json(new { mensaje = mensajet });

            }
            catch (Exception ex)
            {

                return Json(new { mensaje = ex.Message });
            }


        }



        public string GeneraExcelGeneral(string rutaFisicaDocumento)
        {
            try
            {
                string unidadAdminSig = "";
                int contadorUnidadAadmin = 1;
                string rutaArchivo = rutaFisicaDocumento;
                int HojaEditar = 0;
                string rutaGuardar = "/Formatos/";
                DateTime localDate = DateTime.Now;
                Workbook workbook = new Workbook();
                workbook.LoadFromFile(rutaArchivo);
                Worksheet worksheet = workbook.Worksheets[HojaEditar];
                MemoryStream ms = new MemoryStream();
                DateTime dtime; dtime = DateTime.Now;
                worksheet.Range[1, 26].Value = dtime.Year + "-" + dtime.Month + "-" + dtime.Day + "";

                int rowIndex = 5;/*Inicio de la carga de Información*/
                int ColIndex = 1;
                int ColIndex1 = 26;
                /**/
                try
                {
                    System.Data.DataTable dtS = new System.Data.DataTable();
                    //using (SqlConnection conn = new SqlConnection("Data Source=192.168.1.200;Initial Catalog=sica;User Id=root;Password=753159Cdhp*-+;TrustServerCertificate=True;"))
                    //using (MySqlConnection)
                    using (MySqlConnection conn = new MySqlConnection("DataSource=192.168.1.200;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
                    {

                        MySqlCommand cmd1 = new MySqlCommand();
                        cmd1.CommandType = CommandType.StoredProcedure;
                        cmd1.CommandText = "Sp_Turnos_PendientesGeneral";
                        cmd1.Parameters.Add("id_cadido", MySqlDbType.Int32).Value = 0;
                        cmd1.Connection = conn;
                        conn.Open();

                        MySqlDataAdapter da = new MySqlDataAdapter(cmd1);
                        da.Fill(dtS);
                        da.Dispose();
                    }


                    int columnasS = dtS.Columns.Count;
                    int rowS = dtS.Rows.Count;
                    /*Tercer Ciclo*/
                    for (int u = 0; u < rowS; u++)
                    {

                        if (unidadAdminSig != dtS.Rows[u][2].ToString())
                        {
                            contadorUnidadAadmin = 1;
                        }
                        else
                        {
                            contadorUnidadAadmin++;
                        }
                        /*Cuarto Ciclo*/
                        for (int p = 0; p < columnasS; p++)
                        {


                            if (p == 0)
                            {


                            }
                            else
                            {
                                if (ColIndex > 2)
                                {
                                    worksheet.Range[rowIndex, ColIndex + 1].Value = dtS.Rows[u][p].ToString();
                                    worksheet.Range[rowIndex, 1].Value = contadorUnidadAadmin.ToString();
                                }
                                else
                                {
                                    worksheet.Range[rowIndex, ColIndex].Value = dtS.Rows[u][p].ToString();
                                    worksheet.Range[rowIndex, 1].Value = contadorUnidadAadmin.ToString();
                                }


                            }
                            ColIndex++;
                            unidadAdminSig = dtS.Rows[u][2].ToString();
                        }
                        rowIndex++;
                        ColIndex = 1;

                    }

                    ms.Flush();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                workbook.SaveToFile(rutaGuardar + "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx");
                string ruta = rutaGuardar + "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";
                string nombre = "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";
                stream = new MemoryStream();
                workbook.SaveToStream(stream);

                return "ok";
            }
            catch (Exception ex)
            {

                return ex.Message;
            }
        }

        public string GeneraExcelIndividual(string rutaFisicaDocumento, string TipoReporte, string[] ValorTipoReporte)
        {
            try
            {
                string unidadAdminSig = "";
                int contadorUnidadAadmin = 1;
                string rutaArchivo = rutaFisicaDocumento;
                int HojaEditar = 0;
                string rutaGuardar = "/Formatos/";
                DateTime localDate = DateTime.Now;
                Workbook workbook = new Workbook();
                workbook.LoadFromFile(rutaArchivo);
                Worksheet worksheet = workbook.Worksheets[HojaEditar];
                MemoryStream ms = new MemoryStream();
                DateTime dtime; dtime = DateTime.Now;
                worksheet.Range[1, 26].Value = dtime.Year + "-" + dtime.Month + "-" + dtime.Day + "";
                worksheet.Range[1, 29].Value = ValorTipoReporte[0];/*FECHA_GENERADORA*/
                worksheet.Range[2, 5].Value = ValorTipoReporte[0];/*AREA_GENERADORA*/

                int rowIndex = 10;/*Inicio de la carga de Información*/
                int ColIndex = 1;
                int ColIndex1 = 26;
                /**/
                try
                {
                    System.Data.DataTable dtS = new System.Data.DataTable();
                    using (MySqlConnection conn = new MySqlConnection("DataSource=192.168.1.200;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
                    {
                        MySqlCommand cmd1 = new MySqlCommand();
                        cmd1.CommandType = CommandType.StoredProcedure;
                        if (TipoReporte == "Por_Area")
                        {
                            cmd1.CommandText = "Sp_Turnos_PendientesIndividual_area";
                            cmd1.Parameters.Add("siglas", MySqlDbType.VarChar, 10).Value = ValorTipoReporte[0];
                        }
                        else if (TipoReporte == "Por_Area_Serie_Documental")
                        {
                            cmd1.CommandText = "Sp_Turnos_PendientesIndividual_AREA_SERIE";
                            cmd1.Parameters.Add("siglas", MySqlDbType.VarChar, 10).Value = ValorTipoReporte[0];
                            cmd1.Parameters.Add("serie", MySqlDbType.VarChar, 15).Value = ValorTipoReporte[1];
                        }

                        cmd1.Connection = conn;
                        conn.Open();
                        MySqlDataAdapter da = new MySqlDataAdapter(cmd1);
                        da.Fill(dtS);
                        da.Dispose();
                    }


                    int columnasS = dtS.Columns.Count;
                    int rowS = dtS.Rows.Count;
                    /*Tercer Ciclo*/
                    for (int u = 0; u < rowS; u++)
                    {
                        if (unidadAdminSig != dtS.Rows[u][2].ToString())
                        {
                            contadorUnidadAadmin = 1;
                        }
                        else
                        {
                            contadorUnidadAadmin++;
                        }
                        /*Cuarto Ciclo*/
                        for (int p = 0; p < columnasS; p++)
                        {
                            if (p == 0)
                            {


                            }
                            else
                            {
                                if (p == 1)
                                {
                                    worksheet.Range[rowIndex, ColIndex].Value = "";
                                    worksheet.Range[rowIndex, 1].Value = "";
                                }
                                else
                                {
                                    worksheet.Range[rowIndex, ColIndex].Value = dtS.Rows[u][p].ToString();
                                    worksheet.Range[rowIndex, 1].Value = contadorUnidadAadmin.ToString();
                                }


                            }
                            ColIndex++;
                            unidadAdminSig = dtS.Rows[u][2].ToString();
                        }
                        rowIndex++;
                        ColIndex = 1;
                    }

                    ms.Flush();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                workbook.SaveToFile(rutaGuardar + "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx");
                string ruta = rutaGuardar + "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";
                string nombre = "test_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";
                stream = new MemoryStream();
                workbook.SaveToStream(stream);

                return "ok";
            }
            catch (Exception ex)
            {

                return ex.Message;
            }
        }

        public ActionResult listadoseries(string area)
        {
            ArrayList listaSeriesDtos = new ArrayList();
            System.Data.DataTable dt = new System.Data.DataTable();

            using (MySqlConnection conn = new MySqlConnection("DataSource=192.168.1.200;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
            {
                MySqlCommand cmd = new MySqlCommand();

                cmd.CommandText = "Sp_Series_Area";
                cmd.Parameters.Add("area", MySqlDbType.VarChar, 10).Value = "" + area + "";



                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;
                conn.Open();
                MySqlDataAdapter da = new MySqlDataAdapter(cmd);

                da.Fill(dt);
                da.Dispose();


            }

            for (int u = 0; u < dt.Rows.Count; u++)
            {
                listaSeriesDtos.Add(dt.Rows[u][0].ToString());
                /*Cuarto Ciclo*/
            }
            return Json(new { mensaje = "ok", lista = listaSeriesDtos });
            //return listaSeriesDtos;

        }

        public FileResult GuardarDocumento()
        {
            return File(stream.ToArray(), "application/msexcel", "InvDocumental_" + DateTime.Now.ToString() + ".xlsx");
        }

        // POST: ReporteInventarioController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ReporteInventarioController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ReporteInventarioController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ReporteInventarioController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ReporteInventarioController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

    }
}
