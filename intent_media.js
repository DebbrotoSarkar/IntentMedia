var intentMediaMixin = {
	data: function () {
		return {
			genericSearchParameters: {},
			intentMediaPropetyData: {
				hotel_city: "",
				hotel_country: "",
				hotel_room: "1",
				hotel_state: "",
				travel_date_end: "",
				travel_date_start: "",
				travelers: "2",
				referrer_source: common_info.intent_media.referrer_source,
				page_id: common_info.page_id,
				site_country: common_info.intent_media.site_country,
				site_currency: common_info.general.site_currency,
				site_name: common_info.intent_media.site_name,
				visitor_id: 'oztokentodo'
			}
		}
	},
	methods: {
		intentMediaDateFormat: function (date) {
			if (date) {
				if (/\d{4}\-\d{2}\-\d{2}/.test(date)) {
					return date.split('-').join('');
				}
				else if (/\d{2}\-\d{2}\-\d{4}/.test(date)) {
					var date_elements = date.split('-');
					if (typeof (date_elements[2]) !== "undefined") {
						if (date_elements[0].length === 4) {
							return date.split('-').join('');
						} else {
							date = date_elements[2] + '' + date_elements[0] + '' + date_elements[1];
						}
					}
				}
			}
			return '';
		},
		updateImParamsBasedOnSearchKeyword: function(keyword, callback) {
			try {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'address': keyword}, function (results, status) {
					if (typeof (results[0]) !== "undefined") {
						var address_components = results[0].address_components,
							country = '', region = '', place = '', type = null, long_name = '', short_name = '',
							extend_place = typeof (address_components[0].long_name) !== "undefined" ? address_components[0].long_name : "";

						for (var i = 0; i < address_components.length; i++) {
							type = address_components[i].types[0];
							long_name = address_components[i].long_name;
							short_name = address_components[i].short_name;

							if (!place && long_name) {
								switch (type) {
									case "establishment": // typically indicates a place that has not yet been categorized.
									case "locality": //matches against both locality and sublocality types.
										place = long_name;
										break;
								}
							}

							if (!region && short_name.length === 2 && type === "administrative_area_level_1") {
								region = short_name.toUpperCase();
							}

							if (!country && short_name && type === "country") {
								country = short_name;
							}
							// If no place name and region code are found from google geo data
							if (!place) {
								place = extend_place;
							}

							if (!region) {
								region = country;
							}
							if (void 0 !== IntentMediaProperties) {
								IntentMediaProperties.hotel_country = country ? country : '';
								IntentMediaProperties.hotel_state = region ? region : '';
								IntentMediaProperties.hotel_city = place ? place : '';
							}
						}
						callback();
					} else {
						callback();
					}
				});
			} catch (e) {
				callback()
			}
		},
        loadIntentMediaTag: function() {
			var script = document.createElement('script');			
            script.src = (common_info.intent_media.site_url.length > 0) ? common_info.intent_media.site_url : '//a.cdn.intentmedia.net/javascripts/v1/intent_media_core.js'; 
            script.async = true;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
	},
	mounted: function() {
        if(this.enableIntentMedia) {			
			this.intentMediaPropetyData.visitor_id = this.oz_u_token;
            window.IntentMediaProperties = this.intentMediaPropetyData;
		}		
	}
}