# 《灯影客栈》视觉小说素材包

## 定位

《灯影客栈》是一部原创中文悬疑志怪视觉小说，借用“山中异馆、灯火寄魂、名与契约、人与影分离”等中国古典志怪母题，但人物、客栈规则、剧情结构、台词和四个结局均为本项目原创，不直接改编或复述任何现当代小说、影视或游戏作品，也不照搬某一篇古典故事。

一句话梗概：雨夜旅人误入替迷途者保管姓名与记忆的客栈，最终发现自己并非受害者，而是百年前亲手写下第一份契约、又一次次主动遗忘真相的初代掌灯者。

## 文件

- `story.json`：可直接交给通用视觉小说引擎读取的剧情数据。
- `scene-sheet.png`：统一画风的 2×2 四场景图，无文字、无 UI、无水印。

四个图块从左到右、从上到下依次为：

1. `rain_inn`：中国古典夜雨客栈。
2. `lantern_corridor`：灯笼长廊。
3. `ledger_room`：旧账房。
4. `dawn_road`：黎明山路。

前端可将整图设置为 `background-size: 200% 200%`，再分别使用左上、右上、左下、右下四个背景位置裁切。图块间已有细暗色分隔线，裁切时建议额外向内缩 1–2 像素，避免在个别屏幕比例上露出分隔线。

## 剧情规模

- 总节点：21 个。
- 可交互剧情节点：17 个。
- 有意义的选择点：17 处，每处 2–4 个选择。
- 结局：4 个。
- 单次路线预计阅读：约 8–12 分钟。
- 完整探索预计阅读：约 25–35 分钟。

## 状态变量

所有变量初始值为 0，选择中的 `effects` 直接加减对应数值。

- `truth`：主角对客栈、旧身份及记忆真相的掌握程度。
- `mercy`：是否愿意把他人的完整与自由放在自身之前。
- `resolve`：是否敢于切断循环并承担不可逆后果。
- `pact`：对契约责任、守护职责和规则重写的理解程度。

最终节点 `dawn_verdict` 的前三个选择带有 `requires` 与 `hint`：

- `truth >= 3 && mercy >= 3` 解锁“众灯同明”。
- `pact >= 3` 解锁“新灯旧店”。
- `resolve >= 3` 解锁“无名灯”。
- “第十二场雨”始终可选，既是保底结局，也是循环主题的完整收束。

推荐前端表现：未满足条件时不要完全隐藏结局选项，而是降低透明度并显示 `hint`，让玩家知道此前选择确实影响了最后的路。

## 四个结局

1. **众灯同明（希望结局）**：主角放弃旧名，将记忆归还所有住客；阿烛不再作为一个独立肉身存在，却分散在众人的温柔之中。
2. **新灯旧店（守望结局）**：主角留下承担第一任掌灯者的责任，把客栈从索取记忆的牢笼改成可自由取回记忆的渡口。
3. **无名灯（苦甜结局）**：主角焚毁旧契，所有人获释，而自己从一切记录中消失，只剩无主灯火继续为夜行者照路。
4. **第十二场雨（循环结局）**：主角只求独自离开，最终在十二年后成为新的掌柜，再次等待失去记忆的自己。

## 视觉设计说明

整体采用半写实、电影感的中国古典悬疑绘景：深靛蓝雨夜、炭黑木构、低饱和青灰雾气与少量琥珀灯火形成统一夜景；黎明场景改用雾青、淡金和柔桃色，让最终抉择在视觉上真正“天亮”。画面不出现怪物或血腥元素，悬疑主要来自空无空间、反常灯火和记忆错位。

图像由内置 ImageGen 生成，最终提示词如下：

```text
Use case: illustration-story
Asset type: 2x2 visual-novel scene sheet for a mobile Chinese supernatural mystery game
Primary request: Create one seamless 2-by-2 storyboard sheet with four equal rectangular panels, all from the same original fictional world and painted in one perfectly consistent art direction. Panel 1: an isolated traditional Chinese roadside inn in heavy blue-black night rain, wet stone road reflecting two warm red-orange lanterns, mountains lost in fog, no people. Panel 2: a long wooden lantern corridor inside the same inn, rows of dim amber paper lanterns, rain shadows moving across lattice windows, one distant ambiguous human silhouette only. Panel 3: an old accounting room with dark timber shelves, a worn wooden desk, open blank antique ledgers, inkstone, brass oil lamp, drifting dust, mysterious but not gruesome. Panel 4: a pale dawn mountain road leaving the inn, wet steps, thinning mist, first peach-gold sunlight breaking through blue clouds, hopeful yet uncanny.
Style/medium: cinematic hand-painted Chinese period mystery illustration, semi-realistic painterly concept art, subtle traditional ink-wash atmosphere combined with modern visual-novel background polish, fine natural textures, restrained detail, not cartoon, no imitation of any named artist or franchise
Composition/framing: exact clean 2x2 grid, four equal panels, clear thin dark gutters separating panels, each panel usable independently as a full-screen mobile background crop; strong depth; no decorative frame
Lighting/mood: rain-night panels use deep indigo, charcoal, muted teal and warm amber lantern light; dawn panel shifts to misty cyan, pale gold and soft peach; suspenseful, melancholic, elegant, never horror-gore
Continuity: the same inn architecture, same wood grain, same lantern design and same palette across all four panels
Constraints: absolutely no text, no Chinese characters, no signage, no logos, no UI, no watermark, no readable writing on ledgers, no gore, no monsters, no modern objects, no collage-photo look, no duplicated panel, no border outside the sheet
```

## 公版母题边界

只把古典志怪中常见的“山川异境、游魂寄物、名字与魂魄相关、人与自身异化部分相遇”作为气质和母题参考。资料入口可参考中国哲学书电子化计划的《山海经》公开文本：<https://ctext.org/wiki.pl?if=gb&remap=gb&res=794446>。本作没有抽取其中的具体人物、怪物设定或故事段落。

## 集成建议

- `scene` 字段直接对应四个图块。
- 点击正文可跳过逐字动画；选项出现后再接受触控，避免误选。
- 每次选择后保存当前节点、四项变量与已读节点；结局后提供“从最后抉择重来”和“重新开始”。
- 对话框建议占屏幕底部约 28%–35%，背景使用当前 APP 主题的半透明层；不在场景图上写死任何文字。
- 雨夜图可做 12–18 秒的轻微推镜，黎明图做更慢的横向漂移；不建议使用快速闪烁、强震动或跳脸式惊吓。
