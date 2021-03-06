function initialize(){
    $.getJSON("json/equipment.json", function(data){
	    equipment_json = data;
    });

    $.getJSON("json/set_dict.json", function(data){
	    set_dict_json = data;
    });

    $.getJSON("json/set_status.json", function(data){
	    set_status_json = data;
    });

    initHTML();
    displayTotal();
}

// 初期状態のHTMLを生成する
function initHTML(){
    $("#column_left").append(getHTMLforTotal());
    $("#column_left").append(getHTMLforCharacter());
    $("#column_center").append(getHTMLforEquipment());
    $("#column_center").append(getHTMLforSet());
    $("#column_right").append(getHTMLforBuilder());
    $("#column_right").append(getHTMLforFile());
}

function getHTMLforBuilder(){ 
    var gcond = function(){
        var cate = function(){
            var options = getTag("option", {"value": "all"}, "すべて");
            equipment_type_list.forEach(function(data){
                options += getTag("option", {"value": data}, id_display_dict[data]);
            });
            var select = getTag("select", {"id": "builder_type_select"}, options);
            return getTag("div", {"class": "b4"}, "カテゴリー" + select);
        }

        var level = function(){
            var mins = getTag("select", {"id": "builder_level_low"}, getOptionsCorrespondsToValues(1, 200, 1));
            var maxs = getTag("select", {"id": "builder_level_high"}, getOptionsCorrespondsToValues(1, 200, 200));
        
            return getTag("div", {"class": "b4"}, "レベルが" + mins + "以上で" + maxs + "以下");
        }

        var cond = function(index){
		
	    var options = getTag("option", {"value": "default"}, "ステータス");
	    
	    for(var i in status_power_dict){
		options += getTag("option", {"value": i}, id_display_dict[i]);
	    }
	    
	    var select = getTag("select", {"id": "builder_condition_select_" + index}, options);
	    var input = getTag("input", {"id": "builder_condition_value_" + index, "type": "text"}, "");
	    
	    return getTag("div", {"class": "b4"}, select + "が" + input + "以上");
        }

	/*

		var tr = "";

		var options = getTag("option", {"value": "default"}, "ステータス");

		for(var j in status_power_dict){
		    options += getTag("option", {"value": j}, id_display_dict[j]);
		}

		var select = getTag("select", {"id": "builder_condition_select_" + i}, options);
		tr += getTag("td", {}, select);
		tr += getTag("td", {}, "が");

		var input = getTag("input", {"id": "builder_condition_value_" + i, "size": "4", "type": "text"}, "");
		tr += getTag("td", {}, input);
		tr += getTag("td", {}, "以上");

		trs += getTag("tr", {}, tr);
            }

            return getTag("table", {}, trs);

	 */
        
        var title = getTag("h3", {}, "検索条件");
	
	return getTag("div", {"class": "b3"}, title + cate() + level() + cond(0) + cond(1) + cond(2));
    }

    var gresult = function(){
        var search = function(){
            var input = getTag("input", {"id": "builder_search", "type": "button", "value": "検索"}, "");

            return getTag("div", {"class": "b4"}, "上記の条件で" + input + "する");
        }

        var result = function(){
            var option = getTag("option", {}, "なし");
            var select = getTag("select", {"id": "builder_name_select", "style": "width:180px;"}, option);
            
            return getTag("div", {"class": "b4"}, "検索結果" + select + "を選択");
        }

        var title = getTag("h3", {}, "検索、検索結果");

        return getTag("div", {"class": "b3"}, title + search() + result());
    }

    var gabst = function(){
        var abst = function(){
            var wikia_button = getTag("input", {"type": "button", "value": "wikia", "id": "builder_wikia"}, "");
            var base = getTag("span", {"id": "builder_summary_base"}, "***********");
            var cate = getTag("span", {"id": "builder_summary_type", "key": "default"}, "********");
            var level = getTag("span", {"id": "builder_summary_level"}, "***");

            return getTag("div", {"class": "b4"}, "ベース名 " + base + wikia_button)
                + getTag("div", {"class": "b4"},  "カテゴリー " + cate + " / レベル " + level);
        }

        var name = function(){
            var input = getTag("input", {"id": "builder_summary_name", "type": "text"}, "");
            return getTag("div", {"class": "b4"}, "名前を" + input + "にする");
        }

        var title = getTag("h3", {}, "概要");
 
        return getTag("div", {"class": "b3"}, title + abst() + name());
    }

    var gstat = function(){
        var scroll = function(){
            var table = getTag("table", {"id": "builder_status"}, "<tr><td>ここにステータスが表示されます</td></tr>");
            return getTag("div", {"class": "scroll"}, table);
        }

        var title = getTag("h3", {}, "ステータス");

        return getTag("div", {"class": "b3"}, title + scroll());
    }

    var gforge = function(){
        var stat = function(){
            var option = getTag("option", {}, "ステータス");
            var select = getTag("select", {"id": "builder_forge_type"}, option);

            var button = getTag("input", {"id": "builder_forge", "type": "button", "value": "追加"}, "");

            return getTag("div", {"class": "b4"}, "この" + select + "を" + button + "する");
        }

        var title = getTag("h3", {}, "魔術");
        return getTag("div", {"class": "b3"}, title + stat());
    }

    var gcreate = function(){
        var create = function(){
            var button = getTag("input", {"id": "builder_create", "type": "button", "value": "作成"}, "");
	    var buttoneq = getTag("input", {"id": "builder_create_equip", "type": "button", "value": "作成して装備"}, "");
 
            return getTag("div", {"class": "b4"}, "このアイテムを" + button + buttoneq + "する");
        }        
        
        var title = getTag("h3", {}, "作成");
        return getTag("div", {"class": "b3"}, title + create());
    }

    var title = getTag("h2", {}, "アイテム製造器");    

    return getTag("div", {"id": "builder"}, title + gcond() + gresult() + gabst() + gstat() + gforge() + gcreate());
}

