document.addEventListener("DOMContentLoaded", function() {
	const arr = document.querySelectorAll('.lazy')
	arr.forEach((v) => {
		io.observe(v);
	})
	const arrBg = document.querySelectorAll('.lazy_bg')
	arrBg.forEach((v) => {
		bo.observe(v);
	})
})

const formSearch = document.getElementById('js-search-form');
const menuButton = document.getElementById('js-menu-toggle');
const menumbButton = document.getElementById('js-menu-toggle-mobile');
const menucloseButton = document.getElementById('js-menu-toggle-1');
const menuBar = document.getElementById('menubar');
const loginButton = document.getElementById('js-login-toggle');
const cusButton = document.getElementById('js-cus-toggle');
const m_login = document.getElementById('m_login');
const colLeft = document.getElementById('col-left');
const searchBlock = document.getElementById('search-block');
const bodyOverlay = document.getElementById('body_overlay');
const aSearch = document.getElementById('but-search');
const throttle=(c,d)=>{let e;return function(){const f=arguments;const g=this;if(!e){c['apply'](g,f);e=!![];setTimeout(()=>e=![],d);}};};

const menu = document.getElementById('menu');

/**/
if (formSearch){
	formSearch.addEventListener('focusin', (event) => {
		event.target.parentNode.classList.add('active');
	});
	formSearch.addEventListener('focusout', (event) => {
		window.setTimeout(function() { 
			event.target.parentNode.classList.remove('active');
		}, 200);
	});
}

if (menuButton && colLeft){
	menuButton.addEventListener('click', (event) => {
		colLeft.classList.toggle("active");
		bodyOverlay.classList.toggle("d-none")
	})
}
if (menumbButton && colLeft){
	menumbButton.addEventListener('click', (event) => {
		colLeft.classList.toggle("active");
		bodyOverlay.classList.toggle("d-none")
	})
}
if (loginButton){
	loginButton.addEventListener('click', (event) => {
		m_login.classList.toggle("active");
		colLeft.classList.remove("active");
		formSearch.classList.remove("open");
		bodyOverlay.classList.add("d-none");
		document.querySelector('body').classList.remove('modal-open');
	})
}
if (cusButton){
	cusButton.addEventListener('click', (event) => {
		m_login.classList.toggle("active");

	})
}
menucloseButton.addEventListener('click', function(e){
	colLeft.classList.remove("active");
	bodyOverlay.classList.add("d-none");
})

aSearch.addEventListener('click', function(e){	
	bodyOverlay.classList.remove("d-none");
	menuBar.classList.add("fix-top");
	searchBlock.classList.toggle("fix");

})
bodyOverlay.addEventListener('click', function(e){
	bodyOverlay.classList.add("d-none");
	colLeft.classList.remove("active");
	searchBlock.classList.remove("fix");
	menuBar.classList.remove("fix-top");
})

if( menu ){
	menu.addEventListener('click', event => {

		if (event.target.className.includes('js-submenu')) {
			event.target.parentNode.classList.toggle('open');
			event.target.parentNode.classList.toggle('cls')
		}
	})
}

window.addEventListener('resize', throttle( function(){
	let vW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if(vW > 991){
		bodyOverlay.classList.add("d-none");
		colLeft.classList.remove("active");
	}
}, 200));

function getViewUrl(keyword, view){
	return fetch(`https://${window.location.hostname}/search?type=product&q=${keyword}&view=${view}`).then(res => res.json()).catch(err => console.error(err))
}

document.querySelector('#js-search-form input[type="text"]').addEventListener('keyup', throttle(async function(e){
																			  let resultData = '';
																			  if (e.target.value.trim() != '') {
	let data = await getViewUrl(e.target.value.trim(), 'json');
	for (item in data) {
		resultData += `<a href="${data[item].url}" title="${data[item].title}" class="d-flex align-items-center w-100 mb-1 mt-1 result-item"><div class="result-item_image p-1"><img alt="${data[item].title}" src="${data[item].thumbnail}" class="img-fluid"></div><div class=" text-left result-item_detail pl-5 pr-2"><h4 class="result-item_name mb-1">${data[item].title}</h4><div class="result-item_price">${data[item].price}<del class="ml-1 ${data[item].compare_at_price === '0' ? 'd-none' : ''}">${data[item].compare_at_price}</del></div></div></a>`
	}
	document.getElementById('searchResult').innerHTML = resultData;
} else {
	document.getElementById('searchResult').innerHTML = '';
}
}, 200));

function checkphone(phone) {
	var pattern = /((09|03|07|08|05|296|254|209|204|291|222|275|256|274|271|252|290|292|206|236|262|261|215|251|277|269|219|226|24|239|220|225|293|28|218|221|258|297|260|213|263|205|214|272|228|238|229|259|210|257|232|235|255|203|233|299|212|276|227|208|237|234|273|294|207|270|211|216)+([0-9]{8})\b)/g;
	if(phone.match(pattern)){return true;}else {return false}
}
const mewForm = document.getElementById('book-form');

if (mewForm){
	mewForm.querySelector('button[type=submit]').addEventListener("click", function(event) {
		event.preventDefault();
		if(!mewForm.reportValidity()) return;
		if(checkphone(mewForm.querySelector('.contact-phone').value)) {}
		else {
			alert('Số điện thoại của bạn chưa hợp lệ. Hãy nhập lại số điện thoại chính xác');
			return false;
		}
		let button = this,
			thankYouMessage = mewForm.querySelector(".success");
		button.disabled = true;
		button.innerText = 'Đang gửi...'

		sheetRequest(mewForm, mewForm.action).then(function (posts) {
			console.log('Success!', posts.status);
			thankYouMessage.classList.remove('d-none');
			setTimeout(function(){
				thankYouMessage.classList.add('d-none');
				button.innerText = 'Gửi liên hệ'
				button.disabled = false;
			}, 2000);
		}).catch(function (error) {
			button.innerText = 'Gửi liên hệ'
			alert("Đã có lỗi xảy ra!");
		});
	})
}


var goTopBtn = document.querySelector('.back_top');

function trackScroll() {
	var scrolled = window.pageYOffset;
	var coords = document.documentElement.clientHeight/3;

	if (scrolled > coords) {
		goTopBtn.classList.add('back_show');
	}
	if (scrolled < coords) {
		goTopBtn.classList.remove('back_show');
	}
}
window.addEventListener('scroll', trackScroll);

function scrollToTop (duration) {
	// cancel if already on top
	if (document.scrollingElement.scrollTop === 0) return;

	const cosParameter = document.scrollingElement.scrollTop / 2;
	let scrollCount = 0, oldTimestamp = null;

	function step (newTimestamp) {
		if (oldTimestamp !== null) {
			// if duration is 0 scrollCount will be Infinity
			scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
			if (scrollCount >= Math.PI) return document.scrollingElement.scrollTop = 0;
			document.scrollingElement.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount);
		}
		oldTimestamp = newTimestamp;
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);
}