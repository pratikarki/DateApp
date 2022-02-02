using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
  [ApiController] // signifies that this particular class is of type ApiController
  [Route("[controller]")] // controller = "WeatherForecast" i.e. "WeatherForecast" is controller route

  public class WeatherForecastController : ControllerBase { // every controller needs to derive from ControllerBase class 
    private static readonly string[] Summaries = new[] {
      "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger) {
      _logger = logger;
    }

    [HttpGet] //controller endpoint
    public IEnumerable<WeatherForecast> Get() {
      var rng = new Random();
      return Enumerable.Range(1, 5).Select(index => new WeatherForecast {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
      }).ToArray();
    }
  }
}
