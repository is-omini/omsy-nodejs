const subButtonMenu = document.querySelector('#bubul-button')

let activeSubmenu = ''
const loadSubmenu = (button) => {
	document.querySelector('.app-contenaire').classList.add('open-submenu')
	if(activeSubmenu === button.dataset.itemId) {
		document.querySelector('.app-contenaire').classList.remove('open-submenu')
		activeSubmenu = ''
		subButtonMenu.style.top = -100+'px'
		return
	}

	if(activeSubmenu !== button.dataset.itemId) activeSubmenu = button.dataset.itemId
 
	request(`${button.href}`, {}, true)
	.then((res) => {
		console.log(res)
		let html = ''
		document.getElementById('app-contenaire-all-plugin-buttons').innerHTML = ''
		res.forEach((i) => {
			html += `<li>
			  <a href="${i.url}" data-update="embed">
			    <span class="icon">${i.icon ?? ''}</span>
			    <span class="text">${i.name}</span>
			  </a>
			</li>`

			//document.getElementById('app-contenaire-all-plugin-buttons').appendChild(li)
		})
		document.getElementById('app-contenaire-all-plugin-buttons').innerHTML = html
		loadButtonNotLocation()
	})
	//console.log(cal, button.offsetTop, subButtonMenu.offsetHeight, subButtonMenu.offsetHeight)
}
const fetchedContentParser = (event, button) => {
	event.preventDefault()
	document.querySelector('.app-contenaire').classList.remove('open-submenu')
	activeSubmenu = ''

	if(button.dataset.update === 'submenu') {
		loadSubmenu(button)
		return
	}

	if(button.dataset.update !== 'embed') return

	request(button.href ?? '/')
	.then((htmlStr) => {
		const parser = new DOMParser();
		const newDocument = parser.parseFromString(htmlStr, "text/html");

		history.pushState({}, newDocument.title, button.href);

		let htmlInner = newDocument.querySelector('html').innerHTML
		console.log(newDocument.getElementById('app-sid-embed-contenaire'))
		//if(newDocument.querySelector('main')) htmlInner = newDocument.querySelector('main').innerHTML
		if(newDocument.getElementById('app-sid-embed-contenaire')) htmlInner = newDocument.getElementById('app-sid-embed-contenaire').innerHTML
		//htmlInner = newDocument.getElementById('app-sid-embed-contenaire').innerHTML

		if(!htmlInner) document.location = button.href

		document.getElementById('app-sid-embed-contenaire').innerHTML = htmlInner

		if(document.getElementById('nodejs-app-name-title')) document.getElementById('nodejs-app-name-title').textContent = newDocument.title
		
		loadButtonNotLocation()
	})
}

const loadButtonNotLocation = () => {
	document.querySelectorAll('a').forEach((button) => {
		if(button.dataset.rooter == 'not') return
		if(button.classList.contains('event')) return
		button.classList.add('event')

		button.addEventListener('click', (event) => {fetchedContentParser(event, button)})
		if(button.classList.contains('button-header-menu')) {
			button.addEventListener('mouseover', () => {
				subButtonMenu.style.display = 'block'
				let cal = ((button.offsetHeight-subButtonMenu.offsetHeight)/2)+button.offsetTop

				subButtonMenu.style.top = cal+'px'
				subButtonMenu.textContent = button.dataset.name
			})
			button.addEventListener('mouseleave', () => {
				subButtonMenu.style.display = 'none'
			})
		}
	})
}

const loadPage = () => {
	request('/interface/config/apps.json', {}, true)
	.then((res) => {
		console.log(res)
		let html = ''
		res.forEach((i) => {
			let icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M355.08-140H200q-24.92 0-42.46-17.54T140-200v-155.08q41.08-5 70.54-34.15Q240-418.39 240-460t-29.46-70.77q-29.46-29.15-70.54-34.15V-720q0-24.92 17.54-42.46T200-780h160q5.39-38.15 33.42-62.92 28.04-24.77 66.58-24.77t66.58 24.77Q554.61-818.15 560-780h160q24.92 0 42.46 17.54T780-720v160q38.15 5.39 62.92 33.42 24.77 28.04 24.77 66.58t-24.77 66.58Q818.15-365.39 780-360v160q0 24.92-17.54 42.46T720-140H564.92q-5.38-43.08-35.15-71.54Q500-240 460-240t-69.77 28.46q-29.77 28.46-35.15 71.54ZM200-200h108.46q20.54-52.92 64.89-76.46Q417.69-300 460-300t86.65 23.54Q591-252.92 611.54-200H720v-217.69h49.23q18.38-2.31 28.42-14.85 10.04-12.54 10.04-27.46 0-14.92-10.04-27.46-10.04-12.54-28.42-14.85H720V-720H502.31v-49.23q-2.31-18.38-14.85-28.42-12.54-10.04-27.46-10.04-14.92 0-27.46 10.04-12.54 10.04-14.85 28.42V-720H200v109.54q45.54 18.85 72.77 59.88Q300-509.54 300-460q0 48.92-27.23 89.96Q245.54-329 200-309.54V-200Zm260-260Z"/></svg>'
			if(i.thumbnail) icon = `<img src="${i.thumbnail}">`
			if(i.icon) icon = i.icon

			html += `<li>
				<a class="icon button-header-menu" data-name="${i.name}" data-item-id="${i.id}" href="/api/navico?id=${i.id}" data-update="submenu">
					${icon}
				</a>
			</li>`//${i.icon}
			/* const li = document.createElement('li');
			const a = document.createElement('a');
			a.setAttribute('data-item-id', i.id);
			a.href = `/api/navico?id=${i.id}`;
			a.setAttribute('data-update', 'submenu');
			a.innerHTML = i.icon; // Attention : utiliser innerHTML si `i.icon` contient du HTML (ex: SVG)
			li.appendChild(a);

			document.querySelector('.shutter-menu ul.menu-plugins').appendChild(li) */
		})
		document.querySelector('ul.menu-plugins').innerHTML = html
		loadButtonNotLocation()
	})
}

window.onload = () => {
	setTimeout(() => {
		loadPage()
		document.querySelector('body').style.opacity = '1.0'
	}, 2000)
}