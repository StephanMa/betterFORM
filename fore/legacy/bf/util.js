/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */

require(['dojo/_base/declare',"dojo/dom-class","dojo/dom-attr","dojo/_base/json"],
    function(declare,domClass,domAttr,json){
        declare("bf.util", null, {

        });

        // TODO: Lars: function is never called, remove?
        bf.util.showAtWidget = function(widgetId) {
            //    var widget = dom.byId(widgetId + '-value');
            var widget = query("*[widgetId='" + widgetId + "-value']");
            // console.debug("showWidget:", widget);
            //var widget = dom.byId(widgetId + '-value');


            /* Wipe In Version */
        /*
            var position = dojo.coords(widget[0], true);
            console.debug("pos:", dojo.coords(widget[0], false));
            console.debug("abs: ", dojo._abs(widget[0],true));
            console.debug("abs: ", dojo._abs(widget[0],false));
            var help = dom.byId(widgetId + "-helptext");
            //help.style.left = position.x + 'px';
            var height = position.y + (2 * position.h);
            console.debug("Height: " + height);
            help.style.top = height;
            dojo.fx.wipeIn({node:help,duration:300}).play();
        */
        };

        // TODO: Lars: function 'getContainerByClass' is never called, remove?
/*
        bf.util.getContainerByClass = function(n, cssString ){
            var node = n;
            var cssClass = cssString;
            require(["dojo/_base/window"], function(win){
                var body = win.body();
                while(node && node != body && !domClass.contains(node, cssClass)) {
                    node = node.parentNode;
                }
                if(domClass.contains(node, cssClass)){
                    return node;
                }
                return null;

            })
        };
*/


        /**
         * Function to replace one CSS Class with another on a given node
         *
         * @param element node on which the CSS Class is replaced
         * @param current CSS class to be replaced
         * @param update CSS Class to replace current CSS Class with
         * @return {Boolean} return true if CSS Class was replaced
         */
        bf.util.replaceClass = function (element, current, update) {
            //console.debug("bf.util.replaceClass " + current + " with " +  update + " for Control ", element);
            console.warn("WARNING: bf.util.replaceClass is deprecated, use domClass.replace instead!!");
            if (!element || !element.className) {
                return false;
            }

            var oldClassName = element.className;

            // surround all strings with spaces to guarantee non-ambigous lookups
            var classList = " " + oldClassName + " ";
            var classCurrent = " " + current + " ";
            var classUpdate = " " + update + " ";

            if (classList.indexOf(classUpdate) == -1) {
                var newClassName = classList.replace(new RegExp(classCurrent), classUpdate);
                if (newClassName.indexOf(classUpdate) == -1) {
                    // ensure the new class name, even if no replacement happened
                    newClassName = classList + update + " ";
                }

                // remove leading and trailing spaces and update the element's class name
                newClassName = newClassName.slice(1, newClassName.length - 1);
                element.className = newClassName;

                return true;
            }

            return false;
        };
        bf.util.setDefaultClasses = function (element) {
            if(!domClass.contains(element,"xfEnabled") && !domClass.contains(element,"xfDisabled")){
                domClass.add(element,"xfEnabled");
            }
            if(!domClass.contains(element,"xfOptional") && !domClass.contains(element,"xfRequired")){
                domClass.add(element,"xfOptional");
            }
            if(!domClass.contains(element,"xfReadWrite") && !domClass.contains(element,"xfReadOnly")){
                domClass.add(element,"xfReadWrite");
            }
            if(!domClass.contains(element,"xfValid") && !domClass.contains(element,"xfInvalid")){
                domClass.add(element,"xfValid");
            }
        };


        /**
         *
         * @param element
         * @param styleToRemove
         * @return {Boolean}
         */
        // TODO: Lars: function 'removeStyle' is never called, remove?

        bf.util.removeStyle = function(element,styleToRemove) {
            if(element == undefined || styleToRemove == undefined) {
                return false;
            }
            var style = domAttr.get(element, "style");
            // console.debug("deleting style: " + styleToRemove + " for stlye: "+ style);
            if(style != undefined && style.indexOf(styleToRemove)!= -1){
                // console.debug("deleting style: " + styleToRemove + " for stlye: "+ style);
                style.replace(styleToRemove,"");
                domAttr.set(element, "style", style);
                return true;
            }
            return false;
        };

        bf.util.removeNamespace = function(value){
                var nonNamespacedValue = value;
                if(nonNamespacedValue != undefined && nonNamespacedValue != "" && nonNamespacedValue.indexOf(":") != -1) {
                    nonNamespacedValue = nonNamespacedValue.substring(nonNamespacedValue.indexOf(":")+1,nonNamespacedValue.length);
                }
                return nonNamespacedValue;
        };

        bf.util.getXfId = function(/*Node*/n){
                var tmp = n.id.substring(0,n.id.lastIndexOf("-"));
                // console.debug("returning xfId: ",tmp);
                return tmp;
        };

        bf.util.toggleDebug = function(){
            require(["dojo/dom","dojo/dom-style","dojo/_base/connect","dojo/_base/fx"],function(dom,domStyle,connect,fx){
                var debugpane = dom.byId("bfDebug");
                if(domClass.contains(debugpane,"open")){
                    var closeAnim = fx.animateProperty({
                        node:debugpane,
                        properties: {
                            width:{start:100,end:0,unit:"%"},
                            opacity:{start:1.0, end:0}
                        }
                    });
                    connect.connect(closeAnim, "onEnd", function(node){
                        domStyle.set(node,"opacity", 0);
                        domStyle.set(node,"display", "none");
                    });
                    closeAnim.play();
                    domClass.remove(debugpane,"open");
                    domClass.add(debugpane,"closed");

                }else{
                    domStyle.set(debugpane,"display", "block");
                    var openAnim = fx.animateProperty({
                        node:debugpane,
                        properties: {
                            width:{start:0,end:100,units:"%"},
                            opacity:{start:0, end:1.0}
                        }
                    });
                    connect.connect(openAnim, "onEnd", function(node){
                        domStyle.set(node,"opacity", 1.0);

                    });
                    openAnim.play();
                    domClass.remove(debugpane,"closed");
                    domClass.add(debugpane,"open");
                }

            });
        };

        bf.util.parseDataAttribute = function(node, dataAttributeName){
            // console.debug("bf.util.parseDataAttribute: node:",node, " dataAttributeName:",dataAttributeName);
            var result = {};
            var dataAttrString = domAttr.get(node,dataAttributeName);
            // console.debug("dataAttrString: ",dataAttrString);
            if(dataAttrString && dataAttrString != ""){
                result =  json.fromJson("{" + dataAttrString +  "}");
            }
            return result;
        }
    }
);