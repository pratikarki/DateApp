using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Authorize]

  public class UsersController: BaseApiController {
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepo, IMapper mapper) {
      _userRepo = userRepo;
      _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() {
      return Ok(await _userRepo.GetMembersAsync());
    }

    // api/users/3
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username) {
      return await _userRepo.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto updateObj) {
      var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; //gives user's username from the token
      var user = await _userRepo.GetUserByUsernameAsync(username);

      _mapper.Map(updateObj, user);
      _userRepo.Update(user);

      if (await _userRepo.SaveAllAsync()) return NoContent();
      return BadRequest("Failed to update user");
    }
  }
}