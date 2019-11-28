
interface PixelConfig {
	id: {
		fb?: string
		ga?: string
	}
}

export default class Pixel {

	private is_init: number = 0
	static _ins: Pixel
	static get instance(): Pixel {
		return this._ins || new Pixel;
	}
	constructor() {
		Pixel._ins = this
	}

	init(config: PixelConfig) {
		this.is_init++
		if (this.is_init === 1) {
			if (config.id.fb) {
				(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
					if (f.fbq) return; n = f.fbq = function () {
						n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
					};
					if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
					n.queue = []; t = b.createElement(e); t.async = !0;
					t.src = v; s = b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t, s);
					const noscript = document.createElement('noscript')
					noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.id.fb}&ev=PageView&noscript=1" />`;
					document.body.appendChild(noscript);
				})(window, document, 'script',
					'https://connect.facebook.net/en_US/fbevents.js');
				window.fbq('init', config.id.fb);
				window.fbq('track', 'PageView');

				this.pixel = (function (pixel, facebook) {
					return function (name: string, param?: object) {
						pixel(name, param)
						facebook(name, param)
					}
				})(this.pixel, this.facebook)
			}


			if (config.id.ga) {
				(function (f, b, e, v, n, t?: any, s?: any) {
					t = b.createElement(e); t.async = !0;
					t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t, s);
				})(window, document, 'script',
					`https://www.googletagmanager.com/gtag/js?id=${config.id.ga}`);
				window.dataLayer = window.dataLayer || [];
				this.gtag('js', new Date());
				this.gtag('config', config.id.ga)

				this.pixel = (function (pixel, google) {
					return function (name: string, param?: object) {
						pixel(name, param)
						google(name, param)
					}
				})(this.pixel, this.google)
			}


		} else {
			console.error('program duplicate initation')
		}

	}

	private gtag: any = function () {
		window.dataLayer.push(arguments);
	}

	private facebook = (name: string, param?: any) => {
		window.fbq('track', name)
		console.info(`"${name}" has pixeled - facebook`)
	}

	private google = (name: string, param?: any) => {
		param ? this.gtag('event', name, param) : this.gtag('event', name)
		console.info(`"${name}" has pixeled - google`, param)
	}

	public pixel: (name: string, param?: object) => void = (name, param) => {
		if (!this.init) {
			console.error('program has not init completed')
		}
	}

}