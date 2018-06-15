export default {
    newsInfo: state => state.disInfo,
    newsCount: state => state.count,
    discontent: state => state.disContent,
    fromResult: state => state.fromresult,
    parentobjinfo: state => Object.assign({}, state.pobjinfo),
    parentobjall: state => state.pobjall.slice(0),
    keyboarddata: state => state.keyboard,
    ifsourceurl: state => state.ifsourceurl,
    keyboarddataarr: state => {
        let arr = [];
        state.keyboard.forEach((v, i) => {
            v.forEach((m, n) => {
                m.key = state.keyboardkey[i];
            });

            arr = arr.concat(v);
        });

        return arr;
    },
    fielddata: state => state.fieldmodule,
    conceptdata: state => state.conceptmodule,
    newsId: state => state.disInfo[0] ? state.disInfo[0].id : '',
    deleteReason: state => state.deleteReason
}