# RabbitMQ基本特性、高级特性 以及整合springboot的用法总结


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)



## 简介

rabbitmq消息队列是AMQP协议（高级消息队列协议）的一个erlang语言的实现，基于生产者消费者的模式，可以将之前同步处理的逻辑，异步执行，可以对业务解耦，缩短了系统对前台的响应能力，也提升了请求的吞吐量，增加了系统的抗并发能力等等

## 基本特性

rabbitmq主要可以分为 消息生产者、消息消费者和服务器实例broker，一个rabbitmq可以包含多个broker；

其中broker具体可以分为：connection连接、channel隧道、exchange交换机、queue队列、binding绑定等内容。

其中生产者和消费者 和broker建立连接，然后在连接中建立隧道，每个隧道相互隔离，但是多个隧道复用一个连接，用意是减少创建连接的时间，增加效率；

开启隧道后生产者通过隧道发送消息，服务器接受到消息给予反馈之后将隧道关闭；

交换机的作用是用于接收生产者的消息，并将消息路由到与之绑定的队列中去，

队列用于暂存消息和将消息发送给消费者；

创建好的交换机可以和创建好的队列建立binding，并指定bindingkey。

生产者发送消息时可以指定一个routingkey，交换机根据不同类型将routingkey进行解析，并将消息路由到与bindingkey匹配的队列中。

多个消费者可以同时监听一个队列，此时，消息会通过轮训的方式发送给消费者。当消费端channel中配置了**同时消费消息个数最大值**时，则此时若有消费端未确认的消息达到配置值后，服务器将不再给其发送消息，而选择那些相对空闲一些的消费者发送（这个配置主要考虑到由于轮询发送消息 有的消费者服务机器可能由于硬件原因比较老旧，而导致对消息消费的速度较慢，而另一些消费速度快的机器由于消息都消费完了从而存在空闲，此时若仍然无脑轮询发送消息的话可能会对那些老机器消费端造成消息积压。使用这个最大值配置就可以实现，老的机器少消费一点，新的机器多担当一点，增加整体的吞吐量）

消息的生产与消费的整个流程如下：

​	首先创建好交换机，在创建好队列，然后将队列绑定到交换机上，并定义一个bindingkey。

​	生产者发送消息到交换机，并携带一个routingkey，交换机收到消息之后，若配置了回调，则交换机将成功接收消息信号回调给生产者，然后根据routingkey与bindingkey匹配，将消息路由到对应绑定的队列中暂存，此时也会触发回调将队列接收消息信号回调给生产者。之后队列将消息发送给消费者，若配置为手动确认机制，则此时服务器会将消息标记为带确认状态，当消费者成功处理消息之后，发送成功确认指令（basic.ack）服务器接受到确认消息之后就会将消息标记为成功发送，并将之删除；若接受到失败确认指令（basic.reject）时，会根据状态true将消息返回给队列中，状态false将消息直接丢弃（返回true会有风险，若是由于自身业务异常导致的失败确认可能返回队列中到下次消费时还会失败，这样就会造成死循环）。这个过程结束。

根据交换机的类型，可以将rabbitmq的工作模式分为4种：**direct**、**topic**、**fanout**、**headers**

**direct交换机**：在路由消息时会将routingkey与bindingkey进行精确匹配，匹配上之后就将消息路由到对应队列。

**topic交换机**：在路由消息时会将routingkey与bindingkey进行匹配，允许存在通配符“#”，“*”；并且routingkey以“.”为分隔单词，“#”代表匹配0个或多个单词，“\*”表示1个单词，匹配上之后就将消息路由到对应队列 （这个最灵活，一般建议使用这个）。

**fanout交换机**：在路由消息时会忽视routingkey（传了也不会用），直接将消息路由到所有与之绑定的队列上。

**headers交换机**：此交换机不会匹配routingkey，而是通过判断消息中的headers的键值对是否符合将之路由到对应队列；由于这个模式性能很差，所以一般不建议使用。

## 高级特性

