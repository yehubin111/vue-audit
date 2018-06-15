// import dt from '../data/data'
import axios from 'axios'
import URL from '../data/urls.js'

let flag = false;
let processCancel;
// let CancelToken = axios.CancelToken;

export default {
    // all
    getNewsInfo({ state, commit, dispatch }) {
        let url = URL.newsinfo.replace('{sort}', state.newssort);
        axios.get(url)
            .then((res) => {
                commit('INFOS', res.data);

                // 特殊情况 初始化无文章（数据全部为无id情况）
                if (res.data.data.length == 0) {
                    alert('你不是审核人员或者新闻已分发完');
                    return
                };
                if (state.info.length < 1) {
                    dispatch('getNewsInfo');
                    return;
                }

                if (flag) {
                    return false;
                } else {
                    flag = true;
                    // 行业，概念，选股标签，关联方
                    commit('OTHERTAGS');
                    // 提取部分用于检测的数据
                    commit('INITCHECKWORDS');
                    // // 初始化自动排版, 调用全局方法
                    // if (typeof composition != 'undefined') {
                    //     composition();
                    // }
                    if (state.relstock.length == 0) {
                        // A股词典
                        dispatch('getRelStock');
                    } else {
                        // 标签列表
                        dispatch('getTagName');
                    }
                    // 重复检测
                    dispatch('getSameNews');

                    if (state.stopmedia.length == 0) {
                        // 禁用源列表
                        dispatch('getStopMedia');
                    } else {
                        commit('JUDGESTOPMEDIA');
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },
    getRelStock({ state, commit, dispatch }) {
        let url = URL.dictionary.replace('{index}', '43');

        axios.get(url)
            .then(res => {
                let r = res.data;
                commit('RELSTOCK', r);

                // 标签列表
                dispatch('getTagName');
            })
            .catch(err => {
                console.log(err);
            });
    },
    toDownLine({ state, commit }) {
        let params = new URLSearchParams();
        params.append('newsIds', '[' + state.newsIds.join(',') + ']')

        flag = false;
        commit('DESINFO');

        axios.post(URL.downline, params)
            .then(res => {
                if (res.data.err.code == 0) {

                }
            })
            .catch(err => {
                console.log(err);
            });
    },
    getStopMedia({ state, commit }) {
        axios.get(URL.stopmedia)
            .then((res) => {
                commit('STOPMEDIA', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    changeSort({ state, commit }, st) {
        commit('SORT', st);
    },
    // top
    getNewsCount({ state, commit }) {
        axios.get(URL.newscount)
            .then((res) => {
                commit('COUNT', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    // samenews
    getSameNews({ state, commit }) {
        let news = state.disInfo[0];
        let url = URL.repeatcheck.replace('{title}', news.title).replace('{newsid}', news.id);
        axios.get(url)
            .then(res => {
                commit('SAMENEWS', res.data);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // from
    getFromSearch({ state, commit }, { kwd }) {
        let url = URL.fromdata.replace('{keyword}', kwd);
        axios.get(url)
            .then((res) => {
                commit('FROM', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    // object
    getParentObj({ state, commit }) {
        axios.get(URL.parentobj)
            .then((res) => {
                commit('OBJ', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    // keyboard
    getKeyboardData({ state, commit }, { kwd, self }) {
        let url = URL.modulesearch.replace('{keyword}', kwd);
        // 取消上一次请求
        if (processCancel)
            processCancel.abort()
            // console.log(typeof cancel);
            // if (typeof cancel == 'function')
            //     cancel();

        processCancel = $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'jsonp',
            jsonp: false,
            cache: true,
            success: function(data) {
                commit('KEYBOARD', data);
            },
            error: function(xml, st) {
                console.log(url);
                console.log(st);
            }
        });

        // self.$jsonp(url, {
        //         callbackName: 'jsonp'
        //             // cancelToken: new CancelToken(function executor(c) {
        //             //     cancel = c;
        //             // })
        //     })
        //     .then(res => {
        //         commit('KEYBOARD', res);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    },
    getKeyboardName({ state, commit }, { key, code }) {
        let url = URL.tagname.replace('{type}', key).replace('{code}', code);
        axios.get(url)
            .then(res => {
                let r = res.data;
                let name = r.data[0][0];
                let color = r.data[0][1] ? true : false;

                commit('SETLABEL', { key, code, name, color });
                // commit('TAGNAME', { key, r, codearr });
            })
            .catch(res => {
                console.log(res);
            })
    },
    // fieldconcept
    getFieldConcept({ state, commit }) {
        if (state.fieldmodule.length > 0)
            return;

        axios.get(URL.fieldconcept)
            .then(res => {
                commit('FIELD', res.data);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getTagName({ state, commit }) {
        let news = state.disInfo[0];
        let acodes = []; // a股
        let bdcodes = []; // 债券
        // 特殊数据结构 a股 债券
        if (news.stockCodes) {
            news.stockCodes.forEach((v, i) => {
                acodes.push(v.code);
            });
        }
        if (news.bondCodes) {
            news.bondCodes.forEach((v, i) => {
                bdcodes.push(v.split('.')[0]);
            });
        }
        let codearr = {
            'a': acodes,
            'hk': news.hkCodes ? news.hkCodes.slice(0) : '',
            'us': news.usCodes ? news.usCodes.slice(0) : '',
            'xsb': news.xsbCodes ? news.xsbCodes.slice(0) : '',
            'bond': bdcodes,
            'fund': news.fundCodes ? news.fundCodes.slice(0) : ''
        };

        // 置空
        state.a = [];
        state.hk = [];
        state.us = [];
        state.xsb = [];
        state.bond = [];
        state.fund = [];

        // console.log(codearr);
        for (let i in codearr) {
            if (codearr && codearr[i].length > 0) {
                let url = URL.tagname.replace('{type}', i).replace('{code}', codearr[i].join('|'));
                axios.get(url)
                    .then(res => {
                        let r = res.data;
                        let key = i;
                        commit('TAGNAME', { key, r, codearr });
                    })
                    .catch(res => {
                        console.log(res);
                    })
            }
        }
    },
    setNext({ state, commit, dispatch }) {
        commit('NEXTNEWS');
        // 禁用源
        commit('JUDGESTOPMEDIA');
        // 行业，概念，选股标签，关联方
        commit('OTHERTAGS');
        // 提取部分用于检测的数据
        commit('INITCHECKWORDS');
        // 标签列表 
        dispatch('getTagName');
        // 重复检测
        dispatch('getSameNews');
    },
    newsSubmit({ state, commit, dispatch }, { postdata }) {
        // 加载
        commit('LOADING', 1);

        axios.post(URL.newssubmit, postdata)
            .then(res => {
                console.log('submit success!!!');
                console.log(res);

                // 加载结束
                commit('LOADING', 0);

                commit('NEXTNEWS');
                // 禁用源
                commit('JUDGESTOPMEDIA');
                // 行业，概念，选股标签，关联方
                commit('OTHERTAGS');
                // 提取部分用于检测的数据
                commit('INITCHECKWORDS');
                // // 初始化自动排版, 调用全局方法
                // composition();
                // 标签列表 
                dispatch('getTagName');
                // 重复检测
                dispatch('getSameNews');
                // 只剩两篇的时候再请求下一个10篇
                if (state.info.length < 3)
                    dispatch('getNewsInfo');
            })
            .catch(err => {
                console.log(err);
            })
    },
    // editor
    // 添加删除原因、删除词、违禁词、复审词、广告词
    delReason({ state, commit }) {
        let url = URL.dictionary.replace('{index}', '10|23725');
        axios.get(url).then(res => {
            commit('ADDDELWORD', res.data.data[10].data)
            commit('ADDDELREASON', res.data.data[23725].data)
        })
    },
    checkWord({ state, commit }, wordObj) {
        commit('ADDINFOWORD', wordObj.infoWord)
        commit('ADDREFUSEWORD', wordObj.refuseWord)
        commit('ADDADWORD', wordObj.adWord)
    },
    // 更新文章内容
    updateContent({ state, commit }, newCont) {
        commit('UPDATECONT', newCont);
    },
    // 更新文章标题
    updateTitle({ state, commit }, newTitle) {
        commit('UPDATETITLE', newTitle);
    },
    // 识别A股
    tagTip({ state, commit, dispatch }, unitId) {
        var content = UE.getEditor('DataUeditor').getContentTxt();
        $.ajax({
            url: '/entry/distriAudit/get/',
            type: 'POST',
            data: {
                'opt': 'search',
                'text': content
            },
            dataType: 'json',
            success: function(res) {
                if (res.data) {
                    let codeArr = [];
                    let key = 'a'
                    res.data.forEach(item => {
                        codeArr.push(item.code);
                    });
                    let aCode = codeArr.join('|');
                    dispatch('codeName', { inputCode: aCode, codeType: key }).then(codeArr => {
                        codeArr.forEach(item => {
                            if (item.name !== 'UnKnown') {
                                if (item.red) {
                                    let name = item.name;
                                    let code = item.code;
                                    let red = item.red;
                                    commit('ADDSHARE', { key, name, code, red });
                                } else {
                                    let name = item.name;
                                    let code = item.code;
                                    commit('ADDSHARE', { key, name, code });
                                }
                            }
                        })
                    });
                } else {
                    alert('没有A股关键词');
                    return false;
                }
            }
        })
    },
    // 识别港美股
    codeRecognition({ state, commit, dispatch }, unitId) {
        var content = UE.getEditor('DataUeditor').getContentTxt();
        var title = state.disInfo[0].title;
        var postData = {
            'title': title,
            'content': content,
            'newsid': unitId,
            'method': 'collect/CodeRecognition/all',
            'usCode': 1,
            'stockCode': 1,
            'hkCode': 1
        };
        $.ajax({
            url: '/input/ajax/post/',
            type: 'POST',
            data: postData,
            dataType: 'json',
            success: function(res) {
                console.log(res)
                if (res.status == 0) {
                    if (res.data.usCodes) {
                        let usCode = res.data.usCodes;
                        let key = 'us';
                        console.log('-----------' + res.data.usCodes + '-----------')
                        dispatch('codeName', { inputCode: usCode, codeType: key }).then(codeArr => {
                            codeArr.forEach(item => {
                                if (item.name !== 'UnKnown') {
                                    if (item.red) {
                                        let name = item.name;
                                        let code = item.code;
                                        let red = item.red;
                                        commit('ADDSHARE', { key, name, code, red });
                                    } else {
                                        let name = item.name;
                                        let code = item.code;
                                        commit('ADDSHARE', { key, name, code });
                                    }
                                }
                            })
                        });
                    }
                    if (res.data.hkCodes) {
                        let hkCodes = res.data.hkCodes;
                        let key = 'hk';
                        dispatch('codeName', { inputCode: hkCodes, codeType: key }).then(codeArr => {
                            codeArr.forEach(item => {
                                if (item.name !== 'UnKnown') {
                                    if (item.red) {
                                        let name = item.name;
                                        let code = item.code;
                                        let red = item.red;
                                        commit('ADDSHARE', { key, name, code, red });
                                    } else {
                                        let name = item.name;
                                        let code = item.code;
                                        commit('ADDSHARE', { key, name, code });
                                    }
                                }
                            })
                        });
                    }
                } else {
                    alert('港美股识别失败');
                    return false;
                }
            },
            error: function() {
                return false;
            }
        })
    },
    //港股、美股、基金
    codeName({ state, commit }, codeData) {
        return new Promise((resolve, reject) => {
            var inputCodeAry = codeData.inputCode.split("|");
            var nameArray = [];
            axios.get('/entry/distriAudit/get/?opt=getCodeName&codeType=' + codeData.codeType + '&codes=' + codeData.inputCode).then(res => {
                if (res.data.err.code == 0) {
                    for (var i = 0; i < inputCodeAry.length; i++) {
                        if ('red' == res.data.data[i][1]) {
                            nameArray.push({ name: res.data.data[i][0], code: inputCodeAry[i], red: true })
                        } else {
                            nameArray.push({ name: res.data.data[i][0], code: inputCodeAry[i] })
                        }
                    }
                    resolve(nameArray)
                }
            })
        })
    },
    setNewsImg({ state, commit }, picObj) {
        commit('SETNEWSIMAGE', picObj)
    }


    // getNewsInfo({ state, commit }) {
    //     let r = dt.dtt;
    //     commit('INFOS', r);
    // },
    // toDownLine({ state, commit }) {
    //     commit('DESINFO');
    // },
    // changeSort({ state, commit }, st) {
    //     commit('SORT', st);
    // },
    // // top
    // getNewsCount({ state, commit }) {
    //     let r = dt.ct;
    //     commit('COUNT', r);
    // },
    // // from
    // getFromSearch({ state, commit }, { kwd }) {
    //     let r = dt.fm;
    //     commit('FROM', r);
    // },
    // // object
    // getParentObj({ state, commit }) {
    //     let r = dt.obj;
    //     commit('OBJ', r);
    // },
    // // keyboard
    // getKeyboardData({ state, commit }, { kwd }) {
    //     let r = dt.kbd;
    //     commit('KEYBOARD', r);
    // },
    // // fieldconcept
    // getFieldConcept({ state, commit }) {
    //     let r = dt.fc;
    //     commit('FIELD', r);
    // }
}