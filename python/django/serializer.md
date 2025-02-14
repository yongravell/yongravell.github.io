# 序列化器

## **序列化器中使用反向查询外键字段**

我有一个API端点返回宠物及其主人

每位所有者都有一个名称,一个或多个宠物,每只宠物都有一个名字,一个所有者

示例Django模型：

```python
class Owner(models.Model):
    name = models.CharField(max_length=200)

class Pet(models.Model):
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
```



我已将我的API配置为返回JSON数据，如下所示：

```json
[
    {
        "id": 2,
        "name": "Scotch",
        "owner": {
            "id": 2,
            "name": "Ben"
        }
    },
    {
        "id": 3,
        "name": "Fluffy",
        "owner": {
            "id": 1,
            "name": "Fred"
        }
    },
    {
        "id": 1,
        "name": "Spot",
        "owner": {
            "id": 1,
            "name": "Fred"
        }
    }
]

```



示例DRF序列化程序：

```python
class OwnerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Owner
        fields = ("id", "name")

class PetSerializer(serializers.HyperlinkedModelSerializer):
    owner = OwnerSerializer()
    class Meta:
        model = Pet
        fields = ("id", "name", "owner")
```



虽然这一切都很精致，但我真的希望有一个能够返回所有者及其宠物列表的端点。所以我得到了这些数据：

```json
[
    {
        "id": 1,
        "name": "Fred",
        "pets": [
            { "id": 1, "name": "Spot" },
            { "id": 3, "name": "Fluffy" }
        ]
    },
    {
        "id": 2,
        "name": "Ben",
        "pets": [
            { "id": 2, "name": "Scotch" }
        ]
    }
]
```



我如何实现这一输出？

您需要将`pet_set`字段添加到OwnerSerializer，如下所示：

```python
class PetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pet
        fields = ("id", "name")

class OwnerSerializer(serializers.HyperlinkedModelSerializer):
    pet_set = PetSerializer(many=True, read_only=True)
    class Meta:
        model = Owner
        fields = ("id", "name", "pet_set")
```



这将有效，因为在您的情况下，多对一关系默认反向查找名称为`_set`或`pet_set`。您可以使用`related_name`：进行更改

```python
class Pet(models.Model):
    owner = models.ForeignKey(Owner, related_name='pets', on_delete=models.CASCADE)
```



在这种情况下，您可以在序列化程序中使用pets名称：

```python
class OwnerSerializer(serializers.HyperlinkedModelSerializer):
    pets = PetSerializer(many=True, read_only=True)
```



现在在`OwnerListView`中，您可以使用这个新的序列化程序：

```python
class OwnerListView(ListAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
```



更改/添加 **serializer.py** ，如下所示

```python
class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ("id", "name")


class OwnerNewSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, source='pet_set')

    class Meta:
        model = Owner
        fields = ('id', 'name', 'pets')
```



和 **views.py**

```python
class OwnerAPI(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerNewSerialize
```





## 反向关联外键字段 

反序列化用PrimaryKeyRelatedField指定字段 并传入查询集 即关联的字段即可

实现效果和正向查询时一样 

反序列化时 可以通过 传入列表[1,2]的形式来改变外键关系

示例：

```python
class HostSerializer(serializers.ModelSerializer):
    group_queryset = Group.objects.all()
    group = serializers.PrimaryKeyRelatedField(source='group_set',many=True,queryset=group_queryset)

    class Meta:
        model = Host
        fields = '__all__'
        read_only_fields = ('id',)
```

