# 建站后续：Hugo + LoveIt 主题建站增强


<!--more-->
[//]: # (添加 <!--more--> 摘要分割符来拆分文章生成摘要. 摘要分隔符之前的内容将用作该文章的摘要.建议填写description属性，这里留空)

## 前言
之前用Hugo和Github Pages 以及LoveIt主题 搭建好了网站的基本功能与框架，嗯，看起来感觉比较简陋，以及一些网站运作的功能还没有完善好，于是又折腾一番，将剩余比较重要的功能都设置了一下，
然后写了此篇博文进行记录，特别是网站美化，强迫症的我啊，硬是折腾了好久才看起来好看一些:sweat_smile:。
在上一篇[【用Hugo和GitHub Pages搭建个人网站】](/build_blog_by_hugo)中，我们完成了 Hugo 环境的搭建、LoveIt 主题的安装以及基础配置。本篇将重点介绍以下进阶功能实现：

- 接入 Algolia 实现毫秒级站内搜索
- 集成 Valine 无后端评论系统
- 搜索引擎SEO优化指南
- 个性化主题美化方案

## 接入 Algolia 站内搜索
### 1. 注册 Algolia 账号
访问 [Algolia官网](https://www.algolia.com/) 注册免费账户，进入控制台：

1. 创建 `Hugo-Search` 应用
2. 新建 `hugo_blogs` 索引
3. 记录 `Application ID`、`Search-Only API Key`、`Admin API Key`

Algolia 还是比较良心的，免费用户每个月赠送100w条记录储存空间，1w次搜索请求，这对于咱这小网站来说应该绰绰有余了吧哈哈😄

### 2. 上传本地搜索分片JSON文件
在Algolia索引控制台 `Index` > `Add records` > `Upload file` 菜单下上传Hugo生成的`index.json`文件，这个文件在哪里呢？
他在生成的`public`文件夹下，每次网站构建都会重新生成，他会把你网站里`content`文件夹下面的文件内容进行分片，以便进行索引。

### 3. 修改 hugo.toml 配置文件
找到主配置文件中搜索配置的位置，填写之前记录的相关密钥
```toml
    [params.search.algolia]
      index = "你的 Algolia 索引名称"
      appID = "你的 Application ID"
      searchKey = "你的 Search-Only API Key"
```
其他配置项看个人喜好配置。接下来直接`hugo serve`本地启动测试一下搜索效果吧

### 4. 索引文件`index.json`同步 Algolia 流程自动化
前三步其实已经实现了搜索功能了，但是我们现在网站也没有多少文章，后面肯定还会进行添加文章的，要是每次都要手动的去上传`index.json`文件，那该多麻烦呢。
好在Algolia为咱们提供了插件自动同步的功能：`atomic-algolia`插件，我们可以利用Github action流水线将之集成进去，可以实现每次网站构建时自动同步索引。

在我们的Github action配置文件中在build 和 Deploy步骤中间 添加下面步骤：
```yml
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install atomic-algolia
        run: npm install -g atomic-algolia

      - name: Upload to Algolia
        working-directory: public  # 进入public目录
        run: atomic-algolia index.json  # 上传处理后的文件
        env:
          ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          ALGOLIA_ADMIN_KEY: ${{ secrets.ALGOLIA_API_KEY }}
          ALGOLIA_INDEX_NAME: kun-blog-index  # 填写你的Algolia索引名称
          ALGOLIA_INDEX_FILE: index.json

```
解释一下上面的配置：`atomic-algolia` 是基于`Node.js`的，需要node环境，所以在流水线中需要先安装node，然后通过`npm`命令安装`atomic-algolia`，之后再执行上传操作
`env`配置下需要填写`appid`和`admin_key`，注意这里需要的是`admin_key`而不是之前填写的`Search-Only API Key`。可以在Github仓库的 `Settings > Secrets > Actions`配置变量，token的命名分别定为 **ALGOLIA_APP_ID**和**ALGOLIA_API_KEY**
，之后就进行测试一下，见证奇迹的时刻吧！！！解放双手了有木有？
> atomic-algolia 是可以同步删除动作的，也就是说如果你删除了一篇博文，也是可以同步给Algolia的，这就避免了咱们本地没有文章，搜索却能搜出来的尴尬场面😅




## 接入 Valine 站内评论
### 1. 注册 LeanCloud 国际版
访问 [LeanCloud](https://leancloud.app/) 完成注册：

1. 创建新应用 Blog-Comment
1. 进入「设置」-「应用凭证」记录 App ID 和 App Key

### 2. 修改主题配置
```toml
[params.page.comment.valine]
  enable = true
  appId = "Your-LeanCloud-App-ID"
  appKey = "Your-LeanCloud-App-Key"
  placeholder = "留下您的思考痕迹..." 
  avatar = "retro"
  pageSize = 10
  serverURLs = ""   # 此项需要置空，国内版如果是自定义域名的话需要先绑定域名，再填写到这里
```

### 3. 安全配置（重要！）
在 LeanCloud 控制台：

1. 进入「设置」-「安全中心」

1. 添加 Web 安全域名：https://jk5555.github.io  （# 填写自己的网址）

1. 启用「验证码服务」

### 4. 评论管理
访问 `控制台 > 存储 > Comment` 可管理用户评论，建议开启邮件通知功能。



## 接入 谷歌、必应等搜索引擎SEO
### 谷歌搜索收录

1. 登录 [Google Search Console](https://search.google.com/search-console/)
1. 选择「网址前缀」验证方式，下载 HTML 验证文件
1. 将文件放入 `static` 目录，自动部署到根目录
1. 提交站点地图：https://jk5555.github.io/sitemap.xml  （# 填写自己的网址）

> 站点地图文件是hugo构建网站时自动生成在`public`根目录下，用于记录此网站包含的搜有页面url
> 帮助搜索引擎更快收录

### 必应收录
1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters/)

1. 下载 HTML 验证文件，将文件放入 `static` 目录，自动部署到根目录

1. 提交站点地图：https://jk5555.github.io/sitemap.xml  （# 填写自己的网址）

### 国内的搜索引擎收录
国内的搜索引擎限制较多，拿百度来说，想要收录需要购买自定义域名，`.github.io` 域名由于注册过多而限制SEO了，，
原本说我也整个自己的域名玩玩，，结果比较坑爹，，买了域名之后需要备案，，备案要花100块左右，但这不是重点，，备案的前提是你需要有还没有过期的ECS（云服务器），且过期时间
在3个月以上才行，，，**也就是说我想被百度SEO，我就得买域名，还得买云服务器，然后再花钱备案，备案流程还得走一个月左右
，，，坑爹，实在是太坑爹了😓**，因此，放弃了百度SEO。


## 网站美化
网站美化主要包括css样式美化和js功能优化；能实现美化效果主要是得益于hugo的加载特性：他会先加载根目录下的文件，然后再加载主题中的文件，
因此，想要修改loveIt主题中的相关页面时，我们将之复制到自己项目中的同名目录下，再进行修改
> 你也可以直接在主题的文件中修改，但是不建议，因为后面主题更新之后，我们的改动就没了。

### css样式美化
 LoveIt支持自定义css样式覆盖或者补充预设的css样式，我们在项目下创建`assets/css/_override.scss`
文件，在这个文件中定义的css样式会优先于预设样式加载

### js样式美化
 首先 在项目的static目录下创建`js/custom.js`文件，然后复制`themes/LoveIt/layouts/partials/assets.html`到项目的同名目录下，打开此文件，划到结尾
 ，在最后一行`{{- partial "plugin/analytics.html" . -}}`上方插入我们的自定义js标签：`<script type="text/javascript" src="/js/custom.js"></script>`，之后我们的/custom.js代码会在页面加载中生效
> 我在js文件中添加了网站运行时间的功能，代码如下:
> ```javascript
> function runtime() {
>     window.setTimeout("runtime()", 1000);
>     /* 请修把这里的建站时间换为你自己的 */
>     let startTime = new Date('02/23/2022 08:00:00');
>     let endTime = new Date();
>     let usedTime = endTime - startTime;
>     let days = Math.floor(usedTime / (24 * 3600 * 1000));
>     let leavel = usedTime % (24 * 3600 * 1000);
>     let hours = Math.floor(leavel / (3600 * 1000));
>     let leavel2 = leavel % (3600 * 1000);
>     let minutes = Math.floor(leavel2 / (60 * 1000));
>     let leavel3 = leavel2 % (60 * 1000);
>     let seconds = Math.floor(leavel3 / (1000));
>     let runbox = document.getElementById('run-time');
>     runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
>         + ((days < 10) ? '0' : '') + days + ' 天 '
>         + ((hours < 10) ? '0' : '') + hours + ' 时 '
>         + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
>         + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
> }
> runtime();
> ```
> 
> 但是如果想生效，我们还得干一件事：复制`themes/LoveIt/layouts/partials/footer.html`到项目的同名目录下，然后在`<div class="footer-container">`
> 标签下面添加：`<div class="footer-line"><span id="run-time"></span></div>`





