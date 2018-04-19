# Multi Image Upload 

Text Highlighter

## Installation

add 	`jquery.js`, 
		`text-highlighter.min.js` or `text-highlighter.js`

and for styling `text-highlighter.min.css` or `text-highlighter.css`


## Usage

### HTML


	<div id="highlighter">
	.... content ...
	</div>


### Javascript 
	const selector = new TextSelector({
		selector : '#highlighter',
		items : {
			'Green' : { 'color' : "#14c917" },
			'Red' : { 'color' : "#ff0000" },
			'Blue' : { 'color' : "#225fe2" },
			...
		}
	});

## Description of options
	`get all selected items` 	: selector.getAllItems()

	`set Color Codes` 			: selector.setItem({
										'Green' : { 'color' : "#14c917" },
										'Red' : { 'color' : "#ff0000" },
										'Blue' : { 'color' : "#225fe2" },
										...
									});
	
	`reset`						: selector.reset()








