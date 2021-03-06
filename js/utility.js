// 辞書のサイズを返す
function getDictSize(dict){
    var size = 0;
    for(var i in dict){
        size ++;
    }
    return size;
}

// ダブルクォートでくくって返す
function dq(str){
    return "\"" + str + "\"";
}

// サニタイズ
function escape_html_tag(string) {
    return string.replace(/[&<>]/g, function(match) {
	    return {
		'&' : '',
		    '<' : '',
		    '>' : '',
		    '"' : '',
		    "'" : ''
		    }[match];
	});
}

// タグ生成関数
function getTag(tagName, dict, html){
    var tag = "<" + tagName + " ";
    for(var attr in dict){
	tag += attr + "=\"" + dict[attr] + "\" ";
    }
    return tag + ">" + html + "</" + tagName + ">";
}

// 表示更新用
function emptyThenAppend(id, html){
    $("#" + id).empty();
    $("#" + id).append(html);
}

// 正規表現を用いてidを正規化
function getValidId(id){
    return id.replace(/[^0-9a-zA-Z]/g, "");
}

// 名前からアイテムデータを取得
function getItemData(name){
    for(var i in equipment_type_list){
	    for(var n in equipment_json[equipment_type_list[i]]){
	        if(name == n){
		        var item = equipment_json[equipment_type_list[i]][name];
		        item["Type"] = equipment_type_list[i];
		        item["Key"] = name;
		        item["Name"] = name;
		        return item;
	        }
	    }
    }
    return null;
}

// 引数に取った種類のステータスの魔術最大値を取得
function getMaxCorrespondsToType(type){
    return 100/status_power_dict[type];
}

// 数値幅に対応したオプションを生成
function getOptionsCorrespondsToValues(min, max, value){
    var options = "";
    for(var i=min ; i<eval(max) + 1 ; i++){
	    if(i == value){
	        options = getSelectedOption(i, i) + options;
	    }else{
	        options = getOption(i, i) + options;
	    }
    }
    return options;
}

// リストからオプションを生成
function getOptionsFromList(list){
    var options = "";
    list.forEach(function(data){
        options += getTag("option", {"value": data}, data);
    });
    return options;
}

// リスト内に重複しないようなidを取得する
function getNotOverlappedId(baseId, list){
    var count = 0;
    var id = baseId;
    while(true){
	    count++;
	    if(list.indexOf(id) == -1){
	        break;
	    }else{
	        id = baseId + count;
	    }
    }
    return id;
}

// 非推奨関数群
function getOption(value, html){
    return "<option value=\"" + value + "\">" + html + "</option>";
}
function getSelectedOption(value, html){
    return "<option selected value=\"" + value + "\">" + html + "</option>";
}
function getSelect(id, html){
    return "<select id=\"" + id + "\">" + html + "</select>";
}
function getSelectWithClass(cl, html){
    return "<select class=\"" + cl + "\">" + html + "</select>";
}
function getDiv(html){
    return "<div>" + html + "</div>";    
}
function getDivWithId(id, html){
    return "<div id=\"" + id + "\">" + html + "</div>";
}
function getDivWithClass(cl, html){
    return "<div class=\"" + cl + "\">" + html + "</div>";
}
function getTagWithClass(tagName, cl, html){
    return "<" + tagName + " class=\"" + cl + "\">" + html + "</" + tagName + ">";
}
function getInput(id, type, size){
    return "<input id=\"" + id 
        + "\" type=\"" + type
	+ "\" size=\"" + size + "\"></input>";
}
function getInputWithValue(id, type, size, value){
    return "<input id=\"" + id 
        + "\" type=\"" + type
	+ "\" size=\"" + size 
	+ "\" value=\"" + value + "\"></input>";
}
function getTextWithClass(cl, size, value){
    return "<input type=\"text\" class=\"" + cl
	+ "\" size=\"" + size 
	+ "\" value=\"" + value + "\"></input>";
}
function getTagWithDict(tagName, dict, html){
    var tag = "<" + tagName + " ";
    for(var attr in dict){
	tag += attr + "=\"" + dict[attr] + "\" ";
    }
    return tag + ">" + html + "</" + tagName + ">";
}