### - **ttl 消息过期机制**

  rabbitmq支持消息过期机制；主要分为两种：一种是给队列设置过期属性（在申明队列时，指定参数 “x-message-ttl” 为xxx，单位为毫秒），此时表示此队列为ttl队列，队列中所有消息都将附带过期属性，主要实现原理：rabbitmq队列会在消息进入队列时标记他的入队时间，然后定期扫描队列出口处的消息是否过期，是否达到设定的过期时间，若过期就将其移除，若此队列绑定了死信交换机，则会将消息转移给死信交换机。为什么只扫描出口处？就是因为队列是先进先出原则，若头部的消息都没过期，后面的肯定也不会过期了。

  另一种为在发送消息时，单独给消息指定过期时间，此时在到达队列后，在队列将消息推送给消费端前，会判断消息是否过期，若消息过期则不会发送而将之移除。

  如果同时设置了上面这两种过期机制，则会以小的准；但是值得注意的是：由于rabbitmq对过期判定的机制，可能会导致消息设置的过期时间到了，消息也不会移除，因为如果队列设置的过期时间大于消息设置的过期时间时，又存在消息积压，此时出口处的消息还没有过期，但是位于后面的消息自设置的过期时间到了，但是没到队列头部，所以此时并不会进行移除。

### **死信队列**

  过期的消息被称为dead message；若ttl队列指定了参数：“x-dead-letter-exchange” 为“<交换机名称>” ，被指定的交换机就被称为死信交换机，其实也就是名称是这么叫而已，他和其他普通交换机没啥区别，一般类型可以设置为fanout类型，然后与死信交换机绑定的队列就称为死信队列。在ttl队列中过期的消息将会被发送到死信交换机，然后死信交换机将之路由到死信队列中。

### **延迟队列**

  rabbitmq本身并不直接支持延迟队列，但是可以通过ttl消息过期机制和死信队列来实现延迟队列；具体做法：创建一个ttl队列，指定参数 “x-message-ttl” 为xxx，单位为毫秒 作为延迟时长，指定参数：“x-dead-letter-exchange” 为“<交换机名称>” ，指定死信交换机，然后绑定上死信队列，之后消费者不直接监听ttl队列，而监听死信队列；这样进入ttl队列的消息在到达延迟时长之后过期，被发送到死信队列来，然后被消费者消费。

### **优先级队列**

  在创建队列时指定参数：x-max-priority为 xxx 数字，既指定最大优先级数字，不指定则默认为0，这样所有消息优先级一样。指定了之后也不一定生效，因为如果生产者生产的消息在到达队列之后马上就被消费者接收了，那么优先级数字就没啥意义。所以这个属性一般是在队列中的消息发生了积压时才有效果。这时优先级高的会被调整到头部先进行消费。

### **交换机、队列、消息的持久化**

  交换机的持久化是指创建的交换机元数据是否需要持久化到磁盘上，若设置为false，则每次rabbitmq服务重启时交换机数据会丢失，需要重建

  队列的持久化和交换机的一样，但是需要注意的一点是：队列中保存着消息，若队列不持久化，则队列元数据丢失时，队列中的消息也会跟着丢失

  消息的持久化指的是每次发送到队列中的消息是否需要保存到磁盘上，若保存到磁盘，则可以增加消息消费的可靠性，因为消息不容易丢失了，但是这样由于每次都需要读写磁盘，队列的性能会降低。可以在发送消息时 message.getMessageProperties().setDeliveryMode(MessageDeliveryMode.NON_PERSISTENT);设置为不持久化

