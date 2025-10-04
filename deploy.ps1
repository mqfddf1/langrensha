# 狼人杀法官助手 - PowerShell自动部署脚本

Write-Host ""
Write-Host "🚀 狼人杀法官助手 - 自动部署脚本" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "index.html")) {
    Write-Host "❌ 错误：未找到index.html文件" -ForegroundColor Red
    Write-Host "请确保在项目根目录下运行此脚本" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✅ 检测到项目文件" -ForegroundColor Green
Write-Host ""

# 检查Git是否安装
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Git not found"
    }
    Write-Host "✅ Git已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误：未安装Git" -ForegroundColor Red
    Write-Host "请先安装Git：https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""

# 检查是否已初始化Git仓库
if (-not (Test-Path ".git")) {
    Write-Host "📦 初始化Git仓库..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git仓库初始化完成" -ForegroundColor Green
    } else {
        Write-Host "❌ Git仓库初始化失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host ""
}

# 添加所有文件
Write-Host "📁 添加文件到Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 文件添加完成" -ForegroundColor Green
} else {
    Write-Host "❌ 文件添加失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}
Write-Host ""

# 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Yellow
$commitMessage = "狼人杀法官助手 - 自动部署 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 更改提交完成" -ForegroundColor Green
} else {
    Write-Host "❌ 更改提交失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}
Write-Host ""

# 检查远程仓库
$remoteCheck = git remote -v 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "📝 请先设置GitHub远程仓库：" -ForegroundColor Yellow
    Write-Host "1. 在GitHub上创建新仓库" -ForegroundColor White
    Write-Host "2. 复制仓库URL" -ForegroundColor White
    Write-Host "3. 运行以下命令：" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/你的用户名/仓库名.git" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者使用GitHub Desktop进行可视化操作" -ForegroundColor White
    Write-Host ""
    Read-Host "按任意键退出"
    exit 1
}

# 推送到GitHub
Write-Host "🚀 推送到GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 代码已推送到GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ 推送失败，请检查网络连接和仓库权限" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}
Write-Host ""

# 检查Vercel CLI
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI not found"
    }
    Write-Host "✅ Vercel CLI已安装: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 安装Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI安装完成" -ForegroundColor Green
    } else {
        Write-Host "❌ Vercel CLI安装失败" -ForegroundColor Red
        Write-Host "请手动安装：npm install -g vercel" -ForegroundColor Yellow
        Read-Host "按任意键退出"
        exit 1
    }
}

Write-Host ""

# 检查是否已登录Vercel
try {
    $vercelUser = vercel whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in"
    }
    Write-Host "✅ Vercel已登录: $vercelUser" -ForegroundColor Green
} catch {
    Write-Host "🔐 请先登录Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel登录失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
}

Write-Host ""

# 部署到Vercel
Write-Host "🚀 部署到Vercel..." -ForegroundColor Yellow
vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 部署完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 你的狼人杀法官助手已成功部署到云端" -ForegroundColor Cyan
    Write-Host "🌐 访问地址：https://你的项目名.vercel.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 后续操作：" -ForegroundColor Yellow
    Write-Host "1. 分享部署链接给朋友" -ForegroundColor White
    Write-Host "2. 测试所有功能" -ForegroundColor White
    Write-Host "3. 代码更新会自动部署" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ 部署失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Read-Host "按任意键退出"
