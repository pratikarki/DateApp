using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class UserRepository : IUserRepository {
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper) {
      _mapper = mapper;
      _context = context; // now we have access to the database via DataContext
      // _context is the entire database
    }

    public async Task<MemberDto> GetMemberAsync(string username) {
      return await _context.Users
        .Where(user => user.UserName == username)
        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider) // automapper queryable extensions
        .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync() {
      return await _context.Users
        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }

    // public async Task<AppUser> GetUserByIdAsync(int id) {
    //   return await _context.Users.FindAsync(id);
    // }

    public async Task<AppUser> GetUserByUsernameAsync(string username) {
      return await _context.Users
        .Include(user => user.Photos) // called eager loading; this causes circular reference exception
        .SingleOrDefaultAsync(el => el.UserName == username);
    }

    // public async Task<IEnumerable<AppUser>> GetUsersAsync() {
    //   // IEnumerable allows us to use simple iteration over a collection of specified type
    //   return await _context.Users
    //     .Include(user => user.Photos)
    //     .ToListAsync();
    // }

    public async Task<bool> SaveAllAsync() {
      return await _context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user) {
      _context.Entry(user).State = EntityState.Modified;
    }
  }
}