function getHTMLforEquipment(){
    var geq = function(){
        var trs = "";

        equipment_type_list.forEach(function(data){
            var max = max_number_of_equipment_dict[data];
            for(var i=0 ; i<max ; i++){
                var tr = "";
                if(i == 0) {
                    tr += getTag("th", {}, id_display_dict[data].substr(0, 3));
                }else{
                    tr += getTag("td", {}, "");
                }

                var option = getTag("option", {"value": "default"}, "なし");
                var select = getTag("select", {"key": data, "class": "equipment_select"}, option);
                tr += getTag("td", {}, select);

                var button = getTag("input", {"class": "equipment_modify", "type": "button", "value": "編集"}, "");
                tr += getTag("td", {}, button);
                
                trs += getTag("tr", {}, tr);
            }
        });

        var table = getTag("table", {"id": "equipment_table"}, trs);

        var title = getTag("h3", {}, "装備しているアイテム");
        return getTag("div", {"class": "b3"}, title + table);
    }

    var title = getTag("h2", {}, "装備関連");
    return getTag("div", {"id": "equipment"}, title + geq());
}

function getHTMLforSet(){
    var gset = function(){
        var option = getTag("option", {"value": "default"}, "なし");
        var select = getTag("select", {"id": "set_select"}, option);

        var nume = getTag("span", {"id": "set_nume"}, "*");
        var deno = getTag("span", {"id": "set_deno"}, "*");

        var setsel = getTag("div", {"class": "b4"}, "セットを選択" + select + nume + "/" + deno);

        var button = getTag("input", {"type": "button", "id": "set_full_button", "value": "フルセット"}, "");
        var setbut = getTag("div", {"class": "b4"}, "選択されているセットを" + button + "する");

        var title = getTag("h3", {}, "適用されているセット一覧");
        return getTag("div", {"class": "b3"}, title + setsel + setbut);
    }

    var gbonus = function(){
        var scroll = function(){
            var table = getTag("table", {"id": "set_bonus"}, "<tr><td>ここにセットボーナスが表示されます</td></tr>");
            return getTag("div", {"class": "scroll"}, table);
        }

        var title = getTag("h3", {}, "セットボーナス");
        return getTag("div", {"class": "b3"}, title + scroll());
    }

    var title = getTag("h2", {}, "セット関連");
    return getTag("div", {"id": "set"}, title + gset() + gbonus());
}

