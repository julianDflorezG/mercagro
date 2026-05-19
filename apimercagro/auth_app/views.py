from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UsuarioSerializers
from .models import Usuario

class RegistroView(APIView):
    def post(self, request):
        serializer= UsuarioSerializers(data= request.data)

        if serializer.is_valid():
            usuario= serializer.save()

            return Response({
                "mensaje": "Usuario registrado exitosamente",
                "usuario": {
                    "id": usuario.id,
                    "email": usuario.email,
                    "nombre": usuario.nombre,
                    "rol": usuario.rol
                }
            }, status= status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


class UsuarioView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self, request):
        serializer= UsuarioSerializers(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        return self.update_usuario(request, partial= False)
    
    def patch(self, request):
        return self.update_usuario(request, partial= True)
    
    def update_usuario(self, request, partial):
        serializer= UsuarioSerializers(request.user, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje":"Usuario actualizado exitosamente", "usuario": serializer.data})

        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        request.user.delete()
        return Response({"mensaje":"Usuario eliminado exitosamente"}, status= status.HTTP_204_NO_CONTENT)


class ListaUsuariosView(APIView):
    permission_classes= [IsAdminUser]

    def get(self, request):
        usuarios= Usuario.objects.all()
        serializer= UsuarioSerializers(usuarios, many=True)
        return Response(serializer.data)


