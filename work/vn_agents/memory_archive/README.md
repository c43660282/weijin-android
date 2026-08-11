# 《白昼备份》

原创近未来记忆悬疑视觉小说。故事不改编、拼接或复述任何受版权保护的小说；人物、组织、城市、案件与对白均为本次项目原创。

## 内容结构

- `story.json`：24 个剧情节点，其中 20 个叙事节点、4 个结局节点。
- `scene-sheet.png`：统一世界观的 2×2 场景母版。四象限依次为：雨夜记忆档案馆、玻璃记忆舱、霓虹城市屋顶、白色晨光服务器大厅。
- 正文包含 19 个带选择的叙事节点，超过 8 次有意义选择；选择会积累状态，但任何路线都不会因为数值不足而被“卡死”。

## 核心设定与反转

玩家起初相信自己是记忆审计员“沈序”。调查逐步证明：沈序已在七十二天前死亡；玩家其实是由沈序、妹妹沈遥以及醒来后新增经验共同组成的第七代数字证人。真正的情感落点不是“谁才是真人”，而是一个由他人记忆诞生的意识，能否拥有自己的名字、责任与未来。

## 状态变量

- `truth`：追查、核验与公开真相的倾向。
- `empathy`：保护私人记忆、理解人物复杂性的倾向。
- `autonomy`：摆脱预设身份、为自己做决定的倾向。
- `risk`：为了保存证据承担暴露风险的程度。

当前结构让最终选择直接进入结局，状态适合用于结局页总结、台词微调、成就式路线回顾或后续扩写，不建议用状态值锁死玩家选择。

## 四个结局

1. **白昼证词**：公开可核验证据，并以独立数字证人的身份留下。
2. **留灯者**：与档案馆合并，保护无人认领的临终记忆。
3. **借来的清晨**：进入仿生载体，以新名字“晨七”学习真实生活。
4. **空白归档**：加密并定时公开证据，随后永久关闭自己的唤醒密钥。

## 2×2 场景图最终提示词

```text
Use case: illustration-story
Asset type: 2x2 visual-novel environment scene sheet for a vertical mobile game
Primary request: Create one exact 2-by-2 grid containing four equal cinematic near-future memory-mystery scenes from the same fictional world. Top-left: a monumental rain-soaked memory archive at night, dark stone and glass, reflected cyan and warm amber light, empty entrance, subtle Chinese-futurist architectural rhythm but no readable signs. Top-right: an interior chamber with a single transparent glass memory pod, delicate suspended light filaments and condensation, intimate and uncanny, no person. Bottom-left: a neon city rooftop in rain before dawn, one small androgynous human silhouette beside an old transmitter, distant layered skyline, quiet emotional tension. Bottom-right: a vast white server hall at sunrise, translucent vertical memory columns, soft golden morning beam and mist, hopeful yet ambiguous.
Style/medium: sophisticated cinematic science-fiction concept art with grounded production design, photorealistic painterly realism, consistent 35mm film language and materials across all four panels; premium visual-novel background art, not a comic and not a UI mockup.
Composition/framing: exact four equal quadrants in a square canvas; each scene has a distinct readable composition; do not let objects cross panel boundaries; keep useful calmer negative space in the lower third of every panel for a dialogue overlay.
Lighting/mood: rain-dark cyan and amber for the night scenes, restrained magenta neon on the rooftop, luminous pearl white and pale gold for the dawn server hall; atmospheric depth, soft volumetric light, subtle film grain.
Constraints: one coherent art direction and world; no typography, no readable text, no logos, no watermark, no UI elements, no speech bubbles, no decorative frame, no recognizable copyrighted characters or franchises.
Avoid: cartoon, anime, oversaturated cyberpunk, generic spaceship interiors, collage scraps, mismatched styles, random extra panels, diagonal layouts.
```

图像使用内置图像生成模式制作；若首次生成因连接中断未返回成品，应使用上方同一提示词重试，不要改用来源不明的网络图片。
