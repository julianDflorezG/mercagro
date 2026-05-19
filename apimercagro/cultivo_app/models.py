from django.db import models
from django.conf import settings
from market_app.models import ProductoDeMercado  
import os


class Cultivo(models.Model):
 
    ESTADOS = [
        ('REGISTRO', 'Registro'),
        ('COSECHA', 'Cosecha'),
        ('PUBLICADO', 'Publicado'),
    ]

    agricultor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cultivos')
    producto = models.ForeignKey(ProductoDeMercado, on_delete=models.PROTECT, related_name='cultivos')
    descripcion = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='cultivos/', blank=True, null=True)
    cantidad = models.PositiveIntegerField()
    unidad_medida = models.CharField(max_length=20, default='kg')
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='REGISTRO')
    fecha_creacion = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.producto.nombre} ({self.estado}) - {self.agricultor.email}"


    def delete(self, *args, **kwargs):
        if self.imagen and os.path.isfile(self.imagen.path):
            os.remove(self.imagen.path)
        super().delete(*args, **kwargs)
 
 
    class Meta:
        ordering = ['-fecha_creacion']

