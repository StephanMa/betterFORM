/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */
require(['dojo/_base/declare',"dojo/dom-style","dojo/dom-attr","dojo/query"],
    function(declare,domStyle,domAttr,query){
        declare("bf.devtool", null, {
            // nothing do to here since the class only has "static" functions
        });

        bf.devtool.inprogress=false;

        bf.devtool.toggleLog = function(){
            require(["dojo/dom","dojo/dnd/Moveable"],function(dom,Moveable){
                var dnd = new Moveable(dom.byId("evtLogContainer"));
                var evtContainer = dom.byId("evtLogContainer");
                var logStyle = domAttr.get(evtContainer,"style");
                if(logStyle.length != 0 ){
                    domAttr.set(evtContainer,"style","");
                }else{
                    domAttr.set(evtContainer,"style","width:26px;height:26px;overflow:hidden;");
                }
            })
        };

        bf.devtool.clearLog=function(){
            query("#eventLog li").forEach(function(node){
                dojo.destroy(node);
            });
        };

        bf.devtool.reveal=function(n){
            var node = n;
            require(["dojo/dom"],function(dom){
                var id = node.innerHTML;
                var tNode = dom.byId(id);
                if(tNode !=undefined && bf.devtool.inprogress==false){
                    var currPadding = domStyle.get(tNode,"padding");
                    console.debug("padding >>> ", currPadding);
                    require(["dojox/fx"],function(fx) {
                        fx.highlight({
                            node:tNode,
                            color:'#0066FF',
                            duration:1000,
                            onBegin:function(){
                                domStyle.set(tNode,"padding","10px");
                                bf.devtool.inprogress=true;
                            },
                            onEnd:function(){
                                domStyle.set(tNode,"padding",currPadding);
                                bf.devtool.inprogress=false;
                            }
                        }).play();
                    })
                }

            });
        };

        bf.devtool.toggleEntry=function(node){
            var entry = query(".eventLogTable",node.parentNode)[0];
            var entryStyle = domAttr.get(entry,"style");
            if(entryStyle == undefined || entryStyle.length == 0 ){
                domStyle.set(entry,"display","none");
            }else{
                domStyle.set(entry,"display","");
            }
        };
});

