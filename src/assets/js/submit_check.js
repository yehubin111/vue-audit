import store from '../../vuex/index'
import { set_content, getUEditor, get_content } from './input-news'

var unitId = '';

/**
 * 提交之前的总体判断
 * 1:违禁词，不允许内容检测
 * 2:表单检查
 * 3:带有权重的class 检查
 */
export function submit_check() {
    unitId = store.state.disInfo[0].id;
    if (!unitId) {
        unitId = ''
    }
    PrepareSave(unitId);
    if (!check_word_forbidden(unitId)) {
        return false;
    }
    if (!check_word_del(unitId)) {
        return false;
    }
    if (!check_word_refuse(unitId)) {
        return false;
    }
    if (!keyword_checker(unitId, "regexp")) {
        return false;
    }
    if (!form_checker(unitId)) {
        return false;
    }
    if (!checkWeightClass(unitId)) {
        return false;
    }
    return true;
}

//违禁词
let word_forbidden_globle = '';

function check_word_forbidden(unitId) {
    var checkRes = false;
    //排除要闻精华、push栏目
    $("input[name='classIds" + unitId + "[]']").each(function() {
        var val = $(this).val();
        if (
            '002002011' == val || '002002011_0' == val ||
            '080002003026' == val || '080002003026_0' == val ||
            '080002009' == val || '080002009_0' == val
        ) {
            checkRes = true;
        }
    });
    var parVal = $.trim($("input[name='ftClassId" + unitId + "']").val());
    var classid = ['002002011', '080002003026', '080002009'];
    if (parVal.indexOf('_') != -1) {
        parVal = parVal.substr(0, parVal.indexOf('_'));
    }
    if ($.inArray(parVal, classid) != -1) {
        checkRes = true;
    }
    word_forbidden_globle = '';
    var text_title = store.state.disInfo[0].title;
    var text_content = get_content(unitId);
    $.ajax({
        url: '/entry/news/ajax/',
        type: 'POST',
        data: { method: 'forbiddenCheck', title: text_title, content: text_content },
        dataType: 'json',
        async: false,
        success: function(data) {
            word_forbidden_globle = data.msg;
        },
        error: function(e) {
            console.log(e);
        }
    });
    if (word_forbidden_globle != '') {
        if (!checkRes) {
            var message = "您发布资讯里面有违禁词:\n" + word_forbidden_globle + "\n" + "不允许发布\n";
            alert(message);
            return false;
        } else {
            var message = "您发布资讯里面有违禁词:\n" + word_forbidden_globle + "\n" + "确定发布？\n";
            if (!confirm(message)) {
                return false;
            }
        }
    }
    return true;
}

//检查不允许的内容
function check_word_del(unitId) {
    let wordCheck = word_del_check(unitId);
    let words = wordCheck[0];
    let titles = wordCheck[1];
    let contents = wordCheck[2];
    if (words.length > 0) {
        var message = "您发布资讯里面有不允许的内容:\n" + words.join() + "\n" + "是否删除后发布\n";
        if (confirm(message)) {
            for (var i = 0; i < idLength; i++) {
                if (!titles[i] && !contents[i]) {
                    continue;
                }
                document.getElementById('title' + unitIds[i]).value = titles[i];
                set_submit_content(contents[i], unitIds[i]);
            }
        } else {
            return false;
        }
    }
    return true;
}

//再次检查 政策性方面的关键词
function check_word_refuse(unitId) {
    var flag = true;
    if (!word_refuse_check(unitId)) {
        flag = false;
    }
    return flag;
}

// 检查是否有refuseCheckWord 关键词在里面
function word_refuse_check(unitId) {
    var text = clean_font_color(get_content(unitId));
    var word = store.state.refuseWord;
    var flag = true;
    let wordLength = word.length;
    for (var i = 0; i < wordLength; i++) {
        if (text.indexOf(word[i]) != -1) {
            if (!confirm("文章中有禁止发布的关键词\n" + word[i] + "\n请确定是否发布\n")) {
                /*弹窗提醒需求变更 chenbowen 2014-09-18*/
                flag = false;
            }
        }
    }
    if (flag) {
        set_submit_content(text, unitId);
    }
    return flag;
}

//todo::与之前的检测重复
function keyword_checker(unitId, type) {
    let flag = true;
    switch (type) {
        case "regexp":
            if (!check_regexp(unitId)) {
                flag = false;
            }
            break;
        default:
            break;
    }
    return flag;
}

