# Es6学习手记


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)
## ES6学习经验总结：
1，Object.freeze()方法。冻结传入的变量。让变量变成只读，不再准许修改。heconst的不同之处就是：const声明的对象内部属性还可以修改，但是这个也不能改。

2，js中用来遍历对象的所有属性（字段）可以使用：for/in。如：for(let key in obj){ let name = obj[key].name; let age = obj[key].age; }。 用for/of 来遍历 数组，map，set等集合。如：for(let v of arr){ console.log(v); }。 这两种遍历的区别就在于 前者拿到的是索引，然后通过中括号的方式取值。 后者是直接拿到的就是值。

3，用 == 做比较时，会自动隐式类型转换。会将左右两边的转换为数字类型进行比较  所以某些看似 为真的比较 会得到 false 的结果；比如： 10 == true 。 非0即为true。这一点我们都知道，所以会觉得这个式子为true， 但是 他在比较的时候会将true 转换为数字类型：1. 所以10不等于1，就得到false的结果。记住：**比较的时候会将左右两边的转换为数字类型进行比较**

4，ES6中的一些原生方法：

 	1. Object.is(‘2/aaaa’,NaN)  判断 前者是否为后者
 	2. Number.isNaN(2/aaa)   判断变量是否为 NaN
 	3. parseInt('222', 10)  类型转换，字符串转为数字
 	4. parseFloat('7777.9876').toFixed(3)   类型转换，字符串转为数字, 保留小数位
 	5. Math.max.apply(null, [1,2,3,4,5])   以一个数组为变量传值，取最大的值
 	6. Math.max(1,2,3,4,5)  可以传多个值，取最大值
 	7. Math.random() 取0到1之间的随机数 左闭右开
 	8. new Date('2020-05-26 20:40:20').valueOf() 创建日期  取时间戳
 	9. console.table(divs) 以表格的形式打印
 	10. Array.from(param) 将传入参数 转化为 一个数组



5，js中将2个数组 合并成 1个 数组  最快的方法：arr = [...arrA,...arrB] （arrA和arrB是另外两个数组）

6，...arr 三个点是展开语法，类似于将数组展开成逗号分隔的形式，总之可以把它当数组也可以当成展开

7，数组的基本操作：1：结尾追加 push()；2：结尾弹出 pop()；3：前面压入：unshift()；4：前面弹出：shift()；5：数组填充或者填充指定位置：fill(param,begin=0,end=arr.length)；

8，数组的slice()函数和 splice()函数：

​	slice() 函数的作用是 截取原数组，返回被截取的部分的一个新数组 ，原数组不变

​		`let arr = [1,2,3,4,5,6].slice(0,3);  console.log(arr);//[1,2,3]`

​	第一个参数是起始位置，第二个位置是结束位置，左闭右开

​	splice()函数的作用是 截取原数组，返回被截取的部分的一个新数组，原数组会减少，并且可以在截取的位置向原数组添加元素。这样可以用这个函数实现对数组的增删改一系列操作

​		`let arrOld =  [1,2,3,4,5,6]; let arr =arrOld.splice(1,2,'kun','lu'); console.log(arr);//[2,3]   console.log(arrOld);//[1,'kun','lu',4,5,6]`

​		第一个参数是 数组截取的起始位置，第二个参数是截取的个数，第三个参数开始 就是添加的元素 （可以用展开语法快速赋值）

9， 清空数组最安全便捷的做法是： arr.length = 0;  有时候只是为了让引用变量清空，数组不清空的话，可以赋值空对象的方式：arr=[]；

10，数组的every方法和 some方法还有filter方法： every方法是数组全部满足条件就返回true，否则返回 false。some方法 是数组至少有一个满足条件就返回true，否则返回false。filter方法是将满足条件的元素过滤出来，返回一个新数组。这些方法和java的stream流式api类似。这些方法的参数函数 可以传入3个参数：第一个是数组元素对象、第二个是数组元素对应的索引，第三个是数组对象本身。

11，数组的reduce方法，可用于线性统计，获取对象最大值 等场景（Math.max()方法只能 获取简单的值类型的最大值，显然这个方法可以适应更复杂的情况）。arr.reduce(function(pre,cur,index,arr){  retrun value;  },init) 。 用法：init 为初始值，遍历开始时会赋值给pre，cur为数组的元素，index为对应的索引，arr为数组本身对象。 返回值value会赋值给pre在遍历下一个元素时传入。

12，Array.from 方法可以将 Set 结构转为数组。

```js
//js数组去重场景： 
const arr = [1,2,3,4,2,3,4];
//创建Set进行去重：
const set = new Set(arr);
//将Set转换为数组：
let uniqueArr = Array.from(set); //uniqueArr= [1,2,3,4]
```

