using Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Api.Controllers;
[ApiController, Route("api/orders")]
public class OrdersController(AppDb db) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var order = await db.Orders.Include(o => o.Customer).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();
        return Ok(new { order.Id, order.Total, CustomerName = order.Customer!.Name.ToUpper() });
    }
}
