package com.tuttitube.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

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
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "CastBridge")
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
                // Try to find the first YouTube video for the query and load it on the receiver
                try {
                    String videoId = fetchFirstYouTubeVideoId(query);
                    if (videoId != null) {
                        String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
                        MediaInfo mediaInfo = new MediaInfo.Builder(videoUrl)
                                .setContentType("video/*")
                                .build();
                        RemoteMediaClient remoteMediaClient = session.getRemoteMediaClient();
                        if (remoteMediaClient != null) {
                            remoteMediaClient.load(new MediaLoadRequestData.Builder().setMediaInfo(mediaInfo).build());
                            call.resolve();
                            return;
                        }
                    }
                } catch (Exception e) {
                    // fallback to original web load below
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

    // Simple HTTP fetch to extract the first video id from YouTube search results page.
    // Best-effort: no API key required.
    private String fetchFirstYouTubeVideoId(String query) {
        HttpURLConnection conn = null;
        BufferedReader reader = null;
        try {
            String urlStr = "https://www.youtube.com/results?search_query=" + java.net.URLEncoder.encode(query, "UTF-8");
            URL url = new URL(urlStr);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Android)" );
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            String line;
            Pattern p = Pattern.compile("watch\\?v=([\\w-]{11})");
            while ((line = reader.readLine()) != null) {
                Matcher m = p.matcher(line);
                if (m.find()) {
                    return m.group(1);
                }
            }
        } catch (Exception e) {
            // ignore
        } finally {
            try { if (reader != null) reader.close(); } catch (Exception ignored) {}
            if (conn != null) conn.disconnect();
        }
        return null;
    }
}
