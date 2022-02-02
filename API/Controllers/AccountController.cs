using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Interfaces;

namespace API.Controllers
{
  public class AccountController: BaseApiController {
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AccountController(DataContext context, ITokenService tokenService) {
      _tokenService = tokenService;
      _context = context;
    }
  
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto regDto) {
      if (await UserExists(regDto.Username)) return BadRequest("Username is taken.");

      using var hmac = new HMACSHA512(); // "using" makes sure when HMACSHA512 finishes, it is disposed correctly
      var user = new AppUser {
        UserName = regDto.Username.ToLower(),
        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(regDto.Password)),
        PasswordSalt = hmac.Key
      };
      this._context.Users.Add(user);
      await _context.SaveChangesAsync();
      return new UserDto {
        Username = user.UserName,
        Token = _tokenService.CreateToken(user)
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto logDto) {
      var user = await _context.Users.SingleOrDefaultAsync(el => el.UserName == logDto.Username);
      if (user == null) return Unauthorized("Invalid Username or Password.");

      var hmac = new HMACSHA512(user.PasswordSalt);
      var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(logDto.Password));

      for (int i=0; i<computedHash.Length; i++) {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Username or Password.");
      }

      return new UserDto {
        Username = logDto.Username,
        Token = _tokenService.CreateToken(user)
      };
    }

    private async Task<bool> UserExists (string username) {
      return await _context.Users.AnyAsync(el => el.UserName == username.ToLower());
    }
  }
}