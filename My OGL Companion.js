on("chat:message", function(msg) {
    
    function getArgs(command){
        return;
    }
    if (msg.type == "api") {
        
        if (msg.content.startsWith("!AdvToggle") && msg.selected != undefined) {
            var normal = "{{query=1}} {{normal=1}} {{r2=[[0d20";
            var advantage = "{{query=1}} {{advantage=1}} {{r2=[[1d20";
            var disadvantage = "{{query=1}} {{disadvantage=1}} {{r2=[[1d20";
            
            var setAdvTo= msg.content.split("--")[1];
            log (setAdvTo);
            
            var selectedObject =  getObj(msg.selected[0]._type, msg.selected[0]._id);
            var character = getObj('character', selectedObject.get('represents'));
            log(character);
            log (character.id);

            var AdvToggle = findObjs({
                name: "advantagetoggle",
                _type:"attribute",
                _characterid:character.id})[0];
            log(AdvToggle);
            log (AdvToggle.get("current"));
            //var current = /{{query=1}} {{(\w+)=1}}/.exec(AdvToggle.get("current"))[1];
            if (setAdvTo == "normal"){
                AdvToggle.set("current",normal);
            } else if (setAdvTo == "advantage"){
                AdvToggle.set("current",advantage);
            } else if (setAdvTo == "disadvantage"){
                AdvToggle.set("current",disadvantage);
            }
            
            log (AdvToggle.get("current"));         
        }
        
        if (msg.content.startsWith("!SELECTED") && msg.selected != undefined) { 
            _.each(msg.selected, function(s) {
                log(s);
            });
        }
        
        if (msg.content.startsWith("!SavingThrows") && msg.selected != undefined) {
            var selectedObject =  getObj(msg.selected[0]._type, msg.selected[0]._id);
            //log (selectedObject);
            var selectedChar = getObj('character', selectedObject.get('represents'));
            //log (selectedChar);
            var charName = selectedChar.get("name");
            //log (charName);  

            var buttonStyle = "style='font-size: 9pt; width: 25px; border: 1px solid black; margin: 1px; background-color: #588a9e; border-radius: 4px;  box-shadow: 1px 1px 1px #707070;'";
            //if (PC) --> This block only works for PCs
            sendChat(msg.who, "/w " + msg.who + " <div class='sheet-rolltemplate-simple'><div class='sheet-container' style='border-radius: 0px;'><div class='sheet-label' style='margin-top:5px;'><span style='display:block;'>" +
                charName + "'s <br/> Saving Throws <br/>" +
                "<a " + buttonStyle + " href='~"+ charName +"|strength_save'> Str </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|dexterity_save'> Dex </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|constitution_save'> Con </a><br />" +
                "<a " + buttonStyle + " href='~"+ charName +"|intelligence_save'> Int </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|wisdom_save'> Wis </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|charisma_save'> Cha </a> " +
                "</span></div></div></div>");

            //else if (NPC) --> Need a separate block for NPCs
            /*    sendChat(msg.who, "/w " + msg.who + " <div class='sheet-rolltemplate-simple'><div class='sheet-container' style='border-radius: 0px;'><div class='sheet-label' style='margin-top:5px;'><span style='display:block;'>" +
                charName + "'s <br/> Saving Throws <br/>" +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_str_save'> Str </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_dex_save'> Dex </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_constitution_save'> Con </a><br />" +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_intelligence_save'> Int </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_wisdom_save'> Wis </a> | " +
                "<a " + buttonStyle + " href='~"+ charName +"|npc_charisma_save'> Cha </a> " +
                "</span></div></div></div>");                */
        }
    }
});