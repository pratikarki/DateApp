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
using AutoMapper;

namespace API.Controllers
{
  public class AccountController: BaseApiController {
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper) {
      _tokenService = tokenService;
      _context = context;
      _mapper = mapper;
    }
  
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto regDto) {
      if (await UserExists(regDto.Username)) return BadRequest("Username is taken.");
      var user = _mapper.Map<AppUser>(regDto);

      using var hmac = new HMACSHA512(); // "using" makes sure when HMACSHA512 finishes, it is disposed correctly

      user.UserName = regDto.Username.ToLower();
      user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(regDto.Password));
      user.PasswordSalt = hmac.Key;

      this._context.Users.Add(user);
      await _context.SaveChangesAsync();
      return new UserDto {
        Username = user.UserName,
        Token = _tokenService.CreateToken(user),
        KnownAs = user.KnownAs
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto logDto) {
    var user = await _context.Users.Include(el => el.Photos).SingleOrDefaultAsync(el => el.UserName == logDto.Username);
      if (user == null) return Unauthorized("Invalid Username or Password.");

      var hmac = new HMACSHA512(user.PasswordSalt);
      var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(logDto.Password));

      for (int i=0; i<computedHash.Length; i++) {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Username or Password.");
      }

      return new UserDto {
        Username = logDto.Username,
        Token = _tokenService.CreateToken(user),
        PhotoUrl = user.Photos.FirstOrDefault(el => el.IsMain)?.Url,
        KnownAs = user.KnownAs
      };
    }

    private async Task<bool> UserExists (string username) {
      return await _context.Users.AnyAsync(el => el.UserName == username.ToLower());
    }
  }
}