from django.urls import path
from .views import (
    CrearSolicitudView,
    SolicitudesEnviadasView,
    SolicitudesRecibidasView,
    HistorialSolicitudesAdminView,
    CambiarEstadoSolicitudView
)

urlpatterns = [
    path('crear/', CrearSolicitudView.as_view(), name='crear_solicitud'),
    path('enviadas/', SolicitudesEnviadasView.as_view(), name='solicitudes_enviadas'),
    path('recibidas/', SolicitudesRecibidasView.as_view(), name='solicitudes_recibidas'),
    path('historial/', HistorialSolicitudesAdminView.as_view(), name='historial_solicitudes'),
    path('estado/<int:pk>/', CambiarEstadoSolicitudView.as_view(), name='cambiar_estado_solicitud'),
]
