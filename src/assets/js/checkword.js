var delCheckWord = new Array('(\\[-?\\d+\\.?\\d+\\s+-?\\d+\\.?\\d+%\\])', '(\\(\\d*\\.?\\d+,\\s*-?\\d*\\.?\\d+,\\s*-?\\d*\\.?\\d+%\\))', '(主力建仓数据)', '\\(新版行情\\)', '\\(资讯,行情\\)', '(,股吧)', '(查看席位交易数据)', '\\(微博\\)', '<p>[\\s　]*(?:\\(|（)证券时报网快讯中心(?:\\)|）)[\\s　]*<\\/p>', '\\(来源:南方都市报[　|\\s]*南都网\\)', '\\(加入自选股,参加模拟炒股\\)', '\\(博客,微博\\)', '<p>[　\\s]*(?:<strong>)*证券时报网(?:\\(|（)www\\.stcn\\.com(?:\\)|）)[0-9]{2}月[0-9]{2}日讯[\\s　]*(?:<\\/strong>)*[\\s　]*<\\/p>', '\\(点击查看>>>期货要闻\\)', '\\(来源：11159股票学习网 http:\\/\\/www.11159.com\\)', '\\[微博\\]', '\\[[0-9\\.\\s]+%.*?股吧.*?研报\\]', '\\(中央人民广播电台推出新闻热线4008000088，拨打热线电话即可将您手中的新闻线索第一时间反馈。我们将第一时间派出记者调查事件、报道事实、揭开真相。\\)', '\\(网站21讯栏目只提供部分资讯内容，欲先人一步掌握最新资讯请下载21财经情报客户端，免费试阅http:\\/\\/www.21cbh.com\\/apps\\/\\)', '\\(行情,资金,股吧,问诊\\)', '更多更详细内容请看“股市直播室”', 'cfp', 'CFP', '东方IC', '\\(楼盘\\)', '\\(和讯放心保\\)', '\\(行情 专区\\)', '查看公告全文', '【警钟长鸣[,，]股讯快线仅作题材总结[,，]切勿盲目跟风】', '返回21世纪网首页\\s*&gt;&gt;', '\\(更多精彩财经资讯，点击这里下载华尔街见闻App\\)', '免费股票池涨停股 点击下载股市热点', '\\(-华富财经Quamnet\\/Tony-\\)', '\\(保险版官方微信：证券日报微保险\\)', '\\(红字部分涉及主观评论，高手请略去\\)', '\\(更多个股机会，请关注微信产品《证券日报最钱线》，该产品是以证券日报社市场研究中心为团队，以市场行情数据为核心，以图表、K线图为特色，面向投资者及专业人群，提供个性化证券资讯服务的微信产品。\\)', '\\(更多独家财经新闻，请加微信号cbn-yicai\\)', '\\(南方财富网股票频道\\)', '更多相关知识请关注南方财富网。', '\\(财苑\\)', '【定制服务】', '【在线答疑】', '分享微博赚云币', '只需点击左边“分享到微博”按钮，成功分享微博，即可自动获得 0.5云币 喔！云币可用于免费兑换云财经各种增值服务，1云币=1人民币喔！', '）注册会员免费体验股市“VIP参考”服务，享受最新题材消息自动提醒，还可用手机端实时接收喔！', '和讯股票(微信号：istocknews)', '证券时报网(www.stcn.com)', '<p>[\s　]*(?:\(|（)证券时报.e公司(?:\)|）)[\s　]*<\/p>', '证券时报网(www.stcn.com)', '和讯股票(微信号：istocknews)消息', '更多黄金，外汇，国际原油，股市等市场详情资讯请关注微信号"lhw918018”', '证券时报新三板论坛(微信ID：zqsbxsb)讯，', '更多黄金，外汇，国际原油，股市等市场详情资讯请关注微信号"lhw918018”', '新浪声明：新浪网登载此文出于传递更多信息之目的，并不意味着赞同其观点或证实其描述。文章内容仅供参考，不构成投资建议。投资者据此操作，风险自担。', '证券时报新三板论坛(微信ID：zqsbxsb)讯，', '(微信号：huoshan5188)', '证券时报网(www.stcn.com)', '投资界（微信ID：pedaily2012）', '加笔者', 'V心搜索', '薇信', '万得', '通达信', '交流群', '智通财经APP获悉，', '智通财经APP讯，', '犀牛之星(ipo3.com)自选股显示，', '据智通财经APP了解，', 'choice', 'Choice', '时代财经APP', '本文来自华尔街见闻', '智通财经APP', '【解读新三板微信公众号：jdxsb888】', '点击查看更多盈利预测数据', '提示：点击上方"证券市场周刊"↑免费订阅本刊', '打开微信，点击底部的“发现”， 使用“扫一扫”即可将网页分享至朋友圈。', '中证公告快递及时披露上市公司公告，提供公告报纸版面信息，权威的“中证十条”新闻，对重大上市公司公告进行解读。', '详情请登录黄金头条www.goldtoutiao.com', '高风险基金组合配置', '低风险基金组合配置', '关注手机中金网(http://m.cngold.com.cn)，掌握最新财经要闻。', '慧聪买化塑研究院重磅推出《中国化工产品市场分析》，以降低采购成本、国内外上下游政策导向为主线，对行业市场发展做点睛与分析。', '单项报告6000/年', '若想了解更多关于化工市场周报信息，详情请咨询陈先生15313347544，亦可发送免费阅读申请(发送化工周报，公司+姓名+邮箱+手机号码)到chenxiaohui@hc360.com(免费试阅2周)。', '或关注慧聪化工网微信公众号留言发送化工周报，公司+姓名+邮箱+手机号码，我们会及时与您联系。', '下雨来源于格隆汇APP', '下图来源于格隆汇APP', '关注手机中金网(http://m.cngold.com.cn)，掌握最新财经要闻。', '欢迎关注红刊财经微信号(hkcj2016) ，版权所有，侵权必究。', '配资添加微信：kpw56789', '查看各煤种的历史价格情况请登录中国煤炭市场网http://www.cctd.com.cn；', '下图来源于格隆汇APP', '关注《易说》微信公众号就可以免费领取价值398元的精品股票投资课程光盘或者是在线课程资料；另外，在《易说》的微信公众号，也有资深的投资顾问为您解答个股问题。在微信搜索公众号：yishuo618，添加关注，查看详情。', '点击进入文章来源地址', 'www.hibor.com.cn【慧博投研资讯】', '打开微信，点击底部的“发现”， 使用“扫一扫”即可将网页分享至朋友圈。', '新闻和报纸摘要全文>>>', '关注手机中金网(http://m.cngold.com.cn)，掌握最新财经要闻。', '分享至：', '更多一手新闻，欢迎下载凤凰新闻客户端订阅凤凰网科技。想看深度报道，请微信搜索“iFeng科技”。', '下载APP 阅读本文更深度报道', '本文为BWC中文网原创作品，财经驱动你世界，更多最新最热原创全球财经资讯，请搜索微信公众号“BWC中文网”(ID:bwchinesewx)关注', '或到各大应用商店下载BWC中文网APP客户端。', '更多深度行业分析尽在【前瞻经济学人APP】，还可以与500+经济学家/资深行业研究员交流互动。');
var refuseCheckWord = new Array('共党', '温云松', '胡紧套', '指南针', '赢富王', '超赢数据', '金融界', '钱龙', '东方财富', '共产党', '聚源数据', '东财', '中财', '东方财富网', '名策数据', '益盟', '巨灵数据', '点击查看', '详见全球实时行情', '多盈', '智多赢', '日本固有领土', '胡温的政治遗产', '失去政治信任', '政府在做什么', '华尔街日报', '神光主力资金系统', '全景网', '点击此处注册', '新闻和报纸摘要全文', '招聘岗位', '应聘岗位', '赌博', '彩票', '新财经', '整形医院', '投资与理财', '南方日报', '南方网', '男科', '医院哪家好', '前列腺', '减肥', '减肥茶', '彩民', '众彩网', '开奖', '乐透', '双色球', '必赢彩票', '百家乐', '娱乐城', '世华财讯', '光明日报', '光明网', '广州日报', '南方都市报', '深圳新闻网', '深圳特区报', '深圳晶报', '晶报', '深圳商报', '深圳晚报', '财新网', '福布斯中文网', '新京报', 'CFP', 'C FP', 'CF P', 'C F P', '理财周报', '大河网', '河南日报', '河南日报农村版', '大河报', '健康报', '大河健康报', '文摘报', '大河文摘报', '河南商报', '河南法制报', '豫北新闻', '财新记者', '黄金城', '评级简报', '（上接B1版）', '（上接A1版）', '（上接B2版）', '财新', '财联通讯社', '财联社', '盘前提示', '微信号', '我好友与我交留', '好股池', '活期宝', '令计划', '编辑短信', '路透', '2015年前三季度主要财务指标', '彭博社', '姘头', '淫乱', '李瑞英', '失势风向标', '中共前党魁', '违规动用军费', 'SZY', '宋祖英', '上证决策参考', '中证投资参考', '狱中异地关押', '前国家政协副主席', '京华时报', 'JQL', '网搜', '贾庆林', '谷俊山现象', '军委深改组', '乱军王政', '买官买爵', '倒卖军火', '贪污军产', '钟绍军军头私分', '梁光烈', '徐才厚', '郭伯雄', '刘源', '博爱小站', '刘氏父子', '刘云山', '刘云三', 'LLF', '刘乐飞', '郎咸平', '郭美美', '更新中', '讲堂', '山东步长', '南都', '添升宝', '谷俊山', '李克强', '天天基金', '资金研报', '相关公司股票走势', 'G20主场地', '西湖蓝', 'G20峰会的主场地', '习近平', '众禄', '数米', '好买', '蚂蚁', '宁高宁', '参考消息', '直播', '超级云脑', '二维码', '智慧农业', '上接', '下接', 'fupan588', 'wabeiwang', '微信', 'g20', 'G20', '小财', '供图', '新华网', '好未来', '金融界', '微博', '阿里巴巴', '京东', '苹果', '网易', '高盛', '花旗', '百度', '张银银', '杠杆游戏', '张千里', '界面', '联合早报', '经济通', '彭博', '纽约时报', '华富财经', '十九大', '香港经济日报', '日经中文网', '台独', '吾尔开希', '魏京生', '王丹', '刘晓波', '法轮功', '宋平', '刘仲敬', '李硕', '疆独', '东突', '热比娅', '黄之锋', '蔡英文', '陈水扁', '李登辉', '赵紫阳', '胡耀邦', '郭文贵', '周永康', '薄熙来', '王岐山', '王沪宁', '刘延东', '刘奇葆', '许其亮', '孙春兰', '孙政才', '汪洋', '张春贤', '张高丽', '张德江', '范长龙', '孟建柱', '赵乐际', '胡春华', '栗战书', '俞正声', '郭金龙', '韩正', '大跃进', '文革', '文化大革命', '四人帮', '澎湃', '刘少奇', '周恩来', '朱德', '陈云', '邓小平', '江泽民', '荣毅仁', '胡锦涛', '曾庆红', '李源潮', '温家宝', '李鹏', '华国锋', '于广洲', '马凯', '马飚', '马兴瑞', '马晓天', '王君', '王侠', '王珉', '王勇', '王晨', '王毅', '王三运', '王万宾', '王玉普', '王正伟', '王东明', '王光亚', '王伟光', '王安顺', '王志刚', '王沪宁', '王国生', '王学军', '王建平', '王胜俊', '王洪尧', '王宪魁', '王冠中', '王家瑞', '王教成', '王新宪', '王儒林', '支树平', '尤权', '车俊', '尹蔚民', '巴音朝鲁', '巴特尔', '卢展工', '叶小文', '田修思', '白玛赤林', '白春礼', '吉炳轩', '朱小丹', '朱福熙', '全哲洙', '刘鹏', '刘鹤', '刘亚洲', '刘成军', '刘伟平', '刘延东', '刘奇葆', '刘晓江', '刘家义', '刘粤军', '刘福连', '许达哲', '许其亮', '许耀元', '孙怀山', '孙建国', '孙春兰', '孙思敬', '苏树林', '杜青林', '杜金才', '杜恒岩', '李伟', '李斌', '李从军', '李东生', '李立国', '李纪恒', '李学勇', '李建华', '李建国', '李鸿忠', '杨晶', '杨传堂', '杨金山', '杨栋梁', '杨洁篪', '杨焕宁', '肖钢', '肖捷', '吴昌德', '吴胜利', '吴爱英', '吴新雄', '何毅亭', '冷溶', '汪永清', '沈跃跃', '沈德咏', '宋大涵', '宋秀岩', '张阳', '张茅', '张毅', '张又侠', '张仕波', '张庆伟', '张庆黎', '张志军', '张国清', '张宝顺', '张海阳', '张裔炯', '陆昊', '陈希', '陈雷', '陈全国', '陈求发', '陈宝生', '陈政高', '陈敏尔', '努尔&#8226;白克力', '苗圩', '林军', '林左鸣', '尚福林', '罗志军', '罗保铭', '周济', '周强', '周本顺', '周生贤', '郑卫平', '房峰辉', '孟学农', '项俊波', '赵实', '赵正永', '赵克石', '赵克志', '赵宗岐', '赵洪祝', '胡泽君', '姜大明', '姜异康', '骆惠宁', '秦光荣', '袁纯清', '袁贵仁', '耿惠昌', '聂卫国', '贾廷安', '夏宝龙', '铁凝', '徐守盛', '徐绍史', '徐粉林', '高虎城', '郭声琨', '杨家才', '王会民', '方星海', '陈雨露', '范一飞', '王鸿津', '张晓慧', '刘国强', '周永康', '刘士余', '梁涛', '李超', '方海星', '赵争平', '黄炜', '周延礼', '陈新权', '王祖继', '陈文辉', '黄洪', '郭庚茂', '蒋洁敏', '韩长赋', '焦焕成', '谢伏瞻', '强卫', '楼继伟', '解振华', '褚益民', '蔡武', '蒋建国', '蒋定之', '郭树清', '黄兴国', '黄奇帆', '黄树贤', '曹建明', '戚建国', '常万全', '鹿心社', '彭勇', '彭清华', '蔡名照', '蔡英挺', '张育军', '周小川', '易纲', '郭庆平', '杨子强', '殷勇', '周慕冰', '郭利根', '王兆星', '杜金富', '姜洋', '蔡赴朝', '雒树刚', '魏亮', '魏凤和', '潘功胜', '李东荣', '王华庆', '曹宇', 'Wind', '共青团', '留言', '推荐阅读', '韩志国', '反右', '六四', '天安门事件', '天天基金网', 'FT中文', '姚刚', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '裕固族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '撒拉族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族', '道教', '佛教', '天主教', '基督教', '伊斯兰教', '陈良宇', '柴玲', '许志永', '冉云飞', '曾伟', '曾宝宝', '陈希同', '王宝森', '王洪文', '张春桥', '江青', '姚文元', '北戴河', '瘟家宝', '瘟贾宝', '刘云', '胡紧掏', '李纪周的后台', '李树芬', '毛泽东', '毛新宇', 'WIND', 'W ind', '关岛', '金三胖', '示威游行', '半岛危机', '中印危机', '核武器', '钦本立', '王若望', '刘宾雁', '芮杏文', '陈一咨', '严家其', '吴稼祥', '王立军', '胡德平', '胡德华', '叶选廉', '叶选平', '叶选宁', '陈元', '陈方', '邓朴方', '邓质方', '鲍彤', '艾未未', '陈光诚', '贺卫方', '高行健', '藏青会', '林彪', '彭丽媛', '中南海', '人民大会堂', '共产主义', '公投', '社会主义', '国家干部', '达赖', '恐怖袭击', '识别关注', '历史消息', '在线免费', '阅读原文', '免费领取', '国民党', 'wind', '上山下乡', '大智慧', '万得通讯社', '同花顺', '同花顺财经', '同花顺综合', '官僚', '职务犯罪', '活动礼包', '免费赠送', '开户', '上一页', '下一页', 'app', 'choice', '维稳', '十九big', '19big', '19D', '中车', '贵金属交易所', '津贵所', '万得', '大众维权易栏目', '发至邮箱', '致电', '公众号', '郭广昌失联', '易索赔', '大众维权易', '邮箱', '推荐股票', '今日推荐', '明日推荐', '牛股推荐', '推荐个股', '买卖建议', '建议买入', '免费福利', '免费牛股', '免费福利股', '分享股票', '分享牛股', '牛股分享', '福利股', '分享的这只牛股', '强势个股分享', '鲁炜', '腾讯财经', '君羊', '全景视觉', '视觉中国', '东方IC', '南京大屠杀', '进门财经APP', '百万用户都在看', '聚股票', 'Q粉', '“易索赔”频道组织的索赔报名', '修宪', '宪法', 'Xi Jinping', 'Peng Liyuan', 'Xi Mingze', 'Li keqiang', 'Wang Qishan', 'Hu jintao', 'Wen jiabao', 'Wu bangguo', 'Jiang Zeming', 'Jiang Mianheng', 'Zeng Qinghong', 'Zhu rongji', 'Deng Xiaoping', 'Zhao Ziyang', 'Hu Yaobang', 'Zhou Yongkang', 'Ling jihua', 'Bo Xilai', 'Wang lijun', 'Neil Heywood', 'Guo wengui', 'Princelings', 'Shanghai clique', 'Tuanpai', 'New Zhijiang Army', 'Panama Papers', 'Yasukuni Shrine', 'Wu Xiaobo', 'Chai Ling', 'Falun Gong', 'Falungong', 'Li hongzhi', 'Dalai Lama', 'Tibetan independence', 'Central Tibetan Administration', 'CTA', 'freetibet', 'Xinjiang independence', 'East Turkistan', 'world Uyghur Congress', 'WUC', 'The Eastern Turkistan Islamic Movement', 'ETIM', 'Islamic extremism', 'separatists', 'Rebiya', 'Dilixiati', 'Wei jingsheng', 'dajiyuan', 'epoch times', 'peace hall', 'hrichina', 'minghui', 'zhengjian', 'Dissident', 'one-party system', 'single-party system', 'term limit', 'National Endowment for Democracy', 'NED', 'Democracy Movement', 'Jasmine Revolution', 'pro-democracy protests', 'China libera', 'Right groups', 'Beijing Spring', 'The 1986 Student Demonstrations', 'Charter 08', 'Umbrella Revolution', 'Umbrella Movement', 'Weiquan movement', 'The Tiananmen Square protests of 1989', 'June Fourth Incident', 'The Ghulja incident', 'The July 2009 &#220;rümqi riots', '笔者微信', '加V');
var infoCheckWord = new Array('周一', '周二', '周三', '周四', '周五', '周六', '周日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日', '星期天', '1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日', '2016', '2015', '2014', '2013', '2012', '2011', 'APP', '爱屁屁', '微信公众号', 'QQ群', 'QQ', '扣扣', '威信', 'V信', '微 信 公 众 号', '加群', '加Q', '扣.扣', '荐股', '重点关注', '值得关注', '建议关注', '操盘建议', '持仓建议', '今日牛股', '股票池', '埋伏', '获利', '吃进', '交割单', '选牛股', '金股股池', '大咖问股', '潜力牛股', '涨停雷达', '一分钟擒牛战法', '三步擒牛战法', '涨停复制战法', '2017');