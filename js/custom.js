/* 站点运行时间 */
function runtime() {
    window.setTimeout("runtime()", 1000);
    /* 请修把这里的建站时间换为你自己的 */
    let startTime = new Date('02/23/2022 08:00:00');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}
runtime();


// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
}

// 切换主题函数
function toggleTheme() {
    const html = document.documentElement
    const currentTheme = html.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    // 添加过渡类
    html.classList.add('theme-transition')

    // 设置新主题
    html.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)

    // 移除过渡类
    setTimeout(() => {
        html.classList.remove('theme-transition')
    }, 300)
}

// 防止初始加载闪烁
(function() {
    // 在<head>加载前设置初始主题
    const savedTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute('data-theme', savedTheme || 'light')

    // DOM加载后初始化
    document.addEventListener('DOMContentLoaded', () => {
        // 绑定切换按钮
        document.getElementsByClassName('menu-item theme-switch')[0].addEventListener('click', toggleTheme)

        // 添加CSS过渡（延迟保证初始加载无动画）
        setTimeout(() => {
            const style = document.createElement('style')
            style.textContent = `
        .theme-transition * {
          transition: background-color 0.3s ease, 
                      color 0.3s ease,
                      box-shadow 0.3s ease !important;
        }
      `
            document.head.appendChild(style)
        }, 100)
    })
})()

// 检测系统主题
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
systemDark.addListener(e => {
    if(!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
})
