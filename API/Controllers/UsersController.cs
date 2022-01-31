using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]

  public class UsersController : ControllerBase
  {
    private readonly DataContext _context;

    public UsersController(DataContext context) {
      _context = context; // now we have access to the database via DataContext
      // _context is the entire database
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers() {
      // IEnumerable allows us to use simple iteration over a collection of specified type
      return await _context.Users.ToListAsync();
    }

    // api/users/3
    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetUser(int id) {
      // its always recommended to use asynchronous code
      return await _context.Users.FindAsync(id);
    }
  }
}