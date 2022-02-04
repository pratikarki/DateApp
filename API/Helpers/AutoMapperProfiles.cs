using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
  public class AutoMapperProfiles: Profile {
    public AutoMapperProfiles() {
      CreateMap<AppUser, MemberDto>()
        .ForMember(
          dest => dest.PhotoUrl, // PhotoUrl as destination property
          opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url) 
          // we want to map PhotoUrl from Photos collection where isMain is true and get its Url
        )
        .ForMember(
          dest => dest.Age,
          opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge())
        );
      CreateMap<Photo, PhotoDto>(); // <MAP FROM, MAP TO>

      CreateMap<MemberUpdateDto, AppUser>();
    }
  }
}