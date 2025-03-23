# 如何在一个java程序里面调用第三方的可执行文件(如: .exe文件)


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)
java中可以使用RunTime类, 和ProcessBuilder类来调用第三方可执行文件：

```java
//创建ProcessBuilder对象
        ProcessBuilder processBuilder =new ProcessBuilder();
        //设置执行的第三方程序(命令),第一个参数是命令,之后的是参数
//        processBuilder.command("ping","127.0.0.1");
        processBuilder.command("F:\\源码\\PanDownload_v2.0.1\\PanDownload\\PanDownload.exe");
//        processBuilder.command("java","-jar","f:/xc-service-manage-course.jar");
        //将标准输入流和错误输入流合并，通过标准输入流读取信息就可以拿到第三方程序输出的错误信息、正常信息
        processBuilder.redirectErrorStream(true);

        //启动一个进程
        Process process = processBuilder.start();
        //由于前边将错误和正常信息合并在输入流，只读取输入流
        InputStream inputStream = process.getInputStream();
        //将字节流转成字符流
        InputStreamReader reader = new InputStreamReader(inputStream,"gbk");
       //字符缓冲区
        char[] chars = new char[1024];
        int len = -1;
        while((len = reader.read(chars))!=-1){
            String string = new String(chars,0,len);
            System.out.println(string);
        }

        inputStream.close();
        reader.close();

```

