# MYSQL基础操作

## 创建数据库

```sql
create database wzwl_competitor charset utf8;
```




## 用户相关

1. 创建用户

   ```sql
   create user <usernmae>@<hostname> identified by password;
   create user ceshi@localhost identified by '123456';
   ```



2. 删除用户

   ```sql
   drop user <usernmae>@<hostname>;
   drop user ceshi@localhost;
   ```

   

3. 修改用户密码

   ```sql
   # 修改当前登录用户设置密码
   set password = password('1234');
   
   # 修改其他用户密码
   set password for root@localhost = password('123456');
   ```

  

4. 刷新权限

   ```sql
   flush privileges;
   ```

   

5. 查看权限:

   ```sql
   show grants for <username>@<hostname>;
   show grants for root@localhost;
   ```

   

6. 新增权限

   ```sql
   grant <权限> on <库>.<表> to <username>@<hostname>
   # 只读权限
   grant select on *.* to 'ceshi'@'localhost';
   # 所有权限
   GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost';
   ```

   

7. 删除权限

   ```sql
   revoke <权限> on *.* from <username>@<hostname>;
   revoke drop on *.* from ceshi@localhost;
   ```

   

8. 赋予授权权限

   ```sql
   grant <权限> on <库>.<表> to <username>@<hostname> identified by password with grant option;
   grant all PRIVILEGES on *.* to ceshi@localhost identified by '123456' with grant option;
   grant all PRIVILEGES on *.* to 'fengyong'@'%' identified by 'fengyong' with grant option;
   ```

   

9. 赋予创建用户权限

   ```sql
   update user set Create_user_priv='Y' where user='ceshi';
   ```



## 表结构

1. 创建表

   ```sql
   create table tb1(id int,name char(10));
   
   CREATE TABLE tb2 (
     id int NOT NULL AUTO_INCREMENT,
     name char(10),
     PRIMARY KEY (`id`)
   );
   ```

   

2. 查看表字段

   ```sql
   # 简单查看
   desc <表名>;
   desc tb1;
   
   # 详细查看
   show create table <表名>;
   show create table tb1;
   ```

   

3. 新增表字段

   ```sql
   # 一次新增一个字段
   alter table tb1 add hobby varchar(10);
   
   # 一次新增多个字段
   alter table tb1 add (tiem char(5),xy varchar(5));
   ```

   

4. 修改表字段

   ```sql
   # 只修改字段类型modifi
   alter table tb1 modify <要修改的字段名> <数据类型>;
   alter table tb1 modify xy int(3);
   
   # 修改字段类型也修改字段名change
   alter table tb1 change <原字段名> <新字段名> <数据类型>;
   alter table tb1 change xy age int(5);
   ```

   

5. 删除表字段

   ```sql
   alter table <表名> drop <字段名>;
   alter table tb1 drop hobby;
   ```

   

## 表数据

1. 单表查询

   ```sql
   select <字段名>,<字段名>... from <表名> where <条件>;
   select * from class;
   select * from class where cid = '1';
   ```

   

2. 多表查询

   ```sql
   # inner join   内连接  只拼接数据表中公有的数据部分
   # left join    左连接  左表中的数据全部显示出来,没有对应的项就用NULL
   # right join   右连接  右边中的数据全部显示出来,没有对应的项就用NULL
   # union        全连接  两张表中的数据全部显示出来,没有对应的项就用NULL
   select * from <第1张表名> <连接类型> <第2张表名> on <第1张表名>.<第1张表中的字段名> = <第2张表名>.<第2张表中的字段名>；
   select * from student inner join class on student.sid = class.cid;
   
   #全链接
   '''
   select * from student left join class on student.sid = class.cid
   union
   select * from student right join class on student.sid = class.cid;
   '''
   ```

   

3. 子查询

   ```sql
   # 先通过班级表查询到cid 再通过cid查student表中cid为1的学生
   select cid from class where caption='三年四班';
   select * from student where class_id = 1;
   select * from student where class_id = (select cid from class where caption='三年四班');
   ```

   

4. 新增表数据

   ```sql
   insert into <表名>(<字段名>) values(<需要插入的数据>);
   insert into class values(5,'bbb'),(6,'ccc');
   insert into class(caption) values('aaa');
   ```

   

5. 修改表数据

   ```sql
   updata <表名> set <字段名>=<修改后的数据> where <条件>;
   update class set caption='三年四班' where cid='1';
   ```

   

6. 删除表数据

   ```sql
    delete from <表名> where <条件>
    delete from class where cid in (4,5,6);
   ```

   

