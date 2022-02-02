using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
  // DTOs are a good place to add validation
  public class RegisterDto {
    [Required] public string Username { get; set; }
    [Required] public string Password { get; set; }
  }
}