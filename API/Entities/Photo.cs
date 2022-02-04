using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
  [Table("Photos")] // specifying Photos as a table name

  public class Photo {
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string PublicId { get; set; }

    // Fully defining relationship between AppUser and Photos
    // making use of Entity framework conventions
    // this specifies AppUserId cannot be null AND, Cascades i.e. if user is deleted, photos are also deleted.
    public AppUser AppUser { get; set; }
    public int AppUserId { get; set; }
  }
}