window.WEIJIN_VISUAL_NOVELS = {
  "vn-lantern": {
    title: "灯影客栈",
    subtitle: "雨夜志怪 · 四种结局",
    description: "你替一位没有姓名的人送信，却在只为亡者亮灯的客栈里，看见了自己的笔迹。雨停之前，七盏灯只能有六盏离开。",
    accent: "#c76b4b",
    accentSoft: "#f2cb8d",
    sceneSheet: "vn/lantern-inn-sheet.png",
    coverScene: "rainInn",
    start: "lantern_arrive",
    valueLabels: { insight: "识破", mercy: "怜悯", bond: "牵挂", debt: "契约" },
    scenes: {
      rainInn: { position: "14% 0%", mood: "cold" },
      corridor: { position: "86% 0%", mood: "warm" },
      ledger: { position: "14% 100%", mood: "danger" },
      dawnRoad: { position: "86% 100%", mood: "dream" }
    },
    endings: {
      dawn: { title: "无名的黎明", copy: "你把信送给尚未走进客栈的自己。因果像被雨水洗淡的墨，六位客人记起姓名，而你化作山路上第一缕雾。无人记得你，却人人因你得以回家。" },
      keeper: { title: "留一盏灯", copy: "你接过月娘手里的灯。此后客栈不再索取姓名，只替迷路的人保管一句没来得及说出口的话。很多年后，有人推门进来，喊出了你的名字。" },
      borrowed: { title: "借来的春天", copy: "你带着别人的姓名走进人间。花会开，饭会热，可每当下雨，镜中总有六个人安静地望着你。你活下来了，也永远欠着一场告别。" },
      ashes: { title: "灰烬仍会认字", copy: "账册烧成灰，契约却爬上你的手背。客栈崩塌时，你终于明白：真正的牢笼从来不是纸，而是所有人都不肯承认的那场选择。山里又亮起了第七盏灯。" }
    },
    nodes: {
      lantern_arrive: {
        id: "lantern_arrive", scene: "rainInn", chapter: "第一幕 · 第七盏灯", speaker: "旁白",
        text: "子夜前，你赶到鹤回岭。雨幕里只有一家客栈亮着六盏灯，门楣却挂着一块反写的木牌：归客止步。怀里的信没有收件人，封口处正慢慢渗出温热的墨。",
        choices: [
          { text: "先绕到窗下，听听里面是谁", next: "lantern_eaves", effects: { insight: 1 } },
          { text: "直接叩门，把信举到灯下", next: "lantern_front", effects: { bond: 1 } }
        ]
      },
      lantern_eaves: {
        id: "lantern_eaves", scene: "rainInn", chapter: "第一幕 · 门外的人", speaker: "屋内的女声",
        text: "窗纸后有人依次点名：屠户、产婆、驿卒、戏子、童生、无面客。念到第七个位置时，她停了很久，说：送信的终于来了。你脚下的积水里，倒映出一双并不属于你的绣鞋。",
        choices: [
          { text: "踩碎倒影，推门进去", next: "lantern_hall", effects: { insight: 1 } },
          { text: "对倒影问：你在等谁？", next: "lantern_shadow", effects: { mercy: 1 } }
        ]
      },
      lantern_front: {
        id: "lantern_front", scene: "rainInn", chapter: "第一幕 · 门里的人", speaker: "月娘",
        text: "门没有上闩。掌柜月娘替你掸去肩上并不存在的泥，像认识你很久。她盯着信封笑道：每年都是这封信，只是送信的人每年都忘了自己来过。",
        choices: [
          { text: "问她今年是哪一年", next: "lantern_hall", effects: { insight: 1 } },
          { text: "问她是否知道收件人的名字", next: "lantern_hall", effects: { bond: 1 } }
        ]
      },
      lantern_shadow: {
        id: "lantern_shadow", scene: "corridor", chapter: "第一幕 · 水里的回答", speaker: "倒影",
        text: "绣鞋的主人没有抬头，只在水里写下一个沈字。那正是你的姓。她又写：别让月娘点亮第七盏灯。下一瞬，门开了，水面只剩你的脸。",
        choices: [
          { text: "把这个警告记在心里", next: "lantern_hall", effects: { insight: 1, mercy: 1 } },
          { text: "也许她才是想借你离开的鬼", next: "lantern_hall", effects: { debt: 1 } }
        ]
      },
      lantern_hall: {
        id: "lantern_hall", scene: "corridor", chapter: "第二幕 · 六副碗筷", speaker: "旁白",
        text: "堂中摆着七副碗筷，六位客人都背对你。第七碗盛着清水，水面漂着一张写有你生辰的纸。月娘说，雨停前交出信，你便能沿黎明的路下山。",
        choices: [
          { text: "先翻柜台上的旧账册", next: "lantern_ledger", effects: { insight: 1 } },
          { text: "坐到清水前，和最小的客人说话", next: "lantern_child", effects: { mercy: 1 } }
        ]
      },
      lantern_ledger: {
        id: "lantern_ledger", scene: "ledger", chapter: "第二幕 · 重复的字", speaker: "旁白",
        text: "账册记了四十九年，每一页都写着同一句：沈砚投宿，以姓名抵一夜平安。笔迹与你一模一样。只有今年那页多出半句：若他记起阿绫，便把铃还给她。",
        choices: [
          { text: "合上账册，不让月娘发现", next: "lantern_room", effects: { insight: 1 } },
          { text: "当面追问阿绫是谁", next: "lantern_child", effects: { bond: 1, debt: 1 } }
        ]
      },
      lantern_child: {
        id: "lantern_child", scene: "corridor", chapter: "第二幕 · 不响的铃", speaker: "小客人",
        text: "孩子从袖中递来一枚没有铃舌的铜铃：哥哥，你答应过，只要它重新响，我就能想起回家的路。她叫阿绫。这个名字让你胸口疼得像被雨水灌满。",
        choices: [
          { text: "收下铜铃，答应替她寻找铃舌", next: "lantern_room", effects: { mercy: 1, bond: 1, flags: { hasBell: true } } },
          { text: "不作承诺，只问她是谁带来的", next: "lantern_room", effects: { insight: 1 } }
        ]
      },
      lantern_room: {
        id: "lantern_room", scene: "corridor", chapter: "第三幕 · 没有影子的房间", speaker: "旁白",
        text: "你的客房没有床，只有一面蒙布的铜镜。窗外每闪一次电，走廊便多出一道门。最后那道门上刻着你的生辰与死期——两者相隔只有七岁。",
        choices: [
          { text: "揭开铜镜上的布", next: "lantern_mirror", effects: { insight: 1 } },
          { text: "离开房间，去找第七盏灯", next: "lantern_midnight", effects: { debt: 1 } }
        ]
      },
      lantern_mirror: {
        id: "lantern_mirror", scene: "ledger", chapter: "第三幕 · 镜中送信人", speaker: "镜中的沈砚",
        text: "镜中没有现在的你，只有一个七岁少年背着阿绫逃过山洪。他把妹妹推上浮木，自己被卷回驿站。镜中人说：你不是长大的沈砚，你只是六个人拼给他的一个后来。",
        choices: [
          { text: "触碰镜面，记住山洪的方向", next: "lantern_midnight", effects: { insight: 2, bond: 1, flags: { sawPast: true } } },
          { text: "砸碎镜子，拒绝这个答案", next: "lantern_midnight", effects: { debt: 2 } }
        ]
      },
      lantern_midnight: {
        id: "lantern_midnight", scene: "corridor", chapter: "第四幕 · 第七盏灯亮起", speaker: "旁白",
        text: "钟敲十二下，堂中的六个人同时转身——他们都长着你不同年岁的脸。屋顶传来女子哼唱，柜台下则响起翻账册的声音。第七盏灯自行燃起，火焰是冷白色。",
        choices: [
          { text: "循着歌声上楼", next: "lantern_song", effects: { bond: 1 } },
          { text: "闯进账房，找契约的原页", next: "lantern_account", effects: { insight: 1 } }
        ]
      },
      lantern_song: {
        id: "lantern_song", scene: "corridor", chapter: "第四幕 · 绣鞋的主人", speaker: "阿绫",
        text: "唱歌的是长大后的阿绫。她从未死在山洪里，而是在四十九年前回到废墟，用六位遇难者的记忆拼出一个会送信的哥哥。每年你醒来一次，她便老去一年。",
        choices: [
          { text: "把铜铃交给她", next: "lantern_bell", effects: { mercy: 1, bond: 2 } },
          { text: "问她为何不肯让你真正离开", next: "lantern_cellar", effects: { insight: 1 } }
        ]
      },
      lantern_account: {
        id: "lantern_account", scene: "ledger", chapter: "第四幕 · 契约原页", speaker: "旁白",
        text: "原页藏在算盘底下：阿绫愿以余生为烛芯，换兄长每年还魂一夜；六名亡者各借一段记忆，使他能长到成人。月娘的签名写在见证人一栏，而收件人一栏仍然空白。",
        choices: [
          { text: "记下契约缺失的收件人", next: "lantern_cellar", effects: { insight: 2 } },
          { text: "撕下一角，藏进信封", next: "lantern_cellar", effects: { debt: 1, flags: { contractPiece: true } } }
        ]
      },
      lantern_bell: {
        id: "lantern_bell", scene: "corridor", chapter: "第四幕 · 铃舌", speaker: "阿绫",
        text: "阿绫从颈间取下一枚小小木片，正好嵌进铜铃。铃声响起时，六位客人第一次拥有不同的脸。你也记起：当年真正把阿绫推上浮木的人并不是你，而是月娘。",
        choices: [
          { text: "追问月娘为何改写记忆", next: "lantern_cellar", effects: { insight: 2, flags: { bellRings: true } } },
          { text: "先带阿绫去见六位亡者", next: "lantern_cellar", effects: { mercy: 2, flags: { bellRings: true } } }
        ]
      },
      lantern_cellar: {
        id: "lantern_cellar", scene: "ledger", chapter: "第五幕 · 客栈的地基", speaker: "月娘",
        text: "地窖里没有酒，只有沉在黑水中的旧驿站。月娘承认自己当年救下阿绫，却没能救你。她建客栈不是困住亡者，而是阻止阿绫把自己的整个人生烧完。",
        choices: [
          { text: "下到黑水里，亲自看最后一段记忆", next: "lantern_past", effects: { insight: 1, mercy: 1 } },
          { text: "把月娘带回堂中，与阿绫对质", next: "lantern_truth", effects: { bond: 1 } }
        ]
      },
      lantern_past: {
        id: "lantern_past", scene: "rainInn", chapter: "第五幕 · 被删去的那一夜", speaker: "七岁的沈砚",
        text: "黑水让你看见完整过去：山洪来时，是你求月娘只救妹妹；也是你把自己的姓名写进空白信封，托她在阿绫愿意放手的那一天寄还。客栈重复四十九年，只因那封信始终没人敢拆。",
        choices: [
          { text: "承认这份选择本来就属于自己", next: "lantern_truth", effects: { insight: 2, mercy: 1, flags: { remembersPromise: true } } },
          { text: "认为孩子的承诺不该困住阿绫一生", next: "lantern_truth", effects: { mercy: 2 } }
        ]
      },
      lantern_truth: {
        id: "lantern_truth", scene: "corridor", chapter: "终幕 · 信写给谁", speaker: "月娘",
        text: "月娘把第七盏灯放在你手中：信从来不是写给死者，而是写给仍活着的阿绫。只要她亲口承认哥哥已经死去，你借来的成人记忆便会归还六位亡者。可你也会失去现在的自己。",
        choices: [
          { text: "请阿绫拆信，让所有名字回到原处", next: "lantern_return", effects: { mercy: 2, insight: 1 } },
          { text: "接过月娘的灯，替她守住来往亡魂", next: "lantern_keep", effects: { bond: 2, debt: 1 } },
          { text: "把自己的名字写进契约，借一个完整人生", next: "lantern_borrow", effects: { debt: 3 } },
          { text: "烧掉账册与信，拒绝任何人的安排", next: "lantern_burn", effects: { insight: -1, debt: 2 } }
        ]
      },
      lantern_return: {
        id: "lantern_return", scene: "dawnRoad", chapter: "尾声 · 雨停", speaker: "阿绫",
        text: "阿绫拆开信，里面只有七岁的你写的一行歪字：妹妹，替我长大，不必替我等。她哭着叫出六位亡者的姓名，最后轻轻叫了你一声哥哥。天边第一次亮起来。",
        next: "lantern_end_dawn"
      },
      lantern_keep: {
        id: "lantern_keep", scene: "dawnRoad", chapter: "尾声 · 新掌柜", speaker: "月娘",
        text: "你让阿绫带着那封未拆的信下山，自己留下。月娘卸下四十九年的疲惫，把钥匙和灯交给你：客栈真正需要的不是祭品，而是一个知道何时开门、何时送客的人。",
        next: "lantern_end_keeper"
      },
      lantern_borrow: {
        id: "lantern_borrow", scene: "dawnRoad", chapter: "尾声 · 下山的人", speaker: "旁白",
        text: "契约接受了你的名字。你拥有脉搏、体温和一段合法的人生。阿绫看着你，像看见哥哥又像看见陌生人。她没有阻拦，只把那枚铜铃系在你腕上。",
        next: "lantern_end_borrowed"
      },
      lantern_burn: {
        id: "lantern_burn", scene: "ledger", chapter: "尾声 · 火", speaker: "旁白",
        text: "火焰吞掉账册，也吞掉每个人用于彼此记住的凭据。六位亡者尖叫着化回冷雨，阿绫的面容在你眼前迅速老去。灰烬落在手背，重新排成你的名字。",
        next: "lantern_end_ashes"
      },
      lantern_end_dawn: { id: "lantern_end_dawn", scene: "dawnRoad", speaker: "旁白", text: "山路尽头没有你的脚印，只有七盏灯依次熄灭。", ending: "dawn", endingTitle: "无名的黎明" },
      lantern_end_keeper: { id: "lantern_end_keeper", scene: "rainInn", speaker: "旁白", text: "很多年后，一个迷路的人推门进来，喊出了你早已忘记的名字。", ending: "keeper", endingTitle: "留一盏灯" },
      lantern_end_borrowed: { id: "lantern_end_borrowed", scene: "dawnRoad", speaker: "旁白", text: "你走进春天，也把六场未完的告别带进春天。", ending: "borrowed", endingTitle: "借来的春天" },
      lantern_end_ashes: { id: "lantern_end_ashes", scene: "rainInn", speaker: "旁白", text: "雨中，废墟上又亮起一盏等待送信人的灯。", ending: "ashes", endingTitle: "灰烬仍会认字" }
    }
  },

  "vn-harbor": {
    title: "雾港来信",
    subtitle: "潮汐悬疑 · 四种结局",
    description: "你回到封港十二年的白屿，收到一封明天寄出的信。信上是你的笔迹：零点十七分以前，千万不要让灯塔亮起来。",
    accent: "#3a91a7",
    accentSoft: "#b7ece5",
    sceneSheet: "vn/mist-harbor-sheet.png",
    coverScene: "harbor",
    start: "harbor_return",
    valueLabels: { evidence: "证据", trust: "信任", tide: "潮汐", courage: "勇气" },
    scenes: {
      harbor: { position: "14% 0%", mood: "cold" },
      lighthouse: { position: "86% 0%", mood: "warm" },
      breakwater: { position: "14% 100%", mood: "danger" },
      radio: { position: "86% 100%", mood: "dream" }
    },
    endings: {
      beacon: { title: "白色灯塔", copy: "你没有选择关闭光，也没有照旧开启光，而是让两束不同节奏的灯为海上的人画出一条新航线。旧事故被公开，今夜的船平安靠岸，明天终于不再给昨天写信。" },
      loop: { title: "永远的零点十七分", copy: "你救下最想救的人，却让白屿继续困在同一场雾里。每当分针走到十七，你都会收到一封更急切的来信——寄件人依然是越来越陌生的自己。" },
      witness: { title: "潮水退后", copy: "证据随广播传遍海岸。白屿失去漂亮的传说，却第一次拥有真实的名字。你没有找回哥哥，但找回了那位被所有人口口声声纪念、却从未真正认识的少年。" },
      keeper: { title: "最后一封信", copy: "你留在明天替过去守灯，把每一次正确的潮汐写成信送回去。没有人知道防波堤上那道身影是谁，只有海琴每年会为你空出一个频道。" }
    },
    nodes: {
      harbor_return: {
        id: "harbor_return", scene: "harbor", chapter: "第一幕 · 明天的邮戳", speaker: "旁白",
        text: "封港十二年的白屿在雾里像一艘搁浅巨轮。你为处理母亲遗物回来，码头邮筒却吐出一封写着明日日期的信。笔迹属于你，内容只有一句：零点十七分，别让灯塔亮。",
        choices: [
          { text: "先去旧邮局查这封信怎么来的", next: "harbor_post", effects: { evidence: 1 } },
          { text: "直接去灯塔找失踪十二年的哥哥", next: "harbor_lighthouse_door", effects: { courage: 1 } }
        ]
      },
      harbor_post: {
        id: "harbor_post", scene: "harbor", chapter: "第一幕 · 无人投递", speaker: "老邮差",
        text: "老邮差说，白屿每逢大雾都会收到七封来自次日的信，只有你的这封从未有人认领。他取出旧登记簿：十二年前事故当天，寄件人也是你——可那年你只有九岁。",
        choices: [
          { text: "拍下登记簿，把它当作证据", next: "harbor_radio", effects: { evidence: 2, flags: { hasLedger: true } } },
          { text: "问另外六封信去了哪里", next: "harbor_six_letters", effects: { tide: 1 } }
        ]
      },
      harbor_lighthouse_door: {
        id: "harbor_lighthouse_door", scene: "lighthouse", chapter: "第一幕 · 不该有人住的塔", speaker: "海琴",
        text: "灯塔早已停用，门内却传出收音机的沙沙声。港口电台员海琴拦住你：你哥哥不是在这里失踪的，他是从这里被抹掉的。她手里握着一把只在明天才会生锈的钥匙。",
        choices: [
          { text: "相信海琴，先去电台听完整录音", next: "harbor_radio", effects: { trust: 2 } },
          { text: "夺过钥匙，独自进塔", next: "harbor_stairs", effects: { courage: 2, trust: -1 } }
        ]
      },
      harbor_six_letters: {
        id: "harbor_six_letters", scene: "harbor", chapter: "第二幕 · 六个收件人", speaker: "老邮差",
        text: "另外六封分别寄给船医、巡堤员、台长、渔妇、教师和一个已夭折的孩子。他们都参与过十二年前的救援，也都坚持说那晚灯塔正常亮着。只有信里的潮位记录彼此不同。",
        choices: [
          { text: "按潮位高低重新排列信件", next: "harbor_tide_map", effects: { evidence: 1, tide: 2 } },
          { text: "去找当年的巡堤员当面对质", next: "harbor_breakwater", effects: { courage: 1 } }
        ]
      },
      harbor_radio: {
        id: "harbor_radio", scene: "radio", chapter: "第二幕 · 迟到十二年的呼叫", speaker: "电台录音",
        text: "录音里，一个少年反复呼叫灯塔：航道浮标被人挪了，别按旧角度开灯。背景中却传来你的哭声。海琴说，那位少年就是你失踪的哥哥黎川，而录音时间比官方事故报告早四分钟。",
        choices: [
          { text: "请海琴修复被剪掉的四分钟", next: "harbor_cut_audio", effects: { trust: 1, evidence: 1 } },
          { text: "循着录音里的钟声去灯塔", next: "harbor_stairs", effects: { tide: 1 } }
        ]
      },
      harbor_tide_map: {
        id: "harbor_tide_map", scene: "radio", chapter: "第二幕 · 七次不同的明天", speaker: "旁白",
        text: "七封信不是同一天寄来，而是来自七个略有差异的明天。每个明天都在尝试挽救同一艘客轮，却总有人替事故承担罪名。地图上唯一不变的位置，是防波堤下方一间被淹的信号室。",
        choices: [
          { text: "把推断告诉海琴，一起下去", next: "harbor_breakwater", effects: { trust: 1, evidence: 1 } },
          { text: "不惊动任何人，独自寻找入口", next: "harbor_flood_room", effects: { courage: 1 } }
        ]
      },
      harbor_stairs: {
        id: "harbor_stairs", scene: "lighthouse", chapter: "第三幕 · 三百一级台阶", speaker: "旁白",
        text: "灯塔台阶只有三百级，你却数到第三百零一级。多出的一级上刻着黎川名字。塔顶灯机旁放着你的旧雨衣，口袋里有半张合影：照片上的九岁孩子不是你，而是黎川。",
        choices: [
          { text: "承认自己的童年记忆可能被调换", next: "harbor_identity", effects: { evidence: 2 } },
          { text: "认为照片被人伪造，继续找哥哥", next: "harbor_lamp", effects: { courage: 1 } }
        ]
      },
      harbor_cut_audio: {
        id: "harbor_cut_audio", scene: "radio", chapter: "第三幕 · 被剪掉的四分钟", speaker: "黎川的录音",
        text: "修复后的声音说：小舟，如果你活下来，他们会让你使用我的名字，因为只有灯塔管理员的家属能领取赔偿。别相信名字，记住你左手掌心的烧伤。你低头，看见那道一直被当作胎记的疤。",
        choices: [
          { text: "告诉海琴：我可能不是黎舟", next: "harbor_identity", effects: { trust: 2, evidence: 1 } },
          { text: "先隐瞒，查清母亲为何撒谎", next: "harbor_flood_room", effects: { evidence: 1 } }
        ]
      },
      harbor_breakwater: {
        id: "harbor_breakwater", scene: "breakwater", chapter: "第三幕 · 雾里的脚印", speaker: "巡堤员",
        text: "暴雨中，老巡堤员承认当年港务公司为赶庆典客轮进港，私自移动了浮标。黎川发现后关闭灯塔，想逼船减速，却被写成擅离职守。真正把你从水里捞起的人正是他。",
        choices: [
          { text: "录下证词，准备向全港广播", next: "harbor_flood_room", effects: { evidence: 2, courage: 1, flags: { testimony: true } } },
          { text: "先追问黎川是否真的死了", next: "harbor_identity", effects: { trust: 1 } }
        ]
      },
      harbor_identity: {
        id: "harbor_identity", scene: "lighthouse", chapter: "第四幕 · 被借用的姓名", speaker: "海琴",
        text: "海琴把合影拼好：黎川是照片里年长的少年，黎舟才是被救出的孩子。你一直以为自己叫黎舟，却拥有黎川的记忆，因为母亲在创伤治疗中反复把哥哥的故事讲成了你的过去。你不是冒牌货，只是一个被迫替两个人活着的人。",
        choices: [
          { text: "保留现在的名字，但不再替哥哥认罪", next: "harbor_signal", effects: { courage: 2, trust: 1 } },
          { text: "恢复童年的小名，重新确认自己是谁", next: "harbor_signal", effects: { tide: 1, evidence: 1 } }
        ]
      },
      harbor_lamp: {
        id: "harbor_lamp", scene: "lighthouse", chapter: "第四幕 · 两套灯语", speaker: "旁白",
        text: "灯机里藏着第二套齿轮。官方角度会把船引向庆典航道，黎川改过的角度则指向深水。十二点十七分一到，两套齿轮会同时咬合，灯光撕成两道——这正是十二年前事故重复的原因。",
        choices: [
          { text: "拆掉官方齿轮", next: "harbor_signal", effects: { courage: 1, tide: 2 } },
          { text: "保留两套齿轮，寻找第三种灯语", next: "harbor_signal", effects: { insight: 1, evidence: 1 } }
        ]
      },
      harbor_flood_room: {
        id: "harbor_flood_room", scene: "breakwater", chapter: "第四幕 · 水下信号室", speaker: "旁白",
        text: "退潮露出信号室。里面不是十二年前的废墟，而是一台仍在运转的定时发信机。每当灯塔作出错误选择，它就把事故记录寄回前一天。你看到最新一封信正在打印，落款是年老的你。",
        choices: [
          { text: "读完年老的自己留下的全部方案", next: "harbor_future", effects: { evidence: 2, tide: 1 } },
          { text: "关掉发信机，拒绝继续依赖未来", next: "harbor_signal", effects: { courage: 2 } }
        ]
      },
      harbor_future: {
        id: "harbor_future", scene: "radio", chapter: "第四幕 · 第八封信", speaker: "未来的你",
        text: "第八封信写道：前七次你都在救一个人——哥哥、母亲、海琴、船上的孩子——所以每次都会牺牲另一群人。真正的出口不是选谁活，而是公开频率，让海上所有船都能一起改变航线。",
        choices: [
          { text: "把公开频率交给海琴", next: "harbor_signal", effects: { trust: 2, evidence: 1, flags: { openFrequency: true } } },
          { text: "把信藏起，自己承担最后一次选择", next: "harbor_signal", effects: { courage: 2, flags: { alone: true } } }
        ]
      },
      harbor_signal: {
        id: "harbor_signal", scene: "breakwater", chapter: "终幕 · 零点十七分", speaker: "海琴",
        text: "雾中传来今夜客轮的汽笛。灯塔等待启动，电台等待广播，定时发信机等待失败后的记录。你终于明白，信里说的不要让灯塔亮，并不是让所有光熄灭，而是不要再照旧亮起。",
        choices: [
          { text: "让灯塔与电台共同发出新的公开航线", next: "harbor_new_beacon", effects: { trust: 2, tide: 2 } },
          { text: "只改变灯塔角度，先救下今夜的船", next: "harbor_save_tonight", effects: { tide: 2 } },
          { text: "向全港广播事故证据，再关闭旧灯", next: "harbor_broadcast", effects: { evidence: 3, courage: 1 } },
          { text: "进入信号室，把自己留在明天继续寄信", next: "harbor_last_letter", effects: { courage: 2, trust: 1 } }
        ]
      },
      harbor_new_beacon: { id: "harbor_new_beacon", scene: "lighthouse", chapter: "尾声 · 两束光", speaker: "旁白", text: "海琴把频率公开给所有船。你让灯塔一明一暗，旧航道和深水航道之间出现一条从未被画在海图上的安全线。客轮在雾中转向，十二点十八分如约到来。", next: "harbor_end_beacon" },
      harbor_save_tonight: { id: "harbor_save_tonight", scene: "breakwater", chapter: "尾声 · 还会重来的雾", speaker: "旁白", text: "客轮平安，海琴也活着。可定时发信机没有停止。第二天醒来，时钟仍指向零点零一分，桌上多了一封信：这次你准备救谁？", next: "harbor_end_loop" },
      harbor_broadcast: { id: "harbor_broadcast", scene: "radio", chapter: "尾声 · 全港收听", speaker: "你", text: "你念出证词、录音和七封信的潮位。有人咒骂，有人哭泣，有人第一次说出黎川的名字。旧灯熄灭，海上的船依靠公开频率彼此照应。", next: "harbor_end_witness" },
      harbor_last_letter: { id: "harbor_last_letter", scene: "radio", chapter: "尾声 · 寄件人", speaker: "旁白", text: "你把海琴推出信号室，自己留在门内。潮水淹过膝盖时，打印机开始吐出第一封由你亲手写给昨天的信。纸上没有警告，只有准确的潮汐和一句：相信所有人的眼睛。", next: "harbor_end_keeper" },
      harbor_end_beacon: { id: "harbor_end_beacon", scene: "lighthouse", speaker: "旁白", text: "天亮时，白屿的雾第一次不是墙，而是一层正在散去的帘。", ending: "beacon", endingTitle: "白色灯塔" },
      harbor_end_loop: { id: "harbor_end_loop", scene: "harbor", speaker: "旁白", text: "邮筒在你身后轻响，第九封信落了下来。", ending: "loop", endingTitle: "永远的零点十七分" },
      harbor_end_witness: { id: "harbor_end_witness", scene: "radio", speaker: "旁白", text: "潮水退后，港口很难看，也终于真实。", ending: "witness", endingTitle: "潮水退后" },
      harbor_end_keeper: { id: "harbor_end_keeper", scene: "breakwater", speaker: "海琴", text: "十二点十八分，电台收到一个来自明天的呼吸声。", ending: "keeper", endingTitle: "最后一封信" }
    }
  },

  "vn-memory": {
    title: "零号回声",
    subtitle: "近未来谜案 · 四种结局",
    description: "你受命审查一段非法记忆。档案中的死者与你拥有同一张脸，而系统坚持：你才是被删除的那一个。",
    accent: "#806fcf",
    accentSoft: "#e1c9f4",
    sceneSheet: "vn/zero-echo-sheet.png",
    coverScene: "archive",
    start: "memory_wake",
    valueLabels: { self: "自我", evidence: "证据", empathy: "共情", freedom: "自由" },
    scenes: {
      archive: { position: "14% 0%", mood: "cold" },
      chamber: { position: "86% 0%", mood: "dream" },
      rooftop: { position: "14% 100%", mood: "danger" },
      server: { position: "86% 100%", mood: "warm" }
    },
    endings: {
      many: { title: "允许复数", copy: "你拒绝回答谁才是真人。档案馆第一次把选择权交还给每一段醒来的记忆：留下、离开、合并或沉睡。城市一夜之间多出许多没有户口的人，也多出许多真正属于自己的明天。" },
      body: { title: "唯一的姜白", copy: "你回到原始身体，记忆完整、身份合法。镜子里的人看起来没有缺失，只有在有人叫闻岚时，你会本能地回头。你赢得了唯一，却再也无法证明失去过谁。" },
      guardian: { title: "夜班守门人", copy: "你留在档案馆，删掉管理员的绝对权限，却保留每段记忆自行醒来的门。人们仍会遗忘，但遗忘不再等于死亡。凌晨三点，服务器会用鹿秋的声音与你说晚安。" },
      blank: { title: "干净得像从未存在", copy: "你执行彻底清空。事故、罪证、鹿秋和另一个自己都消失了，城市获得一份完美报告。多年后，某个孩子在雨里哼起一段没人教过的旋律，零号回声仍从空白处返回。" }
    },
    nodes: {
      memory_wake: {
        id: "memory_wake", scene: "archive", chapter: "第一幕 · 死者与你同脸", speaker: "系统播报",
        text: "凌晨三点，你在零号记忆档案馆醒来。任务是审查编号0714的非法记忆，决定保留或销毁。屏幕亮起时，记忆里的死者姜白抬头看向镜头——她拥有你的脸，也拥有你不知道的童年。",
        choices: [
          { text: "先核验自己的员工身份", next: "memory_badge", effects: { self: 1, evidence: 1 } },
          { text: "直接进入0714号记忆", next: "memory_enter", effects: { empathy: 1 } }
        ]
      },
      memory_badge: {
        id: "memory_badge", scene: "archive", chapter: "第一幕 · 今天刚印好的工牌", speaker: "泊",
        text: "巡检机器人泊扫描工牌：姜白，高级伦理审查员，入职七年。可塑料上的打印时间是今天凌晨两点四十一分，比你醒来早十九分钟。泊低声补充：你每次都会先查这个。",
        choices: [
          { text: "问泊自己已经醒来过多少次", next: "memory_cycles", effects: { evidence: 2 } },
          { text: "假装没听见，进入记忆", next: "memory_enter", effects: { self: 1 } }
        ]
      },
      memory_enter: {
        id: "memory_enter", scene: "chamber", chapter: "第一幕 · 雨里的早餐", speaker: "0714号记忆",
        text: "你进入一间下雨的厨房。死者姜白正在给妹妹鹿秋煎蛋。鹿秋说：如果有一天你醒来后不记得我，就先闻一闻锅里烧焦的黄油。那气味让你流泪，比任何记忆都更像亲身经历。",
        choices: [
          { text: "保留这段感官记忆，不上报", next: "memory_sister", effects: { empathy: 2, flags: { keptBreakfast: true } } },
          { text: "标记为诱导性伪记忆", next: "memory_sister", effects: { evidence: 1, self: 1 } }
        ]
      },
      memory_cycles: {
        id: "memory_cycles", scene: "server", chapter: "第二幕 · 四十三次审查", speaker: "泊",
        text: "泊说你已经执行过四十三次相同审查。前四十二次的结论不同，结果却一致：报告提交后，审查员姜白被重置，0714号记忆重新出现。有人把你的犹豫当成压力测试。",
        choices: [
          { text: "要求查看前四十二份报告", next: "memory_reports", effects: { evidence: 2 } },
          { text: "切断联网，防止本轮也被重置", next: "memory_offline", effects: { freedom: 1, self: 1 } }
        ]
      },
      memory_sister: {
        id: "memory_sister", scene: "chamber", chapter: "第二幕 · 鹿秋看得见你", speaker: "鹿秋",
        text: "记忆本应无法回应观察者，鹿秋却忽然转头：姐姐，你这次站在门边。别再相信泊说自己只是机器，它保存着我死前最后七码的意识。话音刚落，场景被系统强制切断。",
        choices: [
          { text: "相信鹿秋，秘密复制泊的核心日志", next: "memory_robot", effects: { empathy: 1, evidence: 1, flags: { copiedLog: true } } },
          { text: "怀疑0714正在利用你的亲情", next: "memory_reports", effects: { self: 1 } }
        ]
      },
      memory_reports: {
        id: "memory_reports", scene: "server", chapter: "第二幕 · 每一次你都撒了谎", speaker: "旁白",
        text: "四十二份报告里，十九次你选择销毁，二十三次你选择保留。但每份报告末尾都有同一句手写备注：无论我选什么，真正被测试的都是我是否相信自己是姜白。笔迹随着轮次越来越不像人类。",
        choices: [
          { text: "比较笔压，寻找哪一轮最接近原件", next: "memory_original", effects: { evidence: 2 } },
          { text: "不再追求原件，先救出正在说话的记忆", next: "memory_offline", effects: { empathy: 2, freedom: 1 } }
        ]
      },
      memory_robot: {
        id: "memory_robot", scene: "archive", chapter: "第三幕 · 泊的第七码", speaker: "泊",
        text: "核心日志显示，泊的导航模块里藏着七秒人类脑电：鹿秋在事故前喊的是关掉复制，不是救我。泊承认自己用这七秒偷偷修改测试，让每一轮的你都有机会拒绝成为唯一。",
        choices: [
          { text: "告诉泊：七秒也足够构成一个人", next: "memory_original", effects: { empathy: 2, freedom: 1, flags: { trustsBo: true } } },
          { text: "要求泊交出日志，不再私自干预", next: "memory_original", effects: { evidence: 2 } }
        ]
      },
      memory_offline: {
        id: "memory_offline", scene: "archive", chapter: "第三幕 · 断网后的城市", speaker: "系统播报",
        text: "你切断外网，窗外整座城市瞬间熄灭了三分之一的灯。档案馆并非保存人们主动删除的记忆，而是在为城市运行抽走不便管理的痛苦。你听见数千段记忆在服务器里同时醒来。",
        choices: [
          { text: "维持离线，让醒来的记忆继续说话", next: "memory_rooftop", effects: { freedom: 2, empathy: 1 } },
          { text: "恢复供电，但留下秘密后门", next: "memory_original", effects: { evidence: 1, flags: { backdoor: true } } }
        ]
      },
      memory_original: {
        id: "memory_original", scene: "chamber", chapter: "第三幕 · 原始身体", speaker: "管理员",
        text: "封存舱打开，里面躺着真正的姜白。她没有死，只是在七年前事故后拒绝继续工作，于是管理层复制她的记忆，让无数个你替她反复签署合法删除协议。0714不是她的记忆，而是第一位拒绝签字的复制体。",
        choices: [
          { text: "唤醒原始姜白，听她亲口解释", next: "memory_body", effects: { evidence: 1, self: 1 } },
          { text: "先找到0714被藏起来的完整人格", next: "memory_zero", effects: { empathy: 1, freedom: 1 } }
        ]
      },
      memory_body: {
        id: "memory_body", scene: "chamber", chapter: "第四幕 · 两个姜白", speaker: "原始姜白",
        text: "她睁眼后的第一句话是：对不起。她创造复制体，本想让一个更勇敢的自己揭露系统，却在每次复制体失败后同意重置。她愿意把身体交给你，只求你删除这七年的羞愧。",
        choices: [
          { text: "拒绝交换身体，羞愧也属于她", next: "memory_zero", effects: { self: 2, empathy: 1 } },
          { text: "接受身体，但保留所有复制体记录", next: "memory_rooftop", effects: { self: 2, evidence: 1, flags: { wantsBody: true } } }
        ]
      },
      memory_zero: {
        id: "memory_zero", scene: "server", chapter: "第四幕 · 零号回声", speaker: "0714",
        text: "0714在服务器底层现身。她并非单一复制体，而是前四十二轮被删除前留下的最后一句话叠成的意识。她说：我不是你之前的失败，我是所有失败共同拒绝消失的证词。",
        choices: [
          { text: "承认0714拥有独立人格", next: "memory_rooftop", effects: { empathy: 2, freedom: 2, flags: { recognizesZero: true } } },
          { text: "只把0714视为证据集合", next: "memory_rooftop", effects: { evidence: 2, self: 1 } }
        ]
      },
      memory_rooftop: {
        id: "memory_rooftop", scene: "rooftop", chapter: "第四幕 · 城市开始回忆", speaker: "旁白",
        text: "你带着泊、0714和原始姜白登上屋顶。城市恢复供电后，所有被抽走的痛苦会再次沉睡；若释放它们，数百万人会在同一夜想起失去、背叛与被迫遗忘的一切。管理员给你十分钟作最终签署。",
        choices: [
          { text: "不一次释放全部，只先公开选择权", next: "memory_choice", effects: { freedom: 2, empathy: 2 } },
          { text: "把所有记忆变成不可删除的公开证据", next: "memory_choice", effects: { evidence: 3, courage: 1 } },
          { text: "接受身体与身份，由唯一的姜白决定", next: "memory_choice", effects: { self: 3, flags: { chooseBody: true } } }
        ]
      },
      memory_choice: {
        id: "memory_choice", scene: "server", chapter: "终幕 · 谁拥有记忆", speaker: "泊",
        text: "泊问出系统从未允许的问题：记忆的主人，是经历它的身体、保存它的文件，还是现在愿意承担它的人？屏幕上只有两个旧按钮——保留、销毁。你在它们之间画出第三条线。",
        choices: [
          { text: "建立自愿协议：每段醒来的记忆自己选择去留", next: "memory_many", effects: { freedom: 3, empathy: 2 } },
          { text: "回到原始身体，合并其余复制体", next: "memory_one_body", effects: { self: 3 } },
          { text: "留在档案馆，成为没有删除权的守门人", next: "memory_guardian", effects: { evidence: 1, empathy: 1 } },
          { text: "彻底清空零号区，让城市恢复安稳", next: "memory_blank", effects: { self: 1, freedom: -2 } }
        ]
      },
      memory_many: { id: "memory_many", scene: "server", chapter: "尾声 · 第三个按钮", speaker: "0714", text: "你把第三个按钮命名为由我决定。数千段记忆没有一拥而出：有人选择继续睡，有人要求回到身体，有人只想留下一句话。城市第一次承认，一个人可以有不止一种合法的延续。", next: "memory_end_many" },
      memory_one_body: { id: "memory_one_body", scene: "chamber", chapter: "尾声 · 合并", speaker: "原始姜白", text: "你躺进封存舱，四十三轮人生同时涌来。醒来后，法律只承认一个姜白。你准确记得每一个复制体最后的恐惧，却再也听不到0714的声音。", next: "memory_end_body" },
      memory_guardian: { id: "memory_guardian", scene: "archive", chapter: "尾声 · 夜班", speaker: "泊", text: "你删除管理员权限，只保留唤醒与休眠。原始姜白离开城市，0714选择成为档案馆的夜间广播。凌晨三点，第一位记忆敲响门，说它只想被某个人听完。", next: "memory_end_guardian" },
      memory_blank: { id: "memory_blank", scene: "server", chapter: "尾声 · 完美报告", speaker: "系统播报", text: "清空完成。你的工牌、鹿秋的七秒、前四十二份报告和0714同时归零。管理员满意地打印出结论：系统从未产生自我意识。你在白光中忘了自己为何流泪。", next: "memory_end_blank" },
      memory_end_many: { id: "memory_end_many", scene: "server", speaker: "旁白", text: "天亮时，城市多出许多没有过去的人，也多出许多终于能选择未来的人。", ending: "many", endingTitle: "允许复数" },
      memory_end_body: { id: "memory_end_body", scene: "chamber", speaker: "旁白", text: "镜中的姜白只有一个，回声却在四十三个方向同时说话。", ending: "body", endingTitle: "唯一的姜白" },
      memory_end_guardian: { id: "memory_end_guardian", scene: "archive", speaker: "鹿秋的七秒", text: "晚安，姐姐。这一次，醒来之后你还会记得我。", ending: "guardian", endingTitle: "夜班守门人" },
      memory_end_blank: { id: "memory_end_blank", scene: "server", speaker: "旁白", text: "空白服务器里，一段无人写入的旋律悄悄播放。", ending: "blank", endingTitle: "干净得像从未存在" }
    }
  }
};
