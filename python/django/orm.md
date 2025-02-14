# Django ORM 操作



## 单表的增删改查

1. 增加表数据

   ```python
   models.Publisher.objects.create(name='出版社1')
   models.Publisher.objects.create(<字段名='字段值'>,<字段名='字段值'>)
   ```

   

2. 修改表数据

   ```python
   models.Publisher.objects.update(name='出版社2')
   models.Publisher.objects.update(<字段名='字段值'>,<字段名='字段值'>)
   ```

   

3. 删除表数据

   ```python
   models.Publisher.objects.get(pk=pk).delete()
   ```

   

4. 查询表数据

   ```python
   models.Publisher.objects.all()
   ```



## 多表的增删改查

### 一对多外键增删改

1. 增加表数据

   ```python
   models.Book.objects.create(title='三国演示',price=123.23,publisher_id=1)
   pub_obj = models.Publisher.objects.get(pk=2)
   models.Book.objects.create(title='红楼梦',price=666.23,publisher=pub_obj)
   ```

   

2. 删除表数据

   ```python
   models.Publisher.objects.filter(pk=1).delete()
   ```

   

3. 修改表数据

   ```python
   models.Book.objects.filter(pk=1).update(publisher_id=2)
   pub_obj = models.Publisher.objects.get(pk=1)
   models.Book.objects.filter(pk=1).update(publisher=pub_obj)
   ```

   



### 多对多外键增删改查

1. 增加表数据

   ```python
   book_obj = models.Book.objects.filter(pk=1).first()
   book_obj.author.add(1,2,3)
   
   author_   obj = models.Author.objects.filter(pk__in=(1,2))
   book_obj.author.add(*author_obj)
   ```

   :::tip

   add给第三张关系表添加数据

   括号内既可以传数字也可以传对象,并且都支持多个              

   :::

   

2. 删除表数据

   ```python
   book_obj = models.Book.objects.filter(pk=2).first()
   book_obj.author.remove(2)
   author_obj = models.Author.objects.all()
   book_obj.author.remove(*author_obj)
   ```

   :::tip

   remove  括号内既可以传数字也可以传对象,并且都支持多个

   :::

   

3. 修改表数据

   ```python
   book_obj = models.Book.objects.filter(pk=1).first()
   book_obj.author.set([1,2])
   ```

   :::tip

   set  括号内必须传一个可迭代对象,该对象内既可以是数字也可以是对象,并且支持多个,先删除后新增              

   :::

   

4. 清空

   ```python
   book_obj.author.clear()
   ```

   :::tip

   clear    括号内不要加任何参数

   :::

   

   

## 多表查询

### 子查询(基于对象的跨表查询)

:::tip

在书写orm语句的时候跟写sql语句一样的 不要企图一次性将orm语句写完 

如果情况比较复杂 就写一点看一点 正向查询什么时候需要加`.all()`    

当你查询结果可能是多个数据的时候需要加`.all()`    

如果是一个则直接拿到数据对象 反向查询的时候 ,当你的查询结果可以有多个的时候 就必须加 `_set.all()`

当你只有一个结果的时候 就不需要加 `_set.all()`             

:::

示例:

1. 查询书籍主键为1的出版社

   ```python
   book_obj = models.Book.objects.filter(pk=1).first()
   print(book_obj.publisher.addr)
   ```

   

2. 查询书籍主键为2的作者

   ```python
   book_obj = models.Book.objects.filter(pk=2).first()
   print(book_obj.author.all())
   ```

3. 查询作者abc的电话号码

   ```python
   author_obj = models.Author.objects.filter(name='jason').first()
   print(author_obj.author_detail.phone)
   ```

   

4. 查询出版社是东方出版社出版的书

   ```python
   pub_obj = models.Publisher.objects.filter(name='东方出版社').first()
   res = pub_obj.book_set.all()
   print(res)
   ```

   

5. 查询作者是abc写过的书

   :::tip

   作者查书 反向 表名小写+set

   :::

   ```python
   author_obj = models.Author.objects.filter(name='abc').first()
   res = author_obj.book_set.all()
   print(res)
   ```

   

6. 查询手机号是110的作者姓名

   ```python
   authorde_obj = models.AuthorDetail.objects.filter(phone='110').first()
   print(authorde_obj.author)
   ```

   

### 连表查询(基于双下划线的跨表查询)

示例:

1. 查询abc的手机号

   ```python
   # 正向
   author_obj = models.Author.objects.filter(name='abc').first()
   res = author_obj.author_detail.phone
   print(res)
   # 反向
   res = models.Author.objects.filter(name='jason').values('author_detail__phone')
   print(res)
   ```

   

2. 查询书籍主键为1的出版社名称和书的名字

   ```python
   # 反向
   res = models.Publisher.objects.filter(book__pk='1').values('name','book__title')
   print(res)
   ```

   

3. 查询书籍主键为1的作者姓名

   ```python
   # 正向
   res = models.Book.objects.filter(pk=1).values('author__name')
   print(res)
   # 反向
   res = models.Author.objects.filter(book__pk=1).values('name')
   print(res)
   ```

   

4. 作者为abc出版的书

   ```python
   res = models.Author.objects.filter(name='abc').values('book__title')
   res = models.Book.objects.filter(author__name='abc').values('title')
   ```

   

