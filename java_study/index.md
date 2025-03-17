# Java学习错误记录和总结笔记（2018年）


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)


## 10-21: spring-security框架配置跳转路径错误

- spring-security框架配置中:配置默认跳转的路径 必须和 前台页面中写的路劲保持完全一致,(一个点儿都不能少)

```xml
<!-- 定义跳转的具体的页面 -->
<security:form-login
        login-page="/pages/login.jsp"
        login-processing-url="/login.do"
        default-target-url="/index.jsp"
        authentication-failure-url="/pages/failer.jsp"
        authentication-success-forward-url="/index.jsp"
/>
```

这前台和后台的配置指向的路径要完全一致,不然就会出现**无法跳转**的异常.

```xml
<form action="${pageContext.request.contextPath}/login.do" method="post">
```

## 10-23: mybatis在dao层方法的多参数注入错误

- mybatis框架注解开发时,或者xml映射文件配置时,若dao层的方法参数列表只有一个参数(无论是基本参数类型还是引用数据类型),可以不加@Param注解,,但是当出现多个参数时就要加@Param注解了

  ​	不然会 报 类似: **org.mybatis.spring.MyBatisSystemException:Parameter 'userId' not found.** 的异常(--详情请百度"@Param注解的用法")

  ```java
  @Insert("insert into users_role(userId,roleId) values(#{userId},#{roleId})")
  void addRoleToUser(@Param("userId")String userId, @Param("roleId")String roleId);
  ```

## 10-24: 关于a++ 自增的java基础语法错误

- java基础:a++自增问题(a--自减问题同上),  我们知道a++自增是 先运算,后自增,,所谓的先运算只管它之后的一次运算,一次运算之后就会执行自增了,若后面又多次运算,他只管第一次;自身忽略括号,(a++)和a++是一样的,不会先执行自增的;

  如下题:

  ```java
  int a=8; int b=10;
  System.out.print(a*b+a+++b);//98
  System.out.print(a*b+(a++)+b);//98
  System.out.print(a*b+b+(a++));//98
  System.out.print(a+++b+a*b);//108
  System.out.print((a++)+b+a*b);//108
  ```

## 10-27: lucene全文检索技术的原理分析

- 对于结构化数据的查询一般用于数据库中的查询,格式固定,查询时用于比对的元素是不重复的,因此计算机扫描时采用"全等"的策略,一旦找到要查的结果,就直接返回了,而对于非结构化数据来说,格式不固定,内容也可能有很多重复的地方,计算机查询的时候需要采用 "顺序扫描"的方式,对数据与查询条件做"包含"的运算,这种运算和"全等"相比,本身就会加大计算成本,而且顺序扫描的话,在数据量庞大的情况下,花费的时间会非常多,而且计算机为了确保能找到所有"包含" 查询条件的数据,必须把所有数据遍历一遍,这样会非常耗时间!,,,,,,,,,,,,,,,,,,,,,而采用lucene全文检索技术则是:**==先建立索引库,然后对索引库进行查询==**,建立索引库的过程就是将 每一条数据的通用信息提取出来,保存到通用的字段空间下,如每一个文件都会具有:文件名,文件内容,文件大小,文件路径(或url网络路径)等通用信息,先将每个文件这些信息提取出来放入一个文档对象中(也就是说一条文档对象就包含一个文件的所有提取出来的信息),并且在创建文档对象的过程中还进行了 分词处理,一个文件或多个文件之间可能有大量重复元素,若将这个大整体分解成一个个独立的元素那么肯定能减少数据的复杂度(参考数以万计的单词,拆分开来也就仅仅是26个英文字母组成的而已),分词就是这么回事,,分开的词与所属的文档对象保持着引用的关系,**而这种引用关系和分出的词的整体就称为索引**,而对于"关键词"来说,去掉重复的,所剩余的那部分的总体就组成了**索引库**,这索引库和原始数据相比数据量就非常小了,之后的查询 **只需要使用关键词查询,然后拿着查询条件里的 关键词和 索引库里保存的词单元做遍历 "全等"比较,找到就立马跳出循环(这一过程由于数据量不大,并且计算机的计算能力非常强,一般所花费的时间非常少),然后再根据此关键词与索引之间的引用关系 快速确定要搜索的那些文档对象,,再将这些文档对象里保存的字段信息,返回给用户,由于这信息结构固定,所以展示也很容易,之后用户只需要查看展示的信息,选择那一条是自己想查的数据,再根据此信息中的路径快速找到想要找的文件!**

