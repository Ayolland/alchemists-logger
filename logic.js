function testPotion(){
  ingredient1 = selectorValue($("#test_potion__ingredient1")[0]);
  ingredient2 = selectorValue($("#test_potion__ingredient2")[0]);
  result = selectorValue($("#test_potion__result")[0]);
  console.log(ingredient1,ingredient2,result);
  markResult(ingredient1,ingredient2,result);
};

function sellPotion(){
  
};

function debunkProof(){
  
};

function selectorValue(selectTag){
  var a = selectTag.options[selectTag.selectedIndex].value;
  if ((a == "Ingredient") || (a == "Result") || (a == "Target")){
    a = null
  };
  return a
};

function markResult(ingredient1,ingredient2,result){
  var targetBubble = $("." + ingredient1).filter("." + ingredient2);
  var polarity = result.slice(-4)
  if (polarity == "tral") {
    polarity = "&#x20E0;"
  } else if (polarity == "inus"){
    polarity = "&#8211";
  } else if (polarity == "plus"){
    polarity = "+";
  };
  targetBubble.addClass("potion-" + result);
  targetBubble[0].innerHTML = polarity;
};

function notPol(ingredient,colorPolarity){
  var opposites = {"redplus":"redminus", "greenplus":"greenminus","blueplus":"blueminus"};
  var $boxes = $("." + ingredient).filter("." + opposites[colorPolarity]);
  $boxes.each(function(i){
    if (!($(this).hasClass("false"))) {$(this).addClass("false")}
  })
}