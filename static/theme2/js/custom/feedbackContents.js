function openFeedbackModal(embedUrl, options) {
    // Overlay
    var overlay = document.createElement("div");
    overlay.id = "fb-popup-overlay";
    overlay.style.cssText =
        "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);" +
        "z-index:99999;display:flex;align-items:center;justify-content:center;";

    // Modal — no header chrome; the embedded feedback page renders its own header.
    var modal = document.createElement("div");
    modal.style.cssText =
        "background:#fff;border-radius:16px;width:92%;max-width:560px;height:85vh;" +
        "display:flex;flex-direction:column;box-shadow:0 25px 50px rgba(0,0,0,0.2);" +
        "overflow:hidden;position:relative;";

    // Loader
    var loader = document.createElement("div");
    loader.id = "fb-popup-loader";
    loader.style.cssText =
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" +
        "font-size:14px;color:#6b7280;";
    loader.textContent = "Loading feedback form...";

    // Iframe
    var iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.style.cssText = "flex:1;border:none;width:100%;";
    iframe.onload = function () {
        var el = document.getElementById("fb-popup-loader");
        if (el) el.remove();
    };

    modal.appendChild(loader);
    modal.appendChild(iframe);

    // Send user context to iframe once it signals ready
    function sendFeedbackContext(event) {
        if (!event.data || event.data.type !== 'FEEDBACK_IFRAME_READY') return;
        iframe.contentWindow.postMessage({
            type: 'FEEDBACK_CONTEXT',
            userName: window.USER_FULL_NAME || '',
            userId: window.USER_ID || '',
            webhookData: window.FEEDBACK_WEBHOOK || {}
        }, '*');
    }
    window.addEventListener('message', sendFeedbackContext);

    // Click outside to close
    overlay.onclick = function (e) {
        if (e.target === overlay) {
            window.removeEventListener('message', sendFeedbackContext);
            closeFeedbackPopup();
        }
    };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // ESC to close
    document.addEventListener("keydown", handleFeedbackEscKey);
}

function openFeedbackInline(embedUrl, options) {
    var targetContainer = getFeedbackTargetContainer(options);
    if (!targetContainer) {
        console.warn("[Feedback] Inline render target not found. Falling back to modal.");
        openFeedbackModal(embedUrl, options);
        return;
    }

    var title = options.title || "Share Your Feedback";
    var wrapper = document.createElement("div");
    wrapper.id = "fb-inline-wrapper";
    wrapper.style.cssText =
        "background:#fff;width:100%;height:" + getFeedbackInlineHeight(options) + ";" +
        "display:flex;flex-direction:column;overflow:hidden;position:relative;";

    if (options.showHeader !== false) {
        // Match the standard app page header (app-page-title) used across the portal.
        var header = document.createElement("div");
        header.className = "app-page-title";
        header.style.cssText = "margin:0;flex-shrink:0;";
        header.innerHTML =
            '<div class="page-title-wrapper">' +
                '<div class="page-title-heading">' +
                    '<div class="page-title-icon">' +
                        '<img src="' + PATH_FOLDER_IMAGE2 + 'Icon/sidebar/FeedbackHeaderIcon.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;">' +
                    '</div>' +
                    '<div>' + title + '</div>' +
                '</div>' +
            '</div>';
        wrapper.appendChild(header);
    }

    var loader = document.createElement("div");
    loader.id = "fb-popup-loader";
    loader.style.cssText =
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" +
        "font-size:14px;color:#6b7280;z-index:1;";
    loader.textContent = "Loading feedback form...";

    var iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.style.cssText = "flex:1;border:none;width:100%;background:#fff;";
    iframe.onload = function () {
        var el = document.getElementById("fb-popup-loader");
        if (el) el.remove();
    };

    // Send user context to iframe once it signals ready
    window.addEventListener('message', function sendFeedbackContext(event) {
        if (!event.data || event.data.type !== 'FEEDBACK_IFRAME_READY') return;
        iframe.contentWindow.postMessage({
            type: 'FEEDBACK_CONTEXT',
            userName: window.USER_FULL_NAME || '',
            userId: window.USER_ID || '',
            webhookData: window.FEEDBACK_WEBHOOK || {}
        }, '*');
        window.removeEventListener('message', sendFeedbackContext);
    });

    wrapper.appendChild(loader);
    wrapper.appendChild(iframe);

    targetContainer.innerHTML = "";
    targetContainer.appendChild(wrapper);
}

// ==================== LOADING OVERLAY ====================
function showFeedbackLoader() {
    var existing = document.getElementById("fb-loading-overlay");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = "fb-loading-overlay";
    overlay.style.cssText =
        "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);" +
        "z-index:99999;display:flex;align-items:center;justify-content:center;";

    var spinner = document.createElement("div");
    spinner.style.cssText =
        "background:#fff;border-radius:12px;padding:24px 32px;" +
        "box-shadow:0 10px 30px rgba(0,0,0,0.15);text-align:center;";
    spinner.innerHTML = '<div style="font-size:14px;color:#374151;font-weight:500;">Preparing feedback form...</div>';

    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
}

