package com.tuttitube.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.Capacitor;
import com.getcapacitor.Plugin;

import androidx.annotation.NonNull;

import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.Session;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.framework.SessionManagerListener;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaLoadRequestData;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;

@Plugin(name = "CastBridge")
public class CastBridge extends Plugin {

    @PluginMethod
    public void sendToTv(PluginCall call) {
        String query = call.getString("query");
        Activity activity = getActivity();
        Context ctx = getContext();
        if (query == null) {
            call.reject("query is required");
            return;
        }

        try {
            CastContext castContext = CastContext.getSharedInstance(ctx);
            SessionManager sessionManager = castContext.getSessionManager();
            CastSession session = (CastSession) sessionManager.getCurrentCastSession();
            if (session != null && session.isConnected()) {
                // Best-effort: load a YouTube search URL as web content on the receiver
                String url = "https://www.youtube.com/results?search_query=" + Uri.encode(query);
                MediaInfo mediaInfo = new MediaInfo.Builder(url)
                        .setContentType("text/html")
                        .build();
                RemoteMediaClient remoteMediaClient = session.getRemoteMediaClient();
                if (remoteMediaClient != null) {
                    remoteMediaClient.load(new MediaLoadRequestData.Builder().setMediaInfo(mediaInfo).build());
                    call.resolve();
                    return;
                }
            }
        } catch (Exception e) {
            // ignore and fallback
        }

        // Fallback: open Cast settings so user can select a device, then they can use the app's casting UI
        try {
            Intent intent = new Intent("android.settings.CAST_SETTINGS");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(intent);
            Toast.makeText(ctx, "Seleccioná un dispositivo Cast y luego vuelve a intentar.", Toast.LENGTH_LONG).show();
            call.resolve();
            return;
        } catch (Exception ex) {
            // As last resort, open YouTube search in browser (phone)
            Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/results?search_query=" + Uri.encode(query)));
            web.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(web);
            call.resolve();
            return;
        }
    }
}
