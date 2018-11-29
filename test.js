const got = require('got');
 
(async () => {
    try {
        let res = await got("http://i.tianqi.com/index.php?c=code&id=5");
        let doc = res.body;
        let pure = doc.slice(doc.indexOf("<strong>"),doc.indexOf("详细"));
        console.log(pure.replace(" ",""));
    } catch (error) {
        console.log(error);
    }
})();