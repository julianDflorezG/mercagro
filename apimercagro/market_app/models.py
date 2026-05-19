from django.db import models

class ProductoDeMercado(models.Model):

    nombre= models.CharField(max_length=100, unique=True)
    precio_referencia= models.DecimalField(max_digits=10, decimal_places=2)
    unidad_medida= models.CharField(max_length=20, default="kg")
    fecha_actualizacion= models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.precio_referencia} {self.unidad_medida}"

    class Meta:
        ordering= ["nombre"]
