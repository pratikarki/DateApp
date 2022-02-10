using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
  public static class ApplicationServiceExtensions {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) {
      services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
      services.AddScoped<IPhotoService, PhotoService>();
      services.AddScoped<ITokenService, TokenService>(); 
      // TokenService is scoped to the lifetime of a HTTP request and then disposed
      // when a request comes, this service is injected to the particular controller, then new instance --
      // of service is created. When request is finished, the service is disposed.
      services.AddScoped<LogUserActivity>();
      services.AddScoped<IUserRepository, UserRepository>();
      services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

      services.AddDbContext<DataContext>(options => { //passing expression as a parameter (using lambda expression)
        options.UseSqlite(config.GetConnectionString("DefaultConnection")); // accessing database via this connection string
      }); 
      return services;
    }
  }
}