@echo off
echo 正在尝试运行 npm run dev...
npm run dev
if %errorlevel% neq 0 (
    echo npm run dev 启动失败，尝试运行 npm run serve...
    npm run serve
    if %errorlevel% neq 0 (
        echo 启动失败，请检查项目配置！
    ) else (
        echo npm run serve 启动成功！
    )
) else (
    echo npm run dev 启动成功！
)
pause