function getHTMLforTotal(){
    var tdi = {};
    for(var i in status_power_dict){
        tdi[i] = getTag("span", {"id": "total_" + i}, 0);
    }

    var gbasic = function(){
        var first = getTag("div", {"class": "b4"}, 
                           "HP " + tdi["Vitality"] + " / " +
                           "AP " + tdi["AP"] + " / " +
                           "MP " + tdi["MP"] + " / " +
                           "リーダーシップ " + tdi["Initiative"]);

        var second = getTag("div", {"class": "b4"}, 
                            "精神 " + tdi["Wisdom"] + " / " +
                            "PP " + tdi["Prospecting"] + " / " +
                            "有効エリア " + tdi["Range"] + " / " +
                            "召喚 " + tdi["Summon"]);

        var third = getTag("div", {"class": "b4"}, 
                           "力 " + tdi["Strength"] + " / " +
                           "知性 " + tdi["Intelligence"] + " / " +
                           "運 " + tdi["Chance"] + " / " +
                           "すばやさ " + tdi["Agility"]);

        var title = getTag("h3", {}, "基本値");

        return getTag("div", {"class": "b3"}, title + first + second + third);
    };

    var gres = function(){
        var first = getTag("div", {"class": "b4"}, 
                           "N " + tdi["Resistneutral"] + " / " +
                           "地 " + tdi["Resistearth"] + " / " +
                           "火 " + tdi["Resistfire"] + " / " +
                           "水 " + tdi["Resistwater"] + " / " +
                           "風 " + tdi["Resistair"] + " / " +
                           "PB " + tdi["Pushbackresistance"] + " / " +
                           "CH " + tdi["Criticalresistance"]);

        var second = getTag("div", {"class": "b4"}, 
                            "N " + tdi["PercentResistneutral"] + " % / " +
                            "地 " + tdi["PercentResistearth"] + " % / " +
                            "火 " + tdi["PercentResistfire"] + " % / " +
                            "水 " + tdi["PercentResistwater"] + " % / " +
                            "風 " + tdi["PercentResistair"] + " %");

        var title = getTag("h3", {}, "耐性");

        return getTag("div", {"class": "b3"}, title + first + second);
    };

    var gdmg = function(){
        var first = getTag("div", {"class": "b4"}, 
                           "ダメージ " + tdi["Damage"] + " / " +
                           "パワー " + tdi["PercentDamage"] + " % / " +
                           "罠 " + tdi["Damagetotraps"] + " / " +
                           "罠パワー " + tdi["PercentDamagetotraps"] + " %");

        var second = getTag("div", {"class": "b4"}, 
                            "N " + tdi["Neutral"] + " / " +
                            "地 " + tdi["Earth"] + " / " +
                            "火 " + tdi["Fire"] + " / " +
                            "水 " + tdi["Air"] + " / " +
                            "風 " + tdi["Water"] + " / " + 
                            "PB " + tdi["Pushbackdamage"]);

        var title = getTag("h3", {}, "ダメージ");

        return getTag("div", {"class": "b3"}, title + first + second);
    };

    var gloss = function(){
        var first = getTag("div", {"class": "b4"}, 
                           "AP奪取 " + tdi["APreductionability"] + " / " +
                           "AP回避 " + tdi["APlossresistance"] + " / " +
                           "MP奪取 " + tdi["MPreductionability"] + " / " +
                           "MP回避 " + tdi["MPlossresistance"]);

        var title = getTag("h3", {}, "ロス関連");

        return getTag("div", {"class": "b3"}, title + first);
    };

    var getc = function(){
        var first = getTag("div", {"class": "b4"}, 
                           "CH " + tdi["Criticalhit"] + " / " +
                           "ヒーリング " + tdi["Heal"] + " / " +
                           "回避 " + tdi["Dodge"] + " / " +
                           "障害 " + tdi["Lock"]);

        var title = getTag("h3", {}, "その他");

        return getTag("div", {"class": "b3"}, title + first);
    };

    var title = getTag("h2", {}, "総合ステータス");
    return getTag("div", {"id": "total"}, title + gbasic() + gres() + gdmg() + gloss() + getc());
}

