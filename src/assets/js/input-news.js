import store from '../../vuex/index'

let word, nextword, pOne, tfb;
let wordObj = {};

// 获取iframe
export function getIframe(unitId) {
    return $('#DataUeditor').find('iframe').contents()
}
// 获取编辑器
export function getUEditor(unitId) {
    if (!unitId) {
        unitId = '';
    }
    var UEditorVarName = 'DataUeditor';
    return UE.getEditor(UEditorVarName)
}
// 重新获取编辑器
export function destroyUE(unitId) {
    if (!unitId) {
        unitId = '';
    }
    getUEditor(unitId).destroy();
}
// 重新获取编辑器
export function renderUE(unitId) {
    if (!unitId) {
        unitId = '';
    }
    getUEditor(unitId).render('DataUeditor')
}

// 编辑器插入html
export function add_content(val, unitId) {
    if (!unitId) {
        var unitId = '';
    }
    var oEditor = getUEditor(unitId);
    oEditor.execCommand('inserthtml', val);
}

//设置编辑器的内容
export function set_content(val, unitId) {
    if (!unitId) {
        var unitId = '';
    }
    getUEditor(unitId).setContent(val);
}

//get editor content
export function get_content(unitId, noHtml, plainTxt) {
    var data = '';
    if (!unitId) {
        var unitId = '';
    }
    if (!noHtml) {
        var noHtml = false;
    }
    if (!plainTxt) {
        var plainTxt = false;
    }
    var UEditorId = 'DataUeditor';
    var oEditor = getUEditor(unitId);
    if (noHtml) {
        data = oEditor.getContentTxt();
    } else if (plainTxt) {
        data = oEditor.getPlainTxt();
    } else {
        data = oEditor.getContent();
    }
    return data;
}

// append html
export function append_content(val, unitId) {
    if (!unitId) {
        var unitId = '';
    }
    var oEditor = getUEditor(unitId);
    oEditor.setContent(oEditor.getContent() + val);
}

//识别代码 A股识别
export function tagTip(unitId, dis) {
    if (!unitId) {
        var unitId = '';
    }
    var UEditorId = 'DataUeditor';
    var span = getUEditor(unitId).getContent();
    getUEditor(unitId).setContent(span.str_replace(stockName, stock, dis));
    $('#' + dis).trigger('change');
}

// 预格式化新闻
export function PB2(unitId, type) {
    if (!unitId) {
        var unitId = '';
    }
    if (typeof tfb == 'undefined') {
        $.ajax({
            url: '/entry/distriAudit/get/?opt=dictionary&index=18179|18481|21081&sort=1',
            type: 'GET',
            dataType: 'json',
            success: function(json) {
                wordObj.infoWord = json.data[18179].data;
                wordObj.refuseWord = json.data[18481].data;
                wordObj.adWord = json.data[21081].data;
                store.dispatch('checkWord', wordObj)
                    // 预先格式化类
                tfb = new Paraformat(wordObj);
                PBdetail(unitId, type)
            }
        })
    } else {
        PBdetail(unitId, type)
    }
}

function PBdetail(unitId, type) {
    if (typeof tfb != 'undefined') {
        tfb.init(unitId);
        //7X24小时滚动快讯不处理
        if ($('#ftClassLi' + unitId + ' > input').val() != '001104') {
            tfb.format();
        } else {
            $('#summ' + unitId).text(tfb.getOriValue().replace(/<\/?.+?>/g, ""));
        }
        var content = tfb.getOriValue();
        //处理图片
        content = content.replace(/<p[^>]*>[\s|　]*(<img[^>]*>\s*(?:<br[^>][\/|]|&nbsp;>)*(?:\s|&nbsp;|　)*)/g, '<p style="text-align:center" class="img-pWrapper">$1<\/p><p>　　');
        content = content.replace(/(<p[^>]*>[\s|　]*[^\s|　]+)(<img[^>]*>\s*(?:<br[^>][\/|]>)*(?:\s|&nbsp;|　)*)/g, '$1<\/p><p style="text-align:center" class="img-pWrapper">$2<\/p><p>　　');
        content = content.replace(/<p[^>]*>[\s|　|]*(?:<br\s*[\/|]*>)*(?:\&nbsp;)*(?:<br\s*[\/|]*>)*[\s|　|]*<\/p>/gi, '');
        set_content(content, unitId);
        //加粗段落小标题
        PBT(unitId);
        //直观显示图片简要;
        //setTimeout('createImgInfo('+unitId+')',5000);//设置延时5S开始调用抓取的封面图
        if (type == 'pb') {
            setTimeout(() => {
                createImgInfo(unitId)
            }, 5000);
        }
    }
}

