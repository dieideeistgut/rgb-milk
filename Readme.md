# RGB-Milk
#### ionic frontend talking to rgp-pi server

This little thingy sends commands to a [rgb-pi](https://github.com/ryupold/rgb-pi) server. The screenshot should be clear:

![RGB-Milk Screenshot](screen1.png?raw=true "RGB-Milk Screenshot")

![RGB-Milk Screenshot](screen2.png?raw=true "RGB-Milk Screenshot")

---

~~Everything is buggy and alpha. IOS Build runs though - just not sending commands because i
think i didn't use Angular calls but jQuery ones. Yes that's cheap n buggy but makes me
able to use it locally on my raspberry to control my lightbars for the moment. Will be fixed.~~

* Changed stuff to use angular calls
* Changed stuff to look useable
* Changed localStorage methods so they become persistent on device
* Added X-Origin stuff so it acually works
* Updated images
* Massive log-changes so debugging works with at least a bit of sense
* Dim-Value now saved
* Target-Value actually saved

---

Ideas and such from:

* [ryupold/rgb-pi](https://github.com/ryupold/rgb-pi)
* [BenjaminDieter/rgb-pi-client-ionic](https://github.com/BenjaminDieter/rgb-pi-client-ionic)
* [BenjaminDieter/rgb-pi-js](https://github.com/BenjaminDieter/rgb-pi-js)
* [BenjaminDieter/rgb-pi-client-ionic](https://github.com/BenjaminDieter/rgb-pi-client-ionic)

---

Please don't sue me for my cheap JS code. It's my first ionic project. Thanks.