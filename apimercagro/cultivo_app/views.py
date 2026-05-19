from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cultivo
from .serializers import CultivoSerializer


class ListaCrearCultivoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cultivos = Cultivo.objects.filter(agricultor=request.user)
        serializer = CultivoSerializer(cultivos, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CultivoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(agricultor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleCultivoView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return Cultivo.objects.filter(pk=pk, agricultor=user).first()


    def handle_not_found(self, cultivo):
        if not cultivo:
            return Response({'error': 'Cultivo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return None


    def get(self, request, pk):
        cultivo = self.get_object(pk, request.user)
        if error := self.handle_not_found(cultivo):
            return error
        serializer = CultivoSerializer(cultivo, context={'request': request})
        return Response(serializer.data)


    def put(self, request, pk):
        cultivo = self.get_object(pk, request.user)
        if error := self.handle_not_found(cultivo):
            return error
        serializer = CultivoSerializer(cultivo, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Cultivo actualizado", "cultivo": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def patch(self, request, pk):
        cultivo = self.get_object(pk, request.user)
        if error := self.handle_not_found(cultivo):
            return error
        serializer = CultivoSerializer(cultivo, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Cultivo actualizado", "cultivo": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 

    def delete(self, request, pk):
        cultivo = self.get_object(pk, request.user)
        if error := self.handle_not_found(cultivo):
            return error
        cultivo.delete()
        return Response({'mensaje': 'Cultivo eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)


class CultivosPublicadosView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        cultivos = Cultivo.objects.filter(estado='PUBLICADO')

        if request.user.rol == 'COMPRADOR':
            cultivos_con_solicitud = request.user.solicitudes_enviadas.values_list('cultivo_id', flat=True)
            cultivos = cultivos.exclude(id__in=cultivos_con_solicitud)

        cultivos = cultivos.exclude(
            solicitudes_recibidas__estado__in=['ACEPTADA', 'COMPLETADA']
        ).distinct()

        serializer = CultivoSerializer(cultivos, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

