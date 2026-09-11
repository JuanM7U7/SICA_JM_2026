
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
using System.Collections.Generic;
using System.Drawing;
using Microsoft.AspNetCore.JsonPatch.Internal;
using ClosedXML.Excel;
using System.Security.Policy;
using System;
using DocumentFormat.OpenXml.Office.Word;


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
        public ActionResult CaratulaPDF(string idexp,string expediente)

        { //prueba repositorio GitH
            try
            {
                using SqlConnection conn = Conector.Connection();

                if (conn != null)
                {
                    SqlCommand cmd = conn.CreateCommand();
                    cmd.Connection = conn;

                    cmd.CommandText = "sp_CaratulaPDF_MAR";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@IDexp", idexp).SqlDbType = SqlDbType.Int;



                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "CARATULAPDF");

                    adapter.SelectCommand = cmd;

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("CARATULAPDF");
                    adapter.Fill(dataSet);
                    List<ModeloCaratulaPDF> lstSeries = new List<ModeloCaratulaPDF>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        lstSeries.Add(new ModeloCaratulaPDF()
                        {
                            expediente = expediente,
                            descrpcionExpediente = dataSet.Tables["CARATULAPDF"].Rows[r]["DescripcionDocumento"].ToString(),
                            fondo_codigo = dataSet.Tables["CARATULAPDF"].Rows[r]["FondoCodiGo"].ToString(),
                            fondo_desc = dataSet.Tables["CARATULAPDF"].Rows[r]["FondoDescripcion"].ToString(),
                            unidadAdmin_codigo = dataSet.Tables["CARATULAPDF"].Rows[r]["UA_CODIGO"].ToString(),
                            unidadAdmin_fondo_desc = dataSet.Tables["CARATULAPDF"].Rows[r]["UA_DESC"].ToString(),
                            seccion_codigo = dataSet.Tables["CARATULAPDF"].Rows[r]["codigo_secc"].ToString(),
                            seccion_desc = dataSet.Tables["CARATULAPDF"].Rows[r]["desc_secc"].ToString(),
                            serie_codigo = dataSet.Tables["CARATULAPDF"].Rows[r]["codigo_serie"].ToString(),
                            serie_desc = dataSet.Tables["CARATULAPDF"].Rows[r]["desc_serie"].ToString(),
                            anio_apertura = Convert.ToDateTime(dataSet.Tables["CARATULAPDF"].Rows[r]["anio_apertura"]).ToString("yyyy/MM/dd"),
                            anio_cierre = Convert.ToDateTime(dataSet.Tables["CARATULAPDF"].Rows[r]["anio_cierre"]).ToString("yyyy/MM/dd"),
                            valorDocumental = dataSet.Tables["CARATULAPDF"].Rows[r]["valor_documental"].ToString(),
                            clasificacion = dataSet.Tables["CARATULAPDF"].Rows[r]["clasificacion"].ToString(),
                            plazoConservacion = dataSet.Tables["CARATULAPDF"].Rows[r]["plazo_conservacion"].ToString(),
                            //legajos = dataSet.Tables["CARATULAPDF"].Rows[r]["legajos"].ToString(),
                            fojas = dataSet.Tables["CARATULAPDF"].Rows[r]["fojas"].ToString(),


                        });
                    }
                   
                   
                    return new ViewAsPdf("CaratulaPDF", lstSeries)
                    {
                        PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                        PageMargins = { Left = 0, Right = 0 },

                    };

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


        [Authorize(Roles = "1")]
        public IActionResult Privacy()
        {
            return View();
        }

        public ActionResult DeleteDoct(int id, string codigo_documento_)
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

                if (codigo_documento_ != null) 
                {
                    int n = 1;
                    if (codigo_documento_.Length > 1)
                    {
                        string res = codigo_documento_.Remove(0, n);
                        reordenarConsecutivosDocumentosJM(res);
                    }
                }

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
        public ActionResult ObtenerSeries(string siglas, string anio, string rol)
        {
         
            try
            {
                string s1 = "";
                string s2 = "";
                string s3 = "";
                
                if (siglas.IsNullOrEmpty() && anio.IsNullOrEmpty())
                {
                    siglas = "";
                    anio = "";
                }
                else
                {
                    s1 = siglas;
                    s2 = anio;
                    s3 = rol;
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
                    cmd.Parameters.AddWithValue("@rol", rol).SqlDbType = SqlDbType.VarChar;  
   


                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.TableMappings.Add("Table", "Series");

                    adapter.SelectCommand = cmd;
                   

                    // Fill the DataSet.
                    DataSet dataSet = new DataSet("Series");
                    adapter.Fill(dataSet);
                    List<LstSerie> lstSeries = new List<LstSerie>();

                    for (int r = 0; r < dataSet.Tables[0].Rows.Count; r++)
                    {
                        string c = "";
                        string cl = "";
                        if (Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["cantidad"].ToString()) <= 0) { c = "lightgray"; cl = "black"; } else { c = "#20B1AE"; cl = "white"; }
                        lstSeries.Add(new LstSerie()
                        {
                            CantExp = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["cantidad"].ToString()),
                            Id_Serie = Convert.ToInt32(dataSet.Tables["Series"].Rows[r]["id_serie"].ToString()),
                            Cod_Serie = dataSet.Tables["Series"].Rows[r]["cod_serie"].ToString(),
                            Desc_Serie = dataSet.Tables["Series"].Rows[r]["desc_serie"].ToString(),
                            Siglas_UA = dataSet.Tables["Series"].Rows[r]["siglas_ua"].ToString(),
                            color=c,
                            colorl=cl
                        });;
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

        public ActionResult ObtenerExpedientes(string anio, string ua, int id_serie,int idrol)
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
                    cmd.Parameters.AddWithValue("@id_rol", idrol).SqlDbType = SqlDbType.Int;

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
                            Id_Estatus_Expediente_des = dataSet.Tables["ExpPorCodSerie"].Rows[r]["id_estatus_expediente_des"].ToString(),
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
                            Desc_documento = dataSet.Tables["DocPorExp"].Rows[r]["desc_documento"].ToString(), 
                            codigo_documento = dataSet.Tables["DocPorExp"].Rows[r]["codigo_documento2"].ToString(),
                            //Descripcion = dataSet.Tables["DocPorExp"].Rows[r]["desc_documento"].ToString(),
                            Fecha_Doc_Registrado = dataSet.Tables["DocPorExp"].Rows[r]["fecha_emision"].ToString(),
                            nombre_Cargo_Emisor = dataSet.Tables["DocPorExp"].Rows[r]["nombre_emisor"].ToString()+" - "+ dataSet.Tables["DocPorExp"].Rows[r]["cargo_emisor"].ToString(),
                            Referencias = dataSet.Tables["DocPorExp"].Rows[r]["referencia"].ToString(),
                            Fojas = dataSet.Tables["DocPorExp"].Rows[r]["fojas"].ToString(),
                            //Legajos = dataSet.Tables["DocPorExp"].Rows[r]["legajos"].ToString(),
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
        [HttpPost]
        public ActionResult AltaExpedientes(string serieDocumental, string asunto, DateTime fechaInicio, DateTime fechaCierre, int Estatus, string ubicacionExpediente, string observacionesUsuario, int idSerie, string UA)
        {
            string[] codigoSerie = new string[5];

            string obsrervacionesUusarioF = "";

            if (observacionesUsuario is null) obsrervacionesUusarioF = ""; else obsrervacionesUusarioF = observacionesUsuario;

            try
            {
                codigoSerie = serieDocumental.Split(' ');

                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "Alta_ExpedientesM";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@serie_documental", codigoSerie[0].ToString()).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@asunto", asunto).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fecha_inicio", fechaInicio).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@fecha_cierre", fechaCierre).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@estatus", Estatus).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@ubicacion_expediente", ubicacionExpediente).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@observaciones_expediente", obsrervacionesUusarioF).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@siglas", UA).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@serieParaCadido", idSerie).SqlDbType = SqlDbType.Int;
                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();

                    string fechComparar = fechaInicio.ToString();
                    string fechCompararfin = fechComparar.Substring(0, 4);
                    var codigo_docume = UA;
                    string codigoSerieFin = codigoSerie[0];
                    string resfin = "/" + fechCompararfin + "/" + codigo_docume + "/" + codigoSerieFin;
                    if (resfin.Length > 1)
                    {
                        string res = resfin;//.Remove(0, n);
                        reordenarConsecutivosExpedientesJM(res);
                    }
                    // ObtenerSeries(UA, anio_busqueda, rol);
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = "OK" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { success = "Error" });
        }

        //funcion para actualizar Expediente, se debe buscar en base al campo id_exp de la tabla  expediente
        public ActionResult UpdateExpedientes(string num_exp, string asunto, DateTime fechaInicio, DateTime fechaCierre, int estatus, string ubicacionExpediente, string Observaciones,string idExpediente)
        {

            string obsrervacionesUusarioF = "";

            if (Observaciones is null) obsrervacionesUusarioF = ""; else obsrervacionesUusarioF = Observaciones;
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
                    cmd.Parameters.AddWithValue("@observaciones", obsrervacionesUusarioF).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@idExp", idExpediente).SqlDbType = SqlDbType.Int;
                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success ="OK" });


            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { success = "error" });
        }

        //funcion para actualizar Expediente, se debe buscar en base al campo id_exp de la tabla  expediente
        public ActionResult UpdateDocumentos(string num_exp_,string codigo_documento_,string referencia_,string nombre_emisor_,string cargo_emisor_,
            string institución_emisor_,string desc_documento_,string fecha_emision_,string id_tipo_documento_,int fojas_,string observaciones_,string num_exp,int id_documento)
        {

            string obsrervacionesUusarioF = "";
            if (observaciones_ is null) obsrervacionesUusarioF = ""; else obsrervacionesUusarioF = observaciones_;
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
                    cmd.Parameters.AddWithValue("@fecha_emision_", fecha_emision_).SqlDbType = SqlDbType.DateTime;
                    cmd.Parameters.AddWithValue("@id_tipo_documento_", id_tipo_documento_).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@fojas_", fojas_).SqlDbType = SqlDbType.Int;
                    cmd.Parameters.AddWithValue("@observaciones_", obsrervacionesUusarioF).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@num_Exp_", "otro").SqlDbType = SqlDbType.VarChar;

                    //  connection.Open()ddd;
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    Console.WriteLine("Error al conectar a la base de datos");
                }
                return Json(new { success = "OK" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return Json(new { success = "error" });
        }
        //seleccionar estatus
        public ActionResult EstatusExpediente(int IdExp)
        {
            try
            {
                using SqlConnection conn = Conector.Connection();
                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "Tipo_Expediente_allMC";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("@id_status_expediente", SqlDbType.Int).Value = IdExp;

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    string tipoDoc = reader["tipo_doc"].ToString();
                    return Json(new { status = "OK", tipoDoc });
                }
                else
                {
                    return Json(new { status = "Error", message = "No se encontró información para el expediente." });
                }
            }
            catch (Exception e)
            {
                return Json(new { status = "Error", message = e.Message });
            }
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
                            id_tipo_documento =dataSet.Tables["ResultExpediente"].Rows[r]["documentos"].ToString(),
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

        public ActionResult DeleteExpedientes(int id_exp, string numex)
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
                    //cmd.Parameters.AddWithValue("@num_Expp", numex).SqlDbType = SqlDbType.VarChar;

                    cmd.ExecuteNonQuery();
                    int n = 1;
                    if(numex.Length > 1) 
                    {
                        string res = numex.Remove(0, n);
                        reordenarConsecutivosExpedientesJM(res);
                    }
                   
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

        public ActionResult reordenarConsecutivosExpedientesJM(string num_expp)
        {
            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "ReordenarConsecutivosRespetando";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@num_expp", num_expp).SqlDbType = SqlDbType.VarChar;

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
        public ActionResult reordenarConsecutivosDocumentosJM(string num_expp)
        {
            try
            {
                using SqlConnection connection = Conector.Connection();
                if (connection != null)
                {
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = "ReordenarConsecutivosRespetandoDocumentos";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@num_expp", num_expp).SqlDbType = SqlDbType.VarChar;

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

        public ActionResult AltaDocumento(string exp, string refs,string emi,string cargoE,string inst,string descD,string fechaE,string est,string foj,string[] sop,string observaciones,string num_exp)
        {
            string obsrervacionesUusarioF = "";
            int n = 1;
            if (observaciones is null) obsrervacionesUusarioF = ""; else obsrervacionesUusarioF = observaciones;
            try
            {
                string cadena = "";
                foreach (var item in sop)
                {
                    cadena += ","+item;
                }

                cadena= cadena.Remove(0, 1);

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
                    cmd.Parameters.AddWithValue("@sop", cadena.ToString()).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@observaciones", obsrervacionesUusarioF).SqlDbType = SqlDbType.VarChar;
                    cmd.Parameters.AddWithValue("@num_Exp", num_exp).SqlDbType = SqlDbType.VarChar;

                    //connection.Open();

                    cmd.ExecuteNonQuery();

                    n = 1;
                    var codigo_docume = num_exp;
                    codigo_docume = "/" + codigo_docume;
                    if (codigo_docume.Length > 1)
                    {
                        string res = codigo_docume;//.Remove(0, n);
                        reordenarConsecutivosDocumentosJM(res);
                    }

                    return Json(new { success = "OK" });

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
            return Json(new { success = "Error" });
        }

        //FUNCIONES DE REPORTE DE INVENTARIO DOCUMENTAL
        static MemoryStream stream = new MemoryStream();
        public ActionResult GeneraExcel(IFormCollection form)
        {
            try
            {
                string T = ""; string A = ""; string S = ""; string ruta = ""; string url = "";

                T = form["TR"].ToString();
                string[] parametros = new string[2]; string mensajet = ""; string mensaje = "";

                if (T == "General")
                {
                    //mensajet = DescargarExcel("/Formatos/Inventario_General_Archivo_Documental_SICA_new.xlsm").ToString();
                    mensajet = Url.Action("DescargarExcel", "Home", new { ruta = "/Formatos/Inventario_General_Archivo_Documental_SICA_MODIF.xlsm" });
                    mensaje = "ok";
                }
                else if (T == "Por_Area")
                {
                    A = form["AR"].ToString(); parametros[0] = A;

                    mensajet = Url.Action("GeneraExcelIndividual", "Home", new { ruta= "/Formatos/Inventario_Archivo_Documental_SICA_MODIF.xlsm", TR = T, AR = A });
                    if (parametros[0] != "0" )
                        mensaje = "ok";
                    else
                        mensaje = "error";
                }
                else if (T == "Por_Area_Serie_Documental")
                {
                    A = form["AR"].ToString(); S = form["SD"].ToString();
                    parametros[0] = A; parametros[1] = S;

                    // mensajet = GeneraExcelIndividual("/Formatos/Inventario_Individual_Archivo_Documental_SICA.xlsm", "Por_Area_Serie_Documental", parametros);
                    mensajet = Url.Action("GeneraExcelIndividual", "Home", new { ruta = "/Formatos/Inventario_Individual_Archivo_Documental_SICA.xlsm", TR = T, parametros});
                    mensaje = "ok";
                }

                return Json(new { mensaje = "ok", mensajet });

                //juuanM

            }
            catch (Exception ex)
            {

                return Json(new { mensaje = ex.Message });
            }


       }



        //public ActionResult GeneraExcelGeneral(string rutaFisicaDocumento)
        //{
        //    try
        //    {
        //        string unidadAdminSig = "";
        //        int contadorUnidadAadmin = 1;
        //        string rutaArchivo = rutaFisicaDocumento;
        //        int HojaEditar = 0;
        //        string rutaGuardar = "/Formatos/";
        //        DateTime localDate = DateTime.Now;
        //        Workbook workbook = new Workbook();
        //        workbook.LoadFromFile(rutaArchivo);
        //        Worksheet worksheet = workbook.Worksheets[HojaEditar];
        //        MemoryStream ms = new MemoryStream();
        //        DateTime dtime; dtime = DateTime.Now;
        //        worksheet.Range[1, 26].Value = dtime.Year + "-" + dtime.Month + "-" + dtime.Day + "";

        //        int rowIndex = 5;/*Inicio de la carga de Información*/
        //        int ColIndex = 1;
        //        int ColIndex1 = 26;
        //        /**/
        //        try
        //        {
        //            System.Data.DataTable dtS = new System.Data.DataTable();

        //            using (SqlConnection connf = new SqlConnection("Data Source=158.23.88.159,1435;Initial Catalog=sica_v2;User Id=DPIT_DESARROLLO1;Password=Cdhp2022*-+;TrustServerCertificate=True;"))
        //            {
        //                SqlCommand cmd1 = new SqlCommand();
        //                cmd1.CommandType = CommandType.StoredProcedure;
        //                cmd1.CommandText = "Sp_Turnos_PendientesGeneral";
        //                //cmd1.Parameters.Add("id_cadido", SqlDbType.Int ).Value = 0;
        //                cmd1.Connection = connf;
        //                connf.Open();

        //                SqlDataAdapter da = new SqlDataAdapter(cmd1);
        //                da.Fill(dtS);
        //                da.Dispose();

        //            } //JuanM

        //            //using (MySqlConnection conn = new MySqlConnection("DataSource=192.168.1.200;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
        //            //{

        //            //    MySqlCommand cmd1 = new MySqlCommand();
        //            //    cmd1.CommandType = CommandType.StoredProcedure;
        //            //    cmd1.CommandText = "Sp_Turnos_PendientesGeneral";
        //            //    cmd1.Parameters.Add("id_cadido", MySqlDbType.Int32).Value = 0;
        //            //    cmd1.Connection = conn;
        //            //    conn.Open();

        //            //    MySqlDataAdapter da = new MySqlDataAdapter(cmd1);
        //            //    da.Fill(dtS);
        //            //    da.Dispose();
        //            //}


        //            int columnasS = dtS.Columns.Count;
        //            int rowS = dtS.Rows.Count;
        //            /*Tercer Ciclo*/
        //            for (int u = 0; u < rowS; u++)
        //            {

        //                if (unidadAdminSig != dtS.Rows[u][2].ToString())
        //                {
        //                    contadorUnidadAadmin = 1;
        //                }
        //                else
        //                {
        //                    contadorUnidadAadmin++;
        //                }
        //                /*Cuarto Ciclo*/
        //                for (int p = 0; p < 27 /*columnasS*/; p++)
        //                {


        //                    if (p == 0)
        //                    {


        //                    }
        //                    else
        //                    {
        //                        if (ColIndex > 2)
        //                        {
        //                            worksheet.Range[rowIndex, ColIndex + 1].Value = dtS.Rows[u][p].ToString();
        //                            worksheet.Range[rowIndex, 1].Value = contadorUnidadAadmin.ToString();
        //                        }
        //                        else
        //                        {
        //                            worksheet.Range[rowIndex, ColIndex].Value = dtS.Rows[u][p].ToString();
        //                            worksheet.Range[rowIndex, 1].Value = contadorUnidadAadmin.ToString();
        //                        }


        //                    }
        //                    ColIndex++;
        //                    unidadAdminSig = dtS.Rows[u][2].ToString();
        //                }
        //                rowIndex++;
        //                ColIndex = 1;

        //            }

        //            ms.Flush();
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine(ex.Message);
        //        }
 
        //        //string nombreArchivo = $"ReporteGeneral_{localDate:dd_MM-yyyy_HHmmss}.xlsx";
        //        //workbook.SaveToFile(ruta + "ReporteGeneral_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx");
        //        //string ruta = rutaGuardar + "ReporteGeneral_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";
        //        //string nombre = "ReporteGeneral_" + localDate.Day + "_" + localDate.Month + "-" + localDate.Minute + ".xlsx";

        //        return Json(new { mensaje ="ok", rutaArchivot = rutaArchivo });//-----------------------------------------
        //        //return Json(new { mensaje = "ok", lista = listaSeriesDtos });
        //    }
        //    catch (Exception ex)
        //    {

        //        return Json(new { mensaje = "false", rutaArchivot = "" });
        //    }
        //}

        public ActionResult DescargarExcel(string rutaArchivo)
        {
            int HojaEditar = 0;
            //Workbook workbook = new Workbook();

            try
            {
                using (var workbook = new Workbook())
                {
                    /**/
                    try
                    {
                        string unidadAdminSig = "";
                        int contadorUnidadAadmin = 1;
                        workbook.LoadFromFile(rutaArchivo);
                        Worksheet worksheet = workbook.Worksheets[HojaEditar];
                        MemoryStream ms = new MemoryStream();
                        DateTime dtime; dtime = DateTime.Now;
                        worksheet.Range[1, 24].Value = dtime.Year + "-" + dtime.Month + "-" + dtime.Day + "";

                        int rowIndex = 5;/*Inicio de la carga de Información*/
                        int ColIndex = 1;
                        int ColIndex1 = 26;

                        System.Data.DataTable dtS = new System.Data.DataTable();
                        using (SqlConnection connf = new SqlConnection("Data Source=158.23.88.159,1435;Initial Catalog=sica_v2;User Id=DPIT_DESARROLLO1;Password=Cdhp2022*-+;TrustServerCertificate=True;"))
                        {
                            SqlCommand cmd1 = new SqlCommand();
                            cmd1.CommandType = CommandType.StoredProcedure;
                            cmd1.CommandText = "Sp_Turnos_PendientesGeneral";
                            //cmd1.Parameters.Add("id_cadido", SqlDbType.Int ).Value = 0;
                            cmd1.Connection = connf;
                            connf.Open();

                            SqlDataAdapter da = new SqlDataAdapter(cmd1);
                            da.Fill(dtS);
                            da.Dispose();

                        } //JuanM

                        int columnasS = dtS.Columns.Count;
                        int rowS = dtS.Rows.Count;
                        /*Tercer Ciclo*/
                        for (int u = 0; u < rowS; u++)
                        {

                            string areaActual = dtS.Rows[u][1].ToString();

                            // Si es el primer registro o cambió el área, reiniciamos a 1
                            if (string.IsNullOrEmpty(unidadAdminSig) || unidadAdminSig != areaActual)
                            {
                                contadorUnidadAadmin = 1;
                            }
                            else
                            {
                                contadorUnidadAadmin++;
                            }
                            /*Cuarto Ciclo*/
                            for (int p = 0; p < 27 /*columnasS*/; p++)
                            {
                                if (p == 0)
                                {
                                    // Omitimos la primera columna del SP ya que calculamos el contador en C#
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
                               
                            }
                            // CLAVE: Guardamos el área actual para compararla con la fila que viene en la siguiente vuelta
                            unidadAdminSig = areaActual;

                            rowIndex++;
                            ColIndex = 1;
                        }
                        ms.Flush();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }

                    using (var ms = new MemoryStream())
                    {
                        workbook.SaveToStream(ms, FileFormat.Version2016);
                        ms.Position = 0;

                        string nombreArchivo = $"ReporteGeneral_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.xlsx";

                        return File(ms.ToArray(),
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    nombreArchivo);
                    }
                }
            }
            catch (Exception ex)
            {

                return Json(new { mensaje = "false", rutaArchivot = ex });
            }
        }

        [HttpPost]
        public ActionResult GeneraExcelIndividual(string rutaFisicaDocumento, string TipoReporte, string[] ValorTipoReporte)
        {
            try
            {
                using (var workbook = new Workbook())
                {
                    string nombreArchivo = "";
                    string rutaArchivo = rutaFisicaDocumento;

                    workbook.LoadFromFile(rutaArchivo);
                    Worksheet worksheet = workbook.Worksheets[0]; // Hoja principal

                    MemoryStream ms = new MemoryStream();
                    DateTime dtime = DateTime.Now;

                    worksheet.Range[1, 23].Value = dtime.Year + "-" + dtime.Month + "-" + dtime.Day + "";
                    worksheet.Range[2, 5].Value = ValorTipoReporte[0]; /*FECHA_GENERADORA*/

                    try
                    {
                        System.Data.DataTable dtS = new System.Data.DataTable();

                        using (SqlConnection connf = new SqlConnection("Data Source=158.23.88.159,1435;Initial Catalog=sica_v2;User Id=DPIT_DESARROLLO1;Password=Cdhp2022*-+;TrustServerCertificate=True;"))
                        {
                            SqlCommand cmd1 = new SqlCommand();
                            cmd1.CommandType = CommandType.StoredProcedure;
                            cmd1.CommandTimeout = 0; // Tiempo infinito para que no truene por bulto

                            if (TipoReporte == "Por_Area")
                            {
                                cmd1.CommandText = "Sp_Turnos_PendientesIndividual_area";
                                cmd1.Parameters.Add("siglas", SqlDbType.VarChar, 10).Value = ValorTipoReporte[0];
                            }
                            else if (TipoReporte == "Por_Area_Serie_Documental")
                            {
                                cmd1.CommandText = "Sp_Turnos_PendientesIndividual_AREA_SERIE";
                                cmd1.Parameters.Add("siglas", SqlDbType.VarChar, 10).Value = ValorTipoReporte[0];
                                cmd1.Parameters.Add("serie", SqlDbType.VarChar, 15).Value = ValorTipoReporte[1];
                            }

                            cmd1.Connection = connf;
                            connf.Open();
                            SqlDataAdapter da = new SqlDataAdapter(cmd1);
                            da.Fill(dtS);
                            da.Dispose();
                        }
                        while (dtS.Columns.Count > 27)
                        {
                            dtS.Columns.RemoveAt(dtS.Columns.Count - 1);
                        }

                        // Insertamos TODO el bulto de datos completo (sin importar si son 100 o 10,000 registros)
                        // de un solo golpe en la hoja principal, arrancando desde la fila 10.
                        if (dtS.Rows.Count > 0)
                        {
                            worksheet.InsertDataTable(dtS, false, 10, 1);
                        }
                        else
                        {
                            // Por si acaso el query llega a venir vacío con los filtros seleccionados,
                            // evitamos que quede raro y dejamos un aviso debajo del encabezado.
                            worksheet.Range["A10"].Text = "No se encontraron registros para los filtros seleccionados.";
                        }

                        ms.Flush();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }

                    workbook.SaveToStream(ms, FileFormat.Version2016);
                    ms.Position = 0;

                    if (TipoReporte == "Por_Area")
                    {
                        nombreArchivo = $"ReportePorArea_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.xlsx";
                    }
                    else if (TipoReporte == "Por_Area_Serie_Documental")
                    {
                        nombreArchivo = $"ReportePorAreaSerieDocumental_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.xlsx";
                    }

                    byte[] fileBytes = ms.ToArray();
                    ms.Dispose();

                    return File(fileBytes,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                nombreArchivo);
                }
            }
            catch (Exception ex)
            {
                return Json(new { mensaje = "false", rutaArchivot = "" });
            }
        }

        [HttpPost]
        public ActionResult listadoseries(string area)
        {
            try
            {
                ArrayList listaSeriesDtos = new ArrayList();
                System.Data.DataTable dt = new System.Data.DataTable();

                //using (MySqlConnection conn = new MySqlConnection("DataSource=192.168.1.200;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
                //{MySqlCommand cmd = new MySqlCommand();
                //cmd.CommandText = "Sp_Series_Area";
                //cmd.Parameters.Add("area", MySqlDbType.VarChar, 10).Value = "" + area + "";

                //System.Data.DataTable dtS = new System.Data.DataTable();

                using (SqlConnection connf = new SqlConnection("Data Source=158.23.88.159,1435;Initial Catalog=sica_v2;User Id=DPIT_DESARROLLO1;Password=Cdhp2022*-+;TrustServerCertificate=True;"))
                {
                    SqlCommand cmd1 = new SqlCommand();
                    cmd1.CommandType = CommandType.StoredProcedure;

                    cmd1.CommandText = "Sp_Series_Area";
                    cmd1.Parameters.Add("area", SqlDbType.VarChar, 10).Value = "" + area + "";
                    cmd1.Connection = connf;
                    connf.Open();
                    SqlDataAdapter da = new SqlDataAdapter(cmd1);
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
            catch (Exception ex)
            {
                return Json(new { mensaje = "error", error = ex.Message });
            }

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

        public IActionResult ObtenerEstatusExpediente(int idExp)
        {
            using SqlConnection connection = Conector.Connection();

            if (connection == null)
                return StatusCode(500, "No se pudo establecer conexión con la base de datos.");

            using SqlCommand cmd = connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "Tipo_ExpedienteAE";
            cmd.Parameters.AddWithValue("@id_status_expediente", idExp);

            using SqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                string tipoDoc = reader["tipo_doc"].ToString();
                int idStatus = int.TryParse(tipoDoc, out var result) ? result : 5;

                return Ok(new { idStatus });
            }
            else
            {
                return NotFound("Expediente no encontrado.");
            }
        }




    }
}
