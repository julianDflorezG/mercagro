from django.db import models
from django.conf import settings
from cultivo_app.models import Cultivo


class SolicitudDeCompra(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),     
        ('ACEPTADA', 'Aceptada'),       
        ('RECHAZADA', 'Rechazada'),     
        ('CANCELADA', 'Cancelada'),     
        ('COMPLETADA', 'Completada'),  
    ]


    comprador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='solicitudes_enviadas')
    cultivo = models.ForeignKey(Cultivo, on_delete=models.CASCADE, related_name='solicitudes_recibidas')
    mensaje = models.TextField(blank=True)
    estado = models.CharField(max_length=20,choices=ESTADOS,default='PENDIENTE')

    fecha_creacion = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.comprador.nombre} → {self.cultivo.nombre} [{self.estado}]"


    class Meta:
        verbose_name = "Solicitud de Compra"
        verbose_name_plural = "Solicitudes de Compra"
        ordering = ['-fecha_creacion']
        unique_together = ['comprador', 'cultivo']
