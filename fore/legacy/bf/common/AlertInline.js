/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */
define(["dojo/_base/declare","bf/common/Alert","dojo/dom","dojo/dom-style","dojo/_base/lang"],
    function(declare, Alert,dom,domStyle,lang){
    return declare(Alert, {

        // @Override
        _show:function(id, commonChild) {
//            this.inherited(arguments);
            //console.debug("InlineAlert._show [id:'",id,"' commonChild:'", commonChild,"']");
            var commonChildNode = dom.byId(id + '-' + commonChild);
            if(commonChildNode == undefined || commonChild == this.info) {
                return;
            }
            this._render(id, commonChild,"inline-block");
        },


        // @Override
        _hide:function(id, commonChild) {
            // console.debug("InlineAlert._hide [id:'",id,"' commonChild:'", commonChild,"']");
            var commonChildNode = dom.byId(id + '-' + commonChild);
            if(commonChildNode == undefined || commonChild == this.info) {
                return;
            }
            this._render(id, commonChild,"none");

        },

        _render:function(id, commonChild, show) {
            // console.debug("InlineAlert._render [id:'",id,"' commonChild:'", commonChild," ' show:'",show, "']");
            //todo: jt: searching the node again seems unnecessary as it's already accessed from caller ('_show')
            var mip = dom.byId(id + "-" + commonChild);
            if (mip != undefined && mip.innerHTML != '') {
                // add onclick handler to alerts to close them by mouse click
                if(commonChild == "alert" && show=="inline") {
                    domStyle.set(mip, "cursor", "pointer");
/*
                    mip.onclick = lang.hitch(this, function(evt) {
                        // console.debug("Alert clicked id: ", id, " commonChild: ", commonChild, " show: " , show);
                        this._hide(id,commonChild);
                       // this._show(id,"hint");
                    });
*/
                }
                domStyle.set(mip, "display", show);
//                document.getElementById(id + "-value").focus();
            } else {
                console.info(id + "-" + commonChild + " is not defined for Control " + id);
            }
        }

    });
});