function getHTMLforCharacter(){
    var gbasic = function(){
        var basic = function(){
            var options = getTag("option", {"value": "default"}, "選択してください");
            for(var i in characteristic_dict){
                options += getTag("option", {"value": i}, id_display_dict[i]);
            }
 
            var clasel = getTag("select", {"id": "character_class_select"}, options);

            var levsel = getTag("select", {"id": "character_level_select"}, getOptionsCorrespondsToValues(1, 200, 199));

            return getTag("div", {"class": "b4"}, "クラス" + clasel + "/ レベル" + levsel);
        }
        
        var title = getTag("h3", {}, "基本情報");
   
        return getTag("div", {"class": "b3"}, title + basic());
    }

    var gstat = function(){
        var ggtable = function(){
            var tr = "";
            tr += getTag("td", {}, "*");
            tr += getTag("th", {"colspan": "3"}, "使用スクロール値");
            tr += getTag("th", {"colspan": "3"}, "使用ポイント値");
            tr += getTag("th", {}, "総合値");
            
            var trs = getTag("tr", {}, tr);

            character_status_list.forEach(function(data){
                tr = getTag("th", {}, id_display_dict[data]);

                var scr_minus = getTag("input", {"class": "character_status_shift", "key": data, "key2": "Scroll", "type": "button", "value": "-"}, "");
                var scr_plus = getTag("input", {"class": "character_status_shift", "key": data, "key2": "Scroll", "type": "button", "value": "+"}, "");
                var scr = getTag("td", {"id": "character_scroll_" + data}, "0");
                tr += getTag("td", {}, scr_minus)  + scr + getTag("td", {}, scr_plus);

                var pt_minus = getTag("input", {"class": "character_status_shift", "key": data, "key2": "Point", "type": "button", "value": "-"}, "");
                var pt_plus = getTag("input", {"class": "character_status_shift", "key": data, "key2": "Point", "type": "button", "value": "+"}, "");
                var pt = getTag("td", {"id": "character_point_" + data}, "0");
                tr += getTag("td", {}, pt_minus)  + pt + getTag("td", {}, pt_plus);

                var total = getTag("span", {}, "0");
                tr += getTag("td", {"id": "character_total_" + data}, total);
                
                trs += getTag("tr", {}, tr);
            });

            return getTag("table", {}, trs);
        }

        var ggrest = function(){           
            var rest = getTag("span", {"id": "character_remain_point"}, "990");

            return getTag("div", {"class": "b4"}, "残りポイントは " + rest + " です");
        }

	var ggchecks = function(){
	    var ctrl = getTag("input", {"type": "checkbox", "id": "character_check_ctrl"}, "");
	    var alt = getTag("input", {"type": "checkbox", "id": "character_check_alt"}, "");

            return getTag("div", {"class": "b4"}, "変動量増加用チェックボックス : " + "Ctrl" + ctrl + "Alt" + alt);
	}
        
        var title = getTag("h3", {}, "ステータス");

        return getTag("div", {"class": "b3"}, title + ggchecks() + ggtable() + ggrest());
    }

    var title = getTag("h2", {}, "キャラクター");
    return getTag("div", {"id": "character"}, title + gbasic() + gstat());
}

