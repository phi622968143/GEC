from django.db import models
from django.core.files.storage import default_storage
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone

class Customer(models.Model):
    email=models.EmailField()    
    phone=models.IntegerField(blank=True,null=True)
    FN=models.CharField(max_length=20)
    LN=models.CharField(max_length=30)
    City=models.CharField(max_length=20)
    skill_lv=models.CharField(max_length=50, choices=[
        ('beginner', '初學者'),
        ('intermediate', '中級'),
        ('advanced', '高級')
    ]) 
class Product(models.Model):
    CATEGORY_CHOICES=[
        (1, 'Electric Guitar'),
        (2, 'Amplifier'),
        (3, 'Effects Pedal'),
        (4, 'Gig Bag'),
    ]
    name= models.CharField(max_length=100)
    price=models.IntegerField()
    brand=models.CharField(max_length=50)
    num=models.IntegerField()
    
    description=models.FileField(upload_to='media/product_description/', blank=True, null=True)
    
    skill_lv=models.CharField(max_length=50, choices=[
        ('beginner', '初學者'),
        ('intermediate', '中級'),
        ('advanced', '高級')
    ])  ##former for db storeage ,latter for browser
    
    category = models.IntegerField(choices=CATEGORY_CHOICES)
    
    def delete(self, *args, **kwargs):
        
        if self.description and default_storage.exists(self.description.name):
            default_storage.delete(self.description.name)
       
        for img in self.img.all():
            if default_storage.exists(img.img.name):
                default_storage.delete(img.img.name)

        for audio in self.audio_samples.all():
            if default_storage.exists(audio.audio.name):
                default_storage.delete(audio.audio.name)
        
        super(Product, self).delete(*args, **kwargs)
class CartItem(models.Model):
    customer=models.ForeignKey(Customer, related_name="customer", on_delete=models.CASCADE)
    product=models.ForeignKey(Product, related_name="cart", on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=0)
    date_added=models.DateField(auto_now_add=True)

class ProductImg(models.Model):
    product=models.ForeignKey(Product,related_name="img",on_delete=models.CASCADE)
    img=models.ImageField(upload_to='media/product_img/')
    primary= models.BooleanField(default=False)
    def save(self, *args, **kwargs):
         if self.primary:
                ProductImg.objects.filter(product=self.product, primary=True).update(primary=False)
         super(ProductImg, self).save(*args, **kwargs)
    def __str__(self):
        return str(self.id)
class ProductAudio(models.Model):
    product = models.ForeignKey(Product, related_name='audio_samples', on_delete=models.CASCADE)
    equipment=models.CharField(max_length=100, blank=True, null=True)## related eq
    audio=models.FileField(upload_to='media/product_audio/',blank=True, null=True)

class Order(models.Model):
    customer_email=models.ForeignKey(Customer, related_name="ordered_customer", on_delete=models.CASCADE)
    pay_method=models.CharField(max_length=20)
    order_date=models.DateTimeField(auto_now_add=True)
    send_time = models.DateTimeField(null=True, blank=True) 
    is_send=models.BooleanField(default=False)
    is_paid=models.BooleanField(default=False)  
    city = models.CharField(max_length=20, null=True, blank=True)
  
class OrderDetail(models.Model):
    order=models.ForeignKey(Order, related_name="order", on_delete=models.CASCADE)
    product=models.ForeignKey(Product, related_name="detail", on_delete=models.CASCADE)
    product_num=models.SmallIntegerField(
    validators=[
            MaxValueValidator(10),
            MinValueValidator(1)
    ])
     