function check_regexp(unitId) {
    var text_title = store.state.disInfo[0].title;
    var text_content = get_content(unitId);

    var pattern = /(?:\(|（)[^\(\)（）]*?(?:资讯|吧|股票吧|行情|新版行情|<font[^>]*>[0-9\.\-]+<\/font>)[^\(\)（）]*?(?:\)|）)/gi;
    var matchresult = new Array();
    var tmp = text_title.match(pattern);
    if (tmp)
        matchresult = matchresult.concat(tmp);
    tmp = text_content.match(pattern);
    if (tmp)
        matchresult = matchresult.concat(tmp);

    if (matchresult.length > 0) {
        var message = "您发布资讯里面有不允许的内容:\n" +
            matchresult + "\n" +
            "是否删除后发布\n";
        if (confirm(message)) {
            text_title = text_title.replace(pattern, '');
            store.dispatch('updateTitle', text_title);

            text_content = text_content.replace(pattern, '');
            set_submit_content(text_content, unitId);
        } else {
            return false;
        }
    }
    return true;
}

/**
 * 处理股票代码
 */
function PrepareSave(unitId) {
    //清除直观显示的图片简要
    clearImgInfo(unitId);
    // If the textarea isn't visible update the content from the editor.
    var oEditor = getUEditor(unitId);
    var content = oEditor.getContent();

    //去除正文中个股代码（table中的不去除）
    var tableReg = /<table[^>]*>(?:.*?)<\/table[^>]*>/g;
    var codeStrReg = /[（(][0-9]{6,}[\.a-zA-Z]*(?:，|收盘价|元|[0-9\.])*[)）]/g;
    var allTable = content.match(tableReg);
    if (allTable) {
        for (var j = 0; j < allTable.length; j++) {
            content = content.replace(allTable[j], '##table:' + j + '##');
        }
        content = content.replace(codeStrReg, '');
        for (var j = 0; j < allTable.length; j++) {
            content = content.replace('##table:' + j + '##', allTable[j]);
        }
    } else {
        content = content.replace(codeStrReg, '');
    }

    oEditor.setContent(clean_font_color(content));
}

