// .NET 8 contrast fixture (TF-24). The runner first builds the tests as-is and
// expects CS0122 (Program is internal), then appends "public partial class Program { }".
var app = WebApplication.CreateBuilder(args).Build();
app.MapGet("/ping", () => "pong");
app.Run();
