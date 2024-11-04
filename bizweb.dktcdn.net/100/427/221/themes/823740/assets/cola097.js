var selectedSortby;
var selectedViewData = "data";
var filter = new Bizweb.SearchFilter();
let selectedFilterWarp = $(".filter-container__selected-filter"),
	filterInput = $(".filter-container input[type=checkbox]");
if(colId > 0){
	filter.addValue("collection", "collections", colId, "AND");
}
function toggleFilter(e) {
	_toggleFilter(e);
	renderFilterdItems();
	doSearch(1);
}
function _toggleFilterdqdt(e) {
	var $element = $(e);
	var group = 'Khoảng giá';
	var field = 'price_min';
	var operator = 'OR';	 
	var value = $element.attr("data-value");	
	filter.deleteValuedqdt(group, field, value, operator);
	filter.addValue(group, field, value, operator);

	renderFilterdItems();
	doSearch(1);
}

function _toggleFilter(e) {
	var $element = $(e);
	var group = $element.attr("data-group");
	var field = $element.attr("data-field");
	var text = $element.attr("data-text");
	var value = $element.attr("value");
	var operator = $element.attr("data-operator");
	var filterItemId = $element.attr("id");

	if (!$element.is(':checked')) {
		filter.deleteValue(group, field, value, operator);
	}
	else{
		filter.addValue(group, field, value, operator);
	}
}
function renderFilterdItems() {
	selectedFilterWarp.find('.filter-container__selected-filter-list').html("");

	filterInput.each(function(index) {
		if ($(this).is(':checked')) {
			let id = $(this).attr("id"),
				name = $(this).closest("label").text();
			addFilteredItem(name, id);
		}
	});

	if(filterInput.is(":checked")) selectedFilterWarp.removeClass("d-none");
	else selectedFilterWarp.addClass("d-none");
}
function addFilteredItem(name, id) {
	let filteredItemTemplate = `<li class='filter-container__selected-filter-item d-inline-block pr-1 d-flex align-items-center' for='${id}'><a href='javascript:void(0)' onclick="removeFilteredItem('${id}')"><img src='//bizweb.dktcdn.net/100/427/221/themes/823740/assets/close.png?1627010568610' alt=''> ${name}</a></li>`;
	selectedFilterWarp.find('.filter-container__selected-filter-list').append(filteredItemTemplate);
}
function removeFilteredItem(id) {
	$(".filter-container #" + id).trigger("click");
}
function filterItemInList(object) {
	q = object.val().toLowerCase();
	object.parent().next().find('li').show();
	if (q.length > 0) {
		object.parent().next().find('li').each(function() {
			if ($(this).find('label').attr("data-filter").indexOf(q) == -1)
				$(this).hide();
		})
	}
}

