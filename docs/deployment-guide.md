# Tech Share 项目部署手册

本文档详细描述了 Tech Share 项目的完整部署流程，包括环境准备、后端部署、前端部署、Nginx配置等内容。

## 目录

- [1. 环境要求](#1-环境要求)
- [2. 服务器环境准备](#2-服务器环境准备)
- [3. 数据库配置](#3-数据库配置)
- [4. 后端部署](#4-后端部署)
- [5. 前端部署](#5-前端部署)
- [6. Nginx配置](#6-nginx配置)
- [7. 常用运维命令](#7-常用运维命令)
- [8. 故障排查](#8-故障排查)

---

## 1. 环境要求

### 1.1 服务器配置

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 2核 | 4核+ |
| 内存 | 4GB | 8GB+ |
| 磁盘 | 40GB | 100GB+ |
| 系统 | Ubuntu 20.04/22.04 或 Debian 11/12 | Ubuntu 22.04 LTS |

### 1.2 软件依赖

| 软件 | 版本要求 | 用途 |
|------|----------|------|
| JDK | 21+ | 后端运行环境 |
| MySQL | 8.0+ | 数据库 |
| Redis | 6.0+ | 缓存 |
| Nginx | 1.18+ | 反向代理和静态资源服务 |
| Node.js | 18+ | 前端构建（仅构建时需要） |

---

## 2. 服务器环境准备

### 2.1 更新系统

```bash
# 更新软件包列表
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git vim unzip
```

### 2.2 安装 JDK 21

```bash
# 方法一：使用 SDKMAN（推荐）
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.2-tem

# 方法二：直接安装 OpenJDK 21
sudo apt install -y openjdk-21-jdk

# 验证安装
java -version
# 输出: openjdk version "21.0.x"
```

### 2.3 安装 MySQL 8.0

```bash
# 安装 MySQL
sudo apt install -y mysql-server

# 启动并设置开机自启
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置（按提示设置root密码等）
sudo mysql_secure_installation

# 验证安装
mysql --version
```

### 2.4 安装 Redis

```bash
# 安装 Redis
sudo apt install -y redis-server

# 修改配置（可选，如需远程访问）
sudo vim /etc/redis/redis.conf
# bind 0.0.0.0
# protected-mode no
# requirepass your_password

# 启动并设置开机自启
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 验证安装
redis-cli ping
# 输出: PONG
```

### 2.5 安装 Nginx

```bash
# 安装 Nginx
sudo apt install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证安装
nginx -v
# 输出: nginx version: nginx/1.x.x
```

### 2.6 安装 Node.js（构建前端时需要）

```bash
# 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 或直接安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

---

## 3. 数据库配置

### 3.1 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行以下SQL
```

```sql
-- 创建数据库（注意：MySQL数据库名不支持连字符，但可以使用）
CREATE DATABASE IF NOT EXISTS `tech-share` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（如果不存在）
CREATE USER IF NOT EXISTS 'ai'@'%' IDENTIFIED BY 'your_password';

-- 授权
GRANT ALL PRIVILEGES ON `tech-share`.* TO 'ai'@'%';
FLUSH PRIVILEGES;

-- 验证
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User='ai';
```

### 3.2 初始化数据

```bash
# 导入初始数据（如果有）
mysql -u ai -p tech-share < /path/to/init.sql
```

---

## 4. 后端部署

### 4.1 创建部署目录

```bash
# 创建应用目录
sudo mkdir -p /home/ai/app/tech-share/logs
sudo chown -R $USER:$USER /home/ai/app/tech-share
```

### 4.2 上传 JAR 包

```bash
# 本地构建
cd backend
mvn clean package -DskipTests

# 上传到服务器
scp target/tech-share-1.0.0.jar user@server-ip:/home/ai/app/tech-share/
```

### 4.3 创建启动脚本

创建 `/home/ai/app/tech-share/app.sh`：

```bash
#!/bin/bash
# Tech Share Backend Service Management Script
# Usage: ./app.sh {start|stop|restart|status|logs}

APP_NAME="tech-share-backend"
JAR_FILE="/home/ai/app/tech-share/tech-share-1.0.0.jar"
LOG_PATH="/home/ai/app/tech-share/logs"
PID_FILE="/home/ai/app/tech-share/app.pid"
JAVA_OPTS="-Xms512m -Xmx1024m"

# 生产环境配置
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATA_REDIS_HOST=<redis-host>
export SPRING_DATA_REDIS_PORT=6379
export SPRING_DATA_REDIS_PASSWORD='<redis-password>'
export SPRING_DATA_REDIS_DATABASE=2
export SPRING_DATASOURCE_URL='jdbc:mysql://<mysql-host>:3306/tech-share?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true'
export SPRING_DATASOURCE_USERNAME=ai
export SPRING_DATASOURCE_PASSWORD='<mysql-password>'
export LOG_PATH=/home/ai/app/tech-share/logs

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

start() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${YELLOW}$APP_NAME is already running (PID: $PID)${NC}"
            return 1
        fi
    fi

    echo -e "${GREEN}Starting $APP_NAME...${NC}"
    mkdir -p "$LOG_PATH"
    cd /home/ai/app/tech-share
    nohup java $JAVA_OPTS -jar "$JAR_FILE" > "$LOG_PATH/stdout.log" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 10

    if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
        echo -e "${GREEN}$APP_NAME started successfully (PID: $(cat $PID_FILE))${NC}"
        echo "Logs: $LOG_PATH/stdout.log"
    else
        echo -e "${RED}Failed to start $APP_NAME. Check logs for details.${NC}"
        cat "$LOG_PATH/stdout.log" | tail -30
        rm -f "$PID_FILE"
        return 1
    fi
}

stop() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${YELLOW}Stopping $APP_NAME (PID: $PID)...${NC}"
            kill $PID
            sleep 5

            if ps -p $PID > /dev/null 2>&1; then
                echo -e "${YELLOW}Force killing $APP_NAME...${NC}"
                kill -9 $PID
            fi

            rm -f "$PID_FILE"
            echo -e "${GREEN}$APP_NAME stopped.${NC}"
        else
            echo -e "${YELLOW}$APP_NAME is not running.${NC}"
            rm -f "$PID_FILE"
        fi
    else
        echo -e "${YELLOW}$APP_NAME is not running (no PID file).${NC}"
    fi
}

restart() {
    stop
    sleep 2
    start
}

status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${GREEN}$APP_NAME is running (PID: $PID)${NC}"
            return 0
        else
            echo -e "${RED}$APP_NAME is not running (stale PID file).${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}$APP_NAME is not running.${NC}"
        return 1
    fi
}

logs() {
    LOG_FILE="$LOG_PATH/stdout.log"
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo -e "${YELLOW}Log file not found: $LOG_FILE${NC}"
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
```

### 4.4 设置权限并启动

```bash
# 设置脚本执行权限
chmod +x /home/ai/app/tech-share/app.sh

# 启动服务
./app.sh start

# 检查状态
./app.sh status

# 查看日志
./app.sh logs
```

---

## 5. 前端部署

### 5.1 本地构建

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建静态文件
npm run build

# 构建产物在 out/ 目录
```

### 5.2 上传静态文件

```bash
# 创建目标目录
ssh user@server-ip "sudo mkdir -p /var/www/tech-share"

# 上传文件
scp -r out/* user@server-ip:/tmp/tech-share/

# 移动到目标目录并设置权限
ssh user@server-ip "sudo mv /tmp/tech-share/* /var/www/tech-share/ && sudo chown -R www-data:www-data /var/www/tech-share"
```

### 5.3 配置说明

前端采用 Next.js 静态导出模式，`next.config.js` 配置：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // 图片配置 - 静态导出时禁用图片优化
  images: {
    unoptimized: true,
  },

  // 严格模式
  reactStrictMode: false,
};

module.exports = nextConfig;
```

---

## 6. Nginx配置

### 6.1 创建站点配置

创建 `/etc/nginx/sites-available/tech-share`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 前端静态文件
    root /var/www/tech-share;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 文件上传代理
    location /uploads/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # 上传文件大小限制
        client_max_body_size 50M;
    }

    # 前端路由（SPA支持）
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

### 6.2 启用站点

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/tech-share /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload
```

### 6.3 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

---

## 7. 常用运维命令

### 7.1 后端服务管理

```bash
# 启动
/home/ai/app/tech-share/app.sh start

# 停止
/home/ai/app/tech-share/app.sh stop

# 重启
/home/ai/app/tech-share/app.sh restart

# 查看状态
/home/ai/app/tech-share/app.sh status

# 查看日志
/home/ai/app/tech-share/app.sh logs

# 实时查看日志
tail -f /home/ai/app/tech-share/logs/stdout.log
```

### 7.2 Nginx 管理

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload

# 重启服务
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 7.3 数据库管理

```bash
# 登录数据库
mysql -u ai -p tech-share

# 备份数据库
mysqldump -u ai -p tech-share > backup_$(date +%Y%m%d).sql

# 恢复数据库
mysql -u ai -p tech-share < backup_20240311.sql
```

### 7.4 Redis 管理

```bash
# 连接 Redis
redis-cli -h <host> -p 6379 -a '<password>'

# 选择数据库
SELECT 2

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL

# 查看所有键
KEYS *

# 查看数据库信息
INFO
```

### 7.5 系统监控

```bash
# 查看 CPU 和内存使用
top
htop

# 查看磁盘使用
df -h

# 查看端口占用
sudo lsof -i :8080
sudo netstat -tlnp | grep 8080

# 查看 Java 进程
ps aux | grep java

# 查看系统日志
tail -f /var/log/syslog
```

---

## 8. 故障排查

### 8.1 后端启动失败

**检查步骤：**

1. 查看日志
```bash
tail -100 /home/ai/app/tech-share/logs/stdout.log
```

2. 检查端口占用
```bash
sudo lsof -i :8080
```

3. 检查数据库连接
```bash
mysql -h <host> -u ai -p -e "SELECT 1"
```

4. 检查 Redis 连接
```bash
redis-cli -h <host> -p 6379 -a '<password>' ping
```

### 8.2 前端页面无法访问

**检查步骤：**

1. 检查 Nginx 状态
```bash
sudo systemctl status nginx
```

2. 检查静态文件
```bash
ls -la /var/www/tech-share/
```

3. 检查 Nginx 配置
```bash
sudo nginx -t
```

4. 查看 Nginx 错误日志
```bash
tail -50 /var/log/nginx/error.log
```

### 8.3 API 返回 500 错误

**常见原因：**

1. **数据库连接失败** - 检查用户名、密码、数据库名
2. **Redis 连接失败** - 检查 Redis 服务状态和密码
3. **权限不足** - 检查数据库用户权限

**排查命令：**
```bash
# 查看详细错误
tail -100 /home/ai/app/tech-share/logs/stdout.log | grep -i error

# 测试数据库连接
mysql -h <host> -u ai -p'<password>' tech-share -e "SHOW TABLES;"
```

### 8.4 常见错误及解决方案

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Port 8080 already in use` | 端口被占用 | `kill -9 $(lsof -t -i:8080)` |
| `Access denied for user` | 数据库权限不足 | `GRANT ALL PRIVILEGES ON tech-share.* TO 'ai'@'%'` |
| `Failed to obtain JDBC Connection` | 数据库连接失败 | 检查数据库地址、用户名、密码 |
| `Redis connection failed` | Redis 连接失败 | 检查 Redis 服务和密码配置 |
| `404 Not Found` | 路由或文件不存在 | 检查 Nginx 配置和静态文件 |

---

## 附录：快速部署清单

```bash
# 1. 环境准备
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-21-jdk mysql-server redis-server nginx

# 2. 数据库配置
mysql -u root -p
# CREATE DATABASE `tech-share` CHARACTER SET utf8mb4;
# CREATE USER 'ai'@'%' IDENTIFIED BY 'password';
# GRANT ALL PRIVILEGES ON `tech-share`.* TO 'ai'@'%';
# FLUSH PRIVILEGES;

# 3. 创建目录
sudo mkdir -p /home/ai/app/tech-share/logs
sudo mkdir -p /var/www/tech-share

# 4. 上传后端 JAR 包
scp target/tech-share-1.0.0.jar user@server:/home/ai/app/tech-share/

# 5. 上传前端静态文件
scp -r out/* user@server:/tmp/tech-share/
ssh user@server "sudo mv /tmp/tech-share/* /var/www/tech-share/"

# 6. 配置启动脚本（参考 4.3 节）
vim /home/ai/app/tech-share/app.sh
chmod +x /home/ai/app/tech-share/app.sh

# 7. 配置 Nginx（参考 6.1 节）
sudo vim /etc/nginx/sites-available/tech-share
sudo ln -s /etc/nginx/sites-available/tech-share /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# 8. 启动后端服务
/home/ai/app/tech-share/app.sh start

# 9. 验证部署
curl http://localhost:8080/actuator/health
curl http://localhost/api/projects
```

---

**文档版本**: v1.0
**最后更新**: 2026-03-11
**维护者**: Tech Share Team
