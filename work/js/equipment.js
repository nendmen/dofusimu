function displayEquipment(type){
    var tags = "";
    for(var key in equipments){
	    var item = equipments[key];
	    if(item["Type"] == type){
	        tags += getTag("div", {"id": item["Id"], "class": "item"}, 
			               item["Name"]);
	    }
    }
    
    var max = max_number_of_equipment_dict[type];
    var count = getNOE(type);
    for(var i=0 ; i<max - count ; i++){
	    tags += getTag("div", {}, "なし");
    }
    
    var id = "equipment_" + type;
    
    emptyThenAppend(id, tags);
}

// 指定タイプのアイテムがいくつ装備されているかを返す
function getNOE(type){
    var count = 0;
    for(var key in equipments){
	    var item = equipments[key];
	    if(item["Type"] == type){
	        count++;
	    }
    }
    return count;
}

// 指定タイプのアイテムが最大数かどうかを返す
function isMOE(type){
    var count = getNOE(type);
    var max = max_number_of_equipment_dict[type];
    if(max == count){
	    return true;
    }else{
	    return false;
    }
}

// 指定タイプの装備アイテムの一つ目のIDを返す
function getFIdOE(type){
    for(var key in equipments){
	    if(equipments[key]["Type"] == type){
	    return key;
	}
    }
}