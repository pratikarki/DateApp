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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Authorize]

  public class UsersController: BaseApiController {
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public UsersController(IUserRepository userRepo, IMapper mapper, IPhotoService photoService) {
      _userRepo = userRepo;
      _mapper = mapper;
      _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() {
      return Ok(await _userRepo.GetMembersAsync());
    }

    // api/users/3
    [HttpGet("{username}", Name = "GetUser")]
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

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file) {
      var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      var user = await _userRepo.GetUserByUsernameAsync(username);
      var result = await _photoService.AddPhotoAsync(file);
      if (result.Error != null) return BadRequest(result.Error.Message);

      var photo = new Photo {
        Url = result.SecureUrl.AbsoluteUri,
        PublicId = result.PublicId
      };

      if (user.Photos.Count == 0) photo.IsMain = true;
      user.Photos.Add(photo);
      if (await _userRepo.SaveAllAsync()) {
        // return _mapper.Map<PhotoDto>(photo);
        return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
      }
      return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId) {
      var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      var user = await _userRepo.GetUserByUsernameAsync(username);
      var photo = user.Photos.FirstOrDefault(el => el.Id == photoId);
      if (photo.IsMain) return BadRequest("This is already your display picture");
      var currentMain = user.Photos.FirstOrDefault(el => el.IsMain); // returns current main photo
      if (currentMain != null) currentMain.IsMain = false;
      photo.IsMain = true;

      if (await _userRepo.SaveAllAsync()) return NoContent();

      return BadRequest("Failed to set main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId) {
      var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      var user = await _userRepo.GetUserByUsernameAsync(username);
      var photo = user.Photos.FirstOrDefault(el => el.Id == photoId);
      if (photo == null) return NotFound();
      if (photo.IsMain) return BadRequest("You can not delete your main photo");
      if (photo.PublicId != null) {
        var result = await _photoService.DeletePhotoAsync(photo.PublicId);
        if (result.Error != null) return BadRequest(result.Error.Message);
      }
      user.Photos.Remove(photo);
      if (await _userRepo.SaveAllAsync()) return Ok();
      return BadRequest("Failed to delete the photo");
    }
  }
}