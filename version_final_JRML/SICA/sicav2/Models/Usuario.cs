
namespace sicav2.Models
{
    public class Usuario
    {

        public int Id_Usuario { get; set; }
        public string Nom_Usuario { get; set; }
        public string Nombre { get; set; }
		public string Ape_Paterno { get; set; }
		public string Ape_Materno { get; set; }
		public string Pass { get; set; }
		public int Id_Unidad_Administrativa { get; set; }
        public int Id_Usuario_Rol { get; set; }

        public string Rol_nombre { get; set; }


    }
}
