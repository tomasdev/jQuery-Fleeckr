/* jQuery Fleeckr - 0.1.1
 * 
 * Github:        http://github.com/tomasdev/jQuery-Fleeckr
 * Documentation: http://jquery.tomasdev.com.ar/fleeckr/documentation.html
 * 
 * 2010 Tomas Roggero
 *
 * Creative Commons Attribution-ShareAlike 3.0 Unported License
 * Based on http://www.gethifi.com/blog/a-jquery-flickr-feed-plugin
 */

(function($) {
	$.fn.jfleeckr = function(settings, callback) {
		settings = $.extend(true, {
			flickr: 'http://api.flickr.com/services/',
			kind: 'rest',
			limit: 20,
			apikey: '',
			lang: 'en-us',
			format: 'json',
			jsoncallback: '?',
			method: 'flickr.panda.getPhotos',
			useTemplate: true,
			itemTemplate: '<div class="fleeckr-image"><a href="{{image_b}}" title="{{title}}"><img alt="{{title}}" src="{{image_s}}" /></a></div>',
			extra: 'panda_name=wang wang',
			itemCallback: function(){}
		}, settings);

		if(settings.apikey === ""){ return $(this).text('APIkey should be specified'); }
		
		var url = settings.flickr + settings.kind + '/?method=' + settings.method + '&format=' + settings.format + '&api_key=' + settings.apikey + '&per_page=' + settings.limit + '&' + settings.extra + '&extras=url_s+&jsoncallback=' + settings.jsoncallback;
		
		return $(this).each(function(){
			var $container = $(this).addClass("fleeckr-ed");
			var container = this;
			$.getJSON(url, function(data){
				if(data.stat == "ok"){
					var every = (settings.method == "flickr.photosets.getPhotos")?data.photoset:data.photos;
					var content = "";
					$.each(every.photo, function(i, item){
						if(i < settings.limit){
							item['url_s'] = (typeof item['url_s'] != "undefined")?item['url_s']:"http://farm"+item.farm+".static.flickr.com/"+item.server+"/"+item.id+"_"+item.secret+"_m.jpg";
							item['image_s'] = item['url_s'].replace('_m', '_s');
							item['image_t'] = item['url_s'].replace('_m', '_t');
							item['image_m'] = item['url_s'].replace('_m', '_m');
							item['image'] = item['url_s'].replace('_m', '');
							item['image_b'] = item['url_s'].replace('_m', '_b');
							if(settings.useTemplate){
								var template = settings.itemTemplate;
								for(var key in item){
									var rgx = new RegExp('{{' + key + '}}', 'g');
									template = template.replace(rgx, item[key]);
								}
								content += template;
							}
							settings.itemCallback.call(container, item);
						}
					});
					$container.append(content);
					if($.isFunction(callback)){
						callback.call(container, every);
					}
				}else{
					$container.text(data.message);
				}
			});
		});
	}
})(jQuery);
