import langJson from './../assets/lang/fr.json';

export class Utils {
    lang = navigator.language;
    debounceTimer: any = [];

    constructor() { }

    setCookie(cname: string, cvalue: any, exdays: number) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname: string) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    translate(text: string, params?: object): string {
        if (params) {
            let value = langJson[text] && this.lang === 'fr' ? langJson[text] : text;
            Object.keys(params).forEach(element => {
                value = value.replace('$' + element + '$', params[element]);
            });
            return value
        } else {
            return langJson[text] ? langJson[text] : text
        }
    }

    randomNumber(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    debounce(func, arg, wait: number, debounceTimerKey: string | number) {
        if (this.debounceTimer[debounceTimerKey]) {
            clearTimeout(this.debounceTimer[debounceTimerKey]);
        }
        this.debounceTimer[debounceTimerKey] = setTimeout(() => {
            func(arg);
            this.debounceTimer[debounceTimerKey] = null;
        }, wait);
    };
}