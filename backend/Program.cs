var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("frontend");

var gastos = new List<Gasto>
{
    new Gasto(1, "Supermercado", 12500, "Comida"),
    new Gasto(2, "Sube", 3000, "Transporte"),
    new Gasto(3, "Netflix", 5000, "Entretenimiento")
};

app.MapGet("/api/gastos", () =>
{
    return gastos;
});

app.Run();

record Gasto(int Id, string Descripcion, decimal Monto, string Categoria);