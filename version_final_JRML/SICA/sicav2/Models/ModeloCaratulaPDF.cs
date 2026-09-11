namespace sicav2.Models
{
    public class ModeloCaratulaPDF
    {
        /*Seccion 1*/
        public string expediente { get; set; }
        public string descrpcionExpediente { get; set; }
        public string fondo_codigo { get; set; }
        public string fondo_desc{ get; set; }
        public string unidadAdmin_codigo { get; set; }
        public string unidadAdmin_fondo_desc { get; set; }
        public string seccion_codigo { get; set; }
        public string seccion_desc { get; set; }
        public string serie_codigo { get; set; }
        public string serie_desc { get; set; }
        public string anio_apertura { get; set; }
        public string anio_cierre { get; set; }
        public string valorDocumental { get; set; }
        public string clasificacion { get; set; }
        public string plazoConservacion { get; set; }
        public string legajos { get; set; }
        public string fojas { get; set; }



        public ModeloCaratulaPDF()
        {
            
        }

        public ModeloCaratulaPDF(string expediente, string descrpcionExpediente, string fondo_codigo, string fondo_desc, string unidadAdmin_codigo, string unidadAdmin_fondo_desc, string seccion_codigo, string seccion_desc, string serie_codigo, string serie_desc, string anio_apertura, string anio_cierre, string valorDocumental, string clasificacion, string plazoConservacion, string legajos, string fojas)
        {
            this.expediente = expediente;
            this.descrpcionExpediente = descrpcionExpediente;
            this.fondo_codigo = fondo_codigo;
            this.fondo_desc = fondo_desc;
            this.unidadAdmin_codigo = unidadAdmin_codigo;
            this.unidadAdmin_fondo_desc = unidadAdmin_fondo_desc;
            this.seccion_codigo = seccion_codigo;
            this.seccion_desc = seccion_desc;
            this.serie_codigo = serie_codigo;
            this.serie_desc = serie_desc;
            this.anio_apertura = anio_apertura;
            this.anio_cierre = anio_cierre;
            this.valorDocumental = valorDocumental;
            this.clasificacion = clasificacion;
            this.plazoConservacion = plazoConservacion;
            this.legajos = legajos;
            this.fojas = fojas;
        }
    }
}
