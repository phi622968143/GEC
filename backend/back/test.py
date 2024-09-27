from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Product, ProductImg,ProductAudio
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
import os

class PicTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
        self.txt_path = os.path.join(settings.DATA_ROOT, 'test', 'test.txt')
        self.image_path = os.path.join(settings.DATA_ROOT, 'test', 'test.png')
        self.audio_path = os.path.join(settings.DATA_ROOT, 'test', 'test.mp3')
        
        with open(self.txt_path, 'rb') as f:
            self.txt_content = f.read()
        with open(self.image_path, 'rb') as f:
            self.image_content = f.read()
        with open(self.audio_path, 'rb') as f:
            self.audio_content = f.read()
        
        self.txt_file = SimpleUploadedFile(
            name='test.txt',
            content=self.txt_content,  # 这里是从测试文件中读取的内容
            content_type='text/plain'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            price=100,
            brand='Test Brand',
            num=10,
            description=self.txt_file,
            skill_lv='beginner',
            category=1
        )
        
    # def test_post_product(self):
    #     url = reverse('PostProduct')
        
    #     data = {
    #         "name": "Test Product",
    #         "price": 100.00,
    #         "brand": "Test Brand",
    #         "num": 10,
    #         "description": self.product.description,
    #         "skill_lv": "beginner",
    #         "category": 1
    #     }

    #     response = self.client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    #     url = reverse('DeleteProduct', args=[self.product.id])
    #     response = self.client.delete(url)
        
    # def test_post_pic(self):
        
    #     url = reverse('PostPic')
    #     image = SimpleUploadedFile(
    #         name='test.png',
    #         content=self.image_content,
    #         content_type='image/png'
    #     )
    #     data = {
    #         'product': self.product.id,
    #         'img': image,
    #         'primary': False
    #     }
    #     response = self.client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    #     url = reverse('DeletePic', args=[self.product.id])
    #     response = self.client.delete(url)

    # def test_post_audio(self):
    #     url = reverse('PostAudio')
        
    #     audio_file = SimpleUploadedFile(
    #         name='test.mp3',
    #         content=self.audio_content,
    #         content_type='audio/mp3'
    #     )
      
    #     data = {
    #         'product': self.product.id,
    #         'equipment': 'neighbor',
    #         'audio': audio_file
    #     }
        
    #     response = self.client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    #     url = reverse('DeleteAudio', args=[self.product.id])
    #     response = self.client.delete(url)
   
    # def test_get_product(self):
    #     url = reverse('GetProduct', args=[self.product.id])
    #     response = self.client.get(url)
        
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['name'], 'Test Product')
        
    #     url = reverse('DeleteProduct', args=[self.product.id])
    #     response = self.client.delete(url)
    
    # def test_get_pic(self):
    #     image = SimpleUploadedFile(
    #         name='test.png',
    #         content=self.image_content,
    #         content_type='image/png'
    #     )
    #     product_img = ProductImg.objects.create(
    #         product=self.product,
    #         img=image,
    #         primary=False
    #     )
    #     url = reverse('GetPic', args=[product_img.id])
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    #     url = reverse('DeletePic', args=[product_img.id])
    #     response = self.client.delete(url)
    
    # def test_get_audio(self):
    #     audio_file = SimpleUploadedFile(
    #         name='test.mp3',
    #         content=self.audio_content,  # 这里是从测试文件中读取的内容
    #         content_type='audio/mp3'
    #     )
    #     product_audio = ProductAudio.objects.create(
    #         product=self.product,
    #         equipment='Test Equipment',
    #         audio= audio_file
    #     )
        
    #     url = reverse('GetAudio', args=[product_audio.id])
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    # def test_delete_pic(self):
    #     image = SimpleUploadedFile(
    #         name='test.png',
    #         content=self.image_content,
    #         content_type='image/png'
    #     )
    #     product_img = ProductImg.objects.create(
    #         product=self.product,
    #         img=image,
    #         primary=False
    #     )
    #     url = reverse('DeletePic', args=[product_img.id])
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(ProductImg.objects.count(), 0)
    
    # def test_delete_audio(self):
    #     audio = SimpleUploadedFile(
    #         name='test.mp3',
    #         content=self.audio_content,
    #         content_type='audio/mp3'
    #     )
    #     product_audio = ProductAudio.objects.create(
    #         product=self.product,
    #         equipment='test eq',
    #         audio=audio
    #     )
    #     url = reverse('DeleteAudio', args=[product_audio.id])
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(ProductAudio.objects.count(), 0)
    
    # def test_delete_product(self):
    #     url = reverse('DeleteProduct', args=[self.product.id])
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    # def test_patch_pic(self):
        
    #     image = SimpleUploadedFile(
    #         name='test.png',
    #         content=self.image_content,
    #         content_type='image/png'
    #     )
    #     data = {
    #         'product': self.product.id,
    #         'img': image,
    #         'primary': False
    #     }
    #     patch_data={'primary': True}
        
    #     post_url = reverse('PostPic')
    #     post_response = self.client.post(post_url, data, format='multipart')
    #     image_id = post_response.data['id']


    #     patch_url = reverse('PatchPic', args=[image_id])
    #     patch_response = self.client.patch(patch_url, patch_data, format='json')
    #     self.assertEqual(patch_response.status_code, status.HTTP_200_OK)

    #     get_url = reverse('GetPic', args=[image_id])
    #     get_response = self.client.get(get_url)

    #     self.assertEqual(get_response.data['primary'], True)
        

    