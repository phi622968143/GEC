from django.contrib import admin
from .models import *


admin.site.register(Product)
admin.site.register(ProductImg)
admin.site.register(ProductAudio)
admin.site.register(Order)
admin.site.register(OrderDetail)

admin.site.register(Customer)
admin.site.register(CartItem)