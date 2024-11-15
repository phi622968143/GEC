from django.urls import path
from . import views

urlpatterns = [
    
    path('api/product', views.GetProduct, name='GetProduct'),
    path('api/product/post', views.PostProduct, name='PostProduct'),
    path('api/product/patch/<int:id>', views.PatchPic, name='PatchProduct'),
    path('api/product/delete/<int:id>', views.DeleteProduct, name='DeleteProduct'),
    
    path('api/img', views.GetPic, name='GetPic'),
    path('api/img/post', views.PostPic, name='PostPic'),
    path('api/img/patch/<int:id>', views.PatchPic, name='PatchPic'),
    path('api/img/delete/<int:id>', views.DeletePic, name='DeletePic'),
    
    path('api/audio', views.GetAudio, name='GetAudio'),
    path('api/audio/post', views.PostAudio, name='PostAudio'), 
    path('api/audio/patch/<int:id>', views.PatchAudio, name='PatchAudio'),
    path('api/audio/delete/<int:id>', views.DeleteAudio, name='DeleteAudio'),
   
    path('api/order/post', views.PostOrder, name='PostOrder'),
    path('api/order/get', views.GetOrder, name='GetOrder'),
    path('api/orderdetail/<int:id>', views.GetOrderDetail, name='GetOrderDetail'),
    
    path('api/product_page/<int:category>',views.product_page,name="product_page"),
    path('api/cart/add',views.add_to_cart,name="add_to_cart"),
    path('api/cart/view/<int:usr_id>',views.view_cart,name="view_cart"),
    path('api/cart/delete/<int:item_id>',views.delete_cart_item,name="delete_cart_item"),
    
]