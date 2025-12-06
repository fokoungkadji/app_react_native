package com.azeooapp.flutter

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class FlutterModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "FlutterModule"
        const val FLUTTER_ACTIVITY_REQUEST_CODE = 1001
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun openFlutterView(userId: String, promise: Promise) {
        try {
            val activity: Activity? = reactContext.currentActivity
            if (activity == null) {
                promise.reject("ERROR", "Activity not available")
                return
            }

            val intent = Intent(activity, FlutterProfileActivity::class.java)
            intent.putExtra("user_id", userId)
            activity.startActivityForResult(intent, FLUTTER_ACTIVITY_REQUEST_CODE)

            promise.resolve("Flutter view opened with userId: $userId")
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to open Flutter view: ${e.message}")
        }
    }

    @ReactMethod
    fun updateUserId(userId: String, promise: Promise) {
        try {
            FlutterEngineManager.updateUserId(userId)

            promise.resolve("UserId updated to: $userId")
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update userId: ${e.message}")
        }
    }

    @ReactMethod
    fun getCurrentUserId(promise: Promise) {
        promise.resolve(FlutterEngineManager.getCurrentUserId())
    }

    @ReactMethod
    fun isFlutterReady(promise: Promise) {
        promise.resolve(FlutterEngineManager.getEngine() != null)
    }
}
