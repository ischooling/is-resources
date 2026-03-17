(function (global) {
	var NOTIFICATION_SETTINGS_API = "/api/crm/notification-settings";
	var NOTIFICATION_USERS_API = "/api/crm/notification-settings/users";
	var SETTINGS_PANEL_ID = "crmNotifySettingsPanel";
	var _settingsCache = {};
	var _settingsRequests = {};
	var _runtime = {};
	var _settingsPanelBound = false;
	var _speaking = false;
	var _queue = [];
	var _pendingVoiceQueue = []; // first interaction se pehle ki voices store hongi
	var _voiceUnlocked = false;
	var _sessionMuted = false;      // voice mute — page refresh tak band
	var _sessionSoundMuted = false; // sound mute — page refresh tak band
	var _activeUserId = "";
	var _activeRole = "";
	var _actx = null;
	var _selectedVoiceName = ""; // DB se load hoga — init ke baad

	if (typeof speechSynthesis !== "undefined") {
		speechSynthesis.getVoices();
		speechSynthesis.onvoiceschanged = function () { speechSynthesis.getVoices(); };
	}

	// ================================================================
	//  VOICE UNLOCK — page pe pehli click pe auto unlock
	// ================================================================
	function _doUnlock() {
		if (_voiceUnlocked) return;
		_voiceUnlocked = true;
		document.removeEventListener("click",      _doUnlock);
		document.removeEventListener("keydown",    _doUnlock);
		document.removeEventListener("touchstart", _doUnlock);
		if (typeof speechSynthesis === "undefined") return;
		// Silent utterance se speech engine warm up karo
		var u = new SpeechSynthesisUtterance("");
		u.volume = 0;
		speechSynthesis.speak(u);
	}
	document.addEventListener("click",      _doUnlock);
	document.addEventListener("keydown",    _doUnlock);
	document.addEventListener("touchstart", _doUnlock);

	function unlockVoice() {
		_doUnlock(); // manually bhi call kar sakte ho
	}

	// ================================================================
	//  VOICE SELECTOR
	// ================================================================
	function getAvailableVoices() {
		if (typeof speechSynthesis === "undefined") return [];
		return speechSynthesis.getVoices().map(function (v) {
			return { name: v.name, lang: v.lang, local: v.localService };
		});
	}

	function setVoiceName(name, saveToDb) {
		_selectedVoiceName = name || "";
		if (saveToDb !== false) {
			// DB mein save karo — GLOBAL (userId = "global")
			_requestJson(NOTIFICATION_SETTINGS_API + "/single", {
				method: "PATCH",
				body: JSON.stringify({ userId: "global", key: "VOICE_NAME", value: name || "" })
			}).catch(function (e) { console.warn("CRMNotify voice save error:", e.message); });
		}
	}

	function getVoiceName() {
		return _selectedVoiceName;
	}

	function testVoice(name) {
		if (typeof speechSynthesis === "undefined") return;
		speechSynthesis.cancel();
		var voices = speechSynthesis.getVoices();
		var voice  = voices.find(function (v) { return v.name === name; });
		var utter  = new SpeechSynthesisUtterance("Hello! This is a test of the selected voice.");
		if (voice) utter.voice = voice;
		utter.rate   = 0.95;
		utter.volume = 1.0;
		speechSynthesis.speak(utter);
	}

	// ================================================================
	//  HELPERS
	// ================================================================
	function _clone(obj) { return JSON.parse(JSON.stringify(obj)); }

	function _defaultSettings(userId) {
		return {
			userId: String(userId || ""),
			voiceEnabled: true,
			notificationEnabled: true,
			globalMute: false,
			alertPending: true,
			alertMeeting: true,
			alertFollowup: true,
			dndFrom: "",
			dndTo: ""
		};
	}

	function _normalizeSettings(userId, data) {
		var s = Object.assign(_defaultSettings(userId), data || {});
		s.userId              = String(userId || s.userId || "");
		s.voiceEnabled        = s.voiceEnabled        !== false;
		s.notificationEnabled = s.notificationEnabled !== false;
		s.globalMute          = s.globalMute          === true;
		s.alertPending        = s.alertPending        !== false;
		s.alertMeeting        = s.alertMeeting        !== false;
		s.alertFollowup       = s.alertFollowup       !== false;
		s.dndFrom             = s.dndFrom || "";
		s.dndTo               = s.dndTo   || "";
		return s;
	}

	function _buildApiUrl(apiUrl, params) {
		var sep   = apiUrl.indexOf("?") === -1 ? "?" : "&";
		var query = Object.keys(params || {}).filter(function (k) {
			return params[k] !== undefined && params[k] !== null && params[k] !== "";
		}).map(function (k) {
			return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
		}).join("&");
		return query ? apiUrl + sep + query : apiUrl;
	}

	function _requestJson(url, options) {
		var opts = options || {};
		opts.headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
		return fetch(url, opts).then(function (res) {
			if (!res.ok) throw new Error("Request failed: " + res.status);
			return res.json();
		});
	}

	// ================================================================
	//  SETTINGS CACHE
	// ================================================================
	function _cacheSettings(userId, settings) {
		var n = _normalizeSettings(userId, settings);
		_settingsCache[String(userId || n.userId || "")] = n;
		_syncSettingsPanel();
		return _clone(n);
	}

	function _getCachedSettings(userId) {
		var id = String(userId || _activeUserId || "");
		return _settingsCache[id] ? _settingsCache[id] : _defaultSettings(id);
	}

	function _fetchSettings(userId, forceRefresh) {
		var id = String(userId || _activeUserId || "");
		if (!id) return Promise.resolve(_defaultSettings(""));
		if (!forceRefresh && _settingsCache[id])    return Promise.resolve(_clone(_settingsCache[id]));
		if (!forceRefresh && _settingsRequests[id]) return _settingsRequests[id];
		_settingsRequests[id] = _requestJson(_buildApiUrl(NOTIFICATION_SETTINGS_API, { userId: id }))
			.then(function (data) { return _cacheSettings(id, data); })
			.catch(function (err) {
				console.warn("CRMNotify settings fetch error:", err.message);
				return _cacheSettings(id, _defaultSettings(id));
			})
			.finally(function () { delete _settingsRequests[id]; });
		return _settingsRequests[id];
	}

	function _saveSettings(settings) {
		var payload = _normalizeSettings(settings.userId, settings);
		return _requestJson(NOTIFICATION_SETTINGS_API, {
			method: "POST",
			body: JSON.stringify(payload)
		}).then(function (data) { return _cacheSettings(payload.userId, data); });
	}

	function _patchSetting(userId, key, value) {
		var id = String(userId || _activeUserId || "");
		return _requestJson(NOTIFICATION_SETTINGS_API + "/single", {
			method: "PATCH",
			body: JSON.stringify({ userId: id, key: key, value: value })
		}).then(function (data) { return _cacheSettings(id, data); });
	}

	// ================================================================
	//  DND CHECK
	// ================================================================
	function _timeToMinutes(hhmm) {
		var parts = String(hhmm || "").split(":");
		if (parts.length !== 2) return -1;
		return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
	}

	function _isInDndWindow(settings) {
		if (!settings || !settings.dndFrom || !settings.dndTo) return false;
		var now     = new Date();
		var current = _timeToMinutes(String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0"));
		var from    = _timeToMinutes(settings.dndFrom);
		var to      = _timeToMinutes(settings.dndTo);
		if (current < 0 || from < 0 || to < 0) return false;
		if (from === to) return true;
		if (from < to)   return current >= from && current < to;
		return current >= from || current < to;
	}

	function _isAlertAllowed(settings, type) {
		if (type === "pending")  return settings.alertPending  !== false;
		if (type === "meeting")  return settings.alertMeeting  !== false;
		if (type === "followup") return settings.alertFollowup !== false;
		return true;
	}

	function _canNotify(userId, type) {
		var s = _getCachedSettings(userId);
		if (s.notificationEnabled === false) return false;
		if (_isInDndWindow(s))               return false;
		return _isAlertAllowed(s, type);
	}

	function _canSpeak(userId, type) {
		if (_sessionMuted) return false;
		var s = _getCachedSettings(userId);
		if (!_canNotify(userId, type)) return false;
		if (s.globalMute === true)     return false;
		return s.voiceEnabled !== false;
	}

	// ================================================================
	//  VOICE ENGINE
	// ================================================================
	function _speakOrQueue(text, userId, type) {
		if (!text || !_canSpeak(userId, type)) return;
		if (_voiceUnlocked) {
			_speak(text, userId, type);
		} else {
			// Pehli click tak queue mein rakho
			_pendingVoiceQueue.push({ text: text, userId: userId, type: type });
			// Jab unlock ho — sab ek saath bolo
			var _waitAndFlush = setInterval(function () {
				if (!_voiceUnlocked) return;
				clearInterval(_waitAndFlush);
				var q = _pendingVoiceQueue.slice();
				_pendingVoiceQueue = [];
				q.forEach(function (item) {
					_speak(item.text, item.userId, item.type);
				});
			}, 200);
		}
	}

	function _speak(text, userId, type) {
		if (!text || !_canSpeak(userId, type) || typeof speechSynthesis === "undefined") return;
		// Resume AudioContext if suspended
		if (_actx && _actx.state === "suspended") _actx.resume();
		_queue.push(text);
		if (!_speaking) _nextSpeak();
	}

	function _nextSpeak() {
		if (!_queue.length) { _speaking = false; return; }
		_speaking = true;
		var text   = _queue.shift();
		var voices = speechSynthesis.getVoices();
		var voice;
		if (_selectedVoiceName) {
			// User ka chosen voice use karo
			voice = voices.find(function (v) { return v.name === _selectedVoiceName; });
		}
		if (!voice) {
			// Default — pehli English voice
			voice = voices.find(function (v) { return v.lang && v.lang.indexOf("en") === 0; }) || voices[0];
		}
		var utter    = new SpeechSynthesisUtterance(text);
		if (voice)   utter.voice  = voice;
		utter.rate   = 0.95;
		utter.volume = 1.0;
		utter.onend  = _nextSpeak;
		speechSynthesis.speak(utter);
	}

	function _clearVoiceQueue() {
		_queue             = [];
		_pendingVoiceQueue = [];
		_speaking          = false;
		if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
	}

	// ================================================================
	//  SOUND ENGINE
	// ================================================================
	function _audioContext() {
		if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
		if (_actx.state === "suspended") _actx.resume();
		return _actx;
	}

	function _playPattern(freqs, type, decay, gainValue) {
		try {
			var ctx = _audioContext();
			freqs.forEach(function (freq, i) {
				var osc  = ctx.createOscillator();
				var gain = ctx.createGain();
				osc.type = type;
				osc.connect(gain); gain.connect(ctx.destination);
				osc.frequency.value = freq;
				var t = ctx.currentTime + i * 0.15;
				gain.gain.setValueAtTime(gainValue, t);
				gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
				osc.start(t); osc.stop(t + decay);
			});
		} catch (e) { console.warn("CRMNotify audio error:", e.message); }
	}

	function _alertSound(userId, type) {
		if (_sessionSoundMuted) return;
		if (!_canNotify(userId, type)) return;
		_playPattern([800, 600, 800, 600], "sawtooth", 0.12, 0.28);
	}

	function _chime(userId, type) {
		if (_sessionSoundMuted) return;
		if (!_canNotify(userId, type)) return;
		_playPattern([523, 659, 784], "sine", 0.5, 0.6);
	}

	function _ding(userId, type) {
		if (_sessionSoundMuted) return;
		if (!_canNotify(userId, type)) return;
		try {
			var ctx  = _audioContext();
			var osc  = ctx.createOscillator();
			var gain = ctx.createGain();
			osc.connect(gain); gain.connect(ctx.destination);
			osc.frequency.setValueAtTime(880, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
			gain.gain.setValueAtTime(0.6, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
			osc.start(); osc.stop(ctx.currentTime + 0.6);
		} catch (e) { console.warn("CRMNotify ding error:", e.message); }
	}

	// ================================================================
	//  TOAST UI
	// ================================================================
	function _injectToastCss() {
		if (document.getElementById("crmNotifyToastCss")) return;
		var style = document.createElement("style");
		style.id = "crmNotifyToastCss";
		style.textContent = ""
			+ "#crm-wrap{position:fixed;top:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:999999;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}"
			+ ".crm-t{background:#1a1d2e;color:#e8e9ef;border-radius:14px;border-left:4px solid #888;box-shadow:0 8px 40px rgba(0,0,0,.55);min-width:300px;max-width:400px;padding:15px 17px;pointer-events:all;animation:tIn .35s cubic-bezier(.34,1.56,.64,1) both;position:relative;overflow:hidden}"
			+ ".t-pending{border-left-color:#f0c040}.t-urgent{border-left-color:#f87171}.t-meeting{border-left-color:#60b8e0}.t-started{border-left-color:#fb923c}.t-followup{border-left-color:#a78bfa}.t-new{border-left-color:#4caf80}"
			+ ".crm-h{display:flex;align-items:center;gap:9px;margin-bottom:5px}.crm-ic{font-size:1.2rem}.crm-ti{font-weight:700;font-size:.93rem;flex:1;line-height:1.3}.crm-cl{background:none;border:none;color:#555;cursor:pointer;font-size:1rem;padding:0}.crm-mute-btn{background:none;border:none;cursor:pointer;font-size:1rem;padding:0 4px;opacity:.8;transition:opacity .2s}.crm-mute-btn:hover{opacity:1}.crm-bd{font-size:.83rem;color:#9a9db0;line-height:1.55}.crm-vc{font-size:.72rem;color:#555a6e;margin-top:4px}"
			+ ".crm-bar{position:absolute;bottom:0;left:0;height:3px}.t-pending .crm-bar{background:#f0c040}.t-urgent .crm-bar{background:#f87171}.t-meeting .crm-bar{background:#60b8e0}.t-started .crm-bar{background:#fb923c}.t-followup .crm-bar{background:#a78bfa}.t-new .crm-bar{background:#4caf80}"
			+ "@keyframes tIn{from{opacity:0;transform:translateX(50px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}"
			+ "@keyframes tOut{from{opacity:1;max-height:160px}to{opacity:0;transform:translateX(50px);max-height:0;padding:0;margin:0}}"
			+ ".crm-t.t-out{animation:tOut .3s ease forwards}@keyframes tBar{from{width:100%}to{width:0%}}";
		document.head.appendChild(style);
	}

	function _toast(icon, title, body, cls, ms, voiceText, type, userId) {
		if (!_canNotify(userId, type)) return;
		_injectToastCss();
		var wrap = document.getElementById("crm-wrap");
		if (!wrap) { wrap = document.createElement("div"); wrap.id = "crm-wrap"; document.body.appendChild(wrap); }
		var el = document.createElement("div");
		el.className = "crm-t " + cls;
		var isSpeaking = !!(voiceText && _canSpeak(userId, type));
		el.innerHTML = ""
			+ "<div class=\"crm-h\">"
			+ "<span class=\"crm-ic\">" + icon + "</span>"
			+ "<span class=\"crm-ti\">" + title + "</span>"
			+ (isSpeaking ? "<button class=\"crm-mute-btn\" type=\"button\" title=\"Mute voice\">🔊</button>" : "")
			+ "<button class=\"crm-cl\" type=\"button\">✕</button>"
			+ "</div>"
			+ "<div class=\"crm-bd\">" + body + "</div>"
			+ (isSpeaking ? "<div class=\"crm-vc crm-vc-status\">🔊 Voice alert active</div>" : "")
			+ "<div class=\"crm-bar\" style=\"animation:tBar " + ms + "ms linear forwards\"></div>";
		el.querySelector(".crm-cl").addEventListener("click", function () { el.remove(); });
		var muteBtn = el.querySelector(".crm-mute-btn");
		if (muteBtn) {
			muteBtn.addEventListener("click", function () {
				// Session mute — page refresh tak saari voice + sound band
				_sessionMuted = true;
				_sessionSoundMuted = true;
				if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
				_queue = [];
				_pendingVoiceQueue = [];
				_speaking = false;
				muteBtn.textContent = "🔇";
				muteBtn.title = "Voice & sound muted (refresh to unmute)";
				var vc = el.querySelector(".crm-vc-status");
				if (vc) vc.textContent = "🔇 Muted — refresh to enable";
				// Saare existing toasts update karo
				document.querySelectorAll(".crm-mute-btn").forEach(function(btn) {
					btn.textContent = "🔇";
					btn.title = "Voice & sound muted (refresh to unmute)";
				});
				document.querySelectorAll(".crm-vc-status").forEach(function(el) {
					el.textContent = "🔇 Muted — refresh to enable";
				});
			});
		}
		wrap.appendChild(el);
		setTimeout(function () {
			el.classList.add("t-out");
			setTimeout(function () { el.remove(); }, 300);
		}, ms);
		var plain = body.replace(/<[^>]*>/g, "");
		if (typeof Notification !== "undefined") {
			if (Notification.permission === "granted") {
				new Notification(title, { body: plain });
			} else if (Notification.permission === "default") {
				Notification.requestPermission().then(function (p) {
					if (p === "granted") new Notification(title, { body: plain });
				});
			}
		}
		_speakOrQueue(voiceText, userId, type);
	}

	// ================================================================
	//  ALERT FUNCTIONS
	// ================================================================
	function _pendingAlert(userId, name, count) {
		if (count <= 0) return;
		_alertSound(userId, "pending");
		_toast(
			count >= 5 ? "🚨" : "⏳",
			name + ", you have " + count + " pending lead" + (count > 1 ? "s" : "") + "!",
			"Please follow up <b>immediately</b> to avoid losing these leads.",
			count >= 5 ? "t-urgent" : "t-pending", 10000,
			name + ", you have " + count + " pending lead" + (count > 1 ? "s" : "") + ". Please follow up immediately.",
			"pending", userId
		);
	}

	function _meetingAlert(userId, name, time, client, minsLeft) {
		var withClient = client ? " with " + client : "";
		if (minsLeft <= 0) {
			_alertSound(userId, "meeting");
			_toast("🔴", "Meeting Started!",
				"Your meeting" + (client ? " with <b>" + client + "</b>" : "") + " has started. Join now!",
				"t-started", 12000,
				name + ", your meeting" + withClient + " has started. Please join now.",
				"meeting", userId);
			return;
		}
		_ding(userId, "meeting");
		_toast("📅", "Meeting in " + minsLeft + " min — " + time,
			(client ? "With <b>" + client + "</b> • " : "") + "Starts at <b>" + time + "</b>",
			"t-meeting", 9000,
			name + ", your next meeting is at " + time + withClient + ". It starts in " + minsLeft + " minute" + (minsLeft > 1 ? "s" : "") + ".",
			"meeting", userId);
	}

	function _followupAlert(userId, name, leadName, leadId, since) {
		_chime(userId, "followup");
		_toast("📞", "Follow up with " + leadName + " now!",
			(leadId ? "Lead <b>#" + leadId + "</b> • " : "") + (since ? "Pending for <b>" + since + "</b>" : "Needs your attention"),
			"t-followup", 10000,
			name + ", please follow up with " + leadName + " now" + (since ? ". Pending for " + since : "") + ".",
			"followup", userId);
	}

	// ================================================================
	//  FETCH + ALERT
	// ================================================================
	function _fetchAndAlert(userId, apiUrl) {
		return _requestJson(_buildApiUrl(apiUrl, { userId: userId })).then(function (data) {
			var name      = data.counselorName || "User";
			var pending   = data.pendingLeads  || {};
			var meetings  = Array.isArray(data.meetings)  ? data.meetings  : [];
			var followups = Array.isArray(data.followups) ? data.followups : [];
			var delay = 300;
			if (pending.count > 0) {
				setTimeout(function () { _pendingAlert(userId, name, pending.count); }, delay);
				delay += 4500;
			}
			meetings.forEach(function (m) {
				setTimeout(function () { _meetingAlert(userId, name, m.time, m.clientName, m.minsLeft); }, delay);
				delay += 4500;
			});
			followups.forEach(function (f) {
				setTimeout(function () { _followupAlert(userId, name, f.leadName, f.leadId, f.pendingSince); }, delay);
				delay += 4500;
			});
		}).catch(function (err) { console.warn("CRMNotify fetch error:", err.message); });
	}

	function _startMeetingPoll(userId, apiUrl) {
		if (_runtime[userId] && _runtime[userId].meetingPollStarted) return;
		_runtime[userId] = _runtime[userId] || {};
		_runtime[userId].meetingPollStarted = true;
		var alerted = new Set();
		setInterval(function () {
			_fetchSettings(userId, true).then(function () {
				return _requestJson(_buildApiUrl(apiUrl, { userId: userId }));
			}).then(function (data) {
				var name     = data.counselorName || "User";
				var meetings = Array.isArray(data.meetings) ? data.meetings : [];
				meetings.forEach(function (m) {
					var key        = m.time + "-" + m.clientName;
					var startedKey = "started-" + key;
					// 5 min pehle alert
					if (m.minsLeft <= 5 && m.minsLeft > 0 && !alerted.has(key)) {
						alerted.add(key);
						_meetingAlert(userId, name, m.time, m.clientName, m.minsLeft);
						setTimeout(function () { alerted.delete(key); }, 2 * 60 * 60 * 1000);
					}
					// Meeting start / missed (0 se -30 min tak)
					if (m.minsLeft <= 0 && m.minsLeft >= -30 && !alerted.has(startedKey)) {
						alerted.add(startedKey);
						_meetingAlert(userId, name, m.time, m.clientName, 0);
					}
				});
			}).catch(function (err) { console.warn("CRMNotify meeting poll error:", err.message); });
		}, 60 * 1000);
	}

	function _fetchAdminSummary(userId, apiUrl) {
		return _requestJson(_buildApiUrl(apiUrl, { scope: "admin", userId: userId })).then(function (data) {
			var teamSummary = Array.isArray(data.teamSummary) ? data.teamSummary : [];
			var active      = teamSummary.filter(function (u) { return u.pending > 0; });
			if (!active.length || !_canNotify(userId, "pending")) return;
			_alertSound(userId, "pending");
			var voiceText = "Team update. " + active.map(function (u) {
				return u.name + " has " + u.pending + " pending leads";
			}).join(". ");

			_toast("📊", "Team Pending Leads Summary",
				active.map(function (u) { return "• " + u.name + " — " + u.pending + " pending"; }).join("<br>"),
				"t-urgent", 60000,
				null,
				"pending", userId);
			// Auto voice — turant queue karo, unlock hone pe bolegi
			_speakOrQueue(voiceText, userId, "pending");
		}).catch(function (err) { console.warn("CRMNotify admin summary error:", err.message); });
	}

	// ================================================================
	//  TIME GENERATOR
	// ================================================================
	function _generateTimes(everyMinutes, startHour, endHour) {
		var step  = everyMinutes || 180;
		var start = typeof startHour === "number" ? startHour : 9;
		var end   = typeof endHour   === "number" ? endHour   : 21;
		if (step <= 0) { console.warn("CRMNotify: everyMinutes must be > 0. Using 180."); step = 180; }
		var times = [];
		for (var min = start * 60; min <= end * 60; min += step) {
			times.push(String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"));
		}
		return times;
	}

	// ================================================================
	//  PUBLIC: init / initByRole
	// ================================================================
	function _fetchGlobalVoice() {
		return _requestJson(_buildApiUrl(NOTIFICATION_SETTINGS_API, { userId: "global" }))
			.then(function (data) {
				// NotificationSettingsDTO se voiceName field
				if (data && data.voiceName) {
					_selectedVoiceName = data.voiceName;
					console.log("CRMNotify voice loaded from DB:", _selectedVoiceName);
				}
			})
			.catch(function (e) {
				console.warn("CRMNotify: global voice fetch failed:", e.message);
			});
	}

	function init(config) {
		var userId = config && config.userId ? String(config.userId) : "";
		var apiUrl = (config && config.apiUrl) || "/api/crm/alerts";
		var times  = (config && Array.isArray(config.times)) ? config.times : _generateTimes();
		if (!userId) { console.warn("CRMNotify: userId required!"); return Promise.resolve(); }
		_activeUserId = userId;
		return Promise.all([_fetchSettings(userId, true), _fetchGlobalVoice()]).then(function () {
			_fetchAndAlert(userId, apiUrl);
			_startMeetingPoll(userId, apiUrl);
			if (_runtime[userId] && _runtime[userId].scheduledStarted) return;
			_runtime[userId] = _runtime[userId] || {};
			_runtime[userId].scheduledStarted = true;
			var fired = new Set();
			setInterval(function () {
				var now  = new Date();
				var hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
				if (times.indexOf(hhmm) !== -1 && !fired.has(hhmm)) {
					fired.add(hhmm);
					_fetchSettings(userId, true).then(function () { _fetchAndAlert(userId, apiUrl); });
					setTimeout(function () { fired.delete(hhmm); }, 61000);
				}
			}, 10000);
			console.log("CRMNotify ✅ userId=" + userId + " | Meeting poll: 1min | Times: " + times.length + " slots");
		});
	}

	function initByRole(config) {
		var userId = config && config.userId ? String(config.userId) : "";
		var role   = config && config.role   ? String(config.role).toUpperCase() : "";
		var apiUrl = (config && config.apiUrl) || "/api/crm/alerts";
		var times  = (config && Array.isArray(config.times)) ? config.times : _generateTimes();
		if (!userId) { console.warn("CRMNotify: userId required!"); return Promise.resolve(); }
		if (!role)   { console.warn("CRMNotify: role required!");   return Promise.resolve(); }
		_activeUserId = userId;
		_activeRole   = role;
		if (role === "COUNSELOR") return init({ userId: userId, apiUrl: apiUrl, times: times });
		if (role === "MANAGER")   return init({ userId: userId, apiUrl: _buildApiUrl(apiUrl, { scope: "team" }), times: times });
		if (role === "ADMIN") {
			return Promise.all([_fetchSettings(userId, true), _fetchGlobalVoice()]).then(function () {
				_fetchAdminSummary(userId, apiUrl);
				if (_runtime[userId] && _runtime[userId].adminScheduledStarted) return;
				_runtime[userId] = _runtime[userId] || {};
				_runtime[userId].adminScheduledStarted = true;
				var fired = new Set();
				setInterval(function () {
					var now  = new Date();
					var hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
					if (times.indexOf(hhmm) !== -1 && !fired.has(hhmm)) {
						fired.add(hhmm);
						_fetchSettings(userId, true).then(function () { _fetchAdminSummary(userId, apiUrl); });
						setTimeout(function () { fired.delete(hhmm); }, 61000);
					}
				}, 10000);
				console.log("CRMNotify ✅ ADMIN userId=" + userId);
			});
		}
		console.warn("CRMNotify: Unknown role \"" + role + "\". Use COUNSELOR | MANAGER | ADMIN");
		return Promise.resolve();
	}

	// ================================================================
	//  PUBLIC: newLead
	// ================================================================
	function newLead(leadId, leadName, source) {
		var userId = _activeUserId || "";
		if (!_canNotify(userId, "pending")) return;
		_chime(userId, "pending");
		_toast("👤", "New Lead — #" + leadId,
			"<b>" + leadName + "</b> via <b>" + (source || "Unknown") + "</b>",
			"t-new", 6000,
			"New lead received. " + leadName + " from " + (source || "Unknown") + ".",
			"pending", userId);
	}

	// ================================================================
	//  PUBLIC: CONTROLS
	// ================================================================
	function mute(userId) {
		var id = String(userId || _activeUserId || "");
		return _patchSetting(id, "MUTE", "true").then(function (data) { _clearVoiceQueue(); return data; });
	}
	function unmute(userId) {
		return _patchSetting(String(userId || _activeUserId || ""), "MUTE", "false");
	}
	function isMuted(userId) {
		return _getCachedSettings(userId).globalMute === true;
	}
	function setVoice(userId, enabled) {
		return _patchSetting(String(userId || _activeUserId || ""), "VOICE", enabled ? "true" : "false")
			.then(function (data) { if (!enabled) _clearVoiceQueue(); return data; });
	}
	function setNotifications(userId, enabled) {
		return _patchSetting(String(userId || _activeUserId || ""), "NOTIFICATION", enabled ? "true" : "false");
	}
	function setAlerts(userId, alerts) {
		var id = String(userId || _activeUserId || "");
		return _fetchSettings(id).then(function (current) {
			return _saveSettings(Object.assign({}, current, {
				userId:        id,
				alertPending:  alerts && alerts.pending  !== undefined ? alerts.pending  : current.alertPending,
				alertMeeting:  alerts && alerts.meeting  !== undefined ? alerts.meeting  : current.alertMeeting,
				alertFollowup: alerts && alerts.followup !== undefined ? alerts.followup : current.alertFollowup
			}));
		});
	}
	function setDND(userId, range) {
		var id   = String((arguments.length === 1 ? _activeUserId : userId) || "");
		var r    = arguments.length === 1 ? userId : range;
		var from = r && r.from ? r.from : "";
		var to   = r && r.to   ? r.to   : "";
		return _patchSetting(id, "DND_FROM", from).then(function () { return _patchSetting(id, "DND_TO", to); });
	}
	function clearDND(userId) {
		return setDND(String(userId || _activeUserId || ""), { from: "", to: "" });
	}
	function getSettings(userId) {
		return _fetchSettings(String(userId || _activeUserId || ""), true);
	}

	// ================================================================
	//  SETTINGS PANEL UI
	// ================================================================
	function _injectSettingsCss() {
		if (document.getElementById("crmNotifySettingsCss")) return;
		var style = document.createElement("style");
		style.id = "crmNotifySettingsCss";
		style.textContent = ""
			+ "#" + SETTINGS_PANEL_ID + "{background:#fff}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-section{background:#fff;border:1px solid #d9e4f2;border-radius:8px;padding:16px;margin-bottom:18px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-title{color:#1976D2;font-weight:700;font-size:14px;margin-bottom:12px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-helper{font-size:12px;color:#5f6b7a;margin-bottom:0}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap{width:360px;max-width:100%}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}"
			+ "#" + SETTINGS_PANEL_ID + " #crmNotifyVoiceTest,#" + SETTINGS_PANEL_ID + " #crmNotifyVoiceSave{min-width:96px}"
			+ "#" + SETTINGS_PANEL_ID + " .select2-container{max-width:100%}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap .select2-container{width:360px !important;max-width:100% !important}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap .select2-selection--single{height:38px;border:1px solid #ced4da;border-radius:4px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap .select2-selection__rendered{line-height:36px;padding-left:12px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap .select2-selection__arrow{height:36px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-table{margin-bottom:0;font-size:12px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-table thead th{background:#1976D2;color:#fff;vertical-align:middle;border-color:#1976D2}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-table td{vertical-align:middle;background:#fff}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-notify-actions .btn{min-width:34px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-toggle-wrap{display:flex;align-items:center;gap:10px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-empty-state{padding:12px;color:#6c7a89;text-align:center}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-status-pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;background:#e3f2fd;color:#1976D2;font-weight:600}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-switch{position:relative;display:inline-block;width:46px;height:24px;margin:0}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-switch input{opacity:0;width:0;height:0}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#cdd7e1;transition:.2s;border-radius:999px}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-slider:before{position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background:#fff;transition:.2s;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.18)}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-switch input:checked + .crm-slider{background:#1976D2}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-switch input:checked + .crm-slider:before{transform:translateX(22px)}"
			+ "#" + SETTINGS_PANEL_ID + " .crm-time-select{min-width:130px}"
			+ "@media(max-width:767px){#" + SETTINGS_PANEL_ID + " .crm-time-select{min-width:100%}#" + SETTINGS_PANEL_ID + " .crm-voice-row{align-items:stretch}#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap{width:100%}#" + SETTINGS_PANEL_ID + " .crm-voice-select-wrap .select2-container{width:100% !important}}";
		document.head.appendChild(style);
	}

	function _renderToggle(id, checked, dataAttrs) {
		var attrs = Object.keys(dataAttrs || {}).map(function (k) {
			return " data-" + k + "=\"" + dataAttrs[k] + "\"";
		}).join("");
		return "<label class=\"crm-switch\"><input type=\"checkbox\" id=\"" + id + "\" " + (checked ? "checked" : "") + attrs + "><span class=\"crm-slider\"></span></label>";
	}

	function _timeOptionsHtml() {
		return _generateTimes(30, 0, 23).map(function (t) {
			return "<option value=\"" + t + "\">" + t + "</option>";
		}).join("");
	}


	function _populateVoiceDropdown() {
		var sel = document.getElementById("crmNotifyVoiceSelect");
		if (!sel || typeof speechSynthesis === "undefined") return;
		var voices = speechSynthesis.getVoices();
		if (!voices.length) return;
		// Clear existing options except first
		while (sel.options.length > 1) sel.remove(1);
		voices.forEach(function (v) {
			var opt = document.createElement("option");
			opt.value = v.name;
			opt.textContent = v.name + " (" + v.lang + ")" + (v.localService ? " ★" : "");
			if (v.name === _selectedVoiceName) opt.selected = true;
			sel.appendChild(opt);
		});
		_initVoiceSearchableDropdown();
	}

	function _initVoiceSearchableDropdown() {
		var sel = document.getElementById("crmNotifyVoiceSelect");
		if (!sel || !window.jQuery || !jQuery.fn || !jQuery.fn.select2) return;
		var $sel = jQuery(sel);
		if ($sel.hasClass("select2-hidden-accessible")) {
			$sel.select2("destroy");
		}
		$sel.select2({
			theme: "bootstrap4",
			width: "100%",
			placeholder: "Search and select a voice",
			allowClear: true,
			dropdownParent: jQuery("#" + SETTINGS_PANEL_ID),
			matcher: function (params, data) {
				if (!params.term || !params.term.trim()) return data;
				if (!data.text) return null;
				var term = params.term.toLowerCase();
				var text = data.text.toLowerCase();
				return text.indexOf(term) > -1 ? data : null;
			}
		});
		if (_selectedVoiceName) {
			$sel.val(_selectedVoiceName).trigger("change.select2");
		} else {
			$sel.val("").trigger("change.select2");
		}
	}

	function _buildVoiceSelectorHtml() {
		if (typeof speechSynthesis === "undefined") return "";
		return "<div class=\"crm-notify-section\">"
			+ "<div class=\"crm-notify-title\">🎙️ Voice Selection</div>"
			+ "<p class=\"crm-notify-helper mb-3\">★ = Local voice (best quality). Change applies immediately.</p>"
			+ "<div class=\"crm-voice-row\">"
			+ "<div class=\"crm-voice-select-wrap\">"
			+ "<select class=\"form-control form-control-sm\" id=\"crmNotifyVoiceSelect\">"
			+ "<option value=\"\">-- Default English Voice --</option>"
			+ "</select>"
			+ "</div>"
			+ "<div class=\"crm-voice-actions\">"
			+ "<button type=\"button\" class=\"btn btn-sm btn-primary\" id=\"crmNotifyVoiceTest\">▶ Test</button>"
			+ "<button type=\"button\" class=\"btn btn-sm btn-success\" id=\"crmNotifyVoiceSave\">✔ Save</button>"
			+ "</div>"
			+ "</div>"
			+ "<div id=\"crmNotifyVoiceStatus\" style=\"font-size:11px;color:#1976D2;margin-top:6px\">"
			+ (_selectedVoiceName ? "✔ Saved: " + _selectedVoiceName : "Using default English voice")
			+ "</div>"
			+ "</div>";
	}

	function getSettingsPanelMarkup(userId) {
		_injectSettingsCss();
		return ""
			+ "<div id=\"" + SETTINGS_PANEL_ID + "\" data-user-id=\"" + String(userId || _activeUserId || "") + "\">"
			+ _buildVoiceSelectorHtml()
			+ "<div class=\"crm-notify-section\">"
			+ "<div class=\"crm-notify-title\">User-wise Voice Control</div>"
			+ "<p class=\"crm-notify-helper mb-3\">Each change is saved immediately in the database.</p>"
			+ "<div class=\"table-responsive\">"
			+ "<table class=\"table table-bordered table-striped crm-notify-table\">"
			+ "<thead><tr><th class=\"text-center\">Sr.no</th><th>User Name</th><th class=\"text-center\">Voice Alert</th><th class=\"text-center\">Notification</th></tr></thead>"
			+ "<tbody id=\"crmNotifyUsersTbody\"><tr><td colspan=\"4\" class=\"crm-empty-state\">Loading users...</td></tr></tbody>"
			+ "</table></div></div>"
			+ "</div>";
	}

	function _renderUsersTable(users, activeUserId) {
		var tbody = document.getElementById("crmNotifyUsersTbody");
		if (!tbody) return;
		if (!users.length) {
			tbody.innerHTML = "<tr><td colspan=\"4\" class=\"crm-empty-state\">No active users found.</td></tr>";
			return;
		}
		tbody.innerHTML = users.map(function (user, i) {
			var s = _normalizeSettings(user.userId, user.settings || {});
			_settingsCache[String(user.userId)] = s;
			var label = user.userName + (String(user.userId) === String(activeUserId) ? " <span class=\"crm-status-pill\">You</span>" : "");
			return "<tr>"
				+ "<td class=\"text-center\">" + (i + 1) + "</td>"
				+ "<td>" + label + "</td>"
				+ "<td class=\"text-center\">" + _renderToggle("crmNotifyVoice_" + user.userId, s.voiceEnabled !== false, { action: "voice", "user-id": user.userId }) + "</td>"
				+ "<td class=\"text-center\">" + _renderToggle("crmNotifyNotif_" + user.userId, s.notificationEnabled !== false, { action: "notifications", "user-id": user.userId }) + "</td>"
				+ "</tr>";
		}).join("");
	}

	function _renderDndRows(userId) {
		var tbody = document.getElementById("crmNotifyDndRows");
		if (!tbody) return;
		var s = _getCachedSettings(userId);
		tbody.innerHTML = (!s.dndFrom || !s.dndTo)
			? "<tr><td colspan=\"4\" class=\"crm-empty-state\">No DND time range saved.</td></tr>"
			: "<tr><td class=\"text-center\">2</td><td>" + s.dndFrom + "</td><td>" + s.dndTo + "</td>"
			  + "<td class=\"text-center crm-notify-actions\"><button type=\"button\" class=\"btn btn-sm btn-danger\" data-action=\"clear-dnd\"><i class=\"fa fa-trash\"></i></button></td></tr>";
	}

	function _syncCurrentUserToggles(userId) {
		var s = _getCachedSettings(userId);
		["crmNotifyGlobalMute","crmNotifyAlertPending","crmNotifyAlertMeeting","crmNotifyAlertFollowup"].forEach(function (id) {
			var el = document.getElementById(id);
			if (!el) return;
			if (id === "crmNotifyGlobalMute")    el.checked = s.globalMute    === true;
			if (id === "crmNotifyAlertPending")  el.checked = s.alertPending  !== false;
			if (id === "crmNotifyAlertMeeting")  el.checked = s.alertMeeting  !== false;
			if (id === "crmNotifyAlertFollowup") el.checked = s.alertFollowup !== false;
		});
		var dndFrom = document.getElementById("crmNotifyDndFrom");
		var dndTo   = document.getElementById("crmNotifyDndTo");
		if (dndFrom && s.dndFrom) dndFrom.value = s.dndFrom;
		if (dndTo   && s.dndTo)   dndTo.value   = s.dndTo;
		_renderDndRows(userId);
	}

	function _syncSettingsPanel() {
		var panel = document.getElementById(SETTINGS_PANEL_ID);
		if (!panel) return;
		_syncCurrentUserToggles(panel.getAttribute("data-user-id") || _activeUserId);
	}

	function _loadUsersIntoPanel(activeUserId, usersApiUrl) {
		return _requestJson(_buildApiUrl(usersApiUrl || NOTIFICATION_USERS_API, { userId: activeUserId })).then(function (data) {
			_renderUsersTable(Array.isArray(data.users) ? data.users : [], activeUserId);
		}).catch(function (err) {
			console.warn("CRMNotify users fetch error:", err.message);
			var tbody = document.getElementById("crmNotifyUsersTbody");
			if (tbody) tbody.innerHTML = "<tr><td colspan=\"4\" class=\"crm-empty-state\">Unable to load users.</td></tr>";
		});
	}

	function initSettingsPanel(config) {
		var panel = document.getElementById(SETTINGS_PANEL_ID);
		if (!panel) return;
		var userId      = String((config && config.userId) || panel.getAttribute("data-user-id") || _activeUserId || "");
		var usersApiUrl = (config && config.usersApiUrl) || NOTIFICATION_USERS_API;
		panel.setAttribute("data-user-id", userId);
		_activeUserId = _activeUserId || userId;
		_fetchSettings(userId, true).then(function () { _syncCurrentUserToggles(userId); });
		_loadUsersIntoPanel(userId, usersApiUrl);
		// Voice dropdown — voices load hone ke baad populate karo
		if (typeof speechSynthesis !== "undefined") {
			var _tryPopulate = function () {
				if (speechSynthesis.getVoices().length > 0) {
					_populateVoiceDropdown();
				} else {
					speechSynthesis.onvoiceschanged = function () {
						_populateVoiceDropdown();
					};
				}
			};
			_tryPopulate();
		}
		if (_settingsPanelBound) return;
		_settingsPanelBound = true;

		document.addEventListener("change", function (e) {
			var t  = e.target;
			var p  = document.getElementById(SETTINGS_PANEL_ID);
			if (!t || !p || !p.contains(t)) return;
			var action = t.getAttribute("data-action");
			var pid    = p.getAttribute("data-user-id") || _activeUserId;
			if (action === "global-mute")   { (t.checked ? mute : unmute)(pid); return; }
			if (action === "voice")         { setVoice(t.getAttribute("data-user-id"), t.checked); return; }
			if (action === "notifications") { setNotifications(t.getAttribute("data-user-id"), t.checked); return; }
			if (action === "alert-type")    { _patchSetting(pid, t.getAttribute("data-alert"), t.checked ? "true" : "false"); }
		});

		document.addEventListener("click", function (e) {
			var t  = e.target;
			var p  = document.getElementById(SETTINGS_PANEL_ID);
			if (!t || !p || !p.contains(t)) return;
			var btn = t.closest("button");
			if (!btn) return;
			var pid = p.getAttribute("data-user-id") || _activeUserId;
			if (btn.id === "crmNotifyAddDnd") {
				var from = document.getElementById("crmNotifyDndFrom").value;
				var to   = document.getElementById("crmNotifyDndTo").value;
				setDND(pid, { from: from, to: to });
				return;
			}
			if (btn.getAttribute("data-action") === "clear-dnd") { clearDND(pid); return; }

			// Voice test button
			if (btn.id === "crmNotifyVoiceTest") {
				var sel = document.getElementById("crmNotifyVoiceSelect");
				if (sel) testVoice(sel.value);
				return;
			}
			// Voice save button
			if (btn.id === "crmNotifyVoiceSave") {
				var sel = document.getElementById("crmNotifyVoiceSelect");
				if (sel) {
					setVoiceName(sel.value);
					var status = document.getElementById("crmNotifyVoiceStatus");
					if (status) {
						status.textContent = "Saving...";
						setTimeout(function () {
							status.textContent = sel.value
								? "✔ Saved globally: " + sel.value + " (all users will hear this voice)"
								: "✔ Reset to default English voice for all users";
						}, 600);
					}
					testVoice(sel.value);
				}
				return;
			}
		});
	}

	// ================================================================
	//  EXPORT
	// ================================================================
	global.CRMNotify = {
		init:                   init,
		unlockVoice:            unlockVoice,
		sessionMute:            function () {
			_sessionMuted = true;
			_sessionSoundMuted = true;
			if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
			_queue = [];
			_pendingVoiceQueue = [];
			_speaking = false;
			document.querySelectorAll(".crm-mute-btn").forEach(function(btn) {
				btn.textContent = "🔇";
				btn.title = "Voice & sound muted (refresh to unmute)";
			});
			document.querySelectorAll(".crm-vc-status").forEach(function(el) {
				el.textContent = "🔇 Muted — refresh to enable";
			});
		},
		sessionUnmute:          function () { _sessionMuted = false; _sessionSoundMuted = false; },
		isSessionMuted:         function () { return _sessionMuted; },
		initByRole:             initByRole,
		newLead:                newLead,
		generateTimes:          _generateTimes,
		mute:                   mute,
		unmute:                 unmute,
		isMuted:                isMuted,
		setVoice:               setVoice,
		setNotifications:       setNotifications,
		setAlerts:              setAlerts,
		setDND:                 setDND,
		clearDND:               clearDND,
		getSettings:            getSettings,
		getSettingsPanelMarkup: getSettingsPanelMarkup,
		initSettingsPanel:      initSettingsPanel,
		getAvailableVoices:     getAvailableVoices,
		setVoiceName:           setVoiceName,
		getVoiceName:           getVoiceName,
		testVoice:              testVoice
	};

})(window);
