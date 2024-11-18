from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Product,ProductImg,ProductAudio,Customer,CartItem
from .serializers import *
from django.core.files.storage import default_storage
from .process_audio import process_audio
from django.core.files.uploadedfile import SimpleUploadedFile
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

#Back-containing Product info Ops
@api_view(['GET'])
def GetProduct(request):
    try:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)## is a list
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def GetPic(request):
    product_id=request.query_params.get('product_id')
    try:
        if product_id:
            images = ProductImg.objects.filter(product_id=product_id)
        else:
            images = ProductImg.objects.all()
        serializer = ProductImgSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def GetAudio(request):
    try:
        audios = ProductAudio.objects.all()
        serializer = ProductAudioSerializer(audios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def PostProduct(req):
        serializer = ProductSerializer(data=req.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def PostPic(req):
    
    serializer=ProductImgSerializer(data=req.data) #give he the food bro
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def PostAudio(req):
    
    if 'audio' not in req.FILES:
        return Response({"error": "No audio file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    audio_file = req.FILES['audio']
 
    product_id=req.data.get('product')
    
    processed_audio = SimpleUploadedFile(
        name=f"processed_audio_{product_id}.mp3",
        content=process_audio(audio_file),
        content_type='audio/mp3'
    )
    
    product_audio = ProductAudio(
        product_id=product_id,
        equipment=req.data.get('equipment'),
        audio=processed_audio
    )
    
    product_audio.save()
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['PATCH'])
def PatchPic(req,id):
    
    try:
        img=ProductImg.objects.get(pk=id)
    except ProductImg.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer=ProductImgSerializer(img,data=req.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def PatchAudio(req,id):
    try:
        audio = ProductAudio.objects.get(pk=id) #retrieve Obj
    except ProductAudio.DoesNotExist:
        return Response({"error": "Audio file not found"}, status=status.HTTP_404_NOT_FOUND)
 
 
    if 'audio' in req.FILES:
        audio_file = req.FILES['audio']
        processed_audio = SimpleUploadedFile(
            name=f"processed_audio_{id}.mp3",  # 使用 ID 作为文件名的一部分
            content=process_audio(audio_file),
            content_type='audio/mp3'
        )
        audio.audio=processed_audio
    if 'equipment' in req.data:
        audio.equipment=req.data.get("equipment")
    
    audio.save()#save partial
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['PATCH'])
def PatchProduct(req, id):
    try:
       product=Product.objects.get(pk=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=req.data, partial=True)  #obj,upData,partial
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def DeletePic(req, id):
    try:
        pic = ProductImg.objects.get(pk=id)
        
        # 删除文件
        if pic.img:
            # 通过默认的文件存储系统删除文件
            file_path = pic.img.path #inheirent from filefield
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
        
        pic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except ProductImg.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def DeleteAudio(req, id):
    try:
        audio = ProductAudio.objects.get(pk=id)
        
        if audio.audio:
          
            file_path = audio.audio.path #inheirent from filefield
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
        
        audio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except ProductAudio.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def DeleteProduct(req, id):
    try:
        product = Product.objects.get(pk=id)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


#Front
@api_view(['GET'])
def product_page(req,category):
    products=Product.objects.filter(category=category)
    products_data=ProductSerializer(products,many=True).data
    for product in products_data:
        
        product_id=product['id']
       
        primary_img=ProductImg.objects.filter(product=product_id,primary=True)
        audios=ProductAudio.objects.filter(product=product_id)
        
        product['img']=ProductImgSerializer(primary_img,many=True).data
        product['audio_samples']=ProductAudioSerializer(audios,many=True).data
    
    return Response(products_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def view_cart(req,usr_id):
   
    cart_items = CartItem.objects.filter(customer=usr_id)
    tot_price = sum(item.product.price * item.quantity for item in cart_items)
    cart_item_serializer = CartItemSerializer(cart_items, many=True)
    
    product_info_list = []
    for cart_item in cart_item_serializer.data:
        product_id=cart_item['product']
        product = Product.objects.get(id=product_id)
        product_serialized = ProductSerializer(product)
        product_info_list.append(product_serialized.data)
        
    response_data = {
        "cart_items": cart_item_serializer.data,
        "product_info":product_info_list,
        "total_price": tot_price
    }
    # print(response_data)
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_to_cart(req):
    serializer = CartItemSerializer(data=req.data)
    print(serializer.is_valid())
    print("Errors:", serializer.errors)
    if serializer.is_valid():
        try:
            user_id = serializer.validated_data.get('customer')
            product_id = serializer.validated_data.get('product')
            
            cart_item,created=CartItem.objects.get_or_create(customer=user_id,product=product_id)
            cart_item.quantity+=1
            cart_item.save()
            
            return Response(status=status.HTTP_201_CREATED)
        except :
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response("invalid")

@api_view(['DELETE'])
def delete_cart_item(req,item_id):
    try:
        item=CartItem.objects.get(id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found or does not belong to the user.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def PostOrder(req):
    order=req.data.copy()
    order_detail=order.pop("order_details") #get detail
    order_serializer = OrderSerializer(data=order)
    if order_serializer.is_valid():
        order = order_serializer.save()
        order_detail['order']=order.id       #relation #single obj
        detail_serializer = OrderDetailSerializer(data=order_detail)
        
        if detail_serializer.is_valid():
            detail_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            raise serializers.ValidationError(detail_serializer.errors)
    else:
        raise serializers.ValidationError(detail_serializer.errors) 

@api_view(['GET'])
def GetOrder(request):
    try:
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def GetOrderDetail(request,id):
    try:
        orders = OrderDetail.objects.get(order=id)
        serializer = OrderDetailSerializer(orders)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request, id):
    try:
        customer = get_object_or_404(Customer, id=id)
        return Response({"name": customer.FN}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    
#OAuth
#check out(ECPAY TEST)

