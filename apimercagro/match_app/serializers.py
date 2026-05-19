from rest_framework import serializers
from .models import SolicitudDeCompra


class SolicitudDeCompraSerializer(serializers.ModelSerializer):

    comprador_nombre = serializers.CharField(source='comprador.nombre', read_only=True)
    cultivo_nombre = serializers.CharField(source='cultivo.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='cultivo.producto.nombre', read_only=True)

    class Meta:
        model = SolicitudDeCompra
        fields = [
            'id',
            'comprador',
            'comprador_nombre',
            'cultivo',
            'cultivo_nombre',
            'producto_nombre',
            'mensaje',
            'estado',
            'fecha_creacion'
        ]

        read_only_fields = [
            'id',
            'comprador',
            'comprador_nombre',
            'cultivo_nombre',
            'producto_nombre',
            'estado',
            'fecha_creacion'
        ]


    def validate(self, data):
        cultivo = data.get('cultivo')
        comprador = self.context['request'].user

        if cultivo.estado != 'PUBLICADO':
            raise serializers.ValidationError("Este cultivo no está disponible para recibir solicitudes.")

        if cultivo.solicitudes_recibidas.filter(estado__in=['ACEPTADA', 'COMPLETADA']).exists():
            raise serializers.ValidationError("Este cultivo ya tiene una solicitud activa y no puede recibir más.")
  
        if cultivo.solicitudes_recibidas.filter(comprador=comprador).exists():
            raise serializers.ValidationError("Ya enviaste una solicitud para este cultivo.")
 
        return data

    def create(self, validated_data):
        return SolicitudDeCompra.objects.create(**validated_data)
