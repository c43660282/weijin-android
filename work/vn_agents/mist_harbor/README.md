# 《雾港来信》交付说明

这是一款完全原创的现代海港悬疑视觉小说。故事借用了灯塔、雾号、航标、短波电台等公共航海常识，但人物、港口、事故、时间回声机制、对白和全部剧情均为原创，没有改编或仿写任何受版权保护的小说。

## 内容规模

- 24 个剧情节点（含 4 个结局）
- 16 个带选择的剧情节点，远高于最低 8 次选择要求
- 4 个结局：
  - **双灯归港**：最佳结局。两个孩子都获救，主角取回“沈舟”的真实姓名，林岚也活在新的时间线中。
  - **借名而生**：现实结局。主角保留既有生活，但公开身份真相，让两个名字都被看见。
  - **无名潮汐**：开放结局。主角摧毁时间回声，拒绝由过去替自己定义。
  - **雾中同船**：牺牲结局。主角让真正的林岚获救，自己只留在一盘磁带里。

核心反转分两层展开：主角以为失踪者是沈舟，后来发现自己才是事故中幸存、被改名的沈舟；随后又发现“未来来信”的成年女声是做出最终选择后的自己。故事最后让玩家决定，是改变过去、维持现在、拒绝两种身份，还是牺牲自身时间线。

## 状态变量

- `truth`：主动寻找和核实真相的程度。
- `trust`：对未来女声、何姨及他人的信任程度。
- `courage`：承担风险、面对身份真相的程度。
- `mercy`：优先保护他人、避免让任何人成为代价的程度。
- `flags`：保存关键行为，例如是否立即拆信、是否校正透镜、是否救下阿澈、是否接受双重身份等。

当前剧情的四条结局由后段明确选择触发，状态变量用于后续接入时补充对白差异、结局摘要和路线回顾，不会出现“数值不够就无故锁死”的情况。

## 场景图切片

`scene-sheet.png` 为 2×2 四等分场景图：

1. 左上 `harbor`：雾中海港
2. 右上 `lighthouse`：旧灯塔内部
3. 左下 `breakwater`：暴雨防波堤
4. 右下 `radio_dawn`：黎明电台室

建议前端以 `background-size: 200% 200%` 使用：左上 `0% 0%`、右上 `100% 0%`、左下 `0% 100%`、右下 `100% 100%`。可再依据节点情绪叠加轻微缩放、位移、暗角和冷暖滤镜，避免重复感。

## 最终图像生成提示词

```text
Use case: stylized-concept
Asset type: visual novel 2x2 scene sheet for a mobile game
Primary request: Create one square 2-by-2 storyboard sheet containing exactly four equal cinematic scenes from the same original modern Chinese coastal mystery, with a consistent recurring protagonist and a cohesive visual language.
Recurring protagonist: a 28-year-old Chinese woman, slim build, short black bob haircut, muted rust-red waterproof coat over a charcoal sweater, carrying a small weathered canvas radio satchel; keep her face, hair, coat, and proportions consistent whenever visible.
Panel 1, upper-left: a fog-bound fictional Chinese harbor before dawn, wet stone quay, fishing boats reduced to silhouettes, distant lighthouse beam cutting through dense sea fog, protagonist standing alone with an unopened cream envelope; cool blue-gray and dim sodium amber.
Panel 2, upper-right: interior of an old lighthouse lantern room, concentric Fresnel lens, rusted brass machinery, rotating beam, salt-stained spiral stair, protagonist studying an old logbook and a cassette recorder; amber light against deep teal shadows.
Panel 3, lower-left: violent night storm on a long concrete breakwater, waves exploding over black rocks, red warning beacon, protagonist running toward a stranded radio operator silhouette, dramatic rain and wind; indigo, steel blue, emergency red.
Panel 4, lower-right: dawn inside a small harbor radio station, analog radio console, waveform monitors without readable text, rain-streaked windows opening to pale sunrise, protagonist listening to a handset while another empty chair is illuminated; misty cyan, peach-gold dawn.
Style/medium: premium cinematic visual-novel key art, grounded semi-realistic digital painting with realistic materials and subtle film grain, painterly but not anime, modern Chinese coastal atmosphere, emotional restraint, no horror gore.
Composition/framing: exactly four equal rectangular panels in a clean 2x2 grid; each panel must be independently usable as a mobile visual-novel background; reserve calmer negative space in the lower quarter of every panel for a dialogue box; varied camera angles; clear separation between panels with very thin dark gutters only.
Lighting/mood: atmospheric volumetric lighthouse beam, wet reflections, fog depth, rain, quiet suspense, coherent teal-blue / rust-red / amber palette across all panels.
Constraints: exactly four panels; the same protagonist design across panels; no captions, no lettering, no symbols resembling text, no logos, no watermark, no frame titles, no speech bubbles, no extra collage fragments, no duplicated panels.
```

图像采用内置图像生成工具。若本次网络连接仍阻止生成，故事文件本身可先直接接入，场景图需在连接恢复后用上面的最终提示词重试。
