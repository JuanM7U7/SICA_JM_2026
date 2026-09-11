namespace sicav2.Models
{
    public class ModeloGeneral
    {
        public string Serie { get; set; }
        public string Siglas { get; set; }
        public string Anio { get; set; }

        public ModeloGeneral() { }

        public ModeloGeneral(string serie, string siglas, string anio) { 
            this.Serie = serie;
            this.Siglas = siglas;
            this.Anio = anio;
        }
    }
}
