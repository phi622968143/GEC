# Generated by Django 4.1.7 on 2024-08-28 09:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("back", "0006_customer_orderdetail_order"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customer",
            name="phone",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]