/**
 * 对每一个段落做处理
 * 主要处理加粗
 */
function PBT(unitId) {
    if (!unitId) {
        var unitId = '';
    }
    var sourceStr, centerStr = '',
        centerTemp, autoReg1, autoReg2, autoReg3, vl;
    sourceStr = get_content(unitId).split('</p>');
    autoReg1 = /(作者|记者|证券|期货|讯|文\/)+/i;
    autoReg2 = /[？”’：?":](\n|\r|<br(?:.*?)>)*\s*$/i;
    autoReg3 = /[,.!:;?\(\)""<>\[\]，。？！……——：；（）“”《》【】-]\s*$/i;
    var reg = new RegExp("<p[^>]*>");
    for (var i = 0; i < sourceStr.length; i++) {
        //del the /s ,<p> and  &nbsp; in the string
        centerTemp = sourceStr[i].replace(/^\s+|<p>\s+|<\/strong>*|<strong>*|(&nbsp;)+$/g, '');
        if (reg.test(centerTemp)) {
            centerTemp = centerTemp + '</p>';
            centerStr += centerTemp;
            continue;
        }
        vl = centerTemp.replace(/(?:<(.[^>]*)>)/g, "").length; //非捕获性分组,去掉所有段落中的 <> 这里面的东西
        //将超过35个字（不是字符）的不要加粗
        if (vl <= 35) {
            //is autoReg3
            if (vl >= 25 && !autoReg3.test(centerTemp)) {
                centerTemp = '<strong>' + centerTemp + '</strong>';
            }
            // in 25 and end with autoReg
            if (vl < 25 && (autoReg2.test(centerTemp) || !autoReg3.test(centerTemp))) {
                // at start 3 and end 3
                //首末各三行，如果字数在20字内，含"作者"、"记者"、"证券""期货""文/""基金"。
                if (i < 3 || i > sourceStr.length - 5) {
                    //in 15 and there are autoReg1 in the string
                    if (!(vl < 25 && autoReg1.test(centerTemp))) {
                        centerTemp = '<strong>' + centerTemp + '</strong>';
                    }
                } else {
                    centerTemp = '<strong>' + centerTemp + '</strong>';
                }
            }
        }
        if (vl != 0) {
            centerTemp = '<p>　　' + centerTemp + '</p>';
        }
        centerStr += centerTemp;
    }
    set_content(centerStr, unitId);
}

/**
 * 对全角半角处理
 * 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248
 * 半角标点有：（.!:;()""？''）
 * 对应全角：（。！：；（）""？''）
 */
export function ToDBC(txtstring) {
    txtstring = txtstring.replace(/"(.*?)"/gi, '“$1”');
    txtstring = txtstring.replace(/'(.*?)'/gi, '‘$1’');
    txtstring = txtstring.replace(/’(.*?)’/gi, '‘$1’');
    var tmp = "";
    for (var i = 0; i < txtstring.length; i++) {
        var now = txtstring.charCodeAt(i);
        var last = txtstring.charCodeAt(i - 1);
        var next = txtstring.charCodeAt(i + 1);
        if (now == 12288) {
            //全角空格为12288，半角空格为32
            tmp = tmp + String.fromCharCode(32);
        } else if (now == 44 || now == 65292) {
            //当前一个为数字或英文，后一个为数字或英文，那么这个 逗号：（，,） 不进行转换
            if (((last >= 48 && last <= 57) || (last >= 65 && last <= 90) || (last > 90 && last < 122)) && ((next >= 48 && next <= 57) || (next >= 65 && next <= 90) || (next > 90 && next < 122))) {
                tmp = tmp + txtstring.charAt(i);
            } else {
                //将逗号全部用半角空格代替
                tmp = tmp + String.fromCharCode(32);
            }
        } else if (now == 63 || now == 33 || now == 58 || now == 46 || now == 59) {
            //冒号，引号，问号，感叹号都使用全角。
            if (((last >= 48 && last <= 57) || (last >= 65 && last <= 90) || (last > 90 && last < 122)) && ((next >= 48 && next <= 57) || (next >= 65 && next <= 90) || (next > 90 && next < 122))) {
                tmp = tmp + txtstring.charAt(i);
            } else {
                if (now == 46) {
                    //.转换为句号
                    tmp = tmp + String.fromCharCode(12290);
                } else {
                    //半角转全角要加上65248
                    tmp = tmp + String.fromCharCode(now + 65248);
                }
            }
        } else if ((now >= 65296 && now <= 65305) || (now >= 65313 && now <= 65338) || (now >= 65345 && now <= 65370)) {
            //全角的数字，英文转换为半角
            tmp = tmp + String.fromCharCode(now - 65248);
        } else {
            //其他的都不变
            tmp = tmp + txtstring.charAt(i);
        }
    }
    return tmp;
}

//上传图片到ueditor编辑器中
export function uploadFile(unitId) {
    if (!unitId) {
        unitId = '';
    }
    var url = document.getElementById('upfile' + unitId).alt;
    // var value = $(this).attr("uploadValue");
    // 始终是直接上传
    var value = 1;
    // 默认只能上传图片
    var state = 'on';
    // var state = $("#thumb"+unitId).attr('checked');
    // state = state ? "on" : "";
    //下面一段为上传文件非空和文件类型判断，各应用可根据自身需求来实现 var upfile = $("#upfile").attr("value");
    var upfile = $("#upfile" + unitId).val();
    if (upfile.length == 0) {
        alert('在上传之前，必须先选择本地文件！');
        return false;
    }
    var ary = upfile.split('.');
    var filetype = ary[ary.length - 1];
    filetype = filetype.toLowerCase();
    var allowType = 'jpg|jpeg|gif|png|zip|rar|doc|pdf|xls|ppt|txt|wps|et|dps|docx|xlsx|pptx';
    if (allowType.indexOf(filetype) == -1) {
        alert('上传文件的类型[' + filetype + ']非法');
        return false;
    }
    var allows = 'jpg|jpeg|gif|png';
    if (state == 'on') {
        if (allows.indexOf(filetype) == -1) {
            alert('非图片类型不能进行相关图片操作');
            return false;
        }
    }
    //文件上传插件
    $.ajaxFileUpload({
        url: url, //处理上传文件的服务端
        secureuri: false,
        fileElementId: 'upfile' + unitId,
        dataType: 'json',
        data: {
            'waterMark': value,
            'thumbCk': state,
            'fileName': 'upfile' + unitId
        },
        async: false,
        success: function(returnResult) {
            var result = returnResult.result;
            var url = result.url;
            if (url) {
                var pic_ext = new Array('.gif', '.jpg', '.jpeg', '.png');
                var pic_flag = 0;
                for (var i = 0; i < pic_ext.length; i++) {
                    var ext = url.substring(url.length - pic_ext[i].length);
                    if (ext == pic_ext[i]) {
                        pic_flag = 1;
                        break;
                    }
                }

                var insert_val = '';
                if (pic_flag) {
                    insert_val = '<img src="' + url + '" border="0"/><br />';
                } else {
                    insert_val = '<a href="' + url + '" target="_blank">点击下载附件</a>';
                }

                add_content(insert_val, unitId);
                $("#upfile" + unitId).val('');
            } else {
                alert(result.tip);
            }
        },
        error: function(data, sataus, e) {
            alert(e);
        }
    });
}

/**============== 预先格式化类 ======================**/
function Paraformat(wordObj) {
    var t = this;
    t.version = "1.0";
    t.isModify = true;
    t.isPara = false;
    t.foundRefusewords = "发现禁用词，禁用词:";
    t.parSimp = { '\n': 1, '\t': 1, '\r': 1, '　': 2 }; //段落结束检查
    t.paragraph = {
        conLen: 0,
        parNum: 0,
        parIndex: 0,
        par: [],
        staut: false
    }; //段落信息
    t.testOk = /<p>\s\s/gi; //排版完成标准
    t.fiterTags = /<br\s*\/*>|<script.*?>(.*?)<\/script>|<strong[^>]*>\s*|<\/strong>|<div[^>]*>|<\/div>|<span[^>]*>|<\/span>|<h1>|<\/h1>|<sup>|<\/sup>|<pre>|<\/pre>/gi; //未完成标准
    t.mapWords = {
        "ａ": "a",
        "ｂ": "b",
        "ｃ": "c",
        "ｄ": "d",
        "ｅ": "e",
        "ｆ": "f",
        "ｇ": "g",
        "ｈ": "h",
        "ｉ": "i",
        "ｊ": "j",
        "ｋ": "k",
        "ｌ": "l",
        "ｍ": "m",
        "ｎ": "n",
        "ｏ": "o",
        "ｐ": "p",
        "ｑ": "q",
        "ｒ": "r",
        "ｓ": "s",
        "ｔ": "t",
        "ｕ": "u",
        "ｖ": "v",
        "ｗ": "w",
        "ｘ": "x",
        "ｙ": "y",
        "ｚ": "z",
        "Ａ": "A",
        "Ｂ": "B",
        "Ｃ": "C",
        "Ｄ": "D",
        "Ｅ": "E",
        "Ｆ": "F",
        "Ｇ": "G",
        "Ｈ": "H",
        "Ｉ": "I",
        "Ｊ": "J",
        "Ｋ": "K",
        "Ｌ": "L",
        "Ｍ": "M",
        "Ｎ": "N",
        "Ｏ": "O",
        "Ｐ": "P",
        "Ｑ": "Q",
        "Ｒ": "R",
        "Ｓ": "S",
        "Ｔ": "T",
        "Ｕ": "U",
        "Ｖ": "V",
        "Ｗ": "W",
        "Ｘ": "X",
        "Ｙ": "Y",
        "Ｚ": "Z",
        "．": ".",
        "·": ".",
        '）': ')',
        '（': '(',
        '「': '“',
        '」': '”',
        '－': '-',
        '％': '%',
        '０': '0',
        '１': '1',
        '２': '2',
        '３': '3',
        '４': '4',
        '５': '5',
        '６': '6',
        '７': '7',
        '８': '8',
        '９': '9'
    };
    t.refuseCheckWord = eval('/(' + wordObj.refuseWord.join("|") + ')/gi');
    t.infoCheckWord = eval('/(' + wordObj.infoWord.join("|") + ')/gi');
    t.adCheckWord = eval('/(' + wordObj.adWord.join("|") + ')/gi');
};

Paraformat.prototype = {
    //获得原始数据
    getOriValue: function() {
        return getUEditor(this.unitId).getContent();
    },

    format: function() {
        var t = this;
        if (!t.hasModify() || t.hasParaOk()) {
            return;
        }
        t.cleanPara();
        var oriValue = t.getOriValue();
        oriValue = oriValue.replace(/<div[^>]*>\s*/gi, "<p>");
        oriValue = oriValue.replace(/<\/div[^>]*>\s*/gi, "<\/p>");
        oriValue = oriValue.replace(/<p[^>]*>\s*/gi, "　　");
        oriValue = oriValue.replace(/<\/p>/gi, "");
        oriValue = oriValue.replace(/\s+"/gi, '"');

        var content;
        //todo::这里需要优化
        for (var i = 0; i < oriValue.length; i++) {
            word = t.mapWords[oriValue.charAt(i)] ? t.mapWords[oriValue.charAt(i)] : oriValue.charAt(i);
            nextword = (i + 1 < oriValue.length) ?
                (t.mapWords[oriValue.charAt(i + 1)] ? t.mapWords[oriValue.charAt(i + 1)] : oriValue.charAt(i + 1)) : undefined;
            if (!t.paragraph["parIndex"] && t.parSimp[word]) { //标志符号、当前位置为0：段落开始
                continue;

            } else if (!t.paragraph["parIndex"] && !t.parSimp[word]) { //非标志符号、当前位置为0：段落开始
                content = "\<p\>　　" + word;
                t.paragraph["parIndex"]++;
            } else if (t.paragraph["parIndex"] && !t.parSimp[word]) { //非标志符号、当前位置非0:段落内容
                content += word;
                t.paragraph["parIndex"]++;

            } else if (t.paragraph["parIndex"] && t.parSimp[word]) { //标志符号、当前位置非0:可能为段落结束
                if (t.parSimp[word] == 1) { //结束
                    content += "</p>";
                    t.paragraph.par.push(content);
                    t.paragraph["conLen"] += content.length;
                    content = undefined;
                    t.paragraph["parIndex"] = 0;
                    t.paragraph["parNum"]++;
                    i++;
                } else { //可能为结束，判断下个字符
                    if (nextword && t.parSimp[nextword]) { //结束
                        content += "</p>";
                        t.paragraph.par.push(content);
                        t.paragraph["conLen"] += content.length;
                        content = undefined;
                        t.paragraph["parIndex"] = 0;
                        t.paragraph["parNum"]++;
                        i++;

                        //console.log(paragraph.parNum);
                    } else { //忽略空格
                        content += word;
                        t.paragraph["parIndex"]++;
                    }
                }
            }
        }
        if (content) {
            content += "</p>";
            t.paragraph.par.push(content);
            t.paragraph["conLen"] += content.length;
            content = undefined;
            t.paragraph["parIndex"] = 0;
            t.paragraph["parNum"]++;
        }
        //统一进行处理
        for (pOne in t.paragraph["par"]) {
            //剔除<br>
            t.paragraph["par"][pOne] = t.preDoFiterTags(t.paragraph["par"][pOne]);
            //剔除敏感词
            t.paragraph["par"][pOne] = t.doRefuseWords(t.paragraph["par"][pOne]);
        }
        t.setValue(t.paragraph["par"].join(""));
        t.setModify(false);
    },

    init: function(unitId) {
        if (!unitId) {
            unitId = '';
        }
        var t = this;
        t.unitId = unitId;
        //段落信息
        t.paragraph = {
            conLen: 0,
            parNum: 0,
            parIndex: 0,
            par: [],
            staut: false
        };
    },

    //出去多余标签
    cleanPara: function() {
        var t = this;
        t.paragraph = { conLen: 0, parNum: 0, parIndex: 0, par: [], staut: false }; //段落信　息
        var temp = t.getOriValue();
        temp = temp.replace(/<br\s*\/>\s*<br\s*\/>\s*/gi, "　　");
        temp = temp.replace(/<p>[\s|　|]*(?:<br\s*[\/|]*>)*(?:\&nbsp;)*(?:<br\s*[\/|]*>)*[\s|　|]*<\/p>/gi, '');
        temp = temp.replace(/<p>/gi, "　　");
        temp = temp.replace(/<\/p>/gi, "");
        temp = temp.replace(/\?{2,4}/gi, "");
        temp = temp.replace(/<p\s.*?>/gi, "<p>");
        temp = temp.replace(/<\/*br\s*\/*>/gi, '  ');
        temp = temp.replace(/&nbsp;/gi, "　");
        temp = temp.replace(/ +/gi, " ");
        t.setValue(temp);
    },

    setModify: function(val) {
        this.isModify = val;
        this.isPara = !val;
    },

    hasModify: function() { //检查是否修改
        var t = this;
        t.isModify = (t.getOriValue().length != t.paragraph["conLen"]);
        return t.isModify;
    },

    hasParaOk: function() { //检查是否分段完成
        var t = this;

        if (t.hasModify())
            return false;
        for (var index = 0; index < t.paragraph["parNum"]; index++) {
            if (!t.paragraph["par"][index].match(t.testOk)) {
                return false;
            }
        }
        return true;
    },

    fiterTagsPlugins: function(c) {
        c = c.replace(/<a.*?>[^<>]*<\/a>/gi, function(aTag) {
            if (aTag.indexOf('http://www.iwencai.com') == -1) {
                return aTag.replace(/<a.*?>|<\/a>/gi, '');
            } else {
                return aTag;
            }
        });
        return c;
    },

    preDoFiterTags: function(c) {
        c = this.fiterTagsPlugins(c);
        return c.replace(this.fiterTags, "");
    },

    doRefuseWords: function(c) {
        c = c.replace(this.infoCheckWord, "<span style='color:#FF00FF' class='tipWord info'>$1</span>");
        c = c.replace(this.refuseCheckWord, "<span style='color:#FF00FF' class='tipWord refuse'>$1</span>");
        c = c.replace(this.adCheckWord, "<span style='color:#FF00FF' class='tipWord ad'>$1</span>");
        return c.replace(/(<[^<>]*?)<[^<>]*?>([^<>]*?)<[^<>]*?>([^<>]*?>)/g, '$1$2$3');
    },

    //设置编辑器内容
    setValue: function(val) {
        return getUEditor(this.unitId).setContent(val);
    }

}

// 检查是否有refuseCheckWord 关键词在里面
function word_refuse_check(unitId) {
    var text = clean_font_color(get_content(unitId));
    var word = refuseCheckWord;
    var flag = true;
    wordLength = word.length;
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

String.prototype.str_replace = function(A, K, D) {
    var re = new RegExp("(" + A.join(")|(") + ")", "g");
    var arrls = {};
    var stockls = "";
    return this.replace(re, function($0) {
        if (!arrls[K[arguments[0]]]) {
            arrls[K[arguments[0]]] = true;
            if ($.inArray(K[arguments[0]], relStockcode) == -1) //if(arguments[0] != "同花顺" )
                stockls += K[arguments[0]] + "|";

            else if (confirm("是否需要添加" + arguments[0] + "到关联代码？")) {
                stockls += K[arguments[0]] + "|";
            } else {
                fliterStock.push(K[arguments[0]]);
            }
        }
        // TODO::将股票放到相应的input里
        $('input[name="' + D + '"]')[0].value = stockls.substr(0, stockls.length - 1);
        return arguments[0];
    });
}

/**
 * 编辑器的图片处理
 * 直观显示图片简要
 * @param unitId
 */
function createImgInfo(unitId) {
    if (!unitId) {
        var unitId = '';
    }
    //设置第一张宽度大于0的图为封面图
    var imgs = $('#DataUeditor').find('iframe').contents().find('img');
    var imgSrc = new Array();
    var x = 0;
    if (imgs.length >= 1) {
        for (var i = 0; i < imgs.length; i++) {
            if (imgSrc.length >= 3) {
                break;
            }
            // imgSrc[i+1] = imgs.eq(i).attr('src'); //没有图片 暂时不加限制条件
            if (imgs.eq(i).width() > 0) {
                imgSrc[x] = imgs.eq(i).attr('src');
                x++;
            }
        }
    }
    for (var j = 0; j < imgSrc.length; j++) {
        let imgObj = {
            num: j,
            url: imgSrc[j]
        }
        store.dispatch('setNewsImg', imgObj)
    }
    //图片简要
    var content = getUEditor(unitId).getContent();
    content = content.replace(/<input[^>]+value="[-]+图片摘要-#(.*?)#[-]+"[^>]+>/gi, '');
    content = content.replace(/(<img[^>]*alt="([^"]*)"[^>]*>)/gi, '$1<input disable="disable" readonly="readonly" style="color  :gray;text-align:center;border:1px;width:100%" value="----------图片摘要-#$2#----------" />');
    set_content(content, unitId);
}