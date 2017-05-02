var _WXDivs=new Array();
var _WXCorrDivs=new Array();
$(window).on('resize', WXResize);
function WXResize(){
    $.each(_WXDivs, function(i, div){
         if(div.set.corr)corr=0-div.set.corr;
         else corr=0;
         $.each(_WXCorrDivs, function(i, cdv){corr-=cdv.outerHeight(true)});
         div.css("height", $(window).height()-(0-corr)+"px");
         div.css("max-height", $(window).height()-corr+"px");
     })
}
function WXDiv(set){
    var div=set.div;
    var corr=0;
    if(set.corr)corr=0-set.corr;
    div.set={corr:0-corr, max:set.max};
    _WXDivs.push(div);
    WXResize();
}
function WXAddCorrDiv(div){
    _WXCorrDivs.push(div);
    div.on('change', WXResize());
}
