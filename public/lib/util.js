const generateData = function(data) {
  return Object.keys(data).map((key) => {
    if(data[key] === true) {
      return `${encodeURIComponent(key)}`;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
  }).join('&');
};
const util = {
	fetch(url, config) {
		config = config || {};
		let fetchConfig = {
			method: config.method || 'GET',
			credentials: 'same-origin',
		};
		let promise = null;
		if(config.data && ['GET', 'DELETE'].indexOf(fetchConfig.method) >= 0) {
			url += (url.indexOf('?')=== -1 ? '?' : '&') + generateData(config.data);
		}
		if(['POST', 'PUT', 'PATCH'].indexOf(config.method) >= 0) {
			if(window.FormData && config.data instanceof FormData) {
				fetchConfig = Object.assign(fetchConfig, {
					body: config.data,
					headers: {
						'X-Requested-With': 'XMLHttpRequest',
					}
				});
			} else {
				fetchConfig = Object.assign(fetchConfig, {
					headers: {
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
					body: JSON.stringify(config.data),
				});
			}
		}
		if(config.download) {
			fetchConfig.headers = {
				'Content-Type': 'text/csv; charset=UTF-8'
			};
		}
		const timer = new Promise((resolve, reject) => {
			setTimeout(function() {
				reject({
					message: 'netWorkError',
				});
			}, config.timeout || 10000);
		})
		promise = new Promise((resolve, reject) => {
			fetch(url, fetchConfig).then((response) => {
				const { status } = response;
				if(status >= 400) {
					return response.text().then((error = 'Unknown Error!') => Promise.reject(error));
				}
				return response.json();
			}).then((json) => {
				resolve(json);
			}, (error) => {
				reject(error);
			});
		});
		return Promise.race([promise, timer]);
	},
	formatNumber(number) {
		if(!number) {
			return null;
		}
		if(typeof number !== 'number') {
			number = Number(number);
		}
		if(number < 10000) {
			return number;
		}
		return number = (Math.round(number /1000) / 10).toFixed(1) + '万';
	}
};
export default util;