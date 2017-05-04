var AutoDamage_verson = "0.0.2";
var AutoDamage_target = "";

on("chat:message", function(msg) {
    //!setTarget @{target|token_id}
    if (msg.type == "api") {
        if (msg.content.startsWith("!setTarget")) {
            AutoDamage_target = msg.content.split(" ")[1].trim();
        } else if (msg.content.startsWith("!clearTarget")) {
            AutoDamage_target = "";
        } else if (msg.content.startsWith("!alterSelected") && msg.selected != undefined){
            var amount= msg.content.split("--")[1];
            _.each(msg.selected, function(s) {
                if (s._type == "graphic"){
                    setTimeout(function() {
                        sendChat("", "!alter --target|" + s._id + " --bar|1 --"+ amount);
                    }, 1500);
                }
            });
        }
        return;
    }
    
    if (msg.rolltemplate) {
        if (msg.rolltemplate == "atk" || msg.rolltemplate == "npcatk"){

            if (AutoDamage_target) {
                
                var Target = getObj("graphic", AutoDamage_target);
                var TokenAC = (Target.get("bar2_value")) ? parseInt(Target.get("bar2_value")) : 10;

                var Advantage = (msg.content.search(/{{advantage=\d/) != -1) ? 1 : 0;
                var Normal = (msg.content.search(/{{normal=\d/) != -1) ? 1 : 0;
                var Disadvantage = (msg.content.search(/{{disadvantage=\d/) != -1) ? 1 : 0;
                
                var Atk1 = parseInt(/{{r1=\$\[\[(\d+)/.exec(msg.content)[1]);
                var Atk1Base = (msg.inlinerolls[Atk1].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk1].results.rolls[0].results[0].v) : 0;
                var Atk1Total = (msg.inlinerolls[Atk1].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk1].results.total) : 0;
                var Atk1Crit = (msg.inlinerolls[Atk1].results.rolls[0].mods != null) ? parseInt(msg.inlinerolls[Atk1].results.rolls[0].mods.customCrit[0].point) : 20;
                
                var Atk2 = parseInt(/{{r2=\$\[\[(\d+)/.exec(msg.content)[1]);
                var Atk2Base = (msg.inlinerolls[Atk2].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk2].results.rolls[0].results[0].v) : 0;
                var Atk2Total = (msg.inlinerolls[Atk2].results.rolls[0].dice != 0) ? parseInt(msg.inlinerolls[Atk2].results.total) : 0;
                var Atk2Crit = (msg.inlinerolls[Atk2].results.rolls[0].mods != null) ? parseInt(msg.inlinerolls[Atk2].results.rolls[0].mods.customCrit[0].point) : 20;

                if (Normal === 1 || Advantage === 1 || Disadvantage === 1) {
                    // NORMAL
                    var AtkBase = Atk1Base;
                    var AtkTotal = Atk1Total;
                    var AtkCrit = Atk1Crit;
                
                    // ADVANTAGE
                    if (Advantage === 1 && Atk2Total > Atk1Total) {
                        AtkBase = Atk2Base;
                        AtkTotal = Atk2Total;
                        AtkCrit = Atk2Crit;
                    }
                    
                    // DISADVANTAGE
                    if (Disadvantage === 1 && Atk2Total < Atk1Total) {
                        AtkBase = Atk2Base;
                        AtkTotal = Atk2Total;
                        AtkCrit = Atk2Crit;
                    }
                    
                    // RESOLVE ATTACK ROLLS
                    var resultText="";
                    if (AtkBase === 1) {
                        resultText="Miss!";
                        AutoDamage_target = "";
                    } else if (AtkBase === 20){
                        resultText="Critical Hit!";
                    } else if (AtkTotal >= TokenAC) {
                        if (AtkBase >= AtkCrit) {
                            resultText="Critical Hit!";
                        } else {
                            resultText="Hit!";
                        }
                    } else {
                        resultText="Miss!";
                        AutoDamage_target = "";
                    }

                    sendChat(msg.who, "<div class='sheet-rolltemplate-simple' style='margin-top:-7px;'><div class='sheet-container' style='border-radius: 0px;'><div class='sheet-label' style='margin-top:5px;'><span style='display:block;'>" + resultText + "</span></div></div></div>");
                }
            }
        } else if (msg.rolltemplate == "dmg" || msg.rolltemplate == "npcdmg" ) {
            if (AutoDamage_target) {
                var Damage = 0;
                var Healing =0;
                var TempHP = 0;
                var SneakDamage = 0;
                var Crit1Dmg = 0;
                var Crit2Dmg = 0;
                
                var Dmg1 = parseInt(/{{dmg1=\$\[\[(\d+)/.exec(msg.content)[1]);
                var Dmg2 = parseInt(/{{dmg2=\$\[\[(\d+)/.exec(msg.content)[1]);

                var Dmg1Total = parseInt(msg.inlinerolls[Dmg1].results.total);
                var Dmg2Total = parseInt(msg.inlinerolls[Dmg2].results.total);
 
                var Dmg1Type = (msg.content.search(/{{dmg1type=\w/) != -1) ? /{{dmg1type=([\w ]+)}}/.exec(msg.content)[1].trim() : "";
                var Dmg2Type = (msg.content.search(/{{dmg2type=\w/) != -1) ? /{{dmg2type=([\w ]+)}}/.exec(msg.content)[1].trim() : "";

                if (msg.content.search(/{{hldmg=/) != -1) {
                    var AddHeal =  parseInt(/{{hldmg=\$\[\[(\d+)/.exec(msg.content)[1]);
                    Healing = Healing + parseInt(msg.inlinerolls[AddHeal].results.total);
                }
                
                if (msg.content.search(/{{crit=\d/) != -1) {
                    var Crit1 = parseInt(/{{crit1=\$\[\[(\d+)/.exec(msg.content)[1]);
                    var Crit2 = parseInt(/{{crit2=\$\[\[(\d+)/.exec(msg.content)[1]);
                    Crit1Dmg = parseInt(msg.inlinerolls[Crit1].results.total);
                    Crit2Dmg = parseInt(msg.inlinerolls[Crit2].results.total);
                }


                if (Dmg1Type == "Healing") {
                    Healing = Healing + Dmg1Total + Crit1Dmg;
                } else if (Dmg1Type == "Temp HP") {
                    TempHP = TempHP + Dmg1Total + Crit1Dmg;
                } else if (Dmg1Type == "Sneak Attack") {
                    SneakDamage = SneakDamage + Dmg1Total + Crit1Dmg;
                } else {
                    Damage = Damage + Dmg1Total + Crit1Dmg;
                }

                if (Dmg2Type == "Healing") {
                    Healing = Healing + Dmg2Total + Crit2Dmg;
                } else if (Dmg1Type == "Temp HP") {
                    TempHP = TempHP + Dmg2Total + Crit2Dmg;
                }  else if (Dmg2Type == "Sneak Attack"){
                    SneakDamage = SneakDamage + Dmg2Total + Crit2Dmg;
                } else {
                    Damage = Damage + Dmg2Total + Crit2Dmg;
                }

                if (TempHP > 0 ) {
                    setTimeout(function() {
                        var Target=getObj("graphic", AutoDamage_target);
                        Target.set("bar3_value", TempHP);
                        
                        var TempHPMessage = "" +
                            "<div style='display: block; width: 100%; margin-left: -7px; padding: 2px 0px;'>" +
                                "<div style='position: relative; border: 1px solid #000; border-radius: 5px; background-color: #BF5700; background-image: linear-gradient(rgba(255, 255, 255, .3), rgba(255, 255, 255, 0)); margin-right: -2px; padding: 2px 5px 5px 50px;'>" +
                                    "<div style='position: absolute; top: -10px; left: 5px; height: 40px; width: 40px;'>" + 
                                        "<img src='" + Target.get("imgsrc") + "' style='height: 40px; width: 40px;'></img>" + 
                                    "</div>" +
                                    "<div style='font-family: Candal; font-size: 13px; line-height: 15px; color: #FFF; font-weight: normal; text-align: center; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'>" + 
                                        Target.get("name") + " receives " +  TempHP + " temporary hit points ." + 
                                    "</div>" + 
                                "</div>" +
                            "</div>";
		                sendChat("", "/desc " + TempHPMessage);
                        AutoDamage_target = "";
                   }, 1500);
                    return;
                }
                
                if (SneakDamage > 0) {
                    setTimeout(function() {
                        var buttonStyle = "style='font-size: 9pt; width: 25px; border: 1px solid black; margin: 1px; background-color: #588a9e; border-radius: 4px;  box-shadow: 1px 1px 1px #707070;'";

                        sendChat(msg.who, "<div class='sheet-rolltemplate-simple' style='margin-top:-7px;'><div class='sheet-container' style='border-radius: 0px;'><div class='sheet-label' style='margin-top:5px;'><span style='display:block;'>" +
                        " Include "+ SneakDamage +" points of <br /> Sneak Attack damage? <br />"+ 
                        "<a " + buttonStyle + " href='!alter --target|" + AutoDamage_target + " --bar|1 --amount|-" + (Damage+SneakDamage) +"'> Yes </a> | " +
                        "<a " + buttonStyle + " href='!alter --target|" + AutoDamage_target + " --bar|1 --amount|-" + Damage +"'> No </a></span></div></div></div>");
                        AutoDamage_target = "";
                    }, 1500); 
                    return;
                }
                
                if (Damage > 0) {
                    setTimeout(function() {
                        sendChat("", "!alter --target|" + AutoDamage_target + " --bar|1 --amount|-" + Damage);
                        AutoDamage_target = "";
                    }, 1500);
                    return;
                }
                
                if (Healing > 0 ) {
                    setTimeout(function() {
                        sendChat("", "!alter --target|" + AutoDamage_target + " --bar|1 --amount|+" + Healing);
                        AutoDamage_target = "";
                   }, 1500);
                    return;
                }
                
            }
        } 
    }
});
