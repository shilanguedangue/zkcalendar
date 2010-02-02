/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DaylongOfMonthEvent = zk.$extends(calendar.LongEvent, {
	
	$init: function () {
		this.$supers('$init', arguments);
		this.cloneNodes = [];
	},	
	
	getCornerStyle_: function() {
		return this.contentStyle;
	},
	
	getInnerStyle_: function() {
		return this.innerStyle;
	},
		
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		return scls + ' ' + this.getZclass() + '-daylong-month';
	},
	
	getDays: function() {
		var node = this.$n(),
			ONE_DAY = this.DAYTIME;;			
			
		if (this.cloneCount)
			return (node.startWeek.zoneEd.getTime() - node.upperBoundBd.getTime()) / ONE_DAY;

		return (node.lowerBoundEd.getTime() - node.upperBoundBd.getTime()) / ONE_DAY;
	},
	
	processCloneNode_: function(node) {
		var parent = this.parent,
			weekDates = parent._weekDates,
			ed = node.lowerBoundEd,
			startWeek = node.startWeek,
			cloneCount;
		//calculate over next week
		if (ed > startWeek.zoneEd)
			cloneCount = Math.ceil((ed.getTime() - startWeek.zoneEd.getTime()) / parent.AWEEK);		
		
		this._processCloneNode(weekDates, cloneCount);
		
		node.zoneEd = cloneCount ? startWeek.zoneEd: this.event.zoneEd;
	},
			
	_createCloneNode: function(index) {
		var uuid = this.uuid,
			event = this.event,
			cloneNode = this.$n().cloneNode(true),
			body = jq(cloneNode).children('#' + this.uuid + '-body')[0],
			cnt = body.firstChild.firstChild;			
			
		//change id
		cloneNode.id = uuid + '-sub' + index;
		body.id = uuid + '-sub' + index + '-body';
		cnt.id = uuid + '-sub' + index + '-cnt';
		
		cloneNode.cnt = cnt;
		cloneNode._preOffset = 0;
		cloneNode._afterOffset = 0;
		cloneNode.zoneBd = event.zoneBd;		
		cloneNode.zoneEd = event.zoneEd;
		cloneNode._days = 7;
		
		return cloneNode;
	},
		
	_processCloneNode: function(weekDates, cloneCount) {
		this.cloneNodes = [];
		this.cloneCount = cloneCount;
		if (!cloneCount) return;
			
		var node = this.$n(),
			cnt = jq(this.$n('cnt')),
			startWeekIndex = weekDates.indexOf(node.startWeek) + 1,
			hasLeftArrow = cnt.children('.' + this.left_arrow_icon).length,
			left_arrow = this.left_arrow,
			left_arrowCnt = this.left_arrowCnt;				
		
		//add right arrow if over next week	
		cnt.addClass(this.right_arrow);
		jq(cnt[0].lastChild).before(this.right_arrowCnt);		
		
		//clone node 
		for(var i = 0, j = cloneCount; i < j; i++){
			var cloneNode = this._createCloneNode(i),
				cloneCnt = jq(cloneNode.cnt),
				startWeek = weekDates[startWeekIndex + i];	

			cloneNode.startWeek = startWeek;
			cloneNode.upperBoundBd = startWeek.zoneBd;
			cloneNode.lowerBoundEd = startWeek.zoneEd;
			
			// always has left arrow because clone node always over previous week 
			if (!hasLeftArrow) {					
				cloneCnt.addClass(left_arrow);
				jq(cloneCnt[0].lastChild).before(left_arrowCnt);				
			}
			this.cloneNodes.push(cloneNode);		
		}
		
		this._processLastCloneNode(cloneCount);
		
	},
	
	_processLastCloneNode: function(cloneCount) {
		var cloneNode = this.cloneNodes[cloneCount - 1],
			cloneCnt = jq(cloneNode.cnt),
			lowerBoundEd = this.$n().lowerBoundEd,
			isAfter = this.event.zoneEd > this.parent.zoneEd;
					
		cloneNode.lowerBoundEd = lowerBoundEd;
		
		cloneNode._afterOffset = (cloneNode.startWeek.zoneEd.getTime() - lowerBoundEd.getTime()) / this.DAYTIME;
		cloneNode._days = 7 - cloneNode._afterOffset;
		
		if (!isAfter) {
			cloneCnt.removeClass(this.right_arrow);
			cloneCnt.children('.' + this.right_arrow_icon).remove();
		}
	},
	
	defineClassName_: function() {
		this.$super('defineClassName_', arguments);
		
		var contentColor = this.event.contentColor;
		
		this.innerStyle = contentColor ? ' style="background:' + contentColor + 
		 			';border-left-color:' + contentColor + 
					';border-right-color:' + contentColor + '"': '';
	},
	
	defineCss_: function() {	
		this.$super('defineCss_', arguments);
		
		var contentColor = this.event.contentColor;
		
		this.innerStyle = contentColor ? 'background:' + contentColor + 
		 			';border-left-color:' + contentColor + 
					';border-right-color:' + contentColor: '';
	},
	
	updateContentStyle_: function(contentStyle) {
		var node = jq(this.$n());
	
		jq(node.children('.' + this.t2)[0].firstChild).attr('style',contentStyle);	
		jq(node.children('.' + this.b2)[0].firstChild).attr('style',contentStyle);	
	}
});