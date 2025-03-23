# springboot中应用观察者模式


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)

## 前言

近几天在学习springboot源码时发现，在springboot项目启动过程中设置了很多监听器，发现监听器的原理和设计模式中的 观察者模式 很相似。故灵感来袭总结一下 springboot中应用观察者模式

观察者模式解决的问题是：当一个东西（后文称之为 前者）的状态发生改变时，一些与其关联的东西（后文称之为 后者）也会随之做出各自改变。传统的做法是前者在变化后需要直接遍历一个个的通知（调用）到后者，当以后有新的后者需要扩展时，前者的代码也需要改动，不利于扩展。观察者模式解决的问题是，利用java的多态特性，抽象前者与后者直接耦合，在代码层次，前者在改变时只需要发出通知即可，而不需要关心具体通知到谁，后者只需要在前者中注册即可。这样做方便了扩展，当以后有新的后者需要扩展时，直接新增就行了，不需要改动前者的代码。

具体实现demo：

利用springboot和java的util包中定义的观察者与被观察者工具类实现

## 1，先定义被观察者

```java
package com.kun.watcher.observed;

import com.kun.watcher.NotifyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

/**
 * 接口被观察者
 *
 * @author kun
 * @date 2020/08/04 15:27
 */
@Component
public class WebObserved extends Observable {

    private static final Logger LOG = Logger.getGlobal();

    @Autowired
    private List<Observer> observerList;

    @PostConstruct
    public void observerRegister() {
        LOG.info("注册观察者-->");
        observerList.forEach(this::addObserver);
    }

    public void useWeb() {
        try {
            LOG.info("开始调用web了");
            this.setChanged();
            this.notifyObservers();

            Thread.sleep(2000);
            LOG.info("web被调用了2秒了");
            this.setChanged();
            this.notifyObservers(NotifyType.KUN);

            Thread.sleep(2000);
            LOG.info("web被调用了4秒了");
            this.setChanged();
            this.notifyObservers(NotifyType.ZHANGSAN);

            Thread.sleep(2000);
            LOG.info("web被调用了6秒了");
            this.setChanged();
            this.notifyObservers(NotifyType.LISI);

            Thread.sleep(2000);
            LOG.info("web被调用结束");
            this.setChanged();
            this.notifyObservers();

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}


```

继承Observable被观察者类，并使用@Component注解将我们自定义的被观察者类交给spring管理。注入所有观察者对象，

利用@PostConstruct注解，在此被观察者的bean初始化完成时调用方法，将所有观察者对象注册进Observable的列表

在自定义的方法useWeb()中在合适的时机发出通知（在调用notifyObservers()方法之前一定要先调用setChanged()方法，将状态置为改变，然后通知才会有效）

## 2，定义观察者

### 观察者昆
```java
package com.kun.watcher.observer;

import com.kun.watcher.NotifyType;
import com.kun.watcher.observed.WebObserved;
import org.springframework.stereotype.Component;

import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

/**
 * 观察者昆
 *
 * @author kun
 * @date 2020/08/04 16:13
 */
@Component
public class KunObserver implements Observer {

    private static final Logger LOG = Logger.getGlobal();

    @Override
    public void update(Observable o, Object arg) {
        if (arg == null || (o instanceof WebObserved && NotifyType.KUN.toString().equals(((NotifyType) arg).name()))) {
            LOG.info("昆收到通知");
        }
    }
}


```

### 观察者张三
```java
package com.kun.watcher.observer;

import com.kun.watcher.NotifyType;
import com.kun.watcher.observed.WebObserved;
import org.springframework.stereotype.Component;

import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

/**
 * 观察者张三
 *
 * @author kun
 * @date 2020/08/04 16:13
 */
@Component
public class ZhangsanObserver implements Observer {

    private static final Logger LOG = Logger.getGlobal();

    @Override
    public void update(Observable o, Object arg) {
        if (arg == null || (o instanceof WebObserved && NotifyType.ZHANGSAN.toString().equals(((NotifyType) arg).name()))) {
            LOG.info("张三收到通知");
        }
    }
}

```

