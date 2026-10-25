// Synthetic fixture for failure case FC-0002. Never built or run.
using Microsoft.AspNetCore.Mvc;
namespace Api.Controllers;
[ApiController, Route("api/orders")]
public class OrdersController : ControllerBase
{
    [HttpGet("{id:int}")]
    public IActionResult Get(int id) => Ok(new { id, status = "placed", total = 42.50m });
}
