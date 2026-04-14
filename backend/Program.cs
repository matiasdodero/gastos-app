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
    return Results.Ok(gastos);
});

app.MapPost("/api/gastos", (NuevoGasto nuevoGasto) =>
{
    if (string.IsNullOrWhiteSpace(nuevoGasto.Descripcion))
    {
        return Results.BadRequest(new { mensaje = "La descripción es obligatoria" });
    }

    if (nuevoGasto.Monto <= 0)
    {
        return Results.BadRequest(new { mensaje = "El monto debe ser mayor a 0" });
    }

    if (string.IsNullOrWhiteSpace(nuevoGasto.Categoria))
    {
        return Results.BadRequest(new { mensaje = "La categoría es obligatoria" });
    }

    var nuevoId = gastos.Count == 0 ? 1 : gastos.Max(g => g.Id) + 1;

    var gasto = new Gasto(
        nuevoId,
        nuevoGasto.Descripcion,
        nuevoGasto.Monto,
        nuevoGasto.Categoria
    );

    gastos.Add(gasto);

    return Results.Created($"/api/gastos/{gasto.Id}", gasto);
});

app.MapDelete("/api/gastos/{id:int}", (int id) =>
{
    var gasto = gastos.FirstOrDefault(g => g.Id == id);

    if (gasto is null)
    {
        return Results.NotFound(new { mensaje = "Gasto no encontrado" });
    }

    gastos.Remove(gasto);

    return Results.NoContent();
});

app.Run();

record Gasto(int Id, string Descripcion, decimal Monto, string Categoria);

record NuevoGasto(string Descripcion, decimal Monto, string Categoria);