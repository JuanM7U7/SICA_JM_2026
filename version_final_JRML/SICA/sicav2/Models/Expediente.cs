namespace sicav2.Models
{
    public class Expediente
    {
        public int IdExp { get; set; }
        public int Num_Consec { get; set; }
        public string Num_Exp { get; set; }
        public string Asunto { get; set;}
        public string Fecha_Inicio { get; set; }
        public string Fecha_Cierre { get; set; }
        public int Fojas { get; set; }
        public int Legajos { get; set; }
        public int Metros_Lineales { get; set; }
        public string Ubicacion { get; set; }
        public string Observaciones { get; set; }
        public int Revisado { get; set; }
        public int Eliminar { get; set; }
        public string Firma { get; set; }
        public string UA { get; set; }
        public int Id_Estatus_Expediente { get; set; }
        public string Id_Estatus_Expediente_des { get; set; }
        public int Id_Cadido { get; set; }
        public string serieD { get; set; }
        
    }

    public class Estatus
    {
        public int Id_Estatus { get; set; }
        public string Estatus_Descripcion { get; set; }
    }
    public class Documentos
    {
        public int id_documento { get; set; }
        public string id_tipo_documento { get; set; }
        public string area { get; set; }
        public string Expediente { get; set; }
        public string Desc_documento { get; set; }
        public string codigo_documento { get; set; }
        public string Fecha_Doc_Registrado { get; set; }
        public string nombre_Cargo_Emisor { get; set; }
        public string Cargo_Emisor { get; set; }
        public string institución_emisor { get; set; }
        public string Referencias { get; set; }
        public string Fojas { get; set; }
        public string Legajos { get; set; }
        public string observaciones { get; set; }


        public Documentos() { }
        public Documentos(string area, string expediente, string desc_documento, string fecha_Doc_Registrado, string nombre_Cargo_Emisor, string referencias, string fojas, string legajos)
        {
            this.area = area;
            Expediente = expediente;
            Desc_documento = desc_documento;
            Fecha_Doc_Registrado = fecha_Doc_Registrado;
            this.nombre_Cargo_Emisor = nombre_Cargo_Emisor;
            Referencias = referencias;
            Fojas = fojas;
            Legajos = legajos;
        }
    }
    
}


