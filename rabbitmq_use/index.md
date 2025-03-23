# Linux下RabbitMQ的安装与卸载


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)


### 安装相关依赖：
```shell
yum update
yum install epel-release
yum install gcc gcc-c++ glibc-devel make ncurses-devel openssl-devel autoconf java-1.8.0-openjdk-devel git wget wxBase.x86_64
```
### 安装 ErLang
```shell
wget http://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
yum update
yum install erlang
```
输入 erl 检查一下是否安装成功

### 安装 RabbitMq
也可以使用如下方法安装 RabbitMQ 3.7.14
```shell
rpm --import https://www.rabbitmq.com/rabbitmq-signing-key-public.asc

yum -y install https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.7.14/rabbitmq-server-3.7.14-1.el7.noarch.rpm
```
### 卸载 RabbitMQ 与 Erlang
```shell
/sbin/service rabbitmq-server stop
yum list | grep rabbitmq
yum -y remove rabbitmq-server.noarch

yum list | grep erlang
yum -y remove erlang-*
yum remove erlang.x86_64
rm -rf /usr/lib64/erlang

rm -rf /var/lib/rabbitmq/     # 清除rabbitmq配置文件
```
### 启动服务
```shell
systemctl start rabbitmq-server
```
### 安装插件
安装插件后可以访问 localhost:15672 来通过 Web 端管理 RabbitMQ。
```shell
rabbitmq-plugins enable rabbitmq_management
```
踩坑
```shell
[root@SHA1000154085 rabbitmq]# rabbitmq-plugins enable rabbitmq_management
The following plugins have been enabled:
amqp_client
cowlib
cowboy
rabbitmq_web_dispatch
rabbitmq_management_agent
rabbitmq_management
Applying plugin configuration to rabbit@SHA1000154085... failed.
Error: {cannot_read_enabled_plugins_file,"/etc/rabbitmq/enabled_plugins", eacces}
```
解决办法：

* umask 预设权限（权限掩码），当我们建立一个目录或档案时，它都会带一个默认权限
* 022表示默认创建新文件权限为755 也就是 rxwr-xr-x(所有者全部权限,属组读写,其它人读写)
```shell
umask 0022
rabbitmq-plugins enable rabbitmq_management
```
### RabbitMq 的使用
#### 启动
```shell
service rabbitmq-server start
```
#### 停止
```shell
service rabbitmq-server stop
```
#### 查看运行状态
```shell
service rabbitmq-server status
```
#### 创建管理用户
```shell
rabbitmqctl add_user jiaflu 123456
```
#### 设置管理员

RabbitMQ Server 默认guest用户，只能localhost地址访问，我们还需要创建管理员用户。
```shell
rabbitmqctl set_user_tags kun administrator
```
#### 设置权限
```shell
rabbitmqctl set_permissions kun ".*" ".*" ".*"  # 赋予 all
```
查看（指定 hostpath）所有用户的权限信息
```shell
rabbitmqctl  list_permissions  [-p  VHostPath]
```
查看指定用户的权限信息
```shell
rabbitmqctl  list_user_permissions  kun
```
清除用户的权限信息
```shell
rabbitmqctl  clear_permissions  [-p VHostPath]  kun
```
#### 其他命令
查询用户：
```shell
rabbitmqctl.bat list_users
```
查询vhosts：
```shell
rabbitmqctl.bat list_vhosts
```
启动RabbitMQ服务:
```shell
net stop RabbitMQ && net start RabbitMQ
```
应用管理指令
```shell
rabbitmqctl stop [pid_file]
```
用于停止运行 RabbitMQ 的 Erlang 虚拟机和 RabbitMQ 服务应用。如果指定了 pid_file，还需要等待指定进程的结束。
```shell
rabbitmqctl shutdown
```
用于停止运行 RabbitMQ 的 Erlang 虚拟机和 RabbitMQ 服务应用。执行这个命令会阻塞直到 Erlang 虚拟机进程退出。如果 RabbitMQ 没有关闭成功，则会返回一个非零值。

这个命令和 rabbitmqctl stop 不同的是，它不需要指定 pid_file 而可以阻塞等待指定进程的关闭。
```shell
rabbitmqctl stop_app
```
停止 RabbitMQ 服务应用，但是 Erlang 虚拟机还是处于运行状态。
```shell
rabbitmqctl start_app
```
启动 RabbitMQ 应用。
```shell
rabbitmqctl wait [pid_file]
```
等待 RabbitMQ 应用的启动。
```shell
rabbitmqctl reset
```
将 RabbitMQ 节点重置还原到最初状态。包括从原来所在的集群中删除此节点，从管理数据库中删除所有的配置数据，如已配置的用户、vhost等，以及删除所有的持久化消息。

```shell
rabbitmqctl force_reset
```
强制将 RabbitMQ 节点重置还原到最初状态。它只能在数据库或集群配置已损坏的情况下使用。与 rabbitmqctl reset 命令一样，执行 rabbitmqctl force_reset 命令前必须先停止 RabbitMQ 应用。

```shell
rabbitmqctl rotate_logs {suffix}
```
指示 RabbitMQ 节点轮换日志文件。

参考文章
[CentOS7.5 安装rabbitmq采坑 - 简书](https://www.jianshu.com/p/bb47a5233518)

[https://www.cnblogs.com/michael-xiang/p/10467732.html](https://www.cnblogs.com/michael-xiang/p/10467732.html)



