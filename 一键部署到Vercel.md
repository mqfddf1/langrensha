# 🚀 狼人杀法官助手 - Vercel一键部署指南

## 🎯 为什么选择Vercel？

- ✅ **完全免费** - 静态站点无限制
- ✅ **一键部署** - 连接GitHub自动部署  
- ✅ **全球CDN** - 访问速度极快
- ✅ **自动HTTPS** - SSL证书自动配置
- ✅ **自定义域名** - 支持绑定自己的域名
- ✅ **自动更新** - 代码推送自动部署

## 📋 部署前准备

### 1. 确保文件完整
检查项目目录包含以下文件：
```
狼人杀/
├── index.html          ✅ 主页面
├── styles.css          ✅ 样式文件  
├── script.js           ✅ 功能脚本
├── test.html           ✅ 测试页面
├── README.md           ✅ 说明文档
└── 其他文档文件        ✅ 可选
```

### 2. 准备GitHub账号
- 如果没有GitHub账号，请先注册：https://github.com
- 确保能够创建公开仓库

## 🚀 方法一：GitHub + Vercel（推荐）

### 步骤1：上传到GitHub

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 仓库名：`werewolf-judge`（或任意名称）
   - 设置为 **Public**（免费版要求）
   - 点击 "Create repository"

2. **上传代码**
   ```bash
   # 在项目目录下执行
   git init
   git add .
   git commit -m "狼人杀法官助手 - 初始版本"
   git branch -M main
   git remote add origin https://github.com/你的用户名/werewolf-judge.git
   git push -u origin main
   ```

   **或者使用GitHub Desktop：**
   - 下载安装 GitHub Desktop
   - 选择 "Add an Existing Repository"
   - 选择项目文件夹
   - 点击 "Publish repository"

### 步骤2：Vercel部署

1. **访问Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign up" 或 "Log in"
   - 选择 "Continue with GitHub"

2. **导入项目**
   - 点击 "New Project"
   - 找到你的 `werewolf-judge` 仓库
   - 点击 "Import"

3. **配置部署**
   - Framework Preset: `Other`
   - Build Command: 留空
   - Output Directory: 留空
   - Install Command: 留空
   - 点击 "Deploy"

4. **等待部署**
   - 通常需要1-2分钟
   - 部署完成后会显示成功页面

### 步骤3：访问应用

部署完成后，你会得到一个类似这样的URL：
```
https://werewolf-judge-xxx.vercel.app
```

## 🚀 方法二：Vercel CLI（命令行）

### 步骤1：安装Vercel CLI

```bash
# 使用npm安装
npm install -g vercel

# 或者使用yarn
yarn global add vercel
```

### 步骤2：登录Vercel

```bash
vercel login
```

### 步骤3：部署项目

```bash
# 在项目目录下执行
vercel

# 首次部署会询问配置
# Project name: werewolf-judge
# In which directory is your code located?: ./
# Want to override the settings? [y/N]: N
```

### 步骤4：生产部署

```bash
# 部署到生产环境
vercel --prod
```

## 🚀 方法三：拖拽部署（最简单）

### 步骤1：准备部署包

1. **创建部署文件夹**
   ```bash
   mkdir werewolf-deploy
   cd werewolf-deploy
   
   # 复制必要文件
   copy index.html .
   copy styles.css .
   copy script.js .
   copy test.html .
   copy README.md .
   ```

2. **压缩文件夹**
   - 将 `werewolf-deploy` 文件夹压缩为 `werewolf-deploy.zip`

### 步骤2：Vercel拖拽部署

1. **访问Vercel**
   - 打开 https://vercel.com
   - 登录账号

2. **拖拽部署**
   - 将 `werewolf-deploy.zip` 文件拖拽到Vercel的部署区域
   - 等待部署完成

## 🔧 部署后配置

### 1. 自定义域名（可选）

1. **在Vercel项目设置中**
   - 进入项目 Dashboard
   - 点击 "Settings" → "Domains"
   - 添加你的域名

2. **配置DNS**
   - 在你的域名提供商处添加CNAME记录
   - 指向Vercel提供的地址

### 2. 环境变量（如需要）

```bash
# 在Vercel项目设置中添加
NODE_ENV=production
```

### 3. 自动部署配置

每次推送代码到GitHub，Vercel会自动重新部署：
```bash
git add .
git commit -m "更新功能"
git push origin main
```

## 🧪 部署测试

### 1. 功能测试

访问部署后的URL，测试以下功能：
- [ ] 页面正常加载
- [ ] 创建房间功能
- [ ] 加入房间功能  
- [ ] 分享链接功能
- [ ] 游戏流程控制
- [ ] 移动端显示

### 2. 性能测试

使用以下工具测试性能：
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/

## 🚨 常见问题解决

### 问题1：部署失败
**原因**: 文件路径错误或缺少必要文件
**解决**: 确保所有文件都在根目录

### 问题2：页面404
**原因**: 路由配置问题
**解决**: 在项目根目录创建 `vercel.json`：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 问题3：分享链接不工作
**原因**: URL生成逻辑问题
**解决**: 检查 `script.js` 中的URL生成代码

### 问题4：移动端显示异常
**原因**: 响应式CSS问题
**解决**: 检查 `styles.css` 中的媒体查询

## 📱 移动端优化

### 添加PWA支持

1. **创建manifest.json**
   ```json
   {
     "name": "狼人杀法官助手",
     "short_name": "狼人杀",
     "description": "专业的狼人杀游戏管理工具",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#667eea",
     "theme_color": "#667eea",
     "icons": [
       {
         "src": "icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

2. **在index.html中添加**
   ```html
   <link rel="manifest" href="manifest.json">
   <meta name="theme-color" content="#667eea">
   ```

## 🎉 部署完成

恭喜！你的狼人杀法官助手现在已经成功部署到云端了！

### 部署后的URL示例：
```
https://werewolf-judge-abc123.vercel.app
```

### 分享给朋友：
1. 复制部署URL
2. 发送给朋友
3. 朋友可以直接访问使用

### 后续维护：
- 代码更新会自动部署
- 可以随时在Vercel Dashboard查看访问统计
- 支持自定义域名和HTTPS

---

**现在就去部署你的狼人杀法官助手吧！** 🐺🎭🚀

## 📞 需要帮助？

如果部署过程中遇到问题：
1. 检查GitHub仓库是否为Public
2. 确保所有文件都在根目录
3. 查看Vercel部署日志
4. 参考Vercel官方文档：https://vercel.com/docs
