from rest_framework import serializers
from .models import Cultivo


class CultivoSerializer(serializers.ModelSerializer):

    agricultor_nombre = serializers.CharField(source='agricultor.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = Cultivo
        fields = [
            'id',
            'agricultor',
            'agricultor_nombre',
            'producto',
            'producto_nombre',
            'descripcion',
            'imagen',
            'cantidad',
            'unidad_medida',
            'precio',
            'estado',
            'fecha_creacion',
        ]
        read_only_fields = ['id', 'agricultor', 'fecha_creacion', 'agricultor_nombre', 'producto_nombre']


    def validate(self, data):
        estado = data.get('estado', getattr(self.instance, 'estado', 'REGISTRO'))
        producto = data.get('producto') or (self.instance and self.instance.producto)
        precio = data.get('precio') or (self.instance and self.instance.precio)
        imagen = data.get('imagen') or (self.instance and self.instance.imagen)
  
        if estado == 'PUBLICADO':
     
            if not producto:
                raise serializers.ValidationError({"producto": "Debe seleccionar un producto del mercado."})
    
            if not precio:
                raise serializers.ValidationError({"precio": "El precio es obligatorio para publicar el cultivo."})
      
            if precio >= producto.precio_referencia:
                raise serializers.ValidationError({
                    "precio": f"El precio debe estar por debajo del precio de mercado: {producto.precio_referencia}"
                })
    
            if not imagen:
                raise serializers.ValidationError({"imagen": "Debe incluir una imagen para publicar el cultivo."})
 
        return data


    def create(self, validated_data):
        return Cultivo.objects.create(**validated_data)


    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
