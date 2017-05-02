function igView(type, paerent, data){
    var types={
        GMap: GMap
    };
    return new types[type](paerent, data);
}