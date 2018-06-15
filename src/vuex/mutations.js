export default {
    //all
    INFOS(state, r) {
        let res = r.data.filter(v => v.id != undefined && v.id != null);
        state.info = state.info.concat(res);

        res.forEach((v, i) => {
            state.newsIds.push(v.id);
        });

        // 获取当前文章信息
        state.disInfo = state.info.slice(0, 1);
        state.disNewsids = state.newsIds.slice(0, 1);
        state.disContent = state.disInfo[0] ? state.disInfo[0].content : '';

        // 初始化图片
        state.newsimages[0].img = '';
        state.newsimages[1].img = '';
        state.newsimages[2].img = '';

        // 初始化重复检测
        state.samenews = null;
        // 重置输入框内容
        state.searchmessage = '';
        state.objectmessage = '';

        state.sourceshow = 0;

        // 文章标题
        // state.ntitle = state.disInfo[0].title;

        // state.disInfo = state.info[0];
        // state.disNewsids = state.newsIds[0];
        // // 标签
        // state.relative = state.disInfo.relatedetail.slice(0);
        console.log(state);
    },
    RELSTOCK(state, r) {
        let dt = r.data['43'].data;
        dt.forEach((v, i) => {
            state.relstock.push(v.split('|')[0]);
        });
    },
    CHANGEDISINFO(state, {
        key,
        vl
    }) {
        state.disInfo[0][key] = vl;
    },
    CHANGESTATE(state, {
        key,
        vl
    }) {
        state[key] = vl;
    },
    LINESTATUS(state, {
        vl
    }) {
        // 改变上线下线状态
        state.linestatus = vl;
    },
    DESINFO(state, r) {
        state.info = [];
        state.newsIds = [];
        state.disInfo = [];
        state.disNewsids = [];
    },
    STOPMEDIA(state, r) {
        for (let i in r.data) {
            state.stopmedia.push(r.data[i]);
        }
        let md = state.disInfo[0].source;
        state.ifsourceurl = state.stopmedia.indexOf(md.trim()) != -1 ? 0 : 1;
    },
    JUDGESTOPMEDIA(state, d) {
        let md = d ? d : state.disInfo[0].source;
        state.ifsourceurl = state.stopmedia.indexOf(md.trim()) != -1 ? 0 : 1;
    },
    CHANGESTOPMEDIA(state) {
        state.sourceshow = 1;
    },
    SORT(state, st) {
        state.newssort = st;
    },
    // top
    COUNT(state, r) {
        state.count = r;
    },
    SAMENEWS(state, r) {
        for (let i in r.data) {
            state.samenews = r.data[i];
        }
    },
    // from
    FROM(state, r) {
        state.fromresult = r.result;
    },
    // object
    OBJ(state, r) {
        state.pobjinfo = r.data.classInfo;
        state.pobjall = r.data.classAll;
        state.pobjweight = r.data.classWeight;
    },
    // keyboard
    KEYBOARD(state, r) {
        state.keyboard = r;
    },
    // fieldconcept
    OTHERTAGS(state) {
        // 标签
        let st = state.disInfo[0]['append'].stocktags ? state.disInfo[0]['append'].stocktags.split('|') : [];
        let ar = [];
        st.forEach((v, i) => {
            let obj = {
                name: v,
                code: 'stocktag' + parseInt(Math.random() * 100)
            };
            ar.push(obj);
        });
        state.stocktags = ar;
        state.relative = state.disInfo[0].relatedetail.slice(0);
        state.field = state.disInfo[0].fieldCodes.slice(0);
        state.concept = state.disInfo[0].conceptCodes.slice(0);

    },
    TAGNAME(state, {
        key,
        r,
        codearr
    }) {
        // console.log(key);

        if (!Array.isArray(r.data)) return;

        r.data.forEach((v, i) => {
            let name = v[0] != 'UnKnown' ? v[0] : null;
            let code = codearr[key][i];
            let red = v[1] ? true : false;

            // a股特殊处理，需要查询a股词典
            if (key == 'a')
                red = state.relstock.indexOf(code) != -1 ? true : false;

            state[key].push({
                name,
                code,
                red
            });
        });
    },
    CHANGELABEL(state, {
        key,
        name,
        code
    }) {
        if (state[key].filter(v => v.code == code).length > 0) {
            state[key] = state[key].filter(v => v.code != code);
        } else {
            state[key] = state[key].filter(v => v.code != code);
            state[key].push({
                name,
                code
            });
        };
    },
    SETLABEL(state, {
        key,
        name,
        code,
        color
    }) {
        let red = color;
        // a股特殊处理，需要查询a股词典
        if (key == 'a')
            red = state.relstock.indexOf(code) != -1 ? true : false;

        state[key] = state[key].filter(v => v.code != code);
        state[key].push({
            name,
            code,
            red
        });
    },
    DELLABEL(state, {
        key,
        code
    }) {
        state[key] = state[key].filter(v => v.code != code);
    },
    CLEARLABEL(state, {
        key
    }) {
        state[key] = [];
    },
    FIELD(state, r) {
        let fieldarr = [],
            conceptarr = [];

        for (let i in r.data.field) {
            let obj = {};
            let v = r.data.field[i];

            // obj.stock = [];
            obj.code = v.code;
            obj.name = v.name;

            // for (let j in v.stock) {
            //     obj.stock.push(v.stock[j]);
            // }

            fieldarr.push(obj);
        }

        for (let i in r.data.conceptStock) {
            let obj = {};
            let v = r.data.conceptStock[i];

            // obj.stock = [];
            obj.code = i;
            obj.name = v;

            // for (let j in v.stock) {
            //     obj.stock.push(v.stock[j]);
            // }

            conceptarr.push(obj);
        }

        state.fieldmodule = fieldarr.slice(0);
        state.conceptmodule = conceptarr.slice(0);
    },
    NEXTNEWS(state) {
        state.info.shift();
        state.newsIds.shift();

        state.disInfo = state.info.slice(0, 1);
        state.disNewsids = state.newsIds.slice(0, 1);
        state.disContent = state.disInfo[0] ? state.disInfo[0].content : '';
        // 初始化关闭来源页面框
        state.sourceshow = 0;
        // 初始化图片
        state.newsimages[0].img = '';
        state.newsimages[1].img = '';
        state.newsimages[2].img = '';
        // 初始化重复检测
        state.samenews = null;
        // 重置输入框内容
        state.searchmessage = '';
        state.objectmessage = '';

        console.log(state);
        // 文章标题
        // state.ntitle = state.disInfo[0].title;
    },
    LOADING(state, d) {
        state.loading = d;
    },
    INITCHECKWORDS(state) {
        let d = state.disInfo[0];
        state.checkwords['title'] = d.title;
        state.checkwords['content'] = d.content;
        state.checkwords['classIds'] = d.classIds.slice(0);
        // state.checkwords['source'] = d.source;
        // state.checkwords['author'] = d.author;
    },
    // submit check
    SETCHECKWORD(state, { key, vl }) {
        state.checkwords[key] = vl;
    },
    // image
    CHANGEIMAGE(state, {
        idx,
        img
    }) {
        let ig = img ? img : '';
        state.newsimages[idx].img = ig;
    },
    // editor
    // 更新文章内容
    UPDATECONT(state, newCont) {
        state.disInfo[0].content = newCont;
    },
    // 更新文章标题
    UPDATETITLE(state, newTitle) {
        state.disInfo[0].title = newTitle;
    },
    // 添加股票标签
    ADDSHARE(state, {
        key,
        name,
        code,
        red
    }) {
        state[key] = state[key].filter(v => v.code != code);
        if (!red) {
            state[key].push({
                name,
                code
            });
        } else {
            state[key].push({
                name,
                code,
                red
            });
        }
    },
    ADDDELREASON(state, info) {
        state.deleteReason = info;
    },
    ADDDELWORD(state, info) {
        state.deleteWord = info;
    },
    ADDINFOWORD(state, info) {
        state.infoWord = info;
    },
    ADDREFUSEWORD(state, info) {
        state.refuseWord = info;
    },
    ADDADWORD(state, info) {
        state.adWord = info;
    },
    SETNEWSIMAGE(state, picObj) {
        state.newsimages[picObj.num]['img'] = picObj.url
    },
    SETCONFIG(state, config) {
        state.editorConfig = config;
    }
}