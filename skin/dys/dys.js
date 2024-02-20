var dys = {
	fStrings : {fr:[
			/*00*/ "Dys","Afficher / cacher les options Dys",
			/*02*/ "Police OpenDyslexic","Activer / desactiver l'usage de la police OpenDyslexic",
			/*04*/ "Lignes colorées","Activer / desactiver les lignes de textes en couleurs alternés",
			/*06*/ "Texte aéré","Activer / desactiver un plus grand espacement du texte",
			/*08*/ "-","Diminuer la taille de la police",
			/*10*/ "+","Augmenter la taille de la police",
			""],en:[
			/*00*/ "Dys","Show / hide the Dys options",
			/*02*/ "OpenDyslexic font","Activate / deactivate the usage of the OpenDyslexic font",
			/*04*/ "Colored lines","Activate / deactivate alernating line colors",
			/*06*/ "Extra-spaced text","Activate / deactivate greater line height and word spacing",
			/*08*/ "-","Diminish the font size",
			/*10*/ "+","Enlarge the font size",
			""],es:[
			/*00*/ "Dys","Mostrar / ocultar las opciones de Dys",
			/*02*/ "Fuente OpenDyslexic","Activar / desactivar el uso de la fuente OpenDyslexic",
			/*04*/ "Líneas de color","Activar / desactivar líneas de texto de color alterno",
			/*06*/ "Espaciado de texto","Activar / desactivar el espaciado de texto más grande",
			/*08*/ "-","Disminuir el tamaño de la fuente",
			/*10*/ "+","Aumentar el tamaño de la fuente",
			""],pt:[
			/*00*/ "Dys","Mostrar/ocultar as opções Dys",
			/*02*/ "Fonte OpenDyslexic","Ativar/desativar o uso da fonte OpenDyslexic",
			/*04*/ "Linhas coloridas","Ativar/desativar as linhas dos textos em cores alternadas",
			/*06*/ "Texto aerado","Ativar/desativar um espaçamento de texto mais importante",
			/*08*/ "-","Diminuir o tamanho da fonte",
			/*10*/ "+","Aumentar o tamanho da fonte",
			""],it:[
			/*00*/ "Dys","Mostrare/nascondere opzioni Dys",
			/*02*/ "OpenDyslexic font","Attivare/disattivare l'uso del fonte OpenDyslexic",
			/*04*/ "Linee colorate","Attivare/disattivare le righe di testo a colori alternati",
			/*06*/ "Testo ampio","Attivare/disattivare una maggiore spaziatura del testo",
			/*08*/ "-","Diminuisce dimensione carattere",
			/*10*/ "+","Aumenta dimensione carattere",
			""]},
	fPanelActive : false,
	fFontActive : false,
	fFontSize : 100,
	fAltLineColor : false,

	init : function(pOptions) {
		var vLang = document.getElementsByTagName('html')[0].getAttribute('lang');
		if (this.fStrings[vLang]) this.fStrings = this.fStrings[vLang];
		else this.fStrings = this.fStrings.en;
		this.fStore = new LocalStore();
		if (pOptions) this.fOptions = pOptions;
		this.fBody = scPaLib.findNode("bod:");
		this.fRoot = scPaLib.findNode(this.fOptions.pathRoot);
		this.fContent = scPaLib.findNode(this.fOptions.pathContent);
		this.xBuildUi();

		if (this.fStore.get("dysPanelActive")=="true") this.xTogglePanel(scPaLib.findNode("des:a.dysBtnTogglePanel"));
		if (this.fStore.get("dysFontActive")=="true") this.xToggleFont(scPaLib.findNode("des:a.dysBtnToggleFont"));
		if (this.fStore.get("dysAltLineColor")=="true") this.xToggleAltLineColor(scPaLib.findNode("des:a.dysBtnToggleAltLineColor"));
		if (this.fStore.get("dysMoreSpace")=="true") this.xToggleMoreSpace(scPaLib.findNode("des:a.dysBtnToggleMoreSpace"));
		if (this.fStore.get("dysFontSize")){
			this.fFontSize = new Number(this.fStore.get("dysFontSize"));
			this.fContent.style.fontSize = this.fFontSize + "%";
			if (scPaLib.findNode("des:span.dysFontSizer")) scPaLib.findNode("des:span.dysFontSizer").title = this.fFontSize + "%";
		}
		scOnLoads[scOnLoads.length] = this;
	},
	onLoad : function() {
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
	},

	/* === Private ============================================================== */
	xBuildUi : function() {
		var vBtnParent = scPaLib.findNode(this.fOptions.pathBtnParent);
		var vPanelParent = scPaLib.findNode(this.fOptions.pathPanelParent);
		if (!vBtnParent || !vPanelParent) return;
		this.addBtn(scDynUiMgr.addElement("div", vBtnParent,"dysBtnTogglePanel"), "", this.fStrings[0], this.fStrings[1]).onclick = function () {return dys.xTogglePanel(this)};
		var vPanel = scDynUiMgr.addElement("span", scDynUiMgr.addElement("div", vPanelParent, "dysPanel"));
		var vFontSizer = scDynUiMgr.addElement("span", vPanel, "dysFontSizer");
		this.addBtn(vFontSizer, "dysBtn dysBtnFontSmaller", this.fStrings[8], this.fStrings[9]).onclick = function () {return dys.xFontSmaller(this)};
		this.addBtn(vFontSizer, "dysBtn dysBtnFontLarger", this.fStrings[10], this.fStrings[11]).onclick = function () {return dys.xFontLarger(this)};
		this.addBtn(vPanel, "dysBtnCheck_false dysBtnToggleFont", this.fStrings[2], this.fStrings[3]).onclick = function () {return dys.xToggleFont(this)};
		this.addBtn(vPanel, "dysBtnCheck_false dysBtnToggleAltLineColor", this.fStrings[4], this.fStrings[5]).onclick = function () {return dys.xToggleAltLineColor(this)};
		this.addBtn(vPanel, "dysBtnCheck_false dysBtnToggleMoreSpace", this.fStrings[6], this.fStrings[7]).onclick = function () {return dys.xToggleMoreSpace(this)};
	},
	xAltLineColorInit : function() {
		var vTextNodes = [];
		var vIgnoreFilter = scPaLib.compileFilter(this.fOptions.ignoreFilter);
		var textNodeWalker = function (pNde){
			while (pNde){
				if (pNde.nodeType == 3) vTextNodes.push(pNde);
				else if (pNde.nodeType == 1 && !scPaLib.checkNode(vIgnoreFilter,pNde)) textNodeWalker(pNde.firstChild);
				pNde = pNde.nextSibling;
			}
		}
		textNodeWalker(this.fContent.firstChild);
		for (var i=0; i<vTextNodes.length; i++) {
			var vTextNode = vTextNodes[i];
			var vTextSplit = vTextNode.nodeValue.replace(/(\S+)/g, function(pWrd) {
				return '<span class="dysColor_">' + pWrd + '</span>';
			});
			var vHolder = scDynUiMgr.addElement("span", vTextNode.parentNode, null, vTextNode);
			vTextNode.parentNode.removeChild(vTextNode);
			vHolder.innerHTML = vTextSplit;
		}
		this.fAltLineColorSpans = scPaLib.findNodes("des:span.dysColor_", this.fContent);
		this.fAltLineColorInit = true;
		this.fAltLineLastColor=0;
		this.fAltLineLastVert=0;
		scSiLib.addRule(this.fRoot, {
			onResizedAnc:function(pOwnerNode, pEvent){
				if(pEvent.phase==1 || pEvent.resizedNode == pOwnerNode) return;
				dys.xAltLineColorUpdate();
			},
			onResizedDes:function(pOwnerNode, pEvent){
				if(pEvent.phase==1) return;
				dys.xAltLineColorUpdate();
			},
			ruleSortKey : "checkAltLineColor"
		});
		this.xAltLineColorUpdate();
	},
	xAltLineColorUpdate : function() {
		var getY = function (pElt) {
			var vStopFilter = scPaLib.compileFilter("body");
			for (var vY=0; pElt!=null && !scPaLib.checkNode(vStopFilter,pElt); vY += pElt.offsetTop, pElt = pElt.offsetParent);
			return vY;
		}
		for (var i=0; i<this.fAltLineColorSpans.length; i++) {
			var vSpan = this.fAltLineColorSpans[i];
			var vCurrVert = getY(vSpan);
			if (this.fAltLineLastVert > vCurrVert+3 || this.fAltLineLastVert < vCurrVert-3) {
				this.fAltLineLastVert = vCurrVert;
				this.fAltLineLastColor = (this.fAltLineLastColor + 1) % 3;
			}
			this.switchClass(vSpan, "dysColor_", "dysColor_"+this.fAltLineLastColor, false, false);
		}
	},


	xTogglePanel : function(pBtn) {
		this.fPanelActive = !this.fPanelActive;
		this.switchClass(this.fBody, "dysPanelActive_"+!this.fPanelActive, "dysPanelActive_"+this.fPanelActive, true);
		this.fStore.set("dysPanelActive", this.fPanelActive);
		return false;
	},
	xToggleFont : function(pBtn) {
		this.fFontActive = !this.fFontActive;
		if (pBtn) this.switchClass(pBtn, "dysBtnCheck_"+!this.fFontActive, "dysBtnCheck_"+this.fFontActive);
		this.switchClass(this.fBody, "dysFontActive_"+!this.fFontActive, "dysFontActive_"+this.fFontActive, true);
		this.fStore.set("dysFontActive", this.fFontActive);
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		return false;
	},
	xToggleAltLineColor : function(pBtn) {
		this.fAltLineColor = !this.fAltLineColor;
		if (!this.fAltLineColorInit) {
			/* TODO : remplacer le setTimeout par les lignes en commentaire en sc6.
						if ("mathjaxMgr" in window){
							if (mathjaxMgr.fActive) mathjaxMgr.register(function(){dys.xAltLineColorInit();});
							else dys.xAltLineColorInit();
						} else dys.xAltLineColorInit();
			*/
			setTimeout(() => {
				if (typeof MathJax != "undefined") {
					MathJax.Hub.Queue(function () {
						dys.xAltLineColorInit();
					});
				} else {
					dys.xAltLineColorInit();
				}
			}, 500);
		}
		if (pBtn) dys.switchClass(pBtn, "dysBtnCheck_"+!this.fAltLineColor, "dysBtnCheck_"+this.fAltLineColor);
		this.switchClass(this.fBody, "dysAltLineColor_"+!this.fAltLineColor, "dysAltLineColor_"+this.fAltLineColor, true);
		this.fStore.set("dysAltLineColor", this.fAltLineColor);
		return false;
	},
	xToggleMoreSpace : function(pBtn) {
		this.fMoreSpace = !this.fMoreSpace;
		if (pBtn) this.switchClass(pBtn, "dysBtnCheck_"+!this.fMoreSpace, "dysBtnCheck_"+this.fMoreSpace);
		this.switchClass(this.fBody, "dysMoreSpace_"+!this.fMoreSpace, "dysMoreSpace_"+this.fMoreSpace, true);
		this.fStore.set("dysMoreSpace", this.fMoreSpace);
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		return false;
	},
	xFontSmaller : function(pBtn) {
		this.fFontSize -= 10;
		this.fFontSize = Math.max(this.fFontSize, 50);
		this.fContent.style.fontSize = this.fFontSize + "%";
		this.fStore.set("dysFontSize", this.fFontSize);
		if (pBtn) pBtn.parentNode.title = this.fFontSize + "%";
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		return false;
	},
	xFontLarger : function(pBtn) {
		this.fFontSize += 10;
		this.fFontSize = Math.min(this.fFontSize, 200);
		this.fContent.style.fontSize = this.fFontSize + "%";
		this.fStore.set("dysFontSize", this.fFontSize);
		if (pBtn) pBtn.parentNode.title = this.fFontSize + "%";
		if (this.fAltLineColorInit) this.xAltLineColorUpdate();
		return false;
	},

	/* === Utilities ============================================================ */
	/** dys.addBtn : Add a HTML button to a parent node. */
	addBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = scDynUiMgr.addElement("a", pParent, pClassName, pNxtSib);
		vBtn.href = "#";
		vBtn.target = "_self";
		vBtn.setAttribute("role", "button");
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		vBtn.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
		vBtn.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
		return vBtn;
	},

	/** dys.switchClass - replace a class name. */
	switchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
		var vAddIfAbsent = typeof pAddIfAbsent == "undefined" ? false : pAddIfAbsent;
		var vMatchExact = typeof pMatchExact == "undefined" ? true : pMatchExact;
		var vClassName = pNode.className;
		var vReg = new RegExp("\\b"+pClassNew+"\\b");
		if (vMatchExact && vClassName.match(vReg)) return;
		var vClassFound = false;
		if (pClassOld && pClassOld != "") {
			if (vClassName.indexOf(pClassOld)==-1){
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew != '') pNode.className = vClassName + " " + pClassNew;
			} else {
				var vCurrentClasses = vClassName.split(' ');
				var vNewClasses = new Array();
				for (var i = 0, n = vCurrentClasses.length; i < n; i++) {
					var vCurrentClass = vCurrentClasses[i];
					if (vMatchExact && vCurrentClass != pClassOld || !vMatchExact && vCurrentClass.indexOf(pClassOld) < 0) {
						vNewClasses.push(vCurrentClasses[i]);
					} else {
						if (pClassNew && pClassNew != '') vNewClasses.push(pClassNew);
						vClassFound = true;
					}
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
		return vClassFound;
	},
	LocalStore : function(pId){
		if (pId && !/^[a-z][a-z0-9]+$/.exec(pId)) throw new Error("Invalid store name");
		this.fId = pId || "";
		this.fRootKey = document.location.pathname.substring(0,document.location.pathname.lastIndexOf("/")) +"/";
		if ("localStorage" in window && typeof window.localStorage != "undefined") {
			this.get = function(pKey) {var vRet = localStorage.getItem(this.fRootKey+this.xKey(pKey));return (typeof vRet == "string" ? unescape(vRet) : null)};
			this.set = function(pKey, pVal) {localStorage.setItem(this.fRootKey+this.xKey(pKey), escape(pVal))};
		} else if (window.ActiveXObject){
			this.get = function(pKey) {this.xLoad();return this.fIE.getAttribute(this.xEsc(pKey))};
			this.set = function(pKey, pVal) {this.fIE.setAttribute(this.xEsc(pKey), pVal);this.xSave()};
			this.xLoad = function() {this.fIE.load(this.fRootKey+this.fId)};
			this.xSave = function() {this.fIE.save(this.fRootKey+this.fId)};
			this.fIE=document.createElement('div');
			this.fIE.style.display='none';
			this.fIE.addBehavior('#default#userData');
			document.body.appendChild(this.fIE);
		} else {
			this.get = function(pKey){var vReg=new RegExp(this.xKey(pKey)+"=([^;]*)");var vArr=vReg.exec(document.cookie);if(vArr && vArr.length==2) return(unescape(vArr[1]));else return null};
			this.set = function(pKey,pVal){document.cookie = this.xKey(pKey)+"="+escape(pVal)};
		}
		this.xKey = function(pKey){return this.fId + this.xEsc(pKey)};
		this.xEsc = function(pStr){return "LS" + pStr.replace(/ /g, "_")};
	},
	loadSortKey : "ZZZZ"
}
dys.init(dysOptions);