5. 书籍为红楼梦的作者名称

   ```python
   res1 = models.Book.objects.filter(title='红楼梦').values('author__name')
   res2 = models.Author.objects.filter(book__title='红楼梦').values('name')
   print(res1)
   print(res2)
   ```

   

   ## 查看查询sql语句

方式一

```python
res = models.Publisher.objects.values_list('pk','name')
print(res.query)
```

:::tip

查看内部封装的sql语句

上述查看sql语句的方式 只能用于queryset对象

只有queryset对象才能够点出query查看内部的sql语句              

:::

方式二

需要配置 Log日志的形式展示出来



## 必知必会13条

```python
# 必知必会13条
# 1.all()       查询所有数据
# 2.filter()    带有过滤条件的查询
# 3.get()       直接拿数据对象 但是条件不存在直接报错
# 4.first()     拿queryset里面第一个元素
# 5.last()      拿queryset里面最后一个元素
# 6.values()    可以指定获取的数据字段 结果为列表套字典
# res = models.Publisher.objects.values('pk','name')
# print(res[0],type(res[0]))

# 7.values_list() 列表套元组
# res = models.Publisher.objects.values_list('pk','name')
# print(res.query)
# print(res[0],type(res[0]))

# 8.distinct() 去重
# 去重一定要是一摸一样的数据
# 如果带有主键那么肯定不一样 你在往后的查询中一定不要忽略主键

# 9.order_by()  排序
# 10.reverse()  反转的前提是 数据已经排过序了
# 11.count()    统计当前数据的个数
# res = models.Publisher.objects.count()
# print(res)

# 12.exclude() 排除在外
# 13.exists() 判断是否存在
# res = models.Publisher.objects.filter(pk=1)
# print(bool(res))
```

   

## 神器的双下划线

```python
1 年龄大于35岁的数据
res = models.User.objects.filter(age__gt=35)
2 年龄小于35岁的数据
res = models.User.objects.filter(age__lt=35)
大于等于 小于等于
res = models.User.objects.filter(age__gte=35)
res = models.User.objects.filter(age__lte=35)

年龄是18 或者32 或者40
res = modles.User.objects.filter(age__in=[18,32,40])
年龄在18到40岁之间的 首尾都要
res = models.User.object.filter(age__range=[18,40])

名字里含有n的数据 模糊查询
res = models.User.objects.filter(name__contains='n')
忽略大小写 (contains前面加一个i)
res = models.User.objects.filter(name__icontains='n')

以什么什么开头和结尾的数据
res.models.User.objects.filter(name__startswith='j')
res.models.User.objects.filter(name__endswith='j')

查询出注册时间2020年1月份的数据
res = models.User.objects.filter(register_time__month='1')
res = models.User.objects.filter(register_time__year='2018')
res = models.User.objects.filter(register_time__day='10')
```



## 聚合查询

```python
from django.db.models import Max,Min,Sum,Count,Avg
# 1.所有书的平均价格
res = models.Book.objects.aggregate(Avg('price'),Max('price'),Min('price'),Sum('price'),Count('price'))
print(res)
```



## 分组查询

```python
# 1.查询每一本书的作者个数
# models后面点什么就是按什么分组
# res = models.Book.objects.annotate(author_num=Count('author__id')).values('title','author_num')
# print(res)

# 2.统计每个出版社卖的最便宜的书的价格
# res = models.Publisher.objects.annotate(min_price=Min('book__price')).values('name','min_price')
# print(res)

# 3.统计不止一个作者的图书
# res = models.Book.objects.annotate(author_num=Count('author')).filter(author_num__gt=1).values('title','author_num')
# print(res)

# 4.查询每个作者出的书的总价格
# res = models.Author.objects.annotate(sum_price=Sum('book__price')).values('name','sum_price')
# print(res)
```

:::tip
如果我想按照指定的字段分组该如何处理呢?
`models.Book.object.values('price').annotate()`
:::



## F与Q查询

```python
# 1.查询卖出数大于库存数的书籍
# F查询(比较同一个表中的2个字段) (F能直接帮助你获取到表中某个字段对应的数据)
from django.db.models import F,Q
# res = models.Book.objects.filter(maichu__gt=F('kucun'))

# 2.将所有书籍的价格提升50块
# models.Book.objects.update(price=F('price') + 100)

# 3.将所有书的名称后面加上爆款两个字
'''
在操作字符类型的数据的时候 F不能够直接做到字符串的拼接
'''
# from django.db.models.functions import Concat
# from django.db.models import Value
# models.Book.objects.update(title=Concat(F('title'),Value('爆款')))

# Q查询 ( ,(与) |(或) ~(非)  )
# 1.查询书的价格大于1000或者价格小于700的书籍
# filter括号内多个参数是and关系
# res = models.Book.objects.filter(Q(price__gt=1000)|Q(price__lt=700))
# print(res)


# Q的高阶用法 能够将查询条件的左边也变成字符串的形式
# q = Q()
# q.connector = 'or'
# q.children.append(('price__gt',1000))
# q.children.append(('price__lt',700))
# res = models.Book.objects.filter(q)
# print(res)
```



   

   

   