###  观察者李四
```java
package com.kun.watcher.observer;

import com.kun.watcher.NotifyType;
import com.kun.watcher.observed.WebObserved;
import org.springframework.stereotype.Component;

import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

/**
 * 观察者李四
 *
 * @author kun
 * @date 2020/08/04 16:13
 */
@Component
public class LisiObserver implements Observer {

    private static final Logger LOG = Logger.getGlobal();

    @Override
    public void update(Observable o, Object arg) {
        if (arg == null || (o instanceof WebObserved && NotifyType.LISI.toString().equals(((NotifyType) arg).name()))) {
            LOG.info("李四收到通知");
        }
    }
}


```

### 观察者王二麻子

```java
package com.kun.watcher.observer;

import com.kun.watcher.NotifyType;
import com.kun.watcher.observed.WebObserved;
import org.springframework.stereotype.Component;

import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

/**
 * 观察者王二麻子
 *
 * @author kun
 * @date 2020/08/04 16:13
 */
@Component
public class WangermaziObserver implements Observer {

    private static final Logger LOG = Logger.getGlobal();

    @Override
    public void update(Observable o, Object arg) {
        if (arg == null || (o instanceof WebObserved && NotifyType.WANGERMAZI.toString().equals(((NotifyType) arg).name()))) {
            LOG.info("王二麻子收到通知");
        }
    }
}


```

定义了几个观察者，实现Observer观察者接口，并交给spring容器，这样就可以实现自动注册。

## 3，主流程通知

定义一个controller，前端发送http请求，改变了被观察者的状态，通知所有观察者。
```java
package com.kun.watcher.controller;

import com.kun.watcher.observed.WebObserved;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 接口
 *
 * @author kun
 * @date 2020/08/04 15:24
 */
@Controller
public class Web {

    @Autowired
    private WebObserved webObserved;

    @GetMapping("/b")
    @ResponseBody
    public String getBegin(){
        webObserved.useWeb();
        return "success";
    }
}


```
## 验证结果

启动，发送请求，结果如下：
```log
2020-08-05 11:12:28.908  INFO 2116 --- [nio-8001-exec-1] global  : 开始调用web了
2020-08-05 11:12:28.908  INFO 2116 --- [nio-8001-exec-1] global  : 张三收到通知
2020-08-05 11:12:28.908  INFO 2116 --- [nio-8001-exec-1] global  : 王二麻子收到通知
2020-08-05 11:12:28.908  INFO 2116 --- [nio-8001-exec-1] global  : 李四收到通知
2020-08-05 11:12:28.908  INFO 2116 --- [nio-8001-exec-1] global  : 昆收到通知
2020-08-05 11:12:30.910  INFO 2116 --- [nio-8001-exec-1] global  : web被调用了2秒了
2020-08-05 11:12:30.910  INFO 2116 --- [nio-8001-exec-1] global  : 昆收到通知
2020-08-05 11:12:32.911  INFO 2116 --- [nio-8001-exec-1] global  : web被调用了4秒了
2020-08-05 11:12:32.911  INFO 2116 --- [nio-8001-exec-1] global  : 张三收到通知
2020-08-05 11:12:34.911  INFO 2116 --- [nio-8001-exec-1] global  : web被调用了6秒了
2020-08-05 11:12:34.911  INFO 2116 --- [nio-8001-exec-1] global  : 李四收到通知
2020-08-05 11:12:36.912  INFO 2116 --- [nio-8001-exec-1] global  : web被调用结束
2020-08-05 11:12:36.912  INFO 2116 --- [nio-8001-exec-1] global  : 张三收到通知
2020-08-05 11:12:36.912  INFO 2116 --- [nio-8001-exec-1] global  : 王二麻子收到通知
2020-08-05 11:12:36.912  INFO 2116 --- [nio-8001-exec-1] global  : 李四收到通知
2020-08-05 11:12:36.913  INFO 2116 --- [nio-8001-exec-1] global  : 昆收到通知
```

若要扩展观察者，仅需要实现Observer接口，并加上@Component注解即可












