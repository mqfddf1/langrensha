@echo off
chcp 65001 >nul
echo.
echo 🚀 狼人杀法官助手 - 自动部署脚本
echo =====================================
echo.

:: 检查是否在正确的目录
if not exist "index.html" (
    echo ❌ 错误：未找到index.html文件
    echo 请确保在项目根目录下运行此脚本
    pause
    exit /b 1
)

echo ✅ 检测到项目文件
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未安装Git
    echo 请先安装Git：https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git已安装
echo.

:: 检查是否已初始化Git仓库
if not exist ".git" (
    echo 📦 初始化Git仓库...
    git init
    echo ✅ Git仓库初始化完成
    echo.
)

:: 添加所有文件
echo 📁 添加文件到Git...
git add .
echo ✅ 文件添加完成
echo.

:: 提交更改
echo 💾 提交更改...
git commit -m "狼人杀法官助手 - 自动部署 $(date /t) $(time /t)"
echo ✅ 更改提交完成
echo.

:: 检查远程仓库
git remote -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo 📝 请先设置GitHub远程仓库：
    echo 1. 在GitHub上创建新仓库
    echo 2. 复制仓库URL
    echo 3. 运行以下命令：
    echo    git remote add origin https://github.com/你的用户名/仓库名.git
    echo    git push -u origin main
    echo.
    echo 或者使用GitHub Desktop进行可视化操作
    echo.
    pause
    exit /b 1
)

:: 推送到GitHub
echo 🚀 推送到GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ 推送失败，请检查网络连接和仓库权限
    pause
    exit /b 1
)

echo ✅ 代码已推送到GitHub
echo.

:: 检查Vercel CLI
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 安装Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Vercel CLI安装失败
        echo 请手动安装：npm install -g vercel
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI安装完成
    echo.
)

:: 检查是否已登录Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 请先登录Vercel...
    vercel login
    if errorlevel 1 (
        echo ❌ Vercel登录失败
        pause
        exit /b 1
    )
)

echo ✅ Vercel已登录
echo.

:: 部署到Vercel
echo 🚀 部署到Vercel...
vercel --prod --yes
if errorlevel 1 (
    echo ❌ 部署失败
    pause
    exit /b 1
)

echo.
echo 🎉 部署完成！
echo.
echo 📱 你的狼人杀法官助手已成功部署到云端
echo 🌐 访问地址：https://你的项目名.vercel.app
echo.
echo 📋 后续操作：
echo 1. 分享部署链接给朋友
echo 2. 测试所有功能
echo 3. 代码更新会自动部署
echo.
pause
