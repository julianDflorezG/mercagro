from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import SolicitudDeCompra
from .serializers import SolicitudDeCompraSerializer
from cultivo_app.models import Cultivo


class CrearSolicitudView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SolicitudDeCompraSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(comprador=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SolicitudesEnviadasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        solicitudes = SolicitudDeCompra.objects.filter(comprador=request.user)
        serializer = SolicitudDeCompraSerializer(solicitudes, many=True)
        return Response(serializer.data)


class SolicitudesRecibidasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        solicitudes = SolicitudDeCompra.objects.filter(cultivo__agricultor=request.user)
        serializer = SolicitudDeCompraSerializer(solicitudes, many=True)
        return Response(serializer.data)


class HistorialSolicitudesAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        solicitudes = SolicitudDeCompra.objects.all()
        serializer = SolicitudDeCompraSerializer(solicitudes, many=True)
        return Response(serializer.data)


class CambiarEstadoSolicitudView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            solicitud = SolicitudDeCompra.objects.select_related('cultivo', 'comprador').get(pk=pk)
        except SolicitudDeCompra.DoesNotExist:
            return Response({'error': 'Solicitud no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        nuevo_estado = request.data.get('estado')
        usuario = request.user
        es_agricultor = solicitud.cultivo.agricultor == usuario
        es_comprador = solicitud.comprador == usuario

        if nuevo_estado not in dict(SolicitudDeCompra.ESTADOS):
            return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)

        estado_actual = solicitud.estado

        if nuevo_estado == 'ACEPTADA':
            if not es_agricultor or estado_actual != 'PENDIENTE':
                return Response({'error': 'Solo el agricultor puede aceptar una solicitud pendiente.'}, status=status.HTTP_403_FORBIDDEN)

        elif nuevo_estado == 'RECHAZADA':
            if not es_agricultor or estado_actual != 'PENDIENTE':
                return Response({'error': 'Solo el agricultor puede rechazar una solicitud pendiente.'}, status=status.HTTP_403_FORBIDDEN)

        elif nuevo_estado == 'CANCELADA':
            if not es_comprador or estado_actual not in ['PENDIENTE', 'ACEPTADA']:
                return Response({'error': 'Solo el comprador puede cancelar una solicitud activa.'}, status=status.HTTP_403_FORBIDDEN)

        elif nuevo_estado == 'COMPLETADA':
            if not (es_agricultor or es_comprador) or estado_actual != 'ACEPTADA':
                return Response({'error': 'Solo agricultor o comprador pueden completar una solicitud aceptada.'}, status=status.HTTP_403_FORBIDDEN)

        else:
            return Response({'error': 'No tienes permiso para realizar esta acción.'}, status=status.HTTP_403_FORBIDDEN)

        solicitud.estado = nuevo_estado
        solicitud.save()
        serializer = SolicitudDeCompraSerializer(solicitud)
        return Response({'mensaje': f'Solicitud actualizada a {nuevo_estado}', 'solicitud': serializer.data})
