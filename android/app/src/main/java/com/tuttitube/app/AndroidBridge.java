package com.tuttitube.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaLoadRequestData;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;

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
        try {
            Context ctx = activity.getApplicationContext();
            CastContext castContext = CastContext.getSharedInstance(ctx);
            SessionManager sessionManager = castContext.getSessionManager();
            CastSession session = (CastSession) sessionManager.getCurrentCastSession();
            if (session != null && session.isConnected()) {
                String url = "https://www.youtube.com/results?search_query=" + Uri.encode(query);
                MediaInfo mediaInfo = new MediaInfo.Builder(url)
                        .setContentType("text/html")
                        .build();
                RemoteMediaClient remoteMediaClient = session.getRemoteMediaClient();
                if (remoteMediaClient != null) {
                    remoteMediaClient.load(new MediaLoadRequestData.Builder().setMediaInfo(mediaInfo).build());
                    return;
                }
            }
        } catch (Exception e) {
            // ignore and fallback
        }

        try {
            Intent intent = new Intent("android.settings.CAST_SETTINGS");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
            Toast.makeText(activity, "Seleccioná un dispositivo Cast y luego vuelve a intentar.", Toast.LENGTH_LONG).show();
        } catch (Exception ex) {
            try {
                Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/results?search_query=" + Uri.encode(query)));
                web.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(web);
            } catch (Exception exc) {
                // ignore
            }
        }
    }
}
