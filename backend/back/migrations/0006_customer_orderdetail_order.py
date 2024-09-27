# Generated by Django 4.1.7 on 2024-08-28 09:23

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("back", "0005_product_category_alter_productaudio_audio"),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.IntegerField(null=True)),
                ("FN", models.CharField(max_length=20)),
                ("LN", models.CharField(max_length=30)),
                ("City", models.CharField(max_length=20)),
                (
                    "skill_lv",
                    models.CharField(
                        choices=[
                            ("beginner", "初學者"),
                            ("intermediate", "中級"),
                            ("advanced", "高級"),
                        ],
                        max_length=50,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="OrderDetail",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "product_num",
                    models.SmallIntegerField(
                        validators=[
                            django.core.validators.MaxValueValidator(10),
                            django.core.validators.MinValueValidator(1),
                        ]
                    ),
                ),
                ("city", models.CharField(max_length=20)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="detail",
                        to="back.product",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("pay_method", models.CharField(max_length=20)),
                ("order_date", models.DateTimeField(auto_now_add=True)),
                ("send_day", models.DateField()),
                ("is_send", models.BooleanField()),
                (
                    "customer_email",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="order",
                        to="back.customer",
                    ),
                ),
            ],
        ),
    ]
