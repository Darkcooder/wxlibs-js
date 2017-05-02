function Icon($paerent, $image, $action, $attrChar)
{
    this.link=$paerent.newel("a").attr({href: "JavaScript: "+$action+"("+$attrChar+")"});
    this.img=link.newel("img").attr({src: "/images/"+$image+"_16.png"});
    return this;
}