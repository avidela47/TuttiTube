package com.tuttitube.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

// Cast framework references removed to avoid automatic Cast behavior.

/**
 * Expose simple methods to JS under the name `Android` so existing JS code that calls
 * window.Android.openYouTube(...) or window.Android.sendToTv(...) will work when running
 * inside the app WebView.
 */
public class AndroidBridge {

    private final Activity activity;

    public AndroidBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void openYouTube(String query) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("vnd.youtube:search?query=" + Uri.encode(query)));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
        } catch (Exception e) {
            // fallback to web
            try {
                Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/results?search_query=" + Uri.encode(query)));
                web.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(web);
            } catch (Exception ex) {
                // ignore
            }
        }
    }

    @JavascriptInterface
    public void sendToTv(String query) {
        // Funcionalidad de "Enviar a TV" deshabilitada. No se abrirán ajustes ni navegadores.
        try {
            Toast.makeText(activity, "Funcionalidad 'Enviar a TV' no disponible.", Toast.LENGTH_SHORT).show();
        } catch (Exception ex) {
            // ignore
        }
    }
}
