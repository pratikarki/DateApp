using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
  public class UserLike {
    public AppUser SourceUser { get; set; } // the user that is liking other user
    public int SourceUserId { get; set; } // id of the user that is liking other user

    public AppUser LikedUser { get; set; } // the user that is being liked
    public int LikedUserId { get; set; } // id of the user that is being liked
  }
}