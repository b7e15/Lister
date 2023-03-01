namespace Lister.Models.ModelData
{
    public class ListData
    {
        public string[] Values { get; set; }

        public ListData(string[] values)
        {
            Values = values;
        }
    }
}