## 10-28:ElasticSearch有关操作总结

- ElasticSearch简称es,它的核心在于他的查询方面,官方人员也说了,虽然es结构与数据库类似,并且查询性能比数据库高,**但是es在保存数据方面可能存在着数据丢失的问题,**并且在索引库和类型,字段等的增删改方面表现的并不好,关键是还不支持事务,它专注的是查询方法,所以并不能代替数据库..

- ##### es的索引库的增删以及类型和字段的确定:

  - [put] http://[ip地址]:9200/[索引库名].....请求体里面写json语法: {json语句}

  - [delete]  http://[ip地址]:9200/[索引库名]

- ##### 文档的增删改查

  - 增    [put/post] http://[ip地址]:9200/[索引库名]/[type名]/[id]-->id可写可不写,写的话即手动指定Id,不写则自定生成id..

  - 删    [delete] http://[ip地址]:9200/[索引库名]/[type名]/[id]-->删除指定id的文档对象

  - 改    和增一样,,id不重复则为增,id重复则为覆盖

  - 查  (一般会安装IK-analyzer中文分词器)  

    根据id查询:  [get] http://[IP地址]:9200/[索引库名]/[type名]/id

    根据关键词查询: [post] http://[IP地址]:9200/[索引库名]/[type名]/_seqrch  (其中type名可以不指定,这样范围大些)

    ```json
    {
        "query":{
            "term":{
                "字段名":"关键词"
            }
        }
    }
    ```

    根据长句(字符串)查询:[post] http://[IP地址]:9200/[索引库名]/[type名]/_seqrch  (其中type名可以不指定,这样范围大些)

    ```json
    {
        "query":{
            "query_string":{
                "default_field":"字段名",
                "query":"xxxxxxx...."
            }
        }
    }
    ```

## 10-29: Java代码操作elasticsearch的错误

- 使用Java代码写json数据时,适用对象调方法的流式编程方式,,只需要写 type名后跟properties属性再接字段属性,不需要像直接写json数据一样  还需要拼上  mapping这个属性.



## 10-31: 线程安全的单例模式实现

```java
/**
 * 线程安全的单例模式实现,
 * 实现了不同线程之间对象不同,同一线程之中对象一致!
 */
class Kun {
    int i;
    private static ThreadLocal<Kun> kunThreadLocal=null;
    private Kun(){}
    public static Kun getKunInstance(){
        if (kunThreadLocal==null) {
            //说明是第一次获取对象
            kunThreadLocal = new ThreadLocal<>();
        }
        if (kunThreadLocal.get()==null) {
            kunThreadLocal.set(new Kun());
        }
        return kunThreadLocal.get();
    }
}
/**
 * 实现了所有情况下都只能获取到单一对象的情况
 */
public class Kun{
    //私有构造
    private Kun(){}
    //创建私有静态内部类创建本类对象
    private static class KunInstance{
        private static final Kun instance = new Kun();
    }
    public Kun getInstance(){
        return KunInstance.instance;
    }
}

/**
 * 双重校验锁机制的单例模式
 */
public class Kun{
    //私有构造
    private Kun(){}
    //定义好单例对象
    private static final volatile Kun kunInstance=null;
    
    private static synchronized createInstance(){
        if(kunInstance==null){
            kunInstance = new Kun();
        }
    } 
    
    public static Kun getInstance(){
        if(kunInstance==null){
            createInstance();
        }
        return kunInstance;
    }
}
```

* **查看HashSet源码发现,hashSet是基于HashMap实现的,基本上每个方法都需要调用HashMap中的方法才能实现!------>(猜想)说明HashMap集合实现的时间比HashSet早!**



## 11-3: maven在执行install命令时报: zip Header not found  错误

- 经过不懈努力的查找,终于发现,当**maven仓库里所依赖的jar包出现异常(或者说"损坏")时,会报这个错误**!

  解决方法就是,找到仓库中这个jar包的位置,把他干掉,让maven重新下载即可!

  - 另外还有一个小错误就是:**如果执行install命令是通过plugin插件执行的话,可能会抛出jar包找不到的异常,尽量使用生命周期里面的执行命令**!



