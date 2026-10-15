using Api.Data; using Microsoft.EntityFrameworkCore;
var b = WebApplication.CreateBuilder(args);
b.Services.AddDbContext<AppDb>(o => o.UseSqlServer(b.Configuration.GetConnectionString("Main")));
b.Services.AddControllers();
var app = b.Build(); app.MapControllers(); app.Run();
