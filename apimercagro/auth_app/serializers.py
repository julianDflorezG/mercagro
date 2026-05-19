from rest_framework import serializers
from .models import Usuario

class UsuarioSerializers(serializers.ModelSerializer):
    clave= serializers.CharField(write_only= True, required= False, min_length= 6)

    class Meta:
        model= Usuario
        fields= ["id", "email", "nombre", "rol", "clave"]
        read_only_fields= ["id"]


    def create(self, validated_data): 

        clave= validated_data.pop("clave", None)
        
        usuario= Usuario(**validated_data)

        if clave:
            usuario.set_password(clave)

        usuario.save()
        
        return usuario


    def update(self, instance, validated_data):

        clave= validated_data.pop("clave", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if clave:
            instance.set_password(clave)
        
        instance.save()

        return instance
    
