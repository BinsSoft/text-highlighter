/*! TextSelector 1.0.0
 */

/**
 * @summary     TextSelector
 * @description Highlight selected text and exoprt 
 * @version     1.0.0
 * @file        text-highlighter.js
 * @author      Tonmoy Nandy
 * @copyright   Copyright 2018 Tonmoy Nandy.
 *
 * This source file is free software
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */
class TextSelector {
	
	constructor(options) {
		this.options = options;
		this.selector =  $(this.options.selector);
		this.renderSelectorBody();
		if(this.options.items != undefined) {
			this.renderSelectorIcon();
		}
		this.selectedItems = [];
	}
	renderSelectorBody()
	{
		this.selector.addClass('text-highlighter');
		let content = this.selector.html().trim();
		this.selector.empty();
		$("<div/>")
		.addClass('select-body')
		.html(content)
		.bind('mouseup',{obj:this,currentStyle: this.currentStyle}, this.highlighted)
		.appendTo(this.selector)
	}
	renderSelectorIcon() {
		const header = $("<div/>")
					.addClass('select-header')
					.prependTo(this.selector);
		const topHeader = $("<div/>")
						.addClass('select-header-top')
						.appendTo(header);
		const topHeaderLeft = $("<div/>")
						.addClass('select-header-top-left')
						.bind('click',{obj:this},this.toggleIconList)
						.appendTo(topHeader);
		const topHeaderRight = $("<div/>")
						.addClass('select-header-top-right')
						.appendTo(topHeader);
		this.randerButtons(topHeaderRight);
		
		
		const buttomHeader = $("<div/>")
							.addClass('select-header-buttom')
							.appendTo(header);
		var group = '';
		for(let i in this.options.items) {
			let item = this.options.items[i];
			if (item.group != undefined ) {
				if ($(buttomHeader).find('.'+item.group).length == 0){
					group = $("<div/>")
								.addClass(item.group)
								.addClass('header-group')
								.appendTo(buttomHeader);
				} else {
					group = $(buttomHeader).find('.'+item.group);
				}
			} else {
				group = buttomHeader;
			}
			let l = $("<label />")
					.bind('click',{obj:this},this.setColor)
					.appendTo(group);
			$("<span/>")
				.addClass(i)
				.attr('data-selector', i)
				.css({ 'background-color':item.color })
				.appendTo(l);
			l.append(i);
		}
		header.find('label').first().trigger('click');
	}
	randerButtons(topHeaderRight)
	{
		const exportBtn  = $("<button/>")
							.addClass('btn')
							.addClass('btn-export')
							.text('Export')
							.bind('click',{obj:this},this.exportItems)
							.appendTo(topHeaderRight)
		const resetBtn  = $("<button/>")
							.addClass('btn')
							.addClass('btn-reset')
							.text('Reset')
							.bind('click',{obj:this},this.reset)
							.appendTo(topHeaderRight)
	}
	toggleIconList(event) {
		$(event.target).toggleClass('hide-icon');
		var classObj = event.data.obj;
		classObj.selector.find('.select-header').find('.select-header-buttom').slideToggle('slow');
	}
	setColor(event){
		var classObj = event.data.obj;
		classObj.selector.find('.select-header-buttom').find('label').removeClass('active');
		var activeElement;
		if ($(event.target).prop("tagName") == 'SPAN') {
			activeElement =  $(event.target).parent();
		} else { 
			activeElement = $(event.target);
		}
		activeElement.addClass('active');
		classObj.selector.find('.select-header-top-left').html(activeElement.clone());
		classObj.selector.find('.select-header-top-left').trigger('click');
	}
	removeStyle(event) {
		var classObj = event.data.obj;
		var wrap = $(event.target).parent();
		var text = wrap.text().trim();
		wrap.replaceWith(text);
		classObj.getSelectedItems(classObj);
	}


	
	splitNode(obj, node,  limit) {
	  var parentHtml = node.outerHTML.trim();
	  var childHtml = limit.outerHTML.trim();
	  var leftPart = parentHtml.substr(0, parentHtml.indexOf(childHtml));
	  var rightPart = parentHtml.substr(leftPart.length+childHtml.length, parentHtml.length);
	  var wrapHtml = leftPart+'<i class="cross cross-icon" ></i></span>';
	  wrapHtml += childHtml;
	  wrapHtml += '<span style="'+$(node).attr('style')+'" class="'+$(node).attr('class')+'">';
	  wrapHtml += rightPart;
	  $(node).replaceWith($(wrapHtml));
	  $(obj.selector).find('i.cross').bind('click',{obj:obj}, obj.removeStyle);
	}
	getSelectedItems(obj){
		obj.selectedItems = [];
		obj.selector.find('.select-body').find('span').each(function(index,item){
			obj.selectedItems.push({
				text : $(item).text(),
				item : $(item).attr('class')
			})
		})
	}
	highlighted(event) {
		var obj = event.data.obj;
		var sel, range, node;
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            range = window.getSelection().getRangeAt(0);
	            if(range.startOffset != range.endOffset && range.toString().trim()!=''){
	            	var currentColor = obj.selector.find('.select-header-buttom').find('label.active').find('span').attr('style');
	            	var currentClass = obj.selector.find('.select-header-buttom').find('label.active').find('span').attr('data-selector');
	            	const selectedText = range.toString();
    	            var html = `<span style="`+currentColor+`" class="`+currentClass+`" >`
    	            				+range
    	            				+`<i class="cross cross-icon" ></i>`
    	            			+`</span>`;
    	            range.deleteContents();
    	            var el = document.createElement("div");
    	            el.innerHTML = html;
    	            var frag = document.createDocumentFragment(), node, lastNode;
    	            while ( (node = el.firstChild) ) {

    	            	lastNode = frag.appendChild(node);
    	            }
    	            $(lastNode).find('i.cross').bind('click', {obj:obj} ,obj.removeStyle);
    	            range.insertNode(frag);
    	            obj.getSelectedItems(obj)
    	            if($(range.commonAncestorContainer).prop("tagName") == 'SPAN') {
        	            obj.splitNode(obj, range.commonAncestorContainer, range.commonAncestorContainer.firstElementChild);
        	            obj.getSelectedItems(obj)
        	        }
    	        }
	        }
	    } else if (document.selection && document.selection.createRange) {
	        range = document.selection.createRange();
	        range.collapse(false);
	        range.pasteHTML(html);
	    }
	}

	exportItems(event)
	{
		const classObj = event.data.obj;
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(classObj.selectedItems));
		var link = document.createElement('a');
        document.body.appendChild(link);
		link.setAttribute("href",     dataStr     );
		link.setAttribute("download", "export.json");
		link.click();
	}
	getAllItems()
	{
		return this.selectedItems;
	}
	reset(event)
	{
		const obj =  event.data.obj;
		obj.selector.find('.select-body').find('span').each(function(index,item){
			var wrap = $(item);
			var text = wrap.text().trim();
			wrap.replaceWith(text);
		})
	}
	setItem(items) {
		this.options.items = items;
		this.renderSelectorIcon();
	}


}