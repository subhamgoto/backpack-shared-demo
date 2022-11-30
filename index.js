/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Backpack demo initialization.
 */

var currentID = 1;
var workspaces = [];
var backpacks = [];
var previous_x = null;
let contents;
 $(document).ready(function(){
	 $("#add").click(function(){
		var x = "workspaceDiv"+currentID.toString(); 
		$("#all_workspaces").append(`<div id="${x}" style="height: 480px; width: 1000px;"></div>`);
		$("#workspaces").append(`<option value="${x}">${x}</option>`)
		var current_workspace = Blockly.inject(x,{
			media: 'https://unpkg.com/blockly/media/',
			toolbox: document.getElementById('toolbox'),
			trashcan: true,
		  });
		 
		 var cBackpack = new NotificationBackpack(current_workspace);
		 cBackpack.init();
		 backpacks.push(cBackpack);
		 if(contents){
			cBackpack.setContentsAndNotify(contents);
		 }
		 
		 current_workspace.addChangeListener(updateBackpack);
		 workspaces.push(current_workspace);
		 $("#"+x).hide();
		 currentID = currentID + 1;
	 });
	 
	 $("#workspaces").change(()=>{
		 if(previous_x){
			$("#"+previous_x).hide();
		 }
		 var x = $("#workspaces").val();
		 if(x != "Select"){
			$("#"+x).show();
			previous_x = x;
		}
	})
	 
 });

  
  function updateBackpack(event) {
    if (event.type !== 'backpack_change') {
      return;
    }
    Blockly.Events.disable();
    let targetBackpack;
	let cId = 0;
	for(var i=0; i<workspaces.length; i++){
		if (workspaces[i].id === event.workspaceId) {
			targetBackpack = workspaces[i];
			contents = backpacks[i].getContents();
			cId = i;
			break;
		}
	}
	for(var i=0; i<workspaces.length; i++){
		if(i!=cId){
			backpacks[i].setContentsAndNotify(contents);
		}
	}
    
    Blockly.Events.enable();
  }
  
	
   Blockly.Blocks['custom_procedures'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput('TOPROW')
        .appendField(this.id, 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle('procedure_blocks');
    // Tooltip is set in renameProcedure.
    this.setHelpUrl(Blockly.Msg['PROCEDURES_CALLNORETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousEnabledState_ = true;
  },

  
  getProcedureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this {Blockly.Block}
   */
  renameProcedure: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
      this.setFieldValue(newName, 'NAME');
      var baseMsg = this.outputConnection ?
          Blockly.Msg['PROCEDURES_CALLRETURN_TOOLTIP'] :
          Blockly.Msg['PROCEDURES_CALLNORETURN_TOOLTIP'];
      this.setTooltip(baseMsg.replace('%1', newName));
    }
  },
 
  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('name', this.getProcedureCall());
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = Blockly.utils.xml.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.renameProcedure(this.getProcedureCall(), name);
    var args = [];
    var paramIds = [];
    for (var i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        args.push(childNode.getAttribute('name'));
        paramIds.push(childNode.getAttribute('paramId'));
      }
    }
   
  },
 
  getVarModels: function() {
    return this.argumentVarModels_;
  },
  

  defType_: 'procedures_defnoreturn'
};



