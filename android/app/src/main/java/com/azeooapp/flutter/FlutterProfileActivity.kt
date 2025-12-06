package com.azeooapp.flutter

import android.content.Context
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class FlutterProfileActivity : FlutterActivity() {

    override fun provideFlutterEngine(context: Context): FlutterEngine? {
        return FlutterEngineManager.getEngine()
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        val userId = intent.getStringExtra("user_id") ?: "1"

        FlutterEngineManager.updateUserId(userId)
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}
