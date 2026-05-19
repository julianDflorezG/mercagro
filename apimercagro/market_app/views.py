from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import ProductoDeMercadoSerializers
from .models import ProductoDeMercado
from rest_framework import permissions

class ListaCrearProdutoView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


    def get(self, request):
        productos= ProductoDeMercado.objects.all().order_by("-id")
        serializer= ProductoDeMercadoSerializers(productos, many= True)
        return Response(serializer.data)


    def post(self, request):
        serializer= ProductoDeMercadoSerializers(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class DetalleProdutoView(APIView):

    permission_classes= [IsAdminUser]

    def get_objetc(self, pk):
        try:
            return ProductoDeMercado.objects.get(pk= pk)
        except ProductoDeMercado.DoesNotExist:
            return None


    def get(self, request, pk):
        producto= self.get_objetc(pk)

        if not producto:
            return Response({"error":"Producto no encontrado"}, status= status.HTTP_404_NOT_FOUND)
        
        serializer= ProductoDeMercadoSerializers(producto)

        return Response(serializer.data)
    

    def put(self, request, pk):
        producto= self.get_objetc(pk)

        if not producto:
            return Response({"error":"Producto no encontrado"}, status= status.HTTP_404_NOT_FOUND)
        
        serializer= ProductoDeMercadoSerializers(producto, data= request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje":"Producto actualizado con exito", "producto": serializer.data})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, pk):
        producto= self.get_objetc(pk)

        if not producto:
            return Response({"error":"Producto no encontrado"}, status= status.HTTP_404_NOT_FOUND)
        
        producto.delete()

        return Response({"mensaje": "Producto eliminado con exito"}, status=status.HTTP_204_NO_CONTENT)