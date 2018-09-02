export enum ApiLocale {
    EnglishUS = 'en_US',
    SpanishMX = 'es_MX',
    PortugueseBR = 'pt_BR',
    Korean = 'ko_KR',
    TranditionalChinese = 'zn_TW',
}

export enum Host {
    US = 'https://us.api.battle.net/',
    Korea = 'https://kr.api.battle.net/',
    Taiwan = 'https://tw.api.battle.net/',
}

export class DataResource {

    static getHost(locale: ApiLocale) {
        switch (locale) {
            case ApiLocale.EnglishUS: return Host.US;
            case ApiLocale.SpanishMX: return Host.US;
            case ApiLocale.PortugueseBR: return Host.US;
            case ApiLocale.Korean: return Host.Korea;
            case ApiLocale.TranditionalChinese: return Host.Taiwan;
        }
    }

    static getHostByLocale(host: Host, locale: ApiLocale) {
        if (DataResource.getHost(locale) === host) {
            return locale;
        }
        switch(host) {
            case Host.US: return ApiLocale.EnglishUS;
            case Host.Korea: return ApiLocale.Korean;
            case Host.Taiwan: return ApiLocale.TranditionalChinese;
        }
    }
}