using Microsoft.Data.SqlClient;

namespace sicav2.Controllers
{
    public class Conector
    {
        public static SqlConnection Connection()
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            //builder.DataSource = "DPIT-SS2\\MSSQLSERVER2SS2";
            //builder.DataSource = "192.168.30.119";
            builder.DataSource = "158.23.88.159,1435";
            builder.InitialCatalog = "sica_v2";
            builder.UserID = "DPIT_DESARROLLO1";
            builder.Password = "Cdhp2022*-+";
            builder.TrustServerCertificate =true;
            SqlConnection conn = new SqlConnection(builder.ConnectionString);

            try
            {
                conn.Open();

                return conn;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return null;

            }
        }
    }
}