## 11-4: 前端JS框架的常用指令

- 表达式写法: {{变量}},,配合指令:ng-app  一起使用

- $sce  : 过滤器服务 $sce.trustAsHtml(data); 传入的数据当作html解析

- 动态绑定: ng-model="变量"

- 初始化指令: ng-init="变量='value'"

- 定义模型: angular.module("模块名",[所依赖的模块])

- 定义控制器: 模块.controller("控制器名",function($scope){  .......  })

- 点击事件指令:  ng-click

- 循环指令: ng-repeat="entity in list "

- 判断指令: ng-if : 

- 增强下拉列表指令:  `select2 , <input select2 select2-model="" config="" mudlble="" />`

  其中: select2指的是: 指令,声明这是个下拉框;

  ​	  select2-model指的是:选择的数据存贮 数据格式:{"id":1,"text":"xxx"}

  ​	  config指的是:数据来源,读取的数据格式为:` {data:[{"id":1,"text":"xxx"},{"id":1,"text":"xxx"}]}`

  ​	  mudible指的是 是否为多选,true为多选,false为单选

- 下拉列表指令: ng-options=" entity.id as entity.name for entity in list ";用于select下拉框中

- 变量监控: $watch("被监控的变量", function( ){  })    被检控的变量值发生变化时,会触发  函数的执行

- 地址栏参数监控: $location    在当前页面的controller控制器中注入此变量,可以获取跳转到此页面时地址中带有的参数列表!   $location.search()获取包含所有参数的json**对象**, 前提是地址栏参数列表是 ***#?*** 开始的才可以获取!



## 11-4: 使用springMVC框架时,设置拦截路径"/"和"*.do"的区别

"/"是静态资源页面,和class访问路径全都拦截," *.do"是只拦截以此结尾的路径,而这个也只能用于class路径上,所以为了实际好应用,建议所有class路径都以" *.do"结尾,



## 11-9: SpringMVC的执行流程

- 首先客户端浏览器发送请求给服务器,前端控制器获取到请求,调用处理器映射器,处理器映射器根据url生成相应的处理器对象,然后前端控制器调取处理器适配器,将具体的处理器对象传递给处理器适配器,然后处理器适配器通过处理器对象对请求信息处理之后,返回ModelAndView对象,前端控制器获取到ModelAndView对象之后,将其传递给视图解析器,返回得到相应的view,之后前端控制器将数据填充到view中得到最终的静态资源,然后响应给客户端浏览器!



## 11-9: ==**有关复制pdf文档上的内容的问题,,,,千万别直接往代码里面贴,里面有看不见的字符导致各种问题!   切记切记!**==



## 11-10: Spring-Security框架常见错误

- 若与spring整合时版本不符可能会报错,导依赖时,security的依赖之间版本要统一
- spring-secuity版本在5.0版本之后必须声明加入passwordEncoding加密类,不然就会报错,想不加的话,可以在密码前面加上  {noop}声明!



## 11-10: angularJS前端框架前台 ng-click 指令使用错误

ng-click指令只能用来调方法,不能直接在里面写执行的代码,  写了也不会执行!   可以一次性调取多个方法,中间用分号隔开.



## 11-13: angularJS前端框架 在引入goodsController.js控制器时报错:无法注入参数值

当几个页面共用一个controller.js时,某些页面注了很多$xxx 等自带的值, 但是在另外一个页面不需要这些值时,直接引用此controller.js文件就会报此错,你需要把能注入此值的其他js文件也引入进来,即使你不用! 或者不共用此controller.js,自己在写一个也行!



## 11-18: JS原生关键词: delete  作用: 删除一个js对象中的一个属性

- 用法:  person: {name: "江昆",age: 20},   删除name 属性,  delete  person.name;  就可以删除掉name属性!


## 11-22:freemarker使用输出流乱码问题

- 一般使用的FileWirter()输出流是默认采用系统字符集进行编码输出,可能会造成乱码问题, 此时应该采用可以手动设置字符集的输出流 FileOutputStream 代替:

  ```java
  OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(pageDir+id+".html"), "UTF-8");
  
  ```


