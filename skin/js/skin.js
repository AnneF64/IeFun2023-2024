// Skin specific Javascript
if ("scImageMgr" in window) scImageMgr.fOverAlpha=.9;

// Dys activation Javascript
(function (){
	window.dysOptions = {
		pathRoot : "ide:root",
		pathContent : "ide:content",
		pathBtnParent : scPaLib.checkNode(".sco", document.body) ? "ide:header" : "ide:tools",
		pathPanelParent : "ide:document",
		ignoreFilter : ".hidden|.footnotes|.CodeMirror-static|script|noscript|object|.tooltip_ref|.bkSolResOut|.toolbar|.txt_mathtex_tl|.MathJax_Preview|.MathJax_SVG_Display"
	};
	var vScript = document.createElement('script')
	vScript.setAttribute("src", scServices.scLoad.resolveDestUri("/skin/dys/dys.js"))
	document.getElementsByTagName("head")[0].appendChild(vScript);
	var vCss = document.createElement("link")
	vCss.setAttribute("rel", "stylesheet")
	vCss.setAttribute("type", "text/css")
	vCss.setAttribute("href", scServices.scLoad.resolveDestUri("/skin/dys/dys.css"));
	document.getElementsByTagName("head")[0].appendChild(vCss);
})();