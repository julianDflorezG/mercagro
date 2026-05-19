from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegistroView, UsuarioView, ListaUsuariosView

urlpatterns = [ 
    path('registro/', RegistroView.as_view(), name="registro"), 
    path('login/', TokenObtainPairView.as_view(), name="login"), 
    path('refresh/', TokenRefreshView.as_view(), name="refresh"), 
    path('usuario/', UsuarioView.as_view(), name="usuario"), 
    path('usuarios/', ListaUsuariosView.as_view(), name="usuarios"), 
]
# http://localhost:8000/api/auth/registro/
# http://localhost:8000/api/auth/login/
# http://localhost:8000/api/auth/refresh/
# http://localhost:8000/api/auth/usuario/
# http://localhost:8000/api/auth/usuarios/