7. 查询关键字

   ```sql
   where:
    > 
    = 
    >=
    !=
    between
    in  是否在里面
    not in 
    exists 存在
    not exists
    
    
   like:
   % 任意字符
   _ 一个字符
   
   
   排序
   order by
   asc desc  
   select * from score order by num desc,course_id asc limit 10;
   
   
   
   取部分
   limit 
   offset 
   
   函数
   max
   min
   sum     求和
   count   计数
   avg     平均
   select age,max(id),min(id),count(id),sum(id),avg(id) from info group by age;
   
   分组
   select gender,count(sid) as number from student  group by gender having count(sid) < 8
   
   sql 执行顺序
   from 
   join (left jion  right join  inner join ) 
   on 
   where       条件
   group by     分组
   having      分组后筛选
   order by    排序
   limit       取值
   
   select age,count(id) from info where id > 2 group by age having count(id) > 1 order by age desc limit 1;
   ```



## 查询示例

1. 查询 '三年二班'的所有学生.

   ```sql
   select student.sname,class.caption from student left join class on student.class_id = class.cid where class.caption = '三年二班';
   ```

   

2. 查询每个班级的班级名称 、 班级人数。

   ```sql
   select class.caption,count(sid)   from class left join student on student.class_id = class.cid  group by student.class_id ;
   ```

   

3. 查询成绩小于60分的同学的学号、姓名、成绩、课程名称

   ```sql
   select student.sid,student.sname,score.num,course.cname  from student left join score on student.sid = score.student_id  left join course on score.course_id = course.cid  where score.num < 60;
   ```

   

4. 查询选修了‘生物课’的所有学生ID、学生姓名、成绩

   ```sql
   select student.sid,student.sname,score.num from  score LEFT JOIN course on score.course_id = course.cid LEFT JOIN student on score.student_id = student.sid where course.cname = '生物';
   ```

   

5. 查询选修了’生物课‘且分数低于60分的所有学生ID、学生姓名、成绩

   ```sql
   select student.sid,student.sname,score.num from  score LEFT JOIN course on score.course_id = course.cid LEFT JOIN student on score.student_id = student.sid where course.cname = '生物' and score.num < 60;
   ```

   

6. 查询所有同学的学号、姓名、选课数、总成绩

   ```sql
   select student.sid,student.sname,count(course_id),SUM(num) from score LEFT JOIN student on student.sid = score.student_id GROUP BY student_id;
   ```

   

7. 查询各科被选修的学生数

   ```sql
   select cname,COUNT(1) from score LEFT JOIN course on score.course_id = course.cid GROUP BY course_id;
   ```

   

8. 查询各科成绩的总分,最高分,最低分, 显示: 课程ID 、课程名称、总分、最高分、最低分。

   ```sql
   select course_id,cname,sum(num),max(num),min(num) from score LEFT JOIN course on score.course_id=course.cid GROUP BY course_id;
   ```

   

9. 查询各科成绩的平均分, 显示: 课程ID，课程名称 平均分.

   ```sql
   select course_id,cname,sum(num),max(num),min(num),avg(num) from score LEFT JOIN course on score.course_id=course.cid GROUP BY course_id;
   ```

   

10. 查询各科成绩的平均分，显示: 课程ID、课程名称 、平均分（按平均分从大到小排序）

    ```sql
    select course_id,cname,sum(num),max(num),min(num),avg(num) as avg_number from score LEFT JOIN course on score.course_id=course.cid GROUP BY course_id ORDER BY avg_number desc;
    ```

    

11. 查询各科成绩的平均分和及格率，显示: 课程ID、课程名称、平均分、及格率。

    ```sql
    case when num> 60 then 1 else 0 end
    ```

    

12. 查询平均成绩大于60的所有学生的学号，平均成绩。

    ```sql
    select avg(num) as T,student_id from score   group by student_id having T > 60;
    ```

    

13. 查询平均成绩大于85的所有学生的学号、 平均成绩、 姓名

    ```sql
    select avg(num) as T,student_id, sname from score  LEFT JOIN student on student.sid = score.student_id group by student_id having T > 85;
    ```

    

14. 查询‘三年二班’ 每个学生的学号、姓名、总成绩、平均成绩。

    ```sql
    select 
        student.sid,
        student.sname,
        SUM(num),
        avg(num) 
    from 
        student 
        LEFT JOIN class on class.cid = student.class_id
        LEFT JOIN score on score.student_id = student.sid 
    WHERE 
        class.caption = '三年二班'
    GROUP BY student.sid;
    ```

    

15. 查询每个班级的班级名称,总成绩 平均成绩 及格率（按平均成绩从大到小排序）。

    ```sql
    select 
        caption,
        sum(num),
        avg(num),
        sum(case when num > 60 then 1 else 0 end )/count(1)  
    from 
        score 
        LEFT JOIN student  on student.sid = score.student_id 
        LEFT JOIN class on student.class_id = class.cid 
    GROUP BY
        cid;
    ```

