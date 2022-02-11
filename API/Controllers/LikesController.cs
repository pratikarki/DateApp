using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Authorize]
  public class LikesController: BaseApiController {
    private readonly IUserRepository _userRepo;
    private readonly ILikesRepository _likesRepo;

    public LikesController(IUserRepository userRepo, ILikesRepository likesRepo) {
      _userRepo = userRepo;
      _likesRepo = likesRepo;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username) {
      var sourceUserId = User.GetUserId();
      var likedUser = await _userRepo.GetUserByUsernameAsync(username);
      var sourceUser = await _likesRepo.GetUserWithLikes(sourceUserId);

      if (likedUser == null) return NotFound(); // if cannot find the user that they want to like
      if (sourceUser.UserName == username) return BadRequest("You cannot like your yourself"); // if user likes themselves
      
      var userLike = await _likesRepo.GetUserLike(sourceUserId, likedUser.Id);
      if (userLike != null) return BadRequest("You already liked this user");

      userLike = new UserLike {
        SourceUserId = sourceUserId,
        LikedUserId = likedUser.Id
      };

      sourceUser.LikedUsers.Add(userLike);
      if (await _userRepo.SaveAllAsync()) return Ok();
      return BadRequest("Failed to like user");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams) {
      likesParams.UserId = User.GetUserId();
      var users = await _likesRepo.GetUserLikes(likesParams);
      Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
      return Ok(users);
    }
  }
}