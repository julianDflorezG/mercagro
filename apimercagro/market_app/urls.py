from django.urls import path
from .views import ListaCrearProdutoView, DetalleProdutoView

urlpatterns = [ 
    path('productos/', ListaCrearProdutoView.as_view(), name="productos"), 
    path('productos/<int:pk>/', DetalleProdutoView.as_view(), name="detalle_producto"), 
]