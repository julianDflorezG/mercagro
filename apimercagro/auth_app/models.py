from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UsuarioManager(BaseUserManager):

    def create_user(self, email, nombre, password=None, rol="AGRICULTOR", **extra_fields):

        if not email:
            raise ValueError("El email es obligatorio")
        
        email= self.normalize_email(email.strip().lower())

        if rol not in dict(Usuario.ROLES):
            raise ValueError(f"Rol invalido: {rol}")
        

        usuario= self.model(email= email, nombre= nombre, rol= rol, **extra_fields)
        usuario.set_password(password)
        usuario.save(using= self.db)

        return usuario
    

    def create_superuser(self, email, nombre, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("El superusuario debe tener is_staff= True")
        if not extra_fields.get("is_superuser"):
            raise ValueError("El superusuario debe tener is_superuser= True")
        
        return self.create_user(email, nombre, password, rol="ADMIN", **extra_fields)
    

class Usuario(AbstractBaseUser, PermissionsMixin):

    ROLES= [
        ("AGRICULTOR", "Agricultor"),
        ("COMPRADOR", "Comprador"),
        ("ADMIN", "Administrador"),
    ]

    email= models.EmailField(unique=True)
    nombre= models.CharField(max_length=100)
    rol= models.CharField(max_length=20, choices=ROLES)
    is_active= models.BooleanField(default=True)
    is_staff= models.BooleanField(default=False)
    fecha_creacion= models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD= "email"
    REQUIRED_FIELDS= ["nombre"]

    objects= UsuarioManager()

    def __str__(self):
        return f"{self.nombre} ({self.rol})"
    

