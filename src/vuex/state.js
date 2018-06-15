export default {
    loading: 0, // 1为正在提交
    // all
    info: [],
    linestatus: 0, // 0 在线  1下线
    newssort: 0, // 0 默认最早 1 最新
    newsIds: [],
    disInfo: [], // 当前
    disNewsids: [],
    disContent: '',
    stopmedia: [], // 禁用源
    sourceshow: 0, // 0 关闭 1 打开
    ifsourceurl: 0, // 是否能打开来源地址 0 能 是禁用源 1 不能 不是禁用源
    // input 
    searchmessage: '',
    objectmessage: '',
    // ntitle: '', // 文章标题
    // top
    count: [],
    // from
    fromresult: [],
    samenews: null,
    // obj
    pobjinfo: [],
    pobjall: [],
    pobjweight: [], // 重要父对象
    // keyboard
    relstock: [], //用来检测标红某些A股
    keyboard: [],
    keyboardkey: ["field", "concept", "a", "hk", "us", "xsb", "bond", "fund"],
    keycode: '', // 键盘操作当前行代码
    field: [], // 行业  
    concept: [], // 概念
    a: [], // {name: '', code: '', red: true}
    hk: [],
    us: [],
    xsb: [],
    bond: [],
    fund: [],
    stocktags: [],
    relative: [],
    // img  'http://i.thsi.cn/images/ifund/home/ynew/dbfestival/banner1.jpg', http://i.thsi.cn/images/ifund/home/ynew/fund520/ban1con.jpg
    // newsimages: ['http://i.thsi.cn/images/ifund/home/ynew/dbfestival/banner1.jpg', 'http://i.thsi.cn/images/ifund/home/ynew/fund520/ban1con.jpg', 'http://i.thsi.cn/images/ifund/home/ynew/getnfund/banner.jpg'],
    newsimages: [{
        img: ''
    }, {
        img: ''
    }, {
        img: ''
    }],
    // fieldconcept
    fieldmodule: [],
    conceptmodule: [],
    // submit check
    checkwords: {},
    // 删除原因
    deleteReason: [],
    deleteWord: [],
    infoWord: [],
    refuseWord: [],
    adWord: [],
    //编辑器配置
    editorConfig: {}
}