function clearAllFiltered() {
	filter = new Bizweb.SearchFilter();
	if(colId > 0) filter.addValue("collection", "collections", colId, "AND");

	selectedFilterWarp.find('.filter-container__selected-filter-list').html("");
	filterInput.prop('checked', false)
	selectedFilterWarp.addClass("d-none");

	doSearch(1);
}
function doSearch(page, options) {
	if(!options) options = {};
	filter.search({
		view: selectedViewData,
		page: page,
		sortby: selectedSortby,
		success: function (html) {
			let $html = $(html);
			// Muốn thay thẻ DIV nào khi filter thì viết như này
			let $categoryProducts = $($html[0]); 
			$(".category-products").html($categoryProducts.html());
			
			let arrImg = document.querySelector('.category-products').querySelectorAll('.lazy');
			arrImg.forEach((v) => {
				io.observe(v);
			})

			pushCurrentFilterState({sortby: selectedSortby, page: page});

			$('.add_to_cart').click(function(e){
				e.preventDefault();
				var $this = $(this);						   
				var form = $this.parents('form');						   
				$.ajax({
					type: 'POST',
					url: '/cart/add.js',
					async: false,
					data: form.serialize(),
					dataType: 'json',
					error: addToCartFail,
					success: addToCartSuccess,
					cache: false
				});
			});
			$('html, body').animate({
				scrollTop: $('.category-products').offset().top
			}, 0);
			resortby(selectedSortby);
			if (window.BPR !== undefined){
				return window.BPR.initDomEls(), window.BPR.loadBadges();
			}
		}
	});		
}
function sortby(sort) {			 
	switch(sort) {
		case "price-asc":
			selectedSortby = "price_min:asc";					   
			break;
		case "price-desc":
			selectedSortby = "price_min:desc";
			break;
		case "alpha-asc":
			selectedSortby = "name:asc";
			break;
		case "alpha-desc":
			selectedSortby = "name:desc";
			break;
		case "created-desc":
			selectedSortby = "created_on:desc";
			break;
		case "created-asc":
			selectedSortby = "created_on:asc";
			break;
		default:
			selectedSortby = "";
			break;
	}

	doSearch(1);
}
function resortby(sort) {
	switch(sort) {				  
		case "price_min:asc":
			$('.sortby-price-asc').prop("checked", true);
			break;
		case "price_min:desc":
			$('.sortby-price-desc').prop("checked", true);
			break;
		case "name:asc":
			$('.sortby-alpha-asc').prop("checked", true);
			break;
		case "name:desc":
			$('.sortby-alpha-desc').prop("checked", true);
			break;
		case "created_on:desc":
			$('.sortby-created-desc').prop("checked", true);
			break;
		case "created_on:asc":
			$('.sortby-created-asc').prop("checked", true);
			break;
		default:
			//tt = "Thứ tự";
			break;
	}			   
}
function _selectSortby(sort) {			 
	resortby(sort);
	switch(sort) {
		case "price-asc":
			selectedSortby = "price_min:asc";
			break;
		case "price-desc":
			selectedSortby = "price_min:desc";
			break;
		case "alpha-asc":
			selectedSortby = "name:asc";
			break;
		case "alpha-desc":
			selectedSortby = "name:desc";
			break;
		case "created-desc":
			selectedSortby = "created_on:desc";
			break;
		case "created-asc":
			selectedSortby = "created_on:asc";
			break;
		default:
			selectedSortby = sort;
			break;
	}
}
function toggleCheckbox(id) {
	$(id).click();
}
function pushCurrentFilterState(options) {

	if(!options) options = {};
	var url = filter.buildSearchUrl(options);
	var queryString = url.slice(url.indexOf('?'));			  
	if(selectedViewData == 'data_list') { queryString = queryString + '&view=list'	}
	else{ queryString = queryString + '&view=grid'	}

	pushState(queryString);
}

function pushState(url) {
	window.history.pushState({
		turbolinks: true,
		url: url
	}, null, url)
}
/*function switchView(view) {			  
	switch(view) {
		case "list":
			selectedViewData = "data_list";					   
			break;
		default:
			selectedViewData = "data";
			break;
	}			   
	var url = window.location.href;
	var page = getParameter(url, "page");
	if(page != '' && page != null){
		doSearch(page);
	}else{
		doSearch(1);
	}
}*/
function selectFilterByCurrentQuery() {
	var isFilter = false;
	var url = window.location.href;
	var queryString = decodeURI(window.location.search);
	var filters = queryString.match(/\(.*?\)/g);
	var page = 0;
	if(queryString) {
		isFilter = true;
		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}
		page = $.urlParam('page');
	}
	if(filters && filters.length > 0) {
		filters.forEach(function(item) {
			item = item.replace(/\(\(/g, "(");
			var element = $(`.aside-content input[value='${item}']`);
			element.attr("checked", "checked");
			_toggleFilter(element);
		});

		isFilter = true;
	}
	var sortOrder = getParameter(url, "sortby");
	if(sortOrder) {
		_selectSortby(sortOrder);
	}
	if(isFilter) {
		doSearch(page);
		renderFilterdItems();
	}
}
function getParameter(url, name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
$(function() {
	selectFilterByCurrentQuery();
});