function getHTMLforFile(){
    var gout = function(){
        var button = getTag("input", {"type": "button", "id": "file_output_button", "value": "出力する"}, "");
        var input = getTag("input", {"type": "text", "id": "file_output_text"}, "");
        var it = getTag("div", {"class": "b4"}, button + input);
      
        var title = getTag("h3", {}, "保存");
        return getTag("div", {"class": "b3"}, title + it);
    }

    var gin = function(){
        var button = getTag("input", {"type": "button", "id": "file_input_button", "value": "読み込む"}, "");
        var input = getTag("input", {"type": "text", "id": "file_input_text"}, "");
        var it = getTag("div", {"class": "b4"}, button + input);
      
        var title = getTag("h3", {}, "読み込み");
        return getTag("div", {"class": "b3"}, title + it);
    }

    var title = getTag("h2", {}, "保存と読み込み");
    return getTag("div", {"id": "file"}, title + gout() + gin());
}

function setBuilderTypeSelect(){
    var options = getOption("default", "装備タイプを選択してくだしあ");
    equipment_type_list.forEach(function(type){
	    options += getOption(type, id_display_dict[type]);
    });
    $("#builder_type_select").append(options);
}

function setBuilderLevelCondition(){
    $("#builder_level_low").append(getOptionsCorrespondsToValues(0, 200, 0));
    $("#builder_level_high").append(getOptionsCorrespondsToValues(0, 200, 200));
}

function setInventorySelect(){    
    var options = getTag("option", {"value": "default"}, "全種類");
    equipment_type_list.forEach(function(type){
        options += getTag("option", {"value": type}, id_display_dict[type]);
    });

    $("#inventory_select").append(options);
}

// 装備一覧用タグをセット
function setEquipmentTags(){
    var tags = "";
    
    equipment_type_list.forEach(function(type){
        var h3 = getTag("h3", {}, id_display_dict[type]);
        var div = getTag("div", {"id": "equipment_" + type}, "");
        tags += getTag("div", {"class": "b3"}, h3 + div);
    });
    
    $("#equipment").append(tags);
    
    equipment_type_list.forEach(function(data){
	    displayEquipment(data);
    });
}

// キャラクターのクラス選択フォームをセット
function setCharacterClassSelect(){
    var options = getTag("option", {"value": "default"}, "クラスを選択");
    class_list.forEach(function(data){
        options += getTag("option", {"value": data}, id_display_dict[data]);
    });

    $("#character_class_select").append(options);
}

// キャラクターのレベル選択フォームをセット
function setCharacterLevelSelect(){
    var options = getOptionsCorrespondsToValues(1, 200, 199);
    
    $("#character_level_select").append(options);
}

// キャラクターのステータス設定タグをセット
function setCharacterStatusTags(){
    var tags = "";

    character_status_list.forEach(function(data){
        var scrollMinus = getTag("input", {"type": "button", "key": data, "key2": "Scroll", "class": "character_status_shift", "value": "-"}, "");
        var scrollPlus = getTag("input", {"type": "button", "key": data, "key2": "Scroll", "class": "character_status_shift", "value": "+"}, "");
        var pointMinus = getTag("input", {"type": "button", "key": data, "key2": "Point", "class": "character_status_shift", "value": "-"}, "");
        var pointPlus = getTag("input", {"type": "button", "key": data, "key2": "Point", "class": "character_status_shift", "value": "+"}, "");
        
        var label = getTag("td", {"class": "label"}, id_display_dict[data]);
        var scroll = getTag("td", {}, scrollMinus + getTag("span", {"id": "character_status_scroll"}, "0") + scrollPlus);
        var point = getTag("td", {}, pointMinus + getTag("span", {"id": "character_status_point"}, "0") + pointPlus);
        var total = getTag("td", {"id": "character_status_total"}, "0");
        tags += getTag("tr", {"key": data}, label + scroll + point + total);
    });

    $("#character_status_list").append(getTag("table", {}, tags));
}

// 総合ステータスのタグを設定
function setTotalTags(){
    calcTotal();

    var trs = "";
    for(var key in total_status){
	    var tags = getTag("td", {"class": "label"}, id_display_dict[key]);
	    tags += getTag("td", {"id": "total_" + key}, total_status[key]);
	    trs += getTag("tr", {}, tags);
    }
    var table = getTag("table", {}, trs);
    $("#total").append(table);
}