### **消息确认机制**

  为了保证消息队列工作的可靠性，我们需要知道生产者在发送消息之后，交换机和队列是否真的成功接受到了消息；还有消费者在接受到消息之后，是否真的成功的消费了消息。而rabbitmq提供了 消息确认机制，但是默认情况下是自动确认的，也就是说消息只要发送了就认为你发成功了，消息被消费者监听到，队列一将消息发出，就将消息标记为成功确认，并将之移除。我们可以修改配置，在创建交换机时打开发送确认开关，并设置回调函数，生产者方有两个回调，一个是消息被交换机成功接收时回调，另一个是消息被路由到对应队列时回调。消费者方需要将配置设置为手动提交模式，然后在接受到消息之后，队列不会移除消息，而是将消息标记为待确认状态，然后消费者将消息处理完成，若业务成功完成则可以调用basic.ack指令将消息设置为成功确认，之后队列会将消息移除，状态传true表示 将消息tag小于等于当前消息tag的消息都置为成功确认，传false表示就确认当前的；若消费者业务处理失败抛出异常，此时可以在catch中 调用 basic.reject指令将消息置为失败确认，此时可以传true，表示当前消息重新会队列，但是要防止苏循环问题，传false表示将消息丢弃；还可以调用basic.nack指令，表示 将消息tag小于等于当前消息tag的消息都置为失败确认（批量操作），传true表示重回队列，传false表示丢弃消息。

## rabbitmq的用法：

​	在整合springboot之后，操作的api被简化了很多，简单说一下流程：

1. 引入maven依赖：spring-boot-starter-amqp

2. 配置文件指定rabbitmq服务的ip，端口，用户名，密码（默认初始用户名密码为guest，guest，可以访问图形界面之后添加用户，添加之后建议删掉初始的确保安全）

   ```yml
   spring:
     rabbitmq:
       host: 115.159.116.23
       port: 5672  #这里有个坑： 端口号15672是web端管理页面服务端口号；mq服务端口是5672；也就是说rabbitmq服务启动了2个进程。
       username: kun
       password: 123456
   ```

3. 创建配置类，进行交换机的申明、队列申明、交换机与队列绑定申明，此阶段可以申明TTL队列、死信队列、优先级队列等

4. 在配置中注入SimpleRabbitListenerContainerFactory对象，将确认模式设置为手动确认

   ```java
   /**
    * 默认的监听配置工厂，由于默认将消息消费设置为自动确认，但是实际情况中 一般都需要手确认，所以 我们需要注入 此监听工厂配置，将确认模式修改为手动确认
    */
   @Autowired
   SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory;
   
   @PostConstruct
   public void setCloseAutoAck() {
       rabbitListenerContainerFactory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
   }
   ```

5. 生产者端注入rabbitTemplate对象

   ```java
   public void sendMessageToDelay(String message){
       System.out.println("我要发送消息了。。。");
       //向队列 发送消息,指定routingkey
       amqpTemplate.convertAndSend(RabbitConfig.DIRECT_EXCHANGE, "info.warn.debug", message, new MessagePostProcessor() {
           @Override
           public Message postProcessMessage(Message message) throws AmqpException {
               String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
               System.out.println("发送时间"+now);
               int i = new Random().nextInt(100);
               //设置消息优先级
               message.getMessageProperties().setPriority(i);
               message.getMessageProperties().setHeader("priority", i);
               //设置消息过期时间
               message.getMessageProperties().setExpiration("20000");
               //设置消息是否持久化
               message.getMessageProperties().setDeliveryMode(MessageDeliveryMode.NON_PERSISTENT);
               return message;
           }
       });
       System.out.println("消息发送过去了");
   }
   ```

6. 消费端消费消息并确认

   ```java
   @RabbitListener(queues = "deadLetterQueue")
       public void consumeMessage2(Message message, Channel channel) {
           long deliveryTag = message.getMessageProperties().getDeliveryTag();
           try {
               String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
               System.out.println("接收时间" + now);
               System.out.println("q2message2 = " + new String(message.getBody()) + "--- priority: " + message.getMessageProperties().getHeaders());
   
               //消费成功，手动确认 true 成功确认消息tag小于等于此tag的所有消息，false 成功确认当前的消息
               channel.basicAck(deliveryTag, false);
   //            throw new IOException("sss");
           } catch (Exception e) {
   //            消费失败，标记失败确认，true表示返回队列
   //             false 并不用返回队列，直接丢弃
               try {
                   channel.basicReject(deliveryTag, true);
               } catch (IOException ioException) {
                   ioException.printStackTrace();
               }
               e.printStackTrace();
           }
       }
   ```

