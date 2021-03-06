function itemEvent(){
    itemClickEvent();
    itemDoubleClickEvent();
}

function itemClickEvent(){
    $(".item").live("click", function(){
        var tag = $(this);
        var id = tag.attr("id");
        var item = "";
	if(isInInventory(id)){
	    item = inventory[id];
	}else{
	    item = equipments[id];
	}

        $("#infomation_name").html(item["Name"]);
        $("#infomation_level").html(item["Level"]);
        
        $("#infomation_status").html(getInfomationStatusTag(item));
    });
}

function getInfomationStatusTag(item){
    var tags = "";

    for(var key in item["Status"]){
        tags += getTag("div", {}, 
                       getTag("span", {"class": "label"}, id_display_dict[key])
                       + getTag("span", {}, item["Status"][key]));
    }

    return tags;
}

function itemDoubleClickEvent(){
    $(".item").live("dblclick", function(){
        var tag = $(this);
        var id = tag.attr("id");
	    var type = "";
        
	    if(isInInventory(id)){
	        type = inventory[id]["Type"];
	        itemEquip(id);
	    }else{
	        type = equipments[id]["Type"];
	        itemRemove(id);
	    }
        
	    displayInventory();
	    displayEquipment(type);
        
        displayTotal();
    });
}

function itemEquip(id){
    var type = inventory[id]["Type"];
    if(isMOE(type)){
	var f_id = getFIdOE(type);
	itemRemove(f_id);
    }

    equipments[id] = inventory[id];
    delete inventory[id];
}

function itemRemove(id){
    inventory[id] = equipments[id];
    delete equipments[id];
}

