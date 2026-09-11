using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using Spire.Xls;
using System;
using System.Web;
using System.IO;
using System.Collections;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace Reporte_Inventario_Documental.Controllers
{
    public class ReporteInventarioController : Controller
    {
        static MemoryStream stream = new MemoryStream();
        // GET: ReporteInventarioController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ReporteInventarioController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ReporteInventarioController/Create
        public ActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GeneraExcel(IFormCollection form)
        {
            try
            {
                string T = ""; string A = ""; string S = "";

                T = form["TR"].ToString();
                string[] parametros = new string[2]; string mensajet = "";

                if (T == "General")
                {
                    mensajet = GeneraExcelGeneral("/Formatos/Inventario_General_Archivo_Documental_SICA_new.xlsm");
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

                return Json(new { mensaje = "ok", rutaArchivo = mensajet });

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
                int ColIndex1 = 30;
                /**/
                try
                {
                    System.Data.DataTable dtS = new System.Data.DataTable();
                    //using (SqlConnection conn = new SqlConnection("Data Source=192.168.1.200;Initial Catalog=sica;User Id=root;Password=753159Cdhp*-+;TrustServerCertificate=True;"))
                    //using (MySqlConnection)
                    using (MySqlConnection conn = new MySqlConnection("DataSource=201.139.97.36:10015;Database=sica;Uid=root;Pwd=753159Cdhp*-+;"))
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
                cmd.Parameters.Add("area", MySqlDbType.VarChar, 10).Value = "'" + area + "'";



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