//去掉敏感词着色,添加劵商要求
function clean_font_color(stringTxt) {
    var content = stringTxt.replace(/(\sstyle=\"color:\s*#(?:FF00FF|FAB145|FFB6C1|FF0000|e47833));?\"/gi, "");
    //劵商版本需要屏蔽一些信息
    var contentAry = $('<flashcmstag>' + content + '</flashcmstag>');
    if ($('a', contentAry).length) {
        $.each($('a', contentAry), function() {
            var tmpHref = $(this).attr('href');
            if (tmpHref != '###') {
                if (tmpHref.indexOf('10jqka.com.cn') == -1 && tmpHref.indexOf('www.iwencai.com') == -1) {
                    $(this).addClass('brokers_hidden');
                } else if (!tmpHref.match(/\/20\d{6}\/c\d{9}\.shtml/ig)) {
                    $(this).addClass('brokers_hidden');
                }
            }
        });
    }
    if ($('div', contentAry).length) {
        $.each($('div', contentAry), function() {
            $(this).addClass('brokers_hidden');
        });
    }
    var pushContent = $(contentAry).html();
    return pushContent;
}


//检查需要删除的词,并替换掉相应的内容
function word_del_check(unitId) {
    var text_title = store.state.disInfo[0].title;
    var text_content = get_content(unitId);
    var word = store.state.deleteWord;
    var found = new Array();
    let wordLength = word.length;
    for (var i = 0; i < wordLength; i++) {
        var pattern = new RegExp(word[i], "g");
        if (pattern.test(text_title)) {
            found.push(word[i]);
            text_title = text_title.replace(pattern, '');
        }
    }

    for (var i = 0; i < word.length; i++) {
        var pattern = new RegExp(word[i], "g");
        if (pattern.test(text_content)) {
            found.push(word[i]);
            text_content = text_content.replace(pattern, '');
        }
    }
    return [found, text_title, text_content];
}

/**
 * 清除直观显示的图片简要
 * @param unitId
 * @return
 */
function clearImgInfo(unitId) {
    if (!unitId) {
        var unitId = '';
    }
    var content = getUEditor(unitId).getContent();
    //图片简要
    content = content.replace(/<input[^>]+value="[-]+图片摘要-#[^>]+#[-]+"[^>]+>/gi, '');
    set_content(content, unitId);
}

//体检检测处理的content
function set_submit_content(val, unitId) {
    if (!unitId) {
        var unitId = '';
    }
    getUEditor(unitId).setContent(val);
    store.dispatch('updateContent', val)
}

/**
 * 检测 解盘的简介
 *      新闻父对象
 *      股票代码识别
 *      各项参数的检测
 */
//如果标题的长度不在8到36之间，那么不能提交
function checkTitleLength(unitId) {
    var titleInput = $('[name=title' + unitId + ']'),
        title = titleInput.val().replace(/\s+$/, ''),
        length = title.replace(/[\u0391-\uFFE5]/g, "aa").length / 2;
    if (length < 8 || length > 36) {
        if (!confirm("新闻标题长度必须在8到36个字之间,是否要提交？")) {
            // titleInput.focus();
            return false;
        }
    }
    return true;
}

function form_checker(unitIds) {
    var unitId = unitIds;

    var checkRes = true;
    if (!checkTitleLength(unitId)) {
        return false;
    }
    //如果“解盘弹窗 ”，那么简介不能为空
    // $("input[name='classIds" + unitId + "[]']").each(function() {
    //     if ('004021' == $(this).val() || '004021_0' == $(this).val()) {
    //         if ("" == $.trim($("#summ" + unitId).val())) {
    //             alert('新闻' + (i + 1) + "：勾选“解盘弹窗 ”时新闻简介不能为空");
    //             $("#summ" + unitId).focus();
    //             checkRes = false;
    //             return false;
    //         }
    //     }
    // });
    if (!checkRes) {
        return checkRes;
    }
    //软文简介不能为空
    var parVal = $.trim($("input[name='ftClassId" + unitId + "']").val());
    var softNewsClassid = ['080003009', '080003015001', '080003015002', '080003015003', '080003015004', '080003015005', '080003016001', '080003016002', '080003016003', '080003016004', '080003016005'];
    if (parVal.indexOf('_') != -1) {
        parVal = parVal.substr(0, parVal.indexOf('_'));
    }
    // if ($.inArray(parVal, softNewsClassid) != -1 && "" == $.trim($("#summ" + unitId).val())) {
    //     alert('新闻' + (i + 1) + "：软文简介不能为空");
    //     $("#summ" + unitId).focus();
    //     return false;
    // }
    //检查股票代码数量
    var sCodes = $.trim($("input[name='stockCodes" + unitId + "']").val());
    if (sCodes.length > 300 * 7 - 1) {
        alert("个股代码超出限制");
        // $('#stockCodes' + unitId).focus();
        return false;
    }

    //检查是否有设置父对象
    var parVal = store.state.checkwords['classIds'];
    if (0 == parVal.length) {
        alert("未设置父对象");
        return false;
    } else if (parVal.indexOf('003002_0') != -1 || parVal.indexOf('003002') != -1 ||
        parVal.indexOf('003004_0') != -1 || parVal.indexOf('003004') != -1 ||
        parVal.indexOf('001033_0') != -1 || parVal.indexOf('001033') != -1) {
        /*弹窗提醒需求变更 chenbowen 2014-09-18*/
        //父对象名称：公司要闻，公司公告摘要，投资机会
        //提醒识别代码
        if (!$('[name=stockCodes' + unitId + ']').val()) {
            if (!confirm("未识别相关股票代码，确认提交吗？")) {
                return false;
            }
        }
        //父对象名称：美股公司新闻
    } else if (parVal.indexOf('002015003_0') != -1 || parVal.indexOf('002015003') != -1) {
        //提醒识别美股代码
        if (!$('[name=usCodes' + unitId + ']').val()) {
            if (!confirm("未识别美股代码，确认提交吗？")) {
                return false;
            }
        }
        //父对象名称：港股公司新闻
    } else if (parVal.indexOf('014003_0') != -1 || parVal.indexOf('014003') != -1) {
        //提醒识别港股代码
        if (!$('[name=hkCodes' + unitId + ']').val()) {
            if (!confirm("未识别港股代码，确认提交吗？")) {
                return false;
            }
        }
    }
    var classidCode = {
        '002008': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002009': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002045': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002004': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '002017080': { 'stock': 1, 'field': 1, 'us': 1, 'hk': 1 },
        '017002': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '002051': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '002034': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '002050': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002006': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '002011010': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002011011': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002011012': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002011': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '004002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '004051': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '002002': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '002048': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '002049': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '003002': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '004023': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '003022': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '004001': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '004004': { 'stock': 1, 'field': 1, 'us': 1, 'hk': 1 },
        '020002': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '020001': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '090001': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '003004': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '003026': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '001033': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '004006': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '006001': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '006002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '006028': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '006027': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '006029': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '006030': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '010001': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '014025': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 1 },
        '014001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '014026': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 1 },
        '014003': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 1 },
        '014021': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 1 },
        '014027': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 1 },
        '014022': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 1 },
        '014024': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '017007': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '017005': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '017020': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '007002': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '026020': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '009002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '009006': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '009001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002015006': { 'stock': 0, 'field': 1, 'us': 1, 'hk': 0 },
        '002015003': { 'stock': 0, 'field': 1, 'us': 1, 'hk': 0 },
        '002015008': { 'stock': 0, 'field': 0, 'us': 1, 'hk': 0 },
        '002015005': { 'stock': 0, 'field': 0, 'us': 1, 'hk': 0 },
        '002015004': { 'stock': 0, 'field': 0, 'us': 1, 'hk': 0 },
        '005041002003': { 'stock': 0, 'field': 0, 'us': 1, 'hk': 0 },
        '002015': { 'stock': 0, 'field': 1, 'us': 1, 'hk': 0 },
        '081001': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '081005': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '081004': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '081002': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '081003': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '081007': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '081011': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '081006': { 'stock': 1, 'field': 0, 'us': 0, 'hk': 0 },
        '008001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008020': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008003002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008005006002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002038': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008013004002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008013004001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008013004': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008013006': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008003001004': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008003001001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '002098': { 'stock': 1, 'field': 1, 'us': 0, 'hk': 0 },
        '008002024': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002003': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002001': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002004': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002017': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002007': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002018': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002034': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002036': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002037': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002038': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002019': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002020': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002026': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002021': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002022': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002023': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002030': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002039': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002035': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002027': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002033': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002028': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002029': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002032': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002031': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002016': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002010': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002005': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002006': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002008': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002009': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002011': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002012': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002013': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002014': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002015': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008002025': { 'stock': 0, 'field': 0, 'us': 0, 'hk': 0 },
        '008013001': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
        '008013003': { 'stock': 0, 'field': 1, 'us': 0, 'hk': 0 },
    };
    var flag = true;
    var pushFlag = false;
    //检测push父对象
    $('[name="classIds' + unitId + '[]"]').each(function() {
        var val = $.trim($(this).val());
        if (val.indexOf('_') != -1) {
            val = val.substr(0, val.indexOf('_'));
        }
        if (classidCode[val]) {
            if (classidCode[val].stock == 1 && $('[name=stockCodes' + unitId + ']').val()) {
                pushFlag = true;
            }
            if (classidCode[val].us == 1 && $('[name=usCodes' + unitId + ']').val()) {
                pushFlag = true;
            }
            if (classidCode[val].hk == 1 && $('[name=hkCodes' + unitId + ']').val()) {
                pushFlag = true;
            }
            if (classidCode[val].field == 1 && $('[name="fieldCodes' + unitId + '[]"]').val()) {
                pushFlag = true;
            }
        } else {
            pushFlag = true;
        }
    });
    $('[name="classIds' + unitId + '[]"]').each(function() {
        var val = $.trim($(this).val());
        if (val.indexOf('_') != -1) {
            val = val.substr(0, val.indexOf('_'));
        }
        if (classidCode[parVal] && pushFlag == false) {
            if (classidCode[parVal].stock == 0 && $('[name=stockCodes' + unitId + ']').val()) {
                flag = false;
                alert(val + '该父对象不可以有个股代码');
            }
            if (classidCode[parVal].us == 0 && $('[name=usCodes' + unitId + ']').val()) {
                flag = false;
                alert(val + '该父对象不可以有美股代码');
            }
            if (classidCode[parVal].hk == 0 && $('[name=hkCodes' + unitId + ']').val()) {
                flag = false;
                alert(val + '该父对象不可以有港股代码');
            }
            if (classidCode[parVal].field == 0 && $('[name="fieldCodes' + unitId + '[]"]').val()) {
                flag = false;
                alert(val + '该父对象不可以有行业代码');
            }
        }
    });
    if (!flag) return false;

    //检查标题是否为空
    var title = $.trim($("[name=title" + unitId + ']').val());
    if ('' == title) {
        alert("未写标题");
        // $("#title" + unitId).focus();
        return false;
    } else {
        if (title.indexOf(',') != -1 || title.indexOf('，') != -1 || title.indexOf('。') != -1 || title.indexOf('；') != -1 || title.indexOf('…') != -1 || title.indexOf(';') != -1 || title.indexOf('...') != -1 || title.indexOf('···') != -1) {
            alert("标题不能有标点符号");
            // $("#title" + unitId).focus();
            return false;
        }
    }

    //检查来源是否为空
    var tmpSource = $.trim($("[name=source" + unitId + ']').val());
    tmpSource = tmpSource.replace(/\s/g, "");
    if ('' == tmpSource) {
        alert("未写来源");
        // $("#source" + unitId).focus();
        return false;
    } else {
        //检查来源是否为禁用来源
        if (store.state.ifsourceurl == 0) {
            if (!confirm((tmpSource + "来源禁用，提交后正文为空"))) {
                // $("#source" + unitId).focus();
                return false;
            } else {
                if (!($("[name=refUrl" + unitId + ']').val())) {
                    // $("#refUrl" + unitId).focus();
                    alert("禁用源原网链接必须填写！");
                    return false;
                }
            }
        }
        if (tmpSource.indexOf('同花顺') == -1 &&
            tmpSource != '国承信金融研究中心' &&
            tmpSource != '猎金财经' &&
            tmpSource != '实时点评' &&
            tmpSource != '投资账本' &&
            tmpSource != 'L2试用资讯' &&
            tmpSource != '实时点评' &&
            tmpSource != '股市必修课' &&
            tmpSource != '夺宝' &&
            !($("[name=refUrl" + unitId + ']').val())
        ) {
            // $("#refUrl" + unitId).focus();
            alert('非同花顺原创请填写来源地址');
            return false;
        }
    }

    //检查正文是否为空
    var data = getUEditor(unitId).getContent().replace(/<(?!img)[^>]*[\/]*>/gi, "");
    if ('' == data) {
        alert("未填写正文");
        getUEditor(unitId).focus();
        return false;
    }

    //如果勾了“雷”，相关股票不能为空
    var codeCheckRes = true;
    $('input[name="classIds' + unitId + '[]"]').each(function() {
        if ($(this).attr('checked')) {
            if ('004021' != $(this).val()) {
                if ('' == $.trim($("[name=stockCodes" + unitId + ']').val()) && '' == $.trim($("[name=indexCodes" + unitId + ']').val())) {
                    codeCheckRes = false;
                }
                return false;
            }
        }
    });
    if (!codeCheckRes) {
        alert("未写相关股票或者股指");
        // $("#stockCodes" + unitId).focus();
        return false;
    }
    // 提示是否有无效的基金代码[不返回错误]
    var invalidFunds = [];
    $('[name=fundCodes' + unitId + '_name]').children('a').each(function() {
        var a = $(this);
        if (a.text() == 'undefined') {
            invalidFunds.push(a.attr('value'));
        }
    });
    if (invalidFunds.length > 0) {
        alert(invalidFunds.join(',') + '无效');
    }
    return true;
}

