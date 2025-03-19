# 

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>关于我 | Your Site Name</title>
    <style>
        /* 继承主题变量 */
        :root {
            --primary-color: #3498db;
            --secondary-color: #3498db;
            --text-color: #34495e;
            --card-bg: #ffffff;
            --shadow-color: rgba(0, 0, 0, 0.1);
        }

        .about-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }

        .profile-header {
            display: flex;
            gap: 2rem;
            margin-bottom: 3rem;
            align-items: center;
            /*background: var(--card-bg);*/
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 8px var(--shadow-color);
        }

        .avatar {
            width: 20%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--primary-color);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .stat-card {
            /*background: var(--card-bg);*/
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.3s ease;
            box-shadow: 0 2px 4px var(--shadow-color);
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .timeline {
            position: relative;
            padding: 2rem 0;
        }

        .timeline-item {
            padding-left: 2rem;
            margin-bottom: 3rem;
            position: relative;
            border-left: 2px solid var(--primary-color);
        }

        .timeline-item::before {
            content: '';
            width: 16px;
            height: 16px;
            background: var(--secondary-color);
            border-radius: 50%;
            position: absolute;
            left: -9px;
            top: 0;
        }

        .skill-bar {
            height: 8px;
            background: var(--card-bg);
            border-radius: 4px;
            overflow: hidden;
            margin: 1rem 0;
        }

        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            width: 0;
            transition: width 1s ease-out;
        }

        /* 技术栈 */
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .tech-card {
            display: flex;
            align-items: center;
            /*background: var(--card-bg);*/
            border-radius: 8px;
            padding: 1rem;
            gap: 0.8rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0, 0, 0, 0.05);
            position: relative;
            /*overflow: hidden;*/
            cursor: pointer;    /* 替换help样式 */
        }

        .tech-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px var(--shadow-color);
        }

        /* 工具提示容器 */
        .tech-card:hover::after,
        .tech-card:hover::before { /* 增加:hover状态 */
            opacity: 1;
            transition-delay: 0.2s; /* 添加延迟避免误触 */
        }

        .tech-icon {
            width: 64px;
            height: 64px;
            margin: 0;
            flex-shrink: 0;
            transition: transform 0.3s ease;
            filter: grayscale(0.2);
        }

        .tech-card:hover .tech-icon {
            filter: grayscale(0);
            transform: rotate(15deg) scale(1.1);
        }

        .tech-card::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: calc(100% + 8px); /* 增加间距 */
            left: 50%;
            transform: translateX(-50%);
            background: rgb(73, 73, 73);
            color: #fff;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000; /* 提升层级 */
            font-family: system-ui, -apple-system, sans-serif; /* 统一字体 */
            white-space: normal;
            width: 200px;
            text-align: left;
            line-height: 1.4;
            backdrop-filter: blur(2px);
        }

        /* 箭头样式修正 */
        .tech-card::before {
            content: "";
            position: absolute;
            bottom: calc(100% - 2px); /* 精准定位 */
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(47, 79, 79, 0.95);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .tech-name {
            color: var(--primary-color);
            font-weight: 600;
            font-size: 0.95rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }



        /* 移动端适配 */
        @media (max-width: 768px) {
            .tech-grid {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            }

            .tech-card {
                padding: 0.8rem;
                gap: 0.6rem;
            }

            .tech-icon {
                width: 24px;
                height: 24px;
            }

            .tech-name {
                font-size: 0.85rem;
            }
        }

        @media (max-width: 480px) {
            .tech-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        @media (pointer: coarse) {
            .tech-card::after,
            .tech-card::before {
                display: none;
            }
        }


    </style>
</head>
<body>
<div class="about-container">
    <!-- 个人信息头 -->
    <section class="profile-header">
        <img src="/images/avatar.png" alt="Avatar" class="avatar">
        <div>
            <h1> 改变就是好事（笔名）</h1>
            <p>🚀 （伪）全栈开发者 | 📝 分享博主 | 🎓 持续学习者</p>
            <div class="social-links">
                <a href="https://github.com/jk5555"><i class="fab fa-github"></i></a>
                <a href="https://jk5555.github.io"><i class="fa-solid fa-blog"></i></a>
            </div>
            <div style="font-size: 0.8em">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;起始于C++，学习过Python和爬虫，写过Html和JavaScript，开发过IDEA插件，现在从事Java开发相关工作，
                兴趣是喜欢研究新鲜事物！<em><strong>生命不息，探索不止</strong></em>，希望能结识一些志同道合的伙伴😁
            </div>
        </div>
    </section>

    <!-- 关键数据 -->
<!--    <div class="stats-grid">-->
<!--        <div class="stat-card">-->
<!--            <h3>5+</h3>-->
<!--            <p>年开发经验</p>-->
<!--        </div>-->
<!--        <div class="stat-card">-->
<!--            <h3>10+</h3>-->
<!--            <p>技术文章</p>-->
<!--        </div>-->
<!--        <div class="stat-card">-->
<!--            <h3>10+</h3>-->
<!--            <p>开源项目</p>-->
<!--        </div>-->
<!--    </div>-->

    <!-- 建站初衷 -->
    <section class="card-section">
        <h2>📌 建站初衷</h2>
        <p>在信息化爆炸的时代，打造一块属于我自己的知识净土🌱。这里将播种：<br>
        <ul>
            <li> 程序开发的体系化思考🚀</li>
            <li> 开源项目的实战化复盘📦</li>
            <li> 技术成长的阶段性手记 📈</li>
            <li> 网络资源的无私化共享⚙️</li>
        </ul>
        期待通过持续输出构建三维知识网络，既作自我精进的里程碑，也为后来者点亮一盏避坑明灯💡。</p>
        <div class="skill-bar">
            <div class="skill-progress" data-width="85%"></div>
        </div>
    </section>

    <!-- 时间线 -->
    <section class="timeline">
        <h2>⏳ 生涯手记</h2>
        <div class="timeline-item">
            <h3>2024 - 技术进阶</h3>
            <p>学习算法，阅览群书，开源分享</p>
        </div>
        <div class="timeline-item">
            <h3>2023 - 学习AI</h3>
            <p>随着ChatGPT以及AIGC的爆火，开始加入学习AI的征途... 换了一张3080显卡，捣鼓<code>Stable Diffusion</code>画图变现 </p>
        </div>
        <div class="timeline-item">
            <h3>2022 - 搭建网站</h3>
            <p>我也终于有了自己的小破站啦~ </p>
        </div>
        <div class="timeline-item">
            <h3>2021 - 插件开发</h3>
            <p>尝试开发IDEA插件，写了几个有助于工作的IDEA插件
                <ul>
                    <li> <a href="https://plugins.jetbrains.com/plugin/17247-mybatis-log-convert" target="_blank"><i class="fa-solid fa-link"></i> Mybatis Log Convert</a></li>
                    <li> <a href="https://plugins.jetbrains.com/plugin/16668-formatjsonforentity" target="_blank"><i class="fa-solid fa-link"></i> FormatJSONForEntity</a></li>
                </ul>
            </p>
        </div>
        <div class="timeline-item">
            <h3>2020 - 技术写作</h3>
            <p>开始在CSDN记录博客</p>
        </div>
    </section>

    <!-- 技术栈 -->
    <section class="tech-stack">
        <h2>🛠 技术工具箱</h2>
        <div class="tech-grid">
            <a href="https://javaguide.cn/" target="_blank" class="tech-card" data-tooltip="「Java学习 + 面试指南」涵盖 Java 程序员需要掌握的核心知识">
                <img src="https://javaguide.cn/logo.svg" alt="JavaGuide" class="tech-icon">
                <p class="tech-name">JavaGuide</p>
            </a>
            <a href="https://www.aishort.top/" target="_blank" class="tech-card" data-tooltip="AiShort 提供了一份简洁易用的 AI 指令列表，旨在帮助用户，即使是那些不熟悉提示词知识的人，也能轻松地通过筛选和查询找到适用于各种场景的提示词，从而提升个人的生产力。">
                <img src="https://img.newzone.top/aishort/favicon.ico" alt="AI prompt" class="tech-icon">
                <p class="tech-name">AI prompt</p>
            </a>
            <a href="https://agiclass.feishu.cn/docx/Z3Aed6qXboiF8gxGuaccNHxanOc" target="_blank" class="tech-card" data-tooltip="大模型 AI 应用全栈开发知识体系">
                <img src="https://p1-hera.feishucdn.com/tos-cn-i-jbbdkfciu3/346f092bba2241a4b930ae01959eceab.png~tplv-jbbdkfciu3-png:0:0.png" alt="大模型 AI 应用全栈开发知识体系" class="tech-icon">
                <p class="tech-name">AI知识体系</p>
            </a>
            <a href="https://www.ainavpro.com/" target="_blank" class="tech-card" data-tooltip="AI 导航">
                <img src="https://www.ainavpro.com/wp-content/uploads/2023/03/logo-8-e1677916867522.png" alt="AI 导航" class="tech-icon">
                <p class="tech-name">AI 导航</p>
            </a>
            <a href="https://github.com/GitHubDaily/GitHubDaily" target="_blank" class="tech-card" data-tooltip="坚持分享 GitHub 上高质量、有趣实用的开源技术教程、开发者工具、编程网站、技术资讯。A list cool, interesting projects of GitHub.">
                <img src="/images/github.png" alt="GitHubDaily" class="tech-icon">
                <p class="tech-name">GitHubDaily</p>
            </a>
            <a href="https://programmercarl.com" target="_blank" class="tech-card" data-tooltip="《代码随想录》，学习算法不迷路">
                <img src="https://code-thinking-1253855093.file.myqcloud.com/pics/20210614201246512.png" alt="代码随想录" class="tech-icon">
                <p class="tech-name">代码随想录</p>
            </a>
            <a href="/guide/guide.html" target="_blank" class="tech-card" data-tooltip="自己的导航，必是精品导航">
                <img src="/favicon/favicon-96x96.png" alt="我的导航" class="tech-icon">
                <p class="tech-name">我的导航</p>
            </a>
        </div>
    </section>
</div>

<script>
    // 滚动动画
    const animateOnScroll = () => {
        const progressBars = document.querySelectorAll('.skill-progress');

        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                bar.style.width = bar.dataset.width;
            }
        });
    }

    // 时间线动画
    const animateTimeline = () => {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = 1;
                item.style.transform = 'translateX(0)';
            }, index * 300);
        });
    }

    // 初始化
    window.addEventListener('DOMContentLoaded', () => {
        animateTimeline();
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // 初始化触发
    });
</script>
</body>
</html>

