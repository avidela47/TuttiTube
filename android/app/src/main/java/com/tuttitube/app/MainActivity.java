package com.tuttitube.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
// Cast framework removed to avoid opening system Cast UI automatically during app startup
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Cast initialization intentionally disabled to prevent automatic Cast dialogs.
		// If you need Cast support, re-enable the dependency and initialization deliberately.

		// Buscar el WebView en la jerarquía de vistas y añadir la interfaz JavaScript 'Android'
		try {
			View root = findViewById(android.R.id.content);
			WebView webView = findWebView(root);
			if (webView != null) {
				webView.addJavascriptInterface(new AndroidBridge(this), "Android");
				Log.i("AndroidBridge", "Android JS interface añadida al WebView");
			} else {
				Log.w("AndroidBridge", "WebView no encontrada - no se añadió interfaz JS");
			}
		} catch (Exception ex) {
			Log.w("AndroidBridge", "Error añadiendo interfaz JS: " + ex.getMessage());
		}
	}

	private WebView findWebView(View v) {
		if (v == null) return null;
		if (v instanceof WebView) return (WebView) v;
		if (v instanceof ViewGroup) {
			ViewGroup vg = (ViewGroup) v;
			for (int i = 0; i < vg.getChildCount(); i++) {
				WebView w = findWebView(vg.getChildAt(i));
				if (w != null) return w;
			}
		}
		return null;
	}
}
