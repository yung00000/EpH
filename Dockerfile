# 使用官方 Python 輕量級映像
FROM python:3.13.3-slim-bookworm

# 設置工作目錄
WORKDIR /app

# 複製依賴文件
COPY requirements.txt .

# 安裝依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製所有應用文件
COPY . .

# 暴露端口 8080
EXPOSE 8080

# 設置環境變量
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8080
#ENV FLASK_DEBUG=false  # 生產環境關閉調試模式

# 啟動命令
CMD ["python", "app.py"]