from rest_framework import serializers
from .models import ProductoDeMercado

class ProductoDeMercadoSerializers(serializers.ModelSerializer):

    class Meta:
        model= ProductoDeMercado
        fields= ["id", "nombre", "precio_referencia", "unidad_medida", "fecha_actualizacion"]
        read_only_fields= ["id", "fecha_actualizacion"]
