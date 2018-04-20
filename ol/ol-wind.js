var map = new ol.CanvasMap({
    view: new ol.View({
        center: ol.proj.transform([114,30], 'EPSG:4326', 'EPSG:3857'),
        projection:'EPSG:3857',
        zoom: 4,
        minZoom:3,
        maxZoom:17
    }),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    target: 'map'
});

var windy;
//创建canvas
var canvas = document.createElement('canvas');
canvas.id = "canvas";
canvas.width = map.getSize()[0];
canvas.height = map.getSize()[1];
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
map.getViewport().appendChild(canvas);
map.getView().on('propertychange',function(){
    windy.stop();
    canvas.style.display='none';
});
map.on("moveend",function(){
    drawWind();
});
//获取数据
var xhr=new XMLHttpRequest();
xhr.open('get','../data/gfs.json');
xhr.send();
xhr.onreadystatechange=function () {
    if(xhr.readyState==4&&xhr.status==200){
        var result=JSON.parse(xhr.responseText);
        windy = new Windy({canvas: canvas, data: result });
        drawWind();
    }
};
function drawWind() {
    canvas.style.display='block';
    if(!windy) {
        return;
    }
    windy.stop();
    var mapsize = map.getSize();
    var extent = map.getView().calculateExtent(mapsize);
    extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

    canvas.width = mapsize[0];
    canvas.height = mapsize[1];

    windy.start(
        [[0,0], [canvas.width, canvas.height]],
        canvas.width,
        canvas.height,
        [[extent[0], extent[1]],[extent[2], extent[3]]]
    );
}