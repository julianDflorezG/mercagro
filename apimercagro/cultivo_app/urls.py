from django.urls import path
from .views import (
    ListaCrearCultivoView,
    DetalleCultivoView,
    CultivosPublicadosView
)

urlpatterns = [
    path('', ListaCrearCultivoView.as_view(), name='lista_crear_cultivos'),
    path('<int:pk>/', DetalleCultivoView.as_view(), name='detalle_cultivo'),
    path('publicados/lista/', CultivosPublicadosView.as_view(), name='cultivos_publicados'),
]
