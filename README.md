# 未尽（Android 内测版）

未尽是一款低压力的轻量事项记录应用。用户只需要输入或说出一句自然语言，例如：

> 明天下午六点把报价发给客户

应用会把事项放入自由画板；检测到明确时间时，同时创建 Android 系统提醒。

## 当前实现

- Android 13 及以上（`minSdk 33`）
- Java 原生壳 + 本地 WebView 界面，不依赖线上服务器
- 文字输入与 Android 系统语音识别
- 中文自然语言提醒时间解析
- Android 通知与精确定时提醒
- 画板、事项、历史条目、留存画板、主题和位置本地保存
- 切换画板、拖动事项、双击收起/恢复等原型交互

手机重启后自动重建提醒暂未加入，这是本轮明确不要求的功能。

## 环境就绪后

需要：

- JDK 17
- Android SDK Platform 35
- Android SDK Build-Tools 35
- Gradle 8.9（用于首次生成 wrapper）

首次在项目根目录执行：

```powershell
gradle wrapper --gradle-version 8.9
.\gradlew.bat assembleDebug
```

调试 APK 将生成在：

```text
app\build\outputs\apk\debug\app-debug.apk
```

安装到已连接的安卓设备：

```powershell
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

## 真机验收重点

1. 首次创建带时间的事项时允许通知权限。
2. 测试“5分钟后提醒我测试通知”一类短时提醒。
3. 关闭应用后等待通知，确认系统仍能唤起提醒。
4. 关闭再打开应用，确认画板、条目与主题没有丢失。
5. 使用语音输入创建普通事项和带时间的提醒事项。

`USE_EXACT_ALARM` 目前用于内部测试版，以保证用户明确设定的提醒尽量按时触发。以后如准备上架 Google Play，需要依据当时的商店政策重新审核该权限。
