// Changes XML to JSON


xmlToJson = function(xml) {

    var obj;

    // do children
    if (xml.hasChildNodes()) {

        if(xml.parentNode && (xml.parentNode.nodeType == 1 || xml.parentNode.nodeType == 3) ){
            if (obj == undefined){
                obj = {};
            }
            obj.parent = xml.parentNode;
        }
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;

            if (xml.parentNode != undefined && (xml.childNodes[i].nodeType == 1 || xml.childNodes[i].nodeType == 3)){
                //console.log("should add a child type : " + xml.childNodes[i].nodeType)
                if (obj == undefined){
                    obj = {};
                }
                if (obj.children == undefined)
                {
                    obj.children = [];
                }
                obj.children.push(xml.childNodes[i]);
            }
            if (!obj){
                obj = {};
            }
            if (typeof(obj["node"]) == "undefined") {

                if (xmlToJson(item) != undefined)
                {
                    obj['node'] = xmlToJson(item);
                }
            } else {
                if (typeof(obj["node"].push) == "undefined") {
                    var old = obj["node"];
                    obj['node'] = [];
                    if (old)
                    {
                        obj['node'].push(old);
                    }
                }
                if (xmlToJson(item)!= undefined){
                    obj['node'].push(xmlToJson(item));
                }
            }
        }
    }
    return obj;
};