package com.tuttitube.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.google.android.gms.cast.framework.CastContext;
import android.util.Log;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		try {
			// Initialize Cast context (best effort). Requires play-services-cast-framework in dependencies.
			CastContext.getSharedInstance(this);
		} catch (Exception e) {
			Log.w("CastInit", "CastContext init failed: " + e.getMessage());
		}
	}
}
