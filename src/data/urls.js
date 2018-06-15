export default {
    'newssubmit': '/entry/distriAudit/put/?opt=saveNews', // 提交
    'newsinfo': '/entry/distriAudit/get/?opt=pullNews&sort={sort}&t=' + parseInt(Math.random() * 100000000), // 文章信息
    'downline': '/entry/distriAudit/put/?opt=recallNews', // 下线
    'stopmedia': '/entry/distriAudit/get/?opt=itemInfo&name=stopMedia', // 禁用源
    'newscount': '/entry/distribute/getLeftNewsCount/', // 新闻数量
    'repeatcheck': '/entry/news/ajax/?method=repeatCheck&title={title}&newsid={newsid}&stockcode=', // 重复检测
    'fromdata': '/input/media/mediaInfoJson/?q={keyword}', // 来源
    'parentobj': '/entry/distriAudit/get/?opt=itemInfo&name=fClass', //父对象
    'fieldconcept': '/entry/distriAudit/get/?opt=itemInfo&name=fieldConcept', //行业概念
    'tagname': '/entry/distriAudit/get/?opt=getCodeName&codeType={type}&codes={code}', // 标签code to name
    // 'tagname': 'http://10.0.5.106:7300/mock/5b07a2f5dfbd72024dbb6eda/audit/codename?codetype=us&codes=AAPL',
    'modulesearch': 'http://news.10jqka.com.cn/public/index_keyboard_{keyword}_field,concept,stock,hk,usa,xsb,bond,ijjfund_5_1_jsonp.html', // 键盘精灵
    'dictionary': '/entry/distriAudit/get/?opt=dictionary&index={index}&sort=1' // 字典
}