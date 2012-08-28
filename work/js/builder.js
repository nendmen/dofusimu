function builderEvent(){
    builderConditionAddEvent();
    builderSearchEvent();
    builderNameChangeEvent();
    builderForgeEvent();
    builderCreateEvent();
}

//// 制約条件追加イベント
function builderConditionAddEvent(){
    $("#builder_condition_add").click(function(){    
        $("#builder_conditions").append(getConditionDiv());
    });
}

function getConditionDiv(){
    var condition = getConditionTypeSelect()
        + getConditionValueInput();

    return getDiv(condition);
}

function getConditionTypeSelect(){
    var options = getOption("default", "ステータスの種類を選択");
    for(var status_type in status_power_dict){
        options += getOption(status_type, id_display_dict[status_type]);
    }
    return getSelect("builder_condition_options", options);
}

function getConditionValueInput(){
    return getInput("builder_condition_value", "text", "4");
}

//// 検索ボタンを押したときのイベントを登録する
function builderSearchEvent(){
    $("#builder_search").click(function(){
        var type = $("#builder_type_select").val();

        var options = getTag("option", {"value": "default"}, "検索結果");
        options += getOptionsFromList(
            getEquipmentNameListForConditions(equipment_json[type]));
        
        emptyThenAppend("builder_name_select", options);
    });
}

// 装備データリストから条件に合う装備をリストとして返す
function getEquipmentNameListForConditions(equipments){
    var list = [];

    for(var name in equipments){
        if(isMatchLevelCondition(equipments[name]["Level"]) 
           && isMatchCondition(equipments[name]["Status"])){
            list.push(name);
        }
    }

    return list;
}

// レベル条件に合うかどうかを調べる
function isMatchLevelCondition(level){
    var low = $("#builder_level_low").val();
    var high = $("#builder_level_high").val();

    return (low <= eval(level)) && (eval(level) <= high);
}

// ステータス条件に合うかどうかを調べる
function isMatchCondition(status){
    var conditions = $("#builder_conditions").children("div");
    var flag = true;
    conditions.each(function(){
        var condition_type = $(this).children("#builder_condition_options").val();
        var condition_value = $(this).children("#builder_condition_value").val();

        var target = status[condition_type] == undefined ? 
            "0" : status[condition_type]["max"]
        if(eval(target) < eval(condition_value)){
            flag = false;
        }
    });
    return flag;
}


////  検索欄の名前が変更された時のイベント
function builderNameChangeEvent(){
    $("#builder_name_select").change(function(){
        var name = $(this).val();
        var itemData = getItemData(name);

        if(itemData != null){
	        emptyThenAppend("builder_summary", getBuilderSummaryTags(itemData));
            emptyThenAppend("builder_status", getBuilderStatusTags(itemData));
            setBuilderForgeType();
        }
    });
}

// id="builder_summary" に入るタグを返す
function getBuilderSummaryTags(itemData){
    var type = itemData["Type"];
    var level = itemData["Level"];
    var name = itemData["Name"];
    return getTag("span", {}, getTag("span", {"id": "builder_summary_type", "value": type}, ""))
        + getTag("span", {}, getTag("input", {"id": "builder_summary_name", "key": name, "type": "text", "value": name}, ""))
	    + getTag("span", {}, getTag("span", {"class": "label"}, "Lv") + getTag("span", {"id": "builder_summary_level"}, level));
}

// id="builder_status"に入るタグを返す
function getBuilderStatusTags(itemData){
    var tags = "";
    
    for(var type in itemData["Status"]){
        var value = itemData["Status"][type]["max"];
        var min = Math.min(itemData["Status"][type]["min"], 0);
        var max = Math.max(value, getMaxCorrespondsToType(type));
        
        tags += getBuilderStatusDiv(type, min, max, value);
    }

    return tags;
}

// 引数タイプのステータス名と数値セレクトのペアを返す
function getBuilderStatusDiv(type, min, max, value){
    var options = getOptionsCorrespondsToValues(min, max, value);

    return getTag("div", {}, 
                  getTag("span", {"class": "label"}, id_display_dict[type])
                  + getTag("select", {"key": type}, options));
}


//// 魔術ボタンを押したときのイベント
function builderForgeEvent(){
    $("#builder_forge").click(function(){
        var type = $("#builder_forge_type").val();
        if(status_power_dict[type] != undefined){
            var max = getMaxCorrespondsToType(type);
            $("#builder_status").append(getBuilderStatusDiv(type, 0, max, 0));

            setBuilderForgeType();
        }
    });
}

// 魔術可能なオプション名をセレクトへ出力
function setBuilderForgeType(){
    var options = getOption("default", "魔術するオプションを選択");
    var excluding_list = getExcludingStatusList(getBuilderStatusTypeList());
    excluding_list.forEach(function(type){
        options += getOption(type, id_display_dict[type]);
    });
    emptyThenAppend("builder_forge_type", options);
}

// 引数のリストにないステータスをリストとして返す
function getExcludingStatusList(including_list){
    var excluding_list = [];
    for(var type in status_power_dict){
        if(including_list.indexOf(type) == -1){
            excluding_list.push(type);        
        }
    }
    return excluding_list;
}

//// 作成ボタンを押したときのイベントを登録する
function builderCreateEvent(){
    $("#builder_create").click(function(){
        if(canCreate()){
            var item = {"Status": {}};
            
            var summary_dict = getBuilderSummaryDict();
            for(var key in summary_dict){
                item[key] = summary_dict[key];
            }

            var status_dict = getBuilderStatusDict();
            for(var key in status_dict){
                item["Status"][key] = status_dict[key];
            }

            var id = getNotOverlappedId(getValidId(item["Key"]), getInventoryIdList());
            item["Id"] = id;

            inventory[id] = item;
            displayInventory();            
        }        
    });
}

// 作成イベントを行えるかどうか
function canCreate(){
    for(var key in getBuilderStatusDict()){
        return true;
    }
    return false;
}

// id="builder_summary" 内のデータ辞書(Type, Name, Level)を返す
function getBuilderSummaryDict(){
    var summary = $("#builder_summary");
    var dict = {};

    dict["Type"] = $(summary.find("#builder_summary_type")[0]).attr("value");
    dict["Name"] = $(summary.find("#builder_summary_name")[0]).attr("value");
    dict["Key"] = $(summary.find("#builder_summary_name")[0]).attr("key");
    dict["Level"] = $(summary.find("#builder_summary_level")[0]).html();
    
    return dict;
}

// id="builder_status"内のデータ辞書(Vitality, Strength)を返す
function getBuilderStatusDict(){
    var dict = {};

    $("#builder_status").children("div").each(function(){
        var select = $($(this).find("select")[0]);
        dict[select.attr("key")] = select.val();
    });

    return dict;
}

// 現在表示されているステータスのclassアトリビュートをリストとして返す
function getBuilderStatusTypeList(){
    var list = [];

    $("#builder_status").children("div").each(function(){
        list.push($(this).attr("class"));
    });

    return list;
}