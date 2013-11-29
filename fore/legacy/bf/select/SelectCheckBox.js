define(["dojo/_base/declare", "dijit/_Widget","dojo/query","dojo/_base/connect","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom"],
    function(declare, _Widget,query,connect,domAttr,domClass,domConstruct,dom){
        return declare(_Widget, {
            control:null,
            currentValue:null,

            postCreate:function() {
                // console.debug("SelectCheckBox. postCreate id:",this.id);
                var bfHandleStateChanged = connect.subscribe("xforms-item-changed-" + this.id , this, "handleStateChanged");
                fluxProcessor.addSubscriber(this.id, bfHandleStateChanged);
                var bfHandleInsertItem = connect.subscribe("betterform-insert-item-" + this.id , this, "handleInsertItem");
                fluxProcessor.addSubscriber(this.id, bfHandleInsertItem);
                var bfHandleDeleteItem = connect.subscribe("betterform-delete-item-" + this.id , this, "handleDeleteItem");
                fluxProcessor.addSubscriber(this.id, bfHandleDeleteItem);
            },

            _onBlur:function() {
                // console.debug("bf.SelectFull._onBlur arguments:",arguments, " control:",this.xfControl);
                var selectedValue = this._getSelectedValueAsString();
                this.xfControl.sendValue(selectedValue,true);
            },

            handleStateChanged:function(contextInfo){
                // console.debug("SelectCheckBox.handleStateChanged");
                var value = contextInfo.value;
                if(contextInfo.targetName == "label"){
                    dom.byId(contextInfo.parentId+"-label").innerHTML = value;
                }else if(contextInfo.targetName == "value"){
                    var checkBox = dom.byId(contextInfo.parentId+"-value");
                    domAttr.set(checkBox,"value",value);
                    // console.debug("check if value ", value, " is selected: selectedValues: ",this.currentValue);
                    if(this.currentValue.indexOf(value) != -1){
                        checkBox.checked = true;
                    }else {
                        checkBox.checked = false;
                    }
                }else {
                    console.warn("SelectCheckBox.handleStateChanged: no action taken for contextInfo: ",contextInfo);
                }

            },
            /**
             * Create new entry for Select
             * @param contextInfo
             */
            handleInsertItem:function(contextInfo) {
                // console.debug("SelectCheckBox.handleInsert [id: ",this.id, " / contextInfo:",contextInfo,"]");
                // this.currentValue = this._getSelectedValue();
                var currentItemset = dom.byId(contextInfo.targetId);
                // console.debug("SelectCheckBox.handleInsert itemset: ",currentItemset);
                var generatedIds= contextInfo.generatedIds;
                var itemId = generatedIds[contextInfo.prototypeId];

                var itemNode = domConstruct.create("span", {id:itemId}, currentItemset, contextInfo.position);
                domClass.add(itemNode, "xfSelectorItem");
                var valueNode = domConstruct.create("input", {id:itemId+"-value",type:"checkbox",value:contextInfo.value}, itemNode, "first");
                domClass.add(valueNode,"xfCheckBoxValue");
                var labelNode = domConstruct.create("label", {id:itemId+"-label",value:contextInfo.label}, itemNode, "last");
                domClass.add(labelNode, "xfCheckBoxLabel");
            },

            handleDeleteItem:function(contextInfo){
                // console.debug("SelectCheckBox.handleDeleteItem contextInfo:",contextInfo);
                var currentItemset = dom.byId(contextInfo.targetId);
                var itemToRemove = query(".xfSelectorItem", currentItemset)[contextInfo.position-1];
                currentItemset.removeChild(itemToRemove);

            },

            setReadOnly:function(){
                // console.debug("SelectCheckBox.setReadOnly");
                query(".xfCheckBoxValue",this.domNode).forEach(function(item){
                    domAttr.set(item, "disabled","disabled");
                });
            },

            setReadWrite:function(){
                // console.debug("SelectCheckBox.setReadWrite");
                query(".xfCheckBoxValue",this.domNode).forEach(function(item){
                    domAttr.remove(item, "disabled");
                });
            },

            _getSelectedValueAsString:function() {
                var resultString = this._getSelectedValue().join(" ");
                // console.debug("SelectCheckBox._getSelectedValueAsString: ", resultString);
                return resultString;
            },

            _getSelectedValue:function(){
                var selectedValue = new Array();
                query(".xfCheckBoxValue",this.domNode).forEach(function(item){
                    if(item.checked){
                        selectedValue.push(item.value);
                    }
                });
                // console.debug("SelectCheckBox._getSelectedValue value:",selectedValue);
                return selectedValue;
            }
    });
});

