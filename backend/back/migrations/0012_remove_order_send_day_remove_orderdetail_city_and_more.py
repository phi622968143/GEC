# Generated by Django 4.1.7 on 2024-10-09 17:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("back", "0011_alter_order_order_date"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="send_day",
        ),
        migrations.RemoveField(
            model_name="orderdetail",
            name="city",
        ),
        migrations.AddField(
            model_name="order",
            name="city",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="order",
            name="is_paid",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="order",
            name="send_time",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="orderdetail",
            name="order",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="order",
                to="back.order",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="order",
            name="customer_email",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="ordered_customer",
                to="back.customer",
            ),
        ),
    ]