//核对重要的父对象
function checkWeightClass(unitId) {
    if (!validateWeightClass(unitId)) {
        return false;
    }
    return true;
}

//重要的父对象需要核对
function validateWeightClass(id) {
    var $classIds = $('[name="classIds' + id + '[]"]');
    // $ftClassId = $('[name="ftClassId' + id + '"]');
    var weightClass = Object.assign({}, store.state.pobjweight);
    var weightOne = (weightClass && weightClass[1]) ? weightClass[1] : [];
    var inArray = function(el, arr) {
        for (var len = arr.length - 1; len >= 0; len--) {
            if (arr[len] == el) return true;
        }
        return false;
    };
    // var tmpClass = $ftClassId[0].value.split("_")[0],
    //     tmpName = $('#ftClassLi' + id + ' span').html();
    // if (inArray(tmpClass, weightOne)) {
    //     var str = prompt("请核对父对象名称：" + tmpName, tmpName + '-否');
    //     return str == tmpName;
    // }
    for (var i = 0, len = $classIds.length; i < len; i++) {
        var tmpClass = $classIds[i].value.split("_")[0];
        if (inArray(tmpClass, weightOne)) {
            tmpName = $($classIds[i]).attr('classidname');
            var str = prompt("请核对父对象名称：" + tmpName, tmpName + '-否');
            return str == tmpName;
        }
    }
    return true;
}