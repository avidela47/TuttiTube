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

// Cast framework references removed to avoid automatic Cast behavior.

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
        // Funcionalidad "Enviar a TV" deshabilitada intencionalmente.
        // No abrir ajustes de Cast ni lanzar APIs de casting.
        call.reject("Funcionalidad 'Enviar a TV' no disponible en esta build");
    }
}
