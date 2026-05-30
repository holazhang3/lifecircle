# 本地生活平台 - Vercel 部署完整指南

## 一、前期准备

### 1.1 需要的工具
- Git 已安装
- GitHub 账号
- Vercel 账号（免费）
- 本地代码已准备好（当前 workspace）

### 1.2 创建 PostgreSQL 数据库（推荐使用 Supabase）

**步骤 1：创建 Supabase 项目**
1. 访问：https://supabase.com
2. 点击 "Start your project"
3. 登录 GitHub
4. 点击 "New Project"
5. 填写项目信息：
   - Name: lifecircle-platform
   - Database Password: 记住这个密码
   - Region: 选择靠近你的地区（如 Singapore）
6. 点击 "Create new project"
7. 等待 1-2 分钟让数据库初始化

**步骤 2：获取数据库连接 URL**
1. 在 Supabase 项目中，点击左侧菜单 "Settings" → "Database"
2. 找到 "Connection string" 部分
3. 复制 "URI" 格式的连接字符串，看起来像：
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   ```

## 二、部署流程

### 2.1 将代码推送到 GitHub

在你的本地项目文件夹（PowerShell/CMD）执行：

```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交更改
git commit -m "Initial commit for lifecircle platform"

# 4. 在 GitHub 创建新仓库（访问 https://github.com/new）
#    - 仓库名称：lifecircle-platform
#    - 选择 Public 或 Private
#    - 不要初始化 README（我们已有了）

# 5. 连接远程仓库并推送
git remote add origin https://github.com/你的用户名/lifecircle-platform.git
git branch -M main
git push -u origin main
```

### 2.2 在 Vercel 上部署

**步骤 1：导入项目**
1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 找到你的 `lifecircle-platform` 仓库
4. 点击 "Import"

**步骤 2：配置环境变量**
在 "Configure Project" 页面：

1. **Project Name**: lifecircle-platform（可以保持默认）
2. **Framework Preset**: Next.js（Vercel 会自动检测）
3. **Root Directory**: ./（保持默认）
4. **Environment Variables**（关键！）：
   点击 "Add" 添加以下变量：
   
   | 变量名 | 值 |
   |--------|-----|
   | `DATABASE_URL` | 你的 Supabase 数据库连接 URL |
   | `NEXTAUTH_URL` | `https://你的项目名.vercel.app`（或先写 `http://localhost:3000`，部署后再改） |
   | `NEXTAUTH_SECRET` | 运行下面命令生成一个随机密钥 |

**生成 NEXTAUTH_SECRET 的方法：**
在本地终端运行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
复制输出的 64 位字符串作为 `NEXTAUTH_SECRET` 的值。

**步骤 3：开始部署**
点击 "Deploy" 按钮！

等待 3-5 分钟，Vercel 会完成：
- 安装依赖
- 运行 Prisma generate
- 构建项目
- 部署

## 三、数据库设置（可选但推荐）

部署成功后，你可以初始化数据库（如果需要完整功能）：

### 3.1 本地连接到数据库（可选）
在本地项目根目录创建 `.env` 文件：
```
DATABASE_URL="你的 Supabase 数据库 URL"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="刚才生成的密钥"
```

### 3.2 运行 Prisma Migration（本地执行）
```bash
npm install
npx prisma migrate dev --name init
```

这会在 Supabase 数据库中创建所有表。

## 四、常见问题解决

### 问题 1：Build 失败 - Prisma 相关错误
**原因**：Prisma Client 没有正确生成

**解决**：我们的 package.json 已经配置了：
- `"postinstall": "prisma generate"`
- `"build": "prisma generate && next build"`

这样 Vercel 会自动在安装依赖后生成 Prisma Client。

### 问题 2：依赖冲突（React 版本）
**解决**：我们已创建了 `.npmrc` 文件包含：
```
legacy-peer-deps=true
```

这样 Vercel 会使用 legacy 依赖解析模式。

### 问题 3：数据库连接失败
**解决**：检查 Supabase 项目是否正常运行，确认 `DATABASE_URL` 正确。

**好消息**：我们的 API 路由都有降级方案！即使数据库没连接，网站也能显示默认数据。

### 问题 4：NextAuth 不工作
**检查**：确保 `NEXTAUTH_URL` 和 `NEXTAUTH_SECRET` 都已在 Vercel 环境变量中正确设置。

## 五、验证部署成功

部署成功后，你会看到：
1. Vercel 显示 "Congratulations!" 页面
2. 有一个访问链接（类似 `https://lifecircle-platform-xxx.vercel.app`）
3. 点击链接可以看到网站首页
4. 城市选择、分类导航都能正常工作

## 六、后续更新部署

当你修改了代码并想重新部署时：

```bash
git add .
git commit -m "描述你的更改"
git push
```

Vercel 会自动检测到新的提交并重新部署！

## 七、部署检查清单

在开始部署前，确认以下文件都正确：
- [ ] package.json 包含 `postinstall` 和正确的 `build` 脚本
- [ ] 存在 `.npmrc` 文件，内容为 `legacy-peer-deps=true`
- [ ] lib/prisma.ts 使用了全局单例模式
- [ ] API 路由都有 try-catch 和默认数据降级
- [ ] 代码已推送到 GitHub

---

祝你部署顺利！如有问题，请检查 Vercel 的部署日志。
