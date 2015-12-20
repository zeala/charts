// Changes XML to JSON

//a recursive function to convert xml to JSON:
//attributes become properties;
//children are grouped in an array.

xmlToJSON2 = function(xml) {
    var o = {"tagName": xml.nodeName};
    if(xml.attributes) {
        o.attributes = [];
        Array.prototype.forEach.call(xml.attributes,
            function(a){
                o.attributes[a.name] = a.value;
            }); //treat the attributes node list as an array
                //and add each attribute to the object
    }
    if (xml.textContent&&xml.textContent.length) {
        o["textContent"] = xml.textContent.trim();
    }
    if (xml.children.length) {
        o.children = Array.prototype.map.call(xml.children,
            function(child) {
                return xmlToJSON2(child);
            });
        //replace each xml object in the child array
        //with its JSON-ified version
    }

    return o;
}

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