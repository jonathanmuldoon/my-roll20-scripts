var MyOGLCompanion_verson = "0.0.2";

var img = "background-image: -webkit-linear-gradient(left, #76ADD6 0%, #a7c7dc 100%);";
var tshadow = "text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000 , 2px 2px #222;";
var boxStyle= "width: 250px; border-radius: 8px 8px 8px 8px; padding: 5px; font-size: 10pt; " + tshadow + " box-shadow: 3px 3px 1px #707070; " + img + " color:#FFF; border:2px solid black; text-align:center; vertical-align:middle;"
var buttonStyle = "border: 1px solid black; margin: 1px; background-color: #588a9e; border-radius: 4px;  box-shadow: 1px 1px 1px #707070;";

var getParams = function(commandLine) {

    var result ={};
    var args = _.rest(commandLine.split("--"));
    _.each(args, function(token) {
        var array = token.split('=');
        array[1] && (result[array[0].trim()] = array[1].trim());
    });
    return result;
};
    
var getCharacter = function(msg) {

    var character ={};
    var params = getParams(msg.content);
    
    if (params.characterName != undefined) {
        character = findObjs({
            _type: "character",
            name: params.characterName})[0];
    } else if (msg.selected != undefined) {
        var selectedObject =  getObj(msg.selected[0]._type, msg.selected[0]._id);
        character = getObj('character', selectedObject.get('represents'));
    }
    
    return character;
};    
    
on("chat:message", function(msg) {
    
    if (msg.type == "api") {
        
        if (msg.content.startsWith("!AdvToggle ")) {
            
            var normal = "{{query=1}} {{normal=1}} {{r2=[[0d20";
            var advantage = "{{query=1}} {{advantage=1}} {{r2=[[1d20";
            var disadvantage = "{{query=1}} {{disadvantage=1}} {{r2=[[1d20";

            var character = getCharacter(msg);

            var AdvToggle = findObjs({
                name: "advantagetoggle",
                _type:"attribute",
                _characterid:character.id})[0];
               
            var setAdvTo = getParams(msg.content).setting; 
            
            if (AdvToggle != undefined){
                if (setAdvTo == "normal"){
                    AdvToggle.set("current",normal);
                } else if (setAdvTo == "advantage"){
                    AdvToggle.set("current",advantage);
                } else if (setAdvTo == "disadvantage"){
                    AdvToggle.set("current",disadvantage);
                }
            }
        }
        
        if (msg.content.startsWith("!SavingThrows")) {
            
            var params = getParams(msg.content);
            var charName = getCharacter(msg).get("name");
            
            var thisButtonStyle = buttonStyle + "font-size: 8pt; width: 60px;'"; 

            sendChat(msg.who, "/w " + msg.who + " <div style='" + boxStyle + "'>" +
                "<b>"+ charName + "'s Saving&nbsp;Throws</b><br/>" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|strength_save'> Strength </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|dexterity_save'> Dexterity </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|constitution_save'> Constitution </a><br />" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|intelligence_save'> Intelligence </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|wisdom_save'> Wisdom </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|charisma_save'> Charisma </a> " +
                "</span></div></div></div>");
        }
        
        if (msg.content.startsWith("!AbilityChecks")) {
            
            var params = getParams(msg.content);
            var charName = getCharacter(msg).get("name");
            
            var thisButtonStyle = buttonStyle + "font-size: 8pt; width: 60px;"; 

            sendChat(msg.who, "/w " + msg.who + " <div style='" + boxStyle + "'>" +
                "<b>"+ charName + "'s Ability&nbsp;Checks </b><br/>" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|strength'> Strength </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|dexterity'> Dexterity </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|constitution'> Constitution </a><br />" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|intelligence'> Intelligence </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|wisdom'> Wisdom </a> | " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|charisma'> Charisma </a> " +
                "</span></div></div></div>");
        }
        
        if (msg.content.startsWith("!SkillChecks")) {
            
            var params = getParams(msg.content);
            var charName = getCharacter(msg).get("name");
            
            var thisButtonStyle = buttonStyle + "font-size: 8pt; width: 65px;"; 
            
            sendChat(msg.who, "/w " + msg.who + " <div style='" + boxStyle + "'>" +
                "<b>"+ charName + "'s Skill&nbsp;Checks</b><br/>" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|acrobatics'> Acrobatics </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|animal_handling'> Animal H. </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|arcana'> Arcana </a> <br />  " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|athletics'> Athletics </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|deception'> Deception </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|history'> History </a> <br />" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|insight'> Insight </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|intimidation'> Intimidation </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|investigation'> Investigation </a> <br /> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|medicine'> Medicine </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|nature'> Nature </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|perception'> Perception </a> <br />" +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|performance'> Performance </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|persuasion'> Persuasion </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|religion'> Religion </a> <br />  " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|sleight_of_hand'> Sleight/Hand </a>  " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|stealth'> Stealth </a> " +
                "<a style='" + thisButtonStyle + "' href='~"+ charName +"|survival'> Survival </a> <br />" +                
                "</span></div></div></div>